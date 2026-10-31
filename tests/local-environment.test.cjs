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
        async click(selector) {
            const point = await this.evaluate(`(() => { const el=document.querySelector(${JSON.stringify(selector)}); el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
            await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
            await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
        },
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
    let chrome, remoteChrome;
    const pages = [];
    t.after(async () => {
        pages.forEach(page => page.ws.close());
        chrome?.kill();
        remoteChrome?.kill();
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

    // Observe delivery from the test, without adding acknowledgements to the browser game.
    async function waitForCloud(tab) {
        await until(() => tab.evaluate(`requestGameApi('/api/game/save', {token:AccountSession.token()}).then(cloud => {
            const local = JSON.parse(BrowserSession.accountStore(AccountSession.account().id).getItem('cloudSave'));
            return cloud && cloud.writeTimestamp === local.writeTimestamp;
        })`));
    }
    const guestProgress = "JSON.stringify((({currentEventIndex, ...progress}) => progress)(JSON.parse(LocalEnvironment.storage.getItem('mayorGameState'))))";
    const guestBefore = await page.evaluate(guestProgress);
    const guestStatsBefore = await page.evaluate('GuestSession.getStats()');
    await page.evaluate(`openAuth('register'); document.getElementById('auth-nickname').value = '${nickname}-ui'; document.getElementById('auth-password').value = 'browser-password'; document.getElementById('auth-form').requestSubmit()`);
    await until(() => page.evaluate("AccountSession.isMayor() && !document.getElementById('auth-dialog').open && state.day === 1"));
    assert.equal(await page.evaluate(guestProgress), guestBefore, 'registration must preserve the guest progress');
    await page.evaluate("document.querySelector('#choices-container button').click()");
    await waitForCloud(page);
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
    // Fix the completion fixture independently of achievements from the random card above.
    await page.evaluate('state.earnedAchievementsThisGame=[]; AccountSession.activity(); triggerGameOver("arrest"); Date.now = () => realNow() + 56 * 60000; updateAuthUI()');
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

    await waitForCloud(page);
    assert.equal(await page.evaluate("requestGameApi('/api/game/save', {token:AccountSession.token()}).then(save => save.state.isFinished)"), true,
        'offline completion uploads after reauthentication');
    assert.equal(await page.evaluate('AccountSession.getStats().gamesPlayed'), 1);
    // Complete three mayor games in this tab, then verify the popup the player actually sees.
    for (let game = 0; game < 2; game++) {
        await page.evaluate('resetGame()');
        await page.evaluate("state.money=3000000; state.earnedAchievementsThisGame=['happy_wife']; triggerGameOver('arrest'); AccountSession.checkSession()");
        await waitForCloud(page);
    }
    async function checkStatsPopup(tab, games, maxMoney, achievementCounts) {
        await tab.evaluate("document.getElementById('btn-guest-stats').click()");
        assert.equal(await tab.evaluate("document.getElementById('guest-stats-modal').getClientRects().length > 0"), true);
        assert.equal(await tab.evaluate("document.getElementById('guest-stats-games').innerText"), String(games));
        assert.equal(await tab.evaluate("document.getElementById('guest-stats-money').innerText"),
            await tab.evaluate(`(${maxMoney}).toLocaleString() + ' ₪'`));
        assert.deepEqual(await tab.evaluate("Array.from(document.querySelectorAll('#guest-stats-achievements > div'), row => Number(row.innerText.match(/× (\\d+)$/)[1]))"), achievementCounts);
        await tab.evaluate("document.getElementById('guest-stats-close-btn').click()");
    }
    const finishedGame = await page.evaluate('state.gameId');
    await page.evaluate('resetGame();');
    await until(() => page.evaluate('state.day === 1 && !state.gameOverRecorded'));
    assert.notEqual(await page.evaluate('state.gameId'), finishedGame);
    await checkStatsPopup(page, 3, 3000000, [0, 0, 2, 0]);
    await waitForCloud(page);
    await page.call('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
    await page.evaluate("buyPerk('assuta_vip'); state.eventQueue.push({eventId:'never-restore',triggerDay:99}); saveGuestGame()");
    const beforeGuest = await page.evaluate('JSON.stringify({gameId:state.gameId,money:state.money,cooldown:state.cooldowns.assuta_vip})');
    await page.evaluate('becomeGuest()');
    assert.equal(await page.evaluate('AccountSession.isMayor()'), false);
    assert.equal(await page.evaluate('state.money'), 1000000);
    await checkStatsPopup(page, guestStatsBefore.gamesPlayed, Math.max(1000000, guestStatsBefore.maxMoney), []);
    await page.evaluate("openAuth('login')");
    assert.equal(await page.evaluate("AccountSession.isMayor() && !document.getElementById('auth-dialog').open"), true,
        'returning from guest uses the existing authorization even offline');
    assert.equal(await page.evaluate('JSON.stringify({gameId:state.gameId,money:state.money,cooldown:state.cooldowns.assuta_vip})'), beforeGuest);
    assert.equal(await page.evaluate('state.eventQueue.length'), 0);
    await page.call('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    await page.evaluate('AccountSession.checkSession()');
    assert.equal(await page.evaluate("requestGameApi('/api/game/save', {token:AccountSession.token()}).then(save => save.state.money)"), 1000000,
        'reconnecting does not resend the offline purchase');
    await page.evaluate('state.day++; saveGuestGame()');
    await waitForCloud(page);
    assert.equal(await page.evaluate("requestGameApi('/api/game/save', {token:AccountSession.token()}).then(save => save.state.money)"), 500000);
    // Prove cloud restoration, rather than only restoring an existing browser copy.
    await page.evaluate("BrowserSession.accountStore(AccountSession.account().id).removeItem('cloudSave'); window.beforeCloudReload=true");
    await page.call('Page.reload');
    await until(() => page.evaluate("!window.beforeCloudReload && typeof AccountSession !== 'undefined' && AccountSession.syncStatus() === 'transfer_required' && document.getElementById('save-sync-dialog').open"));
    await page.evaluate("document.getElementById('save-sync-confirm').click()");
    await until(() => page.evaluate("!saveSyncBusy && !AccountSession.syncStatus() && state.money === 500000"));
    assert.equal(await page.evaluate('state.cooldowns.assuta_vip'), 8);
    assert.equal(await page.evaluate('AccountSession.getStats().gamesPlayed'), 3);

    // Actual clicks after no play, several guest moves and completed guest games.
    const mayorWriter = await page.evaluate("JSON.parse(BrowserSession.accountStore(AccountSession.account().id).getItem('cloudSave')).gameSessionId");
    const mayorAccount = await page.evaluate('AccountSession.account().id');
    async function storedCounts() {
        const response = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST', body: JSON.stringify({ requests: [
            { type: 'execute', stmt: { sql: `SELECT
                (SELECT COUNT(*) FROM game_persistence_operations WHERE account_id = a.id),
                (SELECT COUNT(*) FROM auth_sessions WHERE account_id = a.id),
                (SELECT COUNT(*) FROM game_history WHERE account_id = a.id)
                FROM accounts a WHERE id = ?`, args: [{ type: 'text', value: mayorAccount }], want_rows: true } },
            { type: 'close' }
        ] }) });
        const data = await response.json();
        assert.equal(data.results[0].type, 'ok');
        return data.results[0].response.result.rows[0].map(cell => Number(cell.value));
    }
    const countsBeforeGuest = await storedCounts();
    assert.equal(countsBeforeGuest[2], 3, 'each completed mayor game has one history row');
    await checkStatsPopup(page, 3, 3000000, [0, 0, 2, 0]);
    assert.deepEqual(await storedCounts(), countsBeforeGuest, 'viewing statistics creates no database rows');
    for (const scenario of [{ moves: 0, endings: 0 }, { moves: 5, endings: 0 }, { moves: 0, endings: 3 }]) {
        await page.click('#btn-become-guest');
        await until(() => page.evaluate('!AccountSession.isMayor() && state.day===1'));
        for (let move = 0; move < scenario.moves; move++) {
            const day = await page.evaluate('state.day');
            await page.click('#choices-container button');
            assert.equal(await page.evaluate('state.day'), day + 1);
            if (await page.evaluate('Boolean(state.gameOverRecorded)')) await page.evaluate('resetGame()');
        }
        for (let game = 0; game < scenario.endings; game++) {
            await page.evaluate("triggerGameOver('arrest')");
            assert.equal(await page.evaluate("document.getElementById('auth-invite').open"), false, 'known mayor needs no registration invitation');
            await page.click('#btn-restart');
            await until(() => page.evaluate('!state.gameOverRecorded'));
        }
        await page.click('#btn-login');
        await until(() => page.evaluate('AccountSession.isMayor() && AccountSession.canPlay() && state.money===500000'));
        assert.equal(await page.evaluate("document.getElementById('auth-dialog').open || document.getElementById('save-sync-dialog').open"), false);
        assert.equal(await page.evaluate("JSON.parse(BrowserSession.accountStore(AccountSession.account().id).getItem('cloudSave')).gameSessionId"), mayorWriter,
            'returning to mayor continues the existing writer instead of activating another');
        await page.evaluate('AccountSession.checkSession()');
        assert.deepEqual(await storedCounts(), countsBeforeGuest,
            'guest play and return must not add mayor operations, authorizations or completed games');
    }

    // Two live tabs retain separate credentials and progress; a login alone never takes ownership.
    const otherTab = await openPage(port);
    pages.push(otherTab);
    await until(() => otherTab.evaluate("typeof currentTexts !== 'undefined' && currentTexts?.ui.saveSync"));
    assert.equal(await otherTab.evaluate('AccountSession.token()'), null);
    assert.equal(await otherTab.evaluate('AccountSession.check()'), 'signed_out');
    assert.equal(await otherTab.evaluate("document.getElementById('auth-notice-text').textContent"), await otherTab.evaluate("authText('reauth')"));
    async function login(tab) {
        await tab.evaluate(`openAuth('login'); document.getElementById('auth-nickname').value = '${nickname}-ui'; document.getElementById('auth-password').value = 'browser-password'; document.getElementById('auth-form').requestSubmit()`);
        await until(() => tab.evaluate("!authFormBusy && !document.getElementById('auth-dialog').open"));
    }
    async function offline(tab, value) {
        await tab.call('Network.enable');
        await tab.call('Network.emulateNetworkConditions', { offline: value, latency: 0,
            downloadThroughput: value ? 0 : -1, uploadThroughput: value ? 0 : -1 });
    }
    await login(otherTab);
    assert.equal(await otherTab.evaluate('AccountSession.syncStatus()'), 'transfer_required');
    assert.equal(await otherTab.evaluate("document.getElementById('save-sync-notice').hidden"), true);
    await otherTab.click('#save-sync-cancel');
    await until(() => otherTab.evaluate("!document.getElementById('save-sync-dialog').open && !document.getElementById('save-sync-notice').hidden"));
    await otherTab.click('#save-sync-review');
    assert.equal(await otherTab.evaluate("document.getElementById('save-sync-dialog').open && document.getElementById('save-sync-notice').hidden"), true);
    await page.evaluate('AccountSession.checkSession()');
    assert.equal(await page.evaluate('AccountSession.canPlay()'), true, 'unconfirmed login leaves the first writer active');
    await offline(page, true);
    await page.evaluate("state.day=11; state.money=777000; state.earnedAchievementsThisGame=['survivor']; state.eventQueue.push({eventId:'never-transfer',triggerDay:99}); saveGuestGame(); AccountSession.checkSession()");
    await otherTab.evaluate("document.getElementById('save-sync-confirm').click()");
    await until(() => otherTab.evaluate('!saveSyncBusy && AccountSession.canPlay()'));
    assert.equal(await otherTab.evaluate('state.money'), 500000);
    await otherTab.evaluate('state.day=3; state.money=600000; saveGuestGame(); AccountSession.checkSession()');
    await waitForCloud(otherTab);
    await offline(page, false);
    await page.evaluate('AccountSession.checkSession()');
    assert.equal(await page.evaluate('AccountSession.syncStatus()'), 'session_replaced');
    assert.equal(await page.evaluate('AccountSession.canPlay()'), false);
    assert.equal(await page.evaluate('AccountSession.loadGame().money'), 777000);
    await login(page);
    assert.equal(await page.evaluate('AccountSession.syncStatus()'), 'save_conflict');
    assert.deepEqual(await page.evaluate('({local:AccountSession.syncDetails().local.money,cloud:AccountSession.syncDetails().cloud.state.money})'),
        { local: 777000, cloud: 600000 });
    // Keep the other tab's offline branch for the subsequent cloud-choice check.
    await offline(otherTab, true);
    await otherTab.evaluate('state.day=8; state.money=888000; saveGuestGame(); AccountSession.checkSession()');
    await page.evaluate("document.getElementById('save-sync-local').click()");
    await until(() => page.evaluate('!saveSyncBusy && AccountSession.canPlay()'));
    await waitForCloud(page);
    assert.equal(await page.evaluate("requestGameApi('/api/game/save', {token:AccountSession.token()}).then(save => save.state.money)"), 777000);
    await offline(otherTab, false);
    await otherTab.evaluate('AccountSession.checkSession()');
    assert.equal(await otherTab.evaluate('AccountSession.syncStatus()'), 'session_replaced');
    await login(otherTab);
    assert.equal(await otherTab.evaluate('AccountSession.syncStatus()'), 'save_conflict');
    await page.evaluate('state.day=12; state.money=999000; saveGuestGame(); AccountSession.checkSession()');
    await waitForCloud(page);
    await otherTab.evaluate("document.getElementById('save-sync-cloud').click()");
    await until(() => otherTab.evaluate('!saveSyncBusy'));
    assert.equal(await otherTab.evaluate('AccountSession.syncStatus()'), 'save_conflict', 'cloud changed while the choice was open');
    assert.equal(await otherTab.evaluate('AccountSession.syncDetails().local.money'), 888000, 'a rejected choice retains local play');
    assert.equal(await otherTab.evaluate('AccountSession.syncDetails().cloud.state.money'), 999000);
    await otherTab.evaluate("document.getElementById('save-sync-cloud').click()");
    await until(() => otherTab.evaluate('!saveSyncBusy && AccountSession.canPlay()'));
    assert.equal(await otherTab.evaluate('state.money'), 999000);
    assert.equal(await otherTab.evaluate('state.cooldowns.assuta_vip'), 8);
    assert.equal(await otherTab.evaluate('AccountSession.getStats().gamesPlayed'), 3, 'choices never add the two statistics together');
    await page.evaluate('AccountSession.checkSession()');
    assert.equal(await page.evaluate('AccountSession.syncStatus()'), 'session_replaced');

    // A separate browser profile has no local save or credentials, like another device.
    const remoteProfile = mkdtempSync(path.join(tmpdir(), 'mayor-device-'));
    remoteChrome = spawn(browserPath, ['--headless=new', '--no-first-run', '--no-default-browser-check',
        '--remote-debugging-port=0', `--user-data-dir=${remoteProfile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
    const remotePortFile = path.join(remoteProfile, 'DevToolsActivePort');
    await until(() => existsSync(remotePortFile));
    const remotePage = await openPage(Number(readFileSync(remotePortFile, 'utf8').split('\n')[0]));
    pages.push(remotePage);
    await until(() => remotePage.evaluate("typeof currentTexts !== 'undefined' && currentTexts?.ui.saveSync"));
    await remotePage.evaluate("localStorage.setItem('unrelated','keep')");
    await login(remotePage);
    assert.equal(await remotePage.evaluate('AccountSession.syncStatus()'), 'transfer_required');
    await remotePage.evaluate("document.getElementById('save-sync-confirm').click()");
    await until(() => remotePage.evaluate('!saveSyncBusy && AccountSession.canPlay()'));
    assert.equal(await remotePage.evaluate('state.money'), 999000);
    assert.equal(await remotePage.evaluate('state.day'), 12);
    assert.equal(await remotePage.evaluate('state.cooldowns.assuta_vip'), 8);
    assert.deepEqual(await remotePage.evaluate('state.earnedAchievementsThisGame'), ['survivor']);
    assert.equal(await remotePage.evaluate('state.eventQueue.length'), 0);
    await checkStatsPopup(remotePage, 3, 3000000, [0, 0, 2, 0]);
    await otherTab.evaluate('AccountSession.checkSession()');
    assert.equal(await otherTab.evaluate('AccountSession.syncStatus()'), 'session_replaced');
    await remotePage.evaluate("triggerGameOver('arrest'); AccountSession.checkSession()");
    await waitForCloud(remotePage);
    await login(otherTab);
    assert.equal(await otherTab.evaluate('AccountSession.syncStatus()'), 'transfer_required');
    await otherTab.evaluate("document.getElementById('save-sync-confirm').click()");
    await until(() => otherTab.evaluate('!saveSyncBusy && AccountSession.canPlay()'));
    assert.equal(await otherTab.evaluate('state.gameOverRecorded'), true);
    assert.equal(await otherTab.evaluate('state.endReason'), 'arrest');
    assert.equal(await otherTab.evaluate('AccountSession.getStats().gamesPlayed'), 4);
    assert.equal(await otherTab.evaluate('AccountSession.getStats().achievements.survivor'), 1);

    for (const count of [3, 8, 18, 19]) {
        await secondPage.evaluate(`LocalEnvironment.storage.setItem('mayorGuestStats', JSON.stringify({gamesPlayed:${count - 1},maxMoney:0,achievements:{}})); GuestSession.load(state); state.gameOverRecorded = false; triggerGameOver('arrest')`);
        assert.equal(await secondPage.evaluate("document.getElementById('auth-invite').open"), count !== 19);
        if (count !== 19) await secondPage.evaluate("document.getElementById('auth-invite-no').click()");
    }
    // Close every game tab, then open a genuinely new one in the same browser profile.
    await page.evaluate('AccountSession.activity()');
    const countsBeforeReopen = await storedCounts();
    for (const tab of pages.splice(0)) { await tab.call('Page.close'); tab.ws.close(); }
    const reopened = await openPage(port);
    pages.push(reopened);
    await until(() => reopened.evaluate("typeof currentTexts !== 'undefined' && currentTexts?.ui.auth && AccountSession.canPlay() && state.gameOverRecorded"));
    assert.equal(await reopened.evaluate('Boolean(AccountSession.token())'), true);
    assert.equal(await reopened.evaluate('AccountSession.check()'), 'active');
    assert.equal(await reopened.evaluate("document.getElementById('auth-dialog').open || document.getElementById('save-sync-dialog').open"), false);
    await checkStatsPopup(reopened, 4, 3000000, [0, 0, 2, 1]);
    assert.deepEqual(await storedCounts(), countsBeforeReopen, 'reopening restores authorization without creating database rows');
    // Keep several tabs/profiles open for the generation-reset checks below.
    pages.push(await openPage(port));
    pages.push(await openPage(Number(readFileSync(remotePortFile, 'utf8').split('\n')[0])));

    const expired = await fetch('http://127.0.0.1:8082/v2/pipeline', { method: 'POST', body: JSON.stringify({ requests: [
        { type: 'execute', stmt: { sql: 'UPDATE auth_sessions SET last_activity_at = 0' } },
        { type: 'execute', stmt: { sql: 'SELECT password_hash FROM accounts', want_rows: true } }, { type: 'close' }
    ] }) });
    const authRows = await expired.json();
    for (const row of authRows.results[1].response.result.rows) assert.match(row[0].value, /^pbkdf2-sha256\$/);
    assert.equal((await authRequest('activity', 'POST', null, registered.body.authToken)).status, 401, 'expired sessions cannot be revived');
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
