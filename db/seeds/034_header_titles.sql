-- Localized full and compact header titles; preserve all other UI fields.
UPDATE game_locale_ui SET ui = json_set(ui, '$.game_title', 'Mayor: Chronicles of Embezzlement', '$.game_title_short', 'Mayor') WHERE lang = 'en';
UPDATE game_locale_ui SET ui = json_set(ui, '$.game_title', 'ראש העיר: יומני השחיתות', '$.game_title_short', 'ראש העיר') WHERE lang = 'he';
UPDATE game_locale_ui SET ui = json_set(ui, '$.game_title', 'Мэр: Хроники распила', '$.game_title_short', 'Мэр') WHERE lang = 'ru';
UPDATE game_locale_ui SET ui = json_set(ui, '$.game_title', 'Мер: Хроніки розпилу', '$.game_title_short', 'Мер') WHERE lang = 'uk';
