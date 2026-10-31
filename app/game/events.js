function renderCurrentEvent() {
    if (!currentTexts || state.currentEventIndex === -1) return;
    const logicEvent = gameLogicEvents[state.currentEventIndex];
    const textEvent = currentTexts.events[logicEvent.id];
    if (!textEvent) {
        console.error(gameErrorText('event_text_missing', logicEvent.id));
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
    if (!AccountSession.canPlay()) { updateAuthUI(); return; }
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
    state.day++;
    checkAchievements();
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
    saveGuestGame();
    loadNextEvent();
}

function loadNextEvent() {
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
