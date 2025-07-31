import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette based on requirements
const COLORS = {
  primary: "#1976D2",
  accent: "#43A047",
  secondary: "#EEEEEE",
};

// PUBLIC_INTERFACE
function App() {
  // 0: empty, 1: Player X, 2: Player O
  const emptyBoard = Array(9).fill(0);
  const [board, setBoard] = useState(emptyBoard);
  const [isXTurn, setIsXTurn] = useState(true); // X always starts
  const [status, setStatus] = useState(""); // message above board
  const [winner, setWinner] = useState(null); // "X", "O", or "draw"
  const [animateSquares, setAnimateSquares] = useState(Array(9).fill(false)); // For animations

  // Utility
  const playerMark = (val) => {
    if (val === 1) return "X";
    if (val === 2) return "O";
    return "";
  };

  // PUBLIC_INTERFACE
  // Returns 'X', 'O', 'draw', or null
  function calculateWinner(b) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, bIdx, c] = lines[i];
      if (
        b[a] &&
        b[a] === b[bIdx] &&
        b[a] === b[c]
      ) {
        return playerMark(b[a]);
      }
    }
    if (b.every((cell) => cell !== 0)) {
      return "draw";
    }
    return null;
  }

  // Handle click on a square
  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (board[idx] || winner) {
      // Square already filled or game complete
      return;
    }
    const nextBoard = board.slice();
    nextBoard[idx] = isXTurn ? 1 : 2;
    setBoard(nextBoard);
    setIsXTurn((turn) => !turn);
    // Animation
    const aniArr = Array(9).fill(false);
    aniArr[idx] = true;
    setAnimateSquares(aniArr);
  }

  // PUBLIC_INTERFACE
  function resetGame() {
    setBoard(emptyBoard);
    setWinner(null);
    setIsXTurn(true);
    setStatus("");
    setAnimateSquares(Array(9).fill(false));
  }

  // Win/draw effect
  useEffect(() => {
    const res = calculateWinner(board);
    setWinner(res);
    if (res === "X") setStatus("Player X wins! 🎉");
    else if (res === "O") setStatus("Player O wins! 🎉");
    else if (res === "draw") setStatus("It's a draw! 🤝");
    else setStatus(`Current Turn: ${isXTurn ? "Player X" : "Player O"}`);
  }, [board, isXTurn]);

  // Remove animation class after it shows
  useEffect(() => {
    if (animateSquares.some(Boolean)) {
      const timeout = setTimeout(() => {
        setAnimateSquares(Array(9).fill(false));
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [animateSquares]);

  // Responsive: adjust board size based on viewport (mobile first)
  // No explicit JS needed—handled by CSS flex/grid

  return (
    <div className="ttt-outer" style={{ minHeight: "100vh" }}>
      <main className="ttt-centered-container">
        <h1 className="ttt-header" style={{ color: COLORS.primary }}>
          Tic Tac Toe
        </h1>
        <div className="ttt-status" style={{ color: COLORS.accent }}>
          {status}
        </div>
        <Board
          board={board}
          onSquareClick={handleSquareClick}
          winner={winner}
          animateSquares={animateSquares}
        />
        <div className="ttt-controls">
          <button
            className="ttt-button"
            style={{
              background: COLORS.primary,
              color: "#FFF",
              marginTop: "18px",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
            onClick={resetGame}
            aria-label="Reset game"
          >
            {winner ? "Play Again" : "Reset Game"}
          </button>
        </div>
        <footer className="ttt-footer" style={{ marginTop: 28, color: COLORS.primary, fontSize: "0.9rem", opacity: 0.8 }}>
          Modern React &middot; {new Date().getFullYear()}
        </footer>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onSquareClick, winner, animateSquares }) {
  return (
    <div className="ttt-board-container">
      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
        {board.map((val, i) => (
          <Square
            key={i}
            value={val}
            onClick={() => onSquareClick(i)}
            highlight={winner && isWinningSq(board, i)}
            disabled={!!winner || !!val}
            animate={animateSquares[i]}
          />
        ))}
      </div>
    </div>
  );
}

// Find if square is part of winning line
function isWinningSq(board, idx) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const line of wins) {
    if (line.includes(idx)) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c])
        return true;
    }
  }
  return false;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight, disabled, animate }) {
  // Animation: give appearance with a scale+fade pop
  let className = "ttt-square";
  if (highlight) className += " ttt-square--winner";
  if (animate) className += " ttt-square--pop";
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      tabIndex={0}
      aria-label={value ? `Player ${value === 1 ? "X" : "O"} position` : "empty square"}
      type="button"
    >
      <span style={{ opacity: value ? 1 : 0.3 }}>
        {value === 1 ? "X" : value === 2 ? "O" : ""}
      </span>
    </button>
  );
}

export default App;
