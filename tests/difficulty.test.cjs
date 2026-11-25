const GameConfig = require('../app/game/config.js').GameConfig;
GameConfig.use(GameConfig.fallback);
const assert = require('node:assert/strict');
const { test } = require('node:test');
const Difficulty = require('../app/game/difficulty.js').Difficulty;
const vm = require('node:vm');
const { readUnit: readFileSync } = require('./unit-source.cjs');

const game = difficulty => ({ difficulty, day: 4, money: 1000000, wife: 50, health: 90, threat: 15, rating: 50, shopPrices: {} });

test('opening decisions cap penalties, retain rewards and disable all drift until day four', () => {
    for (const level of ['easy', 'normal', 'hard', 'insane']) {
        for (const day of [1, 2, 3, 4]) {
            const s = { ...game(level), day, mode: 'arcade' };
            const rule = GameConfig.current.difficulties[level];
            const loss = day <= 3 ? Math.min(rule.loss, 1) : rule.loss;
            assert.equal(Difficulty.applyChoice(s, { money: -100, health: 5, threat: 10, wife: -10 }), null);
            assert.equal(s.money, 1000000 - Math.round(100 * loss));
            assert.equal(s.health, 90 + Math.round(5 * rule.gain));
            assert.equal(s.threat, 15 + Math.round(10 * loss) + (day <= 3 ? 0 : rule.drift.threat || 0));
            assert.equal(s.wife, 50 - Math.round(10 * loss) + (day <= 3 ? 0 : rule.drift.wife || 0));
            assert.equal(s.rating, 50 + (day <= 3 ? 0 : rule.drift.rating || 0));
        }
    }
});

test('opening clamps every death boundary to the configured safety margin', () => {
    const s = { ...game('insane'), day: 3, money: -1, wife: 100, rating: 100, health: 0, threat: 100 };
    Difficulty.protectOpening(s);
    assert.deepEqual([s.money, s.wife, s.rating, s.health, s.threat], [0, 95, 95, 5, 95]);
    assert.equal(Difficulty.defeat(s), null);
    const custom = GameConfig.fallback;
    custom.openingProtection = { statFloor: 9, threatCeiling: 91, upperStatCeiling: 89, penaltyCap: 0.5 };
    GameConfig.use(custom);
    try {
        Object.assign(s, { money: -1, wife: 100, rating: 0, health: 0, threat: 100 });
        Difficulty.protectOpening(s);
        assert.deepEqual([s.money, s.wife, s.rating, s.health, s.threat], [0, 89, 9, 9, 91]);
        const t = { ...game('hard'), day: 1 };
        Difficulty.applyChoice(t, { money: -100 });
        assert.equal(t.money, 999950);
    } finally { GameConfig.use(GameConfig.fallback); }
});

test('progressive drift increases only nonzero configured drifts and preserves their signs', () => {
    const custom = GameConfig.fallback;
    custom.difficulties.normal.drift = { threat: 2, rating: -1, health: 0 };
    GameConfig.use(custom);
    try {
        for (const [day, step] of [[9, 0], [10, 1], [19, 1], [20, 2]]) {
            const s = { ...game('normal'), day, mode: 'arcade' };
            Difficulty.applyChoice(s, {});
            assert.deepEqual([s.threat, s.rating, s.health, s.wife], [17 + step, 49 - step, 90, 50]);
        }
        const easy = { ...game('easy'), day: 20 };
        Difficulty.applyChoice(easy, {});
        assert.deepEqual([easy.threat, easy.rating, easy.health, easy.wife], [15, 50, 90, 50]);
    } finally { GameConfig.use(GameConfig.fallback); }
});

test('Blitz always uses hard difficulty, including restored saves', () => {
    const b = { GameConfig, GameModes: require('../app/game/modes.js').GameModes, Difficulty };
    vm.createContext(b);
    vm.runInContext(readFileSync('app/game/game-state.js', 'utf8'), b);
    for (const level of Object.keys(Difficulty.levels)) {
        assert.equal(Difficulty.forMode('blitz', level), 'hard');
        assert.equal(Difficulty.forMode('arcade', level), level);
        assert.equal(Difficulty.forMode('daily', level), level);
        b.saved = { mode: 'blitz', difficulty: level };
        vm.runInContext('restoreDifficulty(saved)', b);
        assert.equal(vm.runInContext('state.difficulty', b), 'hard');
    }
});

test('arcade escalates only harmful decisions at days 10 and 20, before rounding', () => {
    for (const [day, loss, drift] of [[9, 13, 2], [10, 14, 3], [19, 14, 3], [20, 16, 4]]) {
        const s = { ...game('hard'), mode: 'arcade', day };
        Difficulty.applyChoice(s, { money: -10, health: 10, threat: 10 });
        assert.equal(s.money, 1000000 - loss);
        assert.equal(s.threat, 15 + loss + drift);
        assert.equal(s.health, 98);
    }
    for (const mode of ['daily', 'blitz']) {
        const s = { ...game('hard'), mode, day: 21 };
        Difficulty.applyChoice(s, { money: -10, threat: -10 });
        assert.equal(s.money, 999987);
        assert.equal(s.threat, 9, 'Blitz and Daily retain base drift and beneficial threat scaling');
    }
    const s = { ...game('normal'), day: 20 };
    Difficulty.applyChoice(s, { threat: -10, health: -10, rating: 10 });
    assert.deepEqual([s.threat, s.health, s.rating], [8, 78, 57]);
});

test('difficulty scales gains and losses, reverses threat semantics and rounds symmetrically', () => {
    for (const [level, gain, loss] of [['easy', 12, 8], ['normal', 10, 10], ['hard', 8, 13], ['insane', 6, 16]]) {
        for (const stat of ['money', 'wife', 'health', 'rating']) {
            assert.equal(Difficulty.effect(10, stat, level), gain);
            assert.equal(Difficulty.effect(-10, stat, level), -loss);
        }
        assert.equal(Difficulty.effect(10, 'threat', level), loss);
        assert.equal(Difficulty.effect(-10, 'threat', level), -gain);
    }
    assert.equal(Difficulty.effect(-5, 'money', 'hard'), -7);
    assert.equal(Difficulty.effect(1, 'money', 'easy'), 1);
});

test('Normal is the unmodified reference and rounds only after Arcade escalation', () => {
    const cases = [
        ['health', 10, 10, 10], ['health', -7, -7, -8],
        ['wife', -20, -20, -24], ['wife', 20, 20, 20],
        ['threat', 17, 17, 20], ['threat', -17, -17, -17],
        ['rating', -23, -23, -28], ['rating', 23, 23, 23],
        ['money', -10, -10, -12]
    ];
    for (const [stat, value, first, later] of cases) {
        assert.equal(Difficulty.effect(value, stat, 'normal'), first, stat);
        assert.equal(Difficulty.effect(value, stat, 'normal', 1.2), later, stat);
        assert.equal(Difficulty.effect(0, stat, 'normal', 1.2), 0);
    }
    assert.equal(Difficulty.effect(-19, 'wife', 'normal', 1.1), -21);
});

test('starting health respects the resolved difficulty, including forced-hard Blitz', () => {
    assert.equal(Difficulty.initialHealth('arcade', 'normal'), 90);
    for (const level of ['easy', 'hard', 'insane']) assert.equal(Difficulty.initialHealth('arcade', level), 90);
    assert.equal(Difficulty.initialHealth('blitz', 'normal'), 90);
});

test('Normal clinic perk restores its configured health without modifiers or drift', () => {
    const c = playing(); c.s.health = 40;
    const perk = GameConfig.current.shop.perks.assuta_vip;
    c.run("buyPerk('assuta_vip')");
    assert.deepEqual([c.s.health, c.s.money, c.s.threat, c.s.rating, c.s.day], [40 + perk.effects.health, 1000000 - perk.price, 15, 50, 1]);
});

test('the first three decisions cannot lose on any stat, including drift and Insane upper bounds', () => {
    const harmful = [{ threat: 1000 }, { health: -1000 }, { wife: -1000 }, { rating: -1000 },
        { money: -100000000 }, { wife: 1000 }, { rating: 1000 }];
    for (const mode of ['arcade', 'blitz', 'daily']) for (const level of Object.keys(Difficulty.levels)) {
        for (const choice of harmful) {
            let s = { ...game(Difficulty.forMode(mode, level)), mode, day: 1 };
            for (let turn = 1; turn <= 3; turn++) {
                s.day = turn;
                assert.equal(Difficulty.applyChoice(s, choice), null, `${mode}/${level}/${turn}`);
                assert.equal(Difficulty.defeat(s), null);
                s = JSON.parse(JSON.stringify(s));
            }
        }
    }
    const s = { ...game('normal'), mode: 'arcade', day: 3, threat: 99 };
    assert.equal(Difficulty.applyChoice(s, {}), null);
    assert.equal(s.threat, 95);
    s.day = 4;
    s.threat = 99;
    assert.equal(Difficulty.applyChoice(s, {}), 'arrest');
});

test('opening shop protection includes the interval after decision three and ends after decision four', () => {
    for (const [perk, stat] of [['wife_spa', 'wife'], ['pr_agency', 'rating']]) {
        for (const day of [1, 4, 5]) {
            const c = playing();
            Object.assign(c.s, { difficulty: 'insane', money: 10000000, day, [stat]: 90 });
            c.run(`buyPerk('${perk}')`);
            assert.equal(c.s[stat], day <= 4 ? 95 : 100);
            assert.equal(c.b.reason, day <= 4 ? undefined : stat === 'wife' ? 'wife_abroad' : 'too_popular');
        }
    }
});

test('one decision applies one passive drift with percentage bounds', () => {
    for (const [level, threat, wife, rating] of [['easy', 15, 50, 50], ['normal', 16, 50, 49], ['hard', 17, 49, 49], ['insane', 19, 48, 48]]) {
        const s = game(level);
        assert.equal(Difficulty.applyChoice(s, {}), null);
        assert.deepEqual([s.threat, s.wife, s.rating], [threat, wife, rating]);
    }
    const s = game('hard');
    Difficulty.applyChoice(s, { health: 100, threat: -100, wife: -100 });
    assert.equal(s.health, 100);
    assert.equal(s.threat, 0);
    assert.equal(s.wife, 0);
});

test('base and extra defeat boundaries and precedence', () => {
    for (const level of ['easy', 'normal', 'hard', 'insane']) {
        for (const [stat, value, reason] of [['threat', 100, 'arrest'], ['wife', 0, 'wife_left'], ['health', 0, 'heart_attack'], ['rating', 0, 'elections_lost']]) {
            assert.equal(Difficulty.defeat({ ...game(level), [stat]: value }), reason);
        }
        assert.equal(Difficulty.defeat({ ...game(level), money: 0 }), null);
        assert.equal(Difficulty.defeat({ ...game(level), money: -1 }), ['hard', 'insane'].includes(level) ? 'bankruptcy' : null);
        for (const [stat, reason] of [['rating', 'too_popular'], ['wife', 'wife_abroad']]) {
            assert.equal(Difficulty.defeat({ ...game(level), [stat]: 100 }), level === 'insane' ? reason : null);
        }
    }
    assert.equal(Difficulty.applyChoice({ ...game('normal'), threat: 99 }, {}), 'arrest');
    assert.equal(Difficulty.applyChoice({ ...game('insane'), rating: 99 }, { rating: 2 }), 'too_popular', 'passive decline must not undo a reached defeat boundary');
    assert.equal(Difficulty.defeat({ ...game('insane'), threat: 100, money: -1, wife: 100 }), 'arrest');
});

test('inflation affects only the purchased perk and survives serialization', () => {
    for (const level of ['easy', 'normal', 'hard', 'insane']) {
        let s = game(level);
        assert.equal(Difficulty.price(s, 'spa', 5), 5);
        Difficulty.purchased(s, 'spa', 5);
        s = JSON.parse(JSON.stringify(s));
        assert.equal(Difficulty.price(s, 'spa', 5), level === 'easy' ? 5 : 8);
        Difficulty.purchased(s, 'spa', 5);
        assert.equal(Difficulty.price(s, 'spa', 5), level === 'easy' ? 5 : 10);
        assert.equal(s.purchaseCount.spa, 2);
        assert.equal(Difficulty.price(s, 'clinic', 100), 100);
        assert.equal(Difficulty.price(game(level), 'spa', 5), 5);
    }
});

function playing() {
    const b = { GameConfig, AccountSession: { canPlay: () => true }, updateUI() {}, updateAuthUI() {}, checkAchievements() {}, stopBlitzTurn() {},
        saveGuestGame() { b.saves++; }, saves: 0, triggerGameOver(reason) { b.reason = reason; }, alert() {} };
    b.window = b;
    vm.createContext(b);
    for (const file of ['modes', 'game-state', 'difficulty', 'events', 'shop']) vm.runInContext(readFileSync(`app/game/${file}.js`, 'utf8'), b);
    vm.runInContext(`resetStartingStats(); loadNextEvent = () => {}; toggleShop = () => {};
        gameLogicEvents = [{ choices: [{ money: 100, wife: -5, threat: 5, health: 1, rating: 5 }] }];
        state.currentEventIndex = 0;
        currentTexts = { ui: { perks: Object.fromEntries(shopPerkKeys.map(key => [key, {}])) } };`, b);
    return { b, s: vm.runInContext('state', b), run: code => vm.runInContext(code, b) };
}

test('actual answer handler applies modifiers and drift exactly once, then saves', () => {
    const c = playing(); c.s.difficulty = 'hard';
    c.run('handleChoice(0)');
    assert.deepEqual([c.s.money, c.s.wife, c.s.threat, c.s.health, c.s.rating, c.s.day], [1000080, 45, 20, 91, 54, 2]);
    assert.equal(c.b.saves, 1);
    assert.equal(c.b.reason, undefined);
});

test('failed purchases do not inflate prices; successful purchases have no turn drift', () => {
    const c = playing(); c.s.difficulty = 'hard'; c.s.money = 100;
    const perk = GameConfig.current.shop.perks.wife_spa;
    const secondPrice = Math.round(perk.price * 1.5);
    c.run("buyPerk('wife_spa')");
    assert.equal(c.s.shopPrices.wife_spa, undefined);
    c.s.money = 4000000;
    c.run("buyPerk('wife_spa'); buyPerk('wife_spa')");
    assert.deepEqual([c.s.money, c.s.wife, c.s.threat, c.s.rating, c.s.day], [4000000 - perk.price, 50 + perk.effects.wife, 15, 50, 1]);
    assert.equal(c.s.shopPrices.wife_spa, secondPrice);
    assert.equal(c.s.purchaseCount.wife_spa, 1);
    assert.equal(c.s.cooldowns.wife_spa, 11);
    assert.equal(c.b.saves, 1);
    c.s.day = 10;
    c.run("buyPerk('wife_spa')");
    assert.equal(c.s.purchaseCount.wife_spa, 1, 'cooldown prevents an early purchase');
    c.s.day = 11;
    c.run("buyPerk('wife_spa')");
    assert.equal(c.s.money, 4000000 - perk.price - secondPrice);
    assert.equal(c.s.shopPrices.wife_spa, perk.price * 2);
    assert.equal(c.s.purchaseCount.wife_spa, 2);
    assert.equal(c.s.cooldowns.wife_spa, 24);
    c.s.day = 24; c.s.wife = 100;
    c.run("buyPerk('wife_spa')");
    assert.equal(c.s.money, 4000000 - perk.price - secondPrice, 'a maxed perk cannot be purchased');
});

test('legacy restore clears the previous mode difficulty and prices', () => {
    const c = playing();
    c.s.difficulty = 'insane'; c.s.shopPrices = { wife_spa: 2700000 };
    c.run('restoreDifficulty({ day: 12 })');
    assert.equal(c.s.difficulty, 'normal');
    assert.equal(Object.keys(c.s.shopPrices).length, 0);
    assert.ok(Object.values(c.s.purchaseCount).every(count => count === 0));
});

test('old geometric shop prices migrate to counts and new saves retain exact counts', () => {
    const c = playing();
    const perks = GameConfig.current.shop.perks;
    c.run(`restoreDifficulty({day:12,difficulty:'normal',shopPrices:{wife_spa:${Math.round(perks.wife_spa.price * 1.5 ** 3)},assuta_vip:${Math.round(perks.assuta_vip.price * 1.5)}},cooldowns:{wife_spa:20}})`);
    assert.equal(c.s.purchaseCount.wife_spa, 3);
    assert.equal(c.s.purchaseCount.assuta_vip, 1);
    assert.equal(c.s.purchaseCount.police_bribe, 0);
    assert.equal(c.run(`Difficulty.price(state,'wife_spa',${perks.wife_spa.price})`), Math.round(perks.wife_spa.price * 2.5));
    c.run(`restoreDifficulty({day:12,difficulty:'normal',shopPrices:{wife_spa:${Math.round(perks.wife_spa.price * 2.5)}},purchaseCount:{wife_spa:3}})`);
    assert.equal(c.s.purchaseCount.wife_spa, 3, 'linear prices are never reinterpreted as geometric history');
});

test('Easy counts purchases but retains base prices and cooldowns', () => {
    const c = playing();
    Object.assign(c.s, { difficulty: 'easy', money: 10000000, health: 20 });
    c.run("buyPerk('assuta_vip')");
    assert.equal(c.s.cooldowns.assuta_vip, 8);
    assert.equal(c.s.shopPrices.assuta_vip, GameConfig.current.shop.perks.assuta_vip.price);
    c.s.day = 8;
    c.run("buyPerk('assuta_vip')");
    assert.equal(c.s.purchaseCount.assuta_vip, 2);
    assert.equal(c.s.cooldowns.assuta_vip, 15);
    assert.equal(c.s.shopPrices.assuta_vip, GameConfig.current.shop.perks.assuta_vip.price);
    assert.equal(c.s.money, 10000000 - 2 * GameConfig.current.shop.perks.assuta_vip.price);
});

test('difficulty changes immediately on day one, confirms a running game and restarts a finished game', async () => {
    const c = playing();
    c.s.health = 90;
    let confirmations = 0, closeCount = 0, restart;
    c.b.confirm = () => { confirmations++; return false; };
    c.b.document = { getElementById: () => ({ close() { closeCount++; } }) };
    c.b.resetGame = async level => { restart = level; };
    c.run("currentTexts.ui.difficulty = { restart: 'New term?' }");
    c.b.confirmGameAction = text => c.b.confirm(text);
    vm.runInContext(readFileSync('app/ui/difficulty.js', 'utf8'), c.b);
    await c.run("selectDifficulty('hard')");
    assert.equal(c.s.difficulty, 'hard');
    assert.equal(c.s.health, 90);
    assert.equal(confirmations, 0);
    assert.equal(c.b.saves, 1);
    c.s.day = 2;
    const before = JSON.stringify(c.s);
    await c.run("selectDifficulty('insane')");
    assert.equal(confirmations, 1);
    assert.equal(JSON.stringify(c.s), before);
    assert.equal(restart, undefined);
    c.b.confirm = () => { confirmations++; return true; };
    await c.run("selectDifficulty('insane')");
    assert.equal(restart, 'insane');
    assert.equal(confirmations, 2);
    restart = undefined;
    await c.run("selectDifficulty('hard')");
    assert.equal(restart, undefined, 'selecting the active level does not reset progress');
    c.s.gameOverRecorded = true;
    await c.run("selectDifficulty('easy')");
    assert.equal(restart, 'easy');
    assert.equal(confirmations, 2, 'finished games need no confirmation');
    assert.equal(closeCount, 4);
    c.s.mode = 'blitz'; c.s.difficulty = 'hard'; restart = undefined;
    for (const finished of [false, true]) {
        c.s.gameOverRecorded = finished;
        await c.run("selectDifficulty('insane'); toggleDifficulty(true)");
        assert.equal(c.s.difficulty, 'hard');
        assert.equal(restart, undefined);
        assert.equal(closeCount, 4);
    }
});

test('reset uses mode starting health, while restoring a save preserves its health', async () => {
    const c = playing();
    c.b.crypto = require('node:crypto').webcrypto;
    c.b.document = { getElementById: () => ({ classList: { add() {} } }) };
    c.b.setLang = async () => {};
    vm.runInContext(readFileSync('app/game/game-over.js', 'utf8'), c.b);
    for (const [level, mode, health] of [['normal', 'arcade', 90], ['easy', 'arcade', 90], ['normal', 'blitz', 90]]) {
        c.s.purchaseCount = { wife_spa: 9 };
        await c.run(`resetGame('${level}', '${mode}')`);
        assert.equal(c.s.health, health);
        assert.equal(Object.keys(c.s.purchaseCount).length, 0);
    }
    c.run("Object.assign(state, {health: 63, difficulty: 'normal', mode: 'arcade'}); restoreDifficulty(state)");
    assert.equal(c.s.health, 63);
});
