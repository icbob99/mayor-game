// Injected by the Docker-only server. Never loaded by the production page.
(function () {
    const key = 'mayorDevInstance';
    const gameKeys = new Set(['mayorGameState', 'mayorGuestStats', 'mayorRegistrationPrompt', 'mayorAuth']);
    let instanceId;
    let restarting = false;

    function clearGameStorage(store, previousId) {
        for (let index = store.length - 1; index >= 0; index--) {
            const name = store.key(index);
            if (gameKeys.has(name) || name.startsWith('mayorAccount:') ||
                (previousId && name.startsWith(`mayorDevData:${previousId}:`))) store.removeItem(name);
        }
    }

    function adopt(id) {
        if (typeof id !== 'string' || !id) throw new Error('Invalid local environment ID');
        const previousId = localStorage.getItem(key);
        if (previousId !== id) {
            clearGameStorage(localStorage, previousId);
            localStorage.setItem(key, id);
        }
        // sessionStorage belongs to this tab, even when another tab reset localStorage.
        if (sessionStorage.getItem(key) !== id) {
            clearGameStorage(sessionStorage, sessionStorage.getItem(key));
            sessionStorage.setItem(key, id);
        }
    }

    function reload() {
        if (restarting) return;
        restarting = true;
        location.reload();
    }

    async function getInstance() {
        const response = await fetch('/api/dev-info', { cache: 'no-store', signal: AbortSignal.timeout(3000) });
        if (!response.ok) throw new Error('Local server is not ready');
        return (await response.json()).instance_id;
    }

    async function check() {
        if (restarting) return;
        try {
            const id = await getInstance();
            if (id !== instanceId) {
                adopt(id);
                reload();
            }
        } catch {
            // A stopped/rebuilding server is not a new generation yet.
        }
    }

    window.LocalEnvironment = {
        ready: null,
        // A tab always writes into its own generation, even if reset races a write.
        storage: {
            keys: () => Object.keys(localStorage).filter(name => name.startsWith(`mayorDevData:${instanceId}:`))
                .map(name => name.slice(`mayorDevData:${instanceId}:`.length)),
            getItem: name => localStorage.getItem(`mayorDevData:${instanceId}:${name}`),
            setItem: (name, value) => localStorage.setItem(`mayorDevData:${instanceId}:${name}`, value),
            removeItem: name => localStorage.removeItem(`mayorDevData:${instanceId}:${name}`)
        },
        isCurrent() {
            if (!instanceId || restarting) return false;
            if (localStorage.getItem(key) !== instanceId) {
                reload();
                return false;
            }
            return true;
        },
        async fetch(url, options = {}) {
            await this.ready;
            if (!this.isCurrent()) throw new Error('Local environment restarted');
            const headers = new Headers(options.headers);
            headers.set('X-Dev-Instance', instanceId);
            const response = await fetch(url, { ...options, headers, cache: 'no-store' });
            if (response.status === 409) {
                const body = await response.clone().json();
                if (body.instance_id && body.instance_id !== instanceId) {
                    adopt(body.instance_id);
                    reload();
                    throw new Error('Local environment restarted');
                }
            }
            return response;
        }
    };
    window.LocalEnvironment.ready = getInstance().then(id => {
        adopt(id);
        instanceId = id;
        addEventListener('focus', check);
        addEventListener('storage', event => {
            if (event.key === key && event.newValue !== instanceId) reload();
        });
        setInterval(check, 3000);
    });
    // Startup also awaits this promise and displays the existing loading error.
    window.LocalEnvironment.ready.catch(() => {});
})();
