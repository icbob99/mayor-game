-- Recovery only: append as a new deployment entry if approved; preserve history.

-- bench_tender
UPDATE game_event_locales
SET title = 'מכרז על ספסלים',
    description = 'קבלן מציע עמלה על זכייה במכרז לספסלי יוקרה בפארק. אשתך רומזת על פנטהאוז חדש.'
WHERE event_id = 'bench_tender' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🧳 לקחת הכל! לתת את המכרז לבן דוד'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '👜 לקחת סכום מתון דרך חברת קש'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '❌ לסרב ולקיים מכרז הוגן'
WHERE event_id = 'bench_tender' AND choice_index = 2 AND lang = 'he';

-- tama_38
UPDATE game_event_locales
SET title = 'קומבינות בתמ"א 38',
    description = 'יזם מבקש להעלים עין משלוש קומות "מיותרות" בפרויקט תמ"א 38 במרכז העיר. מבטיח להעביר סכום נכבד לחשבון בשווייץ.'
WHERE event_id = 'tama_38' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏗️ לחתום על האישור בעיניים עצומות'
WHERE event_id = 'tama_38' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🌳 לאלץ אותו לבנות פארק בתמורה לקומות'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛑 לעצור את הבנייה (היזם זועם)'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'he';

-- shelters_budget
UPDATE game_event_locales
SET title = 'תקציב לממ"דים',
    description = 'המדינה הקצתה תקציב ענק לשיפוץ ממ"דים ישנים. גיסך פתח לפתע חברה להתקנת דלתות פלדה.'
WHERE event_id = 'shelters_budget' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚪 לתת את כל המכרז לגיסך'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛠️ לתת לו רק חלק, והשאר - ביושר'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛡️ לערוך ביקורת חיצונית קפדנית'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'he';

-- state_comptroller
UPDATE game_event_locales
SET title = 'ביקורת מבקר המדינה',
    description = 'ביקורת פתע של מבקר המדינה בעירייה. הרואי חשבון דורשים גישה לספרי החשבונות של השנה שעברה.'
WHERE event_id = 'state_comptroller' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💰 לשחד את רואה החשבון הראשי'
WHERE event_id = 'state_comptroller' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🔥 לארגן שריפה "מקרית" בארכיון'
WHERE event_id = 'state_comptroller' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🐐 להקריב פקיד זוטר כשעיר לעזאזל'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'he';

-- shabbat_blackmail
UPDATE game_event_locales
SET title = 'משבר קואליציוני (שבת)',
    description = 'המפלגות הדתיות מאיימות לפרק את הקואליציה אם לא תסגור את כל הפארקים והעסקים בשבת. אשתך מאוד אוהבת לטייל בשבתות.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🕍 להיכנע ולסגור הכל (אשתך רותחת)'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 למצוא פשרה: לסגור במרכז, לפתוח בשוליים'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🖕 לשלוח אותם לעזאזל: אנחנו עיר חילונית!'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'he';

-- lawyer_visit
UPDATE game_event_locales
SET title = 'ביקור של עורך דין מקושר',
    description = 'עורך דין מוכר מציע "לאבד" כמה תיקים לא נעימים עליך בלהב 433 תמורת שכר טרחה שמן.'
WHERE event_id = 'lawyer_visit' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💼 לשלם ולישון בשקט'
WHERE event_id = 'lawyer_visit' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 לבקש הנחה'
WHERE event_id = 'lawyer_visit' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '❌ לגרש אותו: "אני ראש עיר ישר!"'
WHERE event_id = 'lawyer_visit' AND choice_index = 2 AND lang = 'he';

-- garbage_extortion
UPDATE game_event_locales
SET title = 'פרוטקשן על אשפה',
    description = 'חבר''ה קשוחים מקלנסווה הגיעו למכרז פינוי האשפה ורמזו בעדינות שבלי ה''חסות'' שלהם למשאיות יהיו פנצ''רים.'
WHERE event_id = 'garbage_extortion' AND lang = 'he';

UPDATE game_choice_locales
SET text = '👮 לפנות למשטרה (תלונה רשמית)'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 להסכים ולמסור לידיהם את קו הפינוי'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🗣️ להעמיד פנים שאתה לא מבין ערבית'
WHERE event_id = 'garbage_extortion' AND choice_index = 2 AND lang = 'he';

UPDATE game_choice_locales
SET text = '⚔️ לסכסך ביניהם: לקרוא למתחרים מטייבה'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'he';

-- burning_trucks
UPDATE game_event_locales
SET title = 'משאיות האשפה הבוערות',
    description = 'כמה ימים של שקט הגיעו לסיומם: בלילה נשרפו שלוש משאיות אשפה בחניון העירוני. על האספלט רוססו המילים "דרישת שלום מקלנסווה". חצי עיר טובעת בזבל.'
WHERE event_id = 'burning_trucks' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚛 להקצות בדחיפות מהתקציב לרכישת כלי רכב חדשים'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 להרים ידיים: אין כסף, שיסריח (התושבים בהלם)'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'he';

-- neighbor_mayor_amuta
UPDATE game_event_locales
SET title = 'עזרה אחים לעמית',
    description = 'ראש עיריית חדרה מתקשר בפאניקה: לקראת הבחירות חייבים ''עמותה'' לגיוס תרומות, ומבקש שתעזור במימון הקמפיין.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💰 להשקיע בגדול דרך קרן קש'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🪙 לתת קצת, רק כדי לצאת ידי חובה'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛑 לסרב בעדינות (אין תקציב)'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 2 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📰 להדליף את החומר עליו לערוץ הטלגרם המקומי'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 3 AND lang = 'he';

-- kompromat_retaliation
UPDATE game_event_locales
SET title = 'מתקפת נגד תקשורתית',
    description = 'ראש עיריית חדרה לא סלח לך על ההדלפה. בערוץ טלגרם גדול פורסם תחקיר על הווילה "הלא מדווחת" שלך בקיסריה, לצד תמונות של אשתך בבוטיק במילאנו.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💼 להקצות ל"בלוגרים מטעמך" כדי לטהר את השיח'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤐 לשתוק (האהדה צונחת, ולהב 433 מתחילים להתעניין)'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'he';

-- shitty_burger
UPDATE game_event_locales
SET title = 'השערוריה ב-White Burger',
    description = 'במסעדה החדשה *White Burger* של התורם הראשי שלך נתפסו בשרים מוטלים בספק. הפקחים דורשים לסגור את המקום.'
WHERE event_id = 'shitty_burger' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🥩 להוציא רישיון רטרואקטיבית על חשבון המערכת'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📸 לעשות יח"צ: לטרוף המבורגר מול המצלמות'
WHERE event_id = 'shitty_burger' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '❌ לסגור את המקום ולזרוק את התורם לכל הרוחות'
WHERE event_id = 'shitty_burger' AND choice_index = 2 AND lang = 'he';

-- shabbat_parking
UPDATE game_event_locales
SET title = 'גיהנום החניה בשבת',
    description = 'תושבי השכונות החילוניות זועמים: בשבת הכל חסום ואמבולנס לא יכול לעבור. האופוזיציה דורשת לפנות רכבים באגרסיביות.'
WHERE event_id = 'shabbat_parking' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚜 לשלוח פקחים וגרורים על הבוקר'
WHERE event_id = 'shabbat_parking' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 לא לעשות כלום — לא להרוס לאנשים את השבת'
WHERE event_id = 'shabbat_parking' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🅿️ לצבוע לבן-כחול מתחת לחלונות של הרב'
WHERE event_id = 'shabbat_parking' AND choice_index = 2 AND lang = 'he';

-- flooded_street
UPDATE game_event_locales
SET title = 'ההצפה ברחוב ויצמן',
    description = 'הגשם הרציני הראשון ירד, ורחוב ויצמן המרכזי הפך לנהר. התקציב לניקוי ניקוזים נעלם לאן שהוא, והעמודים המקומיים כבר קורעים לגזרים את השם שלך.'
WHERE event_id = 'flooded_street' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🌞 להאשים את מזג האוויר הקיצוני והתחממות גלובלית'
WHERE event_id = 'flooded_street' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '💸 לשכור בדחיפות חברה של הגיס ללא מכרז לשאיבת מים במחיר מופקע'
WHERE event_id = 'flooded_street' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🥾 לצאת במגפיים מול המצלמות ולחפור לבד בניקוז'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'he';

-- arnona_scandal
UPDATE game_event_locales
SET title = 'שערוריית הנחת הארנונה',
    description = 'עיתונאים גילו שתורם מרכזי לקמפיין שלך מקבל 80% הנחה בארנונה לעסקים.'
WHERE event_id = 'arnona_scandal' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤫 להשתיק את העניין דרך המחלקה המשפטית'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📉 להפחית את ההנחה ל-30% למראית עין'
WHERE event_id = 'arnona_scandal' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '⚖️ לבטל את ההנחה ולדרוש תשלום מלא'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'he';

-- beach_kiosk
UPDATE game_event_locales
SET title = 'שתלטנות על החוף העירוני',
    description = 'בעל מסעדת חוף השתלט ללא היתר על 200 מטרים של קו החוף והציב מיטות שיזוף בתשלום.'
WHERE event_id = 'beach_kiosk' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🍹 לקחת שוחד ושולחן VIP קבוע'
WHERE event_id = 'beach_kiosk' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚜 לשלוח דחפורים עירוניים ולהרוס מבנים בלתי חוקיים'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🌊 צונאמי! הכול הוצף, המסעדה נסחפה, וראש העיר הצטיין בחילוץ טובעים.'
WHERE event_id = 'beach_kiosk' AND choice_index = 2 AND lang = 'he';

-- electric_scooters
UPDATE game_event_locales
SET title = 'כאוס הקורקינטים החשמליים',
    description = 'התושבים זועמים על קורקינטים שחוסמים מדרכות ומסכנים הולכי רגל.'
WHERE event_id = 'electric_scooters' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛴 לגבות דמי רישוי גבוהים מחברות ההשכרה'
WHERE event_id = 'electric_scooters' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לאסור לחלוטין קורקינטים שיתופיים במרכז העיר'
WHERE event_id = 'electric_scooters' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🅿️ לסמן תאי חנייה מוגדרים ברחבי העיר'
WHERE event_id = 'electric_scooters' AND choice_index = 2 AND lang = 'he';

-- stadium_naming
UPDATE game_event_locales
SET title = 'זכויות שם האצטדיון',
    description = 'אוליגרך מבקש לקרוא לאצטדיון העירוני על שם החברה המסחרית שלו.'
WHERE event_id = 'stadium_naming' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💰 לחתום על חוזה ל-10 שנים ולגרוף עמלה'
WHERE event_id = 'stadium_naming' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏛️ לשמור על השם ההיסטורי של האצטדיון'
WHERE event_id = 'stadium_naming' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏅 לקרוא לאצטדיון על שם ראש העיר הקודם.'
WHERE event_id = 'stadium_naming' AND choice_index = 2 AND lang = 'he';

-- sewage_overflow
UPDATE game_event_locales
SET title = 'פיצוץ בצינור הביוב המרכזי',
    description = 'צינור הביוב הראשי התפוצץ והציף את הטיילת בשפכים.'
WHERE event_id = 'sewage_overflow' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛠️ להקצות תקציב חירום לתיקון מקיף'
WHERE event_id = 'sewage_overflow' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 לטעון שמדובר ב"עבודות תחזוקה שוטפות"'
WHERE event_id = 'sewage_overflow' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📞 לפנות לחברה של האח.'
WHERE event_id = 'sewage_overflow' AND choice_index = 2 AND lang = 'he';

-- friday_country_club
UPDATE game_event_locales
SET title = 'מפגשי יום שישי בקאנטרי',
    description = 'בכל יום שישי ב-8:00 בבוקר אתה יושב ליד הבריכה בקאנטרי. תור של תושבים ומכרים מגיע עם "בקשות קטנות".'
WHERE event_id = 'friday_country_club' AND lang = 'he';

UPDATE game_choice_locales
SET text = '☕ לסגור פינות לאנשי עסקים תמורת "תרומות"'
WHERE event_id = 'friday_country_club' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 לעזור לתושבים פשוטים עם ארנונה וגנים על חשבון העירייה'
WHERE event_id = 'friday_country_club' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לתלות שלט "ראש העיר בחופש" וללכת לסאונה'
WHERE event_id = 'friday_country_club' AND choice_index = 2 AND lang = 'he';

-- country_cctv_raid
UPDATE game_event_locales
SET title = 'פשיטה על מצלמות הקאנטרי',
    description = 'חוקרי להב 433 הגיעו להנהלת הקאנטרי ודורשים את שרתי מצלמות האבטחה מיום שישי האחרון.'
WHERE event_id = 'country_cctv_raid' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💾 לשרוף את ארון השרתים ולהאשים "קצר חשמלי"'
WHERE event_id = 'country_cctv_raid' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '😬 למסור את הדיסק-און-קי ולקוות לטוב (+25% איום)'
WHERE event_id = 'country_cctv_raid' AND choice_index = 1 AND lang = 'he';

-- kindergarten_favor
UPDATE game_event_locales
SET title = 'פרוטקציה בגן הילדים',
    description = 'חבר ילדות קרוב מגיע אליך למשרד ומבקש להעביר בדחיפות את הילד שלו לגן היוקרתי במרכז העיר, למרות שההרשמה סגורה.'
WHERE event_id = 'kindergarten_favor' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💥 להעיף מנהל אגף חינוך שלא הסכים, להזיז ילד אחר ולסגור עניין'
WHERE event_id = 'kindergarten_favor' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤫 להבטיח ''אני אטפל בזה אישית'' ולא לעשות כלום (החבר יגלה בהמשך)'
WHERE event_id = 'kindergarten_favor' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 להגיד לו ''חוק זה חוק'' ולזרוק אותו מהמשרד (נפרדים מילדות)'
WHERE event_id = 'kindergarten_favor' AND choice_index = 2 AND lang = 'he';

-- metro_depot
UPDATE game_event_locales
SET title = 'הקמת דפו מטרו בעיר',
    description = 'משרד התחבורה מציע להקים דפו מטרו ענקי בשטח העיר. הקבלנים נלהבים, אך התושבים זועמים על הרעש והעבודות.'
WHERE event_id = 'metro_depot' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏗️ להסכים לפרויקט! מעמד פרויקט לאומי יכסה מול המשטרה והקבלנים יודו לך'
WHERE event_id = 'metro_depot' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚜 להסכים, אך להזיז את הדפו לשולי העיר — ליד שילוב הוילות של ראש האופוזיציה'
WHERE event_id = 'metro_depot' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לחסום את הפרויקט בבית משפט למען השקט של התושבים'
WHERE event_id = 'metro_depot' AND choice_index = 2 AND lang = 'he';

-- bagrut_success
UPDATE game_event_locales
SET title = 'רפורמה בבחינות הבגרות',
    description = 'יש הזדמנות להעלות את אחוז הזכאים לבגרות לשיא עירוני, אך אגף החינוך דורש תקציב עתק לתגבורים ומעבדות.'
WHERE event_id = 'bagrut_success' AND lang = 'he';

UPDATE game_choice_locales
SET text = '📚 להקצות תקציב מקסימלי! הצלחת התלמידים תרים את המורל ואת האהדה'
WHERE event_id = 'bagrut_success' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 להשאיר את המצב כפי שהוא, שילמדו לפי התוכנית הרגילה'
WHERE event_id = 'bagrut_success' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '✂️ לקצץ בתקציב החינוך ולהעביר את החיסכון לקופה הפרטית'
WHERE event_id = 'bagrut_success' AND choice_index = 2 AND lang = 'he';

-- park_sculptures
UPDATE game_event_locales
SET title = 'אמנות מודרנית בפארק העירוני',
    description = 'חבר קרוב שהוא פסל מציע להציב בפארק המרכזי פסלי ברזל מופשטים בעלות עתק על חשבון העירייה.'
WHERE event_id = 'park_sculptures' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎨 לחתום על התקציב! החבר יחלוק איתך ''דמי אמנות'' נדיבים'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לדחות את ההצעה — התושבים לא יבינו מה גרוטאות ברזל עושות על הדשא'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏛️ להכריז על תחרות פתוחה לאמנים צעירים מהעיר'
WHERE event_id = 'park_sculptures' AND choice_index = 2 AND lang = 'he';

-- yom_haatzmaut
UPDATE game_event_locales
SET description = 'האירוע הגדול של השנה! ספונסרים העבירו מיליונים להופעות, זיקוקים ואוכל. המשטרה לא מתערבת בחג.'
WHERE event_id = 'yom_haatzmaut' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎉 להוסיף כסף מהקופה ולעשות חג מטורף! התושבים והאישה בעננים'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🍿 להוציא בדיוק מה שהספונסרים נתנו, ולקחת קצת עודף לכיס'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤑 להתקמצן: לגרוף את כל כספי החסויות ולהשאיר לתושבים רק דגלונים זולים'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 2 AND lang = 'he';

-- wife_dog_park
UPDATE game_event_locales
SET description = 'אשתך רוצה כלב, אבל בשכונה אין גינת כלבים.'
WHERE event_id = 'wife_dog_park' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🐕 לסדר דרך חבר: למסור לו את בניית המתחם ולקבל כלב גזעי, שובר למזון ומאלף'
WHERE event_id = 'wife_dog_park' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏗️ לערוך מכרז ציבורי מסודר לגינת הכלבים'
WHERE event_id = 'wife_dog_park' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙅 לסרב: כלב הוא אחריות גדולה מדי וזה פשוט «לא בשבילה»'
WHERE event_id = 'wife_dog_park' AND choice_index = 2 AND lang = 'he';

-- cat_exhibition
UPDATE game_event_locales
SET title = 'תערוכת חתולים',
    description = 'אשתך הכירה מועדון מקומי של חובבי חתולים ומבקשת לארגן תערוכה עירונית.'
WHERE event_id = 'cat_exhibition' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🐈 למסור את הארגון למפיק חבר תמורת שוחד'
WHERE event_id = 'cat_exhibition' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📋 להקצות תקציב ולערוך תחרות פתוחה'
WHERE event_id = 'cat_exhibition' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤧 לטעון שלראש העיר יש אלרגיה לפרווה ולסגור את הנושא'
WHERE event_id = 'cat_exhibition' AND choice_index = 2 AND lang = 'he';

-- lgbt_parade
UPDATE game_event_locales
SET title = 'מצעד הגאווה ברחוב וייצמן',
    description = 'המארגנים מבקשים אישור לקים את מצעד הגאווה ברחוב המרכזי. הנושא מחולל סערה בעיר.'
WHERE event_id = 'lgbt_parade' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏳️‍🌈 לאשר בוייצמן! הספונסרים יודו לך והתושבים הליברלים בעננים'
WHERE event_id = 'lgbt_parade' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎪 להקצות מתחם סגור באזור התעשייה כדי לא לפגוע ברגשות הדתיים'
WHERE event_id = 'lgbt_parade' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 להצהיר ''אני סטרייט, לא יהיו כאן מצעדים!'''
WHERE event_id = 'lgbt_parade' AND choice_index = 2 AND lang = 'he';

-- lgbt_coalition_crisis
UPDATE game_event_locales
SET title = 'משבר בקואליציה',
    description = 'השותפים הדתיים בקואליציה זועמים על המצעד ודורשים לסגור מיידית את מועדון הקהילה בעיר.'
WHERE event_id = 'lgbt_coalition_crisis' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🔒 לסגור את המועדון ולהיכנע לתרגיל הקואליציוני'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚚 להעביר את המועדון לאזור התעשייה על חשבון העירייה'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏢 לפתוח מועדון נוסף בלב השכונה הדתית (המארגנים ישלמו יפה)'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 2 AND lang = 'he';

-- mayors_strip_club
UPDATE game_event_locales
SET title = 'סערת מועדון החשפנות',
    description = 'אחרי כנס ראשי הערים הלכתם לחגוג במועדון חשפנות. התקשורת גילתה וחוגגת על החשבון.'
WHERE event_id = 'mayors_strip_club' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 להכחיש הכל: ''זה לא אני, תמונה מעובדת!'''
WHERE event_id = 'mayors_strip_club' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '⚖️ לשכור עורך דין צמרת שיסגור את הסיפור מול הכתבים'
WHERE event_id = 'mayors_strip_club' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📸 להדליף לתקשורת תמונות מביכות של ראשי ערים אחרים מהאירוע'
WHERE event_id = 'mayors_strip_club' AND choice_index = 2 AND lang = 'he';

-- mayors_revenge
UPDATE game_event_locales
SET title = 'נקמת ראשי הערים',
    description = 'ראשי הערים השכנות גילו שאתה זה שהדליף את התמונות שלהם לתקשורת, והחליטו לאחד כוחות נגדך.'
WHERE event_id = 'mayors_revenge' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💸 לשלם פיצויים לקרן המשותפת של הרשויות'
WHERE event_id = 'mayors_revenge' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛡️ להתעלם מהאיומים ולחסום פרויקטים עירוניים משותפים'
WHERE event_id = 'mayors_revenge' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎉 לארגן מסיבת פיוס סגורה ומפוארת עם כיבוד עשיר'
WHERE event_id = 'mayors_revenge' AND choice_index = 2 AND lang = 'he';

-- son_wedding
UPDATE game_event_locales
SET title = 'חתונת הבן',
    description = 'הבן שלך מתחתן. אירוע מרגש ונקודת ציון חשובה לכל המשפחה.'
WHERE event_id = 'son_wedding' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏰 לארגן חתונה מפוארת: כיסוי מעולה לפגישות אנשי שלומנו ואיסוף מעטפות'
WHERE event_id = 'son_wedding' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🕊️ שהילדים יארגנו הכל לבד, העירייה לא מתערבת'
WHERE event_id = 'son_wedding' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🥂 אירוע צנוע לבני משפחה קרובים בלבד על חשבונך הפרטי'
WHERE event_id = 'son_wedding' AND choice_index = 2 AND lang = 'he';

-- wedding_investigation
UPDATE game_event_locales
SET title = 'תחקיר החתונה',
    description = 'עיתונאים גילו שבחסות החתונה המפוארת של הבן הועברו אליך שוחד ומעטפות מאינטרסנטים.'
WHERE event_id = 'wedding_investigation' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 לשכור ''מאכער'' שיסגור עניין מול המערכת'
WHERE event_id = 'wedding_investigation' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🔥 להצית את בית הדפוס / מערכת העיתון'
WHERE event_id = 'wedding_investigation' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 להתעלם מהתחקיר ולטעון שמדובר ברדיפה'
WHERE event_id = 'wedding_investigation' AND choice_index = 2 AND lang = 'he';

-- father_funeral
UPDATE game_event_locales
SET title = 'שבעה והלוויית האב',
    description = 'טרגדיה במשפחה: אביך הלך לעולמו. זמן לשבעה וקבלת מנחמים.'
WHERE event_id = 'father_funeral' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🕯️ לקבל אנשים חשובים בשבעה: כולם מתחשבים באבל והעניינים זורמים'
WHERE event_id = 'father_funeral' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '👥 לקבל קולגות וקרובים ללא שיחות ביזנס'
WHERE event_id = 'father_funeral' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🔒 לסגור את השבעה למשפחה גרעינית בלבד'
WHERE event_id = 'father_funeral' AND choice_index = 2 AND lang = 'he';

-- father_monument_offer
UPDATE game_event_locales
SET title = 'מצבה מהיזמים',
    description = 'יזמים חזקים שהגיעו לנחם מציעים לממן מכיסם מצבה מפוארת ויוקרתית לאביך.'
WHERE event_id = 'father_monument_offer' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🪦 לקבל את ההצעה: לאבא מגיעה המצבה הכי גדולה בבית העלמין'
WHERE event_id = 'father_monument_offer' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📐 לקבל עזרה, אך להקים מצבה צנועה ומכובדת'
WHERE event_id = 'father_monument_offer' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לסרב ולהקים מצבה מכיסך הפרטי בלבד'
WHERE event_id = 'father_monument_offer' AND choice_index = 2 AND lang = 'he';

-- daughter_school
UPDATE game_event_locales
SET title = 'הבת עולה לכיתה א''',
    description = 'שיבוץ הכיתות לשנת הלימודים. הגיע הזמן להחליט עם מי תלמד הבת שלך.'
WHERE event_id = 'daughter_school' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏫 לשבץ אותה בכיתה עם הילדים של האנשים הנכונים והאנשי עסקים'
WHERE event_id = 'daughter_school' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎒 כיתה רגילה: אצלנו כל הילדים וההורים שווים'
WHERE event_id = 'daughter_school' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎓 לרשום אותה לבית ספר פרטי ויוקרתי'
WHERE event_id = 'daughter_school' AND choice_index = 2 AND lang = 'he';

-- school_flood
UPDATE game_event_locales
SET title = 'הצפה בבית הספר',
    description = 'צינור ראשי התפוצץ בבית הספר של הבת, הכיתות מוצפות לחלוטין.'
WHERE event_id = 'school_flood' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 ההורים הנכונים מהכיתה יפתרו הכל במהירות ויביאו תרומה'
WHERE event_id = 'school_flood' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏗️ שיפוץ עירוני דרך מכרז (בית הספר ייסגר לחודש)'
WHERE event_id = 'school_flood' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛠️ לתקן הכל מיידית מכיסך הפרטי'
WHERE event_id = 'school_flood' AND choice_index = 2 AND lang = 'he';

-- apartment_renovation
UPDATE game_event_locales
SET description = 'אשתך רוצה לשפץ את הדירה. עליך לבחור בין שחיתות, בזבוזנות וחיסכון קשוח.'
WHERE event_id = 'apartment_renovation' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛠️ לפנות לקבלן מוכר'
WHERE event_id = 'apartment_renovation' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '💸 ״הנה הכסף, אל תחסכי בכלום״'
WHERE event_id = 'apartment_renovation' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לדבוק בעיקרון ״אין כסף״'
WHERE event_id = 'apartment_renovation' AND choice_index = 2 AND lang = 'he';

-- renovation_leak
UPDATE game_event_locales
SET title = 'הדלפת השיפוץ',
    description = 'בלוגר גילה על השיפוץ היוקרתי בחינם מקבלן עירוני והדליף תמונות לרשת.'
WHERE event_id = 'renovation_leak' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💰 לשלם לבלוגר כדי למחוק את הפוסט'
WHERE event_id = 'renovation_leak' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 להתכחש: ״זו לא הדירה שלי״'
WHERE event_id = 'renovation_leak' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '⚖️ לתבוע על לשון הרע'
WHERE event_id = 'renovation_leak' AND choice_index = 2 AND lang = 'he';

-- wife_real_estate
UPDATE game_event_locales
SET title = 'נדל״ן בחו״ל',
    description = 'אשתך ראתה יותר מדי אינסטגרם ורוצה לקנות בית קטן באיטליה.'
WHERE event_id = 'wife_real_estate' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏡 לקנות בית יקר מאוד באגם קומו'
WHERE event_id = 'wife_real_estate' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏢 לקנות דירת שני חדרים בסאני ביץ׳ בבולגריה'
WHERE event_id = 'wife_real_estate' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏚️ ״טוב מולדת״ — דירה מוזנחת בטבריה'
WHERE event_id = 'wife_real_estate' AND choice_index = 2 AND lang = 'he';

-- tiberias_mockery
UPDATE game_event_locales
SET title = 'לעג: ״ראש העיר פראייר״',
    description = 'בלוגר גילה על רכישת הדירה הישנה בטבריה. כתבה משפילה מתפרסמת, וראשי הערים והמשטרה צוחקים עליך.'
WHERE event_id = 'tiberias_mockery' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🥊 לשכור בריונים דרך מכר כדי להכות את הבלוגר'
WHERE event_id = 'tiberias_mockery' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '😤 לחרוק שיניים ולסבול את הלעג'
WHERE event_id = 'tiberias_mockery' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📢 לפתוח מלחמת מידע גלויה נגד היריבים'
WHERE event_id = 'tiberias_mockery' AND choice_index = 2 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📰 להזמין כתבת שבח בתשלום על עצמך'
WHERE event_id = 'tiberias_mockery' AND choice_index = 3 AND lang = 'he';
