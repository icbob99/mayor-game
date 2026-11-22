const modeIcons = { arcade: '🎮', daily: '📅', blitz: '⚡' };
const blitzClock = GameModes.createClock(() => triggerGameOver('indecision'));
let blitzFrame = null;
let dailyMidnight = null;

function modalIsOpen() {
    return Boolean(document.querySelector('dialog[open]')) ||
        [...document.querySelectorAll('[role="dialog"], #game-over-screen')].some(el => !el.classList.contains('hidden') && !el.hidden);
}
function syncBlitzPause() {
    if (document.hidden || modalIsOpen() || !AccountSession.canPlay()) blitzClock.pause();
    else blitzClock.resume();
}
function stopBlitzTurn() {
    blitzClock.stop();
    if (blitzFrame !== null) cancelAnimationFrame(blitzFrame);
    blitzFrame = null;
}
function startBlitzTurn() {
    stopBlitzTurn();
    if (state.mode !== 'blitz' || state.gameOverRecorded) return;
    const duration = GameModes.blitzDuration(state.day);
    blitzClock.start(duration);
    function draw() {
        syncBlitzPause();
        if (blitzClock.tick()) return;
        document.getElementById('blitz-progress').style.transform = `scaleX(${blitzClock.remaining() / duration})`;
        blitzFrame = requestAnimationFrame(draw);
    }
    draw();
}
function confirmGameAction(text) {
    blitzClock.pause();
    try { return confirm(text); }
    finally { syncBlitzPause(); }
}
function renderModes() {
    const texts = currentTexts?.ui.modes;
    if (!texts) return;
    const remaining = GameModes.remaining(state);
    const daily = state.mode === 'daily';
    const allowed = AccountSession.canPlay() && GameModes.canAct(state);
    for (const id of ['btn-mode', 'btn-end-mode']) {
        const button = document.getElementById(id);
        button.textContent = `${modeIcons[state.mode]} ${texts[state.mode].name}`;
        button.title = button.textContent;
        button.disabled = !AccountSession.canPlay();
    }
    document.getElementById('mode-title').textContent = texts.label;
    document.getElementById('mode-dismiss').setAttribute('aria-label', currentTexts.ui.difficulty.close);
    document.getElementById('btn-resign').textContent = `🚪 ${texts.resign}`;
    document.getElementById('btn-resign').disabled = !allowed || Boolean(state.gameOverRecorded);
    document.getElementById('btn-restart').disabled = !allowed;
    document.getElementById('btn-shop').hidden = state.mode === 'blitz';
    document.getElementById('daily-turns').hidden = !daily;
    document.getElementById('daily-turns').textContent = texts.turns.replace('{remaining}', remaining);
    for (const id of ['daily-closed', 'daily-end-closed']) {
        const el = document.getElementById(id);
        el.hidden = !daily || remaining > 0;
        el.textContent = texts.closed;
    }
    document.getElementById('choices-container').inert = !allowed || Boolean(state.gameOverRecorded);
    for (const button of document.querySelectorAll('#choices-container button')) button.disabled = !allowed || Boolean(state.gameOverRecorded);
    document.getElementById('blitz-timer').hidden = state.mode !== 'blitz' || Boolean(state.gameOverRecorded);
    const reminder = document.getElementById('daily-reminder');
    reminder.hidden = !GameModes.settings.dailyEnabled || !state.daily.game || daily || remaining === 0;
    reminder.textContent = texts.reminder.replace('{remaining}', remaining);
}
function toggleModes(show) {
    const dialog = document.getElementById('mode-modal');
    if (!show) { dialog.close(); return; }
    const texts = currentTexts?.ui.modes;
    if (!texts) return;
    document.getElementById('mode-options').replaceChildren(...GameModes.names.filter(GameModes.available).map(mode => {
        const button = document.createElement('button');
        button.type = 'button'; button.dataset.mode = mode;
        button.setAttribute('aria-pressed', String(mode === state.mode));
        button.className = `w-full rounded-xl border p-4 text-start ${mode === state.mode ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-700 border-slate-600'}`;
        const name = document.createElement('strong'); name.textContent = `${modeIcons[mode]} ${texts[mode].name}`;
        const description = document.createElement('div'); description.className = 'text-sm mt-1'; description.textContent = texts[mode].description;
        button.append(name, description);
        button.onclick = () => selectMode(mode);
        return button;
    }));
    renderModes();
    if (!dialog.open) dialog.showModal();
    syncBlitzPause();
}
async function selectMode(mode) {
    if (!AccountSession.canPlay() || !GameModes.available(mode)) return;
    if (mode === state.mode) { toggleModes(false); return; }
    const texts = currentTexts.ui.modes;
    if (state.day > 1 && !state.gameOverRecorded && !confirmGameAction(state.mode === 'daily' ? texts.pauseDaily : texts.restart)) return;
    GameModes.checkpoint(state);
    stopBlitzTurn();
    toggleModes(false);
    const saved = mode === 'daily' ? GameModes.resumeDaily(state) : null;
    if (saved) {
        Object.assign(state, saved);
        document.getElementById('game-over-screen').classList.add('hidden');
        if (state.gameOverRecorded) triggerGameOver(state.endReason);
        else restoreCurrentEvent();
        saveGuestGame(); updateUI();
    } else if (state.day === 1 && !state.gameOverRecorded) {
        // The archived daily term and the new mode must not share a history identity.
        if (state.mode === 'daily') state.gameId = crypto.randomUUID();
        state.mode = mode;
        state.difficulty = Difficulty.forMode(mode, state.difficulty);
        saveGuestGame(); updateUI(); startBlitzTurn();
    } else await resetGame(state.difficulty, mode);
}
function resign() {
    if (state.mode === 'daily' && !AccountSession.isMayor()) GuestSession.refreshDaily(state);
    if (state.gameOverRecorded || !AccountSession.canPlay() || !GameModes.canAct(state)) return;
    if (state.mode === 'blitz' && blitzClock.tick()) return;
    if (!confirmGameAction(currentTexts.ui.modes.confirmResign)) return;
    // Resignation finishes a term; it is not an extra decision or passive drift.
    triggerGameOver('resignation');
}
function refreshDailyDate() {
    clearTimeout(dailyMidnight);
    if (currentTexts) {
        if (!AccountSession.isMayor()) GuestSession.refreshDaily(state);
        const previous = state.daily?.date;
        GameModes.remaining(state);
        if (previous && previous !== state.daily.date) saveGuestGame();
        renderModes();
    }
    const next = new Date(); next.setHours(24, 0, 0, 50);
    dailyMidnight = setTimeout(refreshDailyDate, Math.max(50, next.getTime() - Date.now()));
}
document.addEventListener('visibilitychange', () => { syncBlitzPause(); if (!document.hidden) refreshDailyDate(); });
window.addEventListener('focus', refreshDailyDate);
window.addEventListener('load', () => {
    const observer = new MutationObserver(syncBlitzPause);
    for (const el of document.querySelectorAll('dialog, [role="dialog"], #game-over-screen')) {
        observer.observe(el, { attributes: true, attributeFilter: ['class', 'open', 'hidden'] });
    }
    refreshDailyDate();
});
