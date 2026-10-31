const assert = require('node:assert/strict');
const { test } = require('node:test');

test('save routes require authentication and reject malformed snapshots before DB access', async () => {
    const { default: worker } = await import('../cloudflare/worker.js');
    for (const [method, path] of [['GET', 'save'], ['PUT', 'save'], ['GET', 'session'], ['PUT', 'session']]) {
        const response = await worker.fetch(new Request(`https://example.com/api/game/${path}`, { method }), {});
        assert.equal(response.status, 401);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
    }
    for (const path of ['save', 'session']) {
        for (const body of ['{broken', 'null', '{}']) {
            const response = await worker.fetch(new Request(`https://example.com/api/game/${path}`, {
                method: 'PUT', headers: { Authorization: `Bearer ${'a'.repeat(64)}` }, body
            }), {});
            assert.equal(response.status, 400);
        }
    }
    const preflight = await worker.fetch(new Request('https://example.com/api/game/save', { method: 'OPTIONS' }), {});
    assert.match(preflight.headers.get('Access-Control-Allow-Methods'), /PUT/);
});
