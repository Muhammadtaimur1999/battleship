import { useEffect, useMemo, useRef, useState } from "react";
import BoardGrid from "../components/BoardGrid";
import { canPlaceShip, cloneBoard, placeShip } from "../../model/board";

export default function PlacementScreen({ playerName, board, ships, onDone }) {
  const boardRef = useRef(null);

  const [orientation, setOrientation] = useState("H");
  const [errorMsg, setErrorMsg] = useState("");

  const [dragShipId, setDragShipId] = useState(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hoverCell, setHoverCell] = useState(null); // {r,c} or null

  const shipsLeft = useMemo(() => ships.filter((s) => !s.placed), [ships]);
  const allPlaced = shipsLeft.length === 0;

  // Clear errors when done
  useEffect(() => {
    if (allPlaced) setErrorMsg("");
  }, [allPlaced]);

  // R rotates ship while placing
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "r" || e.key === "R") {
        setOrientation((old) => (old === "H" ? "V" : "H"));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function pointerToCell(x, y) {
    const el = boardRef.current;
    if (!el) return null;

    const rect = el.getBoundingClientRect();

    // Must match BoardGrid layout: padding=8, cell=36, gap=2
    const PADDING = 8;
    const CELL = 36;
    const GAP = 2;

    const localX = x - rect.left - PADDING;
    const localY = y - rect.top - PADDING;

    if (localX < 0 || localY < 0) return null;

    const step = CELL + GAP;
    const c = Math.floor(localX / step);
    const r = Math.floor(localY / step);

    if (r < 0 || c < 0 || r >= board.size || c >= board.size) return null;

    return { r, c };
  }

  // Build preview cells list from hover start
  function cellsFromStart(start, ship, orient) {
    if (!start) return [];
    const cells = [];
    for (let i = 0; i < ship.length; i++) {
      const r = orient === "V" ? start.r + i : start.r;
      const c = orient === "H" ? start.c + i : start.c;
      cells.push({ r, c });
    }
    return cells;
  }

  const draggingShip = useMemo(() => {
    if (!dragShipId) return null;
    return shipsLeft.find((s) => s.id === dragShipId) || null;
  }, [dragShipId, shipsLeft]);

  const previewCells = useMemo(() => {
    if (!draggingShip) return [];
    return cellsFromStart(hoverCell, draggingShip, orientation);
  }, [draggingShip, hoverCell, orientation]);

  const previewOk = useMemo(() => {
    if (!draggingShip || !hoverCell) return true;
    return canPlaceShip(
      board,
      draggingShip,
      hoverCell.r,
      hoverCell.c,
      orientation
    );
  }, [board, draggingShip, hoverCell, orientation]);

  // When dragging: track pointer + drop
  useEffect(() => {
    if (!dragShipId) return;

    function onMove(e) {
      setPointer({ x: e.clientX, y: e.clientY });
      setHoverCell(pointerToCell(e.clientX, e.clientY));
    }

    function onUp() {
      // Drop logic
      if (!draggingShip || !hoverCell) {
        setDragShipId(null);
        setHoverCell(null);
        return;
      }

      if (!previewOk) {
        setErrorMsg("Invalid placement (out of bounds or overlap).");
        setDragShipId(null);
        setHoverCell(null);
        return;
      }

      const nextBoard = cloneBoard(board);
      const result = placeShip(
        nextBoard,
        draggingShip,
        hoverCell.r,
        hoverCell.c,
        orientation
      );

      if (!result.ok) {
        setErrorMsg(result.reason);
        setDragShipId(null);
        setHoverCell(null);
        return;
      }

      const nextShips = ships.map((s) =>
        s.id === draggingShip.id ? result.ship : s
      );
      setErrorMsg("");
      setDragShipId(null);
      setHoverCell(null);

      onDone({ board: nextBoard, ships: nextShips });
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [
    dragShipId,
    board,
    ships,
    draggingShip,
    hoverCell,
    orientation,
    previewOk,
    onDone,
  ]);

  function startDrag(shipId, e) {
    if (allPlaced) return;

    setErrorMsg("");
    setDragShipId(shipId);
    setPointer({ x: e.clientX, y: e.clientY });
    setHoverCell(pointerToCell(e.clientX, e.clientY));
  }

  function finishPlacement() {
    if (!allPlaced) {
      setErrorMsg("Place all ships before continuing.");
      return;
    }
    onDone({ board, ships, confirm: true });
  }

  return (
    <div className="gameShell">
      <div className="card">
        <div className="headerRow">
          <div className="brand">
            <h1 className="gameName" style={{ fontSize: 34 }}>
              Ship placement: {playerName}
            </h1>
            <p className="tagline">
              Drag ships onto the grid to lock your fleet.
            </p>
          </div>
          <div className="badge">Neon Battleships</div>
        </div>

        <div className="hintRow">
          <div className="hintChip">
            <span className="hintKey">Drag</span>
            <span>Drop ships onto the grid</span>
          </div>
          <div className="hintChip">
            <span className="hintKey">R</span>
            <span>Rotate</span>
          </div>
          <div className="hintChip">
            <span className="hintKey">{orientation === "H" ? "H" : "V"}</span>
            <span>Current orientation</span>
          </div>
        </div>

        <div className="twoCol">
          <div className="sideCard" style={{ width: "fit-content" }}>
            <BoardGrid
              board={board}
              boardRef={boardRef}
              previewCells={previewCells}
              previewOk={previewOk}
            />
          </div>

          <div className="sideCard">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <div className="panelTitle">Ships left</div>
                <div className="subText" style={{ marginBottom: 10 }}>
                  Place all ships before confirming.
                </div>
              </div>
              <div className="pill">{shipsLeft.length} remaining</div>
            </div>

            {shipsLeft.length === 0 ? (
              <div
                style={{ opacity: 0.9, color: "var(--green)", fontWeight: 700 }}
              >
                All ships placed ✅
              </div>
            ) : (
              <div style={{ display: "grid", gap: 10 }}>
                {shipsLeft.map((s) => (
                  <div
                    key={s.id}
                    onPointerDown={(e) => startDrag(s.id, e)}
                    className="shipCard"
                  >
                    <div className="shipTop">
                      <div style={{ fontWeight: 800 }}>{s.name}</div>
                      <div className="pill">len {s.length}</div>
                    </div>
                    <div
                      style={{
                        color: "var(--muted)",
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    >
                      Drag to place
                    </div>
                  </div>
                ))}
              </div>
            )}

            {errorMsg && (
              <div className="error" style={{ marginTop: 12 }}>
                {errorMsg}
              </div>
            )}

            <button
              onClick={finishPlacement}
              className="primaryBtn"
              disabled={!allPlaced}
              title={!allPlaced ? "Place all ships first" : "Confirm placement"}
            >
              Confirm placement
            </button>
          </div>
        </div>

        {/* Drag ghost */}
        {draggingShip && (
          <div
            style={{
              position: "fixed",
              left: pointer.x + 12,
              top: pointer.y + 12,
              padding: 12,
              borderRadius: 14,
              background: "rgba(15,26,46,0.92)",
              border: "1px solid rgba(87,214,255,0.22)",
              boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontWeight: 900 }}>{draggingShip.name}</div>
            <div style={{ opacity: 0.85, fontSize: 13, marginTop: 2 }}>
              {orientation === "H" ? "Horizontal" : "Vertical"} • length{" "}
              {draggingShip.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
