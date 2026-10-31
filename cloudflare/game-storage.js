import { query } from './database.js';

const saveJson = `CASE WHEN version_guid IS NULL THEN NULL ELSE json_object(
    'versionGuid', version_guid, 'writeTimestamp', write_timestamp, 'updatedAt', updated_at,
    'state', json(state_json), 'stats', json(stats_json)) END`;

function callerStatement(tokenHash, activeSince) {
    const caller = `WITH caller AS (
        SELECT a.account_id, a.id AS auth_id, g.id AS game_session_id, g.auth_session_id,
            s.version_guid, s.state_json, s.stats_json, s.write_timestamp, s.updated_at
        FROM auth_sessions a
        LEFT JOIN active_game_sessions g ON g.account_id = a.account_id
        LEFT JOIN game_statuses s ON s.account_id = a.account_id
        WHERE a.token_hash = ? AND a.revoked_at IS NULL AND a.last_activity_at > ?
    )`;
    return (sql, args = []) => ({ sql: `${caller} ${sql}`, args: [tokenHash, activeSince, ...args] });
}

export async function readGame(env, tokenHash, activeSince) {
    const stmt = callerStatement(tokenHash, activeSince);
    const [[row]] = await query(env, [stmt(`SELECT game_session_id, auth_session_id, auth_id, ${saveJson} AS save FROM caller`)]);
    return row;
}

export async function readGameSession(env, tokenHash, activeSince) {
    const stmt = callerStatement(tokenHash, activeSince);
    const [[row]] = await query(env, [stmt('SELECT game_session_id, auth_session_id, auth_id FROM caller')]);
    return row;
}

export async function activateGame(env, tokenHash, activeSince, body, hash, newId, now) {
    const stmt = callerStatement(tokenHash, activeSince);
    const results = await query(env, [
        stmt(`INSERT INTO game_persistence_operations (account_id, operation_id, request_hash, response_json, created_at)
            SELECT account_id, ?, ?, json_object('gameSessionId', ?, 'save', json(${saveJson})), ?
            FROM caller WHERE version_guid IS ? AND (game_session_id IS NULL OR game_session_id = ? OR ?)
            ON CONFLICT (account_id, operation_id) DO NOTHING`,
        [body.operationId, hash, newId, now, body.expectedVersionGuid, body.previousGameSessionId || null, Number(body.confirmTransfer)]),
        stmt(`INSERT INTO active_game_sessions (account_id, id, auth_session_id, activated_at)
            SELECT c.account_id, ?, c.auth_id, ? FROM caller c JOIN game_persistence_operations o ON o.account_id = c.account_id
            WHERE o.operation_id = ? AND json_extract(o.response_json, '$.gameSessionId') = ?
            ON CONFLICT (account_id) DO UPDATE SET id = excluded.id, auth_session_id = excluded.auth_session_id, activated_at = excluded.activated_at`,
        [newId, now, body.operationId, newId]),
        stmt(`SELECT c.*, o.request_hash, o.response_json, ${saveJson} AS save
            FROM caller c LEFT JOIN game_persistence_operations o ON o.account_id = c.account_id AND o.operation_id = ?`,
        [body.operationId])
    ], true);
    return results.at(-1)[0];
}

export async function saveGame(env, tokenHash, activeSince, body, newId, now) {
    const stmt = callerStatement(tokenHash, activeSince);
    const statements = [stmt(`INSERT INTO game_statuses (account_id, version_guid, state_json, stats_json, write_timestamp, updated_at)
        SELECT account_id, ?, ?, ?, ?, ? FROM caller
        WHERE game_session_id = ? AND auth_session_id = auth_id AND (write_timestamp IS NULL OR write_timestamp < ?)
        ON CONFLICT (account_id) DO UPDATE SET version_guid = excluded.version_guid, state_json = excluded.state_json,
            stats_json = excluded.stats_json, write_timestamp = excluded.write_timestamp, updated_at = excluded.updated_at`,
    [newId, JSON.stringify(body.state), JSON.stringify(body.stats), body.writeTimestamp, now, body.gameSessionId, body.writeTimestamp])];
    if (body.state.isFinished) {
        const state = body.state;
        // The new version identifies only the write accepted by this transaction.
        statements.push(stmt(`INSERT INTO game_history (account_id, game_id, finished_at, recorded_at, days, money, end_reason, achievements_json)
            SELECT account_id, ?, ?, ?, ?, ?, ?, ? FROM caller WHERE version_guid = ?
            ON CONFLICT (account_id, game_id) DO NOTHING`,
        [state.gameId, state.finishedAt, now, state.day, state.money, state.endReason, JSON.stringify(state.achievements), newId]));
    }
    statements.push(stmt('SELECT game_session_id, auth_session_id, auth_id FROM caller'));
    const results = await query(env, statements, true);
    return results.at(-1)[0];
}
