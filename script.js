// script.js
const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const toggleModeBtn = document.getElementById('toggle-mode-btn');
const difficultySelect = document.getElementById('difficulty');
const statusDiv = document.getElementById('status');
let currentPlayer = 'X';
let boardState = Array(9).fill(null);
let gameActive = true;
let singlePlayerMode = true;
let startingPlayer = 'O'; // Track who starts first
let difficulty = 'hard'; // Default difficulty

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }
    return boardState.includes(null) ? null : 'T'; // 'T' for tie
}

function updateStatus() {
    const winner = checkWinner();
    if (winner === 'X') {
        statusDiv.textContent = 'You Win!';
    } else if (winner === 'O') {
        statusDiv.textContent = 'AI Wins!';
    } else if (winner === 'T') {
        statusDiv.textContent = "It's a tie!";
    } else {
        if (singlePlayerMode) {
            statusDiv.textContent = currentPlayer === 'X' ? "Your Turn" : "AI's Turn";
        } else {
            statusDiv.textContent = currentPlayer === 'X' ? "Player 1's Turn" : "Player 2's Turn";
        }
    }
}

function handleClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    if (boardState[index] || !gameActive) return;

    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    const winner = checkWinner();
    if (winner) {
        setTimeout(() => {
            updateStatus(); // Display the winning message
            gameActive = false;
            setTimeout(restartGame, 3000); // Auto-restart after 3 seconds
        }, 10);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus(); // Update the turn message
        if (currentPlayer === 'O' && gameActive && singlePlayerMode) {
            setTimeout(singlePlayerMove, 1000); // 1-second delay before AI move
        }
    }
}

function singlePlayerMove() {
    const bestMove = difficulty === 'easy' ? getRandomMove() : 
                     difficulty === 'normal' ? getNormalMove() : getBestMove();

    if (bestMove === -1) return; // No move possible

    const cell = cells[bestMove];
    const index = Array.from(cells).indexOf(cell);

    boardState[index] = 'O';
    cell.textContent = 'O';
    cell.classList.add('O');

    const winner = checkWinner();
    if (winner) {
        setTimeout(() => {
            updateStatus(); // Display the winning message
            gameActive = false;
            setTimeout(restartGame, 3000); // Auto-restart after 3 seconds
        }, 10);
    } else {
        currentPlayer = 'X';
        updateStatus(); // Update the turn message back to "Your Turn"
    }
}

function getRandomMove() {
    const availableMoves = boardState.map((val, index) => val === null ? index : null).filter(val => val !== null);
    return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : -1;
}

function getNormalMove() {
    // Normal mode AI logic: Take the center if available, otherwise random move.
    if (boardState[4] === null) return 4;
    return getRandomMove();
}

function getBestMove() {
    let bestValue = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (boardState[i] === null) {
            boardState[i] = 'O';
            const moveValue = minimax(boardState, 0, false);
            boardState[i] = null;
            if (moveValue > bestValue) {
                bestValue = moveValue;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    const winner = checkWinner();
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (winner === 'T') return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return best;
    }
}

function restartGame() {
    boardState.fill(null);
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    gameActive = true;
    currentPlayer = startingPlayer; // Start with the previously set starting player
    updateStatus(); // Reset the status to the current player's turn
    if (startingPlayer === 'O' && singlePlayerMode) {
        setTimeout(singlePlayerMove, 1000); // AI starts first if set
    }
    startingPlayer = startingPlayer === 'X' ? 'O' : 'X'; // Alternate the starting player
}

function toggleMode() {
    singlePlayerMode = !singlePlayerMode;
    toggleModeBtn.textContent = singlePlayerMode ? 'Switch to Multiplayer' : 'Switch to Single Player';
    restartGame();
}

function updateDifficulty() {
    difficulty = difficultySelect.value;
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);
toggleModeBtn.addEventListener('click', toggleMode);
difficultySelect.addEventListener('change', updateDifficulty);

// Initialize the game with the first status update
updateStatus();
