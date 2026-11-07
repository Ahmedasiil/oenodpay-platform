# oenodPay platform

One app to pay, send, travel and grow your money. This repository holds the whole platform:
the iOS and Android app, the website and web app, and the one backend they all share.

| Folder | What it is | Built with |
| --- | --- | --- |
| `apps/mobile` | iOS and Android app (one codebase) | React Native, Expo, Expo Router |
| `apps/web` | Website and web app | Next.js, Tailwind CSS |
| `apps/api` | The shared backend: accounts, wallet ledger, transfers, quotes | Node.js, Fastify, TypeScript |
| `packages/shared` | Code used by all three: money maths, countries and payout methods, quotes, validation, brand colours | TypeScript, Zod |
| `brand` | Final oenodPay logo files | SVG, PNG |
| `docs` | Architecture and security | Markdown |

## Run it locally

You need Node.js 22 and pnpm 10 (`corepack enable`).

```bash
pnpm install
cp apps/api/.env.example apps/api/.env   # then set a long random JWT_SECRET

pnpm dev:api      # backend on http://localhost:4000
pnpm dev:web      # website on http://localhost:3000
pnpm dev:mobile   # Expo: press i for iOS, a for Android, w for web
```

Checks run in CI on every pull request:

```bash
pnpm typecheck
pnpm test
```

## What works today

- **Backend:** sign-up and sign-in (hashed passwords, 15-minute tokens), a double-entry wallet ledger that
  cannot go negative or double-spend, wallet-to-wallet transfers with idempotency keys and a KYC gate,
  international quotes, security headers, rate limits and an audit trail. Data is in memory for now;
  the PostgreSQL schema is in `apps/api/db/migrations`.
- **Mobile app:** Home, Send, Send abroad (country picker with live quotes), Pay bills, Card (freeze),
  Travel, eSIM, Loans and Lend, Invest, and Security center, using sample data.
- **Website:** landing page and a first web app page with the same send-abroad calculator.

Rates, prices and balances are **sample data** until the partner integrations are connected.

## Next steps

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the plan and [docs/SECURITY.md](docs/SECURITY.md)
for the security program.
