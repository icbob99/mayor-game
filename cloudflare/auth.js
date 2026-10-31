import { query } from './database.js';

export const idleMs = 30 * 60 * 1000;
const encoder = new TextEncoder();
// Cloudflare's production Web Crypto limit is 100,000 PBKDF2 iterations.
const iterations = 100000;
const hex = bytes => Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
const randomToken = () => hex(crypto.getRandomValues(new Uint8Array(32)));
export const tokenHash = async token => hex(await crypto.subtle.digest('SHA-256', encoder.encode(token)));

async function derive(password, salt) {
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations }, key, 256));
}

export async function hashPassword(password) {
    const salt = randomToken();
    return `pbkdf2-sha256$${iterations}$${salt}$${await derive(password, salt)}`;
}

export async function verifyPassword(password, stored) {
    const [algorithm, cost, salt, expected] = String(stored).split('$');
    if (algorithm !== 'pbkdf2-sha256' || Number(cost) !== iterations || !salt || expected?.length !== 64) return false;
    const actual = await derive(password, salt);
    let difference = 0;
    for (let i = 0; i < actual.length; i++) difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
    return difference === 0;
}

export async function handleAuth(request, env, headers) {
    const route = new URL(request.url).pathname;
    const reply = (data, status = 200) => Response.json(data, { status, headers: { ...headers, 'Cache-Control': 'no-store' } });
    const now = Date.now();
    try {
        if (request.method === 'POST' && ['/api/auth/register', '/api/auth/login'].includes(route)) {
            const text = await request.text();
            if (text.length > 8192) return reply({ error: 'invalid_request' }, 400);
            let body;
            try { body = JSON.parse(text); } catch { return reply({ error: 'invalid_request' }, 400); }
            if (!body || typeof body.nickname !== 'string' || typeof body.password !== 'string') return reply({ error: 'invalid_request' }, 400);
            const nickname = body.nickname.trim().normalize('NFKC');
            if (!nickname || nickname.length > 128 || !body.password || body.password.length > 1024) return reply({ error: 'invalid_request' }, 400);
            const nicknameKey = nickname.toLowerCase();
            const authToken = randomToken();
            const sessionId = crypto.randomUUID();
            const hashedToken = await tokenHash(authToken);
            // A successful identity switch retires only the token this browser already possessed.
            const previousToken = request.headers.get('Authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
            const previousHash = previousToken ? await tokenHash(previousToken) : null;
            const retirePrevious = { sql: 'UPDATE auth_sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL', args: [now, previousHash] };
            let account;
            let activeGameSessionId = null;
            if (route.endsWith('/register')) {
                account = { id: crypto.randomUUID(), nickname };
                const passwordHash = await hashPassword(body.password);
                try {
                    await query(env, [
                        { sql: 'INSERT INTO accounts (id, nickname, nickname_key, password_hash, created_at) VALUES (?, ?, ?, ?, ?)', args: [account.id, nickname, nicknameKey, passwordHash, now] },
                        { sql: 'INSERT INTO auth_sessions (id, account_id, token_hash, created_at, last_activity_at) VALUES (?, ?, ?, ?, ?)', args: [sessionId, account.id, hashedToken, now, now] },
                        retirePrevious
                    ], true);
                } catch (error) {
                    if (error.code?.startsWith('SQLITE_CONSTRAINT') && error.message.includes('nickname_key')) return reply({ error: 'nickname_taken' }, 409);
                    throw error;
                }
            } else {
                const [[row]] = await query(env, [{ sql: 'SELECT id, nickname, password_hash FROM accounts WHERE nickname_key = ?', args: [nicknameKey] }]);
                if (!row) return reply({ error: 'unknown_nickname' }, 401);
                if (!await verifyPassword(body.password, row.password_hash)) return reply({ error: 'invalid_credentials' }, 401);
                account = { id: row.id, nickname: row.nickname };
                const [, active] = await query(env, [
                    { sql: 'INSERT INTO auth_sessions (id, account_id, token_hash, created_at, last_activity_at) VALUES (?, ?, ?, ?, ?)', args: [sessionId, account.id, hashedToken, now, now] },
                    { sql: 'SELECT id FROM active_game_sessions WHERE account_id = ?', args: [account.id] },
                    retirePrevious,
                    // Keep the referenced writer even after expiry; it still controls the transfer flow.
                    { sql: `DELETE FROM auth_sessions
                        WHERE account_id = ? AND (revoked_at IS NOT NULL OR last_activity_at <= ?)
                        AND NOT EXISTS (SELECT 1 FROM active_game_sessions g
                            WHERE g.account_id = auth_sessions.account_id AND g.auth_session_id = auth_sessions.id)`,
                    args: [account.id, now - idleMs] }
                ], true);
                activeGameSessionId = active[0]?.id || null;
            }
            return reply({ account, authToken, expiresAt: now + idleMs, activeGameSessionId }, route.endsWith('/register') ? 201 : 200);
        }

        if (!((route === '/api/auth/session' && ['GET', 'DELETE'].includes(request.method)) ||
            (route === '/api/auth/activity' && request.method === 'POST'))) return reply({ error: 'not_found' }, 404);
        const token = request.headers.get('Authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
        if (!token) return reply({ error: 'auth_expired' }, 401);
        const hashedToken = await tokenHash(token);
        if (request.method === 'DELETE') {
            await query(env, [{ sql: 'UPDATE auth_sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL', args: [now, hashedToken] }]);
            return reply({ status: 'signed_out' });
        }
        const activity = route.endsWith('/activity');
        const sql = activity
            ? 'UPDATE auth_sessions SET last_activity_at = MAX(last_activity_at, ?) WHERE token_hash = ? AND revoked_at IS NULL AND last_activity_at > ? RETURNING account_id, last_activity_at'
            : 'SELECT a.id, a.nickname, s.last_activity_at FROM auth_sessions s JOIN accounts a ON a.id = s.account_id WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.last_activity_at > ?';
        const [[session]] = await query(env, [{ sql, args: activity ? [now, hashedToken, now - idleMs] : [hashedToken, now - idleMs] }]);
        if (!session) return reply({ error: 'auth_expired' }, 401);
        return reply({ ...(activity ? {} : { account: { id: session.id, nickname: session.nickname } }), expiresAt: session.last_activity_at + idleMs });
    } catch {
        return reply({ error: 'server_unavailable' }, 503);
    }
}
