-- Copy-only update: preserve event IDs, choice indexes and gameplay effects.
UPDATE game_event_locales
SET description = 'Застройщик просит закрыть глаза на три «лишних» этажа в проекте ТАМА 38 в центре города. Взамен обещает солидную сумму на ваш счёт в Швейцарии. Этажи лишние, деньги — нет.'
WHERE event_id = 'tama_38' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🌳 Обязать застройщика разбить парк в обмен на разрешение достроить этажи'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛑 Заблокировать стройку — пусть застройщик бесится'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'ru';
