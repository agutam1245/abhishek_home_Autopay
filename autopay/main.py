import os
import re
import sqlite3
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode

from flask import Flask, jsonify, request, send_from_directory, session
from twilio.base.exceptions import TwilioException
from twilio.rest import Client


PROJECT_DIR = Path(__file__).resolve().parent
DATABASE_PATH = PROJECT_DIR / "users.db"
PAYMENT_VPA = "abhishekgtm@ybl"
PAYMENT_AMOUNT = "1.00"
REQUIRED_ENVIRONMENT = (
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_VERIFY_SERVICE_SID",
    "FLASK_SECRET_KEY",
)

app = Flask(
    __name__,
    static_folder=str(PROJECT_DIR / "static"),
    static_url_path="/static",
)
app.config.update(
    SECRET_KEY=os.environ.get("FLASK_SECRET_KEY"),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=os.environ.get("SESSION_COOKIE_SECURE", "").lower() == "true",
)


def configuration_is_ready():
    return all(os.environ.get(name) for name in REQUIRED_ENVIRONMENT)


def create_database():
    with closing(sqlite3.connect(DATABASE_PATH)) as connection:
        with connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    phone_number TEXT PRIMARY KEY,
                    created_at TEXT NOT NULL,
                    last_login_at TEXT NOT NULL
                )
                """
            )


def read_json_body():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return None, (jsonify(error="Send a JSON request body."), 400)
    return payload, None


def normalize_phone_number(value):
    if not isinstance(value, str):
        return None
    phone_number = re.sub(r"[\s()-]", "", value)
    if not re.fullmatch(r"\+[1-9]\d{7,14}", phone_number):
        return None
    return phone_number


def twilio_client():
    return Client(
        os.environ["TWILIO_ACCOUNT_SID"],
        os.environ["TWILIO_AUTH_TOKEN"],
    )


def unavailable_configuration():
    return jsonify(error="Twilio SMS sign-in is not configured on the server."), 503


@app.get("/")
def home():
    return send_from_directory(PROJECT_DIR, "index.html")


@app.get("/payment")
def payment_page():
    return send_from_directory(PROJECT_DIR, "payment.html")


@app.get("/api/payment-intent")
def create_payment_intent():
    parameters = urlencode(
        {
            "pa": PAYMENT_VPA,
            "am": PAYMENT_AMOUNT,
            "cu": "INR",
            "tn": "One-time payment",
        }
    )
    return jsonify(
        payee=PAYMENT_VPA,
        amount=PAYMENT_AMOUNT,
        currency="INR",
        upi_uri=f"upi://pay?{parameters}",
    )


@app.get("/api/session")
def get_session():
    if not configuration_is_ready():
        return jsonify(configured=False, authenticated=False)
    phone_number = session.get("phone_number")
    return jsonify(
        configured=True,
        authenticated=phone_number is not None,
        phone_number=phone_number,
    )


@app.post("/api/send-code")
def send_code():
    if not configuration_is_ready():
        return unavailable_configuration()
    payload, error_response = read_json_body()
    if error_response:
        return error_response
    phone_number = normalize_phone_number(payload.get("phone_number"))
    if phone_number is None:
        return jsonify(error="Enter a valid international phone number, such as +15551234567."), 400

    try:
        verification = (
            twilio_client()
            .verify.v2.services(os.environ["TWILIO_VERIFY_SERVICE_SID"])
            .verifications.create(to=phone_number, channel="sms")
        )
    except TwilioException:
        app.logger.exception("Twilio failed to send a verification code.")
        return jsonify(error="Could not send the SMS code. Check the Twilio setup and try again."), 502

    if verification.status != "pending":
        app.logger.error("Twilio returned unexpected verification status: %s", verification.status)
        return jsonify(error="The SMS code could not be sent. Please try again."), 502
    return jsonify(message="Verification code sent. Check your phone."), 200


@app.post("/api/verify-code")
def verify_code():
    if not configuration_is_ready():
        return unavailable_configuration()
    payload, error_response = read_json_body()
    if error_response:
        return error_response
    phone_number = normalize_phone_number(payload.get("phone_number"))
    code = payload.get("code")
    if phone_number is None:
        return jsonify(error="Enter a valid international phone number."), 400
    if not isinstance(code, str) or not re.fullmatch(r"\d{4,10}", code):
        return jsonify(error="Enter the verification code from your SMS."), 400

    try:
        check = (
            twilio_client()
            .verify.v2.services(os.environ["TWILIO_VERIFY_SERVICE_SID"])
            .verification_checks.create(to=phone_number, code=code)
        )
    except TwilioException:
        app.logger.exception("Twilio failed to verify an SMS code.")
        return jsonify(error="Could not verify the code. Check the Twilio setup and try again."), 502

    if check.status != "approved":
        return jsonify(error="That code is invalid or expired. Check it and try again."), 400

    timestamp = datetime.now(timezone.utc).isoformat()
    with closing(sqlite3.connect(DATABASE_PATH)) as connection:
        with connection:
            connection.execute(
                """
                INSERT INTO users (phone_number, created_at, last_login_at)
                VALUES (?, ?, ?)
                ON CONFLICT(phone_number) DO UPDATE SET last_login_at = excluded.last_login_at
                """,
                (phone_number, timestamp, timestamp),
            )
    session.clear()
    session["phone_number"] = phone_number
    return jsonify(phone_number=phone_number), 200


@app.post("/api/logout")
def logout():
    payload, error_response = read_json_body()
    if error_response:
        return error_response
    session.clear()
    return jsonify(message="Signed out."), 200


create_database()


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
