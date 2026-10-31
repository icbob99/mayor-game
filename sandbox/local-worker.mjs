import gameWorker from '../cloudflare/worker.js';

// Development entry point only; production continues to deploy cloudflare/worker.js.
export default {
    async fetch(request, env, context) {
        const path = new URL(request.url).pathname;
        const headers = { 'Cache-Control': 'no-store' };
        if (!env.DEV_INSTANCE_ID) return new Response('Local environment ID missing', { status: 503, headers });
        if (path === '/api/dev-info') {
            return Response.json({ instance_id: env.DEV_INSTANCE_ID }, { headers });
        }
        if (path.startsWith('/api/')) {
            if (request.headers.get('X-Dev-Instance') !== env.DEV_INSTANCE_ID) {
                return Response.json({ error: 'environment_restarted', instance_id: env.DEV_INSTANCE_ID }, { status: 409, headers });
            }
            const response = await gameWorker.fetch(request, env, context);
            const result = new Response(response.body, response);
            result.headers.set('Cache-Control', 'no-store');
            return result;
        }
        const response = await env.ASSETS.fetch(request);
        if (response.headers.get('Content-Type')?.includes('text/html')) {
            const html = (await response.text()).replace('<head>', '<head>\n    <script src="/dev-environment.js"></script>');
            const result = new Response(html, response);
            result.headers.set('Cache-Control', 'no-store');
            return result;
        }
        return response;
    }
};
