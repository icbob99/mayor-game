-- Pre-release recovery only. After new-mode games exist use a compatible forward fix:
-- an old client cannot preserve the new modes, daily checkpoints or per-mode totals.
BEGIN;
CREATE TABLE mode_rollback_guard (safe INTEGER CHECK (safe = 1));
INSERT INTO mode_rollback_guard SELECT CASE WHEN
    EXISTS (SELECT 1 FROM game_stats WHERE mode <> 'arcade' AND (games_played > 0 OR max_money > 0)) OR
    EXISTS (SELECT 1 FROM game_history WHERE mode <> 'arcade') OR
    EXISTS (SELECT 1 FROM game_statuses WHERE json_extract(state_json, '$.mode') IN ('daily','blitz') OR json_extract(state_json, '$.daily.game') IS NOT NULL)
    THEN 0 ELSE 1 END;
DROP TABLE mode_rollback_guard;
DROP TRIGGER game_statuses_reject_stale_update;
ALTER TABLE game_statuses ADD COLUMN stats_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(stats_json));
UPDATE game_statuses SET stats_json = (
    SELECT json_object('gamesPlayed', COALESCE(SUM(games_played),0), 'maxMoney', COALESCE(MAX(max_money),0),
        'resignations', COALESCE(SUM(resignations),0), 'achievements', json_object(
            'offshore_king', COALESCE(SUM(offshore_king),0), 'untouchable', COALESCE(SUM(untouchable),0),
            'happy_wife', COALESCE(SUM(happy_wife),0), 'survivor', COALESCE(SUM(survivor),0)))
    FROM game_stats WHERE game_stats.account_id = game_statuses.account_id
);
CREATE TRIGGER game_statuses_reject_stale_update BEFORE UPDATE ON game_statuses
FOR EACH ROW WHEN NEW.write_timestamp <= OLD.write_timestamp
BEGIN SELECT RAISE(ABORT, 'stale_save'); END;
ALTER TABLE game_history DROP COLUMN mode;
ALTER TABLE game_history DROP COLUMN difficulty;
DROP TABLE game_stats;
COMMIT;
