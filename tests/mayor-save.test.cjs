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

test('offline snapshot preserves gameplay but omits cards and consequences; completed games survive restart', () => {
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
    assert.equal(record.completedGames.length, 1);
    assert.equal(record.completedGames[0].gameId, savedId);
    assert.equal(record.state.currentEventIndex, undefined);
    assert.equal(record.state.eventQueue, undefined);
    assert.equal(record.state.lang, undefined);
});

test('lost reply retries the exact operation before comparing the cloud GUID', async () => {
    const c = client();
    let cloud = null, lost = true;
    const writes = [];
    const replies = new Map();
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) return { gameSessionId: 'session', save: cloud };
        if (method !== 'PUT') return cloud;
        writes.push(plain(body));
        if (!replies.has(body.operationId)) {
            cloud = { versionGuid: webcrypto.randomUUID(), writeTimestamp: body.writeTimestamp, state: body.state, stats: body.stats };
            replies.set(body.operationId, { status: 'saved', operationId: body.operationId, ...cloud });
        }
        if (lost) { lost = false; throw new TypeError('reply lost'); }
        return replies.get(body.operationId);
    };
    await c.save.resume();
    c.save.save(c.state);
    await c.save.flush();
    c.state.day = 2;
    c.save.save(c.state);
    await c.save.flush();
    assert.deepEqual(writes[0], writes[1]);
    assert.equal(cloud.state.day, 2);
    const record = JSON.parse(c.values.get('cloudSave'));
    assert.equal(record.pending, null);
    assert.equal(record.versionGuid, cloud.versionGuid);
    assert.equal(record.ackTimestamp, record.writeTimestamp);
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
    await c.save.flush();
    assert.equal(c.save.load().day, 8);
    assert.equal(c.save.status(), 'save_conflict');
    assert.equal(writes, 0);
    assert.equal(JSON.parse(c.values.get('cloudSave')).conflict.state.day, 12);
});

test('acknowledging an older snapshot does not lose moves or completions made during the request', async () => {
    const c = client();
    let release;
    const writes = [];
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) return { gameSessionId: 'session', save: null };
        if (method !== 'PUT') return null;
        writes.push(plain(body));
        if (writes.length === 1) await new Promise(resolve => { release = resolve; });
        return { status: 'saved', operationId: body.operationId, writeTimestamp: body.writeTimestamp, versionGuid: webcrypto.randomUUID() };
    };
    await c.save.resume();
    c.save.save(c.state);
    const sending = c.save.flush();
    Object.assign(c.state, { day: 5, gameOverRecorded: true, endReason: 'arrest', finishedAt: Date.now() });
    c.save.save(c.state);
    const finishedId = c.state.gameId;
    Object.assign(c.state, { gameId: webcrypto.randomUUID(), day: 1, gameOverRecorded: false, endReason: null, finishedAt: null });
    c.save.save(c.state);
    release();
    await sending;
    assert.equal(writes.length, 2);
    assert.equal(writes[1].completedGames[0].gameId, finishedId);
    assert.equal(writes[1].stats.gamesPlayed, 1);
    assert.equal(writes[1].state.gameId, c.state.gameId);
    const record = JSON.parse(c.values.get('cloudSave'));
    assert.equal(record.completedGames.length, 0);
    assert.equal(record.ackTimestamp, writes[1].writeTimestamp);
});

test('reload retries an unacknowledged operation without creating a false conflict', async () => {
    const c = client();
    let accepted;
    c.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) return { gameSessionId: 'old-session', save: null };
        if (method !== 'PUT') return null;
        accepted = plain(body);
        throw new TypeError('reply lost');
    };
    await c.save.resume();
    c.save.save(c.state);
    await c.save.flush();
    const reopened = client(c.values);
    const cloud = { state: accepted.state, stats: accepted.stats, versionGuid: 'own-version', writeTimestamp: accepted.writeTimestamp };
    reopened.b.requestGameApi = async (path, { method, body } = {}) => {
        if (path.endsWith('/session')) return { gameSessionId: 'new-session', save: cloud };
        if (method !== 'PUT') return cloud;
        assert.deepEqual(plain(body), accepted);
        return { status: 'saved', operationId: body.operationId, ...cloud };
    };
    await reopened.save.resume();
    assert.equal(reopened.save.status(), null);
    assert.equal(JSON.parse(c.values.get('cloudSave')).versionGuid, 'own-version');
});
