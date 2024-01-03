import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares))
      return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner)
    status = "Winner: " + winner;
  else
    status = "Next player: " + (xIsNext ? "X" : "O");

  return (
    <>
      <div className="status">{status}</div>
      {[0, 3, 6].map((num) => <div className="board-row">
        {[num + 0, num + 1, num + 2].map((num1) => <Square value={squares[num1]} onSquareClick={() => handleClick(num1)} />)}
      </div>)}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState([true, "Toggle descending"]);
  const xIsNext = currentMove % 2 === 0; // variables re-render but states don't
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares] // slice does not copy the end index, like substring
    setHistory(nextHistory); // []: make new array and first fill with history, then add nextSquares
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleAscending(ascending) {
    ascending[0] ? setAscending([false, "Toggle ascending"]) : setAscending([true, "Toggle descending"]);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove)
      description = "You are at move #" + move;
    else if (move === 0)
      description = "Go to game start";
    else
      description = "Go to move #" + move;

    return (
      <li key={move}>
        {move != currentMove ? <button onClick={() => jumpTo(move)}>{description}</button> : <h5 className="h5">{description}</h5>}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{ascending[0] ? moves : moves.reverse()}</ol>
      </div>
      <button onClick={() => toggleAscending(ascending)}>{ascending[1]}</button>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}
