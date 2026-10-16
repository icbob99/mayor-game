// ИГРОВАЯ МАТЕМАТИКА
// Индексы choices строго соответствуют массивам вариантов ответов в языковых JSON-файлах
const gameLogicEvents = [
    {
        id: "bench_tender",
        choices: [
            { money: +3000000, wife: +25, threat: +20, health: -2, rating: -15 },
            { money: +1200000, wife: +10, threat: +8, health: 0, rating: -5 },
            { money: 0, wife: -30, threat: -5, health: 0, rating: +20 }
        ]
    },
    {
        id: "tama_38",
        choices: [
            { money: +5000000, wife: +20, threat: +25, health: -5, rating: -20 },
            { money: +1000000, wife: +5, threat: +10, health: -2, rating: +5 },
            { money: 0, wife: -15, threat: -10, health: +5, rating: +15 }
        ]
    },
    {
        id: "shelters_budget",
        choices: [
            { money: +2000000, wife: +35, threat: +25, health: -5, rating: -25 },
            { money: +500000, wife: +10, threat: +5, health: 0, rating: +5 },
            { money: 0, wife: -25, threat: -5, health: +5, rating: +20 }
        ]
    },
    {
        id: "state_comptroller",
        choices: [
            { money: -1000000, wife: 0, threat: -30, health: -10, rating: -5 },
            { money: -50000, wife: 0, threat: -5, health: -20, rating: -15 },
            { money: -200000, wife: 0, threat: -15, health: -5, rating: +5 }
        ]
    },
    {
        id: "shabbat_blackmail",
        choices: [
            { money: 0, wife: -40, threat: -5, health: -10, rating: -15 },
            { money: -200000, wife: -10, threat: +5, health: -5, rating: +10 },
            { money: 0, wife: +15, threat: +20, health: -5, rating: +5 }
        ]
    },
    {
        id: "lawyer_visit",
        choices: [
            { money: -500000, wife: 0, threat: -25, health: +10, rating: 0 },
            { money: -2000000, wife: 0, threat: -10, health: -10, rating: 0 },
            { money: 0, wife: -5, threat: +15, health: -5, rating: +5 }
        ]
    },
    {
        id: "garbage_extortion",
        choices: [
            { money: -50000, wife: 0, threat: +15, health: -5, rating: +10 },
            { money: -300000, wife: +15, threat: -15, health: 0, rating: -20 },
            { money: 0, wife: -10, threat: +10, health: -10, rating: -10 },
            { money: -100000, wife: +5, threat: +25, health: -10, rating: +5 }
        ]
    },
    {
        id: "neighbor_mayor_amuta",
        choices: [
            { money: -500000, wife: +25, threat: +30, health: -10, rating: -15 },
            { money: -100000, wife: +5, threat: +10, health: 0, rating: -5 },
            { money: 0, wife: -10, threat: -5, health: +5, rating: 0 },
            { money: 0, wife: +10, threat: -20, health: +10, rating: +15 }
        ]
    },
    {
        id: "shitty_burger",
        choices: [
            { money: +300000, wife: +15, threat: +20, health: -5, rating: -20 },
            { money: -20000, wife: -5, threat: -10, health: -10, rating: +15 },
            { money: -150000, wife: -25, threat: -10, health: +5, rating: +10 }
        ]
    },
    {
        id: "shabbat_parking",
        choices: [
            { money: -30000, wife: -10, threat: -5, health: -15, rating: -10 },
            { money: 0, wife: +20, threat: +10, health: -5, rating: -15 },
            { money: -50000, wife: -20, threat: +25, health: -20, rating: +20 }
        ]
    },
    {
        id: "flooded_street",
        choices: [
            { money: 0, wife: 0, threat: +15, health: -5, rating: -25 },
            { money: -300000, wife: +20, threat: +10, health: -10, rating: +5 },
            { money: -20000, wife: -15, threat: -5, health: -15, rating: +30 }
        ]
    }
];