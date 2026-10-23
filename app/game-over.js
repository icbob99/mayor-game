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
    if (reasonType === 'arrest' && typeof playSirenSound === 'function') {
        playSirenSound();
    }

    if (!state.gameOverRecorded) {
        GuestSession.recordGameOver(state);
        state.gameOverRecorded = true;
    }

    const screen = document.getElementById('game-over-screen');
    if (!screen) return;

    // Localize the modal elements.
    document.getElementById('label-stat-days').innerText = currentTexts.ui.end_days;
    document.getElementById('label-stat-offshore').innerText = currentTexts.ui.end_offshore;
    document.getElementById('label-stat-title').innerText = currentTexts.ui.end_title;
    document.getElementById('btn-restart').innerText = currentTexts.ui.btn_restart;
    document.getElementById('game-over-title').innerText = currentTexts.ui.end_game_over;

    // Fill in the final statistics.
    document.getElementById('end-stat-days').innerText = state.day;
    document.getElementById('end-stat-money').innerText = state.money.toLocaleString() + ' ₪';
    document.getElementById('end-stat-title').innerText = getFinalTitle(reasonType);

    // Set the reason and icon.
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
    state.pendingChainEvents = [];
    state.currentEventIndex = -1;
    state.cooldowns = {};
    state.unlockedAchievements = [];
    state.earnedAchievementsThisGame = [];
    state.gameOverRecorded = false;
    await setLang(state.lang);
    loadNextEvent();
    saveGuestGame();
}
