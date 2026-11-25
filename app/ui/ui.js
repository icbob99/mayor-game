import { AccountSession } from '../game/account-session.js';
import { renderAchievements } from '../game/achievements.js';
import { ACHIEVEMENTS_DEF, currentTexts, state } from '../game/game-state.js';
import { GuestSession } from '../game/guest-session.js';
import { GameModes } from '../game/modes.js';
import { renderShop } from '../game/shop.js';
import { GameStats } from '../game/statistics.js';
import { updateAudioButton } from './audio.js';
import { closeProfileMenu, updateAuthUI } from './auth.js';
import { renderDifficulty } from './difficulty.js';

function updateUI() {
    if (!currentTexts) return;
    updateAuthUI();
    renderDifficulty();

    for (const key of ['game_title', 'game_title_short']) {
        if (currentTexts.ui[key]) document.getElementById(key.replaceAll('_', '-')).textContent = currentTexts.ui[key];
    }

    document.getElementById('label-money').innerText = currentTexts.ui.money;
    document.getElementById('label-wife').innerText = currentTexts.ui.wife;
    document.getElementById('label-threat').innerText = currentTexts.ui.threat;
    document.getElementById('label-health').innerText = currentTexts.ui.health;
    document.getElementById('label-rating').innerText = currentTexts.ui.rating;
    for (const tile of document.querySelectorAll('.stat-tile')) {
        tile.querySelector('.stat-tooltip').textContent = tile.querySelector('.stat-label').textContent;
    }
    updateAudioButton();

    document.getElementById('stat-money').innerText = state.money.toLocaleString() + ' ₪';
    document.getElementById('stat-wife').innerText = state.wife + '%';
    document.getElementById('stat-threat').innerText = state.threat + '%';
    document.getElementById('stat-health').innerText = state.health + '%';
    document.getElementById('stat-rating').innerText = state.rating + '%';
    document.getElementById('game-stats').classList.toggle('blind-stats', state.mode === 'blitz');
    document.getElementById('day-counter').innerText = `${currentTexts.ui.day} ${state.day}`;
    document.getElementById('label-btn-shop').innerText = currentTexts.ui.btn_shop;
    document.getElementById('btn-achievements').setAttribute('aria-label', currentTexts.ui.btn_achievements);
    document.getElementById('btn-achievements').title = currentTexts.ui.btn_achievements;
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

function initializeHeaderControls() {
    const profile = document.getElementById('account-controls');
    const tiles = document.querySelectorAll('.stat-tile');
    const closeTooltips = () => tiles.forEach(tile => tile.classList.remove('tooltip-open'));
    for (const tile of tiles) {
        const show = () => { closeTooltips(); tile.classList.add('tooltip-open'); };
        tile.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') show(); });
        tile.addEventListener('pointerleave', () => tile.classList.remove('tooltip-open'));
        tile.addEventListener('focus', () => { if (tile.matches(':focus-visible')) show(); });
        tile.addEventListener('blur', () => tile.classList.remove('tooltip-open'));
        tile.addEventListener('click', show);
    }
    document.addEventListener('click', event => {
        if (!profile.contains(event.target)) closeProfileMenu();
        if (!event.target.closest('.stat-tile')) closeTooltips();
    });
    document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        if (profile.open) {
            closeProfileMenu();
            document.getElementById('profile-toggle').focus();
        }
        closeTooltips();
    });
}

function saveGuestGame() {
    state.gameId ||= crypto.randomUUID();
    GameModes.checkpoint(state);
    if (AccountSession.isMayor()) AccountSession.save(state);
    else GuestSession.save(state);
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
    const all = GameStats.normalize(AccountSession.isMayor() ? AccountSession.getStats() : GuestSession.getStats());
    const select = document.getElementById('stats-mode');
    const selected = select.value || 'all';
    select.replaceChildren(...['all', ...GameModes.names.filter(GameModes.available)].map(mode => {
        const option = document.createElement('option');
        option.value = mode; option.textContent = mode === 'all' ? currentTexts.ui.modes.all : currentTexts.ui.modes[mode].name;
        return option;
    }));
    select.value = selected;
    const stats = selected === 'all' ? all : all.byMode[selected];
    document.getElementById('stats-resignations-label').innerText = currentTexts.ui.modes.resignations;
    document.getElementById('stats-resignations').innerText = stats.resignations;
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

export { initializeHeaderControls, renderGuestStats, saveGuestGame, toggleGuestStats, updateUI };
