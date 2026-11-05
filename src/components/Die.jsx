const facePips = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function Die({ id, number, value, isHeld, disabled, onHold }) {
  return (
    <button
      type="button"
      className={`die${isHeld ? " die-held" : ""}`}
      onClick={() => onHold(id)}
      aria-pressed={isHeld}
      aria-label={`Die ${number}: ${value}${isHeld ? ", held" : ", not held"}`}
      disabled={disabled}
    >
      <span className="die-face" aria-hidden="true">
        {Array.from({ length: 9 }, (_, position) => (
          <span
            className={`die-pip${facePips[value].includes(position) ? " die-pip-visible" : ""}`}
            key={position}
          />
        ))}
      </span>
      {isHeld && (
        <span className="die-check" aria-hidden="true">
          ✓
        </span>
      )}
    </button>
  );
}

export default Die;
