const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');

function client(values = new Map()) {
    const b = { crypto: webcrypto, requestGameApi: async () => { throw new TypeError('offline'); } };
    b.window = b;
    vm.createContext(b);
    for (const file of ['data/guest-storage', 'game/game-state', 'game/mayor-save']) {
        vm.runInContext(readFileSync(`app/${file}.js`, 'utf8'), b);
    }
    const store = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
    const save = b.createMayorSave(store, () => 'token', () => true, () => {});
    const state = vm.runInContext('state', b);
    return { b, save, state, values };
}
const plain = value => JSON.parse(JSON.stringify(value));

test('legacy delivery fields are discarded without losing state, statistics or preferences', async () => {
    const c = client();
    c.state.day = 7;
    c.state.lang = 'uk';
    c.save.save(c.state);
    const old = JSON.parse(c.values.get('cloudSave'));
    delete old.localChanged;
    Object.assign(old, { pending: { state: { day: 2 } }, completedGames: [{ gameId: 'old' }],
        ackTimestamp: 0, gameSessionId: 'writer' });
    c.values.set('cloudSave', JSON.stringify(old));
    const restored = client(c.values);
    const methods = [];
    restored.b.requestGameApi = async (path, { method } = {}) => {
        methods.push(method);
        return path.includes('?') ? {} : null;
    };
    await restored.save.resume();
    assert.equal(restored.save.load().day, 7);
    assert.equal(restored.save.load().lang, 'uk');
    assert.deepEqual(plain(restored.save.stats()), old.stats);
    restored.save.save(restored.save.load());
    const record = JSON.parse(c.values.get('cloudSave'));
    for (const key of ['pending', 'ackTimestamp', 'completedGames']) assert.equal(record[key], undefined);
    assert.equal(methods.includes('PUT'), false);
});

test('offline snapshot preserves gameplay and total statistics without a delivery queue', () => {
    const c = client();
    Object.assign(c.state, { day: 9, money: 2000000, currentEventIndex: 4, eventQueue: [{ eventId: 'later' }],
        cooldowns: { assuta_vip: 12 }, earnedAchievementsThisGame: ['survivor'] });
    c.save.save(c.state);
    const savedId = c.state.gameId;
    Object.assign(c.state, { gameOverRecorded: true, endReason: 'arrest', finishedAt: Date.now() });
    c.save.save(c.state);
    c.save.save(c.state);
    assert.equal(c.save.stats().gamesPlayed, 1);
    assert.equal(c.save.stats().achievements.survivor, 1);
    const reopened = client(c.values);
    assert.equal(reopened.save.load().gameId, savedId);
    assert.equal(reopened.save.load().gameOverRecorded, true);
    assert.deepEqual(plain(reopened.save.load().eventQueue), []);
    assert.equal(reopened.save.load().currentEventIndex, -1);
    assert.equal(reopened.save.load().cooldowns.assuta_vip, 12);
    reopened.save.save(reopened.state);
    const record = JSON.parse(c.values.get('cloudSave'));
    assert.equal(record.completedGames, undefined);
    assert.equal(record.stats.gamesPlayed, 1);
    assert.equal(record.state.currentEventIndex, undefined);
    assert.equal(record.state.eventQueue, undefined);
    assert.equal(record.state.lang, undefined);
});

test('each change sends once without waiting; neither errors nor replies alter local progress', async () => {
    const c = client();
    const writes = [], releases = [];
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) return { gameSessionId: 'session', save: null };
        if (method !== 'PUT') return null;
        writes.push(plain(body));
        return new Promise((resolve, reject) => releases.push({ resolve, reject }));
    };
    await c.save.resume();
    c.save.save(c.state);
    c.state.day = 2;
    c.save.save(c.state);
    assert.equal(writes.length, 2, 'the first PUT is still pending');
    assert.deepEqual(writes.map(w => w.state.day), [1, 2]);
    assert.ok(writes[1].writeTimestamp > writes[0].writeTimestamp);
    const before = c.values.get('cloudSave');
    releases[1].resolve({ status: 'stale', versionGuid: 'ignored' });
    releases[0].reject(Object.assign(new Error('lost'), { status: 401 }));
    await new Promise(resolve => setImmediate(resolve));
    await c.save.checkSession();
    assert.equal(c.values.get('cloudSave'), before);
    assert.equal(c.save.status(), null);
    assert.equal(writes.length, 2, 'ownership checking must not retry a save');
    const record = JSON.parse(before);
    for (const key of ['pending', 'ackTimestamp', 'completedGames']) assert.equal(record[key], undefined);
    assert.equal(writes[0].operationId, undefined);
});

test('background session recovery retries only activation, never a game snapshot', async () => {
    const c = client();
    const activations = [], writes = [];
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) {
            activations.push(plain(body));
            if (activations.length === 1) throw new TypeError('activation reply lost');
            return { gameSessionId: 'writer', save: null };
        }
        if (method === 'PUT') { writes.push(plain(body)); throw new TypeError('save failed'); }
        return null;
    };
    await c.save.resume();
    c.state.day = 2;
    c.save.save(c.state);
    await c.save.checkSession();
    assert.equal(activations.length, 2);
    assert.deepEqual(activations[1], activations[0]);
    assert.equal(c.save.load().day, 2);
    assert.equal(writes.length, 0);
    c.state.day = 3;
    c.save.save(c.state);
    await c.save.checkSession();
    await c.save.checkSession();
    assert.equal(writes.length, 1);
    assert.equal(writes[0].state.day, 3);
});

test('a different cloud version retains local progress and stops automatic writes', async () => {
    const c = client();
    c.state.day = 8;
    c.save.save(c.state);
    let writes = 0;
    c.b.requestGameApi = async (path, options) => {
        if (options?.method === 'PUT') writes++;
        return { versionGuid: 'other-version', writeTimestamp: 123, state: { day: 12 } };
    };
    await c.save.resume();
    await c.save.checkSession();
    assert.equal(c.save.load().day, 8);
    assert.equal(c.save.status(), 'save_conflict');
    assert.equal(writes, 0);
    assert.equal(JSON.parse(c.values.get('cloudSave')).conflict.state.day, 12);
});

test('completion is sent with state and statistics, and a new game does not retain a completion queue', async () => {
    const c = client();
    const writes = [];
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) return { gameSessionId: 'session', save: null };
        if (method !== 'PUT') return null;
        writes.push(plain(body));
        throw new TypeError('offline');
    };
    await c.save.resume();
    Object.assign(c.state, { day: 5, gameOverRecorded: true, endReason: 'arrest', finishedAt: Date.now() });
    c.save.save(c.state);
    c.save.save(c.state);
    Object.assign(c.state, { gameId: webcrypto.randomUUID(), day: 1, gameOverRecorded: false, endReason: null, finishedAt: null });
    c.save.save(c.state);
    assert.equal(writes.length, 2);
    assert.equal(writes[0].state.isFinished, true);
    assert.equal(writes[0].stats.gamesPlayed, 1);
    assert.equal(writes[1].state.isFinished, false);
    assert.equal(writes[1].stats.gamesPlayed, 1);
    assert.equal(writes[1].completedGames, undefined);
});

test('reload keeps local progress without replay or false conflict after a lost save reply', async () => {
    const c = client();
    let cloud;
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) return { gameSessionId: 'old-session', save: null };
        if (method !== 'PUT') return null;
        cloud = { versionGuid: 'own-version', ...plain(body) };
        throw new TypeError('reply lost');
    };
    await c.save.resume();
    c.save.save(c.state);
    const reopened = client(c.values);
    const methods = [];
    reopened.b.requestGameApi = async (path, { method } = {}) => {
        methods.push(method);
        return path.includes('?') ? {} : cloud;
    };
    await reopened.save.resume();
    assert.equal(reopened.save.status(), null);
    assert.equal(reopened.save.load().day, 1);
    assert.equal(methods.includes('PUT'), false);
});

test('choosing local progress retries a lost activation reply and writes above the cloud timestamp', async () => {
    const c = client();
    c.state.day = 8;
    c.save.save(c.state);
    const cloud = { versionGuid: 'remote', writeTimestamp: Date.now() + 50000, state: { ...plain(c.save.load()), day: 12 },
        stats: { gamesPlayed: 3, maxMoney: 3000000, achievements: {} } };
    const activations = [], writes = [];
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) {
            activations.push(plain(body));
            if (activations.length === 1) throw new TypeError('reply lost');
            return { gameSessionId: 'session', save: cloud };
        }
        if (method !== 'PUT') return cloud;
        writes.push(plain(body));
        return;
    };
    await c.save.resume();
    await c.save.resolve('local');
    assert.equal(c.save.load().day, 8);
    assert.equal(writes.length, 0);
    await c.save.resolve('local');
    assert.deepEqual(activations[0], activations[1]);
    assert.equal(activations[0].expectedVersionGuid, 'remote');
    assert.equal(activations[0].confirmTransfer, true);
    assert.equal(writes[0].state.day, 8);
    assert.ok(writes[0].writeTimestamp > cloud.writeTimestamp);
    assert.equal(writes[0].stats.gamesPlayed, 0, 'statistics are selected, not merged');
    assert.equal(c.save.status(), null);
});

test('a failed upload of explicitly selected local progress survives reauthentication', async () => {
    const c = client();
    c.save.save(c.state);
    const old = JSON.parse(c.values.get('cloudSave'));
    old.localChanged = false;
    c.values.set('cloudSave', JSON.stringify(old));
    const restored = client(c.values);
    const cloud = { versionGuid: 'remote', writeTimestamp: old.writeTimestamp + 100,
        state: { ...old.state, day: 20 }, stats: old.stats };
    const choices = [];
    restored.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) {
            choices.push(body.source);
            if (!body.confirmTransfer && !body.previousGameSessionId) {
                throw Object.assign(new Error('transfer'), { status: 409, code: 'transfer_required', data: { save: cloud } });
            }
            return { gameSessionId: 'writer', save: cloud };
        }
        if (method === 'PUT') throw new TypeError('offline');
        return cloud;
    };
    await restored.save.resume(true);
    await restored.save.resolve('local');
    assert.equal(restored.save.load().day, 1);
    await restored.save.resume(true, 'writer');
    assert.equal(restored.save.load().day, 1);
    assert.deepEqual(choices, ['cloud', 'local', 'local']);
});

test('cloud changing during selection preserves the local game and requires a new choice', async () => {
    const c = client();
    c.state.day = 8;
    c.save.save(c.state);
    const initial = JSON.parse(c.values.get('cloudSave'));
    const cloud = { versionGuid: 'remote', writeTimestamp: Date.now() + 50000, state: { ...initial.state, day: 12 }, stats: initial.stats };
    let choices = 0, writes = 0;
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) {
            if (++choices === 1) {
                cloud.versionGuid = 'newer'; cloud.state.day = 13;
                throw Object.assign(new Error('changed'), { status: 409, code: 'save_conflict', data: { save: cloud } });
            }
            assert.equal(body.expectedVersionGuid, 'newer');
            return { gameSessionId: 'session', save: cloud };
        }
        if (method === 'PUT') writes++;
        return cloud;
    };
    await c.save.resume();
    await c.save.resolve('cloud');
    assert.equal(c.save.load().day, 8);
    assert.equal(c.save.details().cloud.state.day, 13);
    assert.equal(c.save.status(), 'save_conflict');
    await c.save.resolve('cloud');
    assert.equal(c.save.load().day, 13);
    assert.equal(c.save.status(), null);
    assert.equal(writes, 0, 'choosing cloud must not upload the discarded local snapshot');
    assert.equal(JSON.parse(c.values.get('cloudSave')).completedGames, undefined);
});

test('a replaced writer stays blocked after reload until reauthentication and explicit transfer', async () => {
    const c = client();
    c.save.save(c.state);
    const record = JSON.parse(c.values.get('cloudSave'));
    record.gameSessionId = 'old-session'; record.localChanged = false; record.versionGuid = 'cloud';
    c.values.set('cloudSave', JSON.stringify(record));
    const restored = client(c.values);
    let activations = 0;
    const cloud = { versionGuid: 'cloud', writeTimestamp: record.writeTimestamp, state: record.state, stats: record.stats };
    restored.b.requestGameApi = async (path, { body } = {}) => {
        if (path.includes('?')) throw Object.assign(new Error('replaced'), { status: 403, code: 'session_replaced' });
        if (path.endsWith('/session')) {
            activations++;
            if (!body.confirmTransfer) throw Object.assign(new Error('confirm'), { status: 409, code: 'transfer_required', data: { save: cloud } });
            return { gameSessionId: 'new-session', save: cloud };
        }
        return cloud;
    };
    await restored.save.resume();
    assert.equal(restored.save.status(), 'session_replaced');
    await restored.save.resume();
    assert.equal(activations, 0);
    await restored.save.resume(true);
    assert.equal(restored.save.status(), 'transfer_required');
    assert.equal(restored.save.details().source, 'cloud');
    await restored.save.resolve('cloud');
    assert.equal(activations, 2);
    assert.equal(restored.save.status(), null);
});

test('reload recovers a lost activation reply before probing the replaced previous ID', async () => {
    const c = client();
    c.save.save(c.state);
    const record = JSON.parse(c.values.get('cloudSave'));
    record.gameSessionId = 'old-session'; record.versionGuid = 'cloud'; record.localChanged = false;
    record.activation = { operationId: webcrypto.randomUUID(), previousGameSessionId: 'old-session', expectedVersionGuid: 'cloud', source: 'cloud', confirmTransfer: false };
    c.values.set('cloudSave', JSON.stringify(record));
    const restored = client(c.values);
    restored.b.requestGameApi = async (path, { body }) => {
        assert.equal(path, '/api/game/session', 'recover the known operation before probing an obsolete ID');
        assert.deepEqual(plain(body), record.activation);
        return { gameSessionId: 'already-activated', save: { versionGuid: 'cloud', writeTimestamp: record.writeTimestamp, state: record.state, stats: record.stats } };
    };
    await restored.save.resume();
    assert.equal(restored.save.status(), null);
    assert.equal(JSON.parse(c.values.get('cloudSave')).gameSessionId, 'already-activated');
});

test('a recovered cloud activation cannot discard moves made offline while its reply was missing', async () => {
    const c = client();
    c.save.save(c.state);
    const record = JSON.parse(c.values.get('cloudSave'));
    record.versionGuid = 'cloud'; record.localChanged = false;
    c.values.set('cloudSave', JSON.stringify(record));
    const restored = client(c.values);
    let lost = true, uploaded;
    const cloud = { versionGuid: 'cloud', writeTimestamp: record.writeTimestamp, state: record.state, stats: record.stats };
    restored.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) {
            if (lost) { lost = false; throw new TypeError('reply lost'); }
            return { gameSessionId: 'accepted-session', save: cloud };
        }
        if (method !== 'PUT') return cloud;
        uploaded = body.state;
        return;
    };
    await restored.save.resume();
    const played = restored.save.load(); played.day = 2;
    restored.save.save(played);
    await restored.save.resume();
    assert.equal(restored.save.load().day, 2);
    assert.equal(uploaded.day, 2);
});
