from pathlib import Path
from urllib.parse import urlencode

from flask import Flask, jsonify, send_from_directory


PROJECT_DIR = Path(__file__).resolve().parent
PAYMENT_VPA = "abhishekgtm@ybl"
PAYMENT_AMOUNT = "1.00"

app = Flask(
    __name__,
    static_folder=str(PROJECT_DIR / "static"),
    static_url_path="/static",
)


@app.get("/")
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


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
