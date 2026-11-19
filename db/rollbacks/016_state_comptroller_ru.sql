-- If recovery is approved, append this file to SQL_FILES and run apply.
-- Record compensation as a new journal entry; never erase the forward migration.
UPDATE game_event_locales
SET title = 'Проверка Госконтролера',
    description = 'В муниципалитет нагрянула проверка от Мевакер ха-Медина. Аудиторы требуют доступ к бухгалтерии за прошлый год.'
WHERE event_id = 'state_comptroller' AND lang = 'ru';

UPDATE game_choice_locales
SET text = '🐐 Сдать им мелкого чиновника как козла отпущения'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'ru';
