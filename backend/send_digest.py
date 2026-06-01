"""
send_digest.py — Email the weekly advisor digest.

This does NOT run on its own. It must be scheduled (Monday morning) by an external
scheduler — Windows Task Scheduler, cron, or a hosting platform's cron feature.

Requires two env vars to actually send:
  RESEND_API_KEY   — your Resend API key  (https://resend.com)
  ADVISOR_EMAILS   — comma-separated recipient list, e.g. "a@carleton.ca,b@carleton.ca"
  DIGEST_FROM      — verified sender, e.g. "CampusQ <digest@yourdomain.com>"

Without those, it just prints the digest to stdout (safe dry-run).

Run:  py send_digest.py
Schedule (Windows): Task Scheduler -> weekly Monday 8am -> py <path>/send_digest.py
Schedule (cron):    0 8 * * 1  cd /path/to/backend && python send_digest.py
"""

import os
from dotenv import load_dotenv
from dashboard import build_digest_text

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))

LOG_DIR = os.path.dirname(os.path.abspath(__file__))


def main():
    digest = build_digest_text(LOG_DIR)

    api_key = os.getenv("RESEND_API_KEY")
    recipients = [e.strip() for e in os.getenv("ADVISOR_EMAILS", "").split(",") if e.strip()]
    sender = os.getenv("DIGEST_FROM", "CampusQ <onboarding@resend.dev>")

    if not api_key or not recipients:
        print("=== DRY RUN (no RESEND_API_KEY or ADVISOR_EMAILS set) ===\n")
        print(digest)
        print("\n=== set the env vars above to actually send ===")
        return

    try:
        import resend
    except ImportError:
        print("The 'resend' package isn't installed. Run:  pip install resend")
        print("\nDigest that would have been sent:\n")
        print(digest)
        return

    resend.api_key = api_key
    resend.Emails.send({
        "from": sender,
        "to": recipients,
        "subject": "CampusQ — Weekly Advisor Digest",
        "text": digest,
    })
    print(f"Digest sent to {len(recipients)} recipient(s).")


if __name__ == "__main__":
    main()
