const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function worker() {
    const handlers = {}, entries = new Map();
    const cache = {
        async put(request, response) {
            entries.set(request.url || request, { request, response: response.clone() });
        },
        async match(request) {
            const saved = entries.get(request.url || request);
            if (!saved) return;
            return saved.response.clone();
        }
    };
    const scope = 'https://example.test/mayor-game/';
    const context = {
        URL, Request, Response, caches: { open: async () => cache },
        self: { registration: { scope }, addEventListener: (name, fn) => { handlers[name] = fn; } },
        fetch: async () => { throw new TypeError('offline'); }
    };
    vm.runInNewContext(readFileSync('service-worker.js', 'utf8'), context);
    return {
        context, entries, scope,
        request(url, options) {
            let result;
            handlers.fetch({ request: new Request(url, options), respondWith: promise => { result = promise; } });
            return result;
        },
        install() {
            let result;
            handlers.install({ waitUntil: promise => { result = promise; } });
            return result;
        }
    };
}

test('offline shell respects the GitHub Pages subpath and online files replace the fallback', async () => {
    const w = worker();
    const html = '<script src="app/game/game.js"></script><link href="css/style.css" rel="stylesheet">';
    w.context.fetch = async url => new Response(url === w.scope + 'index.html' ? html : 'asset');
    await w.install();
    assert.ok(w.entries.has(w.scope + 'app/game/game.js'));
    w.context.fetch = async () => { throw new TypeError('offline'); };
    assert.equal(await (await w.request(w.scope)).text(), html);
    w.context.fetch = async () => new Response('new release');
    assert.equal(await (await w.request(w.scope)).text(), 'new release');
    w.context.fetch = async () => { throw new TypeError('offline'); };
    assert.equal(await (await w.request(w.scope + '?from=home')).text(), 'new release');
});

test('first installation caches transitive ES imports once, including circular dependencies', async () => {
    const w = worker(), calls = new Map();
    const sources = {
        'index.html': '<script type="module" src="app/main.js"></script>',
        'app/main.js': "import { start } from './game/start.js';\nstart();",
        'app/game/start.js': "import { state } from './state.js';\nimport '../ui.js';",
        'app/game/state.js': 'export const state = {};',
        'app/ui.js': "import './game/start.js';\nimport { state } from './game/state.js';"
    };
    w.context.fetch = async url => {
        calls.set(url, (calls.get(url) || 0) + 1);
        return new Response(sources[url.slice(w.scope.length)] || 'flag');
    };
    await w.install();
    w.context.fetch = async () => { throw new TypeError('offline'); };
    for (const [file, source] of Object.entries(sources)) {
        assert.equal(calls.get(w.scope + file), 1, file);
        assert.equal(await (await w.request(w.scope + file)).text(), source, file);
    }
});

test('only successful shared game data is cached, never account requests or writes', async () => {
    const w = worker();
    const url = 'https://mayor-game-api.icbob99.workers.dev/api/game-data';
    const raw = { results: Array.from({ length: 6 }, () => ({ type: 'ok' })) };
    w.context.fetch = async () => Response.json(raw);
    await w.request(url);
    w.context.fetch = async () => Response.json({ results: [{ type: 'error' }] });
    await w.request(url);
    w.context.fetch = async () => { throw new TypeError('offline'); };
    assert.deepEqual(await (await w.request(url)).json(), raw);
    for (const suffix of ['/api/auth/session', '/api/game/save', '/api/game/session']) {
        assert.equal(w.request(new URL(suffix, url).href), undefined);
    }
    assert.equal(w.request(url, { method: 'PUT', body: '{}' }), undefined);
    assert.equal(w.request(url, { headers: { Authorization: 'Bearer test-only' } }), undefined);
    assert.equal(w.entries.size, 1);
});

test('cached Docker content cannot cross a stand reset', async () => {
    const w = worker();
    const url = 'https://example.test/api/game-data';
    w.context.fetch = async () => Response.json({ results: Array.from({ length: 6 }, () => ({ type: 'ok' })) });
    await w.request(url, { headers: { 'X-Dev-Instance': 'old' } });
    w.context.fetch = async () => { throw new TypeError('offline'); };
    assert.ok(await w.request(url, { headers: { 'X-Dev-Instance': 'old' } }));
    await assert.rejects(w.request(url, { headers: { 'X-Dev-Instance': 'new' } }), /offline/);
});
