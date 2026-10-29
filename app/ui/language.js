async function setLang(lang) {
    const requestId = ++languageRequestId;
    state.lang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'he') ? 'rtl' : 'ltr';

    const buttons = document.querySelectorAll('#lang-menu button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-indigo-600');
        btn.classList.add('bg-slate-700');
    });

    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-indigo-600');
        activeBtn.classList.remove('bg-slate-700');
    }
    const selectedLanguage = LANGUAGE_OPTIONS.find(option => option.id === lang);
    if (selectedLanguage) {
        const flag = document.getElementById('lang-flag');
        const label = document.getElementById('lang-label');
        if (flag) {
            flag.src = selectedLanguage.flag;
            flag.alt = selectedLanguage.label;
        }
        if (label) label.innerText = selectedLanguage.label;
        const menu = document.getElementById('lang-menu');
        const toggle = document.getElementById('lang-toggle');
        if (menu) menu.classList.add('hidden');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    try {
        const texts = gameLocales[lang];
        if (!texts) {
            renderStartupStatus();
            return;
        }
        if (requestId !== languageRequestId) return;
        currentTexts = texts;
    saveGuestGame();
    } catch (error) {
        if (requestId !== languageRequestId) return;
        console.error(getStartupTexts(lang).languageFailed, error);
        return;
    }

    updateUI();
    if (state.currentEventIndex !== -1) {
        renderCurrentEvent();
    }
}

function toggleLanguageMenu() {
    const menu = document.getElementById('lang-menu');
    const toggle = document.getElementById('lang-toggle');
    if (!menu || !toggle) return;
    const isHidden = menu.classList.toggle('hidden');
    toggle.setAttribute('aria-expanded', String(!isHidden));
}

function gameErrorText(key, id) {
    const template = currentTexts?.alerts?.[key] || `${key}: {id} ({lang})`;
    return template.replace('{id}', id).replace('{lang}', state.lang);
}

function initializeLanguageSelector() {
    const menu = document.getElementById('lang-menu');
    if (!menu) return;
    menu.innerHTML = LANGUAGE_OPTIONS.map(option => `
        <button id="btn-${option.id}" type="button" onclick="setLang('${option.id}')"
            class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-white hover:bg-slate-600 transition"
            role="option" aria-label="${option.label}">
            <img src="${option.flag}" alt="" class="w-6 h-4 object-cover rounded-sm">
            <span>${option.label}</span>
        </button>
    `).join('');
}

