-- Restore the previous application first. Player saves retain their optional counters.
DELETE FROM game_config WHERE key = 'openingProtection';
UPDATE game_config SET value = json_remove(value, '$.driftIncrement') WHERE key = 'arcade';
UPDATE game_config SET value = json_remove(value, '$.cooldownIncrementDays') WHERE key = 'shop';
