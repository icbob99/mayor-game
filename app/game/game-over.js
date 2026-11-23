function getFinalTitle(reasonType) {
    if (reasonType === 'honorable_retirement') return currentTexts.ui.titles.honorable_retirement;
    if (reasonType === 'resignation') return currentTexts.ui.titles[state.money >= 5000000 ? 'resignation_peak' : 'resignation'];
    if (reasonType === 'indecision') return currentTexts.ui.titles.indecision;
    if (reasonType === 'arrest') return currentTexts.ui.titles.prisoner;
    if (reasonType === 'wife_left') return currentTexts.ui.titles.henpecked;
    if (['bankruptcy', 'too_popular', 'wife_abroad'].includes(reasonType)) return currentTexts.ui.titles[reasonType];

    if (state.money >= 10000000) {
        return currentTexts.ui.titles.legend;
    } else if (state.money >= 3000000) {
        return currentTexts.ui.titles.master;
    } else {
        return currentTexts.ui.titles.rookie;
    }
}

function triggerGameOver(reasonType) {
    stopBlitzTurn();
    if (reasonType === 'arrest' && typeof playSirenSound === 'function') {
        playSirenSound();
    }

    if (!state.gameOverRecorded) {
        state.gameOverRecorded = true;
        state.endReason = reasonType;
        state.finishedAt = Date.now();
        checkAchievements();
        GameModes.checkpoint(state);
        if (AccountSession.isMayor()) saveGuestGame();
        else inviteGuest(GuestSession.recordGameOver(state).gamesPlayed);
    }

    renderGameOver(reasonType);
}

function renderGameOver(reasonType = state.endReason) {
    const screen = document.getElementById('game-over-screen');
    if (!screen) return;
    updateUI();

    // Localize the modal elements.
    document.getElementById('label-stat-days').innerText = currentTexts.ui.end_days;
    document.getElementById('label-stat-offshore').innerText = currentTexts.ui.end_offshore;
    document.getElementById('label-stat-title').innerText = currentTexts.ui.end_title;
    document.getElementById('btn-restart').innerText = currentTexts.ui.btn_restart;
    const victory = reasonType === 'honorable_retirement';
    document.getElementById('game-over-title').innerText = victory ? currentTexts.ui.end_victory : currentTexts.ui.end_game_over;
    document.getElementById('game-over-title').classList.toggle('text-amber-300', victory);
    document.getElementById('game-over-title').classList.toggle('text-white', !victory);

    // Fill in the final statistics.
    document.getElementById('end-stat-days').innerText = state.day;
    document.getElementById('end-stat-money').innerText = state.money.toLocaleString() + ' ₪';
    document.getElementById('end-stat-title').innerText = getFinalTitle(reasonType);
    document.getElementById('label-stat-score').innerText = currentTexts.ui.end_score;
    document.getElementById('end-stat-score').innerText = GameModes.mayorScore(state).toLocaleString();
    document.getElementById('end-score-bonus').innerText = victory ? currentTexts.ui.end_score_bonus : '';
    document.getElementById('end-score-bonus').hidden = !victory;
    const bonusAchievement = document.getElementById('end-bonus-achievement');
    const unsinkable = state.earnedAchievementsThisGame.includes('unsinkable');
    bonusAchievement.hidden = !unsinkable;
    bonusAchievement.innerText = unsinkable ? '🦾 ' + currentTexts.ui.achievements.unsinkable.name : '';

    // Set the reason and icon.
    const reasonText = currentTexts.alerts[reasonType];
    document.getElementById('game-over-reason').innerText = reasonText || '';

    const icons = {
        arrest: '🚨',
        wife_left: '💔',
        heart_attack: '🏥',
        elections_lost: '🗳️',
        bankruptcy: '📉',
        too_popular: '🎯',
        wife_abroad: '✈️',
        resignation: '🚪',
        indecision: '⌛',
        honorable_retirement: '👑'
    };
    document.getElementById('game-over-icon').innerText = icons[reasonType] || '💀';

    screen.classList.remove('hidden');
}


async function resetGame(difficulty = 'normal', mode = state.mode || 'arcade') {
    if (!AccountSession.canPlay()) { updateAuthUI(); return; }
    if (!GameModes.available(mode) || (mode === 'daily' && GameModes.remaining(state) === 0)) { updateUI(); return; }
    stopBlitzTurn();
    document.getElementById('game-over-screen').classList.add('hidden');

    state.money = 1000000;
    state.wife = 50;
    state.threat = 15;
    state.health = Difficulty.initialHealth(mode, difficulty);
    state.rating = 50;
    state.day = 1;
    state.mode = mode;
    state.eventQueue = [];
    state.currentEventIndex = -1;
    state.currentEventId = null;
    state.choiceOrder = [];
    state.cooldowns = {};
    state.difficulty = Difficulty.forMode(mode, difficulty);
    state.shopPrices = {};
    state.unlockedAchievements = [];
    state.earnedAchievementsThisGame = [];
    state.gameOverRecorded = false;
    state.endReason = null;
    state.finishedAt = null;
    state.gameId = crypto.randomUUID();
    await setLang(state.lang);
    loadNextEvent();
    saveGuestGame();
}
