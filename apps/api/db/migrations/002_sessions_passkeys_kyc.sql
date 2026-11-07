-- Phase 2: database-enforced ledger rules, device sessions, passkeys and ID verification.

-- Ledger -------------------------------------------------------------------

-- A reused idempotency key must describe the same request, or it is refused.
ALTER TABLE journal_entries ADD COLUMN request_hash text NOT NULL DEFAULT '';
CREATE INDEX journal_lines_account_idx ON journal_lines (account_id);

-- Exactly one CAD wallet per person, and one of each internal account per currency.
CREATE UNIQUE INDEX one_wallet_per_owner ON ledger_accounts (owner_id, currency) WHERE kind = 'customer_wallet';
CREATE UNIQUE INDEX one_system_account ON ledger_accounts (kind, currency) WHERE owner_id IS NULL;
ALTER TABLE ledger_accounts ADD CONSTRAINT wallets_have_owner CHECK (kind <> 'customer_wallet' OR (owner_id IS NOT NULL AND NOT allow_negative));

-- Every journal entry must balance to zero. Checked at COMMIT, so all lines of an entry are inserted first.
CREATE FUNCTION assert_entry_balanced() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE total bigint; line_count int;
BEGIN
  SELECT coalesce(sum(amount_minor), 0), count(*) INTO total, line_count FROM journal_lines WHERE entry_id = NEW.entry_id;
  IF total <> 0 OR line_count < 2 THEN
    RAISE EXCEPTION 'journal entry % is unbalanced (sum %, lines %)', NEW.entry_id, total, line_count USING ERRCODE = 'check_violation';
  END IF;
  RETURN NULL;
END $$;
CREATE CONSTRAINT TRIGGER journal_entry_balanced AFTER INSERT ON journal_lines
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION assert_entry_balanced();

-- Ledger and audit rows are append-only, enforced by the database itself (not only by grants).
CREATE FUNCTION forbid_change() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION '% is append-only', TG_TABLE_NAME USING ERRCODE = 'insufficient_privilege';
END $$;
CREATE TRIGGER journal_entries_append_only BEFORE UPDATE OR DELETE ON journal_entries FOR EACH ROW EXECUTE FUNCTION forbid_change();
CREATE TRIGGER journal_lines_append_only BEFORE UPDATE OR DELETE ON journal_lines FOR EACH ROW EXECUTE FUNCTION forbid_change();
CREATE TRIGGER audit_events_append_only BEFORE UPDATE OR DELETE ON audit_events FOR EACH ROW EXECUTE FUNCTION forbid_change();
CREATE INDEX audit_events_actor_idx ON audit_events (actor, at DESC);

-- Device sessions and refresh tokens ---------------------------------------
-- Only SHA-256 hashes of refresh tokens are stored. Each use rotates the token;
-- presenting an already-used token signals theft and ends that session.

CREATE TABLE sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES users(id),
  token_hash    bytea UNIQUE NOT NULL,
  device_name   text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_used_at  timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL,
  revoked_at    timestamptz,
  revoke_reason text
);
CREATE INDEX sessions_user_idx ON sessions (user_id) WHERE revoked_at IS NULL;

CREATE TABLE used_refresh_tokens (
  token_hash bytea PRIMARY KEY,
  session_id uuid NOT NULL REFERENCES sessions(id),
  used_at    timestamptz NOT NULL DEFAULT now()
);

-- Passkeys (WebAuthn) --------------------------------------------------------

CREATE TABLE passkeys (
  id           text PRIMARY KEY,               -- credential id, base64url
  user_id      uuid NOT NULL REFERENCES users(id),
  public_key   bytea NOT NULL,                 -- COSE public key; no secret ever leaves the device
  counter      bigint NOT NULL DEFAULT 0,
  transports   text[] NOT NULL DEFAULT '{}',
  device_type  text NOT NULL,
  backed_up    boolean NOT NULL,
  nickname     text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz
);
CREATE INDEX passkeys_user_idx ON passkeys (user_id);

-- One-time WebAuthn challenges, valid for five minutes.
CREATE TABLE auth_challenges (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purpose    text NOT NULL CHECK (purpose IN ('passkey_register', 'passkey_login')),
  user_id    uuid REFERENCES users(id),
  challenge  text NOT NULL,
  expires_at timestamptz NOT NULL
);

-- Identity verification (KYC) -------------------------------------------------
-- We keep the vendor's reference and the outcome only. ID images and selfies stay with the vendor.

CREATE TABLE kyc_checks (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id),
  provider     text NOT NULL,
  provider_ref text UNIQUE NOT NULL,
  status       text NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'verified', 'rejected')),
  reason       text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE INDEX kyc_checks_user_idx ON kyc_checks (user_id, created_at DESC);
