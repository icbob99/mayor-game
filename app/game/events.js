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
    if (avatarElem) avatarElem.innerText = logicEvent.avatar || '🏛️';
    document.getElementById('event-title').innerText = textEvent.title;
    document.getElementById('event-desc').innerText = textEvent.desc;
    const container = document.getElementById('choices-container');
    container.innerHTML = '';
    const choiceOrder = currentChoiceOrder.length === logicEvent.choices.length
        ? currentChoiceOrder
        : logicEvent.choices.map((_, index) => index);
    choiceOrder.forEach((choiceIndex) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-start bg-slate-700 hover:bg-slate-600 p-4 rounded-xl transition border border-slate-600 font-medium cursor-pointer";
        btn.innerHTML = textEvent.choices[choiceIndex];
        btn.onclick = () => handleChoice(choiceIndex);
        container.appendChild(btn);
    });
}

function showEventAtIndex(eventIndex) {
    state.currentEventIndex = eventIndex;
    const choices = gameLogicEvents[eventIndex]?.choices || [];
    currentChoiceOrder = shuffleChoiceOrder(choices.length);
    renderCurrentEvent();
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
    if (choice.nextEvent) state.eventQueue.push({ eventId: choice.nextEvent.id, triggerDay: state.day + choice.nextEvent.delay });
    const chain = currentEvent.chains?.[choiceIndex];
    if (chain) state.pendingChainEvents.push({ id: chain.nextEventId, triggerDay: state.day + chain.delayDays });
    state.day++;
    checkAchievements();
    saveGuestGame();
    if (state.threat >= 100) return triggerGameOver('arrest');
    if (state.wife <= 0) {
        if (typeof playLoseSound === 'function') playLoseSound();
        return triggerGameOver('wife_left');
    }
    if (state.health <= 0) {
        if (typeof playLoseSound === 'function') playLoseSound();
        return triggerGameOver('heart_attack');
    }
    if (state.rating <= 0) {
        if (typeof playLoseSound === 'function') playLoseSound();
        return triggerGameOver('elections_lost');
    }
    loadNextEvent();
}

function loadNextEvent() {
    const chainIndex = state.pendingChainEvents.findIndex(item => state.day >= item.triggerDay);
    if (chainIndex !== -1) {
        const chainEvent = state.pendingChainEvents.splice(chainIndex, 1)[0];
        const eventIndex = gameLogicEvents.findIndex(event => event.id === chainEvent.id);
        if (eventIndex !== -1) {
            showEventAtIndex(eventIndex);
            return;
        }
        console.error(`Ошибка: Не найдено цепочное событие с id "${chainEvent.id}" в загруженных данных`);
    }
    const queuedIndex = state.eventQueue.findIndex(q => q.triggerDay <= state.day);
    if (queuedIndex !== -1) {
        const queuedEvent = state.eventQueue.splice(queuedIndex, 1)[0];
        const targetIndex = gameLogicEvents.findIndex(e => e.id === queuedEvent.eventId);
        if (targetIndex !== -1) {
            showEventAtIndex(targetIndex);
            return;
        }
    }
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * gameLogicEvents.length);
    } while ((nextIndex === state.currentEventIndex || gameLogicEvents[nextIndex].isFollowUp) && gameLogicEvents.length > 1);
    showEventAtIndex(nextIndex);
}
