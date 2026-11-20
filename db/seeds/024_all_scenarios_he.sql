-- HE editorial revision: 41 cards. Preserve IDs, choice order, effects and other locales.

-- bench_tender
UPDATE game_event_locales
SET title = 'מכרז הספסלים',
    description = 'העיר צריכה ספסלים. אשתך צריכה פנטהאוז. קבלן מציע לפתור את שתי הבעיות במכרז אחד. סוף סוף מישהו רואה את התמונה הכוללת.'
WHERE event_id = 'bench_tender' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🧳 לקחת את מלוא הנתח ולתת את העבודה לבן הדוד — גם המשפחה היא חלק מהציבור'
WHERE event_id = 'bench_tender' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '👜 לקחת נתח צנוע דרך חברת קש — החברה פיקטיבית, הצניעות אמיתית'
WHERE event_id = 'bench_tender' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '❌ לסרב לשוחד ולערוך מכרז הוגן — שלפחות הספסלים יהיו שווים את הכסף'
WHERE event_id = 'bench_tender' AND choice_index = 2 AND lang = 'he';

-- tama_38
UPDATE game_event_locales
SET title = 'שלוש קומות מיותרות',
    description = 'יזם מבקש שלא תשים לב לשלוש קומות מיותרות במרכז העיר. הבניין יצמח כאן. החשבון שלך יצמח בשווייץ.'
WHERE event_id = 'tama_38' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏗️ לחתום בלי להסתכל — העיניים עצומות, החשבון פתוח'
WHERE event_id = 'tama_38' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🌳 לדרוש פארק בתמורה לאישור הקומות — צריך קצת ירוק גם מחוץ לחשבון'
WHERE event_id = 'tama_38' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛑 לעצור את הבנייה — שמישהו כבר יגלה שיש לי עקרונות'
WHERE event_id = 'tama_38' AND choice_index = 2 AND lang = 'he';

-- shelters_budget
UPDATE game_event_locales
SET title = 'התקציב למקלטים',
    description = 'המדינה הקצתה סכום עתק לשיפוץ המקלטים הישנים. אחיה של אשתך פתח מיד חברה להתקנת דלתות ממוגנות. מדהים אילו כישרונות תקציב יכול לגלות.'
WHERE event_id = 'shelters_budget' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚪 לתת לו את כל העבודה — קודם כול מגינים על הקרובים'
WHERE event_id = 'shelters_budget' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛠️ לתת לו חלק ואת היתר לחלק במכרז הוגן — גם המצפון רוצה את החלק שלו'
WHERE event_id = 'shelters_budget' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛡️ לערוך מכרז פתוח והוגן — קרבת משפחה עוד לא נחשבת הסמכה מקצועית'
WHERE event_id = 'shelters_budget' AND choice_index = 2 AND lang = 'he';

-- state_comptroller
UPDATE game_event_locales
SET title = 'מבקר המדינה בדרך',
    description = 'אנשי מבקר המדינה הגיעו לעירייה ודורשים את מסמכי הנהלת החשבונות מהשנה שעברה. לציבור כבר נתת דין וחשבון. עכשיו מתברר שגם למחשבון צריך.'
WHERE event_id = 'state_comptroller' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💰 לשחד את ראש צוות הביקורת — שלפחות האינטרסים שלנו יתאזנו'
WHERE event_id = 'state_comptroller' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🔥 לארגן שריפה ''מקרית'' בארכיון — העבר צריך להישאר בעבר'
WHERE event_id = 'state_comptroller' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🐐 להפיל הכול על פקיד זוטר — תפקיד קטן, אחריות עצומה'
WHERE event_id = 'state_comptroller' AND choice_index = 2 AND lang = 'he';

-- shabbat_blackmail
UPDATE game_event_locales
SET title = 'משבר קואליציוני בשבת',
    description = 'הסיעות הדתיות דורשות לסגור בשבת את הקניונים, בתי הקולנוע והקאנטרי, ולחסום רחובות וכניסות לעיר למכוניות. אחרת הקואליציה מתפרקת. אשתך תכננה קניות ובריכה. שני הצדדים חושבים שאתה עוד לא מפחד מספיק.'
WHERE event_id = 'shabbat_blackmail' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🕍 להיענות לכל הדרישות — על השקט בעיר אני מתחייב, על השקט בבית פחות'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 להגביל במרכז, להשאיר עסקים וכבישים פתוחים בשוליים — קדושה לפי מיקוד'
WHERE event_id = 'shabbat_blackmail' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🖕 לשלוח אותם לדרכם: ''זאת עיר חילונית! לא מוצא חן בעיניכם? תתפללו לעיר אחרת'''
WHERE event_id = 'shabbat_blackmail' AND choice_index = 2 AND lang = 'he';

-- lawyer_visit
UPDATE game_event_locales
SET title = 'עורך הדין שמכיר אנשים',
    description = 'עורך דין מוכר מבטיח שבתמורה לשכר טרחה מכובד, במשטרה יאבדו כמה תיקיות בעניינך. הוא לא טוען שאתה חף מפשע. הוא טוען שזה לא הכרחי.'
WHERE event_id = 'lawyer_visit' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💼 לשלם ולישון בשקט — חפות דורשת השקעה'
WHERE event_id = 'lawyer_visit' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 לבקש הנחה — אני הרי לא אשם בהכול'
WHERE event_id = 'lawyer_visit' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '❌ לגרש אותו: ''אני ראש עיר ישר!'' מזמן רציתי לשמוע את זה בקול'
WHERE event_id = 'lawyer_visit' AND choice_index = 2 AND lang = 'he';

-- garbage_extortion
UPDATE game_event_locales
SET title = 'הצעה לפינוי אשפה',
    description = 'לעירייה הגיעו בחורים חסונים מקלנסווה. רוצים לפנות את האשפה. בחורים מנומסים. בינתיים הם מציעים.'
WHERE event_id = 'garbage_extortion' AND lang = 'he';

UPDATE game_choice_locales
SET text = '👮 להגיש תלונה במשטרה — שיהיה לאיומים גם מספר פנייה'
WHERE event_id = 'garbage_extortion' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 לתת להם את חוזה פינוי האשפה — ההצעה המשכנעת ביותר'
WHERE event_id = 'garbage_extortion' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🗣️ לעשות כאילו אני לא מבין ערבית — איומים מתקבלים רק עם תרגום'
WHERE event_id = 'garbage_extortion' AND choice_index = 2 AND lang = 'he';

UPDATE game_choice_locales
SET text = '⚔️ להזמין את המתחרים מטייבה — שהשוק יסדיר את עצמו'
WHERE event_id = 'garbage_extortion' AND choice_index = 3 AND lang = 'he';

-- burning_trucks
UPDATE game_event_locales
SET title = 'משאיות האשפה בוערות',
    description = 'בלילה נשרפו שלוש משאיות אשפה בחניון העירוני. אין במה לפנות את הזבל. ההצעה לשיתוף פעולה הובנה סוף סוף.'
WHERE event_id = 'burning_trucks' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚛 לקנות משאיות חדשות מתקציב העירייה — גם לסירוב יש מחיר'
WHERE event_id = 'burning_trucks' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 לפרוש ידיים: ''אין כסף''. הידיים נקיות, לגבי העיר לא התחייבתי'
WHERE event_id = 'burning_trucks' AND choice_index = 1 AND lang = 'he';

-- neighbor_mayor_amuta
UPDATE game_event_locales
SET title = 'עזרה לחבר ראש עיר',
    description = 'ראש העיר השכנה מתקשר ומבקש עזרה להיבחר מחדש. מבחינתו העניין כבר הוכרע. נשאר לשכנע את התושבים.'
WHERE event_id = 'neighbor_mayor_amuta' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💰 להעביר סכום נדיב דרך עמותת קש — חברים לא משאירים לבד בקלפי'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🪙 לתת קצת — שיזכור את המחווה, לא את הסכום'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛑 לסרב בנימוס: ''כסף אין, אבל תחזיקו מעמד'''
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 2 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📰 להדליף עליו חומר לערוץ ''רכילות העיר'' בטלגרם — לעזור לבוחרים להחליט'
WHERE event_id = 'neighbor_mayor_amuta' AND choice_index = 3 AND lang = 'he';

-- kompromat_retaliation
UPDATE game_event_locales
SET title = 'מתקפת הנגד בתקשורת',
    description = 'ראש העיר השכנה החזיר על ההדלפה. בטלגרם מככבות הווילה שלך בקיסריה ש''נשמטה מהרישומים'' ואשתך בבוטיק במילאנו. עזרת לבוחרים שלו להחליט. הוא לא רצה להישאר חייב.'
WHERE event_id = 'kompromat_retaliation' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💼 לשלם לבלוגרים שיסבירו איך חיסכון בארוחות צהריים מצטבר לווילה'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤐 לשתוק — כל משפט נוסף עלול להתברר כעוד נכס'
WHERE event_id = 'kompromat_retaliation' AND choice_index = 1 AND lang = 'he';

-- shitty_burger
UPDATE game_event_locales
SET title = 'השערורייה בווייט בורגר',
    description = 'פקחים מצאו בשר חשוד בווייט בורגר של התורם הראשי שלך ודורשים לסגור את המקום. את הבשר אתה לא מכיר. את הבעלים — יותר מדי טוב.'
WHERE event_id = 'shitty_burger' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🥩 להוציא רישיון בדיעבד — על הנייר הבשר עוד טרי'
WHERE event_id = 'shitty_burger' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📸 לאכול המבורגר מול המצלמות — על התורם הזה אני ערב בבטן שלי'
WHERE event_id = 'shitty_burger' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '❌ לסגור לעזאזל — כסף זה כסף, אבל את זה כבר אי אפשר לעכל'
WHERE event_id = 'shitty_burger' AND choice_index = 2 AND lang = 'he';

-- shabbat_parking
UPDATE game_event_locales
SET title = 'סיוט החניה של שבת',
    description = 'בשבת חונים בשכונות החילוניות כך שאפילו אמבולנס לא יכול לעבור. האופוזיציה דורשת מבצע גרירה. יום מנוחה יש. עכשיו צריך למצוא מישהו רגוע.'
WHERE event_id = 'shabbat_parking' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚜 לשלוח פקחים וגררים על הבוקר — גם למכוניות מגיע לצאת קצת מהעיר'
WHERE event_id = 'shabbat_parking' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 לא לעשות דבר — גם השכל הישר ביום חופש'
WHERE event_id = 'shabbat_parking' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🅿️ לסמן חניה מתחת לחלונות של הרב — ואהבת לרעך, כולל הרכב שלו'
WHERE event_id = 'shabbat_parking' AND choice_index = 2 AND lang = 'he';

-- flooded_street
UPDATE game_event_locales
SET title = 'רחוב ויצמן שוחה',
    description = 'אחרי הגשם הרציני הראשון, רחוב ויצמן נעלם מתחת למים. הכסף לניקוי הניקוז נעלם קודם. עכשיו שואלים אותך למה המים לא הולכים בעקבותיו.'
WHERE event_id = 'flooded_street' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🌞 להאשים גשם חריג והתחממות עולמית — אני ראש עיר מקומי, הבעיה עולמית'
WHERE event_id = 'flooded_street' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '💸 להזמין את החברה של הגיס בלי מכרז — משפחה לא משאירה אותך לטבוע'
WHERE event_id = 'flooded_street' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🥾 לנעול מגפי גומי ולפתוח את הניקוז מול המצלמות — סוף סוף עבודה מלוכלכת שאפשר להראות'
WHERE event_id = 'flooded_street' AND choice_index = 2 AND lang = 'he';

-- arnona_scandal
UPDATE game_event_locales
SET title = 'הנחות ארנונה למקורבים',
    description = 'עיתונאים גילו שהעסק של התורם שלך קיבל הנחה של 80% בארנונה. האיש כבר מחזיק את ראש העיר. אי אפשר לדרוש שיחזיק גם את העיר.'
WHERE event_id = 'arnona_scandal' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤫 לטשטש את הפרשה דרך היועצים המשפטיים — זאת לא חריגה, זה יחס אישי'
WHERE event_id = 'arnona_scandal' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📉 להוריד את ההנחה ל-30% — שיכעסו במידה'
WHERE event_id = 'arnona_scandal' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '⚖️ לבטל את ההנחה ולגבות את החוב — גם לעיר הוא חייב משהו'
WHERE event_id = 'arnona_scandal' AND choice_index = 2 AND lang = 'he';

-- beach_kiosk
UPDATE game_event_locales
SET title = 'החוף הפרטי של כולם',
    description = 'בעל מסעדת חוף השתלט בלי אישור על 200 מטרים של רצועת חוף והציב כיסאות נוח בתשלום. הוא לא חמדן. את הים הוא בינתיים השאיר לציבור.'
WHERE event_id = 'beach_kiosk' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🍹 לקחת תשלום ושולחן VIP — לי אישית אין בעיה להגיע לים'
WHERE event_id = 'beach_kiosk' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚜 להרוס את המבנים הלא חוקיים — להסביר גבולות בעלות בעזרת דחפור'
WHERE event_id = 'beach_kiosk' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🌊 צונאמי שטף את המסעדה — לא לי ולא לכם'
WHERE event_id = 'beach_kiosk' AND choice_index = 2 AND lang = 'he';

-- electric_scooters
UPDATE game_event_locales
SET title = 'פלישת הקורקינטים',
    description = 'המדרכות מלאות קורקינטים. חלקם שוכבים לרוחב, אחרים דורסים פנסיונרים. ברגל אי אפשר לעבור. ברכיבה, משום מה, אפשר.'
WHERE event_id = 'electric_scooters' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛴 לחייב את חברות ההשכרה ברישיון בתשלום — גם סדר בניירת הוא סדר'
WHERE event_id = 'electric_scooters' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לאסור לגמרי השכרת קורקינטים במרכז העיר'
WHERE event_id = 'electric_scooters' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🅿️ לסמן מקומות חניה לקורקינטים'
WHERE event_id = 'electric_scooters' AND choice_index = 2 AND lang = 'he';

-- stadium_naming
UPDATE game_event_locales
SET title = 'השם החדש של האצטדיון',
    description = 'אוליגרך רוצה לקרוא לאצטדיון העירוני על שם החברה שלו. כל אחד יעודד את הקבוצה שלו. את הפרסומת יקבלו כולם.'
WHERE event_id = 'stadium_naming' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💰 לחתום על חוזה לעשר שנים ולקחת עמלה'
WHERE event_id = 'stadium_naming' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏛️ להשאיר את השם ההיסטורי — אליו לפחות כבר התרגלו'
WHERE event_id = 'stadium_naming' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏅 לקרוא לאצטדיון על שם ראש העיר הקודם — מסורת מועילה צריך להתחיל בזמן'
WHERE event_id = 'stadium_naming' AND choice_index = 2 AND lang = 'he';

-- sewage_overflow
UPDATE game_event_locales
SET title = 'הביוב עולה לטיילת',
    description = 'צינור הביוב הראשי קרס והטיילת מוצפת בשפכים. עכשיו גם מי שלא קורא חדשות מקומיות מעודכן במצב.'
WHERE event_id = 'sewage_overflow' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛠️ להקצות תקציב חירום לשיפוץ יסודי'
WHERE event_id = 'sewage_overflow' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 לקרוא לזה ''עבודות תשתית זמניות'' — את הניסוח כבר תיקנו'
WHERE event_id = 'sewage_overflow' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📞 לפנות לחברה של אחי — הצרה של כולם, העבודה נשארת במשפחה'
WHERE event_id = 'sewage_overflow' AND choice_index = 2 AND lang = 'he';

-- friday_country_club
UPDATE game_event_locales
SET title = 'קבלת קהל בקאנטרי',
    description = 'שישי, שמונה בבוקר. אתה על כיסא נוח ליד הבריכה, ומולך תור של ''רק בקשה קטנה''. בעירייה צריך לקבוע תור. כאן מספיק בגד ים.'
WHERE event_id = 'friday_country_club' AND lang = 'he';

UPDATE game_choice_locales
SET text = '☕ לסדר עניינים לאנשי עסקים תמורת ''תרומות'' — הם צריכים ראש עיר, אני צריך אנשים'
WHERE event_id = 'friday_country_club' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 לעזור לתושבים בארנונה ובגנים על חשבון התקציב'
WHERE event_id = 'friday_country_club' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לתלות שלט ''ראש העיר בחופש'' וללכת לסאונה'
WHERE event_id = 'friday_country_club' AND choice_index = 2 AND lang = 'he';

-- country_cctv_raid
UPDATE game_event_locales
SET title = 'המצלמות של הקאנטרי',
    description = 'חוקרים הגיעו לקאנטרי ודורשים את צילומי האבטחה מיום שישי האחרון. קיבלת אנשים בלי פרוטוקול. המצלמה דווקא רשמה.'
WHERE event_id = 'country_cctv_raid' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💾 לשרוף את ארון השרתים — החיווט לא עמד באחריות'
WHERE event_id = 'country_cctv_raid' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '😬 למסור את הדיסק-און-קי — אולי גם המצלמה לא זוכרת כלום'
WHERE event_id = 'country_cctv_raid' AND choice_index = 1 AND lang = 'he';

-- kindergarten_favor
UPDATE game_event_locales
SET title = 'פרוטקציה בגן',
    description = 'חבר ותיק מבקש להעביר בדחיפות את הילד שלו לגן יוקרתי במרכז. כבר מזמן אין מקום. החבר מניח שזאת התשובה שנותנים לזרים.'
WHERE event_id = 'kindergarten_favor' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💥 לפטר את מנהל אגף החינוך, לדחוק ילד אחר החוצה ולהכניס את שלנו'
WHERE event_id = 'kindergarten_favor' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤫 להבטיח שאסדר הכול ולא לעשות דבר — למה לקלקל חברות בסירוב?'
WHERE event_id = 'kindergarten_favor' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 להוציא אותו מהחדר — החוק שווה לכולם. מעכשיו גם לו'
WHERE event_id = 'kindergarten_favor' AND choice_index = 2 AND lang = 'he';

-- metro_depot
UPDATE game_event_locales
SET title = 'מתחם התחזוקה של המטרו',
    description = 'משרד התחבורה מציע להקים מתחם תחזוקה ענקי למטרו בתוך העיר. התושבים חוששים שהבנייה לא תיגמר. הקבלנים חוששים שכן.'
WHERE event_id = 'metro_depot' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏗️ לאשר — הפרויקט ממלכתי, הכרת התודה אישית'
WHERE event_id = 'metro_depot' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚜 להעביר את המתחם ליד הווילות של ראש האופוזיציה — שיהיה קרוב לעם ולתחבורה'
WHERE event_id = 'metro_depot' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לעצור את הפרויקט בבית המשפט — שלפחות התושבים יישנו בשקט'
WHERE event_id = 'metro_depot' AND choice_index = 2 AND lang = 'he';

-- bagrut_success
UPDATE game_event_locales
SET title = 'שיא חדש בבגרויות',
    description = 'העיר יכולה לשבור שיא באחוז הזכאות לבגרות. בשביל זה צריך מורים לתגבור ומעבדות. משום מה, אף אחד לא מציע פשוט לשפר את הדוח.'
WHERE event_id = 'bagrut_success' AND lang = 'he';

UPDATE game_choice_locales
SET text = '📚 להקצות את מלוא התקציב — שלפחות הילדים ידעו מה הם עושים'
WHERE event_id = 'bagrut_success' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 להשאיר את תוכנית הלימודים הרגילה — אנחנו הרי הסתדרנו איכשהו'
WHERE event_id = 'bagrut_success' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '✂️ לקצץ בחינוך ולהעביר את החיסכון לקרן שלי — צריך לחשוב גם על העתיד'
WHERE event_id = 'bagrut_success' AND choice_index = 2 AND lang = 'he';

-- park_sculptures
UPDATE game_event_locales
SET title = 'אמנות מודרנית בפארק',
    description = 'חברך הפסל מציע לקשט את הפארק המרכזי בפסלים מופשטים מברזל חלוד, על חשבון העיר. מה שמבדיל אותם מגרוטאות הוא הצעת המחיר.'
WHERE event_id = 'park_sculptures' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎨 לאשר את התקציב — הוא יחלוק את שכר האמן. אני מתחיל להבין באמנות'
WHERE event_id = 'park_sculptures' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לדחות — שבינתיים יחליד על חשבונו'
WHERE event_id = 'park_sculptures' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏛️ לערוך תחרות פתוחה לאמנים מקומיים צעירים — אולי גם לזרים יש כישרון'
WHERE event_id = 'park_sculptures' AND choice_index = 2 AND lang = 'he';

-- yom_haatzmaut
UPDATE game_event_locales
SET description = 'נותני החסות העבירו מיליונים להופעה, זיקוקים וכיבוד. המשטרה לא תקלקל היום את החג. הכסף ישנו. נשאר להחליט מי חוגג.'
WHERE event_id = 'yom_haatzmaut' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎉 להוסיף מכספי ולערוך חגיגה מפוארת — גם זה קורה'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🍿 לערוך חגיגה מכספי החסויות ולקחת שארית קטנה — גם אני תושב'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤑 לקחת את כל הכסף ולחלק דגלונים זולים — שינופפו'
WHERE event_id = 'yom_haatzmaut' AND choice_index = 2 AND lang = 'he';

-- wife_dog_park
UPDATE game_event_locales
SET description = 'אשתך רוצה כלב, אבל בשכונה אין גינת כלבים. כלב עוד אין. לעירייה כבר יש התחייבות.'
WHERE event_id = 'wife_dog_park' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🐕 לתת לחבר את עבודות ההקמה — כלב גזעי, שובר למזון ומאלף כלולים בחבילה'
WHERE event_id = 'wife_dog_park' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏗️ לערוך מכרז פתוח לגינת הכלבים — שלפחות כאן תהיה תחרות'
WHERE event_id = 'wife_dog_park' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙅 לסרב: ''כלב זאת אחריות גדולה. כבר יש לך ראש עיר'''
WHERE event_id = 'wife_dog_park' AND choice_index = 2 AND lang = 'he';

-- cat_exhibition
UPDATE game_event_locales
SET title = 'תערוכת החתולים',
    description = 'אשתך הכירה את מועדון חובבי החתולים ומבקשת תערוכה עירונית. לה יש תחביב חדש. לעיר יש סעיף הוצאות.'
WHERE event_id = 'cat_exhibition' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🐈 לתת למפיק חבר לארגן תמורת נתח — שלא רק החתולים יצאו מרוצים'
WHERE event_id = 'cat_exhibition' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📋 להקצות תקציב ולערוך מכרז פתוח — ייחוס בודקים רק אצל החתולים'
WHERE event_id = 'cat_exhibition' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤧 לסרב בגלל אלרגיה לפרווה — ולהתעטש כדי לשכנע'
WHERE event_id = 'cat_exhibition' AND choice_index = 2 AND lang = 'he';

-- lgbt_parade
UPDATE game_event_locales
SET title = 'מצעד הגאווה ברחוב ויצמן',
    description = 'המארגנים מבקשים לקיים את מצעד הגאווה ברחוב ויצמן. למצעד עוד צריך אישור. הסערה כבר יצאה לדרך בלעדיו.'
WHERE event_id = 'lgbt_parade' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏳️‍🌈 לאשר בוויצמן — לתמוך בחופש. בשביל הכסף שלכם, כל בקשה מתקבלת'
WHERE event_id = 'lgbt_parade' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎪 להקצות מתחם סגור באזור התעשייה — מכבדים את כולם, חלקם מרחוק'
WHERE event_id = 'lgbt_parade' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לאסור: ''אני סטרייט! את כולכם אעמיד על ארבע!'''
WHERE event_id = 'lgbt_parade' AND choice_index = 2 AND lang = 'he';

-- lgbt_coalition_crisis
UPDATE game_event_locales
SET title = 'גאווה קואליציונית',
    description = 'גם השותפים הדתיים בקואליציה הם אנשים ''גאים''. הם דורשים לסגור מיד את המועדון הלהט״בי העירוני. אומרים שזאת קואליציה שצריך לקבור. על הכיסאות הם דווקא לא מוותרים.'
WHERE event_id = 'lgbt_coalition_crisis' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🔒 לסגור את המועדון — העקרונות שלי מוצקים, הקואליציה פחות'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚚 להעביר את המועדון לאזור התעשייה מתקציב העיר — רחוק מהפיתוי, קרוב למחסנים'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏢 לפתוח מועדון שני בלב השכונה הדתית — כנראה אחד לא מספיק לכם'
WHERE event_id = 'lgbt_coalition_crisis' AND choice_index = 2 AND lang = 'he';

-- mayors_strip_club
UPDATE game_event_locales
SET title = 'אחרי כנס ראשי הערים',
    description = 'אחרי הכנס השנתי יצאת עם עמיתיך למועדון חשפנות. העיתונות גילתה. על הכנס עצמו לא כתבו כל כך הרבה.'
WHERE event_id = 'mayors_strip_club' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 להכחיש הכול: ''זה פוטושופ! בחיים לא נהניתי ככה!'''
WHERE event_id = 'mayors_strip_club' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '⚖️ לשכור עורך דין יקר שיסביר לעיתונאים מה הם לא ראו'
WHERE event_id = 'mayors_strip_club' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📸 להדליף תמונות של שאר ראשי הערים — למה שרק העיר שלי תתבייש?'
WHERE event_id = 'mayors_strip_club' AND choice_index = 2 AND lang = 'he';

-- mayors_revenge
UPDATE game_event_locales
SET title = 'ראשי הערים מחזירים',
    description = 'ראשי הערים השכנות גילו מי הדליף את התמונות ממועדון החשפנות. שיתוף הפעולה הבין-עירוני סוף סוף עובד. נגדך.'
WHERE event_id = 'mayors_revenge' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💸 לשלם פיצוי לקרן המשותפת שלהם — כבוד ושם טוב מקבלים העברה בנקאית'
WHERE event_id = 'mayors_revenge' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛡️ להתעלם מהאיומים ולעצור פרויקטים משותפים — הערים פשוט לא מסתדרות באופי'
WHERE event_id = 'mayors_revenge' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎉 לערוך מסיבת פיוס סגורה עם מזנון מפואר — יש לנו מה לזכור, ועוד יותר מה לשכוח'
WHERE event_id = 'mayors_revenge' AND choice_index = 2 AND lang = 'he';

-- son_wedding
UPDATE game_event_locales
SET title = 'החתונה של הבן',
    description = 'הבן שלך מתחתן. סוף סוף אפשר לאסוף את כל האנשים הנכונים ולקרוא לזה חיים פרטיים.'
WHERE event_id = 'son_wedding' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏰 לערוך חתונה מפוארת עם האנשים הנכונים — אושר לזוג, מעטפות לאבא'
WHERE event_id = 'son_wedding' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🕊️ שהילדים יארגנו לבד — נראה אם יש חיים בלי העירייה'
WHERE event_id = 'son_wedding' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🥂 אירוע צנוע, רק לקרובים ועל חשבוני — כמעט לא נעים לספר'
WHERE event_id = 'son_wedding' AND choice_index = 2 AND lang = 'he';

-- wedding_investigation
UPDATE game_event_locales
SET title = 'המעטפות של החתונה',
    description = 'עיתונאים מתעניינים במעטפות מהחתונה של הבן. אתה אומר מתנות. הם שואלים תמורת אילו שירותים. אין להם שום כבוד לערכי המשפחה.'
WHERE event_id = 'wedding_investigation' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 לשכור מאכער — גם למערכת העיתון בטח יש ערכי משפחה כלשהם'
WHERE event_id = 'wedding_investigation' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🔥 להצית את מערכת העיתון — שיהיה להם באמת סיפור חם'
WHERE event_id = 'wedding_investigation' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 לקרוא לזה עלילה ולא לענות — לא הזמנו אותם, אז נעלבו'
WHERE event_id = 'wedding_investigation' AND choice_index = 2 AND lang = 'he';

-- father_funeral
UPDATE game_event_locales
SET title = 'אבל על אבא',
    description = 'אביך נפטר ואתה מקבל מנחמים. אנשים מגיעים בלב כבד. חלקם גם עם הצעה עסקית.'
WHERE event_id = 'father_funeral' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🕯️ לקבל אנשים חשובים ולסגור עניינים — למשטרה יהיה הטקט לא להפריע'
WHERE event_id = 'father_funeral' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '👥 לקבל עמיתים וקרובים בלי שיחות עסקים — לפחות יום אחד בלי סדר יום'
WHERE event_id = 'father_funeral' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🔒 לא לפרסם את השבעה, להכניס רק קרובים — מי שהכירו את אבא, לא את התפקיד של הבן'
WHERE event_id = 'father_funeral' AND choice_index = 2 AND lang = 'he';

-- father_monument_offer
UPDATE game_event_locales
SET title = 'המצבה של הקבלנים',
    description = 'יזמים שבאו לנחם מציעים לשלם על מצבה מפוארת לאביך. המצבה תהיה של אבא. את התודה אתה תצטרך להחזיר.'
WHERE event_id = 'father_monument_offer' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🪦 לקבל ולהקים את המצבה הגדולה ביותר — שכולם יראו איזה בן מצליח יש לו'
WHERE event_id = 'father_monument_offer' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📐 לקבל עזרה, אבל לבחור מצבה צנועה — אני הרי לא מבקש משהו מיוחד'
WHERE event_id = 'father_monument_offer' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לסרב ולשלם בעצמי — שלפחות כאן לא אהיה חייב לאף אחד'
WHERE event_id = 'father_monument_offer' AND choice_index = 2 AND lang = 'he';

-- daughter_school
UPDATE game_event_locales
SET title = 'הבת הולכת לבית הספר',
    description = 'בבתי הספר מרכיבים כיתות. הבת צריכה חברים טובים לכיתה. אתה צריך את ההורים שלהם.'
WHERE event_id = 'daughter_school' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏫 לשבץ עם הילדים של האנשים הנכונים — אספת הורים היא גם פגישה עסקית'
WHERE event_id = 'daughter_school' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎒 לבחור כיתה רגילה — שוויון הוא לא רק לילדים של אחרים'
WHERE event_id = 'daughter_school' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🎓 לשלוח לבית ספר פרטי יוקרתי — אני הרי יודע מי אחראי לבתי הספר העירוניים'
WHERE event_id = 'daughter_school' AND choice_index = 2 AND lang = 'he';

-- school_flood
UPDATE game_event_locales
SET title = 'בית הספר מוצף',
    description = 'צינורות ישנים התפוצצו בבית הספר של הבת והכיתות הוצפו. המים כנראה לא יודעים של מי הילדים כאן.'
WHERE event_id = 'school_flood' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🤝 לתת להורים המקושרים לטפל — יתקנו מהר וגם את ראש העיר לא ישכחו'
WHERE event_id = 'school_flood' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏗️ שיפוץ עירוני במכרז — בית הספר סגור לחודש, נוהל תקין לא אוהב שממהרים'
WHERE event_id = 'school_flood' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛠️ לתקן מיד מכספי — פעם אחת אדע כמה שיפוץ באמת עולה'
WHERE event_id = 'school_flood' AND choice_index = 2 AND lang = 'he';

-- apartment_renovation
UPDATE game_event_locales
SET description = 'אשתך רוצה שיפוץ. הדירה כבר לא מוצאת חן בעיניה. בינתיים רק הדירה.'
WHERE event_id = 'apartment_renovation' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🛠️ לפנות לקבלן מוכר — שלפחות כאן יעבוד כאילו זה הבית שלו'
WHERE event_id = 'apartment_renovation' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '💸 לתת כסף: ''אל תחסכי על עצמך''. לי כבר לא היה אומץ לחסוך עלייך'
WHERE event_id = 'apartment_renovation' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🚫 לפרוש ידיים: ''אין כסף''. העיקר לא להצביע לאן הוא הלך'
WHERE event_id = 'apartment_renovation' AND choice_index = 2 AND lang = 'he';

-- renovation_leak
UPDATE game_event_locales
SET title = 'השיפוץ עולה לרשת',
    description = 'בלוגר פרסם תמונות של השיפוץ המפואר שקבלן עירוני עשה לך בחינם. עכשיו כל העיר יודעת שכשהוא צריך, הוא דווקא יודע לעבוד.'
WHERE event_id = 'renovation_leak' AND lang = 'he';

UPDATE game_choice_locales
SET text = '💰 לשלם על מחיקת הפוסט — עבודת הגמר האחרונה'
WHERE event_id = 'renovation_leak' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🙈 ''זאת לא הדירה שלי! אני זוכר אותה מלפני השיפוץ'''
WHERE event_id = 'renovation_leak' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '⚖️ לתבוע על לשון הרע — מי הרשה לו לפרסם את האמת?'
WHERE event_id = 'renovation_leak' AND choice_index = 2 AND lang = 'he';

-- wife_real_estate
UPDATE game_event_locales
SET title = 'בית קטן בחו״ל',
    description = 'אשתך ראתה יותר מדי אינסטגרם ורוצה ''בית קטן באיטליה''. כל הצניעות של הבקשה נכנסה למילה ''קטן''.'
WHERE event_id = 'wife_real_estate' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏡 לקנות בית יקר מאוד באגם קומו — פחות מזה כבר לא מכובד'
WHERE event_id = 'wife_real_estate' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏢 לקנות דירת שני חדרים בסאני ביץ׳ בבולגריה — גם זה חו״ל, צריך לחלום במדויק'
WHERE event_id = 'wife_real_estate' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '🏚️ לקנות דירה בטבריה — אגם יש. איטלקים לא חייבים להזמין'
WHERE event_id = 'wife_real_estate' AND choice_index = 2 AND lang = 'he';

-- tiberias_mockery
UPDATE game_event_locales
SET title = 'ראש העיר יצא פראייר',
    description = 'בלוגר לעג לדירה הישנה שקנית בטבריה. ראשי הערים השכנות צוחקים. גם המשטרה. עם תפקיד כזה, וזאת הדירה שהצלחת לקנות.'
WHERE event_id = 'tiberias_mockery' AND lang = 'he';

UPDATE game_choice_locales
SET text = '🥊 לשכור בריונים דרך מכר שירביצו לבלוגר — לאנשים טובים עוד נשאר כסף'
WHERE event_id = 'tiberias_mockery' AND choice_index = 0 AND lang = 'he';

UPDATE game_choice_locales
SET text = '😤 לחרוק שיניים ולספוג — הדירה שלי, הדעות שלהם'
WHERE event_id = 'tiberias_mockery' AND choice_index = 1 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📢 לפתוח מלחמה תקשורתית — לכל אחד יש משהו יותר גרוע מהדירה שלי'
WHERE event_id = 'tiberias_mockery' AND choice_index = 2 AND lang = 'he';

UPDATE game_choice_locales
SET text = '📰 להזמין כתבת שבח בתשלום — צניעות היא מעלה, אם משלמים על הפרסום שלה'
WHERE event_id = 'tiberias_mockery' AND choice_index = 3 AND lang = 'he';
