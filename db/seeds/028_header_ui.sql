-- Labels for the compact profile and audio controls; existing fields stay intact.
UPDATE game_locale_ui SET ui = json_set(ui, '$.auth.profile', 'Профиль', '$.sound', 'Звук') WHERE lang = 'ru';
UPDATE game_locale_ui SET ui = json_set(ui, '$.auth.profile', 'Profile', '$.sound', 'Sound') WHERE lang = 'en';
UPDATE game_locale_ui SET ui = json_set(ui, '$.auth.profile', 'פרופיל', '$.sound', 'צליל') WHERE lang = 'he';
UPDATE game_locale_ui SET ui = json_set(ui, '$.auth.profile', 'Профіль', '$.sound', 'Звук') WHERE lang = 'uk';
