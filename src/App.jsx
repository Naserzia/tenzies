import React from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Die from "./components/Die";
import Icon from "./components/Icon";
import "./App.css";

const BEST_SCORE_KEY = "tenzies-best-score";

function generateAllNewDice() {
  return Array.from({ length: 10 }, (_, id) => ({
    id,
    value: Math.ceil(Math.random() * 6),
    isHeld: false,
  }));
}

function readBestScore() {
  try {
    const savedScore = window.localStorage.getItem(BEST_SCORE_KEY);
    if (savedScore === null) return null;

    const score = Number(savedScore);
    if (!Number.isInteger(score) || score < 0) {
      console.warn("Ignoring an invalid saved Tenzies score.");
      return null;
    }

    return score;
  } catch (error) {
    console.warn("Unable to read the saved Tenzies score.", error);
    return null;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function App() {
  const { width, height } = useWindowSize();
  const [dice, setDice] = React.useState(generateAllNewDice);
  const [rolls, setRolls] = React.useState(0);
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [bestScore, setBestScore] = React.useState(readBestScore);
  const buttonRef = React.useRef(null);

  const gameWon =
    dice[0].isHeld &&
    dice.every((die) => die.isHeld && die.value === dice[0].value);

  React.useEffect(() => {
    if (!hasStarted || gameWon) return undefined;

    const timerId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [hasStarted, gameWon]);

  React.useEffect(() => {
    if (gameWon) {
      buttonRef.current?.focus();
    }
  }, [gameWon]);

  function hold(id) {
    if (gameWon) return;

    const nextDice = dice.map((die) =>
      die.id === id ? { ...die, isHeld: !die.isHeld } : die,
    );
    setDice(nextDice);

    const wonWithNextHold = nextDice.every(
      (die) => die.isHeld && die.value === nextDice[0].value,
    );
    if (wonWithNextHold && (bestScore === null || rolls < bestScore)) {
      setBestScore(rolls);
      try {
        window.localStorage.setItem(BEST_SCORE_KEY, String(rolls));
      } catch (error) {
        console.warn("Unable to save the best Tenzies score.", error);
      }
    }
  }

  function rollDice() {
    if (gameWon) {
      setDice(generateAllNewDice());
      setRolls(0);
      setElapsedSeconds(0);
      setHasStarted(false);
      return;
    }

    setHasStarted(true);
    setRolls((currentRolls) => currentRolls + 1);
    setDice((currentDice) =>
      currentDice.map((die) =>
        die.isHeld
          ? die
          : { ...die, value: Math.ceil(Math.random() * 6) },
      ),
    );
  }

  return (
    <main className="game-shell">
      {gameWon && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={260}
          style={{ pointerEvents: "none" }}
        />
      )}

      <header className="brand">
        <span className="brand-mark" aria-hidden="true">
          <Icon name="dice" />
        </span>
        <span className="brand-name">little wins</span>
        <span className="brand-divider" aria-hidden="true" />
        <span className="brand-game">A tiny game of Tenzies</span>
      </header>

      <section className={`game-card${gameWon ? " game-card-won" : ""}`}>
        <div className="game-heading">
          <span className="eyebrow">
            <Icon name="sparkle" />
            YOUR MOMENT OF CALM
          </span>
          <h1 className="title">{gameWon ? "Nicely done!" : "Tenzies"}</h1>
          <p className="instructions">
            {gameWon
              ? "All ten match. Take a little victory lap."
              : "Roll until every die matches. Tap a die to keep its number between rolls."}
          </p>
        </div>

        <div className="stats" role="group" aria-label="Game statistics">
          <div className="stat">
            <span className="stat-icon stat-icon-purple" aria-hidden="true">
              <Icon name="rotate" />
            </span>
            <span className="stat-copy">
              <span className="stat-label">Rolls</span>
              <span className="stat-value">{rolls}</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon stat-icon-yellow" aria-hidden="true">
              <Icon name="clock" />
            </span>
            <span className="stat-copy">
              <span className="stat-label">Time</span>
              <span className="stat-value">{formatTime(elapsedSeconds)}</span>
            </span>
          </div>
          <div className="stat">
            <span className="stat-icon stat-icon-green" aria-hidden="true">
              <Icon name="trophy" />
            </span>
            <span className="stat-copy">
              <span className="stat-label">Best</span>
              <span className="stat-value">{bestScore ?? "—"}</span>
            </span>
          </div>
        </div>

        <div className="dice-container" role="group" aria-label="Your ten dice">
          {dice.map((die, index) => (
            <Die
              key={die.id}
              {...die}
              number={index + 1}
              disabled={gameWon}
              onHold={hold}
            />
          ))}
        </div>

        <div className="game-controls">
          <button
            className="button-roll"
            onClick={rollDice}
            ref={buttonRef}
          >
            <Icon name={gameWon ? "sparkle" : "rotate"} />
            {gameWon ? "Play again" : rolls === 0 ? "Roll the dice" : "Roll again"}
          </button>
          <p className="control-hint">
            <span className="hint-dot" aria-hidden="true" />
            {gameWon
              ? "A fresh round is just one click away"
              : "Pick a number. Keep your favorites."}
          </p>
        </div>
      </section>

      <p className="footer-note">
        Made for a little break <span aria-hidden="true">✦</span>
      </p>

      <div aria-live="polite" className="sr-only">
        {gameWon &&
          `You won in ${rolls} rolls and ${formatTime(elapsedSeconds)}. Your best score is ${bestScore ?? rolls} rolls.`}
      </div>
    </main>
  );
}

export default App;
