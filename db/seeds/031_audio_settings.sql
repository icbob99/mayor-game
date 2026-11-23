-- Audio dialog labels; preserve all existing UI keys.
UPDATE game_locale_ui SET ui = json_set(ui, '$.audio', json('{"title":"Настройки звука","music":"Музыка","sfx":"Звуковые эффекты","enabled":"Вкл.","disabled":"Выкл.","volume":"Громкость","close":"Закрыть"}')) WHERE lang = 'ru';
UPDATE game_locale_ui SET ui = json_set(ui, '$.audio', json('{"title":"Audio settings","music":"Music","sfx":"Sound effects","enabled":"On","disabled":"Off","volume":"Volume","close":"Close"}')) WHERE lang = 'en';
UPDATE game_locale_ui SET ui = json_set(ui, '$.audio', json('{"title":"הגדרות שמע","music":"מוזיקה","sfx":"אפקטים קוליים","enabled":"פעיל","disabled":"כבוי","volume":"עוצמה","close":"סגירה"}')) WHERE lang = 'he';
UPDATE game_locale_ui SET ui = json_set(ui, '$.audio', json('{"title":"Налаштування звуку","music":"Музика","sfx":"Звукові ефекти","enabled":"Увімк.","disabled":"Вимк.","volume":"Гучність","close":"Закрити"}')) WHERE lang = 'uk';
