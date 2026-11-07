# Phase 2: database, passkeys and ID verification

This pull request is built in the open. Each item below is ticked as its commit lands.

- [ ] PostgreSQL repository behind users, accounts and the ledger (serializable transactions, no-negative-wallet constraint, idempotency keys)
- [ ] Refresh tokens with rotation, reuse detection and per-device sessions
- [ ] Passkey sign-in (WebAuthn: Face ID, Touch ID, fingerprint, Windows Hello)
- [ ] ID verification (KYC) onboarding: vendor-neutral interface, sandbox provider, webhook with signature check
- [ ] Mobile and web screens for sign-up, passkey setup and verification
- [ ] Tests for every money and security rule above
