import { requestGameApi } from '../infrastructure/data-proxy.js';
import { LocalEnvironment } from '../infrastructure/environment.js';

const defaults = { musicEnabled: true, musicVolume: 25, sfxEnabled: true, sfxVolume: 70 };
const key = 'mayorAudioSettings';
let settings = { ...defaults }, initialized = false, hasPreference = false, owner = null;
const listeners = new Set();
const normalize = value => Object.fromEntries(Object.entries(defaults).map(([name, fallback]) => [name,
    typeof fallback === 'boolean' ? (typeof value?.[name] === 'boolean' ? value[name] : fallback) :
        (Number.isFinite(value?.[name]) ? Math.max(0, Math.min(100, Math.round(value[name]))) : fallback)]));
function storage() {
    try { return LocalEnvironment ? LocalEnvironment.storage : window.localStorage; } catch { return null; }
}
function persist() {
    if (LocalEnvironment && !LocalEnvironment.isCurrent()) return;
    try { storage()?.setItem(key, JSON.stringify(settings)); } catch { /* Audio remains usable without storage. */ }
}
function emit() { for (const listener of listeners) listener({ ...settings }); }
function schedule(o) {
    clearTimeout(o.timer);
    o.timer = setTimeout(() => flush(o), 400);
}
async function flush(o) {
    if (owner !== o || o.loading || o.inFlight || !o.dirty) return;
    o.dirty = false;
    o.inFlight = true;
    try {
        await requestGameApi('/api/profile/audio', { method: 'PUT', token: o.token, body: { ...settings } });
    } catch { /* Keep the local settings; the next explicit edit sends the complete object. */ }
    finally {
        o.inFlight = false;
        if (owner === o && o.dirty) schedule(o);
    }
}
const AudioSettings = {
    init() {
        if (initialized) return;
        initialized = true;
        try {
            const saved = JSON.parse(storage()?.getItem(key) || 'null');
            hasPreference = Boolean(saved);
            settings = normalize(saved);
        } catch { settings = { ...defaults }; }
        emit();
    },
    get: () => ({ ...settings }),
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    set(patch) {
        settings = normalize({ ...settings, ...patch });
        hasPreference = true;
        persist(); emit();
        if (owner) { owner.dirty = true; schedule(owner); }
    },
    migrateLegacy(muted) {
        if (!hasPreference && !owner && muted === true) this.set({ musicEnabled: false, sfxEnabled: false });
        else persist();
    },
    setAccount(account) {
        if (owner?.id === account?.id && owner?.token === account?.token) return;
        if (owner) clearTimeout(owner.timer);
        owner = account ? { ...account, loading: true, dirty: false, inFlight: false } : null;
        const o = owner;
        if (!o) return;
        requestGameApi('/api/profile/audio', { token: o.token }).then(result => {
            if (owner !== o) return;
            if (!o.dirty && result.audio) {
                settings = normalize(result.audio); hasPreference = true; persist(); emit();
            } else if (!result.audio) o.dirty = true;
        }).catch(() => { /* Offline or an older Worker: retain local settings. */ }).finally(() => {
            o.loading = false;
            if (owner === o && o.dirty) schedule(o);
        });
    }
};

export { AudioSettings };
