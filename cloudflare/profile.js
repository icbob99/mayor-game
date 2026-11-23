import { idleMs, tokenHash } from './auth.js';
import { readAudioProfile, writeAudioProfile } from './profile-storage.js';

export async function handleProfile(request, env, cors) {
    const headers = { ...cors, 'Cache-Control': 'no-store' };
    const reply = (data, status = 200) => Response.json(data, { status, headers });
    if (new URL(request.url).pathname !== '/api/profile/audio' || !['GET', 'PUT'].includes(request.method)) {
        return reply({ error: 'not_found' }, 404);
    }
    const token = request.headers.get('Authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
    if (!token) return reply({ error: 'auth_expired' }, 401);
    try {
        let audio;
        if (request.method === 'PUT') {
            const text = await request.text();
            if (text.length > 1024) return reply({ error: 'invalid_request' }, 400);
            try { audio = JSON.parse(text); } catch { return reply({ error: 'invalid_request' }, 400); }
            if (!audio || Object.keys(audio).length !== 4 ||
                !['musicEnabled', 'sfxEnabled'].every(key => typeof audio[key] === 'boolean') ||
                !['musicVolume', 'sfxVolume'].every(key => Number.isInteger(audio[key]) && audio[key] >= 0 && audio[key] <= 100)) {
                return reply({ error: 'invalid_request' }, 400);
            }
        }
        const hashed = await tokenHash(token), cutoff = Date.now() - idleMs;
        if (request.method === 'GET') {
            const row = await readAudioProfile(env, hashed, cutoff);
            return row ? reply({ audio: row.audio_json ? JSON.parse(row.audio_json) : null }) : reply({ error: 'auth_expired' }, 401);
        }
        if (!await writeAudioProfile(env, hashed, cutoff, audio)) return reply({ error: 'auth_expired' }, 401);
        return new Response(null, { status: 204, headers });
    } catch {
        return reply({ error: 'server_unavailable' }, 503);
    }
}
