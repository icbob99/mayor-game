(function (root) {
    let ready, store, tabId, importedAccount = null;
    const read = key => {
        try { return JSON.parse(store?.getItem(key) || 'null'); } catch { return null; }
    };
    const write = (key, value) => {
        try { store?.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable. */ }
    };
    const keys = () => store?.keys ? store.keys() : Array.from({ length: store?.length || 0 }, (_, i) => store.key(i));
    function rememberId() {
        try { root.sessionStorage.setItem('mayorAccount:tabId', tabId); } catch { /* Use this document's ID. */ }
    }
    async function identify() {
        try { tabId = root.sessionStorage.getItem('mayorAccount:tabId'); } catch { /* Start a new tab context. */ }
        if (!root.navigator?.locks) { tabId = crypto.randomUUID(); rememberId(); return; }
        // Duplicating a tab copies sessionStorage. A live lock prevents sharing its writer identity.
        async function claim(id) {
            return new Promise((resolve, reject) => {
                root.navigator.locks.request('mayor-tab:' + id, { ifAvailable: true }, lock => {
                    resolve(Boolean(lock));
                    if (lock) return new Promise(() => {});
                }).catch(reject);
            });
        }
        const previous = read('mayorAuth');
        // Reopen a closed tab's saved authorization; never borrow a live tab's writer identity.
        const candidates = [tabId, previous?.tabId];
        if (!previous?.tabId) {
            candidates.push(...keys().filter(key => key.startsWith('mayorAccount:tab:') && key.endsWith(':auth'))
                .map(key => ({ id: key.slice('mayorAccount:tab:'.length, -':auth'.length), auth: read(key) }))
                .filter(item => item.auth?.account?.id === previous?.account?.id && (item.auth?.authToken || item.auth?.retiredToken))
                .sort((a, b) => b.auth.lastActivityAt - a.auth.lastActivityAt).map(item => item.id));
        }
        for (const id of new Set(candidates.filter(Boolean))) {
            if (await claim(id)) { tabId = id; rememberId(); return; }
        }
        tabId = crypto.randomUUID();
        await claim(tabId);
        rememberId();
    }
    const authKey = () => `mayorAccount:tab:${tabId}:auth`;
    const rememberAuth = auth => write('mayorAuth', auth ? {
        account: auth.account, mode: auth.mode, lastActivityAt: auth.lastActivityAt, tabId
    } : null);
    root.BrowserSession = {
        init(storage) {
            if (!ready) ready = (async () => {
                store = storage;
                await identify();
                const restore = () => {
                    if (read(authKey())) return;
                    const previous = read('mayorAuth');
                    if (!previous) return;
                    const legacy = Boolean(previous.authToken || previous.retiredToken);
                    importedAccount = legacy ? previous.account?.id : null;
                    this.saveAuth(legacy ? previous : { ...previous, locked: false });
                };
                if (root.navigator?.locks) await root.navigator.locks.request('mayor-auth-import', restore);
                else restore();
            })();
            return ready;
        },
        readAuth: () => read(authKey()),
        saveAuth(auth) {
            const previous = read(authKey());
            const remembered = read('mayorAuth');
            write(authKey(), auth);
            // Activity or expiry in an old tab must not replace the remembered current authorization.
            if (!remembered?.tabId || remembered.tabId === tabId ||
                (auth?.authToken && auth.authToken !== previous?.authToken)) rememberAuth(auth);
        },
        accountStore(accountId) {
            const base = `mayorAccount:${accountId}:`;
            const prefix = `${base}tab:${tabId}:`;
            const resolvedKey = (source, rev) => base + 'recovered:' + source + ':' + rev;
            const revision = value => JSON.stringify([value.writeTimestamp, value.versionGuid || null]);
            if (!read(prefix + 'cloudSave')) {
                const candidates = keys().filter(key => key.startsWith(base) && !key.startsWith(base + 'recovered:') && key.endsWith(':cloudSave'))
                    .map(key => ({ key, value: read(key) }))
                    .filter(item => item.value && !read(resolvedKey(item.key, revision(item.value))));
                // Recover unsent play before a clean snapshot from another tab. Never merge branches.
                const dirty = value => Number(value.localChanged ?? (value.writeTimestamp > (value.ackTimestamp || 0)));
                candidates.sort((a, b) => dirty(b.value) - dirty(a.value) || b.value.writeTimestamp - a.value.writeTimestamp);
                const selected = candidates[0];
                if (selected) {
                    const previous = selected.value;
                    previous.recoveryResolved = false;
                    previous.recoverySources = { ...previous.recoverySources, [selected.key]: revision(previous) };
                    if (importedAccount !== accountId || selected.key !== base + 'cloudSave') {
                        previous.gameSessionId = null;
                        previous.activation = null;
                    }
                    write(prefix + 'cloudSave', previous);
                }
            }
            return {
                getItem: key => store?.getItem(prefix + key) ??
                    (key === 'mayorGameState' || key === 'mayorGuestStats' ? store?.getItem(base + key) : null),
                setItem(key, value) {
                    const previous = key === 'cloudSave' ? read(prefix + key) : null;
                    store?.setItem(prefix + key, value);
                    if (key === 'cloudSave') {
                        const saved = JSON.parse(value);
                        if (saved.gameSessionId && saved.gameSessionId !== previous?.gameSessionId && !saved.blocked) {
                            const auth = read(authKey());
                            if (auth?.authToken) rememberAuth(auth);
                        }
                        if (saved.recoverySources && saved.recoveryResolved && !saved.activation && !saved.blocked) {
                            // Resolve the imported revision only; a live source tab may have newer unsent play.
                            for (const [source, rev] of Object.entries(saved.recoverySources)) {
                                if (!read(resolvedKey(source, rev))) write(resolvedKey(source, rev), true);
                            }
                        }
                    }
                },
                removeItem(key) {
                    store?.removeItem(prefix + key);
                    if (importedAccount === accountId && key !== 'cloudSave') store?.removeItem(base + key);
                }
            };
        }
    };
})(window);
