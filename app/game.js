window.onload = async () => {
    initializeLanguageSelector();
    document.getElementById('event-title').innerText = 'Загрузка… / Loading… / טוען…';
    try {
        if (typeof LocalEnvironment !== 'undefined') await LocalEnvironment.ready;
        GuestSession.load(state);
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
        console.error('Ошибка загрузки данных игры', error);
        document.getElementById('event-title').innerText = 'Ошибка загрузки / Loading failed / שגיאת טעינה';
        document.getElementById('event-desc').innerText = 'Обновите страницу. / Reload the page. / רעננו את הדף.';
    }
};
