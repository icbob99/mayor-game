const assert = require('node:assert/strict');

module.exports = async function checkConfig(page, base, instanceId) {
    const until = async check => {
        const deadline = Date.now() + 30000;
        while (Date.now() < deadline) {
            try { if (await check()) return; } catch { /* Navigation is still in progress. */ }
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        throw new Error('Configuration did not reach the browser');
    };
    const originalResponse = await fetch(base + '/api/config', { headers: { 'X-Dev-Instance': instanceId } });
    assert.equal(originalResponse.status, 200);
    const original = await originalResponse.json();
    assert.deepEqual(original, await page.evaluate('GameConfig.fallback'), 'SQL defaults and emergency fallback agree');
    assert.deepEqual(await page.evaluate('GameConfig.current'), original);
    const write = async config => {
        const response = await fetch('http://127.0.0.1:8082/v2/pipeline', {
            method: 'POST', body: JSON.stringify({ requests: [
                { type: 'batch', batch: { steps: Object.entries(config).map(([key, value]) => ({ stmt: {
                    sql: 'UPDATE game_config SET value = ? WHERE key = ?',
                    args: [JSON.stringify(value), key].map(value => ({ type: 'text', value }))
                } })) } }, { type: 'close' }
            ] })
        });
        const result = (await response.json()).results[0];
        assert.equal(result.type, 'ok');
        assert.ok(result.response.result.step_errors.every(error => !error));
    };
    const reload = async health => {
        await page.call('Page.reload');
        await until(() => page.evaluate(`typeof GameConfig !== 'undefined' && GameConfig.current.initialStats.health === ${health} && Boolean(currentTexts) && document.querySelectorAll('#choices-container button').length > 0`));
    };
    const custom = structuredClone(original);
    custom.initialStats = { money: 2500000, health: 83, wife: 62, threat: 7, rating: 48 };
    custom.difficulties.normal.gain = 1.4;
    custom.difficulties.normal.loss = 0.6;
    custom.difficulties.normal.shopPriceMultiplier = 1.25;
    custom.difficulties.normal.maxTurns = 44;
    custom.openingProtectedTurns = 4;
    custom.arcade = { escalationEvery: 5, escalationDivisor: 5, driftIncrement: 2 };
    custom.shop.cooldownIncrementDays = 4;
    custom.shop.cooldownDays = 2;
    custom.shop.perks.assuta_vip = { price: 450000, effects: { health: 17 } };
    custom.modes.blitzMaxTurns = 17;
    custom.modes.blitzDurations = [9000, 4000];
    custom.modes.blitzStepTurns = 4;
    try {
        await page.evaluate('state.health = 54; saveGuestGame()');
        await write(custom);
        await reload(83);
        assert.equal(await page.evaluate('state.health'), 54, 'reload keeps saved health, not configured initial health');
        await page.evaluate("resetGame('normal', 'arcade')");
        assert.deepEqual(await page.evaluate("Object.fromEntries(['money','health','wife','threat','rating'].map(key=>[key,state[key]]))"), custom.initialStats);
        assert.equal(await page.evaluate("Difficulty.effect(-10, 'health', 'normal')"), -6);
        assert.equal(await page.evaluate("Difficulty.effect(-10, 'threat', 'normal')"), -14);
        assert.equal(await page.evaluate('GameModes.maxTurns(state)'), 44);
        assert.equal(await page.evaluate("GameModes.maxTurns({mode:'blitz'})"), 17);
        assert.equal(await page.evaluate('GameModes.blitzDuration(5)'), 4000);
        const effects = await page.evaluate(`(() => {
            const s = {...GameConfig.current.initialStats, difficulty:'normal', mode:'arcade', day:10};
            Difficulty.applyChoice(s, {health:-10, threat:10});
            return [s.health,s.threat,s.rating,s.wife];
        })()`);
        assert.deepEqual(effects, [75,20,43,62]);
        await page.evaluate("state.health=40; buyPerk('assuta_vip')");
        assert.deepEqual(await page.evaluate('[state.health,state.money,state.cooldowns.assuta_vip,state.shopPrices.assuta_vip,state.purchaseCount.assuta_vip]'), [57,2050000,7,562500,1]);
        await until(() => page.evaluate('Boolean(navigator.serviceWorker.controller)'));
        await page.call('Network.enable');
        await page.call('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
        await reload(83);
        assert.equal(await page.evaluate('state.health'), 57);
        assert.equal(await page.evaluate('state.purchaseCount.assuta_vip'), 1);
        await page.evaluate("LocalEnvironment.storage.setItem('mayorGameConfig', '{broken')");
        await reload(90);
        assert.equal(await page.evaluate('state.health'), 57, 'offline fallback preserves the saved game');
    } finally {
        await page.call('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
        await write(original);
        await reload(90);
        await page.evaluate("resetGame('normal', 'arcade')");
    }
};
