let state = {
    money: 1000000,
    wife: 50,
    threat: 15,
    health: 90,
    rating: 50,
    day: 1,
    lang: 'en',
    currentEventIndex: -1,
    eventQueue: [],
    cooldowns: {},
    audioMuted: false,
    unlockedAchievements: [],
    earnedAchievementsThisGame: []
};

let gameLogicEvents = [];
let gameLocales = {};
let currentTexts = null;
let languageRequestId = 0;
let currentChoiceOrder = [];
const shopPerkKeys = ['police_bribe', 'wife_spa', 'assuta_vip', 'pr_agency'];
const shopPerkCooldownDays = 7;
const LANGUAGE_OPTIONS = [
    { id: 'en', label: 'English', flag: 'assets/flags/gb.svg' },
    { id: 'ru', label: 'Русский', flag: 'assets/flags/ru.svg' },
    { id: 'uk', label: 'Українська', flag: 'assets/flags/ua.svg' },
    { id: 'he', label: 'עברית', flag: 'assets/flags/il.webp' }
];
const ACHIEVEMENTS_DEF = [
    { id: 'offshore_king', icon: '💎', req: s => s.money >= 5000000 },
    { id: 'untouchable', icon: '🕵️‍♂️', req: s => s.threat === 0 },
    { id: 'happy_wife', icon: '👠', req: s => s.wife >= 100 },
    { id: 'survivor', icon: '⏳', req: s => s.day >= 30 }
];

