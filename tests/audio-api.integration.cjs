const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

module.exports = async function checkAudioProfiles(base, instanceId) {
    const api = async (route, token, body, method = body ? 'PUT' : 'GET') => {
        const r = await fetch(base + route, { method, headers: { 'X-Dev-Instance': instanceId,
            'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined });
        return { status: r.status, body: r.status === 204 ? null : await r.json() };
    };
    const register = async () => (await api('/api/auth/register', null, { nickname: 'Audio-' + randomUUID(), password: 'audio-test' }, 'POST')).body;
    const a = await register(), b = await register();
    const settings = { musicEnabled: false, musicVolume: 37, sfxEnabled: true, sfxVolume: 61 };
    assert.deepEqual(await api('/api/profile/audio', a.authToken), { status: 200, body: { audio: null } });
    for (let i = 0; i < 3; i++) assert.equal((await api('/api/profile/audio', a.authToken, settings)).status, 204);
    assert.deepEqual((await api('/api/profile/audio', a.authToken)).body.audio, settings);
    assert.equal((await api('/api/profile/audio', b.authToken)).body.audio, null);
    const sql = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST', body: JSON.stringify({ requests: [
        { type: 'execute', stmt: { sql: `SELECT
            (SELECT COUNT(*) FROM account_preferences WHERE account_id = ?),
            (SELECT COUNT(*) FROM game_statuses WHERE account_id = ?),
            (SELECT COUNT(*) FROM game_history WHERE account_id = ?),
            (SELECT COUNT(*) FROM game_persistence_operations WHERE account_id = ?)`,
        args: Array.from({ length: 4 }, () => ({ type: 'text', value: a.account.id })), want_rows: true } }, { type: 'close' }
    ] }) });
    const data = await sql.json(); assert.equal(data.results[0].type, 'ok');
    assert.deepEqual(data.results[0].response.result.rows[0].map(c => Number(c.value)), [1, 0, 0, 0]);
    await api('/api/auth/session', a.authToken, null, 'DELETE');
    assert.equal((await api('/api/profile/audio', a.authToken)).status, 401);
    assert.equal((await api('/api/profile/audio', a.authToken, settings)).status, 401);
};
