const assert = require('node:assert/strict');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

module.exports = async function checkLayout(page) {
    for (const width of [320, 390, 479, 480, 768, 1280]) {
        await page.call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 480 });
        for (const lang of ['ru', 'en', 'uk', 'he']) {
            await page.evaluate(`setLang('${lang}')`);
            const layout = await page.evaluate(`(() => {
                const box = selector => { const r = document.querySelector(selector).getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom }; };
                return { nav: box('#game-nav'), indicators: box('#game-stats'), title: box('#game-nav h1'), language: box('#lang-toggle'),
                    audio: box('#btn-audio'), achievements: box('#btn-achievements'),
                    money: box('#stat-money'), shop: box('#btn-shop'), card: box('#event-card'),
                    panel: document.querySelector('#party-controls') ? box('#party-controls') : null,
                    stats: ['rating','health','threat','wife'].map(id => box('#stat-' + id)),
                    tiles: [...document.querySelectorAll('.stat-tile')].map(el => el.getBoundingClientRect().width),
                    party: ['btn-difficulty','btn-mode','profile-toggle'].map(id => document.getElementById(id)).filter(Boolean).map(el => box('#' + el.id)),
                    overflow: document.documentElement.scrollWidth > innerWidth, dir: document.documentElement.dir };
            })()`);
            const label = `${width}px ${lang}`;
            assert.equal(layout.overflow, false, `${label}: no horizontal overflow`);
            const system = [layout.title, layout.language, layout.audio, layout.achievements];
            assert.ok(Math.max(...system.map(r => r.y)) < Math.min(...system.map(r => r.bottom)), `${label}: system controls share one row`);
            assert.ok(layout.panel, `${label}: party controls are grouped`);
            assert.ok(Math.abs(layout.nav.x - layout.indicators.x) < 1 && Math.abs(layout.nav.width - layout.indicators.width) < 1, `${label}: header aligns with indicators`);
            assert.equal(layout.party[2].x < layout.party[0].x, lang !== 'he', `${label}: profile precedes difficulty and mode`);
            assert.ok(Math.max(...layout.party.map(r => r.y)) < Math.min(...layout.party.map(r => r.bottom)), `${label}: party controls share one row`);
            assert.ok(Math.max(...layout.tiles) - Math.min(...layout.tiles) < 1, `${label}: equal stat columns`);
            assert.ok(layout.card.y - layout.panel.bottom >= 12 && layout.card.y - layout.panel.bottom <= 16, `${label}: card gap is 12-16px`);
            assert.ok(layout.money.y < layout.shop.bottom && layout.shop.y < layout.money.bottom, `${label}: money and shop share one row`);
            assert.ok(Math.max(...layout.stats.map(r => r.y)) - Math.min(...layout.stats.map(r => r.y)) < 1, `${label}: four stats share one row`);
            assert.equal(layout.dir, lang === 'he' ? 'rtl' : 'ltr');
            assert.equal(layout.title.x < layout.language.x, lang !== 'he', `${label}: mirrored header`);
            if (process.env.MAYOR_LAYOUT_SCREENSHOTS && ((width === 390 && lang === 'he') || (width === 1280 && ['ru', 'en'].includes(lang)))) {
                mkdirSync(process.env.MAYOR_LAYOUT_SCREENSHOTS, { recursive: true });
                const screenshot = await page.call('Page.captureScreenshot', { format: 'png' });
                writeFileSync(path.join(process.env.MAYOR_LAYOUT_SCREENSHOTS, `layout-${width}-${lang}.png`), Buffer.from(screenshot.data, 'base64'));
            }
        }
    }
    await page.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await page.evaluate("setLang('ru')");
    await page.click('#profile-toggle');
    assert.equal(await page.evaluate("document.getElementById('account-controls').open"), true);
    await page.call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
    await page.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
    assert.equal(await page.evaluate("document.getElementById('account-controls').open"), false);
    const longName = await page.evaluate(`(() => {
        const name = document.getElementById('auth-account'), before = name.textContent;
        name.textContent = 'LongMayorName'.repeat(10);
        const result = { clipped: name.scrollWidth > name.clientWidth, ellipsis: getComputedStyle(name).textOverflow,
            overflow: document.documentElement.scrollWidth > innerWidth, length: name.textContent.length };
        name.textContent = before;
        return result;
    })()`);
    assert.deepEqual(longName, { clipped: true, ellipsis: 'ellipsis', overflow: false, length: 130 });
    await page.click('#profile-toggle');
    await page.click('#event-title');
    assert.equal(await page.evaluate("document.getElementById('account-controls').open"), false);
    await page.click('[aria-labelledby="label-health"]');
    assert.equal(await page.evaluate("document.querySelector('[aria-labelledby=label-health]').classList.contains('tooltip-open')"), true);
    await page.click('#event-title');
    assert.equal(await page.evaluate("document.querySelector('[aria-labelledby=label-health]').classList.contains('tooltip-open')"), false);
    await page.evaluate("document.querySelector('[aria-labelledby=label-health]').focus()");
    await page.call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab' });
    await page.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab' });
    assert.equal(await page.evaluate("document.activeElement.classList.contains('tooltip-open')"), true, 'keyboard focus opens the tooltip');
    await page.call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' });
    await page.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape' });
    assert.equal(await page.evaluate("document.querySelectorAll('.tooltip-open').length"), 0);
    await page.evaluate("state.mode = 'blitz'; updateUI()");
    assert.equal(await page.evaluate("document.getElementById('btn-shop').hidden && document.getElementById('btn-difficulty').hidden && getComputedStyle(document.getElementById('secondary-stats')).display === 'none'"), true);
    await page.evaluate("state.mode = 'arcade'; updateUI()");
    await page.call('Emulation.clearDeviceMetricsOverride');
};
