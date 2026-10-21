// Audio engine based on the Web Audio API.
let audioCtx = null;
let isMuted = false;
let isMusicPlaying = false;
let musicInterval = null;

// A quiet background theme in an Eastern mode.
const bgNotes = [
    220.00, 233.08, 277.18, 293.66, 329.63, 349.23, 415.30, 440.00,
    349.23, 329.63, 293.66, 277.18, 233.08
];
let noteStep = 0;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function toggleAudio() {
    isMuted = !isMuted;
    const statusText = document.getElementById('audio-status');
    const btn = document.getElementById('btn-audio');
    
    if (isMuted) {
        statusText.innerText = 'OFF';
        btn.classList.add('opacity-50');
        stopBgMusic();
    } else {
        statusText.innerText = 'ON';
        btn.classList.remove('opacity-50');
        initAudio();
        startBgMusic();
        playClickSound();
    }
}

function startBgMusic() {
    if (isMuted || isMusicPlaying) return;
    isMusicPlaying = true;
    
    musicInterval = setInterval(() => {
        if (isMuted || !audioCtx) return;
        
        const freq = bgNotes[noteStep % bgNotes.length];
        noteStep++;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Soft sine wave with minimal volume (0.01).
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0005, audioCtx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }, 350);
}

function stopBgMusic() {
    isMusicPlaying = false;
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

function playClickSound() {
    if (isMuted) return;
    initAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

function playCashSound() {
    if (isMuted) return;
    initAudio();

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
    gain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.35);
    osc2.stop(now + 0.35);
}

function playSirenSound() {
    if (isMuted) return;
    initAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
}

function playLoseSound() {
    if (isMuted) return;
    initAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
}
