# Phase 2: database, passkeys and ID verification

This pull request is built in the open. Each item below is ticked as its commit lands.

- [x] PostgreSQL repository behind users, accounts and the ledger (serializable transactions, no-negative-wallet constraint, idempotency keys)
- [x] Refresh tokens with rotation, reuse detection and per-device sessions
- [x] Passkey sign-in (WebAuthn: Face ID, Touch ID, fingerprint, Windows Hello)
- [x] ID verification (KYC) onboarding: vendor-neutral interface, sandbox provider, webhook with signature check
- [x] Mobile and web screens for sign-up, passkey setup and verification
- [x] Tests for every money and security rule above (42 API tests on memory and real PostgreSQL, plus browser runs of passkey sign-in and ID verification)

## Still to do before launch
- Native passkeys in the iOS and Android apps (needs the real oenodpay.com domain for Apple and Google app-site association)
- A real ID verification vendor contract (the sandbox is refused in production)
- Run the API behind a load balancer that sets the client IP, so rate limits apply per person
