-- If recovery is approved, append this file to SQL_FILES and run apply.
-- Record compensation as a new journal entry; never erase the forward migration.
UPDATE game_event_locales
SET description = 'Застройщик просит закрыть глаза на три «лишних» этажа в проекте ТАМА 38 в центре города. Обещает занести солидную сумму в швейцарский банк.'
WHERE event_id = 'tama_38' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🌳 Заставить построить парк в обмен на этажи'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🛑 Заблокировать стройку (застройщик в ярости)'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'ru';
