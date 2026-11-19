-- Approved Russian copy batch; preserve gameplay effects and event links.
UPDATE game_event_locales
SET description = 'Прошёл первый серьёзный ливень, и центральная улица Вайцман уплыла. Деньги на прочистку ливнёвок испарились ещё до дождя, а местные паблики уже полощут ваше имя.'
WHERE event_id = 'flooded_street' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💸 Нанять фирму шурина без тендера — свои не сольют'
WHERE event_id = 'flooded_street' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥾 Надеть резиновые сапоги и лично прочищать ливнёвку перед камерами'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'ru';

UPDATE game_event_locales
SET title = 'Налоговые скидки для избранных',
    description = 'Журналисты выяснили: бизнес вашего крупного спонсора получил скидку 80% на муниципальный налог. Видимо, за скромность.'
WHERE event_id = 'arnona_scandal' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤫 Замять дело — юристы найдут нужную формулировку'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '⚖️ Отменить льготу и взыскать недоплаченное'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚜 Отправить бульдозеры мэрии и снести незаконные постройки'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🌊 Цунами смыло ресторан — ни себе ни людям'
WHERE event_id = 'beach_kiosk' AND choice_index = 2 AND lang = 'ru';
