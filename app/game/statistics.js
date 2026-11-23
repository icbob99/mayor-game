(function (root) {
    const modes = ['arcade', 'daily', 'blitz'];
    const achievements = ['offshore_king', 'untouchable', 'happy_wife', 'survivor', 'unsinkable'];
    const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
    function totals(value = {}) {
        return { gamesPlayed: count(value.gamesPlayed), maxMoney: count(value.maxMoney), resignations: count(value.resignations),
            achievements: Object.fromEntries(achievements.map(id => [id, count(value.achievements?.[id])])) };
    }
    function normalize(value = {}) {
        const byMode = Object.fromEntries(modes.map(mode => [mode, totals(value.byMode ? value.byMode[mode] : mode === 'arcade' ? value : {})]));
        const result = { ...totals(), byMode };
        for (const stats of Object.values(byMode)) {
            result.gamesPlayed += stats.gamesPlayed;
            result.resignations += stats.resignations;
            result.maxMoney = Math.max(result.maxMoney, stats.maxMoney);
            for (const id of achievements) result.achievements[id] += stats.achievements[id];
        }
        return result;
    }
    function update(value, game, finished = false) {
        const result = normalize(value);
        const stats = result.byMode[game.mode || 'arcade'];
        stats.maxMoney = Math.max(stats.maxMoney, game.money || 0);
        if (finished) {
            stats.gamesPlayed++;
            if (game.endReason === 'resignation') stats.resignations++;
            for (const id of achievements) stats.achievements[id] += game.achievements?.[id] ? 1 : 0;
        }
        return normalize(result);
    }
    root.GameStats = { modes, achievements, normalize, update };
    if (typeof module !== 'undefined' && module.exports) module.exports = root.GameStats;
})(globalThis);
