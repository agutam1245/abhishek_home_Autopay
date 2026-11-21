# autopay

A Flask app with a phone-verification page and a one-time ₹1 UPI payment
intent to `abhishekgtm@ybl`. Despite the project name, the payment is not an
Autopay mandate: the payer must open a UPI app and explicitly approve it.
This intent does not send money or report/verify payment completion.

## Run locally

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

Open <http://127.0.0.1:8000/payment>. Add the Twilio environment variables
listed below if you also want phone sign-in enabled; the payment page works
without them.

## Phone sign-in configuration

Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`,
and `FLASK_SECRET_KEY` in the server environment. Keep the Twilio credentials
server-side and never commit them.

## Deploy to Render

`render.yaml` defines a free Render web service. To deploy it, create a
separate **private** GitHub repository for this folder, push the project, then
create a Render Blueprint from that repository and apply the `render.yaml`.
The generated Flask session secret is configured by the Blueprint. Add the
Twilio environment variables in Render only if phone sign-in is needed.

Render's free service uses ephemeral local storage, so the SQLite phone-user
database is not durable across instance replacement or restart. The one-time
UPI intent itself is stateless and does not depend on that database.

This project uses a standard UPI intent, not the PhonePe Payment Gateway API.
PhonePe merchant checkout and server-side payment confirmation require an
approved merchant account and server-side credentials.
