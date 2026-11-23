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
    renderModes();
}

function showEventAtIndex(eventIndex, order) {
    state.currentEventIndex = eventIndex;
    const choices = gameLogicEvents[eventIndex]?.choices || [];
    currentChoiceOrder = order?.length === choices.length && new Set(order).size === choices.length &&
        order.every(i => Number.isInteger(i) && i >= 0 && i < choices.length) ? order : shuffleChoiceOrder(choices.length);
    state.currentEventId = gameLogicEvents[eventIndex].id;
    state.choiceOrder = [...currentChoiceOrder];
    renderCurrentEvent();
    startBlitzTurn();
}

function restoreCurrentEvent() {
    const index = state.mode === 'daily' ? gameLogicEvents.findIndex(e => e.id === state.currentEventId) : -1;
    if (index >= 0) showEventAtIndex(index, state.choiceOrder);
    else loadNextEvent();
}

function handleChoice(choiceIndex) {
    if (state.mode === 'daily' && !AccountSession.isMayor()) {
        // Serialize guest daily moves across tabs sharing this origin.
        const act = () => { GuestSession.refreshDaily(state); applyChoice(choiceIndex); };
        return navigator.locks ? navigator.locks.request('mayor-daily-turn', act) : act();
    }
    return applyChoice(choiceIndex);
}

function applyChoice(choiceIndex) {
    if (state.gameOverRecorded) return;
    if (!AccountSession.canPlay()) { updateAuthUI(); return; }
    if (!GameModes.canAct(state)) { updateUI(); return; }
    if (state.mode === 'blitz' && blitzClock.tick()) return;
    if (typeof initAudio === 'function') initAudio();
    if (typeof startBgMusic === 'function') startBgMusic();
    if (typeof playClickSound === 'function') playClickSound();
    if (typeof playCashSound === 'function') playCashSound();
    const currentEvent = gameLogicEvents[state.currentEventIndex];
    const choice = currentEvent.choices[choiceIndex];
    if (!choice) return;
    if (!GameModes.useTurn(state)) return;
    stopBlitzTurn();
    const reason = Difficulty.applyChoice(state, choice) || GameModes.retirement(state);
    if (choice.nextEvent) state.eventQueue.push({ eventId: choice.nextEvent.id, triggerDay: state.day + choice.nextEvent.delay });
    if (reason !== 'honorable_retirement') state.day++;
    if (reason) {
        if (!['arrest', 'honorable_retirement'].includes(reason) && typeof playLoseSound === 'function') playLoseSound();
        return triggerGameOver(reason);
    }
    checkAchievements();
    loadNextEvent();
    saveGuestGame();
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
