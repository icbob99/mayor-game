import { GuestStorage } from '../data/guest-storage.js';
import { restoreDifficulty } from './game-state.js';
import { GameModes } from './modes.js';
import { LocalEnvironment } from '../infrastructure/environment.js';
import { detectInitialLanguage } from '../ui/language-utils.js';

let stats = { gamesPlayed: 0, maxMoney: 0, achievements: {} };

function storage() {
    try {
        return LocalEnvironment ? LocalEnvironment.storage : window.localStorage;
    } catch {
        return null;
    }
}

const GuestSession = {
    refreshDaily(state) {
        const saved = GuestStorage.loadGameState(storage());
        if (saved?.daily?.date === GameModes.dateKey()) {
            GameModes.remaining(state);
            state.daily.used = Math.max(state.daily.used, saved.daily.used);
        }
    },
    load(state) {
        const browserStorage = storage();
        const savedState = GuestStorage.loadGameState(browserStorage);
        if (savedState) {
            Object.assign(state, savedState);
            restoreDifficulty(savedState);
        }
        else if (typeof detectInitialLanguage === 'function') {
            state.lang = detectInitialLanguage(window.navigator?.language);
        }
        stats = GuestStorage.loadGuestStats(browserStorage);
        return Boolean(savedState);
    },
    save(state) {
        if (LocalEnvironment && !LocalEnvironment.isCurrent()) return;
        this.refreshDaily(state);
        const browserStorage = storage();
        GuestStorage.saveGameState(browserStorage, state);
        stats = GuestStorage.updateMaxMoney(browserStorage, state.money, state.mode);
    },
    recordGameOver(state) {
        if (LocalEnvironment && !LocalEnvironment.isCurrent()) return stats;
        stats = GuestStorage.recordGameOver(storage(), {
            money: state.money,
            mode: state.mode,
            endReason: state.endReason,
            unlockedAchievements: state.earnedAchievementsThisGame
        });
        GuestStorage.saveGameState(storage(), state);
        return stats;
    },
    getStats() {
        return stats;
    }
};

export { GuestSession };
