-- If recovery is approved, append as a new journal entry; preserve deployment history.
UPDATE game_event_locales
SET description = 'Прошел первый серьезный ливень, и центральная улица Вайцман уплыла. Бюджет на прочистку ливневок куда-то испарился, а местные паблики уже полощут твое имя.'
WHERE event_id = 'flooded_street' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💸 Срочно нанять фирму шурина без тендера для откачки воды втридорога'
WHERE event_id = 'flooded_street' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥾 Выйти в резиновых сапогах на камеру и лично копать ливневку'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'ru';

UPDATE game_event_locales
SET title = 'Скидки по Арноне для избранных',
    description = 'Журналисты выяснили, что бизнес вашего крупного спонсора получает 80% скидку на земельный налог (арнону).'
WHERE event_id = 'arnona_scandal' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤫 Замять дело через юридический отдел'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚖️ Аннулировать льготу и потребовать полный возврат'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚜 Отправить бульдозеры муниципии и снести незаконные постройки'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🌊 Цунами! Всё затопило, ресторан смыло, а мэр отличился на спасении утопающих'
WHERE event_id = 'beach_kiosk' AND choice_index = 2 AND lang = 'ru';
