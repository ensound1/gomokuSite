import { updateUIStats } from './uiController.js';


export let gameStats = { wins: 0, total: 0 };

// Function to load data from localStorage
export function loadData() {
    const statsString = localStorage.getItem('gameStats');

    if (!statsString) {
        console.log("No game stats found in localStorage.");
        gameStats = { wins: 0, total: 0 }; // Initialize gameStats if not found
    } else {
        try {
            gameStats = JSON.parse(statsString);
            console.log(gameStats);
        } catch (error) {
            console.log("Error parsing game stats from localStorage:", error);
            gameStats = { wins: 0, total: 0 }; // Reset to default on error
        }
    }

    updateUIStats(); // Update the UI in both cases
}



export function updateGameStats() {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
}

export function endGame(playerWon) {
    console.log(`Game ended. Win: ${playerWon}`);
    alert(playerWon ? "Player wins!" : "AI wins!");
    //resetGame();
}