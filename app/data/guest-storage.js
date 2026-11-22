(function (root, factory) {
    const api = factory();
    root.GuestStorage = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    const Stats = typeof module !== 'undefined' && module.exports ? require('../game/statistics.js') : GameStats;
    const GAME_KEY = 'mayorGameState';
    const STATS_KEY = 'mayorGuestStats';

    function readJson(storage, key) {
        try {
            const value = storage?.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch {
            storage?.removeItem(key);
            return null;
        }
    }

    function loadGameState(storage) {
        const state = readJson(storage, GAME_KEY);
        if (!state || typeof state !== 'object' ||
            !['day', 'money', 'wife', 'threat', 'health', 'rating'].every(key => Number.isFinite(state[key]))) {
            storage?.removeItem(GAME_KEY);
            return null;
        }
        // Daily games resume pending consequences; other modes keep the original rule.
        if (state.mode !== 'daily') state.eventQueue = [];
        delete state.pendingChainEvents;
        return state;
    }

    function loadGuestStats(storage) {
        const stats = readJson(storage, STATS_KEY);
        return Stats.normalize(stats && typeof stats === 'object' ? stats : {});
    }

    function saveGameState(storage, state) {
        try {
            const { eventQueue, currentEventId, choiceOrder, ...savedState } = state;
            storage?.setItem(GAME_KEY, JSON.stringify(state.mode === 'daily' ? state : savedState));
        } catch {
            // Private browsing or a full storage quota should not stop the game.
        }
    }

    function clearGameState(storage) {
        storage?.removeItem(GAME_KEY);
    }

    function saveGuestStats(storage, stats) {
        try {
            storage?.setItem(STATS_KEY, JSON.stringify(stats));
        } catch {
            // Statistics are optional and must never break gameplay.
        }
    }

    function recordGameOver(storage, state) {
        const stats = Stats.update(loadGuestStats(storage), { ...state,
            achievements: Object.fromEntries((state.unlockedAchievements || []).map(id => [id, 1])) }, true);
        saveGuestStats(storage, stats);
        return stats;
    }

    function updateMaxMoney(storage, money, mode = 'arcade') {
        const stats = Stats.update(loadGuestStats(storage), { money, mode });
        saveGuestStats(storage, stats);
        return stats;
    }

    return { loadGameState, saveGameState, clearGameState, loadGuestStats, saveGuestStats, recordGameOver, updateMaxMoney };
});
