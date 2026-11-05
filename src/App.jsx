import React from "react";
import "./App.css";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

function App() {
  const { width, height } = useWindowSize();
  function generateAllNewDice() {
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }
  const [dice, setDice] = React.useState(() => generateAllNewDice());
  const buttonRef = React.useRef(null);

  function hold(id) {
    setDice(prevDie =>
      prevDie.map(item => {
        return item.id === id ? { ...item, isHeld: !item.isHeld } : item;
      }),
    );
  }

  function startNewGame() {
    setDice(generateAllNewDice());
  }

  const diceElements = dice.map(die => {
    return (
      <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        id={die.id}
        hold={hold}
      />
    );
  });

  const gameWon =
    dice.every(die => die.isHeld) &&
    dice.every(die => die.value === dice[0].value);

  function rollDice() {
    setDice(oldDice =>
      oldDice.map(die =>
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) },
      ),
    );
  }

  React.useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus();
    }
  }, [gameWon]);

  return (
    <main>
      {gameWon && <Confetti width={width} height={height} />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
      </div>
      <div className="dice-container">{diceElements}</div>

      <button
        onClick={gameWon ? startNewGame : rollDice}
        className="button-roll"
        ref={buttonRef}
      >
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}

export default App;
