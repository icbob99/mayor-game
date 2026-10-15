// Игровое состояние
let state = {
    day: 1,
    money: 1500000,
    wife: 50,
    threat: 15,
    health: 90,
    lang: 'ru', // Текущий язык по умолчанию
    currentEventIndex: 0 // Запоминаем текущую карточку
};

// Функция смены языка
function setLanguage(lang) {
    state.lang = lang;
    
    // Меняем направление текста для иврита (RTL)
    const htmlRoot = document.getElementById('html-root');
    if (lang === 'he') {
        htmlRoot.setAttribute('dir', 'rtl');
    } else {
        htmlRoot.setAttribute('dir', 'ltr');
    }

    updateUI();
    // Чтобы при смене языка карточка не перепрыгивала, просто обновляем тексты текущей
    renderCurrentEvent(); 
}

function updateUI() {
    const t = gameData.translations[state.lang];

    // Обновляем подписи шкал
    document.getElementById('label-money').innerText = t.money;
    document.getElementById('label-wife').innerText = t.wife;
    document.getElementById('label-threat').innerText = t.threat;
    document.getElementById('label-health').innerText = t.health;

    // Обновляем значения
    document.getElementById('stat-money').innerText = state.money.toLocaleString() + ' ₪';
    document.getElementById('stat-wife').innerText = state.wife + '%';
    document.getElementById('stat-threat').innerText = state.threat + '%';
    document.getElementById('stat-health').innerText = state.health + '%';
    
    document.getElementById('day-counter').innerText = `${t.day} ${state.day}`;
}

function handleChoice(choiceIndex) {
    // Берем текущее событие по сохраненному индексу
    const currentEvent = gameData.events[state.currentEventIndex];
    const choice = currentEvent.choices[choiceIndex];

    state.money += choice.money;
    state.wife = Math.max(0, Math.min(100, state.wife + choice.wife));
    state.threat = Math.max(0, Math.min(100, state.threat + choice.threat));
    state.health = Math.max(0, Math.min(100, state.health + choice.health));
    state.day++;

    // Условия поражения (используем одинарные кавычки для защиты от ошибок в тексте)
    if (state.threat >= 100) {
        alert(state.lang === 'he' ? '🚨 מעצר! הימ"מ פרץ למשרד!' : state.lang === 'en' ? '🚨 ARREST! Lahav 433 raided your office!' : '🚨 АРЕСТ! К вам в кабинет ворвался спецназ Лахав 433!');
        resetGame();
        return;
    }
    if (state.wife <= 0) {
        alert(state.lang === 'he' ? '💔 אשתו עזבה! לקחה חצי מהחשבונות.' : state.lang === 'en' ? '💔 WIFE LEFT! She took half your offshore accounts.' : '💔 ЖЕНА УШЕЛА! Забрала половину офшоров и слила всё в полицию.');
        resetGame();
        return;
    }
    if (state.health <= 0) {
        alert(state.lang === 'he' ? '❤️‍🩹 התקף לב! ראש העיר לא עמד בלחץ.' : state.lang === 'en' ? '❤️‍🩹 HEART ATTACK! The mayor couldn\'t handle the stress.' : '❤️‍🩹 ИНФАРКТ! Мэр не выдержал проверок и нервотрепки.');
        resetGame();
        return;
    }

    loadNextEvent();
}

function loadNextEvent() {
    // Умный рандом: выбираем случайную карточку, но не ту, что была вчера
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * gameData.events.length);
    } while (nextIndex === state.currentEventIndex && gameData.events.length > 1);
    
    state.currentEventIndex = nextIndex;
    renderCurrentEvent();
}

function renderCurrentEvent() {
    const currentEvent = gameData.events[state.currentEventIndex];
    
    document.getElementById('event-title').innerText = currentEvent.title[state.lang];
    document.getElementById('event-desc').innerText = currentEvent.desc[state.lang];

    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    currentEvent.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition border border-slate-600 font-medium cursor-pointer";
        btn.innerHTML = choice.text[state.lang];
        btn.onclick = () => handleChoice(index);
        container.appendChild(btn);
    });

    updateUI();
}

function resetGame() {
    state = { day: 1, money: 1500000, wife: 50, threat: 15, health: 90, lang: state.lang, currentEventIndex: 0 };
    loadNextEvent();
}

// Стартовый запуск игры
loadNextEvent();