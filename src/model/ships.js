// Ship definitions (classic Battleship sizes)
export const SHIP_TYPES = [
    { key: "carrier", name: "Carrier", length: 5 },
    { key: "battleship", name: "Battleship", length: 4 },
    { key: "cruiser", name: "Cruiser", length: 3 },
    { key: "submarine", name: "Submarine", length: 3 },
    { key: "destroyer", name: "Destroyer", length: 2 },
  ];
  
  // Helper: build ships list from counts like { carrier:1, battleship:1, ... }
  export function makeShipsFromCounts(shipCounts) {
    const ships = [];
    let idCounter = 1;
  
    for (const type of SHIP_TYPES) {
      const count = shipCounts[type.key] || 0;
      for (let i = 0; i < count; i++) {
        ships.push({
          id: `S${idCounter++}`,
          key: type.key,
          name: type.namSHIP_TYPESe,
          length: type.length,
          // placement info added later:
          placed: false,
          orientation: "H", // "H" or "V"
          cells: [], // [{ r, c }, ...]
          hits: 0,
        });
      }
    }
  
    return ships;
  }
  
  export function getShipLength(shipKey) {
    const found = SHIP_TYPES.find((t) => t.key === shipKey);
    return found ? found.length : null;
  }
  