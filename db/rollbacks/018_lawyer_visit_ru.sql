-- If recovery is approved, append this file to SQL_FILES and run apply.
-- Record compensation as a new journal entry; never erase the forward migration.
UPDATE game_event_locales
SET description = 'Известный адвокат предлагает «потерять» пару неприятных папок на вас в Лахав 433 за солидный гонорар.'
WHERE event_id = 'lawyer_visit' AND lang = 'ru';
