const assert = require('node:assert/strict');
const { mkdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');

module.exports = async function checkRetirementUI(page) {
    const until=async expression=>{for(let i=0;i<100;i++){if(await page.evaluate(expression))return;await new Promise(r=>setTimeout(r,200));}throw Error('Retirement UI timed out: '+expression);};
    assert.equal(await page.evaluate('AccountSession.isMayor()'),false);
    for(const [mode,level,turn] of [['arcade','easy',60],['arcade','normal',50],['arcade','hard',40],['arcade','insane',30],['blitz','hard',25]]) {
        const health = level === 'easy' ? 80 : 20;
        await page.evaluate("document.getElementById('auth-invite').close()");
        await page.evaluate(`resetGame('${level}','${mode}')`);
        const count=await page.evaluate('GuestSession.getStats().gamesPlayed');
        await page.evaluate(`Object.assign(state,{day:${turn},health:${health},money:2000001,wife:50,threat:15,rating:50});
            showEventAtIndex(gameLogicEvents.findIndex(e=>e.id==='shitty_burger'),[0,1,2]);
            window.originalRetirementChoices=gameLogicEvents[state.currentEventIndex].choices;
            gameLogicEvents[state.currentEventIndex].choices=[{},{},{}]`);
        await page.click('#choices-container button');
        assert.equal(await page.evaluate('state.endReason'),'honorable_retirement');
        assert.equal(await page.evaluate('state.day'),turn);
        assert.equal(await page.evaluate('state.money'),2000001);
        assert.equal(await page.evaluate('GameModes.mayorScore(state)'),3000002);
        assert.equal(await page.evaluate('GuestSession.getStats().gamesPlayed'),count+1);
        assert.equal(await page.evaluate("state.earnedAchievementsThisGame.includes('unsinkable')"),health<=20);
        assert.equal(await page.evaluate("document.getElementById('end-bonus-achievement').hidden"),health>20);
        await page.evaluate('gameLogicEvents[state.currentEventIndex].choices=originalRetirementChoices');
    }
    const stats=await page.evaluate('JSON.stringify(GuestSession.getStats())');
    await page.evaluate("document.getElementById('auth-invite').close()");
    for(const [lang,width] of [['ru',390],['he',390],['en',1280],['uk',390]]) {
        await page.evaluate(`setLang('${lang}')`);
        await page.call('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:width<480});
        assert.equal(await page.evaluate("document.getElementById('game-over-title').textContent===currentTexts.ui.end_victory"),true);
        assert.equal(await page.evaluate("document.getElementById('end-stat-title').textContent===currentTexts.ui.titles.honorable_retirement"),true);
        assert.equal(await page.evaluate('document.documentElement.dir'),lang==='he'?'rtl':'ltr');
        assert.equal(await page.evaluate('document.documentElement.scrollWidth<=innerWidth'),true);
        if(process.env.MAYOR_RETIREMENT_SCREENSHOTS){mkdirSync(process.env.MAYOR_RETIREMENT_SCREENSHOTS,{recursive:true});const shot=await page.call('Page.captureScreenshot',{format:'png'});writeFileSync(path.join(process.env.MAYOR_RETIREMENT_SCREENSHOTS,lang+'.png'),Buffer.from(shot.data,'base64'));}
    }
    await page.evaluate('window.beforeRetirementReload=true');await page.call('Page.reload');
    await until("!window.beforeRetirementReload && typeof currentTexts!=='undefined' && Boolean(currentTexts) && state.gameOverRecorded");
    assert.equal(await page.evaluate('state.endReason'),'honorable_retirement');
    assert.equal(await page.evaluate('GameModes.mayorScore(state)'),3000002);
    assert.equal(await page.evaluate('JSON.stringify(GuestSession.getStats())'),stats);
    await page.evaluate("resetGame('normal','arcade')");
    await page.evaluate("Object.assign(state,{day:50,threat:69});gameLogicEvents[state.currentEventIndex].choices=[{}];applyChoice(0)");
    assert.equal(await page.evaluate('state.gameOverRecorded'),false);
    assert.equal(await page.evaluate('state.day'),51);
    await page.evaluate("gameLogicEvents[state.currentEventIndex].choices=[{threat:-5}];applyChoice(0)");
    assert.equal(await page.evaluate('state.endReason'),'honorable_retirement');
    await page.evaluate("resetGame('normal','arcade')");
    await page.evaluate("Object.assign(state,{day:50,health:1});gameLogicEvents[state.currentEventIndex].choices=[{health:-100}];applyChoice(0)");
    assert.equal(await page.evaluate('state.endReason'),'heart_attack');
    assert.equal(await page.evaluate("document.getElementById('end-score-bonus').hidden"),true);
    await page.call('Emulation.clearDeviceMetricsOverride');
};
