// ИГРОВАЯ МАТЕМАТИКА
// Индексы choices строго соответствуют массивам вариантов ответов в языковых JSON-файлах
const gameLogicEvents = [
    {
        id: "bench_tender",
        choices: [
            { money: +3000000, wife: +25, threat: +20, health: -2 }, 
            { money: +1200000, wife: +10, threat: +8, health: 0 },   
            { money: 0, wife: -30, threat: -5, health: 0 }          
        ]
    },
    {
        id: "tama_38",
        choices: [
            { money: +5000000, wife: +20, threat: +25, health: -5 },
            { money: +1000000, wife: +5, threat: +10, health: -2 },
            { money: 0, wife: -15, threat: -10, health: +5 }
        ]
    },
    {
        id: "shelters_budget",
        choices: [
            { money: +2000000, wife: +35, threat: +25, health: -5 },
            { money: +500000, wife: +10, threat: +5, health: 0 },
            { money: 0, wife: -25, threat: -5, health: +5 }
        ]
    },
    {
        id: "state_comptroller",
        choices: [
            { money: -1000000, wife: 0, threat: -30, health: -10 },
            { money: -50000, wife: 0, threat: -5, health: -20 },
            { money: -200000, wife: 0, threat: -15, health: -5 }
        ]
    },
    {
        id: "shabbat_blackmail",
        choices: [
            { money: 0, wife: -40, threat: -5, health: -10 },
            { money: -200000, wife: -10, threat: +5, health: -5 }, 
            { money: 0, wife: +15, threat: +20, health: -5 }
        ]
    },
    {
        id: "lawyer_visit",
        choices: [
            { money: -500000, wife: 0, threat: -25, health: +10 },
            { money: -2000000, wife: 0, threat: -10, health: -10 }, 
            { money: 0, wife: -5, threat: +15, health: -5 }
        ]
    }
];