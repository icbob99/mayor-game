-- Registration, sign-in and inactivity messages.
BEGIN TRANSACTION;

UPDATE game_locale_ui SET ui = json_set(ui, '$.auth', json('{
  "login": "Я мэр", "register": "Хочу быть мэром", "guest": "Хочу быть гостем",
  "nickname": "Ник", "password": "Пароль", "cancel": "Отмена", "working": "Подождите…",
  "warning": "Вы не играли 25 минут. Через 5 минут потребуется повторный вход.",
  "continue": "Продолжить", "expired": "Вы вышли из аккаунта после 30 минут бездействия. Войдите снова, чтобы продолжить.",
  "reauth": "Для связи с аккаунтом войдите снова. Локальная игра сохранена.",
  "invite": "Хочешь стать мэром? Зарегистрируйся и начни новую игру мэра.", "later": "Не сейчас",
  "nickname_taken": "Этот ник уже занят. Выберите другой.",
  "unknown_nickname": "Такого мэра нет. Можно зарегистрироваться через «Хочу быть мэром».",
  "invalid_credentials": "Неверный пароль.", "invalid_request": "Введите ник и пароль.",
  "server_unavailable": "Сервер недоступен. Попробуйте позже.", "auth_expired": "Войдите снова."
}')) WHERE lang = 'ru';

UPDATE game_locale_ui SET ui = json_set(ui, '$.auth', json('{
  "login": "I am a mayor", "register": "Become a mayor", "guest": "Play as a guest",
  "nickname": "Nickname", "password": "Password", "cancel": "Cancel", "working": "Please wait…",
  "warning": "You have been inactive for 25 minutes. You will be signed out in 5 minutes.",
  "continue": "Continue", "expired": "You were signed out after 30 minutes of inactivity. Sign in to continue.",
  "reauth": "Sign in again to reconnect your account. Your local game is saved.",
  "invite": "Want to become a mayor? Register to start a new mayor game.", "later": "Not now",
  "nickname_taken": "This nickname is taken. Choose another.",
  "unknown_nickname": "Mayor not found. You can register with Become a mayor.",
  "invalid_credentials": "Incorrect password.", "invalid_request": "Enter a nickname and password.",
  "server_unavailable": "Server unavailable. Try again later.", "auth_expired": "Please sign in again."
}')) WHERE lang = 'en';

UPDATE game_locale_ui SET ui = json_set(ui, '$.auth', json('{
  "login": "Я мер", "register": "Хочу бути мером", "guest": "Хочу бути гостем",
  "nickname": "Нік", "password": "Пароль", "cancel": "Скасувати", "working": "Зачекайте…",
  "warning": "Ви не грали 25 хвилин. Через 5 хвилин знадобиться повторний вхід.",
  "continue": "Продовжити", "expired": "Ви вийшли з облікового запису після 30 хвилин бездіяльності. Увійдіть знову, щоб продовжити.",
  "reauth": "Для зв’язку з обліковим записом увійдіть знову. Локальну гру збережено.",
  "invite": "Хочеш стати мером? Зареєструйся та почни нову гру мера.", "later": "Не зараз",
  "nickname_taken": "Цей нік уже зайнятий. Виберіть інший.",
  "unknown_nickname": "Такого мера немає. Можна зареєструватися через «Хочу бути мером».",
  "invalid_credentials": "Неправильний пароль.", "invalid_request": "Введіть нік і пароль.",
  "server_unavailable": "Сервер недоступний. Спробуйте пізніше.", "auth_expired": "Увійдіть знову."
}')) WHERE lang = 'uk';

UPDATE game_locale_ui SET ui = json_set(ui, '$.auth', json('{
  "login": "אני ראש עיר", "register": "רוצה להיות ראש עיר", "guest": "לשחק כאורח",
  "nickname": "כינוי", "password": "סיסמה", "cancel": "ביטול", "working": "נא להמתין…",
  "warning": "לא שיחקת במשך 25 דקות. בעוד 5 דקות תידרש כניסה מחדש.",
  "continue": "להמשיך", "expired": "נותקת לאחר 30 דקות ללא פעילות. יש להיכנס שוב כדי להמשיך.",
  "reauth": "יש להיכנס שוב כדי להתחבר לחשבון. המשחק המקומי נשמר.",
  "invite": "רוצה להיות ראש עיר? אפשר להירשם ולהתחיל משחק חדש כראש עיר.", "later": "לא עכשיו",
  "nickname_taken": "הכינוי כבר תפוס. יש לבחור כינוי אחר.",
  "unknown_nickname": "ראש העיר לא נמצא. אפשר להירשם דרך הכפתור רוצה להיות ראש עיר.",
  "invalid_credentials": "הסיסמה שגויה.", "invalid_request": "יש להזין כינוי וסיסמה.",
  "server_unavailable": "השרת אינו זמין. כדאי לנסות שוב מאוחר יותר.", "auth_expired": "יש להיכנס שוב."
}')) WHERE lang = 'he';

COMMIT;
