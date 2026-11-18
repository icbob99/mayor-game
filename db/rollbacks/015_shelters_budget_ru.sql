-- If recovery is approved, append this file to SQL_FILES and run apply.
-- Record compensation as a new journal entry; never erase the forward migration.
UPDATE game_event_locales
SET title = 'Бюджет на мамады (Бомбоубежища)',
    description = 'Государство выделило огромный бюджет на ремонт старых бомбоубежищ. Брат жены внезапно открыл фирму по установке бронированных дверей.'
WHERE event_id = 'shelters_budget' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚪 Отдать весь тендер брату жены'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛠️ Отдать ему только часть, остальное — честно'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛡️ Провести строгий независимый аудит'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'ru';
