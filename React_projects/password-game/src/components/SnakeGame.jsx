import React, { useState, useEffect } from "react";

const GRID_COLS = 10;
const GRID_ROWS = 10;
const TICK_MS = 220;

function getRandomEmptyCell(snake) {
  while (true) {
    const x = Math.floor(Math.random() * GRID_COLS);
    const y = Math.floor(Math.random() * GRID_ROWS);
    const occupied = snake.some((p) => p.x === x && p.y === y);
    if (!occupied) return { x, y };
  }
}

const DIRS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  W: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  S: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  A: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
  D: { x: 1, y: 0 },
};

function SnakeGame({ word, onNewWord }) {
  const letters = word.toUpperCase().split(""); // esim. "ENERGIAJUOMA"

  // --- STATE --- //
  const [snake, setSnake] = useState(() => {
    const start = {
      x: Math.floor(GRID_COLS / 2),
      y: Math.floor(GRID_ROWS / 2),
    };
    return [start];
  });

  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [applePos, setApplePos] = useState(() =>
    getRandomEmptyCell([
      { x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) },
    ])
  );

  const [hasStarted, setHasStarted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // 🔢 Edistyminen käärmeen pituudesta
  const applesEaten = Math.max(0, snake.length - 1);
  const collectedCount = Math.min(applesEaten, letters.length);
  const currentLetterIndex =
    letters.length > 0 ? Math.min(collectedCount, letters.length - 1) : 0;
  const currentLetter = letters[currentLetterIndex] ?? "";

  // --- RESET-LOGIIKKA --- //
  const resetState = () => {
    const start = {
      x: Math.floor(GRID_COLS / 2),
      y: Math.floor(GRID_ROWS / 2),
    };
    const initialSnake = [start];

    setSnake(initialSnake);
    setDirection({ x: 1, y: 0 });
    setApplePos(getRandomEmptyCell(initialSnake));
    setHasStarted(false);
    setIsRunning(false);
    setIsCompleted(false);
  };

  // jos sana vaihtuu propseista, resetoi peli
  useEffect(() => {
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  // --- KONTROLLIT (nuolinäppäimet / WASD) --- //
  useEffect(() => {
    const handleKey = (e) => {
      const dir = DIRS[e.key];
      if (!dir) return;

      setDirection((prev) => {
        // estä kääntyminen suoraan vastakkaiseen suuntaan
        if (prev.x + dir.x === 0 && prev.y + dir.y === 0) return prev;
        return dir;
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // --- PELISILMUKKA --- //
  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_COLS) % GRID_COLS,
          y: (head.y + direction.y + GRID_ROWS) % GRID_ROWS,
        };

        // törmäys itseensä
        const hitsSelf = prevSnake.some(
          (p) => p.x === newHead.x && p.y === newHead.y
        );
        if (hitsSelf) {
          setIsRunning(false);
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        const ateApple =
          newHead.x === applePos.x && newHead.y === applePos.y;

        if (!ateApple) {
          newSnake.pop();
        } else {
          // söi kirjaimen → käärme kasvaa yhdellä
          const applesEatenAfter = newSnake.length - 1;

          if (applesEatenAfter >= letters.length) {
            // kaikki kirjaimet kerätty
            setIsCompleted(true);
            setIsRunning(false);
          } else {
            // seuraava omenakirjain uuteen paikkaan
            const pos = getRandomEmptyCell(newSnake);
            setApplePos(pos);
          }
        }

        return newSnake;
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [direction, applePos, letters.length, isRunning]);

  // --- START / RESTART / PLAY AGAIN --- //
  const handleStart = () => {
    if (hasStarted) return;
    setHasStarted(true);
    setIsRunning(true);
  };

  const handleRestart = () => {
    resetState();
  };

  const handlePlayAgain = () => {
    if (onNewWord) {
      onNewWord(); // 🔥 pyydä uutta sanaa Appilta
    }
    resetState();
  };

  return (
    <div className="snake-box">
      <div className="snake-grid">
        {Array.from({ length: GRID_ROWS }).map((_, y) =>
          Array.from({ length: GRID_COLS }).map((__, x) => {
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((p) => p.x === x && p.y === y);
            const isApple =
              !isCompleted && applePos.x === x && applePos.y === y;

            let className = "snake-cell";
            if (isBody) className += " snake-body";
            if (isHead) className += " snake-head";
            if (isApple) className += " snake-apple";

            return (
              <div key={`${x}-${y}`} className={className}>
                {isApple ? currentLetter : ""}
              </div>
            );
          })
        )}
      </div>

      {/* Start-nappi ennen kuin peli alkaa */}
      {!hasStarted && !isCompleted && (
        <button
          type="button"
          className="snake-start-btn"
          onClick={handleStart}
        >
          ▶ Start snake game
        </button>
      )}

      {/* Häviö → restart-nappi */}
      {!isRunning && hasStarted && !isCompleted && (
        <>
          <small className="snake-hint snake-hint-error">
            You hit yourself!
          </small>
          <button
            type="button"
            className="snake-restart-btn"
            onClick={handleRestart}
          >
            ↻ Restart snake
          </button>
        </>
      )}

      {/* Peli läpi → vain ohje, ei sanaa */}
      {isCompleted && (
        <div className="snake-complete">
          You collected all the letters.  
          Now type the full word into your password from memory.
          <br />
          <br />
          <button
            type="button"
            className="snake-start-btn"
            onClick={handlePlayAgain}
          >
            🔁 Play again (new word)
          </button>
        </div>
      )}
    </div>
  );
}

export default SnakeGame;
