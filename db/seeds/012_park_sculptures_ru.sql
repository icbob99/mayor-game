-- Copy-only update: preserve event IDs, choice indexes and gameplay effects.
UPDATE game_event_locales
SET description = 'Ваш близкий друг-скульптор предлагает украсить центральный парк своими абстрактными скульптурами из ржавого железа. За счёт города, конечно: дружба бесценна, а скульптуры — нет.'
WHERE event_id = 'park_sculptures' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎨 Утвердить смету — друг щедро поделится «авторским гонораром»'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Отклонить проект — жители не оценят металлолом на газонах'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'ru';
