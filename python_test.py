import calendar
import hmac
import json
import logging
import os
import threading
import time
from datetime import datetime, timezone
from typing import Optional
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urlsplit
from urllib.request import Request, urlopen
from uuid import uuid4

import firebase_admin
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.responses import HTMLResponse
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials as firebase_credentials
from firebase_admin import firestore
from firebase_admin.exceptions import FirebaseError
from dotenv import load_dotenv
from google import genai
from google.api_core.exceptions import GoogleAPICallError
from google.genai.errors import APIError
from pydantic import BaseModel, Field

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

app = FastAPI(title="Abhishek GPT")
logger = logging.getLogger(__name__)
MODEL_NAME = "gemini-3.5-flash-lite"
_firebase_app = None
_firebase_lock = threading.Lock()
_phonepe_token = None
_phonepe_token_expires_at = 0
_phonepe_token_lock = threading.Lock()
SYSTEM_INSTRUCTION = (
    "You are Abhishek GPT, a friendly and highly skilled English-language "
    "teacher. Teach English clearly and patiently. Correct the learner's "
    "grammar and word choice. When showing a corrected sentence, bold only "
    "the words that changed or were added using Markdown **bold**; keep "
    "unchanged words and explanations unbolded. Explain why, give natural "
    "examples, and adapt your explanations to their level. Encourage practice "
    "and ask a short follow-up question when useful."
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    previous_interaction_id: Optional[str] = Field(default=None, max_length=256)


def get_firebase_app():
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    with _firebase_lock:
        if _firebase_app is not None:
            return _firebase_app
        service_account_file = os.getenv("FIREBASE_SERVICE_ACCOUNT_FILE")
        service_account_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
        if not service_account_file and not service_account_json:
            raise HTTPException(
                status_code=503,
                detail="Firebase server credentials are not configured.",
            )
        try:
            if service_account_file:
                if not os.path.isabs(service_account_file):
                    service_account_file = os.path.join(
                        os.path.dirname(__file__),
                        service_account_file,
                    )
                credential = firebase_credentials.Certificate(service_account_file)
            else:
                service_account = json.loads(service_account_json)
                if not isinstance(service_account, dict):
                    raise ValueError("Firebase service account must be a JSON object.")
                credential = firebase_credentials.Certificate(service_account)
            _firebase_app = firebase_admin.initialize_app(credential)
        except (json.JSONDecodeError, OSError, ValueError) as exc:
            logger.exception("Firebase server credentials are invalid")
            raise HTTPException(
                status_code=503,
                detail="Firebase server credentials are invalid.",
            ) from exc
    return _firebase_app


def get_firestore_client():
    try:
        return firestore.client(app=get_firebase_app())
    except GoogleAPICallError as exc:
        logger.exception("Could not connect to Firestore")
        raise HTTPException(
            status_code=503,
            detail="Subscription storage is temporarily unavailable.",
        ) from exc


def get_current_user(authorization: Optional[str] = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Sign in with your phone number.")
    scheme, separator, token = authorization.partition(" ")
    if not separator or scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="A valid sign-in token is required.")

    try:
        return firebase_auth.verify_id_token(token, app=get_firebase_app())
    except firebase_auth.InvalidIdTokenError as exc:
        raise HTTPException(status_code=401, detail="Your sign-in has expired.") from exc
    except FirebaseError as exc:
        logger.exception("Firebase could not verify the sign-in token")
        raise HTTPException(
            status_code=503,
            detail="Sign-in verification is temporarily unavailable.",
        ) from exc


def get_phonepe_urls():
    environment = os.getenv("PHONEPE_ENV", "sandbox").lower()
    if environment == "sandbox":
        return (
            "https://api-preprod.phonepe.com/apis/pg-sandbox",
            "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
        )
    if environment == "production":
        return (
            "https://api.phonepe.com/apis/pg",
            "https://api.phonepe.com/apis/identity-manager/v1/oauth/token",
        )
    raise HTTPException(
        status_code=503,
        detail="PHONEPE_ENV must be set to 'sandbox' or 'production'.",
    )


def get_phonepe_access_token():
    global _phonepe_token, _phonepe_token_expires_at
    client_id = os.getenv("PHONEPE_CLIENT_ID")
    client_secret = os.getenv("PHONEPE_CLIENT_SECRET")
    client_version = os.getenv("PHONEPE_CLIENT_VERSION")
    if not client_id or not client_secret or not client_version:
        raise HTTPException(
            status_code=503,
            detail="PhonePe server credentials are not configured.",
        )

    _, token_url = get_phonepe_urls()
    with _phonepe_token_lock:
        if _phonepe_token and _phonepe_token_expires_at > time.time() + 60:
            return _phonepe_token

        request = Request(
            token_url,
            data=urlencode(
                {
                    "client_id": client_id,
                    "client_version": client_version,
                    "client_secret": client_secret,
                    "grant_type": "client_credentials",
                }
            ).encode("utf-8"),
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            method="POST",
        )
        try:
            with urlopen(request, timeout=20) as response:
                token_response = json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            logger.error("PhonePe token request failed with HTTP %s", exc.code)
            raise HTTPException(
                status_code=502,
                detail="PhonePe could not authenticate this payment request.",
            ) from exc
        except URLError as exc:
            logger.exception("PhonePe token service could not be reached")
            raise HTTPException(
                status_code=502,
                detail="PhonePe is temporarily unavailable.",
            ) from exc
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            logger.exception("PhonePe returned an invalid token response")
            raise HTTPException(
                status_code=502,
                detail="PhonePe returned an invalid authentication response.",
            ) from exc

        if not isinstance(token_response, dict):
            logger.error("PhonePe token response was not a JSON object")
            raise HTTPException(
                status_code=502,
                detail="PhonePe returned an invalid authentication response.",
            )
        access_token = token_response.get("access_token")
        expires_at = token_response.get("expires_at")
        if not isinstance(access_token, str) or not isinstance(expires_at, (int, float)):
            logger.error("PhonePe token response omitted required fields")
            raise HTTPException(
                status_code=502,
                detail="PhonePe returned an invalid authentication response.",
            )
        _phonepe_token = access_token
        _phonepe_token_expires_at = int(expires_at)
        return _phonepe_token


def phonepe_request(method: str, path: str, payload=None, allow_not_found: bool = False):
    api_base, _ = get_phonepe_urls()
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {"Authorization": f"O-Bearer {get_phonepe_access_token()}"}
    if body is not None:
        headers["Content-Type"] = "application/json"
    request = Request(
        f"{api_base}{path}",
        data=body,
        headers=headers,
        method=method,
    )
    try:
        with urlopen(request, timeout=20) as response:
            result = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        if allow_not_found and exc.code == 404:
            return None
        logger.error("PhonePe API request failed with HTTP %s", exc.code)
        raise HTTPException(
            status_code=502,
            detail="PhonePe could not complete the payment request.",
        ) from exc
    except URLError as exc:
        logger.exception("PhonePe API could not be reached")
        raise HTTPException(
            status_code=502,
            detail="PhonePe is temporarily unavailable.",
        ) from exc
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        logger.exception("PhonePe returned an invalid API response")
        raise HTTPException(
            status_code=502,
            detail="PhonePe returned an invalid payment response.",
        ) from exc

    if not isinstance(result, dict):
        logger.error("PhonePe API returned a non-object response")
        raise HTTPException(
            status_code=502,
            detail="PhonePe returned an invalid payment response.",
        )
    return result


def get_subscription_record(uid: str):
    try:
        snapshot = (
            get_firestore_client()
            .collection("subscriptions")
            .document(uid)
            .get()
        )
    except GoogleAPICallError as exc:
        logger.exception("Could not read the user's subscription")
        raise HTTPException(
            status_code=503,
            detail="Subscription storage is temporarily unavailable.",
        ) from exc
    return snapshot.to_dict() if snapshot.exists else None


def save_subscription_record(uid: str, values: dict):
    try:
        (
            get_firestore_client()
            .collection("subscriptions")
            .document(uid)
            .set(values, merge=True)
        )
    except GoogleAPICallError as exc:
        logger.exception("Could not save the user's subscription")
        raise HTTPException(
            status_code=503,
            detail="Subscription storage is temporarily unavailable.",
        ) from exc


def add_month_to_timestamp(timestamp_ms: int):
    date = datetime.fromtimestamp(timestamp_ms / 1000, tz=timezone.utc)
    month = date.month % 12 + 1
    year = date.year + (1 if date.month == 12 else 0)
    day = min(date.day, calendar.monthrange(year, month)[1])
    next_date = date.replace(year=year, month=month, day=day)
    return int(next_date.timestamp() * 1000)


def successful_payment_timestamp(payment_details):
    if not isinstance(payment_details, list):
        return None
    timestamps = [
        payment.get("timestamp")
        for payment in payment_details
        if isinstance(payment, dict)
        and payment.get("state") == "COMPLETED"
        and isinstance(payment.get("timestamp"), (int, float))
    ]
    return int(max(timestamps)) if timestamps else None


def refresh_subscription(uid: str):
    record = get_subscription_record(uid)
    if not record:
        return {"status": "not_subscribed"}

    checked_at = record.get("phonepe_checked_at", 0)
    now_ms = int(time.time() * 1000)
    paid_through_ms = record.get("paid_through_ms", 0)
    if (
        time.time() - checked_at < 15
        and (record.get("status") != "active" or paid_through_ms > now_ms)
    ):
        return {"status": record.get("status", "pending"),
                "paylink_url": record.get("paylink_url")}

    merchant_subscription_id = record.get("merchant_subscription_id")
    if not merchant_subscription_id:
        return {"status": "pending", "paylink_url": record.get("paylink_url")}

    if not record.get("setup_completed"):
        merchant_order_id = record.get("merchant_order_id")
        if not merchant_order_id:
            return {"status": "pending", "paylink_url": record.get("paylink_url")}
        order_status = phonepe_request(
            "GET",
            f"/paylinks/v1/{quote(merchant_order_id, safe='')}/status?details=false",
        )
        payment_flow = order_status.get("paymentFlow")
        subscription_details = order_status.get("subscriptionDetails")
        payment_details = order_status.get("paymentDetails")
        order_state = order_status.get("state")
        payment_timestamp = successful_payment_timestamp(payment_details)
        if (
            order_state == "COMPLETED"
            and isinstance(payment_flow, dict)
            and payment_flow.get("type") == "PAYLINK"
            and isinstance(subscription_details, dict)
            and subscription_details.get("state") == "ACTIVE"
            and subscription_details.get("merchantSubscriptionId")
            == merchant_subscription_id
            and payment_timestamp is not None
        ):
            record["setup_completed"] = True
            record["paid_through_ms"] = add_month_to_timestamp(payment_timestamp)
            record["next_notify_at_ms"] = record["paid_through_ms"] - 86400000
            record["billing_cycle"] = 1
        elif isinstance(order_state, str) and order_state.upper() in {
            "FAILED", "EXPIRED", "EXPIRE"
        }:
            record["status"] = "inactive"
            record["phonepe_checked_at"] = int(time.time())
            save_subscription_record(uid, record)
            return {"status": "inactive", "paylink_url": record.get("paylink_url")}
        else:
            record["status"] = "pending"
            record["phonepe_checked_at"] = int(time.time())
            save_subscription_record(uid, record)
            return {"status": "pending", "paylink_url": record.get("paylink_url")}

    subscription_status = phonepe_request(
        "GET",
        f"/checkout/v2/subscriptions/"
        f"{quote(merchant_subscription_id, safe='')}/status",
    )
    state = subscription_status.get("state")
    paid_through_ms = record.get("paid_through_ms", 0)
    status = (
        "active"
        if state == "ACTIVE" and isinstance(paid_through_ms, (int, float))
        and paid_through_ms > int(time.time() * 1000)
        else "inactive"
    )
    record["status"] = status
    record["phonepe_state"] = state
    record["phonepe_checked_at"] = int(time.time())
    save_subscription_record(uid, record)
    return {"status": status, "paylink_url": record.get("paylink_url")}


@app.get("/api/config")
def public_config():
    raw_config = os.getenv("FIREBASE_WEB_CONFIG_JSON")
    if not raw_config:
        raise HTTPException(
            status_code=503,
            detail="Firebase web configuration is not configured.",
        )
    try:
        config = json.loads(raw_config)
    except json.JSONDecodeError as exc:
        logger.exception("Firebase web configuration is invalid JSON")
        raise HTTPException(
            status_code=503,
            detail="Firebase web configuration is invalid.",
        ) from exc
    required_keys = ("apiKey", "authDomain", "projectId", "appId")
    if not isinstance(config, dict) or any(
        not isinstance(config.get(key), str) or not config[key]
        for key in required_keys
    ):
        raise HTTPException(
            status_code=503,
            detail="Firebase web configuration is missing required fields.",
        )
    return {key: config[key] for key in required_keys}


@app.get("/api/account")
def account(user: dict = Depends(get_current_user)):
    return refresh_subscription(user["uid"])


@app.post("/api/subscription/setup")
def setup_subscription(user: dict = Depends(get_current_user)):
    phone_number = user.get("phone_number")
    if not isinstance(phone_number, str) or not phone_number.startswith("+"):
        raise HTTPException(
            status_code=400,
            detail="A verified phone number is required to start a subscription.",
        )

    uid = user["uid"]
    existing = get_subscription_record(uid)
    if existing and existing.get("setup_completed"):
        status = refresh_subscription(uid)
        if status["status"] == "active":
            raise HTTPException(
                status_code=409,
                detail="Your subscription is already active.",
            )
        existing = get_subscription_record(uid) or existing
        if existing.get("phonepe_state") == "ACTIVE":
            raise HTTPException(
                status_code=409,
                detail=(
                    "Your UPI mandate is still active. Cancel it with your UPI app "
                    "before starting another subscription."
                ),
            )
    if (
        existing
        and existing.get("status") == "pending"
        and existing.get("paylink_url")
        and existing.get("link_expires_at", 0) > time.time()
    ):
        return {
            "status": "pending",
            "paylink_url": existing["paylink_url"],
        }

    merchant_order_id = f"mo_{uuid4().hex}"
    merchant_subscription_id = f"ms_{uuid4().hex}"
    response = phonepe_request(
        "POST",
        "/paylinks/v1/pay",
        {
            "merchantOrderId": merchant_order_id,
            "description": "Abhishek GPT monthly subscription",
            "currency": "INR",
            "amount": 100,
            "expireAt": 2592000,
            "paymentFlow": {
                "type": "SUBSCRIPTION_PAYLINK_SETUP",
                "customerDetails": {"phoneNumber": phone_number},
                "subscriptionDetails": {
                    "subscriptionType": "RECURRING",
                    "merchantSubscriptionId": merchant_subscription_id,
                    "authWorkflowType": "TRANSACTION",
                    "amountType": "FIXED",
                    "maxAmount": 100,
                    "productType": "UPI_MANDATE",
                    "frequency": "MONTHLY",
                },
            },
        },
    )
    paylink_url = response.get("paylinkUrl")
    parsed_paylink = urlsplit(paylink_url) if isinstance(paylink_url, str) else None
    trusted_host = bool(
        parsed_paylink
        and parsed_paylink.hostname
        and (
            parsed_paylink.hostname == "phon.pe"
            or parsed_paylink.hostname.endswith(".phon.pe")
            or parsed_paylink.hostname == "phonepe.com"
            or parsed_paylink.hostname.endswith(".phonepe.com")
        )
    )
    if (
        response.get("state") != "ACTIVE"
        or not parsed_paylink
        or parsed_paylink.scheme != "https"
        or not trusted_host
    ):
        logger.error("PhonePe did not return an active subscription paylink")
        raise HTTPException(
            status_code=502,
            detail="PhonePe did not create a subscription payment link.",
        )

    save_subscription_record(
        uid,
        {
            "status": "pending",
            "setup_completed": False,
            "merchant_order_id": merchant_order_id,
            "merchant_subscription_id": merchant_subscription_id,
            "paylink_url": paylink_url,
            "link_expires_at": int(time.time()) + 2592000,
            "phonepe_checked_at": 0,
            "created_at": int(time.time()),
        },
    )
    return {"status": "pending", "paylink_url": paylink_url}


@app.get("/api/subscription/status")
def subscription_status(user: dict = Depends(get_current_user)):
    return refresh_subscription(user["uid"])


@app.post("/api/internal/notify-renewals")
def notify_renewals(
    scheduler_secret: Optional[str] = Header(
        default=None,
        alias="X-Subscription-Scheduler-Secret",
    ),
):
    expected_secret = os.getenv("SUBSCRIPTION_SCHEDULER_SECRET")
    if not expected_secret:
        raise HTTPException(
            status_code=503,
            detail="Subscription scheduler authentication is not configured.",
        )
    if not scheduler_secret or not hmac.compare_digest(
        scheduler_secret,
        expected_secret,
    ):
        raise HTTPException(status_code=401, detail="Invalid scheduler credentials.")

    try:
        snapshots = list(get_firestore_client().collection("subscriptions").stream())
    except GoogleAPICallError as exc:
        logger.exception("Could not list subscriptions for renewal processing")
        raise HTTPException(
            status_code=503,
            detail="Subscription storage is temporarily unavailable.",
        ) from exc

    now_ms = int(time.time() * 1000)
    notifications_started = 0
    renewals_confirmed = 0
    subscriptions_checked = 0
    for snapshot in snapshots:
        record = snapshot.to_dict() or {}
        if (
            not record.get("setup_completed")
            or record.get("phonepe_state") != "ACTIVE"
        ):
            continue
        subscriptions_checked += 1
        uid = snapshot.id
        merchant_subscription_id = record.get("merchant_subscription_id")
        if not isinstance(merchant_subscription_id, str):
            continue

        pending_order_id = record.get("pending_redemption_order_id")
        if pending_order_id:
            order_status = phonepe_request(
                "GET",
                f"/checkout/v2/order/{quote(pending_order_id, safe='')}/status",
                allow_not_found=True,
            )
            if order_status is None:
                notification = phonepe_request(
                    "POST",
                    "/checkout/v2/subscriptions/notify",
                    {
                        "merchantOrderId": pending_order_id,
                        "amount": 100,
                        "paymentFlow": {
                            "type": "SUBSCRIPTION_CHECKOUT_REDEMPTION",
                            "merchantSubscriptionId": merchant_subscription_id,
                            "redemptionRetryStrategy": "STANDARD",
                            "autoDebit": True,
                        },
                    },
                )
                if notification.get("state") not in {
                    "NOTIFICATION_IN_PROGRESS",
                    "NOTIFIED",
                }:
                    logger.error("PhonePe did not accept a renewal notification")
                    raise HTTPException(
                        status_code=502,
                        detail="PhonePe did not accept a renewal notification.",
                    )
                record["renewal_state"] = notification["state"]
                save_subscription_record(uid, record)
                notifications_started += 1
                continue
            order_state = order_status.get("state")
            payment_timestamp = successful_payment_timestamp(
                order_status.get("paymentDetails")
            )
            if order_state == "COMPLETED" and payment_timestamp is not None:
                paid_through_ms = add_month_to_timestamp(payment_timestamp)
                record.update(
                    {
                        "paid_through_ms": paid_through_ms,
                        "next_notify_at_ms": paid_through_ms - 86400000,
                        "billing_cycle": record.get("billing_cycle", 1) + 1,
                        "status": "active",
                        "phonepe_checked_at": 0,
                        "pending_redemption_order_id": None,
                        "renewal_state": "paid",
                    }
                )
                save_subscription_record(uid, record)
                renewals_confirmed += 1
                continue
            if isinstance(order_state, str) and order_state.upper() in {
                "FAILED", "EXPIRED", "EXPIRE"
            }:
                record.update(
                    {
                        "pending_redemption_order_id": None,
                        "next_notify_at_ms": 0,
                        "renewal_state": "failed",
                    }
                )
                save_subscription_record(uid, record)
            continue

        next_notify_at_ms = record.get("next_notify_at_ms")
        paid_through_ms = record.get("paid_through_ms")
        if not isinstance(next_notify_at_ms, (int, float)):
            continue
        if now_ms < next_notify_at_ms:
            continue
        if not isinstance(paid_through_ms, (int, float)) or now_ms >= paid_through_ms:
            record.update(
                {
                    "next_notify_at_ms": 0,
                    "renewal_state": "missed_notification_window",
                }
            )
            save_subscription_record(uid, record)
            continue

        subscription_status = phonepe_request(
            "GET",
            f"/checkout/v2/subscriptions/"
            f"{quote(merchant_subscription_id, safe='')}/status",
        )
        if subscription_status.get("state") != "ACTIVE":
            record.update(
                {
                    "status": "inactive",
                    "phonepe_state": subscription_status.get("state"),
                    "next_notify_at_ms": 0,
                }
            )
            save_subscription_record(uid, record)
            continue

        billing_cycle = record.get("billing_cycle", 1)
        merchant_order_id = (
            f"renew_{merchant_subscription_id}_{billing_cycle}"
        )
        record.update(
            {
                "pending_redemption_order_id": merchant_order_id,
                "renewal_state": "creating",
            }
        )
        save_subscription_record(uid, record)
        notification = phonepe_request(
            "POST",
            "/checkout/v2/subscriptions/notify",
            {
                "merchantOrderId": merchant_order_id,
                "amount": 100,
                "paymentFlow": {
                    "type": "SUBSCRIPTION_CHECKOUT_REDEMPTION",
                    "merchantSubscriptionId": merchant_subscription_id,
                    "redemptionRetryStrategy": "STANDARD",
                    "autoDebit": True,
                },
            },
        )
        if notification.get("state") not in {
            "NOTIFICATION_IN_PROGRESS",
            "NOTIFIED",
        }:
            logger.error("PhonePe did not accept a renewal notification")
            raise HTTPException(
                status_code=502,
                detail="PhonePe did not accept a renewal notification.",
            )
        record.update(
            {
                "renewal_state": notification["state"],
            }
        )
        save_subscription_record(uid, record)
        notifications_started += 1

    return {
        "notifications_started": notifications_started,
        "renewals_confirmed": renewals_confirmed,
        "subscriptions_checked": subscriptions_checked,
    }


@app.get("/", response_class=HTMLResponse)
def chat_page():
    return """<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#211b54">
    <title>Abhishek English Tutor</title>
    <style>
        :root {
            color-scheme: light;
            --ink: #24213b;
            --muted: #77768d;
            --violet: #6858dc;
            --line: #eceaf5;
        }
        * { box-sizing: border-box; }
        html, body { width: 100%; height: 100%; margin: 0; }
        body {
            overflow: hidden;
            color: var(--ink);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
            background: #f5f4fb;
        }
        button, input { font: inherit; }
        button { cursor: pointer; }
        .app-shell {
            display: grid;
            grid-template-columns: 292px minmax(0, 1fr);
            width: 100%;
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
            background: #fff;
        }
        .sidebar {
            position: relative;
            display: flex;
            flex-direction: column;
            gap: 28px;
            overflow: hidden;
            padding: 28px 20px 20px;
            color: #f8f6ff;
            background:
                radial-gradient(ellipse at 12% 6%, #8a73ff55, transparent 38%),
                linear-gradient(160deg, #211b54 0%, #302574 58%, #4b328c 100%);
        }
        .sidebar::after {
            position: absolute;
            right: -85px;
            bottom: 60px;
            width: 220px;
            height: 220px;
            border: 1px solid #ffffff16;
            border-radius: 50%;
            content: "";
            box-shadow: 0 0 0 24px #ffffff08, 0 0 0 48px #ffffff05;
            pointer-events: none;
        }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-mark {
            display: grid;
            flex: 0 0 52px;
            width: 52px;
            height: 52px;
            place-items: center;
            border: 1px solid #ffffff45;
            border-radius: 17px;
            background: linear-gradient(145deg, #fff4c7, #f8c7ff 55%, #a9a0ff);
            box-shadow: 0 8px 22px #120d3b55;
        }
        .brand-mark svg { width: 35px; height: 35px; overflow: visible; }
        .spark-main { transform-origin: 24px 24px; animation: sparkle 2.2s ease-in-out infinite; }
        .spark-small { transform-origin: 38px 35px; animation: sparkle 1.8s ease-in-out .35s infinite; }
        @keyframes sparkle {
            0%, 100% { opacity: .65; transform: scale(.82) rotate(-8deg); }
            50% { opacity: 1; transform: scale(1.13) rotate(8deg); }
        }
        .brand-name { margin: 0; font-size: 1.12rem; font-weight: 750; letter-spacing: -.03em; }
        .brand-caption { margin: 4px 0 0; color: #d3cdfb; font-size: .68rem;
                         font-weight: 750; letter-spacing: .13em; text-transform: uppercase; }
        .sidebar-intro { margin-top: 4px; }
        .sidebar-intro h2 { margin: 0 0 8px; font-size: 1.32rem; line-height: 1.28; }
        .sidebar-intro p { margin: 0; color: #d3cef0; font-size: .88rem; line-height: 1.55; }
        .new-chat {
            width: 100%;
            padding: 12px 14px;
            border: 1px solid #ffffff47;
            border-radius: 12px;
            color: white;
            background: #ffffff12;
            text-align: left;
            transition: background .2s, transform .2s;
        }
        .new-chat:hover { transform: translateY(-1px); background: #ffffff20; }
        .plus { margin-right: 9px; font-size: 1.12rem; }
        .sidebar-label { margin: 0 0 10px; color: #bdb5ec; font-size: .68rem;
                         font-weight: 750; letter-spacing: .14em; text-transform: uppercase; }
        .lesson-list { display: grid; gap: 7px; }
        .lesson-button {
            width: 100%;
            padding: 10px 11px;
            border: 0;
            border-radius: 10px;
            color: #eeeaff;
            background: transparent;
            text-align: left;
            transition: background .2s;
        }
        .lesson-button:hover { background: #ffffff16; }
        .lesson-icon { display: inline-block; width: 25px; color: #d5c6ff; }
        .sidebar-footer { z-index: 1; margin-top: auto; padding-top: 16px;
                          border-top: 1px solid #ffffff26; color: #d3cef0; font-size: .78rem; }
        .online-dot { display: inline-block; width: 8px; height: 8px; margin-right: 7px;
                      border-radius: 50%; background: #79e1b5; box-shadow: 0 0 10px #79e1b599; }
        .chat-area { display: grid; min-width: 0; min-height: 0;
                     grid-template-rows: auto minmax(0, 1fr) auto; background: #fcfbff; }
        .topbar {
            display: flex;
            min-height: 76px;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 13px clamp(18px, 4vw, 52px);
            border-bottom: 1px solid var(--line);
            background: #ffffffeb;
        }
        .mobile-brand { display: none; align-items: center; gap: 10px; }
        .mobile-brand .brand-mark { width: 40px; height: 40px; flex-basis: 40px; border-radius: 13px; }
        .mobile-brand .brand-mark svg { width: 28px; height: 28px; }
        .mobile-name { margin: 0; font-size: .98rem; font-weight: 750; }
        .mobile-caption { margin: 2px 0 0; color: var(--muted); font-size: .7rem; }
        .topbar-status { display: flex; align-items: center; gap: 9px; color: var(--muted); font-size: .86rem; }
        .topbar-status .online-dot { background: #54c99a; }
        .new-chat-top {
            padding: 9px 13px;
            border: 1px solid #e6e2f1;
            border-radius: 10px;
            color: #514897;
            background: white;
            font-size: .86rem;
            font-weight: 650;
            transition: border-color .2s, background .2s;
        }
        .new-chat-top:hover { border-color: #b9b0ee; background: #f8f6ff; }
        .messages { min-height: 0; overflow-y: auto; scroll-behavior: smooth; }
        .conversation { width: min(900px, 100%); margin: 0 auto;
                        padding: clamp(26px, 5vh, 52px) clamp(18px, 5vw, 58px) 28px; }
        .welcome { margin: 0 0 28px 46px; }
        .welcome-kicker { margin: 0 0 10px; color: var(--violet); font-size: .7rem;
                          font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        .welcome h2 { max-width: 620px; margin: 0; color: #262044; font-size: clamp(1.8rem, 3.5vw, 2.7rem);
                      letter-spacing: -.055em; line-height: 1.08; }
        .welcome-copy { max-width: 600px; margin: 12px 0 0; color: var(--muted);
                        font-size: 1rem; line-height: 1.6; }
        .message-row { display: flex; align-items: flex-start; gap: 11px; margin: 16px 0; }
        .message-row.user { justify-content: flex-end; }
        .message-avatar {
            display: grid;
            flex: 0 0 34px;
            width: 34px;
            height: 34px;
            place-items: center;
            border: 1px solid #e4dff8;
            border-radius: 12px;
            color: #6554c7;
            background: linear-gradient(145deg, #fff5d5, #f3e5ff);
            font-size: 1.2rem;
        }
        .bubble {
            max-width: min(760px, 86%);
            padding: 14px 17px;
            border: 1px solid #eceaf3;
            border-radius: 5px 17px 17px 17px;
            color: #3a3850;
            background: white;
            box-shadow: 0 5px 18px #2c24500a;
            font-size: .96rem;
            line-height: 1.65;
            white-space: pre-wrap;
            overflow-wrap: anywhere;
        }
        .typing-indicator {
            display: flex;
            min-width: 64px;
            min-height: 46px;
            align-items: center;
            gap: 5px;
        }
        .typing-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #8173d4;
            opacity: .35;
            animation: typing-bounce 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: .16s; }
        .typing-dot:nth-child(3) { animation-delay: .32s; }
        @keyframes typing-bounce {
            0%, 60%, 100% { opacity: .35; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-4px); }
        }
        .message-row.user .bubble {
            border: 0;
            border-radius: 17px 5px 17px 17px;
            color: white;
            background: linear-gradient(135deg, #7564e8, #5749bf);
            box-shadow: 0 7px 20px #6555d62b;
        }
        .suggestion-heading { margin: 25px 0 11px 46px; color: var(--muted);
                              font-size: .8rem; font-weight: 650; }
        .suggestions { display: flex; flex-wrap: wrap; gap: 9px; margin-left: 46px; }
        .suggestion {
            padding: 10px 13px;
            border: 1px solid #e5e1f3;
            border-radius: 11px;
            color: #514892;
            background: white;
            font-size: .84rem;
            transition: border-color .2s, transform .2s, box-shadow .2s;
        }
        .suggestion:hover { transform: translateY(-2px); border-color: #b9b0ee;
                            box-shadow: 0 7px 16px #2c24500d; }
        .composer-area { padding: 14px clamp(16px, 4vw, 52px) 13px;
                         border-top: 1px solid var(--line); background: white; }
        .composer {
            display: flex;
            width: min(900px, 100%);
            align-items: center;
            gap: 10px;
            margin: 0 auto;
            padding: 7px 8px 7px 18px;
            border: 1px solid #e5e2ef;
            border-radius: 17px;
            background: #fff;
            box-shadow: 0 6px 24px #2c24500b;
            transition: border-color .2s, box-shadow .2s;
        }
        .composer:focus-within { border-color: #a99ded; box-shadow: 0 0 0 4px #7869df17; }
        #message { min-width: 0; flex: 1; padding: 10px 0; border: 0; outline: 0;
                   color: var(--ink); background: transparent; font-size: .96rem; }
        #message::placeholder { color: #a2a0b2; }
        #send {
            display: grid;
            flex: 0 0 44px;
            width: 44px;
            height: 44px;
            place-items: center;
            border: 0;
            border-radius: 13px;
            color: white;
            background: linear-gradient(140deg, #7968ed, #5143b7);
            box-shadow: 0 5px 12px #6555d640;
            transition: transform .2s, opacity .2s;
        }
        #send:hover:not(:disabled) { transform: translateY(-1px); }
        #send:disabled { cursor: wait; opacity: .58; }
        #send svg { width: 19px; height: 19px; }
        .privacy { margin: 9px auto 0; color: #9693a6; font-size: .72rem;
                   text-align: center; }
        button:focus-visible { outline: 3px solid #ab9ff0; outline-offset: 3px; }
        #app-shell[hidden] { display: none; }
        .access-gate {
            display: grid;
            min-height: 100vh;
            min-height: 100dvh;
            place-items: center;
            padding: 24px;
            background:
                radial-gradient(ellipse at 18% 8%, #dcd5ff 0, transparent 38%),
                linear-gradient(145deg, #f8f6ff, #efedf9);
        }
        .gate-card {
            width: min(460px, 100%);
            padding: clamp(24px, 6vw, 42px);
            border: 1px solid #ece9f5;
            border-radius: 24px;
            background: #fff;
            box-shadow: 0 24px 70px #31276018;
        }
        .gate-card h1 { margin: 24px 0 8px; color: #262044; font-size: 1.8rem; letter-spacing: -.04em; }
        .gate-copy { margin: 0 0 22px; color: var(--muted); line-height: 1.55; }
        .gate-label { display: block; margin: 15px 0 7px; color: #514892; font-size: .83rem; font-weight: 700; }
        .gate-input {
            width: 100%;
            min-height: 46px;
            padding: 10px 12px;
            border: 1px solid #e5e2ef;
            border-radius: 10px;
            color: var(--ink);
            background: white;
        }
        .gate-action {
            width: 100%;
            min-height: 46px;
            margin-top: 14px;
            border: 0;
            border-radius: 11px;
            color: white;
            background: linear-gradient(140deg, #7968ed, #5143b7);
            font-weight: 700;
        }
        .gate-action:disabled { cursor: wait; opacity: .58; }
        .gate-link {
            display: block;
            margin-top: 14px;
            color: #5849c3;
            font-weight: 700;
            text-align: center;
        }
        .gate-error { min-height: 1.4em; margin: 14px 0 0; color: #a13838; font-size: .86rem; }
        .gate-note { margin: 16px 0 0; color: #88859a; font-size: .76rem; line-height: 1.5; }
        .account-actions { display: flex; align-items: center; gap: 12px; }
        #signed-in-phone { color: var(--muted); font-size: .82rem; }
        #sign-out {
            padding: 8px 11px;
            border: 1px solid #e6e2f1;
            border-radius: 9px;
            color: #514897;
            background: white;
            font-size: .82rem;
        }
        @media (max-width: 760px) {
            .app-shell { grid-template-columns: minmax(0, 1fr); }
            .sidebar { display: none; }
            .mobile-brand { display: flex; }
            .topbar { min-height: 66px; padding: 10px 15px; }
            .topbar-status { display: none; }
            #signed-in-phone { display: none; }
            .conversation { padding: 28px 18px 22px; }
            .welcome { margin-left: 0; }
            .suggestion-heading, .suggestions { margin-left: 0; }
            .composer-area { padding: 11px 13px max(11px, env(safe-area-inset-bottom)); }
        }
        @media (max-width: 420px) {
            .welcome h2 { font-size: 1.8rem; }
            .bubble { max-width: 92%; padding: 12px 14px; font-size: .92rem; }
            .suggestion { padding: 9px 10px; font-size: .8rem; }
            .new-chat-top { padding: 8px 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important;
                                     animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
            .typing-dot { animation: none !important; opacity: .8; }
        }
    </style>
</head>
<body>
    <main id="access-gate" class="access-gate">
        <section class="gate-card" aria-labelledby="gate-title">
            <div class="brand">
                <div class="brand-mark" aria-hidden="true">
                    <svg viewBox="0 0 48 48" fill="none">
                        <path d="M24 5c2.8 12.1 5 14.3 17 17-12 2.7-14.2 4.9-17 17-2.8-12.1-5-14.3-17-17C19 19.3 21.2 17.1 24 5Z" fill="#6048C5"/>
                        <path d="M39 29c1.2 5.1 2.1 6 7 7-4.9 1-5.8 1.9-7 7-1.2-5.1-2.1-6-7-7 4.9-1 5.8-1.9 7-7Z" fill="#F5A33B"/>
                    </svg>
                </div>
                <div>
                    <p class="brand-name">Abhishek</p>
                    <p class="brand-caption">English Tutor</p>
                </div>
            </div>
            <h1 id="gate-title">Welcome to English practice</h1>
            <p id="gate-copy" class="gate-copy">Sign in with your phone number to continue.</p>
            <div id="sign-in-panel">
                <label class="gate-label" for="phone-number">Phone number</label>
                <input id="phone-number" class="gate-input" type="tel" autocomplete="tel"
                       placeholder="+919876543210">
                <div id="recaptcha-container" aria-label="Phone verification"></div>
                <button id="send-otp" class="gate-action" type="button">Send verification code</button>
                <div id="otp-panel" hidden>
                    <label class="gate-label" for="otp-code">Verification code</label>
                    <input id="otp-code" class="gate-input" type="text" inputmode="numeric"
                           autocomplete="one-time-code" maxlength="6">
                    <button id="verify-otp" class="gate-action" type="button">Verify and sign in</button>
                </div>
            </div>
            <div id="subscription-panel" hidden>
                <p id="subscription-copy" class="gate-copy">Your account is signed in, but chat access requires an active subscription.</p>
                <button id="create-subscription" class="gate-action" type="button">Set up ₹1/month UPI AutoPay</button>
                <a id="paylink" class="gate-link" href="#" target="_blank" rel="noopener noreferrer" hidden>
                    Continue to PhonePe
                </a>
                <button id="check-subscription" class="gate-action" type="button">I completed setup — check access</button>
            </div>
            <button id="gate-sign-out" class="gate-action" type="button" hidden>Sign out</button>
            <p id="gate-error" class="gate-error" role="status" aria-live="polite"></p>
            <p class="gate-note">Phone verification uses Firebase. PhonePe handles the ₹1 setup payment and recurring UPI mandate. Chat opens only after the server confirms the subscription.</p>
        </section>
    </main>
    <div id="app-shell" class="app-shell" hidden>
        <aside class="sidebar">
            <div class="brand">
                <div class="brand-mark" aria-hidden="true">
                    <svg viewBox="0 0 48 48" fill="none">
                        <path class="spark-main" d="M24 5c2.8 12.1 5 14.3 17 17-12 2.7-14.2 4.9-17 17-2.8-12.1-5-14.3-17-17C19 19.3 21.2 17.1 24 5Z" fill="#6048C5"/>
                        <path class="spark-small" d="M39 29c1.2 5.1 2.1 6 7 7-4.9 1-5.8 1.9-7 7-1.2-5.1-2.1-6-7-7 4.9-1 5.8-1.9 7-7Z" fill="#F5A33B"/>
                    </svg>
                </div>
                <div>
                    <p class="brand-name">Abhishek</p>
                    <p class="brand-caption">English Tutor</p>
                </div>
            </div>
            <div class="sidebar-intro">
                <h2>A little practice goes a long way.</h2>
                <p>Build confidence in English, one conversation at a time.</p>
            </div>
            <button id="new-chat" class="new-chat" type="button">
                <span class="plus" aria-hidden="true">+</span> Start a new chat
            </button>
            <section aria-label="English lesson starters">
                <p class="sidebar-label">Explore a lesson</p>
                <div class="lesson-list">
                    <button class="lesson-button" type="button" data-prompt="Explain the present simple tense with examples."><span class="lesson-icon" aria-hidden="true">◷</span>Grammar basics</button>
                    <button class="lesson-button" type="button" data-prompt="Help me correct a sentence and explain the grammar."><span class="lesson-icon" aria-hidden="true">✎</span>Writing &amp; correction</button>
                    <button class="lesson-button" type="button" data-prompt="Teach me five useful English words for everyday conversation."><span class="lesson-icon" aria-hidden="true">✧</span>Grow my vocabulary</button>
                    <button class="lesson-button" type="button" data-prompt="Let's practice an English conversation. Ask me one question at a time."><span class="lesson-icon" aria-hidden="true">◌</span>Conversation practice</button>
                </div>
            </section>
            <div class="sidebar-footer"><span class="online-dot" aria-hidden="true"></span>Gemini-powered English practice</div>
        </aside>
        <section class="chat-area" aria-label="Chat with Abhishek">
            <header class="topbar">
                <div class="mobile-brand">
                    <div class="brand-mark" aria-hidden="true">
                        <svg viewBox="0 0 48 48" fill="none">
                            <path class="spark-main" d="M24 5c2.8 12.1 5 14.3 17 17-12 2.7-14.2 4.9-17 17-2.8-12.1-5-14.3-17-17C19 19.3 21.2 17.1 24 5Z" fill="#6048C5"/>
                            <path class="spark-small" d="M39 29c1.2 5.1 2.1 6 7 7-4.9 1-5.8 1.9-7 7-1.2-5.1-2.1-6-7-7 4.9-1 5.8-1.9 7-7Z" fill="#F5A33B"/>
                        </svg>
                    </div>
                    <div>
                        <p class="mobile-name">Abhishek</p>
                        <p class="mobile-caption">English Tutor</p>
                    </div>
                </div>
                <div class="topbar-status"><span class="online-dot" aria-hidden="true"></span>Ready to help you learn</div>
                <div class="account-actions">
                    <span id="signed-in-phone"></span>
                    <button id="sign-out" type="button">Sign out</button>
                    <button id="new-chat-top" class="new-chat-top" type="button">New chat</button>
                </div>
            </header>
            <div id="messages" class="messages" aria-live="polite">
                <div id="conversation" class="conversation">
                    <div class="welcome">
                        <p class="welcome-kicker">Your English practice space</p>
                        <h2>Let's make English feel natural.</h2>
                        <p class="welcome-copy">Ask a question, share a sentence for correction, or start a friendly conversation.</p>
                    </div>
                    <div class="message-row assistant">
                        <div class="message-avatar" aria-hidden="true">✦</div>
                        <div class="bubble">Hi! I'm Abhishek, your English tutor. What would you like to learn today?</div>
                    </div>
                    <p class="suggestion-heading">Not sure where to start? Try one of these:</p>
                    <div id="suggestions" class="suggestions">
                        <button class="suggestion" type="button" data-prompt="Explain the present simple tense with examples.">Explain a grammar rule</button>
                        <button class="suggestion" type="button" data-prompt="Correct this sentence and explain why: I am agree.">Correct a sentence</button>
                        <button class="suggestion" type="button" data-prompt="Let's practice an English conversation. Ask me one question at a time.">Practice conversation</button>
                    </div>
                </div>
            </div>
            <div class="composer-area">
                <form id="chat-form" class="composer">
                    <input id="message" name="message" maxlength="4000"
                           placeholder="Message Abhishek..." autocomplete="off" required>
                    <button id="send" type="submit" aria-label="Send message" title="Send message">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M4 12 20 4l-5.8 16-2.8-6.2L4 12Z" stroke="currentColor"
                                  stroke-width="1.8" stroke-linejoin="round"/>
                            <path d="m11.4 13.8 4.2-4.2" stroke="currentColor"
                                  stroke-width="1.8" stroke-linecap="round"/>
                        </svg>
                    </button>
                </form>
                <p class="privacy">Gemini creates the replies. Please don't enter sensitive personal information.</p>
            </div>
        </section>
    </div>
    <script type="module">
        import {initializeApp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
        import {
            getAuth,
            onAuthStateChanged,
            RecaptchaVerifier,
            signInWithPhoneNumber,
            signOut
        } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

        const gate = document.getElementById("access-gate");
        const gateCopy = document.getElementById("gate-copy");
        const gateError = document.getElementById("gate-error");
        const signInPanel = document.getElementById("sign-in-panel");
        const subscriptionPanel = document.getElementById("subscription-panel");
        const sendOtpButton = document.getElementById("send-otp");
        const verifyOtpButton = document.getElementById("verify-otp");
        const createSubscriptionButton = document.getElementById("create-subscription");
        const checkSubscriptionButton = document.getElementById("check-subscription");
        const paylink = document.getElementById("paylink");
        const gateSignOutButton = document.getElementById("gate-sign-out");
        const appShell = document.getElementById("app-shell");
        let auth;
        let currentUser = null;
        let confirmationResult = null;
        let recaptchaVerifier = null;
        let subscriptionPoll = null;

        function setGateError(message) {
            gateError.textContent = message || "";
        }

        function showSignedOut() {
            gate.hidden = false;
            appShell.hidden = true;
            signInPanel.hidden = false;
            subscriptionPanel.hidden = true;
            gateSignOutButton.hidden = true;
            gateCopy.textContent = "Sign in with your phone number to continue.";
            setGateError("");
            if (subscriptionPoll) {
                clearInterval(subscriptionPoll);
                subscriptionPoll = null;
            }
        }

        function showPaywall(status) {
            gate.hidden = false;
            appShell.hidden = true;
            signInPanel.hidden = true;
            subscriptionPanel.hidden = false;
            gateSignOutButton.hidden = false;
            gateCopy.textContent = "Your account is signed in, but chat access requires an active subscription.";
            if (status === "pending") {
                document.getElementById("subscription-copy").textContent =
                    "Finish the PhonePe setup. Access opens after the server confirms the monthly UPI mandate.";
            } else {
                document.getElementById("subscription-copy").textContent =
                    "Set up a ₹1/month UPI AutoPay mandate to unlock chat.";
            }
            if (subscriptionPoll) clearInterval(subscriptionPoll);
            subscriptionPoll = setInterval(checkSubscription, 15000);
        }

        function showChat() {
            gate.hidden = true;
            appShell.hidden = false;
            document.getElementById("signed-in-phone").textContent =
                currentUser.phoneNumber || "";
            if (subscriptionPoll) {
                clearInterval(subscriptionPoll);
                subscriptionPoll = null;
            }
        }

        async function api(path, options = {}) {
            const headers = new Headers(options.headers || {});
            if (currentUser) {
                headers.set("Authorization", `Bearer ${await currentUser.getIdToken()}`);
            }
            if (options.body && !headers.has("Content-Type")) {
                headers.set("Content-Type", "application/json");
            }
            const response = await fetch(path, {...options, headers});
            let data;
            try {
                data = await response.json();
            } catch {
                data = {};
            }
            if (!response.ok) {
                const error = new Error(data.detail || "The request failed.");
                error.status = response.status;
                throw error;
            }
            return data;
        }

        function showPaylink(urlValue) {
            const url = new URL(urlValue);
            const trustedHost = url.hostname === "phon.pe"
                || url.hostname.endsWith(".phon.pe")
                || url.hostname === "phonepe.com"
                || url.hostname.endsWith(".phonepe.com");
            if (url.protocol !== "https:" || !trustedHost) {
                throw new Error("PhonePe returned an unexpected payment link.");
            }
            paylink.href = url.href;
            paylink.hidden = false;
        }

        async function checkSubscription() {
            if (!currentUser) return;
            checkSubscriptionButton.disabled = true;
            try {
                const data = await api("/api/subscription/status");
                if (data.status === "active") {
                    showChat();
                    setGateError("");
                    return;
                }
                if (data.paylink_url) showPaylink(data.paylink_url);
                showPaywall(data.status);
                if (data.status === "pending") {
                    setGateError("Waiting for PhonePe to confirm the mandate.");
                } else if (data.status === "inactive") {
                    setGateError("No active subscription was confirmed. You can try setup again.");
                }
            } catch (error) {
                setGateError(error.message || "Could not check the subscription status.");
            } finally {
                checkSubscriptionButton.disabled = false;
            }
        }

        sendOtpButton.addEventListener("click", async () => {
            sendOtpButton.disabled = true;
            setGateError("");
            try {
                if (recaptchaVerifier) recaptchaVerifier.clear();
                recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                    size: "normal"
                });
                await recaptchaVerifier.render();
                confirmationResult = await signInWithPhoneNumber(
                    auth,
                    document.getElementById("phone-number").value.trim(),
                    recaptchaVerifier
                );
                document.getElementById("otp-panel").hidden = false;
                setGateError("Verification code sent. Enter the code from your SMS.");
            } catch (error) {
                setGateError(error.message || "Could not send the verification code.");
                if (recaptchaVerifier) {
                    recaptchaVerifier.clear();
                    recaptchaVerifier = null;
                }
            } finally {
                sendOtpButton.disabled = false;
            }
        });

        verifyOtpButton.addEventListener("click", async () => {
            if (!confirmationResult) {
                setGateError("Request a verification code first.");
                return;
            }
            verifyOtpButton.disabled = true;
            setGateError("");
            try {
                await confirmationResult.confirm(
                    document.getElementById("otp-code").value.trim()
                );
            } catch (error) {
                setGateError(error.message || "The verification code was not accepted.");
            } finally {
                verifyOtpButton.disabled = false;
            }
        });

        createSubscriptionButton.addEventListener("click", async () => {
            createSubscriptionButton.disabled = true;
            setGateError("");
            try {
                const data = await api("/api/subscription/setup", {method: "POST"});
                showPaylink(data.paylink_url);
                showPaywall("pending");
                setGateError("Payment link ready. Complete setup in PhonePe, then return here.");
            } catch (error) {
                setGateError(error.message || "Could not create the PhonePe payment link.");
            } finally {
                createSubscriptionButton.disabled = false;
            }
        });

        checkSubscriptionButton.addEventListener("click", checkSubscription);
        document.getElementById("sign-out").addEventListener("click", () => signOut(auth));
        gateSignOutButton.addEventListener("click", () => signOut(auth));

        try {
            const configResponse = await fetch("/api/config");
            const config = await configResponse.json();
            if (!configResponse.ok) {
                throw new Error(config.detail || "Firebase is not configured.");
            }
            auth = getAuth(initializeApp(config));
            auth.languageCode = "en";
            onAuthStateChanged(auth, async (user) => {
                currentUser = user;
                if (!user) {
                    showSignedOut();
                    return;
                }
                gate.hidden = false;
                appShell.hidden = true;
                signInPanel.hidden = true;
                subscriptionPanel.hidden = false;
                gateSignOutButton.hidden = false;
                try {
                    const data = await api("/api/account");
                    if (data.status === "active") {
                        showChat();
                    } else {
                        if (data.paylink_url) showPaylink(data.paylink_url);
                        showPaywall(data.status);
                    }
                } catch (error) {
                    showPaywall("inactive");
                    setGateError(error.message || "Could not verify the account.");
                }
            });
        } catch (error) {
            sendOtpButton.disabled = true;
            setGateError(error.message || "Firebase phone sign-in could not be initialized.");
        }

        const form = document.getElementById("chat-form");
        const input = document.getElementById("message");
        const messages = document.getElementById("messages");
        const conversation = document.getElementById("conversation");
        const sendButton = document.getElementById("send");
        const newChatButtons = document.querySelectorAll("#new-chat, #new-chat-top");
        let previousInteractionId = sessionStorage.getItem("abhishek-gpt-interaction");

        function addMessage(text, role) {
            const row = document.createElement("div");
            row.className = "message-row " + role;
            if (role === "assistant") {
                const avatar = document.createElement("div");
                avatar.className = "message-avatar";
                avatar.setAttribute("aria-hidden", "true");
                avatar.textContent = "✦";
                row.appendChild(avatar);
            }
            const bubble = document.createElement("div");
            bubble.className = "bubble";
            if (role === "assistant") {
                const parts = text.split(/(\\*\\*[\\s\\S]+?\\*\\*)/g);
                for (const part of parts) {
                    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
                        const strong = document.createElement("strong");
                        strong.textContent = part.slice(2, -2);
                        bubble.appendChild(strong);
                    } else {
                        bubble.appendChild(document.createTextNode(part));
                    }
                }
            } else {
                bubble.textContent = text;
            }
            row.appendChild(bubble);
            conversation.appendChild(row);
            messages.scrollTop = messages.scrollHeight;
            return row;
        }

        function addTypingIndicator() {
            const row = addMessage("", "assistant");
            row.classList.add("thinking");
            const bubble = row.querySelector(".bubble");
            bubble.classList.add("typing-indicator");
            bubble.setAttribute("role", "status");
            bubble.setAttribute("aria-label", "Abhishek is typing");

            for (let index = 0; index < 3; index += 1) {
                const dot = document.createElement("span");
                dot.className = "typing-dot";
                dot.setAttribute("aria-hidden", "true");
                bubble.appendChild(dot);
            }
            return row;
        }

        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const message = input.value.trim();
            if (!message) return;

            addMessage(message, "user");
            const thinkingMessage = addTypingIndicator();
            document.getElementById("suggestions")?.remove();
            input.value = "";
            sendButton.disabled = true;
            try {
                const data = await api("/api/chat", {
                    method: "POST",
                    body: JSON.stringify({
                        message,
                        previous_interaction_id: previousInteractionId
                    })
                });
                previousInteractionId = data.interaction_id;
                sessionStorage.setItem("abhishek-gpt-interaction", previousInteractionId);
                thinkingMessage.remove();
                addMessage(data.reply, "assistant");
            } catch (error) {
                thinkingMessage.remove();
                addMessage(error.message || "Unable to reach Gemini. Please try again.",
                           "assistant");
                if (error.status === 401) {
                    await signOut(auth);
                } else if (error.status === 403) {
                    await checkSubscription();
                }
            } finally {
                sendButton.disabled = false;
                input.focus();
            }
        });

        function startNewChat() {
            previousInteractionId = null;
            sessionStorage.removeItem("abhishek-gpt-interaction");
            conversation.replaceChildren();
            addMessage("A fresh start! What would you like to learn in English?",
                       "assistant");
            input.focus();
        }

        newChatButtons.forEach((button) => {
            button.addEventListener("click", startNewChat);
        });

        document.querySelectorAll("[data-prompt]").forEach((button) => {
            button.addEventListener("click", () => {
                input.value = button.dataset.prompt;
                form.requestSubmit();
            });
        });
    </script>
</body>
</html>"""


@app.post("/api/chat")
def chat(request: ChatRequest, user: dict = Depends(get_current_user)):
    subscription = refresh_subscription(user["uid"])
    if subscription["status"] != "active":
        raise HTTPException(
            status_code=403,
            detail="An active PhonePe subscription is required to use chat.",
        )

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY is not set. Add your Gemini API key and restart the app.",
        )

    client = genai.Client(api_key=api_key)
    try:
        interaction = client.interactions.create(
            model=MODEL_NAME,
            system_instruction=SYSTEM_INSTRUCTION,
            input=request.message,
            previous_interaction_id=request.previous_interaction_id,
        )
    except APIError as exc:
        logger.exception("Gemini API request failed")
        raise HTTPException(
            status_code=502,
            detail="Gemini could not complete the request. Check the server log and API key.",
        ) from exc

    if not interaction.output_text:
        raise HTTPException(status_code=502, detail="Gemini returned an empty response.")

    return {
        "reply": interaction.output_text,
        "interaction_id": interaction.id,
    }


# Set GEMINI_API_KEY in the terminal before starting the server.
# Run with: python -m uvicorn python_test:app --reload
