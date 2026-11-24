-- Remove only the header title keys introduced by seed 034.
UPDATE game_locale_ui SET ui = json_remove(ui, '$.game_title', '$.game_title_short') WHERE lang IN ('en', 'he', 'ru', 'uk');
