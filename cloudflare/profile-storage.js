import { query } from './database.js';

export async function readAudioProfile(env, tokenHash, cutoff) {
    const [[row]] = await query(env, [{
        sql: `SELECT p.audio_json FROM auth_sessions s
            LEFT JOIN account_preferences p ON p.account_id = s.account_id
            WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.last_activity_at > ?`,
        args: [tokenHash, cutoff]
    }]);
    return row;
}

export async function writeAudioProfile(env, tokenHash, cutoff, audio) {
    const [rows] = await query(env, [{
        sql: `INSERT INTO account_preferences (account_id, audio_json)
            SELECT account_id, ? FROM auth_sessions
            WHERE token_hash = ? AND revoked_at IS NULL AND last_activity_at > ?
            ON CONFLICT(account_id) DO UPDATE SET audio_json = excluded.audio_json
            RETURNING account_id`,
        args: [JSON.stringify(audio), tokenHash, cutoff]
    }]);
    return rows.length > 0;
}
