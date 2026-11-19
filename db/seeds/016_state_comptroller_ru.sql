-- Copy-only update: preserve event IDs, choice indexes and gameplay effects.
UPDATE game_event_locales
SET title = 'Проверка госконтролёра',
    description = 'В муниципалитет нагрянули аудиторы госконтролёра. Требуют бухгалтерские документы за прошлый год. Видимо, красивого отчёта о ваших успехах им недостаточно.'
WHERE event_id = 'state_comptroller' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🐐 Свалить всё на мелкого чиновника — вот и виноватый'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'ru';
