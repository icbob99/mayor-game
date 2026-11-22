const { test } = require('node:test');
const assert = require('node:assert/strict');
const Stats = require('../app/game/statistics.js');

test('legacy totals become arcade statistics, with all achievements preserved', () => {
    const stats = Stats.normalize({ gamesPlayed: 3, maxMoney: 6000000, achievements: { survivor: 2 } });
    assert.equal(stats.byMode.arcade.gamesPlayed, 3);
    assert.equal(stats.byMode.daily.gamesPlayed, 0);
    assert.equal(stats.achievements.survivor, 2);
    assert.equal(Object.keys(stats.achievements).length, 4);
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
