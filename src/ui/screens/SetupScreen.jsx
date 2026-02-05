import { useMemo, useState } from "react";
import { SHIP_TYPES } from "../../model/ships";
import { validateSetup } from "../../model/setupValidation";

export default function SetupScreen({ onStart }) {
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [gridSize, setGridSize] = useState(8);

  const [shipCounts, setShipCounts] = useState(() => ({
    carrier: 1,
    battleship: 1,
    cruiser: 1,
    submarine: 1,
    destroyer: 1,
  }));

  const validation = useMemo(() => {
    return validateSetup({ gridSize, shipCounts });
  }, [gridSize, shipCounts]);

  function changeShipCount(key, newValue) {
    const num = Number(newValue);
    setShipCounts((old) => ({
      ...old,
      [key]: Number.isFinite(num) ? Math.max(0, num) : 0,
    }));
  }

  function startGame() {
    if (!validation.ok) return;

    const p1 = player1Name.trim() || "Player 1";
    const p2 = player2Name.trim() || "Player 2";

    onStart({
      player1Name: p1,
      player2Name: p2,
      gridSize,
      shipCounts,
    });
  }

  return (
    <div className="gameShell">
      <div className="card">
        <div className="headerRow">
          <div className="brand">
            <h1 className="gameName">Neon Battleships</h1>
            <p className="tagline">
              Set up the match. Place ships. Sink them all.
            </p>
          </div>
        </div>

        <div className="grid2">
          <div className="field">
            <div className="label">Player 1 name</div>
            <input
              className="input"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
            />
          </div>

          <div className="field">
            <div className="label">Player 2 name</div>
            <input
              className="input"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
            />
          </div>
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <div className="label">Grid size (5 to 10)</div>
          <div className="sliderRow">
            <input
              className="slider"
              type="range"
              min={5}
              max={10}
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
            />
            <div
              style={{ width: 34, textAlign: "right", color: "var(--muted)" }}
            >
              {gridSize}
            </div>
          </div>
        </div>

        <div className="sectionTitle">Ships</div>

        <div style={{ display: "grid", gap: 10 }}>
          {SHIP_TYPES.map((t) => (
            <div key={t.key} className="shipRow">
              <div>
                <div className="shipName">{t.name}</div>
                <div className="shipMeta">Length {t.length}</div>
              </div>

              <input
                className="input"
                type="number"
                min={0}
                value={shipCounts[t.key] || 0}
                onChange={(e) => changeShipCount(t.key, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="kpiBox">
          <div className="kpiRow">
            <span>Grid area (GA)</span>
            <b>{validation.ga}</b>
          </div>
          <div className="kpiRow">
            <span>Ship area (SA)</span>
            <b>{validation.sa}</b>
          </div>
          <div className="rule">Rule: GA must be at least 2 × SA</div>

          {!validation.ok && (
            <div className="error">
              {validation.errors.map((msg) => (
                <div key={msg}>• {msg}</div>
              ))}
            </div>
          )}
        </div>

        <button className="btn" onClick={startGame} disabled={!validation.ok}>
          Start placement
        </button>
      </div>
    </div>
  );
}
