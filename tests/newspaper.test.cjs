const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readUnit } = require('./unit-source.cjs');

test('newspaper is optional when old HTML is cached', async () => {
    const { clearNewspaper, renderNewspaper } = await import('../app/ui/newspaper.js');
    const previous = globalThis.document;
    try {
        globalThis.document = { getElementById: () => null };
        assert.doesNotThrow(clearNewspaper);
        await assert.doesNotReject(renderNewspaper({}, {}, ''));
    } finally { globalThis.document = previous; }
});

test('newspaper stays hidden when the cached locale has no newspaper translations', async () => {
    const { renderNewspaper } = await import('../app/ui/newspaper.js');
    const previous = globalThis.document;
    try {
        const section = { hidden: false };
        const element = { hidden: false, removeAttribute() {} };
        globalThis.document = { getElementById: id => id === 'newspaper-section' ? section : element };
        await assert.doesNotReject(renderNewspaper({}, {}, ''));
        assert.equal(section.hidden, true);
    } finally { globalThis.document = previous; }
});

test('existing controls still initialize with cached pre-newspaper markup', () => {
    let existingControls = 0;
    const context = { document: { getElementById: id => ['newspaper-section', 'btn-share-result', 'btn-download-newspaper', 'newspaper-language'].includes(id) ? null : { addEventListener() { existingControls++; } } } };
    vm.createContext(context);
    vm.runInContext(readUnit('app/ui/controls.js'), context);
    assert.doesNotThrow(() => context.initializeControls());
    assert.ok(existingControls > 20);
});

test('newspaper model uses localized values, elapsed days and victory status', async () => {
    const { createNewspaperModel } = await import('../app/ui/newspaper.js');
    const ui = { newspaper_name:'עיתון', newspaper_edition:'מיוחד', newspaper_headlines:{honorable_retirement:'ניצחון',resignation:'פרישה'},
        newspaper_stamps:{victory:'ניצחון',fled:'בריחה',defeat:'חדשות'}, newspaper_day:'יום {day} מתוך {max}', newspaper_day_unlimited:'יום {day}',
        newspaper_currency:'ש"ח', newspaper_share_text:'{headline}\n{days}\n{money}\n{title}',
        difficulty:{normal:{name:'רגיל'}},modes:{arcade:{name:'ארקייד'}} };
    const state = {lang:'he',day:60,money:1234567,difficulty:'normal',mode:'arcade',endReason:'honorable_retirement',finishedAt:1700000000000};
    const result = createNewspaperModel(state, ui, 'ראש העיר', 'https://example.org/game/');
    assert.equal(result.direction,'rtl'); assert.equal(result.days,'יום 60');
    assert.equal(result.stamp,ui.newspaper_stamps.victory); assert.equal(result.victory,true);
    assert.ok(result.money.includes('ש"ח')); assert.ok(result.money.includes('\u200f'));
    assert.ok(!/[a-z]/i.test(result.shareText)); assert.equal(result.url,'https://example.org/game/');
    const resigned = createNewspaperModel({...state,endReason:'resignation'},ui,'ראש העיר',result.url);
    assert.equal(resigned.victory,false); assert.equal(resigned.stamp,ui.newspaper_stamps.fled);
    assert.equal(resigned.days,'יום 60');
});

test('Canvas fitting retains long Hebrew and English text inside its box', async () => {
    const { fitText } = await import('../app/ui/newspaper-canvas.js');
    const ctx = {font:'',measureText(text){return {width:[...text].length * parseFloat(this.font.match(/([\d.]+)px/)[1]) * .65};}};
    for(const text of ['HONORABLE RETIREMENT! LEFT UNDEFEATED '.repeat(3), 'ראש העיר הנצחי תסמונת טדי קולק וחולדאי '.repeat(3),'x'.repeat(150)]) {
        const fit=fitText(ctx,text,500,120,52);
        assert.ok(fit.lines.length*fit.lineHeight<=120);
        assert.ok(fit.lines.every(line=>ctx.measureText(line).width<=500));
        assert.equal(fit.lines.join('').replace(/\s/g,''),text.replace(/\s/g,''));
    }
});

test('file sharing preserves payload and quietly handles cancellation', async () => {
    const { shareResult } = await import('../app/infrastructure/result-sharing.js');
    const file = new File(['png'],'mayor-game-result.png',{type:'image/png'});
    let payload;
    const browser={navigator:{canShare:({files})=>files[0]===file,share:async data=>{payload=data;}}};
    const result={file,name:'Gazette',shareText:'Result',url:'https://example.org/game/'};
    assert.equal(await shareResult(result,browser),'shared');
    assert.deepEqual(payload,{files:[file],title:'Gazette',text:'Result\nhttps://example.org/game/'});
    browser.navigator.share=async()=>{throw new DOMException('cancelled','AbortError');};
    assert.equal(await shareResult(result,browser),'cancelled');
});

test('desktop fallback downloads PNG and reports clipboard failure honestly', async () => {
    const { shareResult } = await import('../app/infrastructure/result-sharing.js');
    let downloaded=false,copied='',removed=0;
    const browser={navigator:{clipboard:{writeText:async text=>{copied=text;}}},URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},setTimeout(fn){fn();},
        document:{body:{appendChild(){}},activeElement:null,createElement(tag){return {style:{},click(){downloaded=true;},remove(){removed++;},select(){},setAttribute(){}};},execCommand:()=>false}};
    const result={file:new File(['png'],'mayor-game-result.png',{type:'image/png'}),shareText:'result',url:'https://example.org/'};
    assert.equal(await shareResult(result,browser),'copied'); assert.equal(downloaded,true); assert.equal(copied,'result\nhttps://example.org/');
    browser.navigator.clipboard.writeText=async()=>{throw Error('denied');};
    assert.equal(await shareResult(result,browser),'downloaded'); assert.ok(removed>=3);
    browser.document.execCommand=()=>true;
    assert.equal(await shareResult(result,browser),'copied');
});
