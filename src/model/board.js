// Board = cells + ships placed on it
// Cell structure:
// { hasShip: false, shipId: null, shot: false, hit: false }

export function makeEmptyBoard(size) {
  const cells = [];
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      row.push({ hasShip: false, shipId: null, shot: false, hit: false });
    }
    cells.push(row);
  }

  return {
    size,
    cells,
    shipsById: {}, // shipId -> ship object
  };
}

export function canPlaceShip(board, ship, startR, startC, orientation) {
  const size = board.size;
  const len = ship.length;

  for (let i = 0; i < len; i++) {
    const r = orientation === "V" ? startR + i : startR;
    const c = orientation === "H" ? startC + i : startC;

    // out of bounds
    if (r < 0 || c < 0 || r >= size || c >= size) return false;

    // overlap
    if (board.cells[r][c].hasShip) return false;
  }

  return true;
}

export function placeShip(board, ship, startR, startC, orientation) {
  if (!canPlaceShip(board, ship, startR, startC, orientation)) {
    return {
      ok: false,
      reason: "Invalid placement (out of bounds or overlap).",
    };
  }

  const len = ship.length;
  const placedCells = [];

  for (let i = 0; i < len; i++) {
    const r = orientation === "V" ? startR + i : startR;
    const c = orientation === "H" ? startC + i : startC;

    board.cells[r][c].hasShip = true;
    board.cells[r][c].shipId = ship.id;
    placedCells.push({ r, c });
  }

  const newShip = {
    ...ship,
    placed: true,
    orientation,
    cells: placedCells,
    hits: 0,
  };

  board.shipsById[ship.id] = newShip;

  return { ok: true, ship: newShip };
}

// Returns: { ok, alreadyShot, hit, sunk, shipId }
export function shootCell(board, r, c) {
  const size = board.size;
  if (r < 0 || c < 0 || r >= size || c >= size) {
    return { ok: false, reason: "Shot out of bounds." };
  }

  const cell = board.cells[r][c];

  if (cell.shot) {
    return {
      ok: true,
      alreadyShot: true,
      hit: cell.hit,
      sunk: false,
      shipId: cell.shipId,
    };
  }

  cell.shot = true;

  if (!cell.hasShip) {
    cell.hit = false;
    return {
      ok: true,
      alreadyShot: false,
      hit: false,
      sunk: false,
      shipId: null,
    };
  }

  // Hit
  cell.hit = true;
  const shipId = cell.shipId;
  const ship = board.shipsById[shipId];

  // Safety (should exist if ship was placed)
  if (!ship) {
    return { ok: true, alreadyShot: false, hit: true, sunk: false, shipId };
  }

  ship.hits += 1;
  const sunk = ship.hits >= ship.length;

  return { ok: true, alreadyShot: false, hit: true, sunk, shipId };
}

export function allShipsSunk(board) {
  const ids = Object.keys(board.shipsById);
  if (ids.length === 0) return false;

  for (const id of ids) {
    const ship = board.shipsById[id];
    if (ship.hits < ship.length) return false;
  }
  return true;
}

export function cloneBoard(board) {
  if (typeof structuredClone === "function") return structuredClone(board);
  return JSON.parse(JSON.stringify(board));
}
