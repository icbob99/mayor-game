-- Use with the previous frontend, only when the retirement schema rollback is safe.
UPDATE game_locale_ui SET ui = json_remove(ui, '$.end_victory', '$.end_score', '$.end_score_bonus', '$.titles.honorable_retirement', '$.achievements.unsinkable'),
 alerts = json_remove(alerts, '$.honorable_retirement') WHERE lang IN ('ru', 'he', 'en', 'uk');
