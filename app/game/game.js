let gameDataLoadFailed = false;

function renderStartupStatus() {
    const texts = getStartupTexts(state.lang);
    document.getElementById('event-title').innerText = gameDataLoadFailed ? texts.loadFailed : texts.loading;
    document.getElementById('event-desc').innerText = gameDataLoadFailed ? texts.reload : '';
}

window.onload = async () => {
    state.lang = detectInitialLanguage(navigator.language);
    initializeLanguageSelector();
    await setLang(state.lang);
    try {
        if (typeof LocalEnvironment !== 'undefined') await LocalEnvironment.ready;
        await AccountSession.init();
        if (AccountSession.isMayor()) {
            const saved = AccountSession.loadGame();
            if (saved) Object.assign(state, saved);
            state.currentEventIndex = -1;
        } else GuestSession.load(state);
        await setLang(state.lang);
        if (typeof applyAudioPreference === 'function') {
            applyAudioPreference(Boolean(state.audioMuted));
        }
        const data = await loadGameData();
        gameLogicEvents = data.events;
        gameLocales = data.locales;
        if (!gameLocales[state.lang]) state.lang = 'en';
        await setLang(state.lang);
        if (AccountSession.isMayor() && state.gameOverRecorded) triggerGameOver(state.endReason);
        else loadNextEvent();
        saveGuestGame();
    } catch (error) {
        gameDataLoadFailed = true;
        console.error(getStartupTexts(state.lang).loadFailed, error);
        renderStartupStatus();
    }
};
