// Network first: deployments and content edits remain visible without clearing browser data.
const base = new URL(self.registration.scope);
const cachePrefix = `mayor-offline:${base.pathname}:`;
const cacheName = cachePrefix + 'v1';
const indexUrl = new URL('index.html', base).href;
const tailwindUrl = 'https://cdn.tailwindcss.com/';
const cloudDataUrl = 'https://mayor-game-api.icbob99.workers.dev/api/game-data';

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(cacheName);
        const page = await fetch(indexUrl, { cache: 'reload' });
        if (!page.ok) throw new Error('Offline page unavailable');
        const html = await page.clone().text();
        // Use the actual page dependencies instead of maintaining a second script list.
        const urls = new Set([...html.matchAll(/<(?:script|link|img)\b[^>]*\b(?:src|href)="([^"]+)"/g)]
            .map(match => new URL(match[1], base).href));
        for (const flag of ['gb.svg', 'ru.svg', 'ua.svg', 'il.webp']) {
            urls.add(new URL(`assets/flags/${flag}`, base).href);
        }
        await Promise.all([...urls].map(async url => {
            const response = await fetch(url, { cache: 'reload', mode: url === tailwindUrl ? 'no-cors' : 'cors' });
            if (!response.ok && response.type !== 'opaque') throw new Error('Offline asset unavailable');
            await cache.put(url, response);
        }));
        // Static hosts redirect index.html to /. Navigation cannot replay a redirected response.
        await cache.put(indexUrl, new Response(page.body, page));
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        for (const name of await caches.keys()) {
            if (name.startsWith(cachePrefix) && name !== cacheName) await caches.delete(name);
        }
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET' || request.headers.has('Authorization')) return;
    const url = new URL(request.url);
    const isPage = url.origin === base.origin && [base.pathname, base.pathname + 'index.html'].includes(url.pathname);
    const isAsset = url.origin === base.origin && ['app/', 'css/', 'assets/'].some(path => url.pathname.startsWith(base.pathname + path));
    const isDevScript = url.href === new URL('dev-environment.js', base).href;
    const isData = url.href === cloudDataUrl || (url.origin === base.origin && url.pathname === '/api/game-data');
    if (!isPage && !isAsset && !isDevScript && !isData && url.href !== tailwindUrl) return;
    // Only shared content and static files enter this cache, never auth/save/session responses.
    const key = isPage ? indexUrl : url.origin + url.pathname;
    event.respondWith((async () => {
        let cache;
        try { cache = await caches.open(cacheName); } catch { /* Online play does not require storage. */ }
        try {
            const response = await fetch(request);
            let cacheable = response.ok || response.type === 'opaque';
            if (isData && response.ok) {
                const data = await response.clone().json().catch(() => null);
                cacheable = data?.results?.length === 6 && data.results.every(result => result.type === 'ok');
            }
            if (cacheable && cache) {
                let copy = response.clone();
                if (isPage) copy = new Response(copy.body, copy);
                if (isData && request.headers.has('X-Dev-Instance')) {
                    // A rebuilt Docker stand must never read the previous generation's content.
                    copy = new Response(copy.body, copy);
                    copy.headers.set('X-Dev-Instance', request.headers.get('X-Dev-Instance'));
                }
                const cacheRequest = new Request(key, { headers: request.headers });
                await cache.put(cacheRequest, copy).catch(() => {});
            }
            return response;
        } catch (error) {
            const saved = await cache?.match(new Request(key, { headers: request.headers }));
            if (saved && (!isData || saved.headers.get('X-Dev-Instance') === request.headers.get('X-Dev-Instance'))) return saved;
            throw error;
        }
    })());
});
