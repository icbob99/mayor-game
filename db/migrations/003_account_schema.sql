-- P2: account storage only; authentication and save handling are implemented later.
-- All *_at values and write_timestamp are UTC Unix milliseconds, supplied explicitly.
-- Writers must enable foreign_keys on every connection, not only during migration.
PRAGMA foreign_keys = ON;
BEGIN;

CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY NOT NULL,
    nickname TEXT NOT NULL,
    -- The server normalizes the nickname before writing this unique key.
    nickname_key TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
) STRICT;

CREATE TABLE IF NOT EXISTS auth_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    account_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    created_at INTEGER NOT NULL,
    last_activity_at INTEGER NOT NULL,
    revoked_at INTEGER,
    -- Required parent key for the ownership constraint below.
    UNIQUE (account_id, id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
) STRICT;

CREATE TABLE IF NOT EXISTS active_game_sessions (
    account_id TEXT PRIMARY KEY NOT NULL,
    id TEXT NOT NULL UNIQUE,
    auth_session_id TEXT NOT NULL,
    activated_at INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (account_id, auth_session_id) REFERENCES auth_sessions(account_id, id)
) STRICT;

CREATE TABLE IF NOT EXISTS game_statuses (
    account_id TEXT PRIMARY KEY NOT NULL,
    version_guid TEXT NOT NULL,
    state_json TEXT NOT NULL CHECK (json_valid(state_json)),
    stats_json TEXT NOT NULL CHECK (json_valid(stats_json)),
    write_timestamp INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
) STRICT;

-- Reject delayed or repeated writes even when the caller omits a timestamp predicate.
CREATE TRIGGER IF NOT EXISTS game_statuses_reject_stale_update
BEFORE UPDATE ON game_statuses
FOR EACH ROW
WHEN NEW.write_timestamp <= OLD.write_timestamp
BEGIN
    SELECT RAISE(ABORT, 'stale_save');
END;

CREATE TABLE IF NOT EXISTS game_history (
    account_id TEXT NOT NULL,
    game_id TEXT NOT NULL,
    -- Client-reported completion time may differ from server receipt time.
    finished_at INTEGER NOT NULL,
    recorded_at INTEGER NOT NULL,
    days INTEGER NOT NULL,
    money INTEGER NOT NULL,
    end_reason TEXT NOT NULL,
    achievements_json TEXT NOT NULL CHECK (json_valid(achievements_json)),
    PRIMARY KEY (account_id, game_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
) STRICT;

CREATE TABLE IF NOT EXISTS game_persistence_operations (
    account_id TEXT NOT NULL,
    operation_id TEXT NOT NULL,
    request_hash TEXT NOT NULL,
    response_json TEXT NOT NULL CHECK (json_valid(response_json)),
    created_at INTEGER NOT NULL,
    PRIMARY KEY (account_id, operation_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
) STRICT;

COMMIT;
