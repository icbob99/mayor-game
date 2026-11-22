-- Restore the locale shape preceding the compact header. Player data is untouched.
UPDATE game_locale_ui SET ui = json_remove(ui, '$.auth.profile', '$.sound') WHERE lang IN ('ru', 'en', 'he', 'uk');
