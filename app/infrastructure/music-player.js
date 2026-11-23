(function (root) {
    function createMusicPlayer(context, output, baseUrl, fetchAudio = fetch) {
        const buffers = new Map();
        let current = null, pending = null, generation = 0, desired = null, failedTrack = null;
        async function load(track) {
            if (!buffers.has(track)) {
                buffers.set(track, (async () => {
                    for (const extension of ['mp3', 'wav']) {
                        try {
                            const response = await fetchAudio(new URL(`assets/audio/${track}.${extension}`, baseUrl), { signal: AbortSignal.timeout(15000) });
                            if (response.ok) {
                                const buffer = await context.decodeAudioData(await response.arrayBuffer());
                                if (buffer.duration > 0) return buffer;
                            }
                        } catch { /* Try the other supported format, including a decode failure. */ }
                    }
                    buffers.delete(track);
                    throw new Error('Audio track unavailable: ' + track);
                })());
            }
            return buffers.get(track);
        }
        function retire(voice) {
            if (!voice) return;
            const now = context.currentTime, elapsed = Math.max(0, now - voice.start);
            const level = Math.max(0, Math.min(1, elapsed / voice.fadeIn, (voice.duration - elapsed) / voice.fadeOut));
            const end = now + Math.min(1.5, Math.max(.01, voice.duration - elapsed));
            voice.gain.gain.cancelScheduledValues(now);
            voice.gain.gain.setValueAtTime(level, now);
            voice.gain.gain.linearRampToValueAtTime(0, end);
            voice.source.stop(end);
        }
        function begin(buffer, track) {
            const source = context.createBufferSource(), gain = context.createGain(), now = context.currentTime;
            const duration = buffer.duration, fadeIn = Math.min(1.5, duration / 3), fadeOut = Math.min(1.75, duration / 3);
            const voice = { source, gain, start: now, duration, fadeIn, fadeOut, track };
            source.buffer = buffer;
            source.connect(gain); gain.connect(output);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(1, now + fadeIn);
            gain.gain.setValueAtTime(1, now + duration - fadeOut);
            gain.gain.linearRampToValueAtTime(0, now + duration);
            source.onended = () => {
                source.disconnect(); gain.disconnect();
                if (current === voice && desired === track) { current = null; begin(buffer, track); }
            };
            retire(current); current = voice;
            source.start(now, 0);
        }
        return {
            async play(track) {
                if (!['theme', 'blitz'].includes(track)) return;
                if (desired !== track) failedTrack = null;
                desired = track;
                if (failedTrack === track) return;
                if (current?.track === track) {
                    // Returning to the current track cancels an older pending transition.
                    if (pending) { generation++; pending = null; }
                    return;
                }
                if (pending?.track === track) return;
                const id = ++generation; pending = { id, track };
                try {
                    const buffer = await load(track);
                    if (generation === id && desired === track) begin(buffer, track);
                } catch {
                    // Retry only after a mode change or an explicit stop/start, not every UI render.
                    if (generation === id) failedTrack = track;
                }
                finally { if (pending?.id === id) pending = null; }
            },
            stop() {
                desired = null; generation++; pending = null; failedTrack = null;
                const voice = current; current = null; retire(voice);
            }
        };
    }
    root.createMusicPlayer = createMusicPlayer;
    if (typeof module !== 'undefined' && module.exports) module.exports = { createMusicPlayer };
})(typeof window !== 'undefined' ? window : globalThis);
