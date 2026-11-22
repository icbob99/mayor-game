(function (root) {
    const levels = {
        easy: { gain: 1.2, loss: 0.8, drift: {} },
        normal: { gain: 1, loss: 1, drift: { threat: 1, rating: -1 } },
        hard: { gain: 0.8, loss: 1.3, drift: { threat: 2, wife: -1, rating: -1 } },
        insane: { gain: 0.6, loss: 1.6, drift: { threat: 4, wife: -2, rating: -2 } }
    };
    function forMode(mode, level) {
        return mode === 'blitz' ? 'hard' : Object.hasOwn(levels, level) ? level : 'normal';
    }
    function effect(value, stat, level, escalation = 1) {
        const rules = levels[level] || levels.normal;
        const beneficial = stat === 'threat' ? value < 0 : value > 0;
        // Round magnitudes so equal positive/negative halves round consistently.
        return Math.sign(value) * Math.round(Math.abs(value) * (beneficial ? rules.gain : rules.loss * escalation));
    }
    function defeat(s) {
        if (s.threat >= 100) return 'arrest';
        if (s.wife <= 0) return 'wife_left';
        if (s.health <= 0) return 'heart_attack';
        if (s.rating <= 0) return 'elections_lost';
        if (['hard', 'insane'].includes(s.difficulty) && s.money < 0) return 'bankruptcy';
        if (s.difficulty === 'insane' && s.rating >= 100) return 'too_popular';
        if (s.difficulty === 'insane' && s.wife >= 100) return 'wife_abroad';
        return null;
    }
    function applyChoice(s, choice) {
        const escalation = (s.mode || 'arcade') === 'arcade' ? 1 + Math.floor(((s.day || 1) - 1) / 10) / 10 : 1;
        for (const stat of ['money', 'wife', 'health', 'threat', 'rating']) {
            const value = s[stat] + effect(choice[stat] || 0, stat, s.difficulty, escalation);
            s[stat] = stat === 'money' ? value : Math.max(0, Math.min(100, value));
        }
        // A terminal decision cannot be rescued by passive drift.
        const reason = defeat(s);
        if (reason) return reason;
        for (const [stat, delta] of Object.entries((levels[s.difficulty] || levels.normal).drift)) {
            s[stat] = Math.max(0, Math.min(100, s[stat] + delta));
        }
        return defeat(s);
    }
    function price(s, key, base) { return s.difficulty === 'easy' ? base : s.shopPrices?.[key] || base; }
    function purchased(s, key, cost) {
        s.shopPrices ||= {};
        s.shopPrices[key] = s.difficulty === 'easy' ? cost : Math.min(Number.MAX_SAFE_INTEGER, Math.round(cost * 1.5));
    }
    root.Difficulty = { levels, forMode, effect, defeat, applyChoice, price, purchased };
    if (typeof module !== 'undefined' && module.exports) module.exports = root.Difficulty;
})(typeof window !== 'undefined' ? window : globalThis);
