-- Restore the standard Normal drift without changing other difficulty settings.
UPDATE game_config
SET value = json_set(value, '$.normal.drift', json('{"threat":1,"rating":-1,"wife":0,"health":0}'))
WHERE key = 'difficulties';

-- Author correction: municipal school repair through a public tender.
UPDATE game_choices
SET money = -50000, wife = -5, health = -5, threat = -5, rating = 5
WHERE event_id = 'school_flood' AND choice_index = 1;
