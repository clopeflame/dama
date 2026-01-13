const { validateRules } = require("./rules");

function createBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 8; x++) if ((x + y) % 2 === 1) board[y][x] = { color: "black", isKing: false };
  }
  for (let y = 5; y < 8; y++) {
    for (let x = 0; x < 8; x++) if ((x + y) % 2 === 1) board[y][x] = { color: "white", isKing: false };
  }
  return board;
}

function performMove(board, fromX, fromY, toX, toY) {
  const piece = board[fromY][fromX];
  if (!piece) return { valid: false };
  const moveValid = validateRules(board, fromX, fromY, toX, toY, piece.color);
  if (!moveValid.valid) return { valid: false };

  board[toY][toX] = piece;
  board[fromY][fromX] = null;
  if (moveValid.captured) board[moveValid.captured.y][moveValid.captured.x] = null;

  // promover a dama
  if (!piece.isKing && ((piece.color === "white" && toY === 0) || (piece.color === "black" && toY === 7))) piece.isKing = true;

  return { valid: true };
}

function validateMove(board, x, y, color) {
  return validateRules(board, x, y, x, y, color);
}

module.exports = { createBoard, performMove, validateMove };
