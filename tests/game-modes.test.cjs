const GameConfig = require('../app/game/config.js').GameConfig;
GameConfig.use(GameConfig.fallback);
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const Modes = require('../app/game/modes.js').GameModes;
const vm = require('node:vm');
const { readUnit: readFileSync } = require('./unit-source.cjs');
const { webcrypto } = require('node:crypto');
beforeEach(() => { Modes.settings.dailyEnabled = true; });

function modeUI(state) {
    const element = { close() {}, classList: { add() {}, contains() { return true; } }, style: {} };
    const b = { state, GameModes: Modes, Difficulty: require('../app/game/difficulty.js').Difficulty, crypto: webcrypto, performance,
        shopPerkKeys: Object.keys(GameConfig.current.shop.perks),
        currentTexts: { ui: { modes: { restart: 'reset?', pauseDaily: 'pause?', confirmResign: 'resign?' } } },
        AccountSession: { canPlay: () => true, isMayor: () => true },
        document: { hidden: false, querySelector: () => null, querySelectorAll: () => [], getElementById: () => element, addEventListener() {} },
        requestAnimationFrame: () => 1, cancelAnimationFrame() {}, addEventListener() {},
        saveGuestGame() { Modes.checkpoint(state); }, updateUI() {}, restoreCurrentEvent() {},
        resetGame: async (...args) => { b.restart = args; }, confirm: () => false,
        triggerGameOver: reason => { b.ending = reason; } };
    b.window = b; vm.createContext(b);
    vm.runInContext(readFileSync('app/ui/modes.js', 'utf8'), b);
    return b;
}

test('day-one mode changes use the resolved starting health', async () => {
    const state = {mode: 'arcade', difficulty: 'normal', day: 1, health: 90, daily: null};
    const b = modeUI(state);
    await b.selectMode('blitz');
    assert.equal(state.difficulty, 'hard');
    assert.equal(state.health, 90);
    await b.selectMode('arcade');
    assert.equal(state.difficulty, 'hard');
    assert.equal(state.health, 90);
});

test('day-one mode switch forks daily identity and later resumes the original daily game', async () => {
    const state = { mode: 'daily', day: 1, difficulty: 'normal', gameId: webcrypto.randomUUID(), daily: { date: Modes.dateKey(), used: 2 } };
    const originalId = state.gameId;
    const b = modeUI(state);
    await b.selectMode('arcade');
    assert.notEqual(state.gameId, originalId);
    assert.equal(state.daily.game.gameId, originalId);
    state.gameOverRecorded = true; state.endReason = 'resignation'; state.finishedAt = 123;
    await b.selectMode('daily');
    assert.equal(state.gameId, originalId);
    assert.equal(state.daily.used, 2);
    assert.equal(state.gameOverRecorded, false);
    assert.equal(state.endReason, null);
    assert.equal(state.finishedAt, null);
});

test('mode confirmation cancellation preserves game and daily archive; retirement obeys cap', async () => {
    const s = { mode: 'daily', day: 3, gameId: webcrypto.randomUUID(), daily: { date: Modes.dateKey(), used: 4 } };
    const b = modeUI(s), before = JSON.stringify(s);
    await b.selectMode('arcade');
    assert.equal(JSON.stringify(s), before);
    b.resign(); assert.equal(b.ending, undefined);
    b.confirm = () => true;
    b.resign(); assert.equal(b.ending, 'resignation');
    b.ending = null; s.daily.used = 5;
    b.resign(); assert.equal(b.ending, null);
});

test('resuming a legacy Daily archive restores its purchases rather than the current Arcade counters', async () => {
    const state = { mode: 'arcade', difficulty: 'normal', day: 1, purchaseCount: { wife_spa: 0 },
        daily: { date: Modes.dateKey(), used: 0, game: { mode: 'daily', difficulty: 'normal', day: 12,
            shopPrices: { wife_spa: 2700000 }, cooldowns: { wife_spa: 20 } } } };
    const b = modeUI(state);
    await b.selectMode('daily');
    assert.equal(state.purchaseCount.wife_spa, 3);
    assert.equal(b.Difficulty.price(state, 'wife_spa', 800000), 2000000);
    assert.equal(state.cooldowns.wife_spa, 20);
});

test('daily allowance survives a new game and resets only on the next local date', () => {
    const s = { mode: 'daily' };
    const today = new Date(2026, 10, 21, 23, 59);
    for (let i = 0; i < 5; i++) assert.equal(Modes.useTurn(s, today), true);
    assert.equal(Modes.useTurn(s, today), false);
    s.gameId = 'new'; s.day = 1;
    assert.equal(Modes.remaining(s, today), 0);
    const restored = JSON.parse(JSON.stringify(s));
    assert.equal(Modes.remaining(restored, new Date(2026, 10, 22)), 5);
    assert.equal(restored.day, 1);
    assert.equal(Modes.dateKey(new Date(2026, 0, 2)), '2026-01-02');
});

test('daily checkpoint preserves the card, queue and budget without recursive archives', () => {
    const s = { mode: 'daily', day: 4, difficulty: 'hard', gameId: 'daily-id', money: 50,
        currentEventId: 'card', choiceOrder: [1, 0], eventQueue: [{ eventId: 'later', triggerDay: 6 }],
        daily: { date: '2026-11-21', used: 3 } };
    Modes.checkpoint(s);
    s.mode = 'arcade'; s.day = 1; s.eventQueue = [];
    const restored = Modes.resumeDaily(JSON.parse(JSON.stringify(s)));
    assert.equal(restored.day, 4);
    assert.equal(restored.difficulty, 'hard');
    assert.equal(restored.currentEventId, 'card');
    assert.deepEqual(restored.eventQueue, [{ eventId: 'later', triggerDay: 6 }]);
    assert.equal(restored.daily.used, 3);
    assert.equal(restored.daily.game.daily, undefined);
});

test('blitz clock pauses with remaining time and expires once, never gaining time on resume', () => {
    let now = 0, expired = 0;
    const clock = Modes.createClock(() => expired++, () => now);
    clock.start(2000); now = 700; clock.pause();
    assert.equal(clock.remaining(), 1300);
    now = 10000; clock.resume(); now = 11299;
    assert.equal(clock.tick(), false);
    now = 11300;
    assert.equal(clock.tick(), true);
    clock.tick(); clock.resume();
    assert.equal(expired, 1);
    clock.start(2000); now += 2000; clock.stop(); clock.tick();
    assert.equal(expired, 1);
});

test('Blitz speeds up every ten turns, bottoms at two seconds and restarts at ten', () => {
    let now = 0, expired = 0;
    const clock = Modes.createClock(() => expired++, () => now);
    const turns = [[1,10000],[10,10000],[11,7000],[20,7000],[21,5000],[30,5000],
        [31,3000],[40,3000],[41,2000],[100,2000],[1,10000]];
    for (const [day, duration] of turns) {
        clock.start(Modes.blitzDuration(day));
        assert.equal(clock.remaining(), duration);
        now += duration - 1;
        assert.equal(clock.tick(), false);
        now++;
        assert.equal(clock.tick(), true);
    }
    assert.equal(expired, turns.length);
});

test('daily can be disabled without deleting its checkpoint', () => {
    const s = { mode: 'daily', daily: { game: { day: 8 } } };
    Modes.settings.dailyEnabled = false;
    try {
        assert.equal(Modes.available('daily'), false);
        assert.equal(Modes.canAct(s), false);
        assert.equal(s.daily.game.day, 8);
        assert.equal(Modes.available('arcade'), true);
    } finally { Modes.settings.dailyEnabled = true; }
});
