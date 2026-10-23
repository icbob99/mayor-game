-- New scenarios: apartment renovation and wife's overseas real estate.
BEGIN TRANSACTION;

INSERT OR REPLACE INTO game_events (id, avatar, is_follow_up, repeat_policy, max_occurrences) VALUES
    ('apartment_renovation', '🛠️', 0, 'unlimited', NULL),
    ('renovation_leak', '📱', 1, 'follow-up', NULL),
    ('wife_real_estate', '🏡', 0, 'unlimited', NULL),
    ('tiberias_mockery', '🤡', 1, 'follow-up', NULL);

INSERT OR REPLACE INTO game_choices (event_id, choice_index, money, wife, health, threat, rating, next_event_id, delay_days) VALUES
    ('apartment_renovation', 0, 0, 20, 5, 0, 0, 'renovation_leak', 3),
    ('apartment_renovation', 1, -200000, -10, 0, 0, -15, NULL, NULL),
    ('apartment_renovation', 2, 0, -20, -10, -15, 15, NULL, NULL),
    ('renovation_leak', 0, -100000, 0, -5, 10, 0, NULL, NULL),
    ('renovation_leak', 1, 0, -5, -10, 15, -20, NULL, NULL),
    ('renovation_leak', 2, -50000, 5, -15, -5, 10, NULL, NULL),
    ('wife_real_estate', 0, -3000000, 30, 5, 25, -15, NULL, NULL),
    ('wife_real_estate', 1, -400000, 10, 0, 5, -5, NULL, NULL),
    ('wife_real_estate', 2, -80000, -25, -5, -10, 10, 'tiberias_mockery', 2),
    ('tiberias_mockery', 0, -50000, 0, -10, 35, -15, NULL, NULL),
    ('tiberias_mockery', 1, 0, -10, -15, -5, -20, NULL, NULL),
    ('tiberias_mockery', 2, -100000, 5, -20, 10, 10, NULL, NULL),
    ('tiberias_mockery', 3, -150000, 10, 10, -10, 15, NULL, NULL);

INSERT OR REPLACE INTO game_event_locales (event_id, lang, title, description) VALUES
    ('apartment_renovation', 'ru', 'Ремонт квартиры', 'Жена захотела сделать ремонт в квартире. Игрок выбирает между коррупцией, транжирством или жесткой экономией.'),
    ('apartment_renovation', 'en', 'Apartment Renovation', 'Your wife wants to renovate the apartment. You must choose between corruption, wasteful spending, and harsh austerity.'),
    ('apartment_renovation', 'he', 'שיפוץ הדירה', 'אשתך רוצה לשפץ את הדירה. עליך לבחור בין שחיתות, בזבוזנות וחיסכון קשוח.'),
    ('renovation_leak', 'ru', 'Слив ремонта от блогера', 'Блогер прознал про бесплатный элитный ремонт от городского подрядчика и слил фото в интернет.'),
    ('renovation_leak', 'en', 'Renovation Leak', 'A blogger discovered the free luxury renovation from a city contractor and leaked photos online.'),
    ('renovation_leak', 'he', 'הדלפת השיפוץ', 'בלוגר גילה על השיפוץ היוקרתי בחינם מקבלן עירוני והדליף תמונות לרשת.'),
    ('wife_real_estate', 'ru', 'Недвижимость за границей', 'Жена насмотрелась инстаграма и хочет купить домик в Италии.'),
    ('wife_real_estate', 'en', 'Overseas Real Estate', 'Your wife has been watching Instagram and wants to buy a little house in Italy.'),
    ('wife_real_estate', 'he', 'נדל״ן בחו״ל', 'אשתך ראתה יותר מדי אינסטגרם ורוצה לקנות בית קטן באיטליה.'),
    ('tiberias_mockery', 'ru', 'Насмешки: «Мэр — лох»', 'Блогер узнал про покупку старой квартиры в Тверии. Вышла разгромная статья: соседние мэры и полиция смеются над тобой.'),
    ('tiberias_mockery', 'en', 'Mockery: “The Mayor Is a Loser”', 'A blogger learned about the old apartment in Tiberias. A humiliating article appears, and neighboring mayors and the police laugh at you.'),
    ('tiberias_mockery', 'he', 'לעג: ״ראש העיר פראייר״', 'בלוגר גילה על רכישת הדירה הישנה בטבריה. כתבה משפילה מתפרסמת, וראשי הערים והמשטרה צוחקים עליך.');

INSERT OR REPLACE INTO game_choice_locales (event_id, choice_index, lang, text) VALUES
    ('apartment_renovation', 0, 'ru', '🛠️ Обратиться к знакомому подрядчику'),
    ('apartment_renovation', 1, 'ru', '💸 «Вот тебе, ни в чем не отказывай»'),
    ('apartment_renovation', 2, 'ru', '🚫 Принцип «Денег нет»'),
    ('apartment_renovation', 0, 'en', '🛠️ Call a contractor you know'),
    ('apartment_renovation', 1, 'en', '💸 “Here is the money. Spare no expense.”'),
    ('apartment_renovation', 2, 'en', '🚫 Stick to the “There is no money” principle'),
    ('apartment_renovation', 0, 'he', '🛠️ לפנות לקבלן מוכר'),
    ('apartment_renovation', 1, 'he', '💸 ״הנה הכסף, אל תחסכי בכלום״'),
    ('apartment_renovation', 2, 'he', '🚫 לדבוק בעיקרון ״אין כסף״'),
    ('renovation_leak', 0, 'ru', '💰 Заплатить блогеру за удаление поста'),
    ('renovation_leak', 1, 'ru', '🙈 Уйти в несознанку: «Это не моя квартира»'),
    ('renovation_leak', 2, 'ru', '⚖️ Подать в суд за клевету'),
    ('renovation_leak', 0, 'en', '💰 Pay the blogger to delete the post'),
    ('renovation_leak', 1, 'en', '🙈 Deny everything: “That is not my apartment”'),
    ('renovation_leak', 2, 'en', '⚖️ Sue for defamation'),
    ('renovation_leak', 0, 'he', '💰 לשלם לבלוגר כדי למחוק את הפוסט'),
    ('renovation_leak', 1, 'he', '🙈 להתכחש: ״זו לא הדירה שלי״'),
    ('renovation_leak', 2, 'he', '⚖️ לתבוע על לשון הרע'),
    ('wife_real_estate', 0, 'ru', '🏡 Купить очень дорогой дом на озере Комо'),
    ('wife_real_estate', 1, 'ru', '🏢 Купить двушку в Болгарии на Солнечном берегу'),
    ('wife_real_estate', 2, 'ru', '🏚️ «Где родился, там и пригодился» — квартира в Тверии'),
    ('wife_real_estate', 0, 'en', '🏡 Buy a very expensive house on Lake Como'),
    ('wife_real_estate', 1, 'en', '🏢 Buy a two-room apartment on Bulgaria’s Sunny Beach'),
    ('wife_real_estate', 2, 'en', '🏚️ “Home is where you were born” — a run-down apartment in Tiberias'),
    ('wife_real_estate', 0, 'he', '🏡 לקנות בית יקר מאוד באגם קומו'),
    ('wife_real_estate', 1, 'he', '🏢 לקנות דירת שני חדרים בסאני ביץ׳ בבולגריה'),
    ('wife_real_estate', 2, 'he', '🏚️ ״טוב מולדת״ — דירה מוזנחת בטבריה'),
    ('tiberias_mockery', 0, 'ru', '🥊 Нанять шпану через знакомого — побить блогера'),
    ('tiberias_mockery', 1, 'ru', '😤 Сжать зубы и стерпеть насмешки'),
    ('tiberias_mockery', 2, 'ru', '📢 Начать открытую информационную войну с недоброжелателями'),
    ('tiberias_mockery', 3, 'ru', '📰 Заказать платную хвалебную статью о себе'),
    ('tiberias_mockery', 0, 'en', '🥊 Hire thugs through a contact to beat up the blogger'),
    ('tiberias_mockery', 1, 'en', '😤 Grit your teeth and endure the mockery'),
    ('tiberias_mockery', 2, 'en', '📢 Start an open information war against your enemies'),
    ('tiberias_mockery', 3, 'en', '📰 Commission a flattering paid article about yourself'),
    ('tiberias_mockery', 0, 'he', '🥊 לשכור בריונים דרך מכר כדי להכות את הבלוגר'),
    ('tiberias_mockery', 1, 'he', '😤 לחרוק שיניים ולסבול את הלעג'),
    ('tiberias_mockery', 2, 'he', '📢 לפתוח מלחמת מידע גלויה נגד היריבים'),
    ('tiberias_mockery', 3, 'he', '📰 להזמין כתבת שבח בתשלום על עצמך');

COMMIT;
