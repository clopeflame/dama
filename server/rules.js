function validateRules(board, fromX, fromY, toX, toY, color) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const piece = board[fromY][fromX];
  if (!piece || piece.color !== color) return { valid: false };

  const direction = color === "white" ? -1 : 1;
  let mustCapture = false;
  let captured = null;

  // movimentos simples
  if (Math.abs(dx) === 1 && dy === direction && !board[toY][toX]) return { valid: true, captured: null, mustCapture: false };

  // captura obrigatória
  if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
    const midX = fromX + dx / 2;
    const midY = fromY + dy / 2;
    const midPiece = board[midY][midX];
    if (midPiece && midPiece.color !== color && !board[toY][toX]) captured = { x: midX, y: midY };
    else return { valid: false };
    mustCapture = true;
  }

  // dama voadora
  if (piece.isKing && Math.abs(dx) === Math.abs(dy)) {
    let steps = Math.abs(dx);
    let found = 0;
    let cap = null;
    for (let i = 1; i < steps; i++) {
      const xi = fromX + i * Math.sign(dx);
      const yi = fromY + i * Math.sign(dy);
      const p = board[yi][xi];
      if (p) {
        if (p.color === color) return { valid: false };
        found++;
        cap = { x: xi, y: yi };
      }
    }
    if (found > 1) return { valid: false };
    captured = cap;
    mustCapture = found === 1;
  }

  return { valid: true, captured, mustCapture };
}

module.exports = { validateRules };
