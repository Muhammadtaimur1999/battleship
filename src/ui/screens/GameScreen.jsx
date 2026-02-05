import { useEffect, useState } from "react";
import BoardGrid from "../components/BoardGrid";

export default function GameScreen({
  currentPlayerName,
  ownBoard,
  enemyBoard,
  message,
  onShoot,
  onRestart,
}) {
  const [cursor, setCursor] = useState({ r: 0, c: 0 });

  useEffect(() => {
    // reset cursor when turn changes
    setCursor({ r: 0, c: 0 });
  }, [currentPlayerName]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "ArrowUp") {
        setCursor((p) => ({ r: Math.max(0, p.r - 1), c: p.c }));
      } else if (e.key === "ArrowDown") {
        setCursor((p) => ({
          r: Math.min(enemyBoard.size - 1, p.r + 1),
          c: p.c,
        }));
      } else if (e.key === "ArrowLeft") {
        setCursor((p) => ({ r: p.r, c: Math.max(0, p.c - 1) }));
      } else if (e.key === "ArrowRight") {
        setCursor((p) => ({
          r: p.r,
          c: Math.min(enemyBoard.size - 1, p.c + 1),
        }));
      } else if (e.key === "Enter" || e.key === " ") {
        onShoot(cursor.r, cursor.c);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cursor, enemyBoard.size, onShoot]);

  function clickShoot(r, c) {
    setCursor({ r, c });
    onShoot(r, c);
  }

  return (
    <div className="gameShell">
      <div className="card">
        <div className="topBar">
          <div>
            <h2 className="turnTitle">Turn: {currentPlayerName}</h2>
            <div style={{ color: "var(--muted)", marginTop: 4, fontSize: 14 }}>
              Click to shoot or use <b>arrow keys</b> + <b>Enter</b>. Press{" "}
              <b>Space</b> also works.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {message ? <div className="msgPill">{message}</div> : null}
            <button className="ghostBtn" onClick={onRestart}>
              Restart
            </button>
          </div>
        </div>

        <div className="legendRow">
          <div className="legendItem">
            <span className="swatch" style={{ background: "#7a2d2d" }} />
            Hit
          </div>
          <div className="legendItem">
            <span className="swatch" style={{ background: "#2f4a5a" }} />
            Miss
          </div>
          <div className="legendItem">
            <span className="swatch" style={{ background: "#5a5a5a" }} />
            Ship (own board)
          </div>
          <div className="legendItem">
            <span
              className="swatch"
              style={{ background: "transparent", border: "2px solid #9ad" }}
            />
            Cursor
          </div>
        </div>

        <div className="boardGrid">
          <div className="boardPanel">
            <div className="boardHeader">
              <h3 className="boardTitle">Your board</h3>
              <div className="boardHint">Ships visible</div>
            </div>
            <BoardGrid board={ownBoard} showShips={true} />
          </div>

          <div className="boardPanel">
            <div className="boardHeader">
              <h3 className="boardTitle">Enemy board</h3>
              <div className="boardHint">Ships hidden</div>
            </div>
            <BoardGrid
              board={enemyBoard}
              showShips={false}
              onCellClick={clickShoot}
              cursorCell={cursor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
