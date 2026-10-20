const gameLogicEvents = [
    {
        id: "bench_tender",
        avatar: "🪑",
        choices: [
            { money: +3000000, wife: +25, threat: +20, health: -2, rating: -15 },
            { money: +1200000, wife: +10, threat: +8, health: 0, rating: -5 },
            { money: 0, wife: -30, threat: -5, health: 0, rating: +20 }
        ]
    },
    {
        id: "tama_38",
        avatar: "🏗️",
        choices: [
            { money: +5000000, wife: +20, threat: +25, health: -5, rating: -20 },
            { money: +1000000, wife: +5, threat: +10, health: -2, rating: +5 },
            { money: 0, wife: -15, threat: -10, health: +5, rating: +15 }
        ]
    },
    {
        id: "shelters_budget",
        avatar: "🛡️",
        choices: [
            { money: +2000000, wife: +35, threat: +25, health: -5, rating: -25 },
            { money: +500000, wife: +10, threat: +5, health: 0, rating: +5 },
            { money: 0, wife: -25, threat: -5, health: +5, rating: +20 }
        ]
    },
    {
        id: "state_comptroller",
        avatar: "🧐",
        choices: [
            { money: -1000000, wife: 0, threat: -30, health: -10, rating: -5 },
            { money: -50000, wife: 0, threat: -5, health: -20, rating: -15 },
            { money: -200000, wife: 0, threat: -15, health: -5, rating: +5 }
        ]
    },
    {
        id: "shabbat_blackmail",
        avatar: "💃",
        choices: [
            { money: 0, wife: -40, threat: -5, health: -10, rating: -15 },
            { money: -200000, wife: -10, threat: +5, health: -5, rating: +10 },
            { money: 0, wife: +15, threat: +20, health: -5, rating: +5 }
        ]
    },
    {
        id: "lawyer_visit",
        avatar: "💼",
        choices: [
            { money: -500000, wife: 0, threat: -25, health: +10, rating: 0 },
            { money: -2000000, wife: 0, threat: -10, health: -10, rating: 0 },
            { money: 0, wife: -5, threat: +15, health: -5, rating: +5 }
        ]
    },
    {
        id: "garbage_extortion",
        avatar: "🚛",
        choices: [
            { money: -50000, wife: 0, threat: +15, health: -5, rating: +10, nextEvent: { id: "burning_trucks", delay: 3 } },
            { money: -300000, wife: +15, threat: -15, health: 0, rating: -20 },
            { money: 0, wife: -10, threat: +10, health: -10, rating: -10, nextEvent: { id: "burning_trucks", delay: 2 } },
            { money: -100000, wife: +5, threat: +25, health: -10, rating: +5 }
        ]
    },
    {
        id: "burning_trucks",
        avatar: "🔥",
        isFollowUp: true,
        choices: [
            { money: -800000, wife: 0, threat: -10, health: -5, rating: +15 },
            { money: 0, wife: -20, threat: +20, health: -15, rating: -30 }
        ]
    },
    {
        id: "neighbor_mayor_amuta",
        avatar: "🏛️",
        choices: [
            { money: -500000, wife: +25, threat: +30, health: -10, rating: -15 },
            { money: -100000, wife: +5, threat: +10, health: 0, rating: -5 },
            { money: 0, wife: -10, threat: -5, health: +5, rating: 0 },
            { money: 0, wife: +10, threat: -20, health: +10, rating: +15, nextEvent: { id: "kompromat_retaliation", delay: 3 } }
        ]
    },
    {
        id: "kompromat_retaliation",
        avatar: "📰",
        isFollowUp: true,
        choices: [
            { money: -300000, wife: -10, threat: -15, health: -10, rating: +10 },
            { money: 0, wife: -30, threat: +15, health: -20, rating: -25 }
        ]
    },
    {
        id: "shitty_burger",
        avatar: "🍔",
        choices: [
            { money: +300000, wife: +15, threat: +20, health: -5, rating: -20 },
            { money: -20000, wife: -5, threat: -10, health: -10, rating: +15 },
            { money: -150000, wife: -25, threat: -10, health: +5, rating: +10 }
        ]
    },
    {
        id: "shabbat_parking",
        avatar: "👮",
        choices: [
            { money: -30000, wife: -10, threat: -5, health: -15, rating: -10 },
            { money: 0, wife: +20, threat: +10, health: -5, rating: -15 },
            { money: -50000, wife: -20, threat: +25, health: -20, rating: +20 }
        ]
    },
    {
        id: "flooded_street",
        avatar: "🌊",
        choices: [
            { money: 0, wife: 0, threat: +15, health: -5, rating: -25 },
            { money: -300000, wife: +20, threat: +10, health: -10, rating: +5 },
            { money: -20000, wife: -15, threat: -5, health: -15, rating: +30 }
        ]
    },
    {
        id: "arnona_scandal",
        avatar: "📜",
        choices: [
            { money: 1500000, wife: 0, threat: 20, health: -5, rating: -15 },
            { money: 300000, wife: 0, threat: 5, health: 0, rating: -5 },
            { money: 0, wife: 0, threat: -5, health: 0, rating: 10 }
        ]
    },
    {
        id: "beach_kiosk",
        avatar: "🏖️",
        choices: [
            { money: 800000, wife: 10, threat: 15, health: 0, rating: -10 },
            { money: -200000, wife: -5, threat: -5, health: 0, rating: 15 }
        ]
    },
    {
        id: "electric_scooters",
        avatar: "🛴",
        choices: [
            { money: 600000, wife: 0, threat: 10, health: 0, rating: -15 },
            { money: 0, wife: 0, threat: -5, health: 5, rating: 20 },
            { money: -100000, wife: 0, threat: 0, health: -5, rating: 5 }
        ]
    },
    {
        id: "stadium_naming",
        avatar: "🏟️",
        choices: [
            { money: 2000000, wife: 15, threat: 25, health: 0, rating: -20 },
            { money: 0, wife: -10, threat: -10, health: 0, rating: 25 }
        ]
    },
    {
        id: "sewage_overflow",
        avatar: "🌊",
        choices: [
            { money: -500000, wife: 0, threat: -10, health: 0, rating: 15 },
            { money: 0, wife: 0, threat: 15, health: -10, rating: -25 }
        ]
    },
    {
        id: "friday_country_club",
        avatar: "🏊‍♂️",
        choices: [
            { money: 400000, wife: 10, threat: 10, health: 5, rating: 15 },
            { money: -50000, wife: 0, threat: -5, health: 10, rating: 20 },
            { money: 0, wife: -10, threat: 0, health: -5, rating: -10 }
        ],
        chains: {
            0: { nextEventId: "country_cctv_raid", delayDays: 3 }
        }
    },
    {
        id: "country_cctv_raid",
        avatar: "📹",
        isFollowUp: true,
        choices: [
            { money: -300000, wife: 0, threat: -15, health: -5, rating: 0 },
            { money: 0, wife: 0, threat: 25, health: -10, rating: -20 }
        ]
    },
    {
        id: "kindergarten_favor",
        avatar: "🧸",
        choices: [
            { money: 300000, wife: 10, threat: 25, health: 0, rating: -15 },
            { money: 0, wife: -5, threat: -5, health: 0, rating: -10 },
            { money: 0, wife: -10, threat: -10, health: -5, rating: -20 }
        ]
    },
    {
        id: "metro_depot",
        avatar: "🚇",
        choices: [
            { money: 5000000, wife: 10, threat: -25, health: -10, rating: -20 },
            { money: 1500000, wife: 5, threat: -10, health: -5, rating: -5 },
            { money: 0, wife: -5, threat: -5, health: 10, rating: 25 }
        ]
    },
    {
        id: "bagrut_success",
        avatar: "🎓",
        choices: [
            { money: -800000, wife: 0, threat: -10, health: 15, rating: 25 },
            { money: 0, wife: 0, threat: 0, health: -5, rating: -10 },
            { money: 400000, wife: 0, threat: 15, health: -10, rating: -20 }
        ]
    },
    {
        id: "park_sculptures",
        avatar: "🗿",
        choices: [
            { money: 1200000, wife: 5, threat: 15, health: -5, rating: -15 },
            { money: 0, wife: 0, threat: -5, health: 5, rating: 10 },
            { money: -300000, wife: -5, threat: 0, health: 10, rating: 20 }
        ]
    },
    {
        id: "yom_haatzmaut",
        avatar: "🇮🇱",
        choices: [
            { money: -1000000, wife: 20, threat: 0, health: 15, rating: 30 },
            { money: 500000, wife: 10, threat: 0, health: 5, rating: 5 },
            { money: 2500000, wife: -10, threat: 0, health: -15, rating: -35 }
        ]
    }
];