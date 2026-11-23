const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');
const { createMusicPlayer } = require('../app/infrastructure/music-player.js');
const tick = () => new Promise(resolve => setImmediate(resolve));
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };

function audioContext() {
    const sources = [], gains = [];
    return { sources, gains, currentTime: 0,
        decodeAudioData: async () => ({ duration: 10 }),
        createGain() {
            const events = [], gain = { gain: { setValueAtTime: (...args) => events.push(['set', ...args]),
                linearRampToValueAtTime: (...args) => events.push(['ramp', ...args]), cancelScheduledValues: time => events.push(['cancel', time]) },
                events, connect() {}, disconnect() {} }; gains.push(gain); return gain;
        },
        createBufferSource() {
            const source = { connect() {}, disconnect() {}, start: (...args) => { source.started = args; }, stop: time => { source.stopped = time; } };
            sources.push(source); return source;
        }
    };
}
const response = { ok: true, arrayBuffer: async () => new ArrayBuffer(4) };

test('music falls back to WAV, fades before the end and restarts at zero without native loop', async () => {
    const c = audioContext(), urls = [];
    const player = createMusicPlayer(c, {}, 'https://example.com/mayor/', async url => {
        urls.push(String(url)); return String(url).endsWith('.mp3') ? { ok: false } : response;
    });
    await player.play('theme');
    assert.deepEqual(urls, ['https://example.com/mayor/assets/audio/theme.mp3', 'https://example.com/mayor/assets/audio/theme.wav']);
    assert.deepEqual(c.gains[0].events, [['set', 0, 0], ['ramp', 1, 1.5], ['set', 1, 8.25], ['ramp', 0, 10]]);
    assert.notEqual(c.sources[0].loop, true);
    c.currentTime = 10; c.sources[0].onended();
    assert.deepEqual(c.sources[1].started, [10, 0]);
    assert.equal(urls.length, 2, 'decoded track is reused');
    player.stop(); c.sources[1].onended(); assert.equal(c.sources.length, 2);
});

test('crossfade retires the previous track and does not resurrect it', async () => {
    const c = audioContext(), player = createMusicPlayer(c, {}, 'https://example.com/', async () => response);
    await player.play('theme'); c.currentTime = 3; await player.play('blitz');
    assert.equal(c.sources[0].stopped, 4.5);
    assert.deepEqual(c.gains[0].events.slice(-3), [['cancel', 3], ['set', 1, 3], ['ramp', 0, 4.5]]);
    assert.deepEqual(c.sources[1].started, [3, 0]);
    c.sources[0].onended(); assert.equal(c.sources.length, 2);
});

test('disabled or superseded asynchronous track loads never start playback', async () => {
    const c = audioContext(), wait = deferred();
    const player = createMusicPlayer(c, {}, 'https://example.com/', url => String(url).includes('theme') ? wait.promise : Promise.resolve(response));
    const pending = player.play('theme'); await player.play('blitz');
    wait.resolve(response); await pending; assert.equal(c.sources.length, 1);
    player.stop(); c.sources[0].onended(); assert.equal(c.sources.length, 1);
    const next = deferred(), other = createMusicPlayer(c, {}, 'https://example.com/', () => next.promise);
    const loading = other.play('theme'); other.stop(); next.resolve(response); await loading;
    assert.equal(c.sources.length, 1);
});

test('missing music is retried only after an explicit restart or mode change', async () => {
    const c = audioContext(); let requests = 0;
    const player = createMusicPlayer(c, {}, 'https://example.com/', async () => { requests++; return { ok: false }; });
    for (let i = 0; i < 10; i++) await player.play('theme');
    assert.equal(requests, 2);
    player.stop(); await player.play('theme'); assert.equal(requests, 4);
    await player.play('blitz'); assert.equal(requests, 6);
    assert.equal(c.sources.length, 0);
});

function preferences(saved) {
    const values = new Map(saved ? [['mayorAudioSettings', JSON.stringify(saved)]] : []), timers = new Map(), calls = [];
    let next = 0;
    const b = { localStorage: { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) },
        setTimeout: fn => { timers.set(++next, fn); return next; }, clearTimeout: id => timers.delete(id),
        requestGameApi: (path, options) => { const d = deferred(); calls.push({ path, ...options, ...d }); return d.promise; } };
    b.window = b; vm.createContext(b); vm.runInContext(readFileSync('app/game/audio-settings.js', 'utf8'), b); b.AudioSettings.init();
    return { api: b.AudioSettings, values, calls, runTimers: () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); } };
}
const plain = x => JSON.parse(JSON.stringify(x));

test('audio defaults, local persistence and legacy mute do not create guest requests', () => {
    const p = preferences();
    assert.deepEqual(plain(p.api.get()), { musicEnabled: true, musicVolume: 25, sfxEnabled: true, sfxVolume: 70 });
    p.api.migrateLegacy(true); p.api.set({ musicVolume: 37 }); p.runTimers();
    assert.deepEqual(JSON.parse(p.values.get('mayorAudioSettings')), { musicEnabled: false, musicVolume: 37, sfxEnabled: false, sfxVolume: 70 });
    assert.equal(p.calls.length, 0);
    assert.deepEqual(plain(preferences(p.api.get()).api.get()), plain(p.api.get()));
});

test('profile loading applies settings without writing them back; slider edits debounce', async () => {
    const p = preferences(), remote = { musicEnabled: false, musicVolume: 18, sfxEnabled: true, sfxVolume: 45 };
    p.api.setAccount({ id: 'a', token: 'a-token' }); p.calls[0].resolve({ audio: remote }); await tick();
    assert.deepEqual(plain(p.api.get()), remote); p.runTimers(); assert.equal(p.calls.length, 1);
    for (let i = 0; i < 20; i++) p.api.set({ musicVolume: i });
    assert.equal(JSON.parse(p.values.get('mayorAudioSettings')).musicVolume, 19);
    p.runTimers(); assert.equal(p.calls.length, 2); assert.equal(p.calls[1].body.musicVolume, 19);
    p.api.set({ musicVolume: 40 }); p.runTimers(); assert.equal(p.calls.length, 2, 'one in-flight write');
    p.calls[1].resolve(); await tick(); p.runTimers(); assert.equal(p.calls[2].body.musicVolume, 40);
});

test('edits during profile loading win; late account responses and guest mode cannot leak writes', async () => {
    const p = preferences(); p.api.setAccount({ id: 'a', token: 'a-token' });
    p.api.set({ musicVolume: 33 }); p.calls[0].resolve({ audio: { musicVolume: 99 } }); await tick();
    assert.equal(p.api.get().musicVolume, 33);
    p.api.setAccount({ id: 'b', token: 'b-token' });
    p.api.setAccount(null); p.calls[1].resolve({ audio: { musicVolume: 88 } }); await tick(); p.runTimers();
    assert.equal(p.api.get().musicVolume, 33); assert.equal(p.calls.length, 2);
});

test('failed profile writes retain local settings without an automatic retry loop', async () => {
    const p = preferences(); p.api.setAccount({ id: 'a', token: 'a-token' });
    p.calls[0].resolve({ audio: null }); await tick(); p.api.set({ sfxVolume: 22 }); p.runTimers();
    p.calls[1].reject(Error('offline')); await tick(); p.runTimers();
    assert.equal(p.calls.length, 2); assert.equal(JSON.parse(p.values.get('mayorAudioSettings')).sfxVolume, 22);
});

test('audio profile routes require authorization and reject invalid settings', async () => {
    const { default: worker } = await import('../cloudflare/worker.js');
    for (const method of ['GET', 'PUT']) {
        const r = await worker.fetch(new Request('https://example.com/api/profile/audio', { method }), {});
        assert.equal(r.status, 401); assert.equal(r.headers.get('Cache-Control'), 'no-store');
    }
    for (const value of [null, {}, { musicEnabled: true, musicVolume: 101, sfxEnabled: true, sfxVolume: 70 },
        { musicEnabled: true, musicVolume: 25, sfxEnabled: 'true', sfxVolume: 70 }]) {
        const r = await worker.fetch(new Request('https://example.com/api/profile/audio', { method: 'PUT',
            headers: { Authorization: 'Bearer ' + 'a'.repeat(64) }, body: JSON.stringify(value) }), {});
        assert.equal(r.status, 400);
    }
});
