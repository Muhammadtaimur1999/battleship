import { SHIP_TYPES } from "./ships";

// Grid Area >= 2 * Ship Area
export function calcGridArea(size) {
  return size * size;
}

export function calcShipArea(shipCounts) {
  let total = 0;
  for (const t of SHIP_TYPES) {
    const count = shipCounts[t.key] || 0;
    total += count * t.length;
  }
  return total;
}

export function validateSetup({ gridSize, shipCounts }) {
  const errors = [];

  if (gridSize < 5 || gridSize > 10) {
    errors.push("Grid size must be between 5 and 10.");
  }

  const ga = calcGridArea(gridSize);
  const sa = calcShipArea(shipCounts);

  if (sa <= 0) {
    errors.push("You must add at least one ship.");
  }

  if (ga < 2 * sa) {
    errors.push("Too many ships for this grid. Grid area must be at least 2 × ship area.");
  }

  return { ok: errors.length === 0, errors, ga, sa };
}
