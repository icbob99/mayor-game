const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

// Runs inside the existing disposable Docker test, against the actual Worker and libSQL.
module.exports = async function checkSaves(base, instanceId) {
    const api = async (path, token, body, method = body ? 'PUT' : 'GET') => {
        const response = await fetch(base + path, { method,
            headers: { 'X-Dev-Instance': instanceId, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body ? JSON.stringify(body) : undefined });
        return { status: response.status, data: await response.json() };
    };
    const sql = async (text, args = []) => {
        const response = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST', body: JSON.stringify({ requests: [
            { type: 'execute', stmt: { sql: text, args: args.map(value => ({ type: 'text', value })), want_rows: true } }, { type: 'close' }
        ] }) });
        const data = await response.json();
        assert.equal(data.results[0].type, 'ok', JSON.stringify(data));
        return data.results[0].response.result.rows;
    };
    const nickname = 'Save-' + randomUUID();
    const registered = await api('/api/auth/register', null, { nickname, password: 'save-test' }, 'POST');
    assert.equal(registered.status, 201);
    const token = registered.data.authToken, account = registered.data.account.id;
    assert.deepEqual(await api('/api/game/save', token), { status: 200, data: null });
    const activation = { operationId: randomUUID(), expectedVersionGuid: null, confirmTransfer: false, source: 'local' };
    const activated = await api('/api/game/session', token, activation);
    assert.equal(activated.status, 200, JSON.stringify(activated));
    assert.deepEqual(await api('/api/game/session', token, activation), activated);
    const flags = { offshore_king: 0, untouchable: 0, happy_wife: 0, survivor: 0 };
    const body = {
        gameSessionId: activated.data.gameSessionId, operationId: randomUUID(), writeTimestamp: 100,
        state: { gameId: randomUUID(), day: 9, money: 2500000, health: 60, wife: 50, threat: 15, rating: 50,
            cooldowns: { police_bribe: 0, wife_spa: 0, assuta_vip: 12, pr_agency: 0 }, achievements: flags,
            isFinished: false, endReason: null, finishedAt: null },
        stats: { gamesPlayed: 0, maxMoney: 2500000, achievements: flags }, completedGames: []
    };
    const invalid = structuredClone(body);
    invalid.state.achievements.survivor = 2;
    assert.equal((await api('/api/game/save', token, invalid)).status, 400);
    const first = await api('/api/game/save', token, body);
    assert.equal(first.status, 200, JSON.stringify(first));
    assert.equal(first.data.status, 'saved');
    assert.deepEqual(await api('/api/game/save', token, body), first, 'a lost reply can be recovered verbatim');
    assert.equal((await api('/api/game/save', token, { ...body, writeTimestamp: 101 })).status, 400, 'operation IDs cannot be reused for changed content');
    const loaded = await api('/api/game/save', token);
    assert.deepEqual(loaded.data.state, body.state);
    assert.deepEqual(loaded.data.stats, body.stats);
    assert.equal(loaded.data.versionGuid, first.data.versionGuid);
    const conflict = await api('/api/game/session', token, { ...activation, operationId: randomUUID() });
    assert.equal(conflict.status, 409);
    assert.deepEqual(conflict.data.save, loaded.data);

    const finished = { gameId: body.state.gameId, days: 9, money: 2500000, finishedAt: Date.now(), endReason: 'arrest', achievements: flags };
    const next = { ...body, operationId: randomUUID(), writeTimestamp: 110,
        state: { ...body.state, gameId: randomUUID(), day: 1 }, stats: { ...body.stats, gamesPlayed: 1 }, completedGames: [finished] };
    const late = { ...body, operationId: randomUUID(), writeTimestamp: 109 };
    const [newer] = await Promise.all([api('/api/game/save', token, next), api('/api/game/save', token, late)]);
    assert.equal(newer.data.status, 'saved');
    assert.equal((await api('/api/game/save', token)).data.writeTimestamp, 110);
    assert.deepEqual(await api('/api/game/save', token, next), newer);
    const stale = { ...late, operationId: randomUUID(), writeTimestamp: 108 };
    assert.equal((await api('/api/game/save', token, stale)).data.status, 'stale');
    assert.equal(Number((await sql('SELECT COUNT(*) FROM game_history WHERE account_id = ?', [account]))[0][0].value), 1);
    assert.equal((await api('/api/game/save', token)).data.stats.gamesPlayed, 1);

    // A failure after the save write must also roll back the operation ID and the save itself.
    const beforeFailure = await api('/api/game/save', token);
    await sql(`CREATE TRIGGER fail_save_test BEFORE INSERT ON game_history WHEN NEW.account_id = '${account}' BEGIN SELECT RAISE(ABORT, 'test_failure'); END`);
    const failed = { ...next, operationId: randomUUID(), writeTimestamp: 111 };
    try {
        assert.equal((await api('/api/game/save', token, failed)).status, 503);
        assert.deepEqual(await api('/api/game/save', token), beforeFailure);
        assert.equal((await sql('SELECT operation_id FROM save_operations WHERE account_id = ? AND operation_id = ?', [account, failed.operationId])).length, 0);
    } finally { await sql('DROP TRIGGER fail_save_test'); }
    const recovered = await api('/api/game/save', token, failed);
    assert.equal(recovered.data.status, 'saved');

    const other = await api('/api/auth/register', null, { nickname: nickname + '-other', password: 'save-test' }, 'POST');
    assert.equal((await api('/api/game/save', other.data.authToken, { ...failed, operationId: randomUUID(), writeTimestamp: 112 })).status, 403);
    assert.equal((await api('/api/game/save', other.data.authToken)).data, null);

    // Reauthentication proves possession of this browser's previous token; another login does not.
    const login = await api('/api/auth/login', token, { nickname, password: 'save-test' }, 'POST');
    assert.equal(login.status, 200);
    assert.equal((await api('/api/game/save', token)).status, 401);
    const newToken = login.data.authToken;
    assert.deepEqual(await api('/api/game/save', newToken, failed), recovered);
    const cloud = (await api('/api/game/save', newToken)).data;
    const resumed = await api('/api/game/session', newToken, { ...activation, operationId: randomUUID(), expectedVersionGuid: cloud.versionGuid });
    assert.equal(resumed.status, 200, JSON.stringify(resumed));
    assert.equal((await api('/api/game/session', newToken, activation)).status, 403, 'an old activation cannot reclaim its writer');
    assert.equal((await api('/api/game/save', newToken, { ...failed, operationId: randomUUID(), writeTimestamp: 112 })).status, 403);
    const remoteLogin = await api('/api/auth/login', null, { nickname, password: 'save-test' }, 'POST');
    assert.equal((await api('/api/game/session', remoteLogin.data.authToken, { ...activation, operationId: randomUUID(), expectedVersionGuid: cloud.versionGuid })).status, 403);
    assert.equal((await api('/api/auth/login', newToken, { nickname: nickname + '-other', password: 'wrong' }, 'POST')).status, 401);
    assert.equal((await api('/api/game/save', newToken)).status, 200, 'failed login does not retire the current token');
    assert.equal((await api('/api/auth/register', newToken, { nickname: nickname + '-other', password: 'save-test' }, 'POST')).status, 409);
    assert.equal((await api('/api/game/save', newToken)).status, 200, 'failed registration rolls back token retirement');
    const loginB = await api('/api/auth/login', newToken, { nickname: nickname + '-other', password: 'save-test' }, 'POST');
    assert.equal(loginB.status, 200);
    assert.equal((await api('/api/game/save', newToken)).status, 401, 'switching to B retires only this browser token for A');
    assert.equal((await api('/api/game/save', remoteLogin.data.authToken)).status, 200, 'another authorization for A remains valid');
    const loginA = await api('/api/auth/login', loginB.data.authToken, { nickname, password: 'save-test' }, 'POST');
    assert.deepEqual(await api('/api/game/save', loginA.data.authToken, failed), recovered, 'A recovers its lost reply after visiting B');
    assert.equal((await api('/api/game/session', loginA.data.authToken, { ...activation, operationId: randomUUID(), expectedVersionGuid: cloud.versionGuid })).status, 200);
    const registerC = await api('/api/auth/register', loginA.data.authToken, { nickname: nickname + '-third', password: 'save-test' }, 'POST');
    assert.equal(registerC.status, 201);
    assert.equal((await api('/api/game/save', loginA.data.authToken)).status, 401, 'successful registration also retires the previous browser identity');
    const activity = await sql('SELECT last_activity_at FROM auth_sessions WHERE account_id = ? ORDER BY created_at DESC', [account]);
    await api('/api/game/save', remoteLogin.data.authToken);
    assert.deepEqual(await sql('SELECT last_activity_at FROM auth_sessions WHERE account_id = ? ORDER BY created_at DESC', [account]), activity, 'background saves/reads must not renew the idle timer');
};
