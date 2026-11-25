// First-load content must be fetched after the worker can cache it.
const offlineReady = (async () => {
    if (!('serviceWorker' in navigator)) return;
    await navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' });
    if (navigator.serviceWorker.controller) return;
    await new Promise(resolve => {
        function done() {
            clearTimeout(timer);
            navigator.serviceWorker.removeEventListener('controllerchange', done);
            resolve();
        }
        // Disabled storage or a failed installation must not prevent online play.
        const timer = setTimeout(done, 10000);
        navigator.serviceWorker.addEventListener('controllerchange', done);
        if (navigator.serviceWorker.controller) done();
    });
})().catch(() => {});

export { offlineReady };
