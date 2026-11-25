(function (root) {
    const config = () => GameConfig.current;
    const rules = level => config().difficulties[level] || config().difficulties.normal;
    function forMode(mode, level) {
        return mode === 'blitz' ? config().modes.blitzDifficulty : Object.hasOwn(config().difficulties, level) ? level : 'normal';
    }
    function initialHealth(mode, level) {
        return config().initialStats.health;
    }
    function effect(value, stat, level, escalation = 1) {
        const rule = rules(level);
        const beneficial = stat === 'threat' ? value < 0 : value > 0;
        // Round magnitudes so equal positive/negative halves round consistently.
        return Math.sign(value) * Math.round(Math.abs(value) * (beneficial ? rule.gain : rule.loss * escalation));
    }
    function protectOpening(s, completedTurns = s.day) {
        const protectedTurns = config().openingProtectedTurns;
        if (!protectedTurns || !Number.isInteger(completedTurns) || completedTurns < 0 || completedTurns > protectedTurns) return;
        // Decisions use their current day; purchases use the number of completed decisions.
        s.threat = Math.min(s.threat, 99);
        s.health = Math.max(s.health, 1);
        for (const stat of ['wife', 'rating']) {
            s[stat] = Math.max(1, Math.min(rules(s.difficulty).upperBounds ? 99 : 100, s[stat]));
        }
        if (rules(s.difficulty).bankruptcy) s.money = Math.max(0, s.money);
    }
    function defeat(s) {
        if (s.threat >= 100) return 'arrest';
        if (s.wife <= 0) return 'wife_left';
        if (s.health <= 0) return 'heart_attack';
        if (s.rating <= 0) return 'elections_lost';
        if (rules(s.difficulty).bankruptcy && s.money < 0) return 'bankruptcy';
        if (rules(s.difficulty).upperBounds && s.rating >= 100) return 'too_popular';
        if (rules(s.difficulty).upperBounds && s.wife >= 100) return 'wife_abroad';
        return null;
    }
    function applyChoice(s, choice) {
        const arcade = config().arcade;
        const escalation = (s.mode || 'arcade') === 'arcade' ? 1 + Math.floor(((s.day || 1) - 1) / arcade.escalationEvery) / arcade.escalationDivisor : 1;
        for (const stat of ['money', 'wife', 'health', 'threat', 'rating']) {
            const value = s[stat] + effect(choice[stat] || 0, stat, s.difficulty, escalation);
            s[stat] = stat === 'money' ? value : Math.max(0, Math.min(100, value));
        }
        protectOpening(s);
        // After the opening, a terminal decision cannot be rescued by passive drift.
        const reason = defeat(s);
        if (reason) return reason;
        for (const [stat, delta] of Object.entries(rules(s.difficulty).drift)) {
            s[stat] = Math.max(0, Math.min(100, s[stat] + delta));
        }
        protectOpening(s);
        return defeat(s);
    }
    function price(s, key, base) { return rules(s.difficulty).shopPriceMultiplier === 1 ? base : s.shopPrices?.[key] || base; }
    function purchased(s, key, cost) {
        s.shopPrices ||= {};
        s.shopPrices[key] = Math.min(Number.MAX_SAFE_INTEGER, Math.round(cost * rules(s.difficulty).shopPriceMultiplier));
    }
    root.Difficulty = { get levels() { return config().difficulties; }, forMode, initialHealth, effect, protectOpening, defeat, applyChoice, price, purchased };
    if (typeof module !== 'undefined' && module.exports) module.exports = root.Difficulty;
})(typeof window !== 'undefined' ? window : globalThis);
