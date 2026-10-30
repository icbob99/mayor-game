const assert = require('node:assert/strict');
const { test } = require('node:test');

test('auth rejects malformed credentials before accessing the database', async () => {
    const { default: worker } = await import('../cloudflare/worker.js');
    for (const body of ['{broken', '{}', '{"nickname":" ","password":"x"}', '{"nickname":"Mayor","password":""}']) {
        const response = await worker.fetch(new Request('https://example.com/api/auth/register', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body
        }), {});
        assert.equal(response.status, 400);
        assert.deepEqual(await response.json(), { error: 'invalid_request' });
    }
});

test('protected auth routes reject missing tokens and do not cache responses', async () => {
    const { default: worker } = await import('../cloudflare/worker.js');
    for (const [method, route] of [['GET', 'session'], ['POST', 'activity'], ['DELETE', 'session']]) {
        const response = await worker.fetch(new Request('https://example.com/api/auth/' + route, { method }), {});
        assert.equal(response.status, 401);
        assert.equal(response.headers.get('Cache-Control'), 'no-store');
    }
});
