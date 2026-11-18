-- recorded_at is UTC Unix milliseconds. For baseline rows it is the adoption
-- time, not a claim about when the historical script originally ran.
CREATE TABLE IF NOT EXISTS db_deployments (
    sequence INTEGER PRIMARY KEY CHECK (sequence > 0),
    script_name TEXT NOT NULL UNIQUE,
    checksum TEXT NOT NULL,
    recorded_at INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('baseline', 'applied'))
) STRICT;
