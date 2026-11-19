-- If recovery is approved, append this file to SQL_FILES and run apply.
-- Record compensation as a new journal entry; never erase the forward migration.
UPDATE game_event_locales
SET description = 'Бравые парни из Калансуа пришли на тендер по вывозу мусора в восточных районах и прозрачно намекнули, что без их «крыши» у мусоровозов могут пробиться колеса.'
WHERE event_id = 'garbage_extortion' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👮 Обратиться в полицию (официальное заявление)'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Согласиться и отдать им подряд на уборку'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚔️ Столкнуть их лбами: позвать конкурентов из Тайбе'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'ru';

UPDATE game_event_locales
SET description = 'Пара дней молчания закончилась: ночью на муниципальной стоянке сгорели три мусоровоза. На асфальте баллончиком написано «Привет из Калансуа». Половина города утопает в отходах.'
WHERE event_id = 'burning_trucks' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚛 Срочно выдать из бюджета на закупку новой техники'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🙈 Развести руками: денег нет, пусть воняет (народ в шоке)'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'ru';

UPDATE game_event_locales
SET description = 'Мэр соседней Хадеры звонит в панике: перед выборами срочно нужна «амута» (некоммерческая организация) для сбора пожертвований, просит подбросить на кампанию.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛑 Мягко отказать (денег нет, но вы держитесь)'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 2 AND lang = 'ru';
