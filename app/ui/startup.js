import { state } from '../game/game-state.js';
import { getStartupTexts } from './language-utils.js';

let gameDataLoadFailed = false;

function renderStartupStatus() {
    const texts = getStartupTexts(state.lang);
    document.getElementById('event-title').innerText = gameDataLoadFailed ? texts.loadFailed : texts.loading;
    document.getElementById('event-desc').innerText = gameDataLoadFailed ? texts.reload : '';
}


function showStartupFailure() { gameDataLoadFailed = true; renderStartupStatus(); }

export { renderStartupStatus, showStartupFailure };
