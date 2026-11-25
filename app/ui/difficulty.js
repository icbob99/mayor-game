import { AccountSession } from '../game/account-session.js';
import { Difficulty } from '../game/difficulty.js';
import { resetGame } from '../game/game-over.js';
import { currentTexts, state } from '../game/game-state.js';
import { GameModes } from '../game/modes.js';
import { confirmGameAction } from './modes.js';
import { saveGuestGame, updateUI } from './ui.js';

const difficultyIcons = { easy: '🌱', normal: '⚖️', hard: '🔥', insane: '💀' };

function renderDifficulty() {
    const texts = currentTexts?.ui.difficulty;
    if (!texts) return;
    for (const id of ['btn-difficulty', 'btn-end-difficulty']) {
        const button = document.getElementById(id);
        button.hidden = state.mode === 'blitz';
        button.textContent = `${difficultyIcons[state.difficulty]} ${texts[state.difficulty].name}`;
        button.title = button.textContent;
        button.disabled = !AccountSession.canPlay();
    }
    document.getElementById('difficulty-title').textContent = texts.label;
    document.getElementById('difficulty-dismiss').setAttribute('aria-label', texts.close);
    document.getElementById('difficulty-options').replaceChildren(...Object.keys(Difficulty.levels).map(key => {
        const button = document.createElement('button');
        const active = state.difficulty === key;
        button.type = 'button';
        button.dataset.difficulty = key;
        button.textContent = `${difficultyIcons[key]} ${texts[key].name}`;
        button.setAttribute('aria-pressed', String(active));
        button.disabled = !AccountSession.canPlay();
        button.className = `w-full rounded-xl border p-4 text-start font-bold transition ${active
            ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`;
        button.onclick = () => selectDifficulty(key);
        return button;
    }));
}

function toggleDifficulty(show) {
    const dialog = document.getElementById('difficulty-modal');
    if (!show) { dialog.close(); return; }
    if (state.mode === 'blitz' || !currentTexts?.ui.difficulty) return;
    renderDifficulty();
    if (!dialog.open) dialog.showModal();
}

async function selectDifficulty(value) {
    if (state.mode === 'blitz' || !AccountSession.canPlay() || !Object.hasOwn(Difficulty.levels, value)) return;
    if (value === state.difficulty) { toggleDifficulty(false); return; }
    if (state.mode === 'daily' && GameModes.remaining(state) === 0) return;
    if (state.day > 1 && !state.gameOverRecorded && !confirmGameAction(currentTexts.ui.difficulty.restart)) return;
    toggleDifficulty(false);
    if (state.gameOverRecorded || state.day > 1) {
        await resetGame(value);
    } else {
        const healthChange = Difficulty.initialHealth(state.mode, value) - Difficulty.initialHealth(state.mode, state.difficulty);
        state.health = Math.min(100, state.health + healthChange);
        state.difficulty = value;
        saveGuestGame();
        updateUI();
    }
}

export { renderDifficulty, selectDifficulty, toggleDifficulty };
