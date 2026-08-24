import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const games = [
  { name: "Pembrook Hill", result: "W", points: 12, assists: 1, rebounds: 10, steals: 3, blocks: 2, minutes: 24 },
  { name: "NLE vs Spurs", result: "L", points: 8, assists: 2, rebounds: 7, steals: 3, blocks: 1, minutes: 22 },
  { name: "Weekend Total", result: "3-0", points: 32, assists: 5, rebounds: 19, steals: 8, blocks: 3, minutes: 62 }
];

function App() {
  const season = games[games.length - 1];

  const stats = [
    ["Points", season.points],
    ["Assists", season.assists],
    ["Rebounds", season.rebounds],
    ["Steals", season.steals],
    ["Blocks", season.blocks],
    ["Minutes", season.minutes]
  ];

  return (
    <div className="app">
      <header>
        <h1>🏀 HoopCast AI v1.0</h1>
        <p>Joey Hedge Recruiting Analytics Platform</p>
      </header>

      <section className="card hero">
        <h2>Player Profile</h2>
        <h3>Joey Hedge #30</h3>
        <p>Incoming freshman basketball analytics dashboard</p>
      </section>

      <div className="grid">
        {stats.map(([name, value]) => (
          <div className="card stat" key={name}>
            <b>{name}</b>
            <span>{value}</span>
          </div>
        ))}
      </div>

      <section className="card">
        <h2>Game Log</h2>

        {games.map((game) => (
          <div className="game" key={game.name}>
            <strong>{game.name}</strong> — {game.result}
            <br />
            {game.points} PTS | {game.assists} AST | {game.rebounds} REB |{" "}
            {game.steals} STL | {game.blocks} BLK | {game.minutes} MIN
          </div>
        ))}
      </section>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);