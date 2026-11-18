-- If recovery is approved, append this file to SQL_FILES and run apply.
-- Record compensation as a new journal entry; never erase the forward migration.
UPDATE game_event_locales
SET description = 'Подрядчик предлагает откатить за победу в тендере на «золотые» скамейки для парка. Жена тем временем намекает на новый пентхаус.'
WHERE event_id = 'bench_tender' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🧳 Взять всё! Отдать подряд кузену'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'ru';

UPDATE game_choice_locales
SET text = '👜 Взять умеренно через фиктивную контору'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'ru';
