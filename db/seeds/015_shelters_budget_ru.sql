-- Approved Russian copy update; preserve choice indexes and gameplay effects.
UPDATE game_event_locales
SET title = 'Бюджет на бомбоубежища',
    description = 'Государство выделило огромную сумму на ремонт старых бомбоубежищ. Брат жены тут же открыл фирму по установке бронированных дверей. Безопасность города — дело семейное.'
WHERE event_id = 'shelters_budget' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚪 Отдать весь подряд брату жены'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛠️ Часть работ отдать ему, остальное распределить по честному конкурсу'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛡️ Провести честный открытый тендер'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'ru';
