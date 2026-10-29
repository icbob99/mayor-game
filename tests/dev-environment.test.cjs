const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function storage(initial = {}) {
    const values = new Map(Object.entries(initial));
    return {
        get length() { return values.size; },
        key: index => [...values.keys()][index],
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: key => values.delete(key)
    };
}

function browser(initial = {}, remoteId = 'new') {
    const listeners = {};
    const requests = [];
    const context = {
        localStorage: storage(initial), sessionStorage: storage({ mayorAuth: 'old', unrelated: 'keep' }),
        location: { origin: 'http://localhost:8787', reload() { context.reloads++; } },
        reloads: 0, Headers, URL, AbortSignal, console,
        addEventListener: (name, callback) => { listeners[name] = callback; },
        setInterval: callback => { context.poll = callback; },
        fetch: async (url, options) => {
            requests.push({ url, options });
            if (context.offline) throw new Error('offline');
            return new Response(JSON.stringify({ instance_id: context.remoteId }), { status: context.status });
        },
        remoteId, status: 200, listeners, requests
    };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(readFileSync('sandbox/dev-environment.js', 'utf8'), context);
    return context;
}

test('new stand clears only game storage before allowing guest restoration', async () => {
    const b = browser({ mayorDevInstance: 'old', mayorGameState: 'old game', mayorGuestStats: 'old stats',
        mayorRegistrationPrompt: '18', 'mayorAccount:123': 'old mayor',
        'mayorDevData:old:mayorGameState': 'old generation', unrelated: 'keep' });
    await b.LocalEnvironment.ready;
    assert.equal(b.localStorage.getItem('mayorGameState'), null);
    assert.equal(b.localStorage.getItem('mayorGuestStats'), null);
    assert.equal(b.localStorage.getItem('mayorRegistrationPrompt'), null);
    assert.equal(b.localStorage.getItem('mayorAccount:123'), null);
    assert.equal(b.localStorage.getItem('mayorDevData:old:mayorGameState'), null);
    assert.equal(b.sessionStorage.getItem('mayorAuth'), null);
    assert.equal(b.localStorage.getItem('unrelated'), 'keep');
    assert.equal(b.sessionStorage.getItem('unrelated'), 'keep');
    assert.equal(b.localStorage.getItem('mayorDevInstance'), 'new');
    assert.equal(b.reloads, 0);
});

test('same stand preserves progress on reload and sends its generation to the API', async () => {
    const b = browser({ mayorDevInstance: 'new', 'mayorDevData:new:mayorGameState': 'saved game' });
    await b.LocalEnvironment.ready;
    await b.LocalEnvironment.fetch('/api/game-data');
    assert.equal(b.LocalEnvironment.storage.getItem('mayorGameState'), 'saved game');
    assert.equal(b.requests.at(-1).options.headers.get('X-Dev-Instance'), 'new');
});

test('first visit clears legacy game data without a remembered stand ID', async () => {
    const b = browser({ mayorGameState: 'legacy game' });
    await b.LocalEnvironment.ready;
    assert.equal(b.localStorage.getItem('mayorGameState'), null);
});

test('old open tab detects a rebuilt stand and clears stale progress', async () => {
    const b = browser({ mayorDevInstance: 'new', mayorGameState: 'saved game' });
    await b.LocalEnvironment.ready;
    b.offline = true;
    await b.poll();
    assert.equal(b.localStorage.getItem('mayorGameState'), 'saved game');
    b.offline = false;
    b.remoteId = 'rebuilt';
    await b.poll();
    assert.equal(b.localStorage.getItem('mayorGameState'), null);
    assert.equal(b.reloads, 1);
    assert.equal(b.LocalEnvironment.isCurrent(), false);
});

test('another tab reset prevents stale guest writes without erasing new progress', async () => {
    const b = browser({ mayorDevInstance: 'new' });
    await b.LocalEnvironment.ready;
    vm.runInContext(readFileSync('app/data/guest-storage.js', 'utf8'), b);
    vm.runInContext(readFileSync('app/game/guest-session.js', 'utf8'), b);
    b.localStorage.setItem('mayorDevInstance', 'rebuilt');
    b.localStorage.setItem('mayorGameState', 'fresh game');
    b.GuestSession.save({ money: 999 });
    b.GuestSession.recordGameOver({ money: 999 });
    assert.equal(b.localStorage.getItem('mayorGameState'), 'fresh game');
    assert.equal(b.localStorage.getItem('mayorGuestStats'), null);
    assert.equal(b.reloads, 1);
});

test('reset between a guest generation check and write cannot overwrite or delete new progress', async () => {
    const b = browser({ mayorDevInstance: 'new' });
    await b.LocalEnvironment.ready;
    vm.runInContext(readFileSync('app/data/guest-storage.js', 'utf8'), b);
    vm.runInContext(readFileSync('app/game/guest-session.js', 'utf8'), b);
    const read = b.localStorage.getItem;
    b.localStorage.getItem = key => {
        const value = read(key);
        if (key === 'mayorDevInstance') {
            b.localStorage.setItem(key, 'rebuilt');
            b.localStorage.setItem('mayorDevData:rebuilt:mayorGameState', 'fresh game');
            b.localStorage.setItem('mayorDevData:rebuilt:mayorGuestStats', 'fresh stats');
            b.localStorage.getItem = read;
        }
        return value;
    };
    b.GuestSession.save({ day: 90, money: 999 });
    b.GuestSession.recordGameOver({ money: 999 });
    assert.equal(read('mayorDevData:rebuilt:mayorGameState'), 'fresh game');
    assert.equal(read('mayorDevData:rebuilt:mayorGuestStats'), 'fresh stats');
    assert.equal(read('mayorGameState'), null, 'stale writes must not use shared save keys');
});

test('rejected stale API request resets the tab instead of returning obsolete data', async () => {
    const b = browser({ mayorDevInstance: 'new', mayorGameState: 'old' });
    await b.LocalEnvironment.ready;
    b.remoteId = 'rebuilt';
    b.status = 409;
    await assert.rejects(b.LocalEnvironment.fetch('/api/game-data'), /restarted/);
    assert.equal(b.reloads, 1);
    assert.equal(b.localStorage.getItem('mayorGameState'), null);
});

test('development generation endpoint is absent from the production Worker', async () => {
    const { default: worker } = await import('../cloudflare/worker.js');
    const response = await worker.fetch(new Request('https://example.com/api/dev-info'), {});
    assert.equal(response.status, 404);
});

test('local server rejects missing and stale generation before accessing the game API', async () => {
    const { default: worker } = await import('../sandbox/local-worker.mjs');
    for (const id of [null, 'old']) {
        const headers = id ? { 'X-Dev-Instance': id } : {};
        const response = await worker.fetch(new Request('http://localhost/api/game-data', { headers }), { DEV_INSTANCE_ID: 'new' });
        assert.equal(response.status, 409);
        assert.deepEqual(await response.json(), { error: 'environment_restarted', instance_id: 'new' });
    }
});
