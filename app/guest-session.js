(function (root) {
    let stats = { gamesPlayed: 0, maxMoney: 0, achievements: {} };

    function storage() {
        try {
            return root.localStorage;
        } catch {
            return null;
        }
    }

    root.GuestSession = {
        load(state) {
            const browserStorage = storage();
            const savedState = root.GuestStorage.loadGameState(browserStorage);
            if (savedState) Object.assign(state, savedState);
            else if (typeof root.detectInitialLanguage === 'function') {
                state.lang = root.detectInitialLanguage(root.navigator?.language);
            }
            stats = root.GuestStorage.loadGuestStats(browserStorage);
            return Boolean(savedState);
        },
        save(state) {
            const browserStorage = storage();
            root.GuestStorage.saveGameState(browserStorage, state);
            stats = root.GuestStorage.updateMaxMoney(browserStorage, state.money);
        },
        recordGameOver(state) {
            stats = root.GuestStorage.recordGameOver(storage(), {
                money: state.money,
                unlockedAchievements: state.earnedAchievementsThisGame
            });
            root.GuestStorage.clearGameState(storage());
            return stats;
        },
        getStats() {
            return stats;
        }
    };
})(window);
