const gameData = {
    translations: {
        ru: {
            money: "Деньги / Офшоры",
            wife: "Аппетит жены",
            threat: "Угроза (Лахав 433)",
            health: "Здоровье мэра",
            day: "День"
        },
        he: {
            money: "כסף / חשבונות",
            wife: "הדרישות של אשתו",
            threat: "איום (להב 433)",
            health: "בריאות ראש העיר",
            day: "יום"
        },
        en: {
            money: "Money / Offshore",
            wife: "Wife's Appetite",
            threat: "Threat (Police/Lahav)",
            health: "Mayor's Health",
            day: "Day"
        }
    },

    events: [
        {
            id: 1,
            title: {
                ru: "Тендер на городские скамейки",
                he: "מכרז על ספסלים עירוניים",
                en: "Municipal Bench Tender"
            },
            desc: {
                ru: "Крупный подрядчик из центра предлагает откатить за победу в тендере на «золотые» скамейки для парка. Жена намекает, что пора менять квартиру в Кфар-Саве на пентхаус.",
                he: "קבלן גדול מציע עמלה על זכייה במכרז לספסלי יוקרה בפארק. אשתו רומזת שהגיע הזמן לעבור לפנטהאוז.",
                en: "A major contractor offers a kickback for winning a luxury park bench tender. Your wife hints it's time to upgrade to a penthouse."
            },
            choices: [
                {
                    text: { ru: "🧳 Взять всё! Отдать подряд кузену.", he: "🧳 לקחת הכל! לתת את המכרז לבן דוד.", en: "🧳 Take it all! Give the contract to your cousin." },
                    money: +3000000, wife: +25, threat: +20, health: -2
                },
                {
                    text: { ru: "👜 Взять умеренно через фиктивную контору", he: "👜 לקחת באופן מתון דרך חברה פיקטיבית", en: "👜 Take a moderate cut through a shell company" },
                    money: +1200000, wife: +10, threat: +8, health: 0
                },
                {
                    text: { ru: "❌ Отказаться и провести честный тендер", he: "❌ לסרב ולקיים מכרז הוגן", en: "❌ Decline and hold a fair, transparent tender" },
                    money: 0, wife: -30, threat: -5, health: -5
                }
            ]
        },
        {
            id: 2,
            title: {
                ru: "Запрос от Контролера государства",
                he: "פנייה ממבקר המדינה",
                en: "Inquiry from the State Comptroller"
            },
            desc: {
                ru: "Из офиса מבקר המדינה пришел жесткий запрос по поводу странных представительских расходов и командировок за границу.",
                he: "ממשרד מבקר המדינה הגיעה דרישה נוקבת לגבי הוצאות ייצוג מוזרות ונסיעות לחו\"ל.",
                en: "A sharp inquiry arrived from the State Comptroller's office regarding odd representation expenses and overseas trips."
            },
            choices: [
                {
                    text: { ru: "🤝 Подключить связи в министерстве, чтобы замять", he: "🤝 להפעיל קשרים במשרד ממשלתי כדי לטאטא מתחת לשטיח", en: "🤝 Use ministry connections to sweep it under the rug" },
                    money: -500000, wife: 0, threat: -15, health: -5
                },
                {
                    text: { ru: "⚖️ Нанять звездного адвоката из Тель-Авива", he: "⚖️ לשכור עורך דין צמרת מתל אביב", en: "⚖️ Hire a high-profile Tel Aviv attorney" },
                    money: -1200000, wife: 0, threat: -25, health: -2
                },
                {
                    text: { ru: "🤫 Сделать вид, что ничего не получали", he: "🤫 להתעלם כאילו לא קיבלנו כלום", en: "🤫 Ignore the letter and hope it goes away" },
                    money: 0, wife: 0, threat: +30, health: -10
                }
            ]
        },
        {
            id: 3,
            title: {
                ru: "Каприз молодой жены",
                he: "הגחמה של האישה הצעירה",
                en: "The Young Wife's Whim"
            },
            desc: {
                ru: "Супруга возмущается: «Все знакомые отдыхают в Дубае и покупают виллы в Кейсарии, а мы застряли на юге с видом на шоссе!».",
                he: "האישה זועמת: \"כולם נופשים בדובאי וקונים וילות בקיסריה, ואנחנו תקועים!\"",
                en: "Your wife is furious: 'Everyone vacations in Dubai and buys villas in Caesarea, while we're stuck here!'"
            },
            choices: [
                {
                    text: { ru: "🏝️ Пообещать виллу в Кейсарии (оформить на тещу)", he: "🏝️ להבטיח וילה בקיסריה (לרשום על שם חמותך)", en: "🏝️ Promise a Caesarea villa (register it under mother-in-law)" },
                    money: -4000000, wife: +40, threat: +10, health: -8
                },
                {
                    text: { ru: "✈️ Откупиться поездкой бизнес-классом на уик-энд в Грецию", he: "✈️ לפתות עם חופשת סוף שבוע ביוון במחלקת עסקים", en: "✈️ Placate her with a business-class weekend trip to Greece" },
                    money: -1500000, wife: +20, threat: 0, health: -2
                },
                {
                    text: { ru: "🗣️ Объяснить про бюджет муниципии и госслужбу", he: "🗣️ להסביר על תקציב העיריה ושירות הציבור", en: "🗣️ Lecture her about municipal budgets and public service" },
                    money: 0, wife: -35, threat: 0, health: -15
                }
            ]
        },
        {
            id: 4,
            title: {
                ru: "Махинации с ТАМА 38",
                he: "קומבינות בתמ\"א 38",
                en: "TAMA 38 Shenanigans"
            },
            desc: {
                ru: "Застройщик просит закрыть глаза на три «лишних» этажа в проекте ТАМА 38 в центре города. Обещает занести солидную сумму в швейцарский банк.",
                he: "קבלן מבקש להעלים עין משלוש קומות חורגות בפרויקט תמ\"א 38. מבטיח להעביר סכום נאה לחשבון בשוויץ.",
                en: "A developer asks you to ignore three illegal extra floors in a TAMA 38 project. Promises a hefty deposit to a Swiss bank."
            },
            choices: [
                {
                    text: { ru: "🏗️ Подписать разрешение не глядя", he: "🏗️ לחתום על האישור בעיניים עצומות", en: "🏗️ Sign the permit without looking" },
                    money: +4000000, wife: +15, threat: +25, health: -5
                },
                {
                    text: { ru: "🌳 Заставить построить парк в обмен на этажи", he: "🌳 לחייב בניית פארק בתמורה לקומות", en: "🌳 Force them to build a park in exchange for the floors" },
                    money: +1000000, wife: +5, threat: +10, health: 0
                },
                {
                    text: { ru: "🛑 Заблокировать стройку (застройщик в ярости)", he: "🛑 להקפיא את הבנייה (הקבלן רותח)", en: "🛑 Halt the construction (developer is furious)" },
                    money: 0, wife: -10, threat: -10, health: -15
                }
            ]
        },
        {
            id: 5,
            title: {
                ru: "Коалиционный шантаж и Шаббат",
                he: "סחיטה קואליציונית ושבת",
                en: "Coalition Blackmail & Shabbat"
            },
            desc: {
                ru: "Религиозная фракция в горсовете грозит развалить коалицию, если вы не закроете центральную улицу по субботам. Светские избиратели готовят демонстрации.",
                he: "הסיעה הדתית מאיימת להפיל את הקואליציה אם לא תסגור את הרחוב הראשי בשבת. החילונים מתכננים הפגנות.",
                en: "The religious faction threatens to topple the coalition unless you close the main street on Shabbat. Secular voters are planning protests."
            },
            choices: [
                {
                    text: { ru: "🕍 Уступить и закрыть улицу (сохраняем кресло)", he: "🕍 להיכנע ולסגור את הרחוב (שומרים על הכיסא)", en: "🕍 Cave in and close the street (keep your seat)" },
                    money: +500000, wife: 0, threat: -15, health: -20
                },
                {
                    text: { ru: "🚌 Запустить бесплатные субботние автобусы", he: "🚌 להפעיל תחבורה ציבורית בחינם בשבת", en: "🚌 Launch free Shabbat public transport" },
                    money: -2000000, wife: -5, threat: +15, health: -10
                },
                {
                    text: { ru: "🤷 Ничего не делать и уйти в отпуск", he: "🤷 לא לעשות כלום ולצאת לחופשה", en: "🤷 Do nothing and go on vacation" },
                    money: -500000, wife: +20, threat: +5, health: +10
                }
            ]
        },
        {
            id: 6,
            title: {
                ru: "Бюджет на мамады (Бомбоубежища)",
                he: "תקציב לממ\"דים",
                en: "Bomb Shelter Budget"
            },
            desc: {
                ru: "Государство выделило огромный бюджет на ремонт старых бомбоубежищ. Брат жены внезапно открыл фирму по установке бронированных дверей.",
                he: "המדינה הקצתה תקציב ענק לשיפוץ מקלטים. גיסך פתח לפתע חברה להתקנת דלתות הדף.",
                en: "The government allocated a massive budget for shelter renovations. Your brother-in-law suddenly opened a blast-door company."
            },
            choices: [
                {
                    text: { ru: "🚪 Отдать весь тендер брату жены", he: "🚪 לתת את כל המכרז לגיס", en: "🚪 Give the entire tender to your brother-in-law" },
                    money: +2500000, wife: +40, threat: +30, health: -5
                },
                {
                    text: { ru: "🛠️ Отдать ему только часть, остальное — честно", he: "🛠️ לתת לו רק חלק, והשאר ביושר", en: "🛠️ Give him only a piece, the rest fairly" },
                    money: +800000, wife: +10, threat: +10, health: 0
                },
                {
                    text: { ru: "🛡️ Провести строгий независимый аудит", he: "🛡️ לבצע ביקורת עצמאית וקפדנית", en: "🛡️ Conduct a strict independent audit" },
                    money: 0, wife: -40, threat: -15, health: -5
                }
            ]
        }
    ]
};