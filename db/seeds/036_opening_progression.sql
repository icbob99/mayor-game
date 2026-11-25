-- Add mechanics settings without replacing existing operator configuration.
-- Deploy before the new frontend. Old clients ignore the additional fields.
INSERT INTO game_config (key, value)
VALUES ('openingProtection', '{"statFloor":5,"threatCeiling":95,"upperStatCeiling":95,"penaltyCap":1}')
ON CONFLICT(key) DO NOTHING;

UPDATE game_config SET value = json_insert(value, '$.driftIncrement', 1)
WHERE key = 'arcade';

UPDATE game_config SET value = json_insert(value, '$.cooldownIncrementDays', 3)
WHERE key = 'shop';
