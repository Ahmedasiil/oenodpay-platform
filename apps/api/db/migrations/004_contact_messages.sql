-- Messages sent from the website's contact form, for the support, privacy, complaints and security teams.
CREATE TABLE contact_messages (
  id bigserial PRIMARY KEY,
  name text NOT NULL CHECK (length(name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (length(email) <= 254),
  topic text NOT NULL,
  message text NOT NULL CHECK (length(message) BETWEEN 10 AND 4000),
  handled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX contact_messages_open_idx ON contact_messages (topic, created_at) WHERE handled_at IS NULL;
