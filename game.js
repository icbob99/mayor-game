// Игровое состояние
let state = {
    day: 1,
    money: 1500000,
    wife: 50,
    threat: 10,
    health: 90
};

// База данных карточек (ситуаций)
const events = [
    {
        title: "Ремонт дорог и сумочка",
        desc: "Подрядчик по ремонту дорог заносит конверт с откатом за победу в конкурсе. Жена при этом намекает, что сумочка от Chanel сама себя не купит.",
        choices: [
            { text: "🧳 Взять всё! Шикуем.", money: +3000000, wife: +20, threat: +15, health: -2 },
            { text: "👜 Взять умеренно (на сумочку хватит)", money: +1000000, wife: +5, threat: +5, health: 0 },
            { text: "❌ Отказаться, затянуть пояса", money: 0, wife: -25, threat: -5, health: -5 }
        ]
    },
    {
        title: "Наезд Telegram-канала",
        desc: "Анонимный канал опубликовал расследование про загородную дачу мэра, оформленную на тещу-пенсионерку.",
        choices: [
            { text: "💰 Занести авторам канала, чтобы удалили пост", money: -800000, wife: 0, threat: -5, health: -3 },
            { text: "⚖️ Подать в суд через карманного адвоката", money: -300000, wife: 0, threat: -10, health: -8 },
            { text: "🤫 Сделать вид, что ничего не происходит", money: 0, wife: -10, threat: +20, health: -10 }
        ]
    },
    {
        title: "Каприз молодой жены",
        desc: "Супруга требует срочно купить виллу на южном берегу, потому что «все подруги уже там, а я сижу в этой серой мэрии».",
        choices: [
            { text: "🏝️ Купить виллу (тратим все сбережения)", money: -4000000, wife: +40, threat: +10, health: -5 },
            { text: "🚗 Откупиться новой дорогой иномаркой", money: -1500000, wife: +20, threat: +5, health: -2 },
            { text: "🗣️ Устроить скандал: 'Бюджет трещит, потерпи!'", money: 0, wife: -30, threat: 0, health: -15 }
        ]
    }
];

function updateUI() {
    document.getElementById('stat-money').innerText = state.money.toLocaleString() + ' ₽';
    document.getElementById('stat-wife').innerText = state.wife + '%';
    document.getElementById('stat-threat').innerText = state.threat + '%';
    document.getElementById('stat-health').innerText = state.health + '%';
    document.getElementById('day-counter').innerText = `День ${state.day}`;
}

function handleChoice(choiceIndex) {
    const currentEvent = events[(state.day - 1) % events.length];
    const choice = currentEvent.choices[choiceIndex];

    state.money += choice.money;
    state.wife = Math.max(0, Math.min(100, state.wife + choice.wife));
    state.threat = Math.max(0, Math.min(100, state.threat + choice.threat));
    state.health = Math.max(0, Math.min(100, state.health + choice.health));
    state.day++;

    if (state.threat >= 100) {
        alert("🚨 АРЕСТ! К вам в кабинет с обыском ворвался спецназ. Игра окончена!");
        resetGame();
        return;
    }
    if (state.wife <= 0) {
        alert("💔 ЖЕНА УШЕЛА! Забрала половину офшоров и слила все пароли следственному комитету. Конец карьеры.");
        resetGame();
        return;
    }
    if (state.health <= 0) {
        alert("❤️‍🩹 ИНФАРКТ! Мэр не выдержал нервотрепки на рабочем месте.");
        resetGame();
        return;
    }

    loadNextEvent();
}

function loadNextEvent() {
    const currentEvent = events[(state.day - 1) % events.length];
    document.getElementById('event-title').innerText = currentEvent.title;
    document.getElementById('event-desc').innerText = currentEvent.desc;

    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    currentEvent.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition border border-slate-600 font-medium cursor-pointer";
        btn.innerHTML = choice.text;
        btn.onclick = () => handleChoice(index);
        container.appendChild(btn);
    });

    updateUI();
}

function resetGame() {
    state = { day: 1, money: 1500000, wife: 50, threat: 10, health: 90 };
    loadNextEvent();
}

// Стартовый запуск игры
loadNextEvent();