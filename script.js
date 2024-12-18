const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

const rows = 20;
const columns = 10;
const blockSize = 30; // Size of each block in the grid
let score = 0;

// Tetromino shapes
const tetrominoes = [
  [[1, 1, 1, 1]], // I Shape
  [[1, 1], [1, 1]], // O Shape
  [[0, 1, 1], [1, 1, 0]], // S Shape
  [[1, 1, 0], [0, 1, 1]], // Z Shape
  [[1, 0, 0], [1, 1, 1]], // L Shape
  [[0, 0, 1], [1, 1, 1]], // J Shape
  [[0, 1, 0], [1, 1, 1]]  // T Shape
];

let currentTetromino = randomTetromino();
let currentPosition = { x: 3, y: 0 };
let board = Array.from({ length: rows }, () => Array(columns).fill(false));

function gameLoop() {
  moveTetrominoDown();
  drawGame();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  score = 0;
  currentPosition = { x: 3, y: 0 };
  currentTetromino = randomTetromino();
  board = Array.from({ length: rows }, () => Array(columns).fill(false));
  gameLoop();
}

function randomTetromino() {
  const index = Math.floor(Math.random() * tetrominoes.length);
  return tetrominoes[index];
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTetromino(currentTetromino, currentPosition);
  drawBoard();
  updateScore();
}

function drawTetromino(tetromino, position) {
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col]) {
        ctx.fillStyle = "red";
        ctx.fillRect((position.x + col) * blockSize, (position.y + row) * blockSize, blockSize, blockSize);
        ctx.strokeStyle = "white";
        ctx.strokeRect((position.x + col) * blockSize, (position.y + row) * blockSize, blockSize, blockSize);
      }
    }
  }
}

function moveTetrominoDown() {
  if (canMove(0, 1)) {
    currentPosition.y++;
  } else {
    placeTetromino();
    if (currentPosition.y === 0) {
      alert("Game Over! Final Score: " + score);
      startGame();
    }
  }
}

function canMove(dx, dy, tetromino = currentTetromino) {
  for (let row = 0; row < tetromino.length; row++) {
    for (let col = 0; col < tetromino[row].length; col++) {
      if (tetromino[row][col]) {
        const newX = currentPosition.x + col + dx;
        const newY = currentPosition.y + row + dy;
        if (newX < 0 || newX >= columns || newY >= rows || board[newY][newX]) {
          return false;
        }
      }
    }
  }
  return true;
}

function placeTetromino() {
  for (let row = 0; row < currentTetromino.length; row++) {
    for (let col = 0; col < currentTetromino[row].length; col++) {
      if (currentTetromino[row][col]) {
        board[currentPosition.y + row][currentPosition.x + col] = true;
      }
    }
  }
  removeFullLines();
  currentTetromino = randomTetromino();
  currentPosition = { x: 3, y: 0 };
}

function removeFullLines() {
  for (let row = 0; row < rows; row++) {
    if (board[row].every(cell => cell)) {
      board.splice(row, 1);
      board.unshift(Array(columns).fill(false));
      score += 100;
    }
  }
}

function drawBoard() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      if (board[row][col]) {
        ctx.fillStyle = "blue";
        ctx.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
        ctx.strokeStyle = "white";
        ctx.strokeRect(col * blockSize, row * blockSize, blockSize, blockSize);
      }
    }
  }
}

function updateScore() {
  document.getElementById("score").textContent = "Score: " + score;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && canMove(-1, 0)) {
    currentPosition.x--;
  }
  if (e.key === "ArrowRight" && canMove(1, 0)) {
    currentPosition.x++;
  }
  if (e.key === "ArrowDown") {
    moveTetrominoDown();
  }
  if (e.key === "ArrowUp") {
    rotateTetromino();
  }
});

function rotateTetromino() {
  const rotatedTetromino = rotateMatrix(currentTetromino);
  if (canMove(0, 0, rotatedTetromino)) {
    currentTetromino = rotatedTetromino;
  }
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, index) => matrix.map(row => row[index])).reverse();
}

startGame();
