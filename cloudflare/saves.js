import { readGame, readGameSession, activateGame, saveGame } from './game-storage.js';
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
        stats && integer(stats.gamesPlayed) && integer(stats.maxMoney) && counts(stats.achievements, achievements, stats.gamesPlayed);
}

// Property order does not change an operation's identity.
function canonical(value) {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
    return value;
}

export async function handleSave(request, env, headers) {
    const responseHeaders = { ...headers, 'Cache-Control': 'no-store' };
    const reply = (data, status = 200) => Response.json(data, { status, headers: responseHeaders });
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
            if (!body || !(activation
                ? uuid(body.operationId) && (body.expectedVersionGuid === null || uuid(body.expectedVersionGuid)) &&
                    (body.previousGameSessionId == null || uuid(body.previousGameSessionId)) &&
                    typeof body.confirmTransfer === 'boolean' && ['local', 'cloud'].includes(body.source)
                : validSave(body))) return reply({ error: 'invalid_request' }, 400);
        }
        const now = Date.now();
        const hashedToken = await tokenHash(token);
        if (request.method === 'GET') {
            const id = new URL(request.url).searchParams.get('gameSessionId');
            if (activation && !uuid(id)) return reply({ error: 'invalid_request' }, 400);
            const row = await (activation ? readGameSession : readGame)(env, hashedToken, now - idleMs);
            if (!row) return reply({ error: 'auth_expired' }, 401);
            if (activation) {
                return row.game_session_id === id && row.auth_session_id === row.auth_id
                    ? reply({ gameSessionId: id }) : reply({ error: 'session_replaced' }, 403);
            }
            return reply(JSON.parse(row.save));
        }
        const newId = crypto.randomUUID();
        if (!activation) {
            const row = await saveGame(env, hashedToken, now - idleMs, body, newId, now);
            if (!row) return reply({ error: 'auth_expired' }, 401);
            if (row.game_session_id !== body.gameSessionId || row.auth_session_id !== row.auth_id) {
                return reply({ error: 'session_replaced' }, 403);
            }
            return new Response(null, { status: 204, headers: responseHeaders });
        }
        const hash = await tokenHash(route + JSON.stringify(canonical(body)));
        const row = await activateGame(env, hashedToken, now - idleMs, body, hash, newId, now);
        if (!row) return reply({ error: 'auth_expired' }, 401);
        if (row.response_json) {
            if (row.request_hash !== hash) return reply({ error: 'invalid_request' }, 400);
            const result = JSON.parse(row.response_json);
            if (row.game_session_id !== result.gameSessionId || row.auth_session_id !== row.auth_id) {
                return reply({ error: 'session_replaced' }, 403);
            }
            return reply(result);
        }
        if (row.version_guid !== body.expectedVersionGuid) return reply({ error: 'save_conflict', save: JSON.parse(row.save) }, 409);
        return reply({ error: 'transfer_required', save: JSON.parse(row.save) }, 409);
    } catch {
        return reply({ error: 'server_unavailable' }, 503);
    }
}
