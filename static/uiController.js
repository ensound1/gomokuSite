import { resetGame, handleCellClick} from './gameLogic.js';
import {gameStats} from './utils.js';

export function setupUI() {
    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', resetGame);

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.addEventListener('click', event => {
            const index = parseInt(event.target.getAttribute('data-index'));
            const row = Math.floor(index / 15);
            const col = index % 15;
            handleCellClick(row, col);
        });
    });

    updateUIStats();
}

export function updateBoard(board) {
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellDiv = document.querySelector(`.cell[data-index="${rowIndex * 15 + colIndex}"]`);
            cellDiv.className = 'cell'; // Reset class
            if (cell === "X") {
                cellDiv.classList.add('player');
            } else if (cell === "O") {
                cellDiv.classList.add('ai');
            }
        });
    });
}

export function updateUIStats() {
    const winsSpan = document.getElementById('wins');
    const totalSpan = document.getElementById('totalGames');
    winsSpan.textContent = gameStats.wins;
    totalSpan.textContent = gameStats.total;
}
