import { checkWin} from './gameLogic.js';
import { updateBoard } from './uiController.js';

let model = null;
let modelReady = false;

export async function loadModel() {
    const modelPath = '../common/Models/DISPREZZO/model.json';
    try {
        model = await tf.loadLayersModel(modelPath);
        console.log('Model loaded successfully.');
        modelReady = true;
    } catch (error) {
        console.error('Failed to load the model:', error);
        alert('Failed to load the model. Please check the console for more details.');
        modelReady = false;
    }
}

export async function makeAIMove(board) {
    if (!modelReady) {
        console.error("Model is not loaded, AI cannot make a move.");
        return;
    }

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
        const inputTensor = tf.tensor4d(possibleMoves, [possibleMoves.length, 15, 15, 2]);

        console.log("AI is thinking...");
        try {
            const predictions = await model.predict(inputTensor).data();

            let minPrediction = Infinity;
            let bestMove = null;
            for (let idx = 0; idx < predictions.length; idx++) {
                if (predictions[idx] < minPrediction) {
                    minPrediction = predictions[idx];
                    bestMove = movesList[idx];
                }
            }

            if (bestMove) {
                board[bestMove.i][bestMove.j] = "O"; // AI places an 'O'
                updateBoard(board);
                return [bestMove.i, bestMove.j];
            }
        } catch (error) {
            console.error('Error during model prediction:', error);
            alert('An error occurred while making AI move. Please check the console for details.');
        }
    } else {
        console.log("No possible AI moves left.");
    }
}
