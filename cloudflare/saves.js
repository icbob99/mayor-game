import { query } from './database.js';
import { idleMs, tokenHash } from './auth.js';

const achievements = ['offshore_king', 'untouchable', 'happy_wife', 'survivor'];
const perks = ['police_bribe', 'wife_spa', 'assuta_vip', 'pr_agency'];
const reasons = ['arrest', 'wife_left', 'heart_attack', 'elections_lost'];
const uuid = value => typeof value === 'string' && /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);
const integer = (value, min = 0) => Number.isSafeInteger(value) && value >= min;
const counts = (value, keys, max = Number.MAX_SAFE_INTEGER) => value &&
    Object.keys(value).length === keys.length && keys.every(key => integer(value[key]) && value[key] <= max);
const ending = value => reasons.includes(value.endReason) && integer(value.finishedAt, 1);

function validSave(body) {
    const s = body.state, stats = body.stats;
    return uuid(body.gameSessionId) && integer(body.writeTimestamp, 1) && s && uuid(s.gameId) &&
        integer(s.day, 1) && Number.isSafeInteger(s.money) &&
        ['health', 'wife', 'threat', 'rating'].every(key => integer(s[key]) && s[key] <= 100) &&
        counts(s.cooldowns, perks) && counts(s.achievements, achievements, 1) &&
        (s.isFinished === true ? ending(s) : s.isFinished === false && s.endReason === null && s.finishedAt === null) &&
        stats && integer(stats.gamesPlayed) && integer(stats.maxMoney) && counts(stats.achievements, achievements, stats.gamesPlayed) &&
        Array.isArray(body.completedGames) && body.completedGames.every(game => game && uuid(game.gameId) &&
            integer(game.days, 1) && Number.isSafeInteger(game.money) && ending(game) && counts(game.achievements, achievements, 1));
}

// Property order does not change an operation's identity.
function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
    return value;
}

const saveJson = `CASE WHEN version_guid IS NULL THEN NULL ELSE json_object(
    'versionGuid', version_guid, 'writeTimestamp', write_timestamp, 'updatedAt', updated_at,
    'state', json(state_json), 'stats', json(stats_json)) END`;

export async function handleSave(request, env, headers) {
    const reply = (data, status = 200) => Response.json(data, { status, headers: { ...headers, 'Cache-Control': 'no-store' } });
    const route = new URL(request.url).pathname;
    const activation = route === '/api/game/session';
    if (!((route === '/api/game/save' && ['GET', 'PUT'].includes(request.method)) ||
        (activation && ['GET', 'PUT'].includes(request.method)))) return reply({ error: 'not_found' }, 404);
    const token = request.headers.get('Authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
    if (!token) return reply({ error: 'auth_expired' }, 401);
    try {
        let body;
        if (request.method === 'PUT') {
            const text = await request.text();
            if (text.length > 1024 * 1024) return reply({ error: 'invalid_request' }, 400);
            try { body = JSON.parse(text); } catch { return reply({ error: 'invalid_request' }, 400); }
            if (!body || !uuid(body.operationId) || !(activation
                ? (body.expectedVersionGuid === null || uuid(body.expectedVersionGuid)) &&
                    (body.previousGameSessionId == null || uuid(body.previousGameSessionId)) &&
                    typeof body.confirmTransfer === 'boolean' && ['local', 'cloud'].includes(body.source)
                : validSave(body))) return reply({ error: 'invalid_request' }, 400);
        }
        const now = Date.now();
        const hashedToken = await tokenHash(token);
        // Reused in one atomic batch. Every statement derives ownership from the bearer token.
        const caller = `WITH caller AS (
            SELECT a.account_id, a.id AS auth_id, g.id AS game_session_id, g.auth_session_id,
                s.version_guid, s.state_json, s.stats_json, s.write_timestamp, s.updated_at
            FROM auth_sessions a
            LEFT JOIN active_game_sessions g ON g.account_id = a.account_id
            LEFT JOIN game_statuses s ON s.account_id = a.account_id
            WHERE a.token_hash = ? AND a.revoked_at IS NULL AND a.last_activity_at > ?
        )`;
        const stmt = (sql, args = []) => ({ sql: `${caller} ${sql}`, args: [hashedToken, now - idleMs, ...args] });
        if (request.method === 'GET') {
            if (activation) {
                const id = new URL(request.url).searchParams.get('gameSessionId');
                if (!uuid(id)) return reply({ error: 'invalid_request' }, 400);
                const [[row]] = await query(env, [stmt('SELECT game_session_id, auth_session_id, auth_id FROM caller')]);
                if (!row) return reply({ error: 'auth_expired' }, 401);
                return row.game_session_id === id && row.auth_session_id === row.auth_id
                    ? reply({ gameSessionId: id }) : reply({ error: 'session_replaced' }, 403);
            }
            const [[row]] = await query(env, [stmt(`SELECT ${saveJson} AS save FROM caller`)]);
            return row ? reply(JSON.parse(row.save)) : reply({ error: 'auth_expired' }, 401);
        }
        const hash = await tokenHash(route + JSON.stringify(canonical(body)));
        const newId = crypto.randomUUID();
        const transferAllowed = `(game_session_id IS NULL OR game_session_id = ? OR ?)`;
        const statements = [];
        if (activation) {
            statements.push(stmt(`INSERT INTO game_persistence_operations (account_id, operation_id, request_hash, response_json, created_at)
                SELECT account_id, ?, ?, json_object('gameSessionId', ?, 'save', json(${saveJson})), ?
                FROM caller WHERE version_guid IS ? AND ${transferAllowed}
                ON CONFLICT (account_id, operation_id) DO NOTHING`,
            [body.operationId, hash, newId, now, body.expectedVersionGuid, body.previousGameSessionId || null, Number(body.confirmTransfer)]));
            statements.push(stmt(`INSERT INTO active_game_sessions (account_id, id, auth_session_id, activated_at)
                SELECT c.account_id, ?, c.auth_id, ? FROM caller c JOIN game_persistence_operations o ON o.account_id = c.account_id
                WHERE o.operation_id = ? AND json_extract(o.response_json, '$.gameSessionId') = ?
                ON CONFLICT (account_id) DO UPDATE SET id = excluded.id, auth_session_id = excluded.auth_session_id, activated_at = excluded.activated_at`,
            [newId, now, body.operationId, newId]));
        } else {
            const result = JSON.stringify({ status: 'saved', operationId: body.operationId, versionGuid: newId, writeTimestamp: body.writeTimestamp, updatedAt: now });
            statements.push(stmt(`INSERT INTO game_persistence_operations (account_id, operation_id, request_hash, response_json, created_at)
                SELECT account_id, ?, ?, CASE WHEN write_timestamp >= ? THEN json_object('status', 'stale', 'operationId', ?) ELSE ? END, ?
                FROM caller WHERE game_session_id = ? AND auth_session_id = auth_id
                ON CONFLICT (account_id, operation_id) DO NOTHING`,
            [body.operationId, hash, body.writeTimestamp, body.operationId, result, now, body.gameSessionId]));
            // Only the operation inserted by this transaction can mutate the save or history.
            const accepted = `FROM caller c JOIN game_persistence_operations o ON o.account_id = c.account_id
                WHERE o.operation_id = ? AND json_extract(o.response_json, '$.versionGuid') = ?`;
            statements.push(stmt(`INSERT INTO game_statuses (account_id, version_guid, state_json, stats_json, write_timestamp, updated_at)
                SELECT c.account_id, ?, ?, ?, ?, ? ${accepted}
                ON CONFLICT (account_id) DO UPDATE SET version_guid = excluded.version_guid, state_json = excluded.state_json,
                    stats_json = excluded.stats_json, write_timestamp = excluded.write_timestamp, updated_at = excluded.updated_at`,
            [newId, JSON.stringify(body.state), JSON.stringify(body.stats), body.writeTimestamp, now, body.operationId, newId]));
            statements.push(stmt(`INSERT INTO game_history (account_id, game_id, finished_at, recorded_at, days, money, end_reason, achievements_json)
                SELECT c.account_id, json_extract(j.value, '$.gameId'), json_extract(j.value, '$.finishedAt'), ?,
                    json_extract(j.value, '$.days'), json_extract(j.value, '$.money'), json_extract(j.value, '$.endReason'), json_extract(j.value, '$.achievements')
                FROM caller c JOIN game_persistence_operations o ON o.account_id = c.account_id CROSS JOIN json_each(?) j
                WHERE o.operation_id = ? AND json_extract(o.response_json, '$.versionGuid') = ?
                ON CONFLICT (account_id, game_id) DO NOTHING`, [now, JSON.stringify(body.completedGames), body.operationId, newId]));
        }
        statements.push(stmt(`SELECT c.*, o.request_hash, o.response_json, ${saveJson} AS save
            FROM caller c LEFT JOIN game_persistence_operations o ON o.account_id = c.account_id AND o.operation_id = ?`,
        [body.operationId]));
        const results = await query(env, statements, true);
        const row = results.at(-1)[0];
        if (!row) return reply({ error: 'auth_expired' }, 401);
        if (row.response_json) {
            if (row.request_hash !== hash) return reply({ error: 'invalid_request' }, 400);
            const result = JSON.parse(row.response_json);
            if (activation && (row.game_session_id !== result.gameSessionId || row.auth_session_id !== row.auth_id)) {
                return reply({ error: 'session_replaced' }, 403);
            }
            return reply(result);
        }
        if (activation && row.version_guid !== body.expectedVersionGuid) return reply({ error: 'save_conflict', save: JSON.parse(row.save) }, 409);
        if (activation) return reply({ error: 'transfer_required', save: JSON.parse(row.save) }, 409);
        return reply({ error: 'session_replaced' }, 403);
    } catch {
        return reply({ error: 'server_unavailable' }, 503);
    }
}
