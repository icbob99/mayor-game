-- The newspaper uses the game language; its error no longer refers to a language selector.
UPDATE game_locale_ui SET ui = json_set(ui, '$.newspaper_error', 'Не удалось подготовить газету. Перезагрузите страницу.') WHERE lang = 'ru';
UPDATE game_locale_ui SET ui = json_set(ui, '$.newspaper_error', 'Could not prepare the newspaper. Reload the page.') WHERE lang = 'en';
UPDATE game_locale_ui SET ui = json_set(ui, '$.newspaper_error', 'לא ניתן להכין את העיתון. טענו מחדש את הדף.') WHERE lang = 'he';
UPDATE game_locale_ui SET ui = json_set(ui, '$.newspaper_error', 'Не вдалося підготувати газету. Перезавантажте сторінку.') WHERE lang = 'uk';
