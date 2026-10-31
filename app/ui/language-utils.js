(function (root, factory) {
    const api = factory();
    root.detectInitialLanguage = api.detectInitialLanguage;
    root.getStartupTexts = api.getStartupTexts;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis, function () {
    function detectInitialLanguage(browserLanguage) {
        const language = String(browserLanguage || '').toLowerCase();
        if (language.startsWith('uk')) return 'uk';
        if (language.startsWith('ru')) return 'ru';
        if (language.startsWith('he') || language.startsWith('iw')) return 'he';
        return 'en';
    }

    // These messages must be available even when the database cannot be reached.
    const startupTexts = {
        en: {
            loading: 'Loading…',
            loadFailed: 'Failed to load game data',
            reload: 'Reload the page.',
            languageFailed: 'Failed to load the language pack'
        },
        ru: {
            loading: 'Загрузка…',
            loadFailed: 'Не удалось загрузить данные игры',
            reload: 'Обновите страницу.',
            languageFailed: 'Не удалось загрузить языковой пакет'
        },
        uk: {
            loading: 'Завантаження…',
            loadFailed: 'Не вдалося завантажити дані гри',
            reload: 'Оновіть сторінку.',
            languageFailed: 'Не вдалося завантажити мовний пакет'
        },
        he: {
            loading: 'טוען…',
            loadFailed: 'טעינת נתוני המשחק נכשלה',
            reload: 'יש לרענן את הדף.',
            languageFailed: 'טעינת חבילת השפה נכשלה'
        }
    };

    function getStartupTexts(lang) {
        return startupTexts[detectInitialLanguage(lang)];
    }

    return { detectInitialLanguage, getStartupTexts };
}));
