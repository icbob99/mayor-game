const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function browser(initial = {}) {
    const values = new Map(Object.entries(initial));
    const listeners = new Map(), timers = new Map();
    let now = 10000000;
    const b = {
        crypto: require('node:crypto').webcrypto,
        Date: { now: () => now },
        localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) },
        addEventListener: (name, handler) => listeners.set(name, handler),
        setInterval: (handler, ms) => timers.set(ms, handler), updateAuthUI() {},
        requestGameApi: async path => {
            if (!path.startsWith('/api/auth/')) throw new TypeError('offline');
            return { account: { id: 'a', nickname: 'Mayor' }, authToken: 'token', expiresAt: now + 1800000 };
        }
    };
    b.window = b;
    vm.createContext(b);
    vm.runInContext(readFileSync('app/infrastructure/browser-session.js', 'utf8'), b);
    vm.runInContext(readFileSync('app/data/guest-storage.js', 'utf8'), b);
    vm.runInContext(readFileSync('app/game/game-state.js', 'utf8'), b);
    vm.runInContext(readFileSync('app/game/mayor-save.js', 'utf8'), b);
    vm.runInContext(readFileSync('app/game/account-session.js', 'utf8'), b);
    return { ...b, advance: ms => { now += ms; }, values, listeners, timers };
}

test('online, focus and periodic ownership checks never resend a failed game PUT', async () => {
    const b = browser();
    let writes = 0, probes = 0;
    b.window.requestGameApi = async (path, { method } = {}) => {
        if (path.startsWith('/api/auth/')) return { account: { id: 'a' }, authToken: 'token' };
        if (path.includes('?')) { probes++; return {}; }
        if (path.endsWith('/session')) return { gameSessionId: 'writer', save: null };
        if (method === 'PUT') { writes++; throw new TypeError('offline'); }
        return null;
    };
    await b.AccountSession.init();
    await b.AccountSession.authenticate('login', {});
    b.AccountSession.save({ day: 2, money: 100, wife: 50, threat: 15, health: 90, rating: 50 });
    for (const check of [b.listeners.get('online'), b.listeners.get('focus'), b.timers.get(10000)]) {
        check();
        await new Promise(resolve => setImmediate(resolve));
    }
    assert.equal(writes, 1);
    assert.equal(probes, 3);
});

test('returning from guest explicitly recovers a lost activation reply before saving new moves', async () => {
    const b = browser();
    let lost = true;
    const activations = [], writes = [];
    b.window.requestGameApi = async (path, { method, body } = {}) => {
        if (path.startsWith('/api/auth/')) return { account: { id: 'a' }, authToken: 'token' };
        if (path.endsWith('/session')) {
            activations.push(JSON.stringify(body));
            if (lost) { lost = false; throw new TypeError('reply lost'); }
            return { gameSessionId: 'writer', save: null };
        }
        if (method === 'PUT') writes.push(body);
        return null;
    };
    await b.AccountSession.authenticate('login', {});
    b.AccountSession.becomeGuest();
    assert.equal(await b.AccountSession.becomeMayor(), true);
    b.AccountSession.save({ day: 2, money: 100, wife: 50, threat: 15, health: 90, rating: 50 });
    assert.equal(activations.length, 2);
    assert.equal(activations[0], activations[1]);
    assert.equal(writes.length, 1);
    assert.equal(writes[0].state.day, 2);
});

test('mayor state and statistics do not overwrite or inherit the guest', async () => {
    const b = browser({ mayorGameState: 'guest-game', mayorGuestStats: 'guest-stats' });
    await b.AccountSession.authenticate('register', { nickname: 'Mayor', password: 'x' });
    assert.equal(b.AccountSession.loadGame(), null);
    b.AccountSession.save({ day: 4, money: 200, wife: 50, threat: 15, health: 90, rating: 50, eventQueue: [] });
    assert.equal(b.AccountSession.loadGame().day, 4);
    assert.equal(b.values.get('mayorGameState'), 'guest-game');
    assert.equal(b.values.get('mayorGuestStats'), 'guest-stats');
});

test('idle warning, continuation and expiry use elapsed time including sleep and offline', async () => {
    const b = browser();
    await b.AccountSession.authenticate('login', {});
    b.requestGameApi = async () => { throw new TypeError('offline'); };
    // Functions run against the VM globals, not the copied facade.
    b.window.requestGameApi = b.requestGameApi;
    b.advance(25 * 60000);
    assert.equal(b.AccountSession.check(), 'warning');
    assert.equal(b.AccountSession.activity(), true);
    assert.equal(b.AccountSession.check(), 'active');
    b.advance(31 * 60000);
    assert.equal(b.AccountSession.check(), 'expired');
    assert.equal(b.AccountSession.activity(), false, 'a click after sleep must not revive an expired session');
    assert.equal(b.AccountSession.token(), null);
    b.advance(-31 * 60000);
    assert.equal(b.AccountSession.canPlay(), false, 'clock changes cannot unlock a session after sign-out');
});

test('registration prompts occur once at 3, 8 and 18 completed guest games', () => {
    const b = browser();
    assert.equal(b.AccountSession.shouldInvite(2), false);
    for (const count of [3, 8, 18]) {
        assert.equal(b.AccountSession.shouldInvite(count), true);
        assert.equal(b.AccountSession.shouldInvite(count), false);
    }
    assert.equal(b.AccountSession.shouldInvite(19), false);
});

test('a registered mayor playing as a guest is not invited to register again', async () => {
    const b = browser();
    await b.AccountSession.authenticate('login', {});
    b.AccountSession.becomeGuest();
    for (const count of [3, 8, 18]) assert.equal(b.AccountSession.shouldInvite(count), false);
});

test('an unsigned new tab is not reported as thirty minutes idle and cannot play as mayor', async () => {
    const b = browser({ mayorAuth: JSON.stringify({ account: { id: 'a' }, mode: 'mayor', lastActivityAt: 10000000 }) });
    await b.AccountSession.init();
    assert.equal(b.AccountSession.check(), 'signed_out');
    assert.equal(b.AccountSession.canPlay(), false);
});

test('a failed sign-in leaves the existing account and its local progress intact', async () => {
    const b = browser();
    await b.AccountSession.authenticate('login', {});
    b.AccountSession.save({ day: 7, money: 100, wife: 50, threat: 15, health: 90, rating: 50, eventQueue: [] });
    const savedAuth = b.values.get('mayorAuth');
    b.window.requestGameApi = async () => { throw new TypeError('offline'); };
    await assert.rejects(b.AccountSession.authenticate('login', { nickname: 'other', password: 'x' }), /offline/);
    assert.equal(b.values.get('mayorAuth'), savedAuth);
    assert.equal(b.AccountSession.account().id, 'a');
    assert.equal(b.AccountSession.loadGame().day, 7);
});

test('failed signup after a guest game ends does not restore its deleted save', async () => {
    const b = browser();
    const elements = new Map();
    Object.assign(b.window, {
        state: { day: 7, money: 100, wife: 50, threat: 100, health: 90, rating: 50, gameOverRecorded: true },
        currentTexts: { ui: { auth: { nickname_taken: 'Nickname taken' } } },
        document: { getElementById(id) {
            if (!elements.has(id)) elements.set(id, { value: 'taken', textContent: '', reportValidity: () => true });
            return elements.get(id);
        } },
        saveGuestGame() { b.GuestStorage.saveGameState(b.localStorage, b.window.state); },
        requestGameApi: async () => { throw Object.assign(new Error('Conflict'), { code: 'nickname_taken' }); }
    });
    vm.runInContext(readFileSync('app/ui/auth.js', 'utf8'), b.window);
    vm.runInContext('state = window.state; currentTexts = window.currentTexts', b.window);
    b.window.updateAuthUI = () => {};
    vm.runInContext("authFormKind = 'register'", b.window);
    await b.window.submitAuth({ preventDefault() {} });
    assert.equal(elements.get('auth-error').textContent, 'Nickname taken');
    assert.equal(b.values.has('mayorGameState'), false, 'a completed guest game must remain deleted');
});

test('switching accounts cannot acknowledge or send the previous account snapshot as the new user', async () => {
    const b = browser();
    let release;
    const writes = [];
    b.window.requestGameApi = async (path, { body, token, method } = {}) => {
        if (path.startsWith('/api/auth/')) return { account: { id: body.nickname, nickname: body.nickname }, authToken: body.nickname };
        if (path.endsWith('/session')) return { gameSessionId: token + '-session', save: null };
        if (method !== 'PUT') return null;
        writes.push({ token, day: body.state.day });
        if (token === 'A') await new Promise(resolve => { release = resolve; });
        return;
    };
    await b.AccountSession.authenticate('login', { nickname: 'A' });
    b.AccountSession.save({ day: 7, money: 100, wife: 50, threat: 15, health: 90, rating: 50 });
    const oldRequest = b.AccountSession.checkSession();
    await b.AccountSession.authenticate('login', { nickname: 'B' });
    assert.equal(b.AccountSession.loadGame(), null);
    b.AccountSession.save({ day: 1, money: 1000000, wife: 50, threat: 15, health: 90, rating: 50 });
    await b.AccountSession.checkSession();
    release();
    await oldRequest;
    assert.deepEqual(writes, [{ token: 'A', day: 7 }, { token: 'B', day: 1 }]);
    assert.equal(b.AccountSession.loadGame().day, 1);
    assert.equal(JSON.parse(b.BrowserSession.accountStore('A').getItem('cloudSave')).state.day, 7);
    assert.equal(JSON.parse(b.BrowserSession.accountStore('A').getItem('cloudSave')).pending, undefined);
    assert.equal(JSON.parse(b.BrowserSession.accountStore('B').getItem('cloudSave')).pending, undefined);
});
