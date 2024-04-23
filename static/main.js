import { initializeGame } from './gameLogic.js';
import { loadModel } from './aiController.js';
import { setupUI } from './uiController.js';
import { loadData } from './utils.js';

document.addEventListener("DOMContentLoaded", function () {
    setupUI();
    loadModel();
    initializeGame();
});
