let state = {
    money: 1000000,
    wife: 50,
    threat: 15,
    health: 90,
    day: 1,
    lang: 'ru',
    currentEventIndex: -1
};

let currentTexts = null; // Здесь будет храниться загруженный JSON текущего языка

// Загрузка JSON словаря
async function loadDictionary(lang) {
    try {
        const response = await fetch(`locales/\${lang}.json`);
        currentTexts = await response.json();
    } catch (error) {
        console.error("Ошибка загрузки словаря! Если открываешь файл локально (file://), fetch может не сработать из-за CORS. Нужен локальный сервер (например, Live Server в VS Code).", error);
        alert("Ошибка загрузки языкового файла.");
    }
}

async function setLang(lang) {
    state.lang = lang;
    document.documentElement.dir = (lang === 'he') ? 'rtl' : 'ltr';
    
    // Выделение активной кнопки языка
    document.querySelectorAll('#lang-selector button').forEach(btn => {
        btn.classList.remove('bg-indigo-600');
        btn.classList.add('bg-slate-700');
    });
    document.getElementById(`btn-\${lang}`).classList.add('bg-indigo-600');
    document.getElementById(`btn-\${lang}`).classList.remove('bg-slate-700');

    await loadDictionary(lang); // Ждем загрузки файла
    
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

    document.getElementById('stat-money').innerText = state.money.toLocaleString() + ' ₪';
    document.getElementById('stat-wife').innerText = state.wife + '%';
    document.getElementById('stat-threat').innerText = state.threat + '%';
    document.getElementById('stat-health').innerText = state.health + '%';
    document.getElementById('day-counter').innerText = `${currentTexts.ui.day}${state.day}`;
}

function renderCurrentEvent() {
    if (!currentTexts) return;

    const logicEvent = gameLogicEvents[state.currentEventIndex];
    const textEvent = currentTexts.events[logicEvent.id];
    
    document.getElementById('event-title').innerText = textEvent.title;
    document.getElementById('event-desc').innerText = textEvent.desc;

    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    logicEvent.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition border border-slate-600 font-medium cursor-pointer";
        btn.innerHTML = textEvent.choices[index];
        btn.onclick = () => handleChoice(index);
        container.appendChild(btn);
    });
}

function handleChoice(choiceIndex) {
    const currentEvent = gameLogicEvents[state.currentEventIndex];
    const choice = currentEvent.choices[choiceIndex];

    state.money += choice.money;
    state.wife = Math.max(0, Math.min(100, state.wife + choice.wife));
    state.threat = Math.max(0, Math.min(100, state.threat + choice.threat));
    state.health = Math.max(0, Math.min(100, state.health + choice.health));
    state.day++;

    if (state.threat >= 100) {
        alert(state.lang === 'he' ? '🚨 מעצר!' : '🚨 АРЕСТ!');
        resetGame();
        return;
    }
    if (state.wife <= 0) {
        alert(state.lang === 'he' ? '💔 אשתו עזבה!' : '💔 ЖЕНА УШЛА!');
        resetGame();
        return;
    }
    if (state.health <= 0) {
        alert(state.lang === 'he' ? '❤️‍🩹 התקף לב!' : '❤️‍🩹 ИНФАРКТ!');
        resetGame();
        return;
    }

    loadNextEvent();
}

function loadNextEvent() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * gameLogicEvents.length);
    } while (nextIndex === state.currentEventIndex && gameLogicEvents.length > 1);
    
    state.currentEventIndex = nextIndex;
    renderCurrentEvent();
}

async function resetGame() {
    state.money = 1000000;
    state.wife = 50;
    state.threat = 15;
    state.health = 90;
    state.day = 1;
    state.currentEventIndex = -1;
    await setLang(state.lang);
    loadNextEvent();
}

// Старт игры
window.onload = async () => {
    await setLang('ru');
    loadNextEvent();
};