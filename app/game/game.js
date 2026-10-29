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
        GuestSession.load(state);
        await setLang(state.lang);
        if (typeof applyAudioPreference === 'function') {
            applyAudioPreference(Boolean(state.audioMuted));
        }
        const data = await loadGameData();
        gameLogicEvents = data.events;
        gameLocales = data.locales;
        if (!gameLocales[state.lang]) state.lang = 'en';
        await setLang(state.lang);
        loadNextEvent();
        saveGuestGame();
    } catch (error) {
        gameDataLoadFailed = true;
        console.error(getStartupTexts(state.lang).loadFailed, error);
        renderStartupStatus();
    }
};
