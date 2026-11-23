// File-based music and the original synthesized SFX use independent volume buses.
let audioCtx = null;
let musicBus = null;
let sfxBus = null;
let musicPlayer = null;
let audioInitialized = false;

function initAudio() {
    if (!audioCtx) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return false;
        audioCtx = new Context();
        musicBus = audioCtx.createGain(); musicBus.connect(audioCtx.destination);
        sfxBus = audioCtx.createGain(); sfxBus.connect(audioCtx.destination);
        musicPlayer = createMusicPlayer(audioCtx, musicBus, document.baseURI);
        applyAudioSettings();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume().then(startBgMusic).catch(() => {});
    return true;
}

function initializeAudio() {
    if (audioInitialized) return;
    audioInitialized = true;
    AudioSettings.subscribe(applyAudioSettings);
    AudioSettings.init();
    const unlock = () => {
        const settings = AudioSettings.get();
        if ((settings.musicEnabled || settings.sfxEnabled) && initAudio()) startBgMusic();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('click', unlock);
    window.addEventListener('keydown', unlock);
    document.getElementById('audio-modal').addEventListener('close', updateAudioButton);
    unlock();
}

function applyAudioSettings() {
    const settings = AudioSettings.get();
    if (audioCtx) {
        musicBus.gain.setTargetAtTime(settings.musicVolume / 100, audioCtx.currentTime, .04);
        sfxBus.gain.setTargetAtTime(settings.sfxEnabled ? settings.sfxVolume / 100 : 0, audioCtx.currentTime, .02);
        if (settings.musicEnabled) startBgMusic();
        else stopBgMusic();
    }
    updateAudioButton();
}

function startBgMusic() {
    if (!AudioSettings.get().musicEnabled || !audioCtx || audioCtx.state !== 'running') return;
    const mode = typeof state === 'undefined' ? 'arcade' : state.mode;
    void musicPlayer.play(mode === 'blitz' ? 'blitz' : 'theme');
}

function stopBgMusic() { musicPlayer?.stop(); }

function toggleAudio(show = true) {
    const dialog = document.getElementById('audio-modal');
    if (show) {
        if (!currentTexts?.ui.audio) return;
        updateAudioButton();
        if (!dialog.open) dialog.showModal();
        initAudio(); startBgMusic();
    } else dialog.close();
    updateAudioButton();
    if (typeof syncBlitzPause === 'function') syncBlitzPause();
}

function setAudioSetting(key, value) {
    AudioSettings.set({ [key]: value });
}

function updateAudioButton() {
    const button = document.getElementById('btn-audio');
    if (!button) return;
    const settings = AudioSettings.get();
    const active = (settings.musicEnabled && settings.musicVolume > 0) || (settings.sfxEnabled && settings.sfxVolume > 0);
    const texts = typeof currentTexts !== 'undefined' ? currentTexts?.ui.audio : null;
    const title = texts?.title || (typeof currentTexts !== 'undefined' ? currentTexts?.ui.sound : '') || '';
    document.getElementById('audio-icon').textContent = active ? '🔊' : '🔇';
    document.getElementById('audio-status').textContent = texts ? (active ? texts.enabled : texts.disabled) : '';
    button.classList.toggle('opacity-50', !active);
    button.setAttribute('aria-label', title); button.title = title;
    button.setAttribute('aria-expanded', String(document.getElementById('audio-modal').open));
    button.disabled = !texts;
    if (!texts) return;
    document.getElementById('audio-title').textContent = texts.title;
    for (const channel of ['music', 'sfx']) {
        const enabled = settings[channel + 'Enabled'], volume = settings[channel + 'Volume'];
        document.getElementById('audio-' + channel + '-label').textContent = texts[channel];
        const toggle = document.getElementById('audio-' + channel + '-toggle');
        toggle.textContent = (enabled ? '🔊 ' : '🔇 ') + (enabled ? texts.enabled : texts.disabled);
        toggle.setAttribute('aria-pressed', String(enabled));
        toggle.setAttribute('aria-label', texts[channel] + ': ' + (enabled ? texts.enabled : texts.disabled));
        const slider = document.getElementById('audio-' + channel + '-volume');
        slider.value = volume;
        slider.setAttribute('aria-label', texts[channel] + ': ' + texts.volume);
        document.getElementById('audio-' + channel + '-percent').textContent = volume + '%';
    }
    document.getElementById('audio-close').textContent = texts.close;
    document.getElementById('audio-dismiss').setAttribute('aria-label', texts.close);
}

function playClickSound() {
    if (!AudioSettings.get().sfxEnabled || !initAudio()) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(sfxBus);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

function playCashSound() {
    if (!AudioSettings.get().sfxEnabled || !initAudio()) return;

    const now = audioCtx.currentTime;
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';
    osc1.frequency.setValueAtTime(987.77, now);
    osc1.frequency.setValueAtTime(1318.51, now + 0.08);
    osc2.frequency.setValueAtTime(1318.51, now);
    osc2.frequency.setValueAtTime(1758.21, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(sfxBus);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
}

function playSirenSound() {
    if (!AudioSettings.get().sfxEnabled || !initAudio()) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(sfxBus);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
}

function playLoseSound() {
    if (!AudioSettings.get().sfxEnabled || !initAudio()) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(sfxBus);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
}
