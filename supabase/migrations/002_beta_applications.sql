CREATE TABLE beta_applications (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT,
  city            TEXT NOT NULL,
  state           TEXT,
  country         TEXT NOT NULL DEFAULT 'United States',
  screen_time     TEXT NOT NULL,
  occupation      TEXT,
  age             TEXT NOT NULL,
  gender          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash         TEXT,
  referrer        TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  metadata        JSONB DEFAULT '{}'
);

ALTER TABLE beta_applications ENABLE ROW LEVEL SECURITY;
