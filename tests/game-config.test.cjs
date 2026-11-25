const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readUnit: readFileSync } = require('./unit-source.cjs');
const vm = require('node:vm');

function browser(fetchGameConfig, cached) {
    const values = new Map(cached ? [['mayorGameConfig', JSON.stringify(cached)]] : []);
    const b = { fetchGameConfig, localStorage: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) } };
    vm.createContext(b);
    for (const file of ['game/config', 'data/config-storage', 'game/difficulty', 'game/modes']) {
        vm.runInContext(readFileSync(`app/${file}.js`, 'utf8'), b);
    }
    return { b, values, load: () => vm.runInContext('loadGameConfig()', b) };
}

test('server config replaces cache and controls starting stats, scaling, drift and turn caps', async () => {
    const c = browser(async () => custom);
    const custom = c.b.GameConfig.fallback;
    custom.initialStats = { money: 2500000, health: 83, wife: 62, threat: 7, rating: 48 };
    custom.difficulties.normal.gain = 1.4;
    custom.difficulties.normal.loss = 0.6;
    custom.difficulties.normal.drift = { threat: 3, rating: -2 };
    custom.difficulties.normal.maxTurns = 44;
    custom.openingProtectedTurns = 4;
    c.b.GameConfig.use(await c.load());
    assert.deepEqual(JSON.parse(JSON.stringify(c.b.GameConfig.current.initialStats)), custom.initialStats);
    assert.equal(c.b.Difficulty.effect(-10, 'health', 'normal'), -6);
    assert.equal(c.b.Difficulty.effect(-10, 'threat', 'normal'), -14);
    const state = { ...custom.initialStats, difficulty: 'normal', mode: 'arcade', day: 4 };
    assert.equal(c.b.Difficulty.applyChoice(state, {}), null);
    assert.equal(state.threat, 7);
    assert.equal(state.rating, 48);
    assert.equal(c.b.GameModes.maxTurns(state), 44);
    state.threat = 99;
    assert.equal(c.b.Difficulty.applyChoice(state, { threat: 100 }), null);
    state.day = 5;
    assert.equal(c.b.Difficulty.applyChoice(state, { threat: 100 }), 'arrest');
    assert.equal(JSON.parse(c.values.get('mayorGameConfig')).initialStats.health, 83);
});

test('network failure uses valid cache, then fallback; invalid server config is never accepted', async () => {
    const offline = async () => { throw new TypeError('offline'); };
    const c = browser(offline);
    const cached = c.b.GameConfig.fallback;
    cached.initialStats.health = 81;
    c.values.set('mayorGameConfig', JSON.stringify(cached));
    assert.equal((await c.load()).initialStats.health, 81);
    c.values.set('mayorGameConfig', '{broken');
    assert.equal((await c.load()).initialStats.health, 90);
    c.b.fetchGameConfig = async () => ({ initialStats: { health: 20 } });
    await assert.rejects(c.load(), /Invalid game config/);
    assert.equal(c.values.get('mayorGameConfig'), '{broken');
});

test('progression and shop increments come from the loaded config', async () => {
    const c = browser(async () => custom);
    const custom = c.b.GameConfig.fallback;
    custom.arcade = { escalationEvery: 5, driftIncrement: 2, escalationDivisor: 4 };
    custom.difficulties.normal.shopPriceMultiplier = 1.25;
    custom.shop.cooldownDays = 2;
    custom.shop.cooldownIncrementDays = 4;
    c.b.GameConfig.use(await c.load());
    const state = { ...custom.initialStats, day: 10, difficulty: 'normal', mode: 'arcade' };
    c.b.Difficulty.applyChoice(state, { health: -10, threat: 10 });
    assert.deepEqual([state.health, state.threat, state.rating, state.wife], [75, 35, 45, 50]);
    c.b.Difficulty.purchased(state, 'assuta_vip', 500000);
    c.b.Difficulty.purchased(state, 'assuta_vip', 500000);
    assert.equal(c.b.Difficulty.price(state, 'assuta_vip', 500000), 750000);
    assert.equal(c.b.Difficulty.cooldown(state, 'assuta_vip'), 10);
});

test('storage failure does not replace a valid network configuration with defaults', async () => {
    const c = browser(async () => custom);
    const custom = c.b.GameConfig.fallback;
    custom.initialStats.money = 123456;
    c.b.localStorage.setItem = () => { throw new Error('quota'); };
    assert.equal((await c.load()).initialStats.money, 123456);
});

test('configuration rejects invalid multipliers, drift and timers before replacing the active balance', () => {
    const c = browser(async () => ({}));
    c.b.GameConfig.use(c.b.GameConfig.fallback);
    for (const change of [
        config => { config.difficulties.normal.gain = -1; },
        config => { config.difficulties.hard.drift = { money: 5 }; },
        config => { config.shop.perks.assuta_vip.effects.health = 1.5; },
        config => { config.arcade.escalationDivisor = 0; },
        config => { config.arcade.escalationEvery = 0; },
        config => { config.arcade.driftIncrement = -1; },
        config => { config.openingProtection.upperStatCeiling = 100; },
        config => { config.openingProtection.statFloor = 0; },
        config => { config.openingProtection.penaltyCap = 1.1; },
        config => { config.shop.cooldownIncrementDays = -1; },
        config => { config.modes.blitzDurations = []; }
    ]) {
        const bad = c.b.GameConfig.fallback;
        change(bad);
        assert.throws(() => c.b.GameConfig.use(bad), /Invalid game config/);
        assert.equal(c.b.GameConfig.current.initialStats.health, 90);
    }
});

test('config cache uses Docker generation storage and never falls back after a stand reset', async () => {
    const c = browser(async () => { throw new TypeError('offline'); });
    const cached = c.b.GameConfig.fallback;
    cached.initialStats.health = 75;
    c.b.LocalEnvironment = { storage: { getItem: () => JSON.stringify(cached) }, isCurrent: () => true };
    assert.equal((await c.load()).initialStats.health, 75);
    c.b.LocalEnvironment.isCurrent = () => false;
    await assert.rejects(c.load(), /offline/);
});

test('config endpoint returns decoded settings, CORS and no-store in one DB request', async t => {
    const { default: worker } = await import('../cloudflare/worker.js');
    let calls = 0;
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        calls++;
        const requests = JSON.parse(options.body).requests;
        assert.equal(requests[1].batch.steps.length, 1);
        assert.match(requests[1].batch.steps[0].stmt.sql, /SELECT key, value FROM game_config/);
        return Response.json({ results: [ { type: 'ok' }, { type: 'ok', response: { result: {
            step_results: [{ cols: [{ name: 'key' }, { name: 'value' }], rows: [
                [{ type: 'text', value: 'initialStats' }, { type: 'text', value: '{"health":83}' }],
                [{ type: 'text', value: 'openingProtectedTurns' }, { type: 'text', value: '4' }]
            ] }], step_errors: [null]
        } } }, { type: 'ok' } ] });
    });
    const response = await worker.fetch(new Request('https://example.test/api/config', { headers: { Origin: 'https://icbob99.github.io' } }),
        { TURSO_DATABASE_URL: 'https://database.example.test', TURSO_AUTH_TOKEN: 'test-only' });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://icbob99.github.io');
    assert.deepEqual(await response.json(), { initialStats: { health: 83 }, openingProtectedTurns: 4 });
    assert.equal(calls, 1);
    const unavailable = await worker.fetch(new Request('https://example.test/api/config'), {});
    assert.equal(unavailable.status, 503);
});
