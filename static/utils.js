import { updateUIStats } from './uiController.js';


export let gameStats = { wins: 0, total: 0 };

export function loadData() {
    const statsString = localStorage.getItem('gameStats');
    if (!statsString) {
        console.err("No game stats found in localStorage.");
        return { wins: 0, total: 0 }; // Return default stats if not found
    }

    try {
        const stats = JSON.parse(statsString);
        updateUIStats(stats); // Update UI with loaded stats
        return stats;
    } catch (error) {
        console.error("Error parsing game stats from localStorage:", error);
        return { wins: 0, total: 0 }; // Return default stats in case of parsing error
    }
}


export function updateGameStats(stats) {
    localStorage.setItem('gameStats', JSON.stringify(stats));
}

export function endGame(playerWon) {
    console.log(`Game ended. Win: ${playerWon}`);
    alert(playerWon ? "Player wins!" : "AI wins!");
    //resetGame();
}