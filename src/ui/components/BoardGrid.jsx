export default function BoardGrid({
  board,
  boardRef,
  onCellClick,
  showShips = true,
  previewCells = [],
  previewOk = true,
  cursorCell = null,
}) {
  const size = board.size;
  const previewSet = new Set(previewCells.map((p) => `${p.r},${p.c}`));

  return (
    <div
      ref={boardRef}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${size}, 36px)`,
        gridTemplateRows: `repeat(${size}, 36px)`,
        gap: 2,
        background: "#2a2a2a",
        padding: 8,
        borderRadius: 10,
        width: "fit-content",
      }}
    >
      {board.cells.flatMap((row, r) =>
        row.map((cell, c) => {
          const shipVisible = showShips && cell.hasShip;
          const isShot = cell.shot;
          const isHit = cell.hit;

          let bg = "#3a3a3a";
          if (shipVisible) bg = "#5a5a5a";
          if (isShot && !isHit) bg = "#2f4a5a";
          if (isShot && isHit) bg = "#7a2d2d";

          const isPreview = previewSet.has(`${r},${c}`);
          const isCursor =
            cursorCell && cursorCell.r === r && cursorCell.c === c;

          let border = "1px solid #444";
          if (isPreview) border = `2px solid ${previewOk ? "#9f9" : "#ff8a8a"}`;
          if (isCursor) border = "2px solid #9ad";

          return (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick && onCellClick(r, c)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 6,
                cursor: onCellClick ? "pointer" : "default",
                background: bg,
                border,
              }}
              title={`${r},${c}`}
            />
          );
        })
      )}
    </div>
  );
}
