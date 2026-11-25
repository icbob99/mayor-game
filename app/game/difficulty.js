import { GameConfig } from './config.js';

const config = () => GameConfig.current;
const rules = level => config().difficulties[level] || config().difficulties.normal;
function forMode(mode, level) {
    return mode === 'blitz' ? config().modes.blitzDifficulty : Object.hasOwn(config().difficulties, level) ? level : 'normal';
}
function initialHealth(mode, level) {
    return config().initialStats.health;
}
function effect(value, stat, level, escalation = 1, penaltyCap = Infinity) {
    const rule = rules(level);
    const beneficial = stat === 'threat' ? value < 0 : value > 0;
    // Round magnitudes so equal positive/negative halves round consistently.
    return Math.sign(value) * Math.round(Math.abs(value) * (beneficial ? rule.gain : Math.min(rule.loss, penaltyCap) * escalation));
}
function isOpening(day) {
    return config().openingProtectedTurns > 0 && Number.isInteger(day) && day >= 0 && day <= config().openingProtectedTurns;
}
function protectOpening(s, completedTurns = s.day) {
    if (!isOpening(completedTurns)) return;
    const safety = config().openingProtection;
    // Decisions use their current day; purchases use the number of completed decisions.
    s.threat = Math.min(s.threat, safety.threatCeiling);
    s.health = Math.max(s.health, safety.statFloor);
    for (const stat of ['wife', 'rating']) {
        s[stat] = Math.max(safety.statFloor, Math.min(rules(s.difficulty).upperBounds ? safety.upperStatCeiling : 100, s[stat]));
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
    const day = s.day || 1;
    const opening = isOpening(day);
    const arcade = config().arcade;
    const step = opening || (s.mode || 'arcade') !== 'arcade' ? 0 : Math.floor(day / arcade.escalationEvery);
    const escalation = 1 + step / arcade.escalationDivisor;
    const penaltyCap = opening ? config().openingProtection.penaltyCap : Infinity;
    for (const stat of ['money', 'wife', 'health', 'threat', 'rating']) {
        const value = s[stat] + effect(choice[stat] || 0, stat, s.difficulty, escalation, penaltyCap);
        s[stat] = stat === 'money' ? value : Math.max(0, Math.min(100, value));
    }
    protectOpening(s);
    // After the opening, a terminal decision cannot be rescued by passive drift.
    const reason = defeat(s);
    if (reason || opening) return reason;
    for (const [stat, delta] of Object.entries(rules(s.difficulty).drift)) {
        const drift = delta + Math.sign(delta) * step * arcade.driftIncrement;
        s[stat] = Math.max(0, Math.min(100, s[stat] + drift));
    }
    protectOpening(s);
    return defeat(s);
}
function purchaseCount(s, key, base = config().shop.perks[key].price) {
    const count = s.purchaseCount?.[key];
    if (Number.isSafeInteger(count) && count >= 0) return count;
    // Pre-counter saves recorded the next geometric price. Infer the purchases once
    // using the configured legacy multiplier; an old Easy save has no price history.
    const multiplier = rules(s.difficulty).shopPriceMultiplier;
    const oldPrice = s.shopPrices?.[key];
    return multiplier > 1 && Number.isFinite(oldPrice) && oldPrice > base
        ? Math.max(0, Math.round(Math.log(oldPrice / base) / Math.log(multiplier))) : 0;
}
function price(s, key, base) {
    const increment = rules(s.difficulty).shopPriceMultiplier - 1;
    return Math.min(Number.MAX_SAFE_INTEGER, Math.round(base * (1 + increment * purchaseCount(s, key, base))));
}
function purchased(s, key, base) {
    s.purchaseCount ||= {};
    s.purchaseCount[key] = purchaseCount(s, key, base) + 1;
    s.shopPrices ||= {};
    // Keep the derived price for compatibility with older saved-game readers.
    s.shopPrices[key] = price(s, key, base);
}
function cooldown(s, key) {
    const shop = config().shop;
    return shop.cooldownDays + (rules(s.difficulty).shopPriceMultiplier === 1 ? 0 : shop.cooldownIncrementDays * purchaseCount(s, key));
}
const Difficulty = { get levels() { return config().difficulties; }, forMode, initialHealth, effect, protectOpening, defeat, applyChoice, price, purchased, purchaseCount, cooldown };

export { Difficulty };
