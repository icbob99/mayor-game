const allowedOrigins = ['https://icbob99.github.io'];

function corsHeaders(origin) {
    const allowed = !origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:');
    return {
        'Access-Control-Allow-Origin': allowed ? origin || '*' : 'null',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
}

export default {
    async fetch(request, env) {
        const headers = corsHeaders(request.headers.get('Origin'));
        if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

        const url = new URL(request.url);
        if (url.pathname !== '/api/game-data' || request.method !== 'GET') {
            return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
        }
        if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
            return new Response(JSON.stringify({ error: 'Worker secrets are not configured' }), { status: 500, headers });
        }

        const databaseUrl = env.TURSO_DATABASE_URL.replace(/^libsql:\/\//, 'https://').replace(/\/$/, '');
        const response = await fetch(`${databaseUrl}/v2/pipeline`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${env.TURSO_AUTH_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [
                    { type: 'execute', stmt: { sql: 'SELECT id, avatar, choices, chains FROM events ORDER BY rowid', want_rows: true } },
                    { type: 'execute', stmt: { sql: 'SELECT lang, ui, events FROM locales ORDER BY rowid', want_rows: true } },
                    { type: 'close' }
                ]
            })
        });
        return new Response(await response.text(), { status: response.ok ? 200 : 502, headers });
    }
};
