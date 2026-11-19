-- Approved Russian scenario revision; preserve choice indexes and gameplay effects.
UPDATE game_event_locales
SET title = 'Коалиционный кризис: шаббат',
    description = 'Религиозные партии требуют закрыть на шаббат торговые центры, кинотеатры и кантри-клубы, а заодно перекрыть улицы и въезды в город для машин. Иначе грозят развалить коалицию. Жена уже запланировала бассейн и покупки. Выходные обещают быть тихими только на дорогах.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🕍 Уступить всем требованиям — народ не поймёт, а дома ждут тяжёлые выходные'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Договориться: ограничения в центре, на окраинах всё работает и проезд свободен'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🖕 Послать их: «У нас светский город!»'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'ru';
