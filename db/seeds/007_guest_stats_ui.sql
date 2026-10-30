-- UI translations for the local guest profile and statistics (Phase 1A).
BEGIN TRANSACTION;

UPDATE game_locale_ui
SET ui = json_set(ui,
    '$.guest_stats_title', 'Guest statistics',
    '$.guest_stats_games', 'Games played',
    '$.guest_stats_max_money', 'Maximum money',
    '$.guest_stats_achievements', 'Achievements',
    '$.guest_stats_empty', 'No achievements yet',
    '$.guest_stats_close', 'Close'
)
WHERE lang = 'en';

UPDATE game_locale_ui
SET ui = json_set(ui,
    '$.guest_stats_title', 'Статистика гостя',
    '$.guest_stats_games', 'Сыграно игр',
    '$.guest_stats_max_money', 'Максимум денег',
    '$.guest_stats_achievements', 'Достижения',
    '$.guest_stats_empty', 'Достижений пока нет',
    '$.guest_stats_close', 'Закрыть'
)
WHERE lang = 'ru';

UPDATE game_locale_ui
SET ui = json_set(ui,
    '$.guest_stats_title', 'סטטיסטיקת אורח',
    '$.guest_stats_games', 'משחקים ששוחקו',
    '$.guest_stats_max_money', 'מקסימום כסף',
    '$.guest_stats_achievements', 'הישגים',
    '$.guest_stats_empty', 'אין הישגים עדיין',
    '$.guest_stats_close', 'סגירה'
)
WHERE lang = 'he';

COMMIT;
