-- If recovery is approved, append this file to SQL_FILES and run apply.
-- Record compensation as a new journal entry; never erase the forward migration.
UPDATE game_event_locales
SET title = 'Коалиционный кризис (Шаббат)',
    description = 'Религиозные партии угрожают развалить коалицию, если вы не закроете все парки и бизнесы в Шаббат. Жена очень любит гулять по субботам.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🕍 Уступить и закрыть всё (жена в бешенстве)'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🤝 Найти компромисс: закрыть в центре, открыть на окраинах'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🖕 Послать их: мы светский город!'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'ru';
