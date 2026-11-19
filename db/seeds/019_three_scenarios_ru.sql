-- Approved Russian scenario revision; preserve choice indexes and gameplay effects.
UPDATE game_event_locales
SET description = 'В мэрию пришли бравые парни из Калансуа. Намекнули: хотим мусор вывозить. Такое вот предложение — с гарантией неприятностей при отказе.'
WHERE event_id = 'garbage_extortion' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👮 Подать официальное заявление в полицию'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Согласиться и отдать им подряд на вывоз мусора'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚔️ Позвать конкурентов из Тайбе'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'ru';

UPDATE game_event_locales
SET description = 'Ночью на муниципальной стоянке сгорели три мусоровоза. Мусор некому вывозить, жители жалуются.'
WHERE event_id = 'burning_trucks' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚛 Выделить деньги из бюджета на новые мусоровозы'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Развести руками: денег нет'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'ru';

UPDATE game_event_locales
SET description = 'Звонит мэр соседнего города и просит помочь ему переизбраться.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛑 Мягко отказать: «Денег нет, но вы держитесь»'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 2 AND lang = 'ru';
