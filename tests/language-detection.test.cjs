const assert = require('node:assert/strict');
const { detectInitialLanguage } = require('../app/language-utils.js');

assert.equal(detectInitialLanguage('uk-UA'), 'uk');
assert.equal(detectInitialLanguage('ru-RU'), 'ru');
assert.equal(detectInitialLanguage('he-IL'), 'he');
assert.equal(detectInitialLanguage('de-DE'), 'en');
assert.equal(detectInitialLanguage(''), 'en');

console.log('language-detection tests: 5 passed');
