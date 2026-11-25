const GameConfig = require('../app/game/config.js').GameConfig;
GameConfig.use(GameConfig.fallback);
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readUnit: readFileSync } = require('./unit-source.cjs');
const Modes = require('../app/game/modes.js').GameModes;
const Difficulty = require('../app/game/difficulty.js').Difficulty;
const healthy = (level = 'normal', mode = 'arcade') => ({ day: 1, difficulty: level, mode, money: 1000001, health: 90, wife: 50, rating: 50, threat: 15 });

test('retirement thresholds apply after the final decision, with no cap for hidden Daily', () => {
    for (const [level, limit] of Object.entries({easy:60,normal:50,hard:40,insane:30})) {
        const s = healthy(level); s.day = limit - 1;
        assert.equal(Modes.maxTurns(s), limit);
        assert.equal(Modes.retirement(s), null);
        s.day++; assert.equal(Modes.retirement(s), 'honorable_retirement');
        s.mode = 'blitz'; assert.equal(Modes.maxTurns(s), 25);
        s.day = 24; assert.equal(Modes.retirement(s), null);
        s.day = 25; assert.equal(Modes.retirement(s), 'honorable_retirement');
    }
    const daily = {...healthy(),mode:'daily',day:500};
    assert.equal(Modes.retirement(daily), null);
});

test('victory requires threat below 70, and Insane wife/rating below 70', () => {
    for (const [stat, value] of [['health',0],['wife',0],['rating',0],['threat',70],['threat',100]]) {
        assert.equal(Modes.retirement({...healthy(),day:50,[stat]:value}),null);
    }
    for (const stat of ['wife','rating']) {
        assert.equal(Modes.retirement({...healthy('insane'),day:30,[stat]:70}),null);
        assert.equal(Modes.retirement({...healthy('insane'),day:30,[stat]:69}), 'honorable_retirement');
    }
    assert.equal(Modes.retirement({...healthy(),day:50,threat:69}), 'honorable_retirement');
    assert.equal(Modes.retirement({...healthy(),day:50,wife:100,rating:100}), 'honorable_retirement');
});

test('score bonus is derived once without changing money; other endings have no bonus', () => {
    const s = {...healthy(),endReason:'honorable_retirement'};
    assert.equal(Modes.mayorScore(s),1500002);
    assert.equal(Modes.mayorScore(s),1500002);
    assert.equal(s.money,1000001);
    for(const reason of ['resignation','arrest',null]) assert.equal(Modes.mayorScore({...s,endReason:reason}),1000001);
});

function eventHarness(s, choice = {}) {
    const b = {state:{...s,currentEventIndex:0,eventQueue:[],gameOverRecorded:false}, GameModes:Modes, Difficulty,
        AccountSession:{canPlay:()=>true}, gameLogicEvents:[{choices:[choice]}],
        stopBlitzTurn(){}, checkAchievements(){}, loadNextEvent(){b.next=true;}, saveGuestGame(){},
        blitzClock:{tick:()=>false}, triggerGameOver(reason){b.ending=reason;b.state.gameOverRecorded=true;}};
    vm.createContext(b);vm.runInContext(readFileSync('app/game/events.js','utf8'),b);
    b.loadNextEvent=()=>{b.next=true;};
    return b;
}
test('event pipeline completes exactly N decisions and never draws another card after victory', () => {
    const b = eventHarness({...healthy(),day:49});
    b.applyChoice(0); assert.equal(b.ending,undefined);assert.equal(b.state.day,50);
    b.next=false;b.applyChoice(0);assert.equal(b.ending,'honorable_retirement');assert.equal(b.state.day,50);assert.equal(b.next,false);
    b.applyChoice(0);assert.equal(b.state.day,50);
});
test('final card defeat and final passive drift take priority over retirement', () => {
    const card=eventHarness({...healthy(),day:50,health:1},{health:-50});
    card.applyChoice(0);assert.equal(card.ending,'heart_attack');
    const drift=eventHarness({...healthy(),day:50,threat:99});
    drift.applyChoice(0);assert.equal(drift.ending,'arrest');
});

test('a surviving game continues past the threshold until retirement conditions are met', () => {
    const b = eventHarness({...healthy(),day:50,threat:69});
    b.applyChoice(0);
    assert.equal(b.state.threat,75); assert.equal(b.ending,undefined); assert.equal(b.state.day,51);
    b.gameLogicEvents[0].choices[0]={threat:-12};
    b.applyChoice(0);
    assert.equal(b.ending,'honorable_retirement'); assert.equal(b.state.day,51);
});

test('ending awards Unsinkable before persistence and never counts a restored ending twice', () => {
    const elements = new Map(); let records = 0, saved;
    const b = {GameConfig, GameModes:Modes, console, stopBlitzTurn(){},updateUI(){},inviteGuest(){},
        testTexts:{ui:{titles:{honorable_retirement:'Eternal Mayor'},achievements:{unsinkable:{name:'Unsinkable'}},end_victory:'Retired',end_score:'Score',end_score_bonus:'Capital x1.5'},alerts:{}},
        AccountSession:{isMayor:()=>false},
        GuestSession:{recordGameOver(s){records++;saved=JSON.parse(JSON.stringify(s));return {gamesPlayed:1};}},
        document:{getElementById(id){if(!elements.has(id))elements.set(id,{classList:{remove(){},toggle(){}}});return elements.get(id);}}};
    vm.createContext(b);
    for(const file of ['app/game/game-state.js','app/game/achievements.js','app/game/game-over.js']) vm.runInContext(readFileSync(file,'utf8'),b);
    b.showAchievementToast=()=>{};
    vm.runInContext('currentTexts=testTexts;Object.assign(state,{day:50,health:10,money:1000001});triggerGameOver("honorable_retirement");triggerGameOver("honorable_retirement");renderGameOver()',b);
    assert.equal(records,1);
    assert.ok(saved.earnedAchievementsThisGame.includes('unsinkable'));
    assert.equal(saved.money,1000001);
    assert.equal(elements.get('end-stat-score').innerText,(1500002).toLocaleString());
    assert.equal(elements.get('end-bonus-achievement').hidden,false);
    for(const [health,reason,expected] of [[0,'honorable_retirement',false],[1,'honorable_retirement',true],[20,'honorable_retirement',true],[21,'honorable_retirement',false],[20,'resignation',false],[5,'arrest',false],[0,'heart_attack',false]]) {
        assert.equal(vm.runInContext(`ACHIEVEMENTS_DEF.find(a=>a.id==='unsinkable').req({gameOverRecorded:true,endReason:'${reason}',health:${health}})`,b),expected);
    }
});
