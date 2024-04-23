import { initializeGame } from './gameLogic.js';
import { loadModel } from './aiController.js';
import { setupUI } from './uiController.js';

document.addEventListener("DOMContentLoaded", function () {
    setupUI();
    loadModel();
    initializeGame();
});
