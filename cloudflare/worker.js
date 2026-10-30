import { pipeline } from './database.js';
import { handleAuth } from './auth.js';

const allowedOrigins = ['https://icbob99.github.io'];

function corsHeaders(origin) {
    const allowed = !origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:');
    return {
        'Access-Control-Allow-Origin': allowed ? origin || '*' : 'null',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
    };
}

export default {
    async fetch(request, env) {
        const headers = corsHeaders(request.headers.get('Origin'));
        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

        const url = new URL(request.url);
        if (url.pathname.startsWith('/api/auth/')) return handleAuth(request, env, headers);
        if (url.pathname !== '/api/game-data' || request.method !== 'GET') {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
        }
        if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
            return new Response(JSON.stringify({ error: 'Worker secrets are not configured' }), { status: 500, headers });
        }

        const response = await pipeline(env, [
                    { type: 'execute', stmt: { sql: 'SELECT id, avatar, is_follow_up, repeat_policy, max_occurrences FROM game_events ORDER BY rowid', want_rows: true } },
                    { type: 'execute', stmt: { sql: 'SELECT event_id, choice_index, money, wife, health, threat, rating, next_event_id, delay_days FROM game_choices ORDER BY event_id, choice_index', want_rows: true } },
                    { type: 'execute', stmt: { sql: 'SELECT lang, ui, alerts FROM game_locale_ui ORDER BY rowid', want_rows: true } },
                    { type: 'execute', stmt: { sql: 'SELECT event_id, lang, title, description FROM game_event_locales ORDER BY event_id, lang', want_rows: true } },
                    { type: 'execute', stmt: { sql: 'SELECT event_id, choice_index, lang, text FROM game_choice_locales ORDER BY event_id, choice_index, lang', want_rows: true } },
                    { type: 'close' }
        ]);
        return new Response(await response.text(), { status: response.ok ? 200 : 502, headers });
    }
};
