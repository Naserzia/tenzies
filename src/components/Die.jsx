export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "#FFF",
  };
  return (
    <button
      style={styles}
      className="btn-die"
      onClick={() => {
        props.hold(props.id);
      }}
      aria-pressed={props.isHeld}
      aria-label={`Die with value ${props.value}, 
            ${props.isHeld ? "held" : "not held"}`}
    >
      {props.value}
    </button>
  );
}
