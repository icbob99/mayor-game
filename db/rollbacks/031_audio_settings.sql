-- Remove only the audio dialog labels added by seed 031.
UPDATE game_locale_ui SET ui = json_remove(ui, '$.audio') WHERE lang IN ('ru','en','he','uk');
