// Opt-in: recreates only mayor-game-test, never the manual mayor-game-dev stand.
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { spawn, execFile } = require('node:child_process');
const { promisify } = require('node:util');
const { mkdtempSync, readFileSync, existsSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const run = promisify(execFile);
const root = path.resolve(__dirname, '..');
const base = 'http://localhost:8788';
const compose = ['compose', '--project-name', 'mayor-game-test', '--file', path.join(root, 'compose.yaml')];

async function until(check, timeout = 30000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        try { if (await check()) return; } catch { /* Wait for startup/navigation. */ }
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    throw new Error('Timed out waiting for browser state');
}

async function openPage(port) {
    const target = await (await fetch(`http://127.0.0.1:${port}/json/new?${base}`, { method: 'PUT' })).json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        ws.addEventListener('open', resolve, { once: true });
        ws.addEventListener('error', reject, { once: true });
    });
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        const callback = pending.get(message.id);
        if (callback) {
            pending.delete(message.id);
            callback(message);
        }
    });
    function call(method, params = {}) {
        return new Promise((resolve, reject) => {
            const requestId = ++id;
            const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timeout: ${method}`)); }, 10000);
            pending.set(requestId, message => {
                clearTimeout(timer);
                if (message.error) reject(new Error(JSON.stringify(message.error)));
                else resolve(message.result);
            });
            ws.send(JSON.stringify({ id: requestId, method, params }));
        });
    }
    return {
        call, ws,
        async evaluate(expression) {
            const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
            if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
            return result.result.value;
        }
    };
}

test('Docker stand boots the real game, preserves reloads, and resets DB and open tabs', {
    skip: process.env.MAYOR_DOCKER_TEST !== '1', timeout: 600000
}, async t => {
    const browserPath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
    assert.ok(existsSync(browserPath), 'Set CHROME_PATH to an installed Chrome/Chromium browser');
    const profile = mkdtempSync(path.join(tmpdir(), 'mayor-step1-'));
    let chrome;
    const pages = [];
    t.after(async () => {
        pages.forEach(page => page.ws.close());
        chrome?.kill();
        await run('docker', [...compose, 'down', '--volumes'], { cwd: root, timeout: 60000, windowsHide: true });
    });
    async function start() {
        const result = await run('python', ['server.py', '--test'], { cwd: root, timeout: 240000, maxBuffer: 4e6, windowsHide: true });
        assert.match(result.stdout, /Ready: http:\/\/localhost:8788/);
        return (await (await fetch(base + '/api/dev-info')).json()).instance_id;
    }
    const firstId = await start();
    chrome = spawn(browserPath, ['--headless=new', '--no-first-run', '--no-default-browser-check',
        '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
    const portFile = path.join(profile, 'DevToolsActivePort');
    await until(() => existsSync(portFile));
    const port = Number(readFileSync(portFile, 'utf8').split('\n')[0]);
    const page = await openPage(port);
    pages.push(page);
    try {
        await until(() => page.evaluate("typeof state !== 'undefined' && state.day === 1 && document.querySelectorAll('#choices-container button').length === 3"));
    } catch (error) {
        const details = await page.evaluate("JSON.stringify({state:typeof state, text:document.body.innerText, resources:performance.getEntriesByType('resource').map(r=>({name:r.name,duration:r.duration}))})");
        throw new Error(`${error.message}: ${details}`);
    }
    assert.equal(await page.evaluate("Object.keys(gameLocales).sort().join(',')"), 'en,he,ru,uk');
    await page.evaluate("localStorage.setItem('unrelated', 'keep'); document.querySelector('#choices-container button').click()");
    const saved = await page.evaluate('JSON.stringify({ day: state.day, money: state.money })');
    await page.evaluate('window.beforeReload = true');
    await page.call('Page.reload');
    await until(() => page.evaluate(`!window.beforeReload && typeof state !== 'undefined' && JSON.stringify({day:state.day,money:state.money}) === ${JSON.stringify(saved)}`));
    const secondPage = await openPage(port);
    pages.push(secondPage);
    await until(() => secondPage.evaluate('typeof state !== "undefined" && state.day > 1'));
    // A marker written through the real libSQL HTTP API must disappear on reset.
    const write = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST',
        body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql: 'CREATE TABLE reset_marker (id INTEGER)' } }, { type: 'close' }] }) });
    assert.equal((await write.json()).results[0].type, 'ok');
    const secondId = await start();
    assert.notEqual(secondId, firstId);
    for (const tab of pages) {
        await until(() => tab.evaluate(`localStorage.getItem('mayorDevInstance') === '${secondId}' && state.day === 1 && document.querySelectorAll('#choices-container button').length === 3`));
        assert.equal(await tab.evaluate("localStorage.getItem('unrelated')"), 'keep');
    }
    const stale = await fetch(base + '/api/game-data', { headers: { 'X-Dev-Instance': firstId } });
    assert.equal(stale.status, 409);
    const query = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST',
        body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql: "SELECT name FROM sqlite_master WHERE name='reset_marker'" } }, { type: 'close' }] }) });
    assert.deepEqual((await query.json()).results[0].response.result.rows, []);
    for (const resource of ['/cloudflare/worker.js', '/server.py', '/.git/config', '/db/seeds/003_normalized_data.sql']) {
        assert.equal((await fetch(base + resource)).status, 404, `${resource} must not be served as a game asset`);
    }
    const api = await fetch(base + '/api/game-data', { headers: { 'X-Dev-Instance': secondId } });
    const data = await api.json();
    assert.equal(data.results[0].response.result.rows.length, 41);
});
