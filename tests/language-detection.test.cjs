const assert = require('node:assert/strict');
const { detectInitialLanguage, getTextDirection } = require('../app/ui/language-utils.js');
const { runInNewContext } = require('node:vm');
const { readUnit } = require('./unit-source.cjs');

assert.equal(detectInitialLanguage('uk-UA'), 'uk');
assert.equal(detectInitialLanguage('ru-RU'), 'ru');
assert.equal(detectInitialLanguage('he-IL'), 'he');
assert.equal(detectInitialLanguage('de-DE'), 'en');
assert.equal(detectInitialLanguage(''), 'en');

const directions = [['he', 'rtl'], ['he-IL', 'rtl'], ['ar', 'rtl'], ['ar-EG', 'rtl'],
    ['fa', 'rtl'], ['ru', 'ltr'], ['en', 'ltr'], ['uk', 'ltr']];
for (const [lang, direction] of directions) assert.equal(getTextDirection(lang), direction, lang);

// Exercise both browser API generations, regardless of the Node version running this test.
const info = lang => {
    const locale = new Intl.Locale(lang);
    return locale.getTextInfo ? locale.getTextInfo() : locale.textInfo;
};
for (const Locale of [
    class { constructor(lang) { this.lang = lang; } getTextInfo() { return info(this.lang); } },
    class { constructor(lang) { this.lang = lang; } get textInfo() { return info(this.lang); } }
]) {
    const context = { Intl: { Locale } };
    runInNewContext(readUnit('app/ui/language-utils.js'), context);
    for (const [lang, direction] of directions) assert.equal(context.getTextDirection(lang), direction, lang);
}

console.log('language detection and native/legacy text direction checks passed');
