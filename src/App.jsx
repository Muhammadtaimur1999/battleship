import { useState } from "react";
import SetupScreen from "./ui/screens/SetupScreen";
import PlacementScreen from "./ui/screens/PlacementScreen";
import PassScreen from "./ui/screens/PassScreen";
import GameScreen from "./ui/screens/GameScreen";
import { playSound } from "./utils/sound";

import hitSfx from "./assets/sounds/hit.mp3";
import missSfx from "./assets/sounds/miss.mp3";
import sunkSfx from "./assets/sounds/sunk.mp3";

import {
  makeEmptyBoard,
  cloneBoard,
  shootCell,
  allShipsSunk,
} from "./model/board";
import { makeShipsFromCounts } from "./model/ships";

export default function App() {
  const [phase, setPhase] = useState("SETUP"); // SETUP, P1_PLACE, P2_PLACE, PASS, PLAY, GAME_OVER
  const [setup, setSetup] = useState(null);

  const [p1, setP1] = useState(null);
  const [p2, setP2] = useState(null);

  const [turn, setTurn] = useState(1); // 1 or 2
  const [passTo, setPassTo] = useState(1);
  const [message, setMessage] = useState("");
  const [winnerName, setWinnerName] = useState("");

  function handleStart(newSetup) {
    setSetup(newSetup);

    setP1({
      name: newSetup.player1Name,
      board: makeEmptyBoard(newSetup.gridSize),
      ships: makeShipsFromCounts(newSetup.shipCounts),
    });

    setP2({
      name: newSetup.player2Name,
      board: makeEmptyBoard(newSetup.gridSize),
      ships: makeShipsFromCounts(newSetup.shipCounts),
    });

    setMessage("");
    setWinnerName("");
    setPhase("P1_PLACE");
  }

  function handlePlacementUpdate({ board, ships, confirm }) {
    if (phase === "P1_PLACE") {
      setP1((old) => ({ ...old, board, ships }));
      if (confirm) setPhase("P2_PLACE");
      return;
    }

    if (phase === "P2_PLACE") {
      setP2((old) => ({ ...old, board, ships }));
      if (confirm) {
        setTurn(1);
        setPassTo(1);
        setMessage("");
        setPhase("PASS");
      }
    }
  }

  function continueAfterPass() {
    setTurn(passTo);
    setMessage("");
    setPhase("PLAY");
  }

  function shootAt(r, c) {
    if (!p1 || !p2) return;

    const shooter = turn === 1 ? p1 : p2;
    const target = turn === 1 ? p2 : p1;

    const nextTargetBoard = cloneBoard(target.board);
    const result = shootCell(nextTargetBoard, r, c);

    if (result.alreadyShot) {
      setMessage("Already shot there. Choose another cell.");
      return;
    }

    // update target board
    if (turn === 1) setP2((old) => ({ ...old, board: nextTargetBoard }));
    else setP1((old) => ({ ...old, board: nextTargetBoard }));

    playSound(hitSfx, 0.4);

    if (result.hit) {
      if (result.sunk) playSound(sunkSfx, 0.7);
      else playSound(hitSfx, 0.7);
    } else {
      playSound(missSfx, 0.6);
    }

    // win check
    if (allShipsSunk(nextTargetBoard)) {
      setWinnerName(shooter.name);
      setPhase("GAME_OVER");
      setMessage(`${shooter.name} wins!`);
      return;
    }

    // hit = shoot again, miss = switch
    if (result.hit) {
      if (result.sunk) setMessage("Hit! You sunk a ship. Shoot again.");
      else setMessage("Hit! Shoot again.");
      return;
    }

    const nextTurn = turn === 1 ? 2 : 1;
    setMessage("Miss. Turn passes.");
    setPassTo(nextTurn);
    setPhase("PASS");
  }

  function restart() {
    setPhase("SETUP");
    setSetup(null);
    setP1(null);
    setP2(null);
    setMessage("");
    setWinnerName("");
  }

  if (phase === "SETUP") return <SetupScreen onStart={handleStart} />;

  if (!p1 || !p2) return null;

  if (phase === "P1_PLACE") {
    return (
      <PlacementScreen
        playerName={p1.name}
        board={p1.board}
        ships={p1.ships}
        onDone={handlePlacementUpdate}
      />
    );
  }

  if (phase === "P2_PLACE") {
    return (
      <PlacementScreen
        playerName={p2.name}
        board={p2.board}
        ships={p2.ships}
        onDone={handlePlacementUpdate}
      />
    );
  }

  if (phase === "PASS") {
    const name = passTo === 1 ? p1.name : p2.name;
    return <PassScreen nextPlayerName={name} onContinue={continueAfterPass} />;
  }

  if (phase === "PLAY") {
    const me = turn === 1 ? p1 : p2;
    const enemy = turn === 1 ? p2 : p1;

    return (
      <GameScreen
        currentPlayerName={me.name}
        ownBoard={me.board}
        enemyBoard={enemy.board}
        message={message}
        onShoot={shootAt}
        onRestart={restart}
      />
    );
  }

  if (phase === "GAME_OVER") {
    return (
      <div className="gameShell">
        <div className="card winCard">
          <div className="headerRow">
            <div className="brand">
              <h1 className="bigTitle">Game over</h1>
              <p className="winnerLine">
                Winner: <span className="winnerName">{winnerName}</span>
              </p>
            </div>
            <div className="badge">Neon Battleships</div>
          </div>

          <div className="bigCtaRow">
            <button
              className="primaryBtn"
              onClick={restart}
              style={{ width: "auto" }}
            >
              Play again
            </button>
          </div>

          <div className="passFooter" style={{ marginTop: 14 }}>
            Tip: Use drag-and-drop to place ships. Use arrow keys + Enter to
            shoot faster.
          </div>
        </div>
      </div>
    );
  }

  return null;
}
