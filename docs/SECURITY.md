# Security

oenodPay holds people's money and identity, so security is built in from the first commit.

## In the code today

- Passwords hashed with scrypt and a per-user salt; constant-time comparison; same error for
  unknown email and wrong password.
- Short-lived (15 minute) signed access tokens with issuer, audience and algorithm pinned.
- Strict request validation with Zod on every endpoint; 64 KB body limit.
- Rate limits on every route, stricter on sign-in.
- Security headers (Helmet on the API; HSTS, frame denial, nosniff and more on the website).
- CORS limited to known app origins.
- Logs redact authorization headers, cookies and passwords.
- Append-only audit trail of sign-ins and money movement.
- Double-entry ledger with idempotency keys: retries never move money twice, wallets never go negative.
- KYC gate: money cannot leave an unverified account.
- Card numbers are never stored by oenodPay; the card partner's secure view shows them.
- Secrets only in environment variables; `.env` files are git-ignored.

## Program (see the plan document)

Head of Security hired first; threat model per module; zero trust with FIDO2 keys for staff;
four-eyes approval for any manual money movement; keys in an HSM; passkeys and SIM-swap protection
for users; hardened apps (RASP, App Attest, Play Integrity); signed builds and SBOMs; 24/7 monitoring;
immutable backups and incident drills; penetration tests, SOC 2 Type II, PCI DSS and ISO 27001.

## Reporting a vulnerability

Email [SECURITY CONTACT] with details. Please do not open a public issue.
