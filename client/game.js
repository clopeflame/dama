const socket = io();
const boardEl = document.getElementById("board");
const readyBtn = document.getElementById("readyBtn");
const drawBtn = document.getElementById("drawBtn");
const resignBtn = document.getElementById("resignBtn");
const timerEl = document.getElementById("timer");

const playerName = localStorage.getItem("playerName");
const roomId = localStorage.getItem("roomId");
let color, board = [], myTurn = false;

// Entrar na sala
socket.emit("joinRoom", { roomId, name: playerName });

// Atualizar tabuleiro
socket.on("boardUpdate", b => {
  board = b;
  drawBoard();
});

socket.on("turnChange", t => {
  myTurn = (color === t);
});

socket.on("startGame", t => {
  myTurn = (color === t);
});

socket.on("timer", t => {
  timerEl.textContent = t;
});

// Ready
readyBtn.addEventListener("click", () => {
  readyBtn.disabled = true;
  socket.emit("ready");
});

// Empate
drawBtn.addEventListener("click", () => {
  socket.emit("askDraw");
});

socket.on("drawRequest", () => {
  if (confirm("O adversário pediu empate. Aceitar?")) {
    socket.emit("acceptDraw");
  }
});

socket.on("drawAccepted", () => {
  alert("Empate aceito! O jogo reiniciou.");
});

// Desistir
resignBtn.addEventListener("click", () => {
  if (confirm("Deseja desistir?")) socket.emit("resign");
});

socket.on("opponentResigned", () => {
  alert("O adversário desistiu! Você venceu.");
});

// Receber cor do jogador
socket.on("roomUpdate", room => {
  color = room.players[socket.id].color;
});

// Desenhar tabuleiro
function drawBoard() {
  boardEl.innerHTML = "";
  const displayBoard = color === "white" ? board.slice().reverse() : board;
  displayBoard.forEach((row, y) => {
    const displayRow = color === "white" ? row.slice() : row.slice().reverse();
    displayRow.forEach((cell, x) => {
      const div = document.createElement("div");
      div.classList.add("cell", (x + y) % 2 ? "black" : "white");
      div.dataset.x = x;
      div.dataset.y = y;
      if (cell) {
        const piece = document.createElement("div");
        piece.classList.add("piece", cell.color);
        if (cell.isKing) piece.style.boxShadow = "0 0 0 3px gold inset";
        div.appendChild(piece);
      }
      div.addEventListener("click", () => selectCell(x, y));
      boardEl.appendChild(div);
    });
  });
}

let selected = null;

function selectCell(x, y) {
  if (!myTurn) return;
  const piece = board[y][x];
  if (selected) {
    socket.emit("move", { fromX: selected.x, fromY: selected.y, toX: x, toY: y });
    selected = null;
  } else if (piece && piece.color === color) {
    selected = { x, y };
  }
}
