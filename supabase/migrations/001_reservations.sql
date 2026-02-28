-- Reservation number sequence (no gaps)
CREATE SEQUENCE IF NOT EXISTS reservation_number_seq START 1;

-- Reservations table
CREATE TABLE reservations (
  id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email              TEXT NOT NULL UNIQUE,
  reservation_number INTEGER NOT NULL DEFAULT nextval('reservation_number_seq'),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash            TEXT,
  referrer           TEXT,
  metadata           JSONB DEFAULT '{}'
);

-- Index for rate-limit lookups
CREATE INDEX idx_reservations_ip_hash_created ON reservations (ip_hash, created_at);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- No public access — only service_role key can insert/read
-- (No RLS policies = deny all for anon/authenticated roles)
