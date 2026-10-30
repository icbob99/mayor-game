let authFormKind = 'login';
let authFormBusy = false;

function authText(key) { return currentTexts?.ui.auth?.[key] || key; }

function updateAuthUI() {
    const mayor = AccountSession.isMayor();
    const status = AccountSession.check();
    document.getElementById('btn-login').textContent = authText('login');
    document.getElementById('btn-register').textContent = authText('register');
    document.getElementById('btn-login').hidden = mayor && Boolean(AccountSession.token()) && status !== 'expired';
    document.getElementById('btn-register').hidden = mayor;
    document.getElementById('auth-account').textContent = mayor ? AccountSession.account().nickname : '';
    document.getElementById('btn-become-guest').hidden = !mayor;
    document.getElementById('btn-become-guest').textContent = authText('guest');
    const notice = document.getElementById('auth-notice');
    notice.hidden = !mayor || (status === 'active' && Boolean(AccountSession.token()));
    document.getElementById('auth-notice-text').textContent = authText(status === 'expired' ? 'expired' : !AccountSession.token() ? 'reauth' : 'warning');
    const resume = document.getElementById('btn-auth-continue');
    resume.hidden = status !== 'warning' || !AccountSession.token();
    resume.textContent = authText('continue');
    const locked = mayor && status === 'expired';
    if (locked) document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('choices-container').inert = locked;
    document.getElementById('btn-shop').disabled = locked;
    document.getElementById('btn-restart').disabled = locked;
    for (const [id, key] of [['auth-nickname-label', 'nickname'], ['auth-password-label', 'password'],
        ['auth-cancel', 'cancel'], ['auth-invite-text', 'invite'], ['auth-invite-yes', 'register'], ['auth-invite-no', 'later']]) {
        document.getElementById(id).textContent = authText(key);
    }
    document.getElementById('auth-title').textContent = authText(authFormKind);
    document.getElementById('auth-submit').textContent = authText(authFormBusy ? 'working' : authFormKind);
}

async function openAuth(kind) {
    if (!currentTexts?.ui.auth) return;
    if (kind === 'login' && !AccountSession.isMayor() && AccountSession.token() &&
        AccountSession.check() !== 'expired' && await AccountSession.becomeMayor()) {
        await restoreMayor();
        return;
    }
    authFormKind = kind;
    const invite = document.getElementById('auth-invite');
    if (invite.open) invite.close();
    document.getElementById('auth-error').textContent = '';
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-password').autocomplete = kind === 'register' ? 'new-password' : 'current-password';
    document.getElementById('auth-nickname').value = AccountSession.account()?.nickname || '';
    updateAuthUI();
    const dialog = document.getElementById('auth-dialog');
    if (!dialog.open) dialog.showModal();
}

async function submitAuth(event) {
    event.preventDefault();
    if (authFormBusy) return;
    const form = document.getElementById('auth-form');
    if (!form.reportValidity()) return;
    authFormBusy = true;
    document.getElementById('auth-submit').disabled = true;
    document.getElementById('auth-cancel').disabled = true;
    updateAuthUI();
    try {
        if (AccountSession.isMayor() || !state.gameOverRecorded) saveGuestGame();
        await AccountSession.authenticate(authFormKind, {
            nickname: document.getElementById('auth-nickname').value,
            password: document.getElementById('auth-password').value
        });
        document.getElementById('auth-password').value = '';
        document.getElementById('auth-dialog').close();
        await restoreMayor();
    } catch (error) {
        document.getElementById('auth-error').textContent = authText(error.code || 'server_unavailable');
    } finally {
        authFormBusy = false;
        document.getElementById('auth-submit').disabled = false;
        document.getElementById('auth-cancel').disabled = false;
        updateAuthUI();
    }
}

async function restoreMayor() {
    const saved = AccountSession.loadGame();
    if (saved) {
        Object.assign(state, saved);
        state.currentEventIndex = -1;
        await setLang(state.lang);
        if (state.gameOverRecorded) triggerGameOver(state.endReason);
        else { document.getElementById('game-over-screen').classList.add('hidden'); loadNextEvent(); }
    } else await resetGame();
    saveGuestGame();
    updateAuthUI();
}

async function becomeGuest() {
    saveGuestGame();
    AccountSession.becomeGuest();
    await resetGame();
    updateAuthUI();
}

function inviteGuest(count) {
    if (AccountSession.shouldInvite(count)) document.getElementById('auth-invite').showModal();
}
