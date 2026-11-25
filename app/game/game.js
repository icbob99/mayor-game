import { loadGameConfig } from '../data/config-storage.js';
import { loadGameData } from '../data/dal.js';
import { AccountSession } from './account-session.js';
import { AudioSettings } from './audio-settings.js';
import { GameConfig } from './config.js';
import { restoreCurrentEvent } from './events.js';
import { resetGame, triggerGameOver } from './game-over.js';
import { gameLocales, resetStartingStats, restoreDifficulty, setGameData, state } from './game-state.js';
import { GuestSession } from './guest-session.js';
import { GameModes } from './modes.js';
import { LocalEnvironment } from '../infrastructure/environment.js';
import { initializeAudio, startBgMusic } from '../ui/audio.js';
import { detectInitialLanguage, getStartupTexts } from '../ui/language-utils.js';
import { initializeLanguageSelector, setLang } from '../ui/language.js';
import { showStartupFailure } from '../ui/startup.js';
import { initializeHeaderControls, saveGuestGame } from '../ui/ui.js';

async function startGame() {
    state.lang = detectInitialLanguage(navigator.language);
    initializeLanguageSelector();
    initializeHeaderControls();
    await setLang(state.lang);
    try {
        if (typeof LocalEnvironment !== 'undefined') await LocalEnvironment.ready;
        initializeAudio();
        const [data, config] = await Promise.all([loadGameData(), loadGameConfig()]);
        GameConfig.use(config);
        resetStartingStats();
        await AccountSession.init();
        if (AccountSession.isMayor()) {
            const saved = AccountSession.loadGame();
            if (saved) { Object.assign(state, saved); restoreDifficulty(saved); }
            state.currentEventIndex = -1;
        } else GuestSession.load(state);
        await setLang(state.lang);
        AudioSettings.migrateLegacy(state.audioMuted);
        startBgMusic();
        setGameData(data);
        if (!gameLocales[state.lang]) state.lang = 'en';
        await setLang(state.lang);
        if (!GameModes.available(state.mode)) await resetGame(state.difficulty, 'arcade');
        else if (state.gameOverRecorded) triggerGameOver(state.endReason);
        else restoreCurrentEvent();
        saveGuestGame();
    } catch (error) {
        console.error(getStartupTexts(state.lang).loadFailed, error);
        showStartupFailure();
    }
}

export { startGame };
