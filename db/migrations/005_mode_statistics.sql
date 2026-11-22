-- Replace the aggregate JSON with one bounded statistics row per account and mode.
-- Coordinate this migration with the new Worker: the previous Worker uses stats_json.
BEGIN;
CREATE TABLE game_stats (
    account_id TEXT NOT NULL REFERENCES accounts(id),
    mode TEXT NOT NULL CHECK (mode IN ('arcade', 'daily', 'blitz')),
    games_played INTEGER NOT NULL DEFAULT 0 CHECK (games_played >= 0),
    max_money INTEGER NOT NULL DEFAULT 0 CHECK (max_money >= 0),
    resignations INTEGER NOT NULL DEFAULT 0 CHECK (resignations BETWEEN 0 AND games_played),
    offshore_king INTEGER NOT NULL DEFAULT 0 CHECK (offshore_king BETWEEN 0 AND games_played),
    untouchable INTEGER NOT NULL DEFAULT 0 CHECK (untouchable BETWEEN 0 AND games_played),
    happy_wife INTEGER NOT NULL DEFAULT 0 CHECK (happy_wife BETWEEN 0 AND games_played),
    survivor INTEGER NOT NULL DEFAULT 0 CHECK (survivor BETWEEN 0 AND games_played),
    PRIMARY KEY (account_id, mode)
) STRICT;
INSERT INTO game_stats (account_id, mode, games_played, max_money, resignations, offshore_king, untouchable, happy_wife, survivor)
SELECT account_id, 'arcade',
    COALESCE(json_extract(stats_json, '$.gamesPlayed'), 0),
    COALESCE(json_extract(stats_json, '$.maxMoney'), 0),
    COALESCE(json_extract(stats_json, '$.resignations'), 0),
    COALESCE(json_extract(stats_json, '$.achievements.offshore_king'), 0),
    COALESCE(json_extract(stats_json, '$.achievements.untouchable'), 0),
    COALESCE(json_extract(stats_json, '$.achievements.happy_wife'), 0),
    COALESCE(json_extract(stats_json, '$.achievements.survivor'), 0)
FROM game_statuses;
ALTER TABLE game_statuses DROP COLUMN stats_json;
ALTER TABLE game_history ADD COLUMN mode TEXT NOT NULL DEFAULT 'arcade' CHECK (mode IN ('arcade', 'daily', 'blitz'));
-- Historical difficulty cannot be inferred from an account's current game.
ALTER TABLE game_history ADD COLUMN difficulty TEXT CHECK (difficulty IN ('easy', 'normal', 'hard', 'insane'));
COMMIT;
