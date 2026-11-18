-- If recovery is approved, append this file to SQL_FILES and run apply.
-- This is a compensating migration with its own journal entry; never erase 012's history.
UPDATE game_event_locales
SET description = 'Ваш близкий друг-скульптор предлагает уставить центральный городской парк своими абстрактными статуями из ржавого железа за счет бюджета.'
WHERE event_id = 'park_sculptures' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🎨 Подписать смету! Друг щедро поделится «авторским гонораром»'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🚫 Отклонить проект — жители не поймут ржавые железки среди газонов'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'ru';
