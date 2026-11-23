-- Additive upgrade: preserve existing players, totals and history.
ALTER TABLE game_stats ADD COLUMN unsinkable INTEGER NOT NULL DEFAULT 0 CHECK (unsinkable BETWEEN 0 AND games_played);
