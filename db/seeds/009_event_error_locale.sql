-- Localized game diagnostics.
BEGIN TRANSACTION;

UPDATE game_ui_locales SET alerts = json_set(alerts,
    '$.event_text_missing', 'Ошибка: не найден текст события "{id}" для языка {lang}',
    '$.achievement_text_missing', 'Ошибка: не найден перевод достижения "{id}" для языка {lang}',
    '$.perk_text_missing', 'Ошибка: не найден перевод покупки "{id}" для языка {lang}',
    '$.perk_unknown', 'Ошибка: неизвестная покупка "{id}"'
) WHERE lang = 'ru';

UPDATE game_ui_locales SET alerts = json_set(alerts,
    '$.event_text_missing', 'Error: no text found for event "{id}" in language {lang}',
    '$.achievement_text_missing', 'Error: no translation found for achievement "{id}" in language {lang}',
    '$.perk_text_missing', 'Error: no translation found for shop item "{id}" in language {lang}',
    '$.perk_unknown', 'Error: unknown shop item "{id}"'
) WHERE lang = 'en';

UPDATE game_ui_locales SET alerts = json_set(alerts,
    '$.event_text_missing', 'Помилка: не знайдено текст події "{id}" для мови {lang}',
    '$.achievement_text_missing', 'Помилка: не знайдено переклад досягнення "{id}" для мови {lang}',
    '$.perk_text_missing', 'Помилка: не знайдено переклад покупки "{id}" для мови {lang}',
    '$.perk_unknown', 'Помилка: невідома покупка "{id}"'
) WHERE lang = 'uk';

UPDATE game_ui_locales SET alerts = json_set(alerts,
    '$.event_text_missing', 'שגיאה: לא נמצא טקסט לאירוע "{id}" בשפה {lang}',
    '$.achievement_text_missing', 'שגיאה: לא נמצא תרגום להישג "{id}" בשפה {lang}',
    '$.perk_text_missing', 'שגיאה: לא נמצא תרגום לפריט בחנות "{id}" בשפה {lang}',
    '$.perk_unknown', 'שגיאה: פריט לא מוכר בחנות "{id}"'
) WHERE lang = 'he';

COMMIT;
