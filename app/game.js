let state = {
    money: 1000000,
    wife: 50,
    threat: 15,
    health: 90,
    rating: 50,
    day: 1,
    lang: 'ru',
    currentEventIndex: -1,
    eventQueue: [],
    cooldowns: {}
};

let currentTexts = null;
let languageRequestId = 0;
const shopPerkKeys = ['police_bribe', 'wife_spa', 'assuta_vip', 'pr_agency'];
const shopPerkCooldownDays = 7;

async function setLang(lang) {
    const requestId = ++languageRequestId;
    state.lang = lang;
    document.documentElement.dir = (lang === 'he') ? 'rtl' : 'ltr';

    const buttons = document.querySelectorAll('#lang-selector button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-indigo-600');
        btn.classList.add('bg-slate-700');
    });

    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-indigo-600');
        activeBtn.classList.remove('bg-slate-700');
    }

    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const texts = await response.json();
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

    if (state.currentEventIndex === -1) {
        document.getElementById('event-title').innerText = currentTexts.ui.loading_title;
        document.getElementById('event-desc').innerText = currentTexts.ui.loading_desc;
        document.getElementById('choices-container').innerHTML = '';
    }

    if (!document.getElementById('shop-modal').classList.contains('hidden')) {
        renderShop();
    }
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
            console.error(`Ошибка: Не найден перевод перка "${key}" в locales/${state.lang}.json`);
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
        console.error(`Ошибка: Не найден перевод перка "${key}" в locales/${state.lang}.json`);
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

    updateUI();
}

function renderCurrentEvent() {
    if (!currentTexts || state.currentEventIndex === -1) return;

    const logicEvent = gameLogicEvents[state.currentEventIndex];
    const textEvent = currentTexts.events[logicEvent.id];

    if (!textEvent) {
        console.error(`Ошибка: Не найден текст для события с id "${logicEvent.id}" в locales/${state.lang}.json`);
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

    state.day++;

    if (state.threat >= 100) {
        if (typeof playSirenSound === 'function') playSirenSound();
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
    // 1. Проверяем очередь отложенных событий
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

    // 2. Иначе выбираем случайное событие (исключая отложенные isFollowUp)
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

    const screen = document.getElementById('game-over-screen');
    if (!screen) return;

    // Локализация элементов модалки
    document.getElementById('label-stat-days').innerText = currentTexts.ui.end_days;
    document.getElementById('label-stat-offshore').innerText = currentTexts.ui.end_offshore;
    document.getElementById('label-stat-title').innerText = currentTexts.ui.end_title;
    document.getElementById('btn-restart').innerText = currentTexts.ui.btn_restart;
    document.getElementById('game-over-title').innerText = currentTexts.ui.end_game_over;

    // Подстановка статистики
    document.getElementById('end-stat-days').innerText = state.day;
    document.getElementById('end-stat-money').innerText = state.money.toLocaleString() + ' ₪';
    document.getElementById('end-stat-title').innerText = getFinalTitle(reasonType);

    // Причина и иконка
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
    state.currentEventIndex = -1;
    state.cooldowns = {};
    await setLang(state.lang);
    loadNextEvent();

}

window.onload = async () => {
    await setLang('ru');
    loadNextEvent(); // Вызываем выбор и отрисовку карточки сразу после загрузки словаря
};