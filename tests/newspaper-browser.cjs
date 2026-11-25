// Run against the disposable Docker test stack: python server.py --test.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { moduleExpression } = require('./browser-modules.cjs');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const output = path.resolve('.temp/newspaper');
    fs.mkdirSync(output, { recursive: true });
    const downloads = fs.mkdtempSync(path.join(output, 'downloads-'));
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mayor-newspaper-'));
    const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
        '--headless=new', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
        '--user-data-dir=' + profile, 'about:blank'
    ], { windowsHide: true, stdio: 'ignore' });
    let ws;
    try {
        const portFile = path.join(profile, 'DevToolsActivePort');
        for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
        const port = Number(fs.readFileSync(portFile, 'utf8').split('\n')[0]);
        const target = await (await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:8788/?test=newspaper#preview`, { method: 'PUT' })).json();
        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
        let id = 0;
        const pending = new Map();
        const errors = [];
        ws.addEventListener('message', event => {
            const message = JSON.parse(event.data);
            if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
            pending.get(message.id)?.(message);
        });
        const call = (method, params = {}) => new Promise((resolve, reject) => {
            const key = ++id;
            const timer = setTimeout(() => { pending.delete(key); reject(Error('CDP timeout: ' + method)); }, 15000);
            pending.set(key, message => {
                clearTimeout(timer); pending.delete(key);
                message.error ? reject(Error(JSON.stringify(message.error))) : resolve(message.result);
            });
            ws.send(JSON.stringify({ id: key, method, params }));
        });
        const evaluate = async expression => {
            const value = await call('Runtime.evaluate', { expression: moduleExpression(expression), returnByValue: true, awaitPromise: true });
            if (value.exceptionDetails) throw Error(JSON.stringify(value.exceptionDetails));
            return value.result.value;
        };
        const until = async expression => {
            for (let i = 0; i < 100; i++) {
                try { if (await evaluate(expression)) return; } catch {}
                await sleep(100);
            }
            throw Error('Timed out: ' + expression);
        };
        const click = async selector => {
            const point = await evaluate(`(() => { const el=document.querySelector(${JSON.stringify(selector)}); el.scrollIntoView({block:'center'}); const r=el.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
            await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
            await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
        };
        await call('Runtime.enable');
        await call('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads });
        await call('Browser.grantPermissions', { origin: 'http://localhost:8788', permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'] });
        await until('gameLogicEvents.length === 41 && Boolean(currentTexts?.ui.newspaper_name)');
        for (const file of ['app/ui/newspaper.js', 'app/ui/newspaper-canvas.js', 'app/infrastructure/result-sharing.js', 'app/game/game-over.js', 'app/ui/controls.js', 'index.html', 'css/style.css']) {
            const actual = (await (await fetch('http://localhost:8788/' + file)).text()).replaceAll('\r\n', '\n').replace('    <script src="/dev-environment.js"></script>\n', '');
            assert.equal(actual.replaceAll('\r\n', '\n'), fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n'), 'Docker source differs: ' + file);
        }
        await evaluate("document.getElementById('auth-invite').close()");
        await evaluate("(async()=>{await resetGame('normal','blitz');document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());})()");
        const blitzScale = await evaluate("document.getElementById('blitz-progress').style.transform");
        await sleep(1300);
        const blitzAfter = await evaluate("document.getElementById('blitz-progress').style.transform");
        assert.notEqual(blitzAfter, blitzScale, 'Blitz countdown must advance while the Game Over overlay is hidden');
        await evaluate("(async()=>{await resetGame('normal','arcade');})()");
        const reasons = ['arrest', 'wife_left', 'heart_attack', 'elections_lost', 'bankruptcy', 'indecision', 'resignation', 'honorable_retirement', 'too_popular', 'wife_abroad'];
        const reports = [];
        for (const lang of ['ru', 'en', 'uk', 'he']) {
            await evaluate(`(async () => { await setLang('${lang}'); Object.assign(state,{gameOverRecorded:true,money:1234567890123,day:50,difficulty:'normal',mode:'arcade',finishedAt:1700000000000}); })()`);
            for (const reason of reasons) {
                await evaluate(`state.endReason='${reason}'; renderGameOver()`);
                await until("!document.getElementById('btn-share-result').disabled && document.getElementById('newspaper-preview').complete");
                const result = await evaluate(`(() => {
                    const image=document.getElementById('newspaper-preview');
                    return {width:image.naturalWidth,height:image.naturalHeight,lang:image.dataset.lang,
                        model:createNewspaperModel(state,currentTexts.ui,getFinalTitle(state.endReason),location.origin+location.pathname),png:image.src};
                })()`);
                assert.equal(result.width, 1200); assert.equal(result.height, 630); assert.equal(result.lang, lang);
                assert.equal(result.model.victory, reason === 'honorable_retirement');
                assert.equal(await evaluate("document.getElementById('game-over-summary').hidden && !document.getElementById('newspaper-language')"), true);
                assert.equal(result.model.days, {ru:'День 50',en:'Day 50',uk:'День 50',he:'יום 50'}[lang]);
                assert.equal(result.model.url, 'http://localhost:8788/');
                assert.ok(result.model.headline); assert.ok(result.model.title);
                assert.ok(Object.values(result.model.labels).every(value => typeof value === 'string' && value.length > 0));
                if (lang === 'he') assert.ok(!/[a-z]/i.test([result.model.name, result.model.edition, result.model.headline, result.model.title, result.model.money, result.model.settings, ...Object.values(result.model.labels)].join(' ')));
                if (['honorable_retirement', 'resignation'].includes(reason)) fs.writeFileSync(path.join(output, `${lang}-${reason}.png`), Buffer.from(result.png.split(',')[1], 'base64'));
                delete result.png; reports.push({ lang, reason, ...result });
            }
        }
        // The newspaper follows the game language; check mobile overflow after relocalization.
        for (const width of [360, 390, 768, 1280]) {
            await call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 480 });
            for (const lang of ['ru', 'he']) {
                await evaluate(`state.endReason='honorable_retirement'; setLang('${lang}');`);
                await until(`document.getElementById('newspaper-preview').dataset.lang==='${lang}' && !document.getElementById('btn-share-result').disabled`);
                const layout = await evaluate(`(() => {const el=document.getElementById('game-over-dialog'),r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,overflow:el.scrollWidth>el.clientWidth,page:document.documentElement.scrollWidth>innerWidth,dir:document.documentElement.dir};})()`);
                assert.ok(layout.top >= 0 && layout.bottom <= 901); assert.equal(layout.overflow, false); assert.equal(layout.page, false);
                assert.equal(layout.dir, lang === 'he' ? 'rtl' : 'ltr');
                await evaluate("document.getElementById('newspaper-preview').scrollIntoView({block:'center'})");
                const screenshot = await call('Page.captureScreenshot', { format: 'png' });
                fs.writeFileSync(path.join(output, `${lang}-${width}.png`), Buffer.from(screenshot.data, 'base64'));
            }
        }
        await click('#btn-download-newspaper');
        const downloaded = path.join(downloads, 'mayor-game-result.png');
        for (let i = 0; i < 50 && !fs.existsSync(downloaded); i++) await sleep(100);
        const png = fs.readFileSync(downloaded);
        assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
        const previewPng = await evaluate("document.getElementById('newspaper-preview').src.split(',')[1]");
        assert.deepEqual(png, Buffer.from(previewPng, 'base64'));
        await evaluate("Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false})");
        await click('#btn-share-result');
        await until("!document.getElementById('newspaper-toast').hidden");
        assert.equal(await evaluate("document.getElementById('newspaper-toast').textContent===currentTexts.ui.newspaper_copied"), true);
        assert.ok((await evaluate('navigator.clipboard.readText()')).endsWith('http://localhost:8788/'));
        await sleep(4600);
        assert.equal(await evaluate("document.getElementById('newspaper-toast').hidden"), true);
        // Native cancellation and failures are mocked; the OS share sheet needs a physical device.
        await evaluate("Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true}); Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('cancel','AbortError')}})");
        await click('#btn-share-result');
        await until("!document.getElementById('btn-share-result').disabled");
        assert.equal(await evaluate("document.getElementById('newspaper-toast').hidden"), true);
        await evaluate("Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new Error('not available')}})");
        await click('#btn-share-result');
        await until("!document.getElementById('newspaper-toast').hidden");
        assert.equal(await evaluate("document.getElementById('newspaper-toast').textContent===currentTexts.ui.newspaper_share_error"), true);
        // A delayed font load must not restore an obsolete preview after reset.
        await evaluate("Object.defineProperty(document.fonts,'ready',{configurable:true,value:new Promise(resolve=>{window.releaseFonts=resolve;})}); renderGameOver()");
        await evaluate("(async()=>{await resetGame('normal','arcade'); window.releaseFonts(); delete document.fonts.ready;})()");
        await sleep(100);
        assert.equal(await evaluate("document.getElementById('newspaper-preview').hidden && document.getElementById('btn-share-result').disabled && document.getElementById('game-over-screen').classList.contains('hidden')"), true);
        assert.deepEqual(errors, []);
        fs.writeFileSync(path.join(output, 'browser.json'), JSON.stringify({ reports, errors, download: { width: 1200, height: 630 }, checkedWidths: [360, 390, 768, 1280], share: 'desktop real; native API mocked', stalePreview: 'passed' }, null, 2));
        console.log('40 localized endings; 8 layouts; PNG download, clipboard, toast, cancellation, error and reset race passed.');
    } finally {
        ws?.close(); chrome.kill();
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
