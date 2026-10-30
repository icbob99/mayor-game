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
        await until(() => page.evaluate("typeof state !== 'undefined' && state.day === 1 && document.querySelectorAll('#choices-container button').length > 0"));
    } catch (error) {
        const details = await page.evaluate("JSON.stringify({state:typeof state, text:document.body.innerText, resources:performance.getEntriesByType('resource').map(r=>({name:r.name,duration:r.duration}))})");
        throw new Error(`${error.message}: ${details}`);
    }
    assert.equal(await page.evaluate("Object.keys(gameLocales).sort().join(',')"), 'en,he,ru,uk');
    // Shop prices are game rules; historical locale fields do not control them.
    await page.evaluate("toggleShop(true)");
    const shopPrices = await page.evaluate("Array.from(document.querySelectorAll('#shop-items-container .text-emerald-400'), el => el.innerText)");
    assert.deepEqual(shopPrices, ['1,500,000 \u20aa', '800,000 \u20aa', '500,000 \u20aa', '1,000,000 \u20aa']);
    for (const lang of ['ru', 'uk', 'he']) {
        await page.evaluate(`setLang('${lang}')`);
        assert.deepEqual(await page.evaluate("Array.from(document.querySelectorAll('#shop-items-container .text-emerald-400'), el => el.innerText)"), shopPrices);
    }
    await page.evaluate("setLang('en')");
    await page.evaluate("document.querySelector('[data-perk=assuta_vip]').click()");
    assert.equal(await page.evaluate('state.money'), 500000);
    assert.equal(await page.evaluate('state.cooldowns.assuta_vip'), 8);
    await page.evaluate("buyPerk('assuta_vip'); toggleShop(false)");
    assert.equal(await page.evaluate('state.money'), 500000, 'cooldown prevents a second charge');
    await page.evaluate('resetGame()');
    await page.evaluate("localStorage.setItem('unrelated', 'keep'); document.querySelector('#choices-container button').click()");
    const saved = await page.evaluate('JSON.stringify({ day: state.day, money: state.money })');
    await page.evaluate('window.beforeReload = true');
    await page.call('Page.reload');
    await until(() => page.evaluate(`!window.beforeReload && typeof state !== 'undefined' && JSON.stringify({day:state.day,money:state.money}) === ${JSON.stringify(saved)}`));
    const secondPage = await openPage(port);
    pages.push(secondPage);
    await until(() => secondPage.evaluate('typeof state !== "undefined" && state.day > 1'));
    // Real auth routes and real libSQL: no simulated database or password verifier.
    async function authRequest(route, method, body, token) {
        const response = await fetch(base + '/api/auth/' + route, {
            method, headers: { 'X-Dev-Instance': firstId, 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
            body: body ? JSON.stringify(body) : undefined
        });
        return { status: response.status, body: await response.json() };
    }
    const nickname = 'Auth-' + Date.now();
    const registered = await authRequest('register', 'POST', { nickname, password: 'test password' });
    assert.equal(registered.status, 201);
    assert.equal(registered.body.account.nickname, nickname);
    const competing = await Promise.all([
        authRequest('register', 'POST', { nickname: nickname + '-race', password: 'one' }),
        authRequest('register', 'POST', { nickname: nickname.toUpperCase() + '-RACE', password: 'two' })
    ]);
    assert.deepEqual(competing.map(result => result.status).sort(), [201, 409]);
    assert.equal((await authRequest('register', 'POST', { nickname: ' ' + nickname.toLowerCase() + ' ', password: 'different' })).status, 409);
    assert.equal((await authRequest('login', 'POST', { nickname, password: 'wrong' })).status, 401);
    assert.equal((await authRequest('login', 'POST', { nickname: 'missing-' + nickname, password: 'wrong' })).body.error, 'unknown_nickname');
    const signedIn = await authRequest('login', 'POST', { nickname: nickname.toUpperCase(), password: 'test password' });
    assert.equal(signedIn.status, 200);
    assert.notEqual(signedIn.body.authToken, registered.body.authToken);
    assert.equal((await authRequest('session', 'GET', null, signedIn.body.authToken)).body.account.id, registered.body.account.id);
    assert.equal((await authRequest('activity', 'POST', null, signedIn.body.authToken)).status, 200);
    await authRequest('session', 'DELETE', null, signedIn.body.authToken);
    assert.equal((await authRequest('session', 'GET', null, signedIn.body.authToken)).status, 401);
    await require('./save-api.integration.cjs')(base, firstId);

    const guestProgress = "JSON.stringify((({currentEventIndex, ...progress}) => progress)(JSON.parse(LocalEnvironment.storage.getItem('mayorGameState'))))";
    const guestBefore = await page.evaluate(guestProgress);
    await page.evaluate(`openAuth('register'); document.getElementById('auth-nickname').value = '${nickname}-ui'; document.getElementById('auth-password').value = 'browser-password'; document.getElementById('auth-form').requestSubmit()`);
    await until(() => page.evaluate("AccountSession.isMayor() && !document.getElementById('auth-dialog').open && state.day === 1"));
    assert.equal(await page.evaluate(guestProgress), guestBefore, 'registration must preserve the guest progress');
    await page.evaluate("document.querySelector('#choices-container button').click()");
    await page.evaluate('AccountSession.flush()');
    assert.equal(await page.evaluate("requestGameApi('/api/game/save', {token:AccountSession.token()}).then(save => save.state.day)"),
        await page.evaluate('state.day'), 'a completed move reaches the cloud');
    const mayorSaved = await page.evaluate('JSON.stringify({day:state.day,money:state.money})');
    await page.evaluate('window.beforeAuthReload = true');
    await page.call('Page.reload');
    await until(() => page.evaluate(`!window.beforeAuthReload && typeof AccountSession !== 'undefined' && AccountSession.isMayor() && currentTexts?.ui.auth && gameLogicEvents.length > 0 && JSON.stringify({day:state.day,money:state.money}) === ${JSON.stringify(mayorSaved)}`));
    await page.call('Network.enable');
    await page.call('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    await page.evaluate('window.realNow = Date.now; Date.now = () => realNow() + 25 * 60000; updateAuthUI()');
    assert.equal(await page.evaluate('AccountSession.check()'), 'warning');
    await page.evaluate('AccountSession.activity(); triggerGameOver("arrest"); Date.now = () => realNow() + 56 * 60000; updateAuthUI()');
    assert.equal(await page.evaluate('AccountSession.check()'), 'expired');
    assert.equal(await page.evaluate('AccountSession.activity()'), false);
    assert.equal(await page.evaluate("document.getElementById('choices-container').inert"), true);
    assert.equal(await page.evaluate("document.getElementById('game-over-screen').classList.contains('hidden') && !document.getElementById('btn-login').hidden"), true, 'the result overlay must not block sign-in after expiry');
    assert.equal(await page.evaluate('JSON.stringify({day:state.day,money:state.money})'), mayorSaved);
    await page.evaluate('Date.now = realNow');
    await page.call('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });

    await page.evaluate("openAuth('login'); document.getElementById('auth-password').value = 'wrong'; document.getElementById('auth-form').requestSubmit()");
    await until(() => page.evaluate("!authFormBusy && document.getElementById('auth-error').textContent === authText('invalid_credentials')"));
    assert.equal(await page.evaluate("document.getElementById('auth-dialog').open && !AccountSession.canPlay()"), true);
    await page.evaluate("document.getElementById('auth-password').value = 'browser-password'; document.getElementById('auth-form').requestSubmit()");
    await until(() => page.evaluate("!authFormBusy && !document.getElementById('auth-dialog').open && AccountSession.canPlay()"));
    assert.equal(await page.evaluate('JSON.stringify({day:state.day,money:state.money})'), mayorSaved);

    await page.evaluate('AccountSession.flush()');
    assert.equal(await page.evaluate("requestGameApi('/api/game/save', {token:AccountSession.token()}).then(save => save.state.isFinished)"), true,
        'offline completion uploads after reauthentication');
    assert.equal(await page.evaluate('AccountSession.getStats().gamesPlayed'), 1);
    const finishedGame = await page.evaluate('state.gameId');
    await page.evaluate('resetGame();');
    await until(() => page.evaluate('state.day === 1 && !state.gameOverRecorded'));
    assert.notEqual(await page.evaluate('state.gameId'), finishedGame);
    await page.evaluate('AccountSession.flush()');
    await page.call('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    await page.evaluate("buyPerk('assuta_vip'); state.eventQueue.push({eventId:'never-restore',triggerDay:99}); saveGuestGame()");
    const beforeGuest = await page.evaluate('JSON.stringify({gameId:state.gameId,money:state.money,cooldown:state.cooldowns.assuta_vip})');
    await page.evaluate('becomeGuest()');
    assert.equal(await page.evaluate('AccountSession.isMayor()'), false);
    assert.equal(await page.evaluate('state.money'), 1000000);
    await page.evaluate("openAuth('login')");
    assert.equal(await page.evaluate("AccountSession.isMayor() && !document.getElementById('auth-dialog').open"), true,
        'returning from guest uses the existing authorization even offline');
    assert.equal(await page.evaluate('JSON.stringify({gameId:state.gameId,money:state.money,cooldown:state.cooldowns.assuta_vip})'), beforeGuest);
    assert.equal(await page.evaluate('state.eventQueue.length'), 0);
    await page.call('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await page.evaluate('AccountSession.flush()');
    assert.equal(await page.evaluate("requestGameApi('/api/game/save', {token:AccountSession.token()}).then(save => save.state.money)"), 500000);
    // Prove cloud restoration, rather than only restoring an existing browser copy.
    await page.evaluate("LocalEnvironment.storage.removeItem('mayorAccount:' + AccountSession.account().id + ':cloudSave'); window.beforeCloudReload=true");
    await page.call('Page.reload');
    await until(() => page.evaluate("!window.beforeCloudReload && typeof AccountSession !== 'undefined' && AccountSession.isMayor() && gameLogicEvents.length > 0 && state.money === 500000"));
    assert.equal(await page.evaluate('state.cooldowns.assuta_vip'), 8);
    assert.equal(await page.evaluate('AccountSession.getStats().gamesPlayed'), 1);

    const expired = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST', body: JSON.stringify({ requests: [
        { type: 'execute', stmt: { sql: 'UPDATE auth_sessions SET last_activity_at = 0' } },
        { type: 'execute', stmt: { sql: 'SELECT password_hash FROM accounts', want_rows: true } }, { type: 'close' }
    ] }) });
    const authRows = await expired.json();
    for (const row of authRows.results[1].response.result.rows) assert.match(row[0].value, /^pbkdf2-sha256\$/);
    assert.equal((await authRequest('activity', 'POST', null, registered.body.authToken)).status, 401, 'expired sessions cannot be revived');
    for (const count of [3, 8, 18, 19]) {
        await secondPage.evaluate(`LocalEnvironment.storage.setItem('mayorGuestStats', JSON.stringify({gamesPlayed:${count - 1},maxMoney:0,achievements:{}})); GuestSession.load(state); state.gameOverRecorded = false; triggerGameOver('arrest')`);
        assert.equal(await secondPage.evaluate("document.getElementById('auth-invite').open"), count !== 19);
        if (count !== 19) await secondPage.evaluate("document.getElementById('auth-invite-no').click()");
    }
    // A marker written through the real libSQL HTTP API must disappear on reset.
    const write = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST',
        body: JSON.stringify({ requests: [{ type: 'execute', stmt: { sql: 'CREATE TABLE reset_marker (id INTEGER)' } }, { type: 'close' }] }) });
    assert.equal((await write.json()).results[0].type, 'ok');
    const secondId = await start();
    assert.notEqual(secondId, firstId);
    for (const tab of pages) {
        try {
            await until(() => tab.evaluate(`localStorage.getItem('mayorDevInstance') === '${secondId}' && state.day === 1 && document.querySelectorAll('#choices-container button').length > 0`));
        } catch (error) {
            const details = await tab.evaluate("JSON.stringify({generation:localStorage.getItem('mayorDevInstance'),day:state.day,choices:document.querySelectorAll('#choices-container button').length,text:document.body.innerText})");
            throw new Error(`${error.message} after stand reset: ${details}`);
        }
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
