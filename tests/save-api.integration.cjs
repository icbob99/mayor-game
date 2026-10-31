const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

// Runs inside the existing disposable Docker test, against the actual Worker and libSQL.
module.exports = async function checkSaves(base, instanceId) {
    const api = async (path, token, body, method = body ? 'PUT' : 'GET') => {
        const response = await fetch(base + path, { method,
            headers: { 'X-Dev-Instance': instanceId, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: body ? JSON.stringify(body) : undefined });
        return { status: response.status, data: response.status === 204 ? await response.text() : await response.json() };
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
    const counts = async (id = account) => (await sql(`SELECT
        (SELECT COUNT(*) FROM game_persistence_operations WHERE account_id = a.id),
        (SELECT COUNT(*) FROM auth_sessions WHERE account_id = a.id),
        (SELECT COUNT(*) FROM game_history WHERE account_id = a.id)
        FROM accounts a WHERE id = ?`, [id]))[0].map(cell => Number(cell.value));
    assert.deepEqual(await counts(), [0, 1, 0], 'registration creates one authorization only');
    assert.deepEqual(await api('/api/game/save', token), { status: 200, data: null });
    const activation = { operationId: randomUUID(), expectedVersionGuid: null, confirmTransfer: false, source: 'local' };
    const activated = await api('/api/game/session', token, activation);
    assert.equal(activated.status, 200, JSON.stringify(activated));
    assert.deepEqual(await api('/api/game/session', token, activation), activated);
    assert.deepEqual(await counts(), [1, 1, 0], 'activation retry does not insert a second operation');
    const flags = { offshore_king: 0, untouchable: 0, happy_wife: 0, survivor: 0 };
    const body = {
        gameSessionId: activated.data.gameSessionId, writeTimestamp: 100,
        state: { gameId: randomUUID(), day: 9, money: 2500000, health: 60, wife: 50, threat: 15, rating: 50,
            cooldowns: { police_bribe: 0, wife_spa: 0, assuta_vip: 12, pr_agency: 0 }, achievements: flags,
            isFinished: false, endReason: null, finishedAt: null },
        stats: { gamesPlayed: 0, maxMoney: 2500000, achievements: flags }
    };
    const invalid = structuredClone(body);
    invalid.state.achievements.survivor = 2;
    assert.equal((await api('/api/game/save', token, invalid)).status, 400);
    const first = await api('/api/game/save', token, body);
    assert.deepEqual(first, { status: 204, data: '' }, 'ordinary saves return no receipt');
    const loaded = await api('/api/game/save', token);
    assert.deepEqual(loaded.data.state, body.state);
    assert.deepEqual(loaded.data.stats, body.stats);
    assert.equal(typeof loaded.data.versionGuid, 'string');
    assert.deepEqual(await api('/api/game/save', token, body), first);
    const equalTimestamp = { ...body, state: { ...body.state, money: 1 }, stats: { ...body.stats, maxMoney: 1 } };
    assert.deepEqual(await api('/api/game/save', token, equalTimestamp), first);
    assert.deepEqual(await api('/api/game/save', token), loaded, 'equal timestamp changes neither state, stats nor version');
    const conflict = await api('/api/game/session', token, { ...activation, operationId: randomUUID() });
    assert.equal(conflict.status, 409);
    assert.deepEqual(conflict.data.save, loaded.data);
    assert.deepEqual(await counts(), [1, 1, 0], 'ordinary saves, retries and reads create no operation receipts');

    const next = { ...body, writeTimestamp: 110,
        state: { ...body.state, isFinished: true, finishedAt: Date.now(), endReason: 'arrest' },
        stats: { ...body.stats, gamesPlayed: 1 } };
    const late = { ...body, writeTimestamp: 109 };
    const [newer, older] = await Promise.all([api('/api/game/save', token, next), api('/api/game/save', token, late)]);
    assert.equal(newer.status, 204);
    assert.equal(older.status, 204);
    const completed = await api('/api/game/save', token);
    assert.equal(completed.data.writeTimestamp, 110);
    assert.deepEqual(completed.data.state, next.state);
    assert.deepEqual(completed.data.stats, next.stats);
    assert.deepEqual(await api('/api/game/save', token, next), newer);
    const stale = { ...next, writeTimestamp: 108, state: { ...next.state, gameId: randomUUID() },
        stats: { ...next.stats, gamesPlayed: 5 } };
    assert.equal((await api('/api/game/save', token, stale)).status, 204);
    assert.equal((await api('/api/game/save', token, { ...stale, writeTimestamp: 110 })).status, 204);
    assert.deepEqual(await api('/api/game/save', token), completed, 'stale completion changes nothing');
    const history = await sql('SELECT game_id, finished_at, days, money, end_reason, achievements_json FROM game_history WHERE account_id = ?', [account]);
    assert.equal(history.length, 1);
    assert.deepEqual(history[0].map(cell => cell.value), [next.state.gameId, String(next.state.finishedAt), '9', '2500000', 'arrest', JSON.stringify(flags)]);
    assert.deepEqual(await counts(), [1, 1, 1], 'only activation has a receipt, and completion retries produce one history row');
    assert.equal((await api('/api/game/save', token, { ...next, writeTimestamp: 111 })).status, 204);
    assert.deepEqual(await counts(), [1, 1, 1], 'a newer snapshot of the same finished game does not duplicate its history');

    // A history failure must roll back the state and absolute statistics together.
    const beforeFailure = await api('/api/game/save', token);
    const beforeFailureCounts = await counts();
    await sql(`CREATE TRIGGER fail_save_test BEFORE INSERT ON game_history WHEN NEW.account_id = '${account}' BEGIN SELECT RAISE(ABORT, 'test_failure'); END`);
    const failed = { ...next, writeTimestamp: 112, state: { ...next.state, gameId: randomUUID(), day: 12 },
        stats: { ...next.stats, gamesPlayed: 2, maxMoney: 3000000 } };
    try {
        assert.equal((await api('/api/game/save', token, failed)).status, 503);
        assert.deepEqual(await api('/api/game/save', token), beforeFailure);
        assert.deepEqual(await counts(), beforeFailureCounts);
    } finally { await sql('DROP TRIGGER fail_save_test'); }
    const recovered = await api('/api/game/save', token, failed);
    assert.equal(recovered.status, 204);
    assert.deepEqual((await api('/api/game/save', token)).data.stats, failed.stats);
    assert.deepEqual(await counts(), [1, 1, 2]);

    const other = await api('/api/auth/register', null, { nickname: nickname + '-other', password: 'save-test' }, 'POST');
    assert.equal((await api('/api/game/save', other.data.authToken, { ...failed, writeTimestamp: 113 })).status, 403);
    assert.equal((await api('/api/game/save', other.data.authToken)).data, null);

    // Reauthentication retires the old token; writing requires activation under the new authorization.
    const login = await api('/api/auth/login', token, { nickname, password: 'save-test' }, 'POST');
    assert.equal(login.status, 200);
    assert.equal((await api('/api/game/save', token)).status, 401);
    const newToken = login.data.authToken;
    assert.equal((await counts())[1], 2, 'successful login inserts an authorization; the retired one is retained');
    assert.deepEqual(await api('/api/game/save', newToken, failed), { status: 403, data: { error: 'session_replaced' } },
        'a new authorization cannot write through the previous authorization\'s game session');
    const cloud = (await api('/api/game/save', newToken)).data;
    const resumed = await api('/api/game/session', newToken, { ...activation, operationId: randomUUID(), expectedVersionGuid: cloud.versionGuid, previousGameSessionId: activated.data.gameSessionId });
    assert.equal(resumed.status, 200, JSON.stringify(resumed));
    assert.deepEqual(await api('/api/game/save', newToken, { ...failed, gameSessionId: resumed.data.gameSessionId }),
        { status: 204, data: '' }, 'the activated writer may submit an equal-timestamp snapshot');
    assert.equal((await api('/api/game/session', newToken, activation)).status, 403, 'an old activation cannot reclaim its writer');
    assert.equal((await api('/api/game/save', newToken, { ...failed, writeTimestamp: 113 })).status, 403);
    const remoteLogin = await api('/api/auth/login', null, { nickname, password: 'save-test' }, 'POST');
    assert.equal((await api('/api/game/session', remoteLogin.data.authToken, { ...activation, operationId: randomUUID(), expectedVersionGuid: cloud.versionGuid })).data.error, 'transfer_required');
    assert.equal((await api('/api/auth/login', newToken, { nickname: nickname + '-other', password: 'wrong' }, 'POST')).status, 401);
    assert.equal((await api('/api/game/save', newToken)).status, 200, 'failed login does not retire the current token');
    assert.equal((await api('/api/auth/register', newToken, { nickname: nickname + '-other', password: 'save-test' }, 'POST')).status, 409);
    assert.equal((await api('/api/game/save', newToken)).status, 200, 'failed registration rolls back token retirement');
    const loginB = await api('/api/auth/login', newToken, { nickname: nickname + '-other', password: 'save-test' }, 'POST');
    assert.equal(loginB.status, 200);
    assert.equal((await api('/api/game/save', newToken)).status, 401, 'switching to B retires only this browser token for A');
    assert.equal((await api('/api/game/save', remoteLogin.data.authToken)).status, 200, 'another authorization for A remains valid');
    const loginA = await api('/api/auth/login', loginB.data.authToken, { nickname, password: 'save-test' }, 'POST');
    assert.equal((await api('/api/game/save', loginA.data.authToken, failed)).status, 403, 'returning to A does not authorize an old game session');
    assert.equal((await api('/api/game/session', loginA.data.authToken, { ...activation, operationId: randomUUID(), expectedVersionGuid: cloud.versionGuid, previousGameSessionId: resumed.data.gameSessionId })).status, 200);
    const registerC = await api('/api/auth/register', loginA.data.authToken, { nickname: nickname + '-third', password: 'save-test' }, 'POST');
    assert.equal(registerC.status, 201);
    assert.equal((await api('/api/game/save', loginA.data.authToken)).status, 401, 'successful registration also retires the previous browser identity');
    const activity = await sql('SELECT last_activity_at FROM auth_sessions WHERE account_id = ? ORDER BY created_at DESC', [account]);
    await api('/api/game/save', remoteLogin.data.authToken);
    assert.deepEqual(await sql('SELECT last_activity_at FROM auth_sessions WHERE account_id = ? ORDER BY created_at DESC', [account]), activity, 'background saves/reads must not renew the idle timer');

    // Transfer does not need a response from the previous device, even with the same auth token.
    const transfer = { ...activation, operationId: randomUUID(), expectedVersionGuid: cloud.versionGuid, confirmTransfer: true, source: 'cloud' };
    const owner = await api('/api/game/session', remoteLogin.data.authToken, transfer);
    assert.equal(owner.status, 200);
    assert.deepEqual(await api('/api/game/session', remoteLogin.data.authToken, transfer), owner);
    assert.equal((await api('/api/game/session', remoteLogin.data.authToken, { ...transfer, operationId: randomUUID(), confirmTransfer: false })).data.error, 'transfer_required');
    assert.equal((await api('/api/game/session?gameSessionId=' + owner.data.gameSessionId, remoteLogin.data.authToken)).status, 200);
    const newOwner = await api('/api/game/session', remoteLogin.data.authToken, { ...transfer, operationId: randomUUID() });
    assert.equal(newOwner.status, 200);
    assert.equal((await api('/api/game/session?gameSessionId=' + owner.data.gameSessionId, remoteLogin.data.authToken)).status, 403);
    assert.equal((await api('/api/game/session', remoteLogin.data.authToken, transfer)).status, 403, 'replaying an old confirmation never restores ownership');
    assert.equal((await api('/api/game/session', remoteLogin.data.authToken, { ...transfer, operationId: randomUUID(), confirmTransfer: false, previousGameSessionId: owner.data.gameSessionId })).data.error, 'transfer_required');
    assert.equal((await api('/api/game/save', remoteLogin.data.authToken, { ...failed, gameSessionId: owner.data.gameSessionId, writeTimestamp: 1000 })).status, 403);
    const currentWrite = { ...failed, gameSessionId: newOwner.data.gameSessionId, writeTimestamp: 1000 };
    assert.equal((await api('/api/game/save', remoteLogin.data.authToken, currentWrite)).status, 204);
    assert.equal((await api('/api/game/session', remoteLogin.data.authToken, { ...transfer, operationId: randomUUID() })).data.error, 'save_conflict', 'a choice against an old GUID cannot overwrite a newer cloud version');

    // Rehearse the additive locale update on a populated database, without rebuilding it.
    const savedBeforeSeed = await api('/api/game/save', remoteLogin.data.authToken);
    const historyBeforeSeed = await sql('SELECT account_id, game_id FROM game_history ORDER BY account_id, game_id');
    const accountsBeforeSeed = await sql('SELECT id, nickname FROM accounts ORDER BY id');
    await sql("UPDATE game_locale_ui SET ui = json_remove(ui, '$.saveSync')");
    const localesBeforeSeed = await sql('SELECT lang, ui, alerts FROM game_locale_ui ORDER BY lang');
    const seed = require('node:fs').readFileSync(require('node:path').join(__dirname, '../db/seeds/011_save_sync_ui.sql'), 'utf8');
    let firstLocales;
    for (let attempt = 0; attempt < 2; attempt++) {
        const response = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST', body: JSON.stringify({ requests: [
            { type: 'sequence', sql: seed }, { type: 'close' }
        ] }) });
        assert.equal((await response.json()).results[0].type, 'ok');
        const locales = await sql('SELECT lang, ui, alerts FROM game_locale_ui ORDER BY lang');
        if (firstLocales) assert.deepEqual(locales, firstLocales, 'reapplying the seed changes nothing');
        firstLocales = locales;
        for (let i = 0; i < locales.length; i++) {
            const ui = JSON.parse(locales[i][1].value);
            assert.ok(ui.saveSync.transfer_required && ui.saveSync.save_conflict && ui.saveSync.session_replaced);
            delete ui.saveSync;
            assert.deepEqual(ui, JSON.parse(localesBeforeSeed[i][1].value));
            assert.deepEqual(locales[i][2], localesBeforeSeed[i][2]);
        }
    }
    assert.deepEqual(await api('/api/game/save', remoteLogin.data.authToken), savedBeforeSeed);
    assert.deepEqual(await sql('SELECT account_id, game_id FROM game_history ORDER BY account_id, game_id'), historyBeforeSeed);
    assert.deepEqual(await sql('SELECT id, nickname FROM accounts ORDER BY id'), accountsBeforeSeed);

    // Existing expired sessions are reclaimed without disconnecting the current writer.
    const cleanupName = 'Cleanup-' + randomUUID();
    const a = await api('/api/auth/register', null, { nickname: cleanupName, password: 'cleanup-test' }, 'POST');
    assert.equal(a.status, 201);
    const cleanupAccount = a.data.account.id;
    const signIn = token => api('/api/auth/login', token, { nickname: cleanupName, password: 'cleanup-test' }, 'POST');
    const aWriter = await api('/api/game/session', a.data.authToken, { ...activation, operationId: randomUUID() });
    assert.equal(aWriter.status, 200);
    const others = await sql('SELECT id, last_activity_at, revoked_at FROM auth_sessions WHERE account_id <> ? ORDER BY id', [cleanupAccount]);
    for (let i = 0; i < 5; i++) assert.equal((await signIn(null)).status, 200);
    assert.equal((await counts(cleanupAccount))[1], 6, 'valid independent logins remain usable before transfer');
    await sql(`UPDATE auth_sessions SET last_activity_at = 0 WHERE account_id = ?
        AND id <> (SELECT auth_session_id FROM active_game_sessions WHERE account_id = ?)`, [cleanupAccount, cleanupAccount]);
    let b = await signIn(null);
    assert.equal(b.status, 200);
    assert.equal((await counts(cleanupAccount))[1], 2, 'login removes accumulated expired sessions');
    const aProbe = '/api/game/session?gameSessionId=' + aWriter.data.gameSessionId;
    assert.equal((await api(aProbe, a.data.authToken)).status, 200, 'B login does not disconnect A');
    assert.equal((await api('/api/game/session', b.data.authToken, { ...activation, operationId: randomUUID() })).data.error, 'transfer_required');

    for (let i = 0; i < 8; i++) {
        b = await signIn(b.data.authToken);
        assert.equal(b.status, 200);
        assert.equal((await counts(cleanupAccount))[1], 2, 'reauthentication replaces retired non-owner rows instead of accumulating them');
    }
    await api('/api/auth/session', b.data.authToken, null, 'DELETE');
    b = await signIn(null);
    assert.equal((await counts(cleanupAccount))[1], 2, 'an explicitly revoked session is reclaimed too');

    // Cleanup failure must roll back the new login and retirement of the previous token.
    await sql(`CREATE TRIGGER fail_auth_cleanup_test BEFORE DELETE ON auth_sessions
        WHEN OLD.account_id = '${cleanupAccount}' BEGIN SELECT RAISE(ABORT, 'test_failure'); END`);
    try {
        assert.equal((await signIn(b.data.authToken)).status, 503);
        assert.equal((await counts(cleanupAccount))[1], 2);
        assert.equal((await api('/api/auth/session', b.data.authToken)).status, 200);
    } finally { await sql('DROP TRIGGER fail_auth_cleanup_test'); }

    await sql(`UPDATE auth_sessions SET last_activity_at = 0 WHERE id =
        (SELECT auth_session_id FROM active_game_sessions WHERE account_id = ?)`, [cleanupAccount]);
    b = await signIn(b.data.authToken);
    assert.equal(b.status, 200, 'expired referenced authorization is retained to preserve the writer relationship');
    assert.equal((await counts(cleanupAccount))[1], 2);
    assert.equal((await api(aProbe, a.data.authToken)).status, 401, 'retaining the row never revives expired authorization');
    const bWriter = await api('/api/game/session', b.data.authToken, { ...activation, operationId: randomUUID(), confirmTransfer: true });
    assert.equal(bWriter.status, 200);
    assert.equal((await signIn(null)).status, 200);
    assert.equal((await counts(cleanupAccount))[1], 2, 'old owner is reclaimed on the next login after transfer');
    assert.equal((await api('/api/game/session?gameSessionId=' + bWriter.data.gameSessionId, b.data.authToken)).status, 200);
    assert.deepEqual(await sql('SELECT id, last_activity_at, revoked_at FROM auth_sessions WHERE account_id <> ? ORDER BY id', [cleanupAccount]), others);
    assert.deepEqual(await api('/api/game/save', remoteLogin.data.authToken), savedBeforeSeed);
    assert.deepEqual(await sql('SELECT account_id, game_id FROM game_history ORDER BY account_id, game_id'), historyBeforeSeed);
};
