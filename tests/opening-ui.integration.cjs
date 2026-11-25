const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');

module.exports = async function checkOpening(page) {
    assert.equal(await page.evaluate('AccountSession.isMayor()'), false);
    const fields = ['money', 'wife', 'health', 'threat', 'rating'];
    const expected = {};
    let eventId;
    for (const line of readFileSync(path.join(__dirname, '../docs/game-balance.md'), 'utf8').split(/\r?\n/)) {
        const heading = line.match(/^#{3,6} `?([a-z0-9_]+)`? - /);
        if (heading) { eventId = heading[1]; expected[eventId] = []; }
        const cells = line.split(/(?<!\\)\|/).slice(1, -1).map(cell => cell.trim());
        if (cells.length === 9 && /^\d+$/.test(cells[0])) {
            expected[eventId][Number(cells[0]) - 1] = fields.map((_, i) => Number(cells[i + 2].replace(/\s/g, '')));
        }
    }
    assert.equal(Object.keys(expected).length, 41);
    assert.equal(Object.values(expected).flat().length, 123);
    const loaded = await page.evaluate(`Object.fromEntries(gameLogicEvents.map(event => [event.id,
        event.choices.map(choice => ${JSON.stringify(fields)}.map(field => choice[field]))]))`);
    assert.deepEqual(loaded, expected, 'all 615 effects from Worker/DB match the manual Markdown');
    await page.evaluate("document.getElementById('auth-invite').close(); resetGame('normal','arcade')");
    // Use the manual author cards, in a possible non-repeating sequence.
    for (const [i, id] of ['shelters_budget', 'tama_38', 'bench_tender'].entries()) {
        await page.evaluate(`showEventAtIndex(gameLogicEvents.findIndex(e=>e.id==='${id}'),[0,1,2])`);
        await page.click('#choices-container button');
        assert.equal(await page.evaluate('state.gameOverRecorded'), false);
        assert.equal(await page.evaluate('state.day'), i + 2);
        if (i === 0) {
            assert.equal(await page.evaluate('state.money'), 2200000);
            assert.equal(await page.evaluate('state.threat'), 37);
            assert.equal(await page.evaluate('state.rating'), 35);
        }
    }
    assert.equal(await page.evaluate('state.rating'), 5);
    assert.equal(await page.evaluate('state.threat'), 79);
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
