const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync, existsSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = name => readFileSync(path.join(root, name), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

test('SQLite migration and asynchronous game startup', async t => {
    for (const file of ['db/migrations/001_initial_schema.sql', 'db/seeds/001_game_data.sql', 'app/db.js']) {
        assert.ok(existsSync(path.join(root, file)), `${file} must exist`);
    }
    const originalEvents = vm.runInNewContext(`${read('app/gameData.js')}; gameLogicEvents`);
    const originalLocales = Object.fromEntries(['ru', 'en', 'he'].map(lang =>
        [lang, JSON.parse(read(`locales/${lang}.json`))]
    ));
    // Execute the actual SQL in SQLite; expose its result using Turso's wire format.
    const payload = JSON.parse(execFileSync('python', ['-c', `
import json, pathlib, sqlite3
db = sqlite3.connect(":memory:")
for name in ("db/migrations/001_initial_schema.sql", "db/seeds/001_game_data.sql"):
    db.executescript(pathlib.Path(name).read_text(encoding="utf-8"))
results = []
for table in ("events", "locales"):
    cursor = db.execute("SELECT * FROM " + table + " ORDER BY rowid")
    results.append({"type": "ok", "response": {"type": "execute", "result": {
        "cols": [{"name": col[0], "decltype": "TEXT"} for col in cursor.description],
        "rows": [[{"type": "null"} if value is None else {"type": "text", "value": value}
                  for value in row] for row in cursor.fetchall()],
        "affected_row_count": 0, "last_insert_rowid": None
    }}})
results.append({"type": "ok", "response": {"type": "close"}})
print(json.dumps({"baton": None, "base_url": None, "results": results}))
`], { cwd: root, encoding: 'utf8' }));

    function database(fetch) {
        const context = vm.createContext({ fetch, AbortSignal, URL });
        vm.runInContext(read('app/db.js'), context);
        vm.runInContext(`Object.assign(TURSO_CONFIG, {
            url: 'libsql://example.turso.io/', authToken: 'test-read-only-token'
        })`, context);
        return context;
    }
    let requestCount = 0;
    const db = database(async (url, options) => {
        requestCount++;
        assert.equal(url, 'https://example.turso.io/v2/pipeline');
        assert.equal(options.method, 'POST');
        assert.equal(options.headers.Authorization, 'Bearer test-read-only-token');
        const { requests } = JSON.parse(options.body);
        assert.equal(requests.length, 3);
        assert.match(requests[0].stmt.sql, /^SELECT .* FROM events ORDER BY rowid$/);
        assert.match(requests[1].stmt.sql, /^SELECT .* FROM locales/);
        assert.equal(requests[2].type, 'close');
        return { ok: true, json: async () => structuredClone(payload) };
    });
    let data;
    await t.test('all original fields survive SQL and REST decoding', async () => {
        data = await db.loadGameData();
        assert.deepEqual(plain(data.events), plain(originalEvents));
        assert.deepEqual(plain(data.locales), originalLocales);
        assert.equal(requestCount, 1);
    });

    await t.test('HTTP, SQL, malformed JSON and incomplete data reject loading', async () => {
        const sqlError = structuredClone(payload);
        sqlError.results[1] = { type: 'error', error: { message: 'no such table: locales' } };
        const invalidJSON = structuredClone(payload);
        invalidJSON.results[0].response.result.rows[0][2].value = '{broken';
        const empty = structuredClone(payload);
        empty.results[0].response.result.rows = [];
        const missingLanguage = structuredClone(payload);
        missingLanguage.results[1].response.result.rows.pop();
        for (const response of [
            { ok: false, status: 401 },
            ...[sqlError, invalidJSON, empty, missingLanguage].map(value =>
                ({ ok: true, json: async () => value }))
        ]) {
            await assert.rejects(database(async () => response).loadGameData());
        }
    });

    function game(loadGameData) {
        const elements = new Map();
        const element = () => ({
            innerText: '', innerHTML: '', dataset: {},
            classList: { add() {}, remove() {}, contains: () => true },
            setAttribute() {}, append() {}, appendChild() {}, addEventListener() {}
        });
        const document = {
            documentElement: {},
            querySelectorAll: () => [],
            getElementById(id) {
                if (!elements.has(id)) elements.set(id, element());
                return elements.get(id);
            },
            createElement: element,
            body: { appendChild() {} }
        };
        const context = vm.createContext({
            document, window: { setTimeout() {} }, loadGameData,
            console: { error() {} }, Math: Object.assign(Object.create(Math), { random: () => 0 })
        });
        vm.runInContext(read('app/game.js'), context);
        return { context, document, run: code => vm.runInContext(code, context) };
    }

    await t.test('startup waits; languages, chains, shop cooldowns and restart use loaded data', async () => {
        let resolve;
        let loads = 0;
        const loaded = new Promise(done => { resolve = done; });
        const { context, document, run } = game(() => { loads++; return loaded; });
        const startup = context.window.onload();
        assert.equal(run('state.currentEventIndex'), -1);
        resolve(data);
        await startup;
        assert.equal(run('state.currentEventIndex'), 0);
        await context.setLang('he');
        assert.equal(document.documentElement.dir, 'rtl');
        assert.equal(document.getElementById('event-title').innerText, originalLocales.he.events.bench_tender.title);
        run(`state.currentEventIndex = gameLogicEvents.findIndex(e => e.id === 'friday_country_club')`);
        context.handleChoice(0);
        assert.deepEqual(plain(run('state.pendingChainEvents')), [{ id: 'country_cctv_raid', triggerDay: 4 }]);
        run('state.day = 4');
        context.loadNextEvent();
        assert.equal(run('gameLogicEvents[state.currentEventIndex].id'), 'country_cctv_raid');
        run(`state.money = 3000000; state.threat = 50`);
        context.buyPerk('police_bribe');
        context.buyPerk('police_bribe');
        assert.equal(run('state.money'), 1500000);
        assert.equal(run('state.threat'), 30);
        assert.equal(run('state.cooldowns.police_bribe'), 11);
        context.triggerGameOver('arrest');
        assert.equal(document.getElementById('game-over-reason').innerText, originalLocales.he.alerts.arrest);
        await context.resetGame();
        assert.equal(run('state.day'), 1);
        assert.equal(loads, 1);
    });

    await t.test('failed startup leaves the game stopped and shows an error', async () => {
        const { context, document, run } = game(async () => { throw new Error('offline'); });
        await context.window.onload();
        assert.equal(run('state.currentEventIndex'), -1);
        assert.ok(document.getElementById('event-title').innerText);
        assert.ok(document.getElementById('event-desc').innerText);
    });
});
