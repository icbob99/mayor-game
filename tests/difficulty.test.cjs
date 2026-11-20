const assert = require('node:assert/strict');
const { test } = require('node:test');
const Difficulty = require('../app/game/difficulty.js');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');

const game = difficulty => ({ difficulty, money: 1000000, wife: 50, health: 90, threat: 15, rating: 50, shopPrices: {} });

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
        Difficulty.purchased(s, 'spa', Difficulty.price(s, 'spa', 5));
        assert.equal(Difficulty.price(s, 'spa', 5), level === 'easy' ? 5 : 12);
        assert.equal(Difficulty.price(s, 'clinic', 100), 100);
        assert.equal(Difficulty.price(game(level), 'spa', 5), 5);
    }
});

function playing() {
    const b = { AccountSession: { canPlay: () => true }, updateUI() {}, updateAuthUI() {}, checkAchievements() {},
        saveGuestGame() { b.saves++; }, saves: 0, triggerGameOver(reason) { b.reason = reason; }, alert() {} };
    b.window = b;
    vm.createContext(b);
    for (const file of ['game-state', 'difficulty', 'events', 'shop']) vm.runInContext(readFileSync(`app/game/${file}.js`, 'utf8'), b);
    vm.runInContext(`loadNextEvent = () => {}; toggleShop = () => {};
        gameLogicEvents = [{ choices: [{ money: 100, wife: -5, threat: 5, health: 1, rating: 5 }] }];
        state.currentEventIndex = 0;
        currentTexts = { ui: { perks: Object.fromEntries(shopPerkKeys.map(key => [key, {}])) } };`, b);
    return { b, s: vm.runInContext('state', b), run: code => vm.runInContext(code, b) };
}

test('actual answer handler applies modifiers and drift exactly once, then saves', () => {
    const c = playing(); c.s.difficulty = 'hard';
    c.run('handleChoice(0)');
    assert.deepEqual([c.s.money, c.s.wife, c.s.threat, c.s.health, c.s.rating, c.s.day], [1000080, 42, 24, 91, 53, 2]);
    assert.equal(c.b.saves, 1);
    assert.equal(c.b.reason, undefined);
});

test('failed purchases do not inflate prices; successful purchases have no turn drift', () => {
    const c = playing(); c.s.difficulty = 'hard'; c.s.money = 100;
    c.run("buyPerk('wife_spa')");
    assert.equal(c.s.shopPrices.wife_spa, undefined);
    c.s.money = 4000000;
    c.run("buyPerk('wife_spa'); buyPerk('wife_spa')");
    assert.deepEqual([c.s.money, c.s.wife, c.s.threat, c.s.rating, c.s.day], [3200000, 80, 15, 50, 1]);
    assert.equal(c.s.shopPrices.wife_spa, 1200000);
    assert.equal(c.b.saves, 1);
    c.s.day = 8;
    c.run("buyPerk('wife_spa')");
    assert.equal(c.s.money, 2000000);
    assert.equal(c.s.shopPrices.wife_spa, 1800000);
    c.s.day = 15;
    c.run("buyPerk('wife_spa')");
    assert.equal(c.s.money, 2000000, 'a maxed perk cannot be purchased');
});

test('legacy restore clears the previous mode difficulty and prices', () => {
    const c = playing();
    c.s.difficulty = 'insane'; c.s.shopPrices = { wife_spa: 2700000 };
    c.run('restoreDifficulty({ day: 12 })');
    assert.equal(c.s.difficulty, 'normal');
    assert.equal(Object.keys(c.s.shopPrices).length, 0);
});

test('difficulty changes immediately on day one, confirms a running game and restarts a finished game', async () => {
    const c = playing();
    let confirmations = 0, closeCount = 0, restart;
    c.b.confirm = () => { confirmations++; return false; };
    c.b.document = { getElementById: () => ({ close() { closeCount++; } }) };
    c.b.resetGame = async level => { restart = level; };
    c.run("currentTexts.ui.difficulty = { restart: 'New term?' }");
    vm.runInContext(readFileSync('app/ui/difficulty.js', 'utf8'), c.b);
    await c.run("selectDifficulty('hard')");
    assert.equal(c.s.difficulty, 'hard');
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
});
