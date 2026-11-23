const { test } = require('node:test');
const assert = require('node:assert/strict');
const Stats = require('../app/game/statistics.js');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');

test('statistics offers only enabled modes and preserves totals and the selected mode', () => {
    const elements = new Map();
    const element = () => ({ value: '', setAttribute() {},
        replaceChildren(...children) { this.children = children; }, appendChild() {} });
    const stats = { byMode: { arcade: { gamesPlayed: 2 }, daily: { gamesPlayed: 3 }, blitz: { gamesPlayed: 4 } } };
    const b = vm.createContext({
        GameStats: Stats, ACHIEVEMENTS_DEF: [],
        currentTexts: { ui: { modes: { all: 'All', arcade: { name: 'Arcade' }, daily: { name: 'Daily' }, blitz: { name: 'Blitz' } } } },
        AccountSession: { isMayor: () => false, getStats: () => stats },
        GuestSession: { getStats: () => stats },
        document: { createElement: element, getElementById(id) {
            if (!elements.has(id)) elements.set(id, element());
            return elements.get(id);
        } }
    });
    for (const file of ['app/game/modes.js', 'app/ui/ui.js']) vm.runInContext(readFileSync(file, 'utf8'), b);
    for (const isMayor of [false, true]) {
        b.AccountSession.isMayor = () => isMayor;
        for (const dailyEnabled of [false, true]) {
            b.GameModes.settings.dailyEnabled = dailyEnabled;
            b.document.getElementById('stats-mode').value = 'all';
            b.renderGuestStats();
            const select = elements.get('stats-mode');
            assert.deepEqual(select.children.map(option => option.value),
                dailyEnabled ? ['all', 'arcade', 'daily', 'blitz'] : ['all', 'arcade', 'blitz']);
            assert.equal(elements.get('guest-stats-games').innerText, 9);
            select.value = 'blitz';
            b.renderGuestStats();
            assert.equal(select.value, 'blitz');
            assert.equal(elements.get('guest-stats-games').innerText, 4);
        }
    }
});

test('legacy totals become arcade statistics, with all achievements preserved', () => {
    const stats = Stats.normalize({ gamesPlayed: 3, maxMoney: 6000000, achievements: { survivor: 2 } });
    assert.equal(stats.byMode.arcade.gamesPlayed, 3);
    assert.equal(stats.byMode.daily.gamesPlayed, 0);
    assert.equal(stats.achievements.survivor, 2);
    assert.equal(Object.keys(stats.achievements).length, 5);
    assert.equal(stats.achievements.unsinkable, 0);
});

test('mode totals include resignation once and preserve achieved maximum during play', () => {
    let stats = Stats.normalize();
    stats = Stats.update(stats, { mode: 'blitz', money: 6000000 }, false);
    stats = Stats.update(stats, { mode: 'blitz', money: 5000000, endReason: 'resignation', achievements: { survivor: 1 } }, true);
    stats = Stats.update(stats, { mode: 'daily', money: 2000000, achievements: {} }, true);
    assert.equal(stats.gamesPlayed, 2);
    assert.equal(stats.resignations, 1);
    assert.equal(stats.maxMoney, 6000000);
    assert.equal(stats.byMode.blitz.gamesPlayed, 1);
    assert.equal(stats.byMode.daily.gamesPlayed, 1);
    assert.equal(stats.byMode.arcade.gamesPlayed, 0);
    assert.equal(stats.achievements.survivor, 1);
});
