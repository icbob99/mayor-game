const assert = require('node:assert/strict');
const { test } = require('node:test');
const storage = require('../app/guest-storage.js');

function createMemoryStorage(initial = {}) {
    const values = new Map(Object.entries(initial));
    return {
        getItem: key => values.has(key) ? values.get(key) : null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: key => values.delete(key)
    };
}

test('loads a valid guest game and preserves statistics separately', () => {
    const browserStorage = createMemoryStorage({
        mayorGameState: JSON.stringify({ day: 4, money: 1200000, wife: 50, threat: 15, health: 90, rating: 50, eventQueue: [], pendingChainEvents: [], lang: 'en' }),
        mayorGuestStats: JSON.stringify({ gamesPlayed: 2, maxMoney: 1500000, achievements: { survivor: 1 } })
    });

    assert.deepEqual(storage.loadGameState(browserStorage), { day: 4, money: 1200000, wife: 50, threat: 15, health: 90, rating: 50, eventQueue: [], pendingChainEvents: [], lang: 'en' });
    assert.deepEqual(storage.loadGuestStats(browserStorage), {
        gamesPlayed: 2, maxMoney: 1500000, achievements: { survivor: 1 }
    });
});

test('discards invalid game state and starts with empty statistics', () => {
    const browserStorage = createMemoryStorage({ mayorGameState: '{broken' });

    assert.equal(storage.loadGameState(browserStorage), null);
    assert.equal(browserStorage.getItem('mayorGameState'), null);
    assert.deepEqual(storage.loadGuestStats(browserStorage), {
        gamesPlayed: 0, maxMoney: 0, achievements: {}
    });
});

test('records completed games, maximum money and repeated achievements', () => {
    const browserStorage = createMemoryStorage();
    storage.recordGameOver(browserStorage, { money: 2000000, unlockedAchievements: ['survivor'] });
    storage.recordGameOver(browserStorage, { money: 1800000, unlockedAchievements: ['survivor', 'happy_wife'] });

    assert.deepEqual(storage.loadGuestStats(browserStorage), {
        gamesPlayed: 2,
        maxMoney: 2000000,
        achievements: { survivor: 2, happy_wife: 1 }
    });
});

test('updates maximum money before the guest finishes a game', () => {
    const browserStorage = createMemoryStorage();
    storage.updateMaxMoney(browserStorage, 1400000);
    storage.updateMaxMoney(browserStorage, 1200000);

    assert.equal(storage.loadGuestStats(browserStorage).maxMoney, 1400000);
});
