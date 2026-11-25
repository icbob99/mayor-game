// Emergency offline defaults only. The SQL seed is the live balance source.
const fallback = {
    initialStats: { money: 1000000, wife: 50, threat: 15, health: 90, rating: 50 },
    openingProtectedTurns: 3,
    difficulties: {
        easy: { gain: 1.2, loss: 0.8, drift: {}, shopPriceMultiplier: 1, maxTurns: 60, bankruptcy: false, upperBounds: false },
        normal: { gain: 1, loss: 1, drift: { threat: 1, rating: -1 }, shopPriceMultiplier: 1.5, maxTurns: 50, bankruptcy: false, upperBounds: false },
        hard: { gain: 0.8, loss: 1.3, drift: { threat: 2, wife: -1, rating: -1 }, shopPriceMultiplier: 1.5, maxTurns: 40, bankruptcy: true, upperBounds: false },
        insane: { gain: 0.6, loss: 1.6, drift: { threat: 4, wife: -2, rating: -2 }, shopPriceMultiplier: 1.5, maxTurns: 30, bankruptcy: true, upperBounds: true }
    },
    arcade: { escalationEvery: 10, escalationDivisor: 10 },
    shop: { cooldownDays: 7, perks: {
        police_bribe: { price: 1500000, effects: { threat: -20 } },
        wife_spa: { price: 800000, effects: { wife: 30 } },
        assuta_vip: { price: 500000, effects: { health: 30 } },
        pr_agency: { price: 1000000, effects: { rating: 25 } }
    } },
    modes: { dailyEnabled: false, dailyTurns: 5, blitzDifficulty: 'hard', blitzMaxTurns: 25,
        blitzStepTurns: 10, blitzDurations: [10000, 7000, 5000, 3000, 2000] },
    retirement: { threatBelow: 70, upperStatsBelow: 70, scoreMultiplier: 1.5 },
    achievements: { offshoreMoney: 5000000, survivorDays: 30, unsinkableHealth: 20 },
    titles: { resignationPeakMoney: 5000000, legendMoney: 10000000, masterMoney: 3000000 }
};
const copy = value => JSON.parse(JSON.stringify(value));
let current;
function validate(value) {
    const fail = () => { throw new Error('Invalid game config'); };
    const number = (n, min, max = Number.MAX_SAFE_INTEGER, integer = false) => {
        if (!Number.isFinite(n) || n < min || n > max || (integer && !Number.isSafeInteger(n))) fail();
    };
    const positiveInt = n => number(n, 1, Number.MAX_SAFE_INTEGER, true);
    const effects = data => {
        if (!data || typeof data !== 'object' || Array.isArray(data)) fail();
        for (const [stat, delta] of Object.entries(data)) {
            if (!['wife', 'health', 'threat', 'rating'].includes(stat)) fail();
            number(delta, -100, 100, true);
        }
    };
    if (!value || typeof value !== 'object') fail();
    for (const key of Object.keys(fallback)) if (!Object.hasOwn(value, key)) fail();
    for (const stat of Object.keys(fallback.initialStats)) {
        number(value.initialStats?.[stat], 0, stat === 'money' ? Number.MAX_SAFE_INTEGER : 100, true);
    }
    number(value.openingProtectedTurns, 0, Number.MAX_SAFE_INTEGER, true);
    for (const level of Object.keys(fallback.difficulties)) {
        const rule = value.difficulties?.[level];
        if (!rule) fail();
        number(rule.gain, 0); number(rule.loss, 0); number(rule.shopPriceMultiplier, 1);
        positiveInt(rule.maxTurns); effects(rule.drift);
        if (typeof rule.bankruptcy !== 'boolean' || typeof rule.upperBounds !== 'boolean') fail();
    }
    positiveInt(value.arcade?.escalationEvery); number(value.arcade?.escalationDivisor, Number.MIN_VALUE);
    number(value.shop?.cooldownDays, 0, Number.MAX_SAFE_INTEGER, true);
    for (const key of Object.keys(fallback.shop.perks)) {
        const perk = value.shop?.perks?.[key];
        positiveInt(perk?.price); effects(perk?.effects);
    }
    const modes = value.modes;
    if (!modes || typeof modes.dailyEnabled !== 'boolean' || !Object.hasOwn(fallback.difficulties, modes.blitzDifficulty)) fail();
    positiveInt(modes.dailyTurns); positiveInt(modes.blitzMaxTurns); positiveInt(modes.blitzStepTurns);
    if (!Array.isArray(modes.blitzDurations) || !modes.blitzDurations.length) fail();
    modes.blitzDurations.forEach(positiveInt);
    number(value.retirement?.threatBelow, 1, 100); number(value.retirement?.upperStatsBelow, 1, 100);
    number(value.retirement?.scoreMultiplier, 0);
    positiveInt(value.achievements?.offshoreMoney); positiveInt(value.achievements?.survivorDays);
    number(value.achievements?.unsinkableHealth, 1, 100);
    for (const key of Object.keys(fallback.titles)) positiveInt(value.titles?.[key]);
    return value;
}
const GameConfig = {
    get current() { if (!current) throw new Error('Game config not loaded'); return current; },
    get fallback() { return copy(fallback); },
    validate,
    use(value) { current = copy(validate(value)); }
};

export { GameConfig };
