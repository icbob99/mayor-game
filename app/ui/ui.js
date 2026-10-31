function updateUI() {
    if (!currentTexts) return;
    updateAuthUI();

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
    document.getElementById('label-btn-shop').innerText = currentTexts.ui.btn_shop;
    document.getElementById('btn-achievements').setAttribute('aria-label', currentTexts.ui.btn_achievements);
    document.getElementById('btn-guest-stats').setAttribute('aria-label', currentTexts.ui.guest_stats_title);
    document.getElementById('guest-stats-games-label').innerText = currentTexts.ui.guest_stats_games;
    document.getElementById('guest-stats-money-label').innerText = currentTexts.ui.guest_stats_max_money;
    document.getElementById('guest-stats-achievements-label').innerText = currentTexts.ui.guest_stats_achievements;

    if (state.currentEventIndex === -1) {
        document.getElementById('event-title').innerText = currentTexts.ui.loading_title;
        document.getElementById('event-desc').innerText = currentTexts.ui.loading_desc;
        document.getElementById('choices-container').innerHTML = '';
    }

    if (!document.getElementById('shop-modal').classList.contains('hidden')) {
        renderShop();
    }
    if (!document.getElementById('achievements-modal').classList.contains('hidden')) {
        renderAchievements();
    }
    if (!document.getElementById('guest-stats-modal').classList.contains('hidden')) {
        renderGuestStats();
    }
}

function saveGuestGame() {
    if (AccountSession.isMayor()) AccountSession.save(state);
    else GuestSession.save(state);
}

function setAudioPreference(muted) {
    state.audioMuted = Boolean(muted);
    saveGuestGame();
}

function toggleGuestStats(show) {
    const modal = document.getElementById('guest-stats-modal');
    if (!modal) return;
    if (show) {
        renderGuestStats();
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

function renderGuestStats() {
    if (!currentTexts?.ui) return;
    document.getElementById('guest-stats-title').innerText = `📜 ${currentTexts.ui.guest_stats_title}`;
    document.getElementById('guest-stats-close-btn').innerText = currentTexts.ui.guest_stats_close;
    document.getElementById('guest-stats-dismiss-btn').setAttribute('aria-label', currentTexts.ui.guest_stats_close);
    const stats = AccountSession.isMayor() ? AccountSession.getStats() : GuestSession.getStats();
    document.getElementById('guest-stats-games').innerText = stats.gamesPlayed;
    document.getElementById('guest-stats-money').innerText = `${stats.maxMoney.toLocaleString()} ₪`;

    const container = document.getElementById('guest-stats-achievements');
    container.innerHTML = '';
    const achievementCounts = Object.entries(stats.achievements);
    if (!achievementCounts.length) {
        container.innerText = currentTexts.ui.guest_stats_empty;
        return;
    }
    achievementCounts.forEach(([id, count]) => {
        const definition = ACHIEVEMENTS_DEF.find(item => item.id === id);
        const info = currentTexts.ui.achievements?.[id];
        if (!definition || !info) return;
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-900/60';
        item.innerText = `${definition.icon} ${info.name} × ${count}`;
        container.appendChild(item);
    });
}

