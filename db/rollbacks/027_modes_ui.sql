-- Remove only keys introduced by the mode UI release.
UPDATE game_locale_ui SET ui=json_remove(ui, '$.modes', '$.titles.resignation', '$.titles.resignation_peak', '$.titles.indecision'),
    alerts=json_remove(alerts, '$.resignation', '$.indecision') WHERE lang IN ('ru','en','he','uk');
