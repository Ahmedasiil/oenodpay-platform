-- OenodPay core schema (PostgreSQL 16+). Mirrors the rules in src/ledger/ledger.ts.
-- Apply with your migration tool of choice; run postings in SERIALIZABLE transactions.

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         citext UNIQUE NOT NULL,
  full_name     text NOT NULL,
  handle        text UNIQUE NOT NULL,
  password_hash text,                          -- null when the user signs in only with passkeys
  kyc_status    text NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending','verified','rejected')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE ledger_accounts (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind           text NOT NULL CHECK (kind IN ('customer_wallet','funding_clearing','payout_clearing','fee_revenue')),
  currency       char(3) NOT NULL,
  owner_id       uuid REFERENCES users(id),
  allow_negative boolean NOT NULL DEFAULT false,
  balance_minor  bigint NOT NULL DEFAULT 0,
  CONSTRAINT no_negative_wallets CHECK (allow_negative OR balance_minor >= 0)
);

CREATE TABLE journal_entries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key text UNIQUE NOT NULL,
  description     text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE journal_lines (
  entry_id     uuid NOT NULL REFERENCES journal_entries(id),
  account_id   uuid NOT NULL REFERENCES ledger_accounts(id),
  amount_minor bigint NOT NULL CHECK (amount_minor <> 0),
  PRIMARY KEY (entry_id, account_id)
);

-- Ledger rows are append-only: the application role may INSERT and SELECT, never UPDATE or DELETE.
-- REVOKE UPDATE, DELETE ON journal_entries, journal_lines FROM oenodpay_app;

CREATE TABLE audit_events (
  id      bigserial PRIMARY KEY,
  at      timestamptz NOT NULL DEFAULT now(),
  actor   uuid,
  action  text NOT NULL,
  detail  jsonb NOT NULL DEFAULT '{}'
);
-- REVOKE UPDATE, DELETE ON audit_events FROM oenodpay_app;
