import React, { useState, useEffect } from "react";
import "../App.css";
import skyBg from "../assets/images/background.jpg";     // 👈 taustakuva
import kurkkumopo from "../assets/images/kurkkumopo.png"; // 👈 liikkuva ikoni
import hairdryerSound from "../assets/sounds/hairdryer.mp3";
import SnakeGame from "./SnakeGame.jsx";

const MORSE_MAP = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--.."
};


function RuleBox({
  rule,
  isOk,
  justCompleted,
  dogImage,
  musicNote,
  onPlayNote,
  mazeSymbol,
  mazeSolved,
  onMazeSolved,
  passingTarget,
  flagUrl,
  frozenWord,
  snakeWord,
  asciiPuzzle,
  pokemon,
  onNewSnakeWord,
  morseWord,
  fibSequence,

}) {
  // käytetään re-playn avaimena, että animaatio alkaa alusta
  const [animRun, setAnimRun] = useState(0);

  // satunnaiset korkeudet jokaiselle ikonille (0..1)
  const [iconOffsets] = useState(() =>
    Array.from({ length: passingTarget || 0 }).map(() => Math.random())
  );

  const [isMelting, setIsMelting] = useState(false);
  const [isMelted, setIsMelted] = useState(false);

  const handleStartHairdryer = () => {
    if (isMelting || isMelted) return;

    setIsMelting(true);

    // Luo HTMLAudioElement
    const audio = new Audio(hairdryerSound);
    audio.volume = 0.05; // 🔥 erittäin hiljainen ääni
    audio.loop = true;   // jatkuu sulamisen ajan
    audio.play().catch(() => { });

    // Sammuta ääni 10 sekunnin jälkeen
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      setIsMelted(true);
    }, 10000);
  };

  // 5x5 labyrintti: 0 = tyhjä, 1 = seinä
  const mazeLayout = [
    [0, 0, 1, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 1, 1],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0],
  ];

  // sijainti (x = sarake, y = rivi)
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const goalPos = { x: 4, y: 4 }; // oikea alakulma

  // nuolinäppäimet / WASD liikuttamiseen
  useEffect(() => {
    if (rule.id !== "maze" || mazeSolved) return;

    const handleKeyDown = (e) => {
      let dx = 0;
      let dy = 0;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          dy = -1;
          break;
        case "ArrowDown":
        case "s":
        case "S":
          dy = 1;
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          dx = -1;
          break;
        case "ArrowRight":
        case "d":
        case "D":
          dx = 1;
          break;
        default:
          return;
      }

      e.preventDefault();

      setPlayerPos((prev) => {
        const nx = prev.x + dx;
        const ny = prev.y + dy;

        // rajat ulos? pysy paikallaan
        if (nx < 0 || nx > 4 || ny < 0 || ny > 4) {
          return prev;
        }

        // seinä? pysy paikallaan
        if (mazeLayout[ny][nx] === 1) {
          return prev;
        }

        const newPos = { x: nx, y: ny };

        // maali?
        if (
          newPos.x === goalPos.x &&
          newPos.y === goalPos.y &&
          !mazeSolved
        ) {
          onMazeSolved && onMazeSolved();
        }

        return newPos;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rule.id, mazeSolved, onMazeSolved]);

  return (
    <div
      className={
        "rule-box " +
        (isOk ? "rule-ok" : "rule-fail") +
        (justCompleted ? " rule-just-ok" : "")
      }
    >
      {/* YLÄKAISTA – tummempi header */}
      <div className="rule-header">
        <span className="rule-icon">{isOk ? "✔" : "✖"}</span>
        <span className="rule-number">Rule {rule.number}</span>
      </div>

      <div className="rule-content">
        <p>{rule.message}</p>
        {rule.subMessage && (
          <p className="rule-subtext">{rule.subMessage}</p>
        )}

        {/* 🐶 koirakuva-sääntö */}
        {rule.id === "dog-breed" && dogImage && (
          <img
            src={dogImage}
            alt="Guess this dog's breed"
            className="dog-image"
          />
        )}

        {/* 🎵 musiikkisääntö */}
        {rule.id === "music-note" && (
          <div className="music-box">
            <button
              type="button"
              onClick={onPlayNote}
              className="music-play-btn"
            >
              ▶ Play note
            </button>
          </div>
        )}

        {/* ✈️ lentävät ikonit taustakuvan päällä */}
        {rule.id === "moving-objects" && (
          <div className="moving-box">
            <div
              className="moving-area"
              style={{ backgroundImage: `url(${skyBg})` }}
            >
              {Array.from({ length: passingTarget }).map((_, i) => {
                const offset = iconOffsets[i] ?? 0.5;
                const topPercent = 10 + offset * 70; // 10–80 % korkeus

                return (
                  <img
                    key={`${animRun}-${i}`}
                    src={kurkkumopo}
                    alt="kurkkumopo"
                    className="moving-item"
                    style={{
                      top: `${topPercent}%`,
                      animationDelay: `${i * 0.7}s`,
                    }}
                  />
                );
              })}
            </div>

            <div className="moving-controls">
              <button
                type="button"
                className="moving-replay-btn"
                onClick={() => setAnimRun((r) => r + 1)}
              >
                Replay animation
              </button>
            </div>
          </div>
        )}

        {/* 🗺️ Interaktiivinen Salonsaari-kartta */}
        {rule.id === "salonsaari-map" && (
          <div className="map-box">
            <iframe
              title="Salonsaari map"
              className="map-frame"
              src="https://www.openstreetmap.org/export/embed.html?bbox=23.603439331054688%2C61.29002991794558%2C23.939895629882816%2C61.390143658580335&amp;layer=hot&amp;marker=61.34012679428879%2C23.77166748046875"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        {/* 🏳️ Lippu-puzzle – arvaa maa koko lipusta */}
        {rule.id === "flag-country" && flagUrl && (
          <div className="flag-box">
            <img
              src={flagUrl}
              alt="Guess this country's flag"
              className="flag-image"
            />
          </div>
        )}

        {/* ❄️ Frozen word -sääntö */}
        {rule.id === "frozen-word" && frozenWord && (
          <div className="frozen-box">
            <div
              className={
                "frozen-inner" +
                (isMelting ? " is-melting" : "") +
                (isMelted ? " is-melted" : "")
              }
            >
              {/* Sana: täysin piilossa kunnes isMelted === true */}
              <div className="frozen-word">{frozenWord}</div>

              {/* Jääkerros päällä */}
              <div className="frozen-ice" />
            </div>

            <button
              type="button"
              className="hairdryer-btn"
              onClick={handleStartHairdryer}
              disabled={isMelting}
            >
              💨 Turn on hairdryer
            </button>
          </div>
        )}

        {rule.id === "snake-word" && snakeWord && (
          <SnakeGame
            word={snakeWord}
            onNewWord={onNewSnakeWord}
          />
        )}

        {rule.id === "ascii-sum" && asciiPuzzle && (
          <div className="ascii-box">
            <div className="ascii-letters">
              {asciiPuzzle.letters.map((ch, i) => (
                <span key={i} className="ascii-letter">
                  {ch}
                </span>
              ))}
            </div>
            <small className="ascii-hint">
              (All letters are uppercase)
            </small>
          </div>
        )}

        {rule.id === "pokemon-type" && pokemon && (
          <div className="pokemon-box">
            <p>
              Pokémon: <strong>{pokemon.name}</strong>
            </p>

            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.name}
              className="pokemon-image"
            />
          </div>
        )}

        {rule.id === "morse-code" && (
          <div className="morse-box">
            <div className="morse-display">
              {morseWord
                .toUpperCase()
                .split("")
                .map((ch, i) => (
                  <div key={i} className="morse-letter">
                    {MORSE_MAP[ch]}
                  </div>
                ))}
            </div>
          </div>
        )}

        {rule.id === "fibonacci" && (
          <div className="fibonacci-box">
            <div className="fibonacci-seq">
              {fibSequence.join(", ")} , ?
            </div>
          </div>
        )}

        {/* 🕹️ mini-labyrintti seinillä */}
        {rule.id === "maze" && (
          <div className="maze-box">
            <div className="maze-grid">
              {mazeLayout.map((row, y) =>
                row.map((cell, x) => {
                  const isPlayer =
                    playerPos.x === x && playerPos.y === y;
                  const isGoal =
                    goalPos.x === x && goalPos.y === y;
                  const isWall = cell === 1;

                  return (
                    <div
                      key={`${y}-${x}`}
                      className={
                        "maze-cell " +
                        (isWall ? "maze-wall" : "") +
                        (isGoal ? "maze-goal" : "") +
                        (isPlayer ? "maze-player" : "")
                      }
                    >
                      {!isWall && isPlayer && "😎"}
                      {!isWall && !isPlayer && isGoal && "🍺"}
                    </div>
                  );
                })
              )}
            </div>

            <small className="maze-hint">
              Use arrow keys or WASD to move.
            </small>

            {mazeSolved && (
              <div className="maze-secret">
                Secret symbol: <span>{mazeSymbol}</span>
                <br />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RuleBox;