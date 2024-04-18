document.addEventListener("DOMContentLoaded", function () {
    const boardSize = 15;
    const gameBoard = document.getElementById('gameBoard');
    let board = Array(boardSize).fill().map(() => Array(boardSize).fill(" "));
    let model = null;

    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.addEventListener('click', () => handleCellClick(Math.floor(i / boardSize), i % boardSize));
        gameBoard.appendChild(cell);
    }

    function handleCellClick(row, col) {
        if (board[row][col] === " ") { // Ensure the cell is empty
            board[row][col] = "X"; // Player 'X' makes a move
            updateBoard();
            if (checkWin(board, "X", row, col)) {
                alert("Player X wins!"); // Alert if player 'X' wins
                // Optional: Reset the board or implement additional game over logic here
                return; // Stop further execution if there's a win
            }
            makeAIMove();
        } else {
            console.error("Cell is already taken!"); // Log error if cell is not empty
        }
    }


    function updateBoard() {
        console.log('Updating visual board representation');
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                const cellIndex = i * 15 + j;
                const cell = gameBoard.children[cellIndex];
                cell.className = ''; // Reset classes
                if (board[i][j] === "X") {
                    cell.classList.add('player');
                } else if (board[i][j] === "O") {
                    cell.classList.add('ai');
                }
            }
        }
    }



    async function loadModel() {
        // Directly load the specific model named DISPREZZO
        const modelPath = `${location.origin}/Models/DISPREZZO/model.json`;
        try {
            model = await tf.loadLayersModel(modelPath);
            console.log('Model loaded successfully.');
            model.summary(); // Optionally print model summary to the console if needed
        } catch (error) {
            console.error('Failed to load the model:', error);
            alert('Failed to load the model. Please check the console for more details.');
        }
    }

    loadModel(); // Load the model when the document is ready

    function checkWin(board, player, row, col) {
        const directions = [
            { dr: 1, dc: 0 }, // vertical
            { dr: 0, dc: 1 }, // horizontal
            { dr: 1, dc: 1 }, // diagonal down-right
            { dr: 1, dc: -1 } // diagonal down-left
        ];

        const inBounds = (r, c) => r >= 0 && r < 15 && c >= 0 && c < 15;

        for (let { dr, dc } of directions) {
            let count = 1; // Start with the current piece

            // Check in the positive direction
            let [r, c] = [row + dr, col + dc];
            while (inBounds(r, c) && board[r][c] === player) {
                count++;
                r += dr;
                c += dc;
            }

            // Check in the negative direction
            [r, c] = [row - dr, col - dc];
            while (inBounds(r, c) && board[r][c] === player) {
                count++;
                r -= dr;
                c -= dc;
            }

            // Check if we have a line of 5
            if (count >= 5) {
                return true; // Winning condition met
            }
        }

        return false; // No win found
    }


    async function makeAIMove() {
        if (model) {
            const possibleMoves = [];
            const movesList = [];

            // Prepare the board data for the model, creating separate channels
            const inputDataX = board.map(row => row.map(cell => cell === "X" ? 1 : 0));
            const inputDataO = board.map(row => row.map(cell => cell === "O" ? 1 : 0));

            // Find all empty cells and prepare possible move states
            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 15; j++) {
                    if (board[i][j] === " ") {
                        const newInputDataX = inputDataX.map(row => row.slice());
                        const newInputDataO = inputDataO.map(row => row.slice());
                        newInputDataO[i][j] = 1; // Simulate an AI move on the board

                        const combinedData = [];
                        for (let m = 0; m < 15; m++) {
                            const channelData = [];
                            for (let n = 0; n < 15; n++) {
                                channelData.push([newInputDataX[m][n], newInputDataO[m][n]]);
                            }
                            combinedData.push(channelData);
                        }
                        possibleMoves.push(combinedData);
                        movesList.push({ i, j });
                    }
                }
            }

            if (possibleMoves.length > 0) {
                // Create a tensor from the combined data for all possible moves
                const inputTensor = tf.tensor4d(possibleMoves, [possibleMoves.length, 15, 15, 2]);

                console.log("AI is thinking...");
                try {
                    // Predict the next moves using the model
                    const predictions = await model.predict(inputTensor).data();

                    // Evaluate the predictions and select the best move
                    let minPrediction = Infinity;
                    let bestMove = null;
                    for (let idx = 0; idx < predictions.length; idx++) {
                        if (predictions[idx] < minPrediction) {
                            minPrediction = predictions[idx];
                            bestMove = movesList[idx];
                        }
                    }

                    // Make the AI move if a valid move is found
                    if (bestMove) {
                        board[bestMove.i][bestMove.j] = "O"; // AI places an 'O'
                        updateBoard();
                        if (checkWin(board, "O", bestMove.i, bestMove.j)) {
                            alert("AI wins!"); // Alert if AI wins
                            // Optional: Reset the board or implement additional game over logic here
                        }
                    }
                } catch (error) {
                    console.error('Error during model prediction:', error);
                    alert('An error occurred while making AI move. Please check the console for details.');
                }
            } else {
                console.log("No possible AI moves left.");
            }
        } else {
            console.log("Model is not loaded, no AI moves can be made.");
        }
    }



});
