let state = {
    money: 1000000,
    wife: 50,
    threat: 15,
    health: 90,
    rating: 50,
    day: 1,
    lang: 'ru',
    currentEventIndex: -1,
    eventQueue: [] // [{ eventId: '...', triggerDay: N }]
};

let currentTexts = null;

async function setLang(lang) {
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
        currentTexts = await response.json();
    } catch (error) {
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
}

function renderCurrentEvent() {
    if (!currentTexts || state.currentEventIndex === -1) return;

    const logicEvent = gameLogicEvents[state.currentEventIndex];
    const textEvent = currentTexts.events[logicEvent.id];

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

    updateUI();
}

function handleChoice(choiceIndex) {
    initAudio();
    startBgMusic();
    playClickSound();

    const currentEvent = gameLogicEvents[state.currentEventIndex];
    const choice = currentEvent.choices[choiceIndex];

    state.money += choice.money;
    state.wife = Math.max(0, Math.min(100, state.wife + choice.wife));
    state.threat = Math.max(0, Math.min(100, state.threat + choice.threat));
    state.health = Math.max(0, Math.min(100, state.health + choice.health));
    state.rating = Math.max(0, Math.min(100, state.rating + (choice.rating || 0)));
    
    // Запись отложенного события в очередь
    if (choice.nextEvent) {
        state.eventQueue.push({
            eventId: choice.nextEvent.id,
            triggerDay: state.day + choice.nextEvent.delay
        });
    }

    state.day++;

    if (state.threat >= 100) {
        playSirenSound();
        alert(currentTexts.alerts.arrest);
        resetGame();
        return;
    }
    if (state.wife <= 0) {
        playLoseSound();
        alert(currentTexts.alerts.wife_left);
        resetGame();
        return;
    }
    if (state.health <= 0) {
        playLoseSound();
        alert(currentTexts.alerts.heart_attack);
        resetGame();
        return;
    }
    if (state.rating <= 0) {
        playLoseSound();
        alert(currentTexts.alerts.elections_lost);
        resetGame();
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

    // 2. Иначе выбираем случайное событие (но не реактивное)
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

async function resetGame() {
    state.money = 1000000;
    state.wife = 50;
    state.threat = 15;
    state.health = 90;
    state.rating = 50;
    state.day = 1;
    state.eventQueue = [];
    state.currentEventIndex = -1;
    await setLang(state.lang);
    loadNextEvent();
}

window.onload = async () => {
    await setLang('ru');
    loadNextEvent();
};