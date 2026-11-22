(function (root) {
    let stats = { gamesPlayed: 0, maxMoney: 0, achievements: {} };

    function storage() {
        try {
            return root.LocalEnvironment ? root.LocalEnvironment.storage : root.localStorage;
        } catch {
            return null;
        }
    }

    root.GuestSession = {
        refreshDaily(state) {
            const saved = root.GuestStorage.loadGameState(storage());
            if (saved?.daily?.date === GameModes.dateKey()) {
                GameModes.remaining(state);
                state.daily.used = Math.max(state.daily.used, saved.daily.used);
            }
        },
        load(state) {
            const browserStorage = storage();
            const savedState = root.GuestStorage.loadGameState(browserStorage);
            if (savedState) {
                Object.assign(state, savedState);
                restoreDifficulty(savedState);
            }
            else if (typeof root.detectInitialLanguage === 'function') {
                state.lang = root.detectInitialLanguage(root.navigator?.language);
            }
            stats = root.GuestStorage.loadGuestStats(browserStorage);
            return Boolean(savedState);
        },
        save(state) {
            if (root.LocalEnvironment && !root.LocalEnvironment.isCurrent()) return;
            this.refreshDaily(state);
            const browserStorage = storage();
            root.GuestStorage.saveGameState(browserStorage, state);
            stats = root.GuestStorage.updateMaxMoney(browserStorage, state.money, state.mode);
        },
        recordGameOver(state) {
            if (root.LocalEnvironment && !root.LocalEnvironment.isCurrent()) return stats;
            stats = root.GuestStorage.recordGameOver(storage(), {
                money: state.money,
                mode: state.mode,
                endReason: state.endReason,
                unlockedAchievements: state.earnedAchievementsThisGame
            });
            root.GuestStorage.saveGameState(storage(), state);
            return stats;
        },
        getStats() {
            return stats;
        }
    };
})(window);
