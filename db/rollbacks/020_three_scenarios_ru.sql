-- If recovery is approved, append as a new journal entry; preserve deployment history.
UPDATE game_event_locales
SET description = 'Мэр соседней Хадеры не простил слива. В крупном телеграм-канале вышло расследование про твою «неучтенную» виллу в Кесарии и снимки твоей жены в миланском бутике.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💼 Выделить на «блогеров-защитников» для зачистки инфополя'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤐 Отмалчиваться (рейтинг рушится, Лахав 433 проявляет интерес)'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'ru';

UPDATE game_event_locales
SET description = 'В новой бургерной *White Burger*, принадлежащей твоему главному спонсору, инспекторы нашли мясо крайне сомнительного происхождения. Требуют закрыть лавочку.'
WHERE event_id = 'shitty_burger' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥩 Выдать лицензию задним числом за счет заведения'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'ru';

UPDATE game_event_locales
SET description = 'Жители светских районов взвыли: по субботам всё заставлено машинами так, что скорая не проедет. Оппозиция требует устроить облаву с эвакуаторами.'
WHERE event_id = 'shabbat_parking' AND lang = 'ru';
