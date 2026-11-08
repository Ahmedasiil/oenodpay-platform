-- Early-access list from the website. Emails are stored lower-case so each person appears once.
CREATE TABLE waitlist (
  email text PRIMARY KEY CHECK (email = lower(email) AND length(email) <= 254),
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);
