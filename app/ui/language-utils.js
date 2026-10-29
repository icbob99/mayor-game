(function (root, factory) {
    const api = factory();
    root.detectInitialLanguage = api.detectInitialLanguage;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function () {
    function detectInitialLanguage(browserLanguage) {
        const language = String(browserLanguage || '').toLowerCase();
        if (language.startsWith('uk')) return 'uk';
        if (language.startsWith('ru')) return 'ru';
        if (language.startsWith('he') || language.startsWith('iw')) return 'he';
        return 'en';
    }

    return { detectInitialLanguage };
}));
