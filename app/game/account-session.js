(function (root) {
    const idleMs = 30 * 60000;
    let auth = null;
    let pendingPing = false;

    function storage() {
        try { return root.LocalEnvironment ? root.LocalEnvironment.storage : root.localStorage; }
        catch { return null; }
    }
    function read(key) {
        try { return JSON.parse(storage()?.getItem(key) || 'null'); }
        catch { return null; }
    }
    function persist() {
        if (root.LocalEnvironment && !root.LocalEnvironment.isCurrent()) return;
        try { storage()?.setItem('mayorAuth', JSON.stringify(auth)); } catch { /* Storage may be unavailable. */ }
    }
    function accountStorage() {
        const prefix = `mayorAccount:${auth.account.id}:`;
        const store = storage();
        return {
            getItem: key => store?.getItem(prefix + key),
            setItem: (key, value) => store?.setItem(prefix + key, value),
            removeItem: key => store?.removeItem(prefix + key)
        };
    }
    function notify() { root.updateAuthUI?.(); }
    function sendActivity() {
        if (!auth?.authToken || pendingPing) return;
        const token = auth.authToken;
        const sentActivityAt = auth.lastActivityAt;
        pendingPing = true;
        root.requestGameApi('/api/auth/activity', { method: 'POST', token }).then(data => {
            if (auth.authToken === token) { auth.expiresAt = data.expiresAt; persist(); }
        }).catch(error => {
            if (error.status === 401 && auth.authToken === token) { auth.authToken = null; persist(); notify(); }
        }).finally(() => {
            pendingPing = false;
            // Include activity that happened during the request, but never invent background activity.
            if (auth.authToken === token && auth.lastActivityAt > sentActivityAt) sendActivity();
        });
    }
    function expire() {
        const token = auth.authToken;
        auth.authToken = null;
        auth.locked = true;
        persist();
        if (token) root.requestGameApi('/api/auth/session', { method: 'DELETE', token }).catch(() => {});
    }

    root.AccountSession = {
        async init() {
            auth = read('mayorAuth');
            if (!auth?.account?.id || !Number.isFinite(auth.lastActivityAt)) auth = null;
            this.check();
            if (auth?.authToken) {
                const token = auth.authToken;
                try {
                    const data = await root.requestGameApi('/api/auth/session', { token });
                    if (auth.authToken === token) { auth.expiresAt = data.expiresAt; persist(); }
                } catch (error) {
                    if (error.status === 401 && auth.authToken === token) { auth.authToken = null; persist(); }
                    // A network error does not discard local play or credentials.
                }
            }
            root.setInterval(() => { this.check(); notify(); }, 1000);
            for (const event of ['pointerdown', 'keydown']) root.addEventListener(event, e => {
                if (e.isTrusted) this.activity();
            });
            root.addEventListener('focus', () => { this.check(); notify(); });
            root.addEventListener('storage', () => {
                const current = read('mayorAuth');
                // Another tab cannot change the account whose game this tab holds.
                if (auth && current?.account?.id === auth.account.id) {
                    auth.lastActivityAt = Math.max(auth.lastActivityAt, current.lastActivityAt || 0);
                    if (!current.authToken) auth.authToken = null;
                    this.check(); notify();
                }
            });
        },
        async authenticate(kind, credentials) {
            const result = await root.requestGameApi(`/api/auth/${kind}`, { method: 'POST', body: credentials });
            auth = { ...result, mode: 'mayor', lastActivityAt: Date.now() };
            persist();
            return result;
        },
        isMayor() { return auth?.mode === 'mayor'; },
        account() { return auth?.account || null; },
        token() { return auth?.authToken || null; },
        check() {
            if (!auth) return 'guest';
            if (auth.locked) return 'expired';
            const elapsed = Date.now() - auth.lastActivityAt;
            if (elapsed >= idleMs) { expire(); return 'expired'; }
            return elapsed >= 25 * 60000 ? 'warning' : 'active';
        },
        canPlay() { return !this.isMayor() || this.check() !== 'expired'; },
        activity() {
            if (!auth || this.check() === 'expired') { notify(); return false; }
            auth.lastActivityAt = Date.now();
            persist();
            notify();
            sendActivity();
            return true;
        },
        loadGame() { return this.isMayor() ? root.GuestStorage.loadGameState(accountStorage()) : null; },
        save(state) {
            if (!this.isMayor() || (root.LocalEnvironment && !root.LocalEnvironment.isCurrent())) return;
            const store = accountStorage();
            root.GuestStorage.saveGameState(store, state);
            root.GuestStorage.updateMaxMoney(store, state.money);
        },
        recordGameOver(state) {
            if (!this.isMayor()) return;
            root.GuestStorage.recordGameOver(accountStorage(), { money: state.money, unlockedAchievements: state.earnedAchievementsThisGame });
        },
        becomeGuest() { if (auth) { auth.mode = 'guest'; persist(); } },
        shouldInvite(count) {
            if (this.isMayor() || ![3, 8, 18].includes(count) || Number(read('mayorRegistrationPrompt')) >= count) return false;
            try { storage()?.setItem('mayorRegistrationPrompt', JSON.stringify(count)); } catch { /* Invitations are optional. */ }
            return true;
        }
    };
})(window);
