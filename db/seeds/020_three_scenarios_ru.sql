-- Approved Russian copy batch; preserve gameplay effects and event links.
UPDATE game_event_locales
SET description = 'Мэр соседнего города не простил слива. В крупном телеграм-канале вышло расследование про вашу «неучтённую» виллу в Кесарии и снимки жены в миланском бутике.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '💼 Заплатить блогерам — пусть объяснят, что вы просто хорошо экономили'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤐 Отмалчиваться'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'ru';

UPDATE game_event_locales
SET description = 'В бургерной вашего главного спонсора White Burger инспекторы нашли мясо, происхождением которого лучше не интересоваться. Требуют закрыть лавочку.'
WHERE event_id = 'shitty_burger' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🥩 Выдать лицензию задним числом'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'ru';

UPDATE game_event_locales
SET description = 'Жители светских районов взвыли: по субботам машины бросают так, что даже скорая не проедет. Оппозиция требует устроить облаву с эвакуаторами в субботу.'
WHERE event_id = 'shabbat_parking' AND lang = 'ru';
