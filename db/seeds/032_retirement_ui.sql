-- Add the retirement ending and achievements to the normalized UI locale source.
UPDATE game_locale_ui SET ui = json_set(ui,
 '$.end_victory', 'Почётная отставка', '$.end_score', 'Итоговый счёт мэра', '$.end_score_bonus', 'Почётная отставка: капитал ×1,5 при расчёте счёта.',
 '$.titles.honorable_retirement', '👑 Вечный мэр (Синдром Лужкова): ушёл на пасеку непобеждённым',
 '$.achievements.unsinkable', json('{"name":"Непотопляемый: выжил вопреки всему","desc":"Завершить полный срок почётной отставкой с 1–20% здоровья."}')),
 alerts = json_set(alerts, '$.honorable_retirement', 'Срок завершён. Вы уходите непобеждённым — город проводит, офшоры встретят.') WHERE lang = 'ru';

UPDATE game_locale_ui SET ui = json_set(ui,
 '$.end_victory', 'פרישה בכבוד', '$.end_score', 'ניקוד ראש העיר', '$.end_score_bonus', 'פרישה בכבוד: ההון מוכפל ב־1.5 בחישוב הניקוד.',
 '$.titles.honorable_retirement', '👑 ראש העיר הנצחי (תסמונת טדי קולק / חולדאי): פרש בשיא',
 '$.achievements.unsinkable', json('{"name":"בלתי ניתן להטבעה: שרד למרות הכל","desc":"לסיים כהונה מלאה בפרישה בכבוד עם 1–20% בריאות."}')),
 alerts = json_set(alerts, '$.honorable_retirement', 'הכהונה הסתיימה. אתם פורשים בשיא — העיר תיפרד, חשבונות האוף־שור יחכו.') WHERE lang = 'he';

UPDATE game_locale_ui SET ui = json_set(ui,
 '$.end_victory', 'Honorable Retirement', '$.end_score', 'Final Mayor Score', '$.end_score_bonus', 'Honorable retirement: capital counts ×1.5 toward your score.',
 '$.titles.honorable_retirement', '👑 Eternal Mayor (Teddy Kollek / Huldai Edition): Retired Undefeated',
 '$.achievements.unsinkable', json('{"name":"Unsinkable: Survived Against All Odds","desc":"Complete your full term and retire honorably with 1–20% health remaining."}')),
 alerts = json_set(alerts, '$.honorable_retirement', 'Your term is complete. You leave undefeated — the city waves goodbye, your offshore accounts welcome you.') WHERE lang = 'en';

UPDATE game_locale_ui SET ui = json_set(ui,
 '$.end_victory', 'Почесна відставка', '$.end_score', 'Підсумкові бали мера', '$.end_score_bonus', 'Почесна відставка: капітал ×1,5 під час підрахунку балів.',
 '$.titles.honorable_retirement', '👑 Вічний мер (Синдром Кличка): пішов на пенсію непереможеним',
 '$.achievements.unsinkable', json('{"name":"Непотоплюваний (Харківський стиль): вижив попри все","desc":"Завершити повний термін почесною відставкою з 1–20% здоров’я."}')),
 alerts = json_set(alerts, '$.honorable_retirement', 'Термін завершено. Ви йдете непереможеним — місто проводжає, офшори зустрічають.') WHERE lang = 'uk';
