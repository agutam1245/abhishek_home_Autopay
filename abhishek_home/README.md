# abhishek_home

A phone-number login and registration page using Twilio Verify SMS, Flask, and
SQLite. Phone numbers must be entered in international E.164 format. Twilio
trial accounts have restrictions, and SMS may incur charges; pricing depends
on the destination country.

## Configure Twilio

1. Create a Twilio account and a Verify Service in the Twilio Console.
2. Set the following environment variables in the server environment:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_VERIFY_SERVICE_SID` (the Verify Service SID beginning with `VA`)
   - `FLASK_SECRET_KEY` (a long random value used to sign login sessions)
3. Keep these values on the server. Do not put them in browser JavaScript or
   commit them to source control.

## Run locally on Windows

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:TWILIO_ACCOUNT_SID = "AC..."
$env:TWILIO_AUTH_TOKEN = "..."
$env:TWILIO_VERIFY_SERVICE_SID = "VA..."
$env:FLASK_SECRET_KEY = "replace-with-a-long-random-value"
python main.py
```

Open <http://127.0.0.1:8000>. Verified phone numbers are registered in the
local `users.db` database, and a signed session cookie keeps the user signed in.
Use HTTPS in production and set `SESSION_COOKIE_SECURE=true` in the server
environment.

## One-time UPI payment link

Open <http://127.0.0.1:8000/payment> to create a one-time ₹1 UPI payment intent
to `abhishekgtm@ybl`. The payer must review and approve the payment in their UPI
app. This is a standard UPI intent, not the PhonePe Payment Gateway API; it
does not automatically send money or verify payment completion. PhonePe
merchant checkout and server-side payment confirmation require an approved
merchant account and its server-side credentials.
