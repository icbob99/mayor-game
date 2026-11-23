-- One current preference object per account; independent of game saves and history.
CREATE TABLE account_preferences (
    account_id TEXT PRIMARY KEY NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    audio_json TEXT NOT NULL CHECK (json_valid(audio_json))
) STRICT;
