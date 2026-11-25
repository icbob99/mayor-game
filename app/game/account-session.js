import { AudioSettings } from './audio-settings.js';
import { createMayorSave } from './mayor-save.js';
import { BrowserSession } from '../infrastructure/browser-session.js';
import { requestGameApi } from '../infrastructure/data-proxy.js';
import { LocalEnvironment } from '../infrastructure/environment.js';
import { updateAuthUI } from '../ui/auth.js';

const idleMs = 30 * 60000;
let auth = null;
let pendingPing = false;
let mayorSave = null;
let switching = false;

function storage() {
    try { return LocalEnvironment ? LocalEnvironment.storage : window.localStorage; }
    catch { return null; }
}
function read(key) {
    try { return JSON.parse(storage()?.getItem(key) || 'null'); }
    catch { return null; }
}
function persist() {
    if (LocalEnvironment && !LocalEnvironment.isCurrent()) return;
    BrowserSession.saveAuth(auth);
}
function accountStorage() {
    return BrowserSession.accountStore(auth.account.id);
}
function syncAudioAccount() {
    AudioSettings?.setAccount(auth?.mode === 'mayor' && auth.authToken ? { id: auth.account.id, token: auth.authToken } : null);
}
function notify() {
    syncAudioAccount();
    updateAuthUI?.();
}
function openSave() {
    const owner = auth;
    mayorSave = createMayorSave(accountStorage(), () => owner.authToken,
        () => auth === owner && (!LocalEnvironment || LocalEnvironment.isCurrent()),
        () => { owner.retiredToken = owner.authToken; owner.authToken = null; persist(); notify(); });
}
function sendActivity() {
    if (!auth?.authToken || pendingPing) return;
    const token = auth.authToken;
    const sentActivityAt = auth.lastActivityAt;
    pendingPing = true;
    requestGameApi('/api/auth/activity', { method: 'POST', token }).then(data => {
        if (auth.authToken === token) { auth.expiresAt = data.expiresAt; persist(); }
    }).catch(error => {
        if (error.status === 401 && auth.authToken === token) { auth.retiredToken = token; auth.authToken = null; persist(); notify(); }
    }).finally(() => {
        pendingPing = false;
        // Include activity that happened during the request, but never invent background activity.
        if (auth.authToken === token && auth.lastActivityAt > sentActivityAt) sendActivity();
    });
}
function expire() {
    const token = auth.authToken;
    auth.retiredToken = token || auth.retiredToken;
    auth.authToken = null;
    auth.locked = true;
    persist();
    if (token) requestGameApi('/api/auth/session', { method: 'DELETE', token }).catch(() => {});
}

const AccountSession = {
    async init() {
        await BrowserSession.init(storage());
        auth = BrowserSession.readAuth();
        if (!auth?.account?.id || !Number.isFinite(auth.lastActivityAt)) auth = null;
        this.check();
        if (auth?.authToken) {
            const token = auth.authToken;
            try {
                const data = await requestGameApi('/api/auth/session', { token });
                if (auth.authToken === token) { auth.expiresAt = data.expiresAt; persist(); }
            } catch (error) {
                if (error.status === 401 && auth.authToken === token) { auth.retiredToken = token; auth.authToken = null; persist(); }
                // A network error does not discard local play or credentials.
            }
        }
        if (auth) {
            openSave();
            if (this.isMayor()) await mayorSave.resume();
        }
        window.setInterval(() => { this.check(); notify(); }, 1000);
        window.setInterval(() => { this.check(); void mayorSave?.checkSession().then(notify); }, 10000);
        window.addEventListener('online', () => { this.check(); void mayorSave?.checkSession().then(notify); });
        for (const event of ['pointerdown', 'keydown']) window.addEventListener(event, e => {
            if (e.isTrusted) this.activity();
        });
        window.addEventListener('focus', () => { this.check(); notify(); void mayorSave?.checkSession().then(notify); });
        window.addEventListener('storage', () => {
            const current = BrowserSession.readAuth();
            // Another tab cannot change the account whose game this tab holds.
            if (auth && current?.account?.id === auth.account.id) {
                auth.lastActivityAt = Math.max(auth.lastActivityAt, current.lastActivityAt || 0);
                if (!current.authToken) auth.authToken = null;
                this.check(); notify();
            }
        });
        syncAudioAccount();
    },
    async authenticate(kind, credentials) {
        await BrowserSession.init(storage());
        const result = await requestGameApi(`/api/auth/${kind}`, {
            method: 'POST', body: credentials, token: auth?.authToken || auth?.retiredToken
        });
        auth = { ...result, mode: 'mayor', lastActivityAt: Date.now() };
        persist();
        syncAudioAccount();
        openSave();
        switching = true;
        try { await mayorSave.resume(true, result.activeGameSessionId); } finally { switching = false; }
        return result;
    },
    isMayor() { return auth?.mode === 'mayor'; },
    account() { return auth?.account || null; },
    token() { return auth?.authToken || null; },
    check() {
        if (!auth) return 'guest';
        if (!auth.authToken && !auth.retiredToken) return 'signed_out';
        if (auth.locked) return 'expired';
        const elapsed = Date.now() - auth.lastActivityAt;
        if (elapsed >= idleMs) { expire(); return 'expired'; }
        return elapsed >= 25 * 60000 ? 'warning' : 'active';
    },
    canPlay() { return !switching && (!this.isMayor() || (!['expired', 'signed_out'].includes(this.check()) && !mayorSave?.status())); },
    activity() {
        if (!auth || ['expired', 'signed_out'].includes(this.check())) { notify(); return false; }
        auth.lastActivityAt = Date.now();
        persist();
        notify();
        sendActivity();
        return true;
    },
    loadGame() { return this.isMayor() ? mayorSave?.load() : null; },
    save(state) {
        if (!this.isMayor() || (LocalEnvironment && !LocalEnvironment.isCurrent())) return;
        mayorSave.save(state);
    },
    getStats() { return mayorSave?.stats(); },
    syncStatus() { return mayorSave?.status(); },
    syncDetails() { return mayorSave?.details(); },
    async resolveSave(source) { await mayorSave.resolve(source); notify(); },
    checkSession() { return mayorSave?.checkSession(); },
    async becomeMayor() {
        if (!auth?.authToken || this.check() === 'expired' || mayorSave?.status() === 'session_replaced') return false;
        switching = true;
        try { await mayorSave.resume(); } finally { switching = false; }
        if (!auth.authToken || mayorSave.status() === 'session_replaced') return false;
        auth.mode = 'mayor'; persist();
        syncAudioAccount();
        return true;
    },
    becomeGuest() { if (auth) { auth.mode = 'guest'; persist(); syncAudioAccount(); } },
    shouldInvite(count) {
        if (auth?.account || ![3, 8, 18].includes(count) || Number(read('mayorRegistrationPrompt')) >= count) return false;
        try { storage()?.setItem('mayorRegistrationPrompt', JSON.stringify(count)); } catch { /* Invitations are optional. */ }
        return true;
    }
};

export { AccountSession };
