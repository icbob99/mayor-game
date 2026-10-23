(function (root, factory) {
    const api = factory();
    root.GuestStorage = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
    const GAME_KEY = 'mayorGameState';
    const STATS_KEY = 'mayorGuestStats';
    const emptyStats = () => ({ gamesPlayed: 0, maxMoney: 0, achievements: {} });

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
            !['day', 'money', 'wife', 'threat', 'health', 'rating'].every(key => Number.isFinite(state[key])) ||
            !Array.isArray(state.eventQueue) || !Array.isArray(state.pendingChainEvents)) {
            storage?.removeItem(GAME_KEY);
            return null;
        }
        return state;
    }

    function loadGuestStats(storage) {
        const stats = readJson(storage, STATS_KEY);
        if (!stats || typeof stats !== 'object') return emptyStats();
        return {
            gamesPlayed: Number.isFinite(stats.gamesPlayed) ? stats.gamesPlayed : 0,
            maxMoney: Number.isFinite(stats.maxMoney) ? stats.maxMoney : 0,
            achievements: stats.achievements && typeof stats.achievements === 'object'
                ? stats.achievements
                : {}
        };
    }

    function saveGameState(storage, state) {
        try {
            storage?.setItem(GAME_KEY, JSON.stringify(state));
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
        const stats = loadGuestStats(storage);
        stats.gamesPlayed += 1;
        stats.maxMoney = Math.max(stats.maxMoney, Number(state.money) || 0);
        for (const achievementId of state.unlockedAchievements || []) {
            stats.achievements[achievementId] = (stats.achievements[achievementId] || 0) + 1;
        }
        saveGuestStats(storage, stats);
        return stats;
    }

    function updateMaxMoney(storage, money) {
        const stats = loadGuestStats(storage);
        stats.maxMoney = Math.max(stats.maxMoney, Number(money) || 0);
        saveGuestStats(storage, stats);
        return stats;
    }

    return { loadGameState, saveGameState, clearGameState, loadGuestStats, saveGuestStats, recordGameOver, updateMaxMoney };
});
