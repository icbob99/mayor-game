-- Only before the new save format is used. Otherwise keep the additive schema and fix forward.
CREATE TABLE retirement_rollback_guard (allowed INTEGER CHECK (allowed = 1));
INSERT INTO retirement_rollback_guard SELECT CASE WHEN
    EXISTS (SELECT 1 FROM game_stats WHERE unsinkable > 0)
    OR EXISTS (SELECT 1 FROM game_statuses WHERE json_type(state_json, '$.achievements.unsinkable') IS NOT NULL)
    OR EXISTS (SELECT 1 FROM game_history WHERE end_reason = 'honorable_retirement')
    THEN 0 ELSE 1 END;
DROP TABLE retirement_rollback_guard;
ALTER TABLE game_stats DROP COLUMN unsinkable;
