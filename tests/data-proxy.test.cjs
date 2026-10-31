const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = readFileSync(path.join(__dirname, '../app/infrastructure/data-proxy.js'), 'utf8');
function request(fetch, LocalEnvironment) {
    return vm.runInNewContext(source + '\nfetchRawGameData()', { fetch, LocalEnvironment, AbortSignal });
}

test('proxy requests cloud data once and returns raw JSON unchanged', async () => {
    const raw = { results: [{ type: 'ok', response: { type: 'close' } }] };
    let calls = 0;
    const data = await request(async (url, options) => {
        calls++;
        assert.equal(url, 'https://mayor-game-api.icbob99.workers.dev/api/game-data');
        assert.equal(options.method, 'GET');
        assert.equal(options.body, undefined);
        assert.ok(options.signal instanceof AbortSignal);
        return Response.json(raw);
    });
    assert.equal(calls, 1);
    assert.deepEqual(data, raw);
});

test('proxy uses the local environment wrapper in Docker', async () => {
    let calls = 0;
    const local = { async fetch(url, options) {
        calls++;
        assert.equal(this, local);
        assert.equal(url, '/api/game-data');
        assert.equal(options.method, 'GET');
        return Response.json({ results: [] });
    } };
    await request(() => assert.fail('Direct fetch bypassed the local wrapper'), local);
    assert.equal(calls, 1);
});

test('proxy propagates HTTP and network failures', async () => {
    await assert.rejects(request(async () => new Response('Unavailable', { status: 503 })), /HTTP 503/);
    const error = new Error('Connection lost');
    await assert.rejects(request(async () => { throw error; }), actual => actual === error);
});
