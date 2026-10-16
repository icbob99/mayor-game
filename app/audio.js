// Аудио-движок на базе Web Audio API
let audioCtx = null;
let isMuted = false;
let isMusicPlaying = false;
let musicInterval = null;

// Мелодия (ноты и ритм для фоновой темы)
const bgNotes = [
    220.00, 233.08, 277.18, 293.66, 329.63, 349.23, 415.30, 440.00, // Восточная гамма (A Phrygian Dominant)
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

// Запуск фоновой музыки
function startBgMusic() {
    if (isMuted || isMusicPlaying) return;
    isMusicPlaying = true;

    // Играем 1 ноту каждые 300 мс (спокойный ритм)
    musicInterval = setInterval(() => {
        if (isMuted || !audioCtx) return;

        const freq = bgNotes[noteStep % bgNotes.length];
        noteStep++;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Мягкая волна (sine/triangle) для ненавязчивого фона
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Очень тихий фоновый уровень (0.02)
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.28);
    }, 320);
}

function stopBgMusic() {
    isMusicPlaying = false;
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
}

// 1. Звук клика / монетки (при выборе ответа)
function playClickSound() {
    if (isMuted) return;
    initAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// 2. Звук сирены (Арест / Лахав 433)
function playSirenSound() {
    if (isMuted) return;
    initAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(900, audioCtx.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(600, audioCtx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
}

// 3. Звук проигрыша (Драма / Инфаркт / Выборы)
function playLoseSound() {
    if (isMuted) return;
    initAudio();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, audioCtx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
}