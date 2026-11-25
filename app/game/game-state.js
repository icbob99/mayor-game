let state = {
    money: null,
    wife: null,
    threat: null,
    health: null,
    rating: null,
    day: 1,
    lang: 'en',
    currentEventIndex: -1,
    eventQueue: [],
    cooldowns: {},
    difficulty: 'normal',
    mode: 'arcade',
    daily: null,
    gameOverRecorded: false,
    endReason: null,
    finishedAt: null,
    shopPrices: {},
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

function resetStartingStats() {
    Object.assign(state, GameConfig.current.initialStats);
}

function restoreDifficulty(saved) {
    // Old saves use normal rules; the day determines whether switching requires a restart.
    state.difficulty = Difficulty.forMode(saved.mode, saved.difficulty);
    delete state.difficultyLocked;
    state.shopPrices = { ...saved.shopPrices };
    state.mode = GameModes.names.includes(saved.mode) ? saved.mode : 'arcade';
    state.daily = saved.daily ? JSON.parse(JSON.stringify(saved.daily)) : null;
    state.currentEventId = saved.currentEventId || null;
    state.choiceOrder = saved.choiceOrder || [];
    state.gameOverRecorded = Boolean(saved.gameOverRecorded);
    state.endReason = saved.endReason || null;
    state.finishedAt = saved.finishedAt || null;
}
const LANGUAGE_OPTIONS = [
    { id: 'en', label: 'English', flag: 'assets/flags/gb.svg' },
    { id: 'ru', label: 'Русский', flag: 'assets/flags/ru.svg' },
    { id: 'uk', label: 'Українська', flag: 'assets/flags/ua.svg' },
    { id: 'he', label: 'עברית', flag: 'assets/flags/il.webp' }
];
const ACHIEVEMENTS_DEF = [
    { id: 'offshore_king', icon: '💎', req: s => s.money >= GameConfig.current.achievements.offshoreMoney },
    { id: 'untouchable', icon: '🕵️‍♂️', req: s => s.threat === 0 },
    { id: 'happy_wife', icon: '👠', req: s => s.wife >= 100 },
    { id: 'survivor', icon: '⏳', req: s => s.day >= GameConfig.current.achievements.survivorDays },
    { id: 'unsinkable', icon: '🦾', req: s => s.gameOverRecorded && s.endReason === 'honorable_retirement' && s.health > 0 && s.health <= GameConfig.current.achievements.unsinkableHealth }
];

