# Architecture

The iOS app, the Android app and the website all talk to **one API** and **one backend**, so a user's
balance, history, cards and rewards are the same everywhere.

```
 iOS app ─┐
 Android ─┼──> API gateway ──> core services ──> PostgreSQL ledger, events
 Website ─┘    (auth, limits)   (wallet, payments,      │
 Admin  ──────────────────────>  cards, risk, ...) ──> partner adapters
                                                        (rails, cards, KYC, payouts, travel, eSIM)
```

## Principles

1. **The ledger is the truth.** Every dollar moves by a balanced, append-only, idempotent journal entry
   (`apps/api/src/ledger`). Customer wallets cannot go below zero.
2. **Integer money.** Amounts are whole cents everywhere (`packages/shared/src/money.ts`).
3. **One set of rules.** Validation, quotes and money formatting live in `packages/shared` and are used
   by the API, the mobile app and the web app.
4. **Partners behind adapters.** Interac/EFT rails, the card issuer, KYC, payouts, travel and eSIM each sit
   behind their own module so a provider can be swapped without touching the apps.
5. **Canadian data in Canada.** Production runs in a Canadian cloud region.

## Roadmap for this codebase

- [x] Monorepo, shared package, design tokens and final logo
- [x] API: auth, ledger, wallet transfers, quotes, security middleware, tests
- [x] Mobile and web screens from the prototype
- [ ] PostgreSQL repository behind the ledger (serializable transactions)
- [ ] Passkeys (WebAuthn) and device binding; refresh tokens in the device keychain
- [ ] KYC vendor integration and onboarding flow
- [ ] Interac e-Transfer and EFT through the rails partner; bill pay
- [ ] Payout partner for international transfers; card issuing
- [ ] Admin console with four-eyes approvals
