const assert = require('node:assert/strict');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

module.exports = async function checkAudioUI(page) {
    async function until(expression) {
        for (let i = 0; i < 120; i++) { if (await page.evaluate(expression)) return; await new Promise(r => setTimeout(r, 250)); }
        throw Error('Audio condition timed out: ' + expression);
    }
    assert.deepEqual(await page.evaluate('AudioSettings.get()'), { musicEnabled: true, musicVolume: 25, sfxEnabled: true, sfxVolume: 70 });
    assert.equal(await page.evaluate('audioCtx.state'), 'suspended', 'browser blocks music before a gesture');
    await page.evaluate(`window.audioSources=[]; window.originalCreateSource=audioCtx.createBufferSource.bind(audioCtx);
        audioCtx.createBufferSource=()=>{const source=originalCreateSource(); audioSources.push(source); return source;}`);
    await page.click('#btn-audio');
    await until("audioCtx.state==='running' && audioSources.length>0 && audioSources.at(-1).buffer.duration>10");
    await page.evaluate('window.themeBuffer=audioSources.at(-1).buffer');
    assert.equal(await page.evaluate("document.getElementById('audio-modal').open"), true);
    for (const [width, lang] of [[390, 'ru'], [390, 'he'], [1280, 'en'], [390, 'uk']]) {
        await page.call('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width < 480 });
        await page.evaluate(`setLang('${lang}')`);
        assert.equal(await page.evaluate("document.getElementById('audio-title').textContent===currentTexts.ui.audio.title"), true);
        assert.equal(await page.evaluate("document.documentElement.dir"), lang === 'he' ? 'rtl' : 'ltr');
        assert.equal(await page.evaluate("(()=>{const r=document.getElementById('audio-modal').getBoundingClientRect();return r.x>=0&&r.right<=innerWidth&&document.documentElement.scrollWidth<=innerWidth})()"), true);
        if (process.env.MAYOR_AUDIO_SCREENSHOTS) {
            mkdirSync(process.env.MAYOR_AUDIO_SCREENSHOTS, { recursive: true });
            const shot = await page.call('Page.captureScreenshot', { format: 'png' });
            writeFileSync(path.join(process.env.MAYOR_AUDIO_SCREENSHOTS, `audio-${width}-${lang}.png`), Buffer.from(shot.data, 'base64'));
        }
    }
    await page.click('#audio-music-toggle'); await page.click('#audio-sfx-toggle');
    assert.equal(await page.evaluate("document.getElementById('audio-icon').textContent"), '🔇');
    await page.evaluate("document.getElementById('audio-music-volume').value=33; document.getElementById('audio-music-volume').dispatchEvent(new Event('input',{bubbles:true}))");
    assert.equal(await page.evaluate("JSON.parse(LocalEnvironment.storage.getItem('mayorAudioSettings')).musicVolume"), 33);
    await page.click('#audio-music-toggle'); await page.click('#audio-close');
    await page.evaluate('window.beforeAudioModes=structuredClone(state)');
    await page.evaluate("selectMode('blitz')");
    await until('audioSources.at(-1).buffer!==themeBuffer');
    await page.evaluate("GameModes.settings.dailyEnabled=true; selectMode('daily')");
    await until('audioSources.at(-1).buffer===themeBuffer');
    await page.evaluate("stopBlitzTurn(); GameModes.settings.dailyEnabled=false; Object.assign(state,beforeAudioModes); saveGuestGame(); restoreCurrentEvent(); updateUI()");
    await page.evaluate('window.beforeAudioReload=true'); await page.call('Page.reload');
    await until("!window.beforeAudioReload && typeof currentTexts!=='undefined' && Boolean(currentTexts?.ui.audio) && gameLogicEvents.length===41");
    assert.equal(await page.evaluate('AudioSettings.get().musicVolume'), 33);
    assert.equal(await page.evaluate('AudioSettings.get().sfxEnabled'), false);
    assert.equal(await page.evaluate('audioCtx.state'), 'suspended');
    await page.click('#btn-audio'); await until("audioCtx.state==='running'");
    assert.equal(await page.evaluate("document.getElementById('audio-music-volume').value"), '33');
    await page.evaluate("AudioSettings.set({musicEnabled:true,musicVolume:25,sfxEnabled:true,sfxVolume:70}); toggleAudio(false); setLang('en')");
    await page.call('Emulation.clearDeviceMetricsOverride');
};
