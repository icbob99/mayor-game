const assert = require('node:assert/strict');

module.exports = async function checkOpening(page) {
    assert.equal(await page.evaluate('AccountSession.isMayor()'), false);
    await page.evaluate("document.getElementById('auth-invite').close(); resetGame('normal','arcade')");
    // Use real cards loaded from the new SQL, in a possible non-repeating sequence.
    for (const [i, id] of ['shelters_budget', 'tama_38', 'bench_tender'].entries()) {
        await page.evaluate(`showEventAtIndex(gameLogicEvents.findIndex(e=>e.id==='${id}'),[0,1,2])`);
        await page.click('#choices-container button');
        assert.equal(await page.evaluate('state.gameOverRecorded'), false);
        assert.equal(await page.evaluate('state.day'), i + 2);
        if (i === 0) {
            assert.equal(await page.evaluate('state.money'), 2400000);
            assert.equal(await page.evaluate('state.threat'), 41);
            assert.equal(await page.evaluate('state.rating'), 27);
        }
    }
    assert.equal(await page.evaluate('state.rating'), 1);
    assert.equal(await page.evaluate('state.threat'), 93);
    await page.evaluate('window.beforeOpeningReload=true');
    await page.call('Page.reload');
    let ready = false;
    for (let i = 0; i < 100; i++) {
        ready = await page.evaluate("!window.beforeOpeningReload && typeof currentTexts!=='undefined' && Boolean(currentTexts) && state.day===4");
        if (ready) break;
        await new Promise(r=>setTimeout(r,200));
    }
    assert.equal(ready, true);
    assert.equal(await page.evaluate('state.gameOverRecorded'), false);
    await page.evaluate("showEventAtIndex(gameLogicEvents.findIndex(e=>e.id==='shelters_budget'),[0,1,2])");
    await page.click('#choices-container button');
    assert.equal(await page.evaluate('state.endReason'), 'arrest');
};
