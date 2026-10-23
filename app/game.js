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
    pendingChainEvents: [],
    unlockedAchievements: [],
    earnedAchievementsThisGame: []
};

let gameLogicEvents = [];
let gameLocales = {};
let currentTexts = null;
let languageRequestId = 0;
let guestStats = { gamesPlayed: 0, maxMoney: 0, achievements: {} };
const shopPerkKeys = ['police_bribe', 'wife_spa', 'assuta_vip', 'pr_agency'];
const shopPerkCooldownDays = 7;
const LANGUAGE_OPTIONS = [
    { id: 'en', label: 'English', flag: 'assets/flags/gb.svg' },
    { id: 'ru', label: 'Русский', flag: 'assets/flags/ru.svg' },
    { id: 'he', label: 'עברית', flag: 'assets/flags/il.webp' }
];
const ACHIEVEMENTS_DEF = [
    { id: 'offshore_king', icon: '💎', req: s => s.money >= 5000000 },
    { id: 'untouchable', icon: '🕵️‍♂️', req: s => s.threat === 0 },
    { id: 'happy_wife', icon: '👠', req: s => s.wife >= 100 },
    { id: 'survivor', icon: '⏳', req: s => s.day >= 30 }
];

async function setLang(lang) {
    const requestId = ++languageRequestId;
    state.lang = lang;
    document.documentElement.dir = (lang === 'he') ? 'rtl' : 'ltr';

    const buttons = document.querySelectorAll('#lang-menu button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-indigo-600');
        btn.classList.add('bg-slate-700');
    });

    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-indigo-600');
        activeBtn.classList.remove('bg-slate-700');
    }
    const selectedLanguage = LANGUAGE_OPTIONS.find(option => option.id === lang);
    if (selectedLanguage) {
        const flag = document.getElementById('lang-flag');
        const label = document.getElementById('lang-label');
        if (flag) {
            flag.src = selectedLanguage.flag;
            flag.alt = selectedLanguage.label;
        }
        if (label) label.innerText = selectedLanguage.label;
        const menu = document.getElementById('lang-menu');
        const toggle = document.getElementById('lang-toggle');
        if (menu) menu.classList.add('hidden');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    try {
        const texts = gameLocales[lang];
        if (!texts) return;
        if (requestId !== languageRequestId) return;
        currentTexts = texts;
    } catch (error) {
        if (requestId !== languageRequestId) return;
        console.error("Ошибка загрузки языкового пакета", error);
        return;
    }

    updateUI();
    if (state.currentEventIndex !== -1) {
        renderCurrentEvent();
    }
}

function toggleLanguageMenu() {
    const menu = document.getElementById('lang-menu');
    const toggle = document.getElementById('lang-toggle');
    if (!menu || !toggle) return;
    const isHidden = menu.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!isHidden));
}

function initializeLanguageSelector() {
    const menu = document.getElementById('lang-menu');
    if (!menu) return;
    menu.innerHTML = LANGUAGE_OPTIONS.map(option => `
        <button id="btn-${option.id}" type="button" onclick="setLang('${option.id}')"
            class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-white hover:bg-slate-600 transition"
            role="option" aria-label="${option.label}">
            <img src="${option.flag}" alt="" class="w-6 h-4 object-cover rounded-sm">
            <span>${option.label}</span>
        </button>
    `).join('');
}

function updateUI() {
    if (!currentTexts) return;

    document.getElementById('label-money').innerText = currentTexts.ui.money;
    document.getElementById('label-wife').innerText = currentTexts.ui.wife;
    document.getElementById('label-threat').innerText = currentTexts.ui.threat;
    document.getElementById('label-health').innerText = currentTexts.ui.health;
    document.getElementById('label-rating').innerText = currentTexts.ui.rating;

    document.getElementById('stat-money').innerText = state.money.toLocaleString() + ' ₪';
    document.getElementById('stat-wife').innerText = state.wife + '%';
    document.getElementById('stat-threat').innerText = state.threat + '%';
    document.getElementById('stat-health').innerText = state.health + '%';
    document.getElementById('stat-rating').innerText = state.rating + '%';
    document.getElementById('day-counter').innerText = `${currentTexts.ui.day} ${state.day}`;
    document.getElementById('label-btn-shop').innerText = currentTexts.ui.btn_shop;
    document.getElementById('btn-achievements').setAttribute('aria-label', currentTexts.ui.btn_achievements);
    document.getElementById('btn-guest-stats').setAttribute('aria-label', currentTexts.ui.guest_stats_title);
    document.getElementById('guest-stats-games-label').innerText = currentTexts.ui.guest_stats_games;
    document.getElementById('guest-stats-money-label').innerText = currentTexts.ui.guest_stats_max_money;
    document.getElementById('guest-stats-achievements-label').innerText = currentTexts.ui.guest_stats_achievements;

    if (state.currentEventIndex === -1) {
        document.getElementById('event-title').innerText = currentTexts.ui.loading_title;
        document.getElementById('event-desc').innerText = currentTexts.ui.loading_desc;
        document.getElementById('choices-container').innerHTML = '';
    }

    if (!document.getElementById('shop-modal').classList.contains('hidden')) {
        renderShop();
    }
    if (!document.getElementById('achievements-modal').classList.contains('hidden')) {
        renderAchievements();
    }
    if (!document.getElementById('guest-stats-modal').classList.contains('hidden')) {
        renderGuestStats();
    }
}

function saveGuestGame() {
    if (typeof GuestStorage !== 'undefined') {
        const storage = getGuestStorage();
        GuestStorage.saveGameState(storage, state);
        guestStats = GuestStorage.updateMaxMoney(storage, state.money);
    }
}

function getGuestStorage() {
    try {
        return window.localStorage;
    } catch {
        return null;
    }
}

function toggleGuestStats(show) {
    const modal = document.getElementById('guest-stats-modal');
    if (!modal) return;
    if (show) {
        renderGuestStats();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function renderGuestStats() {
    if (!currentTexts?.ui) return;
    document.getElementById('guest-stats-title').innerText = `📜 ${currentTexts.ui.guest_stats_title}`;
    document.getElementById('guest-stats-close-btn').innerText = currentTexts.ui.guest_stats_close;
    document.getElementById('guest-stats-dismiss-btn').setAttribute('aria-label', currentTexts.ui.guest_stats_close);
    document.getElementById('guest-stats-games').innerText = guestStats.gamesPlayed;
    document.getElementById('guest-stats-money').innerText = `${guestStats.maxMoney.toLocaleString()} ₪`;

    const container = document.getElementById('guest-stats-achievements');
    container.innerHTML = '';
    const achievementCounts = Object.entries(guestStats.achievements);
    if (!achievementCounts.length) {
        container.innerText = currentTexts.ui.guest_stats_empty;
        return;
    }
    achievementCounts.forEach(([id, count]) => {
        const definition = ACHIEVEMENTS_DEF.find(item => item.id === id);
        const info = currentTexts.ui.achievements?.[id];
        if (!definition || !info) return;
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900/60';
        item.innerText = `${definition.icon} ${info.name} × ${count}`;
        container.appendChild(item);
    });
}

function toggleShop(show) {
    const modal = document.getElementById('shop-modal');
    if (!modal) return;

    if (show) {
        renderShop();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function renderShop() {
    if (!currentTexts || !currentTexts.ui.perks) return;

    document.getElementById('shop-title').innerText = `🛒 ${currentTexts.ui.shop_title}`;
    document.getElementById('shop-close-btn').innerText = currentTexts.ui.shop_close;
    document.getElementById('shop-dismiss-btn').setAttribute('aria-label', currentTexts.ui.shop_close);

    const container = document.getElementById('shop-items-container');
    container.innerHTML = '';

    shopPerkKeys.forEach(key => {
        const perk = currentTexts.ui.perks[key];
        if (!perk) {
            console.error(`Ошибка: Не найден перевод перка "${key}" в базе данных для языка ${state.lang}`);
            return;
        }

        const canAfford = state.money >= perk.price;
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between gap-3 p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl';

        const details = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'font-bold text-white text-sm';
        name.innerText = perk.name;

        const description = document.createElement('div');
        description.className = 'text-xs text-slate-400';
        description.innerText = perk.desc;

        const price = document.createElement('div');
        price.className = 'text-xs font-bold text-emerald-400 mt-0.5';
        price.innerText = `${perk.price.toLocaleString()} ₪`;

        details.append(name, description, price);

        const readyDay = state.cooldowns[key] || 0;
        const isCoolingDown = state.day < readyDay;
        const daysLeft = readyDay - state.day;
        const isMaxed = (
            (key === 'police_bribe' && state.threat === 0) ||
            (key === 'wife_spa' && state.wife === 100) ||
            (key === 'assuta_vip' && state.health === 100) ||
            (key === 'pr_agency' && state.rating === 100)
        );

        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.perk = key;
        button.disabled = !canAfford || isMaxed || isCoolingDown;
        button.className = `px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            button.disabled
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
        }`;
        button.innerText = isCoolingDown
            ? `${currentTexts.ui.shop_cooldown} ${daysLeft} ${currentTexts.ui.shop_days}`
            : isMaxed
                ? currentTexts.ui.shop_maxed
                : canAfford
                    ? currentTexts.ui.shop_buy
                    : currentTexts.ui.shop_insufficient;
        button.addEventListener('click', event => {
            const perkKey = event.currentTarget.dataset.perk;
            if (perkKey) buyPerk(perkKey);
        });

        item.append(details, button);
        container.appendChild(item);
    });
}

function buyPerk(key) {
    if (!shopPerkKeys.includes(key)) {
        console.error(`Ошибка: Неизвестный перк "${key}"`);
        return;
    }

    const perk = currentTexts?.ui.perks?.[key];
    if (!perk) {
        console.error(`Ошибка: Не найден перевод перка "${key}" в базе данных для языка ${state.lang}`);
        return;
    }

    const readyDay = state.cooldowns[key] || 0;
    if (state.day < readyDay) return;

    const isMaxed = (
        (key === 'police_bribe' && state.threat === 0) ||
        (key === 'wife_spa' && state.wife === 100) ||
        (key === 'assuta_vip' && state.health === 100) ||
        (key === 'pr_agency' && state.rating === 100)
    );
    if (isMaxed) return;

    if (state.money < perk.price) {
        alert(currentTexts.ui.shop_not_enough);
        return;
    }

    state.money -= perk.price;
    if (key === 'police_bribe') {
        state.threat = Math.max(0, state.threat - 20);
    } else if (key === 'wife_spa') {
        state.wife = Math.min(100, state.wife + 30);
    } else if (key === 'assuta_vip') {
        state.health = Math.min(100, state.health + 30);
    } else if (key === 'pr_agency') {
        state.rating = Math.min(100, state.rating + 25);
    }

    state.cooldowns[key] = state.day + shopPerkCooldownDays;

    if (typeof playClickSound === 'function') playClickSound();
    if (typeof playCashSound === 'function') playCashSound();

    updateUI();
    checkAchievements();
    saveGuestGame();
}

function toggleAchievements(show) {
    const modal = document.getElementById('achievements-modal');
    if (!modal) return;

    if (show) {
        renderAchievements();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function renderAchievements() {
    if (!currentTexts?.ui.achievements) return;

    document.getElementById('achievements-title').innerText = `🏆 ${currentTexts.ui.achievements_title}`;
    document.getElementById('achievements-dismiss-btn').setAttribute('aria-label', currentTexts.ui.achievements_close);

    const container = document.getElementById('achievements-list');
    container.innerHTML = '';

    ACHIEVEMENTS_DEF.forEach(achievement => {
        const info = currentTexts.ui.achievements[achievement.id];
        if (!info) {
            console.error(`Ошибка: Не найден перевод достижения "${achievement.id}" в базе данных для языка ${state.lang}`);
            return;
        }

        const isUnlocked = state.unlockedAchievements.includes(achievement.id);
        const item = document.createElement('div');
        item.className = `flex items-center gap-3 p-3 rounded-xl border ${
            isUnlocked
                ? 'bg-slate-900 border-purple-500/50 text-white'
                : 'bg-slate-900/40 border-slate-800 text-slate-500'
        }`;

        const icon = document.createElement('div');
        icon.className = 'text-2xl';
        icon.innerText = isUnlocked ? achievement.icon : '🔒';

        const details = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'font-bold text-sm';
        name.innerText = info.name;

        const description = document.createElement('div');
        description.className = `text-xs ${isUnlocked ? 'text-slate-300' : 'text-slate-600'}`;
        description.innerText = info.desc;

        details.append(name, description);
        item.append(icon, details);
        container.appendChild(item);
    });
}

function showAchievementToast(achievement) {
    const info = currentTexts?.ui.achievements?.[achievement.id];
    if (!info) {
        console.error(`Ошибка: Не найден перевод достижения "${achievement.id}" в базе данных для языка ${state.lang}`);
        return;
    }

    const toast = document.createElement('div');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.className = 'fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] bg-purple-700 text-white px-5 py-3 rounded-xl shadow-xl text-center';
    toast.innerText = `🏆 ${currentTexts.ui.achievement_unlocked}: ${info.name}`;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 3500);
}

function checkAchievements() {
    ACHIEVEMENTS_DEF.forEach(achievement => {
        if (!state.unlockedAchievements.includes(achievement.id) && achievement.req(state)) {
            state.unlockedAchievements.push(achievement.id);
            state.earnedAchievementsThisGame.push(achievement.id);
            if (typeof playCashSound === 'function') playCashSound();
            showAchievementToast(achievement);
        }
    });
}

function renderCurrentEvent() {
    if (!currentTexts || state.currentEventIndex === -1) return;

    const logicEvent = gameLogicEvents[state.currentEventIndex];
    const textEvent = currentTexts.events[logicEvent.id];

    if (!textEvent) {
        console.error(`Ошибка: Не найден текст для события с id "${logicEvent.id}" в базе данных для языка ${state.lang}`);
        return;
    }

    updateUI();

    const avatarElem = document.getElementById('event-avatar');
    if (avatarElem) {
        avatarElem.innerText = logicEvent.avatar || '🏛️';
    }

    document.getElementById('event-title').innerText = textEvent.title;
    document.getElementById('event-desc').innerText = textEvent.desc;

    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    logicEvent.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-start bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition border border-slate-600 font-medium cursor-pointer";
        btn.innerHTML = textEvent.choices[index];
        btn.onclick = () => handleChoice(index);
        container.appendChild(btn);
    });
}

function handleChoice(choiceIndex) {
    if (typeof initAudio === 'function') initAudio();
    if (typeof startBgMusic === 'function') startBgMusic();
    if (typeof playClickSound === 'function') playClickSound();
    if (typeof playCashSound === 'function') playCashSound();

    const currentEvent = gameLogicEvents[state.currentEventIndex];
    const choice = currentEvent.choices[choiceIndex];

    state.money += choice.money;
    state.wife = Math.max(0, Math.min(100, state.wife + choice.wife));
    state.threat = Math.max(0, Math.min(100, state.threat + choice.threat));
    state.health = Math.max(0, Math.min(100, state.health + choice.health));
    state.rating = Math.max(0, Math.min(100, state.rating + (choice.rating || 0)));

    if (choice.nextEvent) {
        state.eventQueue.push({
            eventId: choice.nextEvent.id,
            triggerDay: state.day + choice.nextEvent.delay
        });
    }

    const chain = currentEvent.chains?.[choiceIndex];
    if (chain) {
        state.pendingChainEvents.push({
            id: chain.nextEventId,
            triggerDay: state.day + chain.delayDays
        });
    }

    state.day++;
    checkAchievements();
    saveGuestGame();

    if (state.threat >= 100) {
        triggerGameOver('arrest');
        return;
    }
    if (state.wife <= 0) {
        if (typeof playLoseSound === 'function') playLoseSound();
        triggerGameOver('wife_left');
        return;
    }
    if (state.health <= 0) {
        if (typeof playLoseSound === 'function') playLoseSound();
        triggerGameOver('heart_attack');
        return;
    }
    if (state.rating <= 0) {
        if (typeof playLoseSound === 'function') playLoseSound();
        triggerGameOver('elections_lost');
        return;
    }

    loadNextEvent();
}

function loadNextEvent() {
    const chainIndex = state.pendingChainEvents.findIndex(item => state.day >= item.triggerDay);
    if (chainIndex !== -1) {
        const chainEvent = state.pendingChainEvents.splice(chainIndex, 1)[0];
        const eventIndex = gameLogicEvents.findIndex(event => event.id === chainEvent.id);
        if (eventIndex !== -1) {
            state.currentEventIndex = eventIndex;
            renderCurrentEvent();
            return;
        }
        console.error(`Ошибка: Не найдено цепочное событие с id "${chainEvent.id}" в загруженных данных`);
    }

    // 1. Check the queue of delayed events.
    const queuedIndex = state.eventQueue.findIndex(q => q.triggerDay <= state.day);

    if (queuedIndex !== -1) {
        const queuedEvent = state.eventQueue.splice(queuedIndex, 1)[0];
        const targetIndex = gameLogicEvents.findIndex(e => e.id === queuedEvent.eventId);
        if (targetIndex !== -1) {
            state.currentEventIndex = targetIndex;
            renderCurrentEvent();
            return;
        }
    }

    // 2. Otherwise choose a random event, excluding delayed follow-up events.
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * gameLogicEvents.length);
    } while (
        (nextIndex === state.currentEventIndex || gameLogicEvents[nextIndex].isFollowUp) &&
        gameLogicEvents.length > 1
    );

    state.currentEventIndex = nextIndex;
    renderCurrentEvent();
}

function getFinalTitle(reasonType) {
    if (reasonType === 'arrest') return currentTexts.ui.titles.prisoner;
    if (reasonType === 'wife') return currentTexts.ui.titles.henpecked;

    if (state.money >= 10000000) {
        return currentTexts.ui.titles.legend;
    } else if (state.money >= 3000000) {
        return currentTexts.ui.titles.master;
    } else {
        return currentTexts.ui.titles.rookie;
    }
}

function triggerGameOver(reasonType) {
    if (reasonType === 'arrest' && typeof playSirenSound === 'function') {
        playSirenSound();
    }

    if (!state.gameOverRecorded) {
        guestStats = GuestStorage.recordGameOver(getGuestStorage(), {
            money: state.money,
            unlockedAchievements: state.earnedAchievementsThisGame
        });
        state.gameOverRecorded = true;
        GuestStorage.clearGameState(getGuestStorage());
    }

    const screen = document.getElementById('game-over-screen');
    if (!screen) return;

    // Localize the modal elements.
    document.getElementById('label-stat-days').innerText = currentTexts.ui.end_days;
    document.getElementById('label-stat-offshore').innerText = currentTexts.ui.end_offshore;
    document.getElementById('label-stat-title').innerText = currentTexts.ui.end_title;
    document.getElementById('btn-restart').innerText = currentTexts.ui.btn_restart;
    document.getElementById('game-over-title').innerText = currentTexts.ui.end_game_over;

    // Fill in the final statistics.
    document.getElementById('end-stat-days').innerText = state.day;
    document.getElementById('end-stat-money').innerText = state.money.toLocaleString() + ' ₪';
    document.getElementById('end-stat-title').innerText = getFinalTitle(reasonType);

    // Set the reason and icon.
    const reasonText = currentTexts.alerts[reasonType];
    document.getElementById('game-over-reason').innerText = reasonText || '';

    const icons = {
        arrest: '🚨',
        wife_left: '💔',
        heart_attack: '🏥',
        elections_lost: '🗳️'
    };
    document.getElementById('game-over-icon').innerText = icons[reasonType] || '💀';

    screen.classList.remove('hidden');
}

async function resetGame() {
    document.getElementById('game-over-screen').classList.add('hidden');

    state.money = 1000000;
    state.wife = 50;
    state.threat = 15;
    state.health = 90;
    state.rating = 50;
    state.day = 1;
    state.eventQueue = [];
    state.pendingChainEvents = [];
    state.currentEventIndex = -1;
    state.cooldowns = {};
    state.unlockedAchievements = [];
    state.earnedAchievementsThisGame = [];
    state.gameOverRecorded = false;
    await setLang(state.lang);
    loadNextEvent();
    saveGuestGame();

}

window.onload = async () => {
    initializeLanguageSelector();
    document.getElementById('event-title').innerText = 'Загрузка… / Loading… / טוען…';
    try {
        const savedState = GuestStorage.loadGameState(getGuestStorage());
        if (savedState) Object.assign(state, savedState);
        guestStats = GuestStorage.loadGuestStats(getGuestStorage());
        const data = await loadGameData();
        gameLogicEvents = data.events;
        gameLocales = data.locales;
        await setLang(state.lang);
        loadNextEvent(); // Choose and render the first card after loading data.
        saveGuestGame();
    } catch (error) {
        console.error('Ошибка загрузки данных игры', error);
        document.getElementById('event-title').innerText = 'Ошибка загрузки / Loading failed / שגיאת טעינה';
        document.getElementById('event-desc').innerText = 'Обновите страницу. / Reload the page. / רעננו את הדף.';
    }
};
