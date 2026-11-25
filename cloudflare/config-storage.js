import { query } from './database.js';

export async function readGameConfig(env) {
    const [rows] = await query(env, [{ sql: 'SELECT key, value FROM game_config ORDER BY key' }]);
    return Object.fromEntries(rows.map(row => [row.key, JSON.parse(row.value)]));
}
