import { endGame, updateGameStats, gameStats} from './utils.js';
import { updateBoard, updateUIStats} from './uiController.js';
import { makeAIMove } from './aiController.js';

let board = Array(15).fill().map(() => Array(15).fill(" "));
let gameActive = true;

export function initializeGame() {
    board = Array(15).fill().map(() => Array(15).fill(" "));
    gameActive = true;
    updateBoard(board);
}

export function resetGame() {
    initializeGame();
}

export async function handleCellClick(row, col) {
    if (!gameActive || board[row][col] !== " ") {
        alert("Game not active or invalid cell!");
        return;
    }

    board[row][col] = "X"; // Player's move
    updateBoard(board);

    if (checkWin(board, "X", row, col)) {
        gameStats.total++;
        gameStats.wins++;
        updateGameStats();
        updateUIStats();
        gameActive = false;
        endGame(true);
    } else {
        let [aiRow, aiCol] = await makeAIMove(board);
        updateBoard(board);
        if (checkWin(board, "O", aiRow, aiCol)) {
            gameStats.total++;
            updateGameStats();
            updateUIStats();
            gameActive = false;
            endGame(false);
        }
    }
}


export function checkWin(board, player, row, col) {
    const directions = [
        { dr: 1, dc: 0 }, { dr: 0, dc: 1 }, { dr: 1, dc: 1 }, { dr: 1, dc: -1 }
    ];
    const inBounds = (r, c) => r >= 0 && r < 15 && c >= 0 && c < 15;

    for (let { dr, dc } of directions) {
        let count = 1;
        let [r, c] = [row + dr, col + dc];
        while (inBounds(r, c) && board[r][c] === player) {
            count++;
            r += dr;
            c += dc;
        }
        [r, c] = [row - dr, col - dc];
        while (inBounds(r, c) && board[r][c] === player) {
            count++;
            r -= dr;
            c -= dc;
        }
        if (count >= 5) {
            return true; // Winning condition met
        }
    }
    return false;
}
