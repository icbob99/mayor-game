-- Add save-transfer UI texts to existing locale rows. Safe to apply again.
BEGIN TRANSACTION;

UPDATE game_locale_ui SET ui = json_set(ui, '$.saveSync', json('{
  "transfer_required": "Продолжить игру здесь?",
  "transfer_description": "Предыдущая игровая сессия будет отключена. Её неподтверждённый прогресс не будет объединён с выбранной игрой.",
  "save_conflict": "Какую игру продолжить?",
  "session_replaced": "Игра продолжена в другом окне или на другом устройстве. Чтобы вернуться сюда, войдите снова и подтвердите перенос.",
  "review": "Посмотреть варианты", "local": "На этом устройстве", "cloud": "В облаке",
  "use_local": "Оставить эту игру", "use_cloud": "Загрузить из облака", "confirm": "Продолжить здесь",
  "playing": "Игра продолжается", "finished": "Игра завершена", "new_game": "Новая игра",
  "changed": "Сохранение в облаке изменилось. Проверьте обновлённые данные и выберите снова.", "retry": "Повторить отправку"
}')) WHERE lang = 'ru';

UPDATE game_locale_ui SET ui = json_set(ui, '$.saveSync', json('{
  "transfer_required": "Continue playing here?",
  "transfer_description": "The previous game session will be disconnected. Its unsynced progress will not be merged with the game you choose.",
  "save_conflict": "Which game would you like to continue?",
  "session_replaced": "The game has moved to another window or device. To return here, sign in again and confirm the transfer.",
  "review": "Review options", "local": "On this device", "cloud": "In the cloud",
  "use_local": "Keep this game", "use_cloud": "Load cloud game", "confirm": "Continue here",
  "playing": "Game in progress", "finished": "Game finished", "new_game": "New game",
  "changed": "The cloud save has changed. Review the updated details and choose again.", "retry": "Retry sending"
}')) WHERE lang = 'en';

UPDATE game_locale_ui SET ui = json_set(ui, '$.saveSync', json('{
  "transfer_required": "Продовжити гру тут?",
  "transfer_description": "Попередню ігрову сесію буде відключено. Її несинхронізований прогрес не буде об’єднано з вибраною грою.",
  "save_conflict": "Яку гру продовжити?",
  "session_replaced": "Гру продовжено в іншому вікні або на іншому пристрої. Щоб повернутися сюди, увійдіть знову та підтвердьте перенесення.",
  "review": "Переглянути варіанти", "local": "На цьому пристрої", "cloud": "У хмарі",
  "use_local": "Залишити цю гру", "use_cloud": "Завантажити з хмари", "confirm": "Продовжити тут",
  "playing": "Гра триває", "finished": "Гру завершено", "new_game": "Нова гра",
  "changed": "Збереження у хмарі змінилося. Перевірте оновлені дані та виберіть знову.", "retry": "Повторити надсилання"
}')) WHERE lang = 'uk';

UPDATE game_locale_ui SET ui = json_set(ui, '$.saveSync', json('{
  "transfer_required": "להמשיך לשחק כאן?",
  "transfer_description": "הפעלת המשחק הקודמת תנותק. ההתקדמות שלא סונכרנה בה לא תמוזג עם המשחק שייבחר.",
  "save_conflict": "איזה משחק להמשיך?",
  "session_replaced": "המשחק נמשך בחלון אחר או במכשיר אחר. כדי לחזור לכאן, יש להתחבר מחדש ולאשר את ההעברה.",
  "review": "הצגת האפשרויות", "local": "במכשיר הזה", "cloud": "בענן",
  "use_local": "להמשיך במשחק הזה", "use_cloud": "לטעון את המשחק מהענן", "confirm": "להמשיך כאן",
  "playing": "המשחק נמשך", "finished": "המשחק הסתיים", "new_game": "משחק חדש",
  "changed": "השמירה בענן השתנתה. יש לבדוק את הפרטים המעודכנים ולבחור שוב.", "retry": "שליחה חוזרת"
}')) WHERE lang = 'he';

COMMIT;
