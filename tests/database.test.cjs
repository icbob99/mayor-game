const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = readFileSync(path.join(__dirname, '../app/data/dal.js'), 'utf8');
const languages = ['ru', 'en', 'uk', 'he'];
const text = value => ({ type: 'text', value });
const integer = value => ({ type: 'integer', value: String(value) });
const nil = { type: 'null' };
const table = (columns, rows) => ({ type: 'ok', response: { type: 'execute', result: {
    cols: columns.split(' ').map(name => ({ name })), rows
} } });

function rawData() {
    return { results: [
        table('id avatar is_follow_up repeat_policy max_occurrences', [
            [text('tender'), text('city'), integer(0), text('unlimited'), nil],
            [text('audit'), text('police'), integer(1), text('once'), integer(1)]
        ]),
        table('event_id choice_index money wife health threat rating next_event_id delay_days', [
            [text('audit'), integer(0), integer(-500), integer(0), integer(-1), integer(-10), integer(5), nil, nil],
            [text('tender'), integer(0), integer(1000), integer(2), integer(-3), { type: 'float', value: 2.5 }, integer(-5), text('audit'), integer(3)],
            [text('tender'), integer(1), integer(0), integer(0), integer(0), integer(0), integer(10), nil, nil]
        ]),
        table('lang ui alerts', languages.map(lang =>
            [text(lang), text(JSON.stringify({ money: lang + ' money' })), text('{"arrest":"Stop"}')]
        )),
        table('event_id lang title description', languages.flatMap(lang => [
            [text('audit'), text(lang), text(lang + ' audit'), text('Investigation')],
            [text('tender'), text(lang), text(lang + ' tender'), text('Contract')]
        ])),
        table('event_id choice_index lang text', languages.flatMap(lang => [
            [text('tender'), integer(1), text(lang), text(lang + ' refuse')],
            [text('audit'), integer(0), text(lang), text(lang + ' pay')],
            [text('tender'), integer(0), text(lang), text(lang + ' accept')]
        ])),
        { type: 'ok', response: { type: 'close' } }
    ] };
}

function load(fetchRawGameData) {
    return vm.runInNewContext(source + '\nloadGameData()', { fetchRawGameData });
}

test('DAL converts Worker tables into events, effects, chains and localized choices', async () => {
    const data = await load(async () => rawData());
    assert.deepEqual(structuredClone(data), {
        events: [
            { id: 'tender', avatar: 'city', isFollowUp: false, repeatPolicy: 'unlimited', maxOccurrences: null, choices: [
                { money: 1000, wife: 2, health: -3, threat: 2.5, rating: -5, nextEvent: { id: 'audit', delay: 3 } },
                { money: 0, wife: 0, health: 0, threat: 0, rating: 10 }
            ] },
            { id: 'audit', avatar: 'police', isFollowUp: true, repeatPolicy: 'once', maxOccurrences: 1, choices: [
                { money: -500, wife: 0, health: -1, threat: -10, rating: 5 }
            ] }
        ],
        locales: Object.fromEntries(languages.map(lang => [lang, {
            ui: { money: lang + ' money' }, alerts: { arrest: 'Stop' }, events: {
                tender: { title: lang + ' tender', desc: 'Contract', choices: [lang + ' accept', lang + ' refuse'] },
                audit: { title: lang + ' audit', desc: 'Investigation', choices: [lang + ' pay'] }
            }
        }]))
    });
});

test('DAL propagates data source failures', async () => {
    const error = new Error('Connection lost');
    await assert.rejects(load(async () => { throw error; }), actual => actual === error);
});

test('DAL rejects failed queries and incomplete game data', async () => {
    for (const [change, expected] of [
        [raw => { raw.results.pop(); }, /Invalid Turso response/],
        [raw => { raw.results[0] = { type: 'error', error: { message: 'Query failed' } }; }, /Query failed/],
        [raw => { raw.results[0].response.result.rows = []; }, /no playable events/],
        [raw => { raw.results[2].response.result.rows.pop(); }, /Incomplete game data for he/],
        [raw => { raw.results[4].response.result.rows.pop(); }, /Incomplete game data for he/]
    ]) {
        const raw = rawData();
        change(raw);
        await assert.rejects(load(async () => raw), expected);
    }
});
