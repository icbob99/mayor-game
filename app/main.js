import { startGame } from './game/game.js';
import { initializeControls } from './ui/controls.js';
import { initializeModes } from './ui/modes.js';

initializeControls();
initializeModes();
void startGame();
