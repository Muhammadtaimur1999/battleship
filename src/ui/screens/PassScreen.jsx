export default function PassScreen({ nextPlayerName, onContinue }) {
  return (
    <div className="gameShell">
      <div className="card centerCard">
        <div className="headerRow">
          <div className="brand">
            <h1 className="bigTitle">Pass the device</h1>
            <p className="passText">
              Hand the device to{" "}
              <span className="playerGlow">{nextPlayerName}</span>.
              <br />
              When you are ready, press continue to start your turn.
            </p>
          </div>
          <div className="badge">Neon Battleships</div>
        </div>

        <button className="primaryBtn" onClick={onContinue}>
          Continue
        </button>

        <div className="passFooter">
          Tip: The enemy board is hidden. Use arrow keys + Enter, or click to
          shoot.
        </div>
      </div>
    </div>
  );
}
