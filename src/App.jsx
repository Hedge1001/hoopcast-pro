import { useMemo, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import ScoreboardBar from '../ScoreboardBar';
import LiveFeed from '../LiveFeed';
import StatTable from '../StatTable';
import PlayerCard from '../PlayerCard';
import HighlightReel from '../HighlightReel';
import RecruitProfile from '../RecruitProfile';

import { seedRoster, emptyGame } from '../mockGame';
import { calculatePlayerStats } from '../statMath';

import '../App.css';

const JOEY_NAME = 'Joey Hedge';

function AppDashboard() {
  const [roster] = useState(() => {
    const saved = localStorage.getItem('hoopcast-roster');

    const players = saved ? JSON.parse(saved) : seedRoster;

    return players.filter(
      (player) => player.name === JOEY_NAME
    );
  });

  const [game, setGame] = useState(() => {
    const saved = localStorage.getItem('hoopcast-game');

    return saved ? JSON.parse(saved) : emptyGame();
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('hoopcast-events');

    return saved ? JSON.parse(saved) : [];
  });

  const [highlights, setHighlights] = useState(() => {
    const saved = localStorage.getItem('hoopcast-highlights');

    return saved ? JSON.parse(saved) : [];
  });

  const saveEvents = (nextEvents) => {
    setEvents(nextEvents);
    localStorage.setItem(
      'hoopcast-events',
      JSON.stringify(nextEvents)
    );
  };

  const saveGame = (nextGame) => {
    setGame(nextGame);
    localStorage.setItem(
      'hoopcast-game',
      JSON.stringify(nextGame)
    );
  };

  const addHighlight = (highlight) => {
    const nextHighlights = [
      ...highlights,
      highlight,
    ];

    setHighlights(nextHighlights);

    localStorage.setItem(
      'hoopcast-highlights',
      JSON.stringify(nextHighlights)
    );
  };

  const logStat = (playerId, statKey) => {
    const player = roster.find(
      (p) => p.id === playerId
    );

    if (!player) return;

    const event = {
      id: `event-${Date.now()}`,
      gameId: game.id,
      playerId,
      statKey,
      timestamp: new Date().toISOString(),
    };

    const nextEvents = [
      ...events,
      event,
    ];

    saveEvents(nextEvents);

    /*
     * Keep team scoring totals intact.
     * 2PT = +2
     * 3PT = +3
     * FT = +1
     */
    let scoreIncrease = 0;

    if (statKey === 'pts2') {
      scoreIncrease = 2;
    }

    if (statKey === 'pts3') {
      scoreIncrease = 3;
    }

    if (statKey === 'ftm') {
      scoreIncrease = 1;
    }

    if (scoreIncrease > 0) {
      saveGame({
        ...game,
        homeScore:
          Number(game.homeScore || 0) +
          scoreIncrease,
      });
    }
  };

  const playerEvents = useMemo(() => {
    const playerIds = new Set(
      roster.map((player) => player.id)
    );

    return events.filter(
      (event) =>
        !event.playerId ||
        playerIds.has(event.playerId)
    );
  }, [events, roster]);

  const statLines = useMemo(() => {
    const result = {};

    roster.forEach((player) => {
      result[player.id] =
        calculatePlayerStats(
          player.id,
          events
        );
    });

    return result;
  }, [roster, events]);

  const teamScore = Number(
    game.homeScore || 0
  );

  const opponentScore = Number(
    game.awayScore || 0
  );

  const result =
    teamScore > opponentScore
      ? 'WIN'
      : teamScore < opponentScore
        ? 'LOSS'
        : 'TIE';

  return (
    <>
      <ScoreboardBar game={game} />

      <main className="dashboard">

        {/* TEAM VS OPPONENT RESULT */}
        <section
          className="game-results"
          aria-label="Team game result"
        >
          <div className="game-results__item">
            <span>TEAM</span>
            <strong>{teamScore}</strong>
          </div>

          <div className="game-results__item">
            <span>OPPONENT</span>
            <strong>{opponentScore}</strong>
          </div>

          <div className="game-results__item">
            <span>RESULT</span>
            <strong>{result}</strong>
          </div>
        </section>

        {/* JOEY HEDGE ONLY */}
        <LiveFeed
          roster={roster}
          events={playerEvents}
          gameId={game.id}
          onLogStat={logStat}
          onCaptureHighlight={addHighlight}
        />

        <div className="dashboard__side">

          {/* JOEY'S STATS ONLY */}
          <StatTable
            roster={roster}
            statLines={statLines}
          />

          {/* JOEY'S PLAYER CARD ONLY */}
          <section className="roster-panel">
            <h2>Player</h2>

            <div className="roster-panel__list">
              {roster.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  averages={
                    statLines[player.id]?.averages
                  }
                />
              ))}
            </div>
          </section>

        </div>

        {/* JOEY'S HIGHLIGHTS */}
        <HighlightReel
          highlights={highlights}
        />

      </main>
    </>
  );
}

function JoeyProfile() {
  const [roster] = useState(() => {
    const saved = localStorage.getItem(
      'hoopcast-roster'
    );

    const players = saved
      ? JSON.parse(saved)
      : seedRoster;

    return players.filter(
      (player) => player.name === JOEY_NAME
    );
  });

  const [events] = useState(() => {
    const saved = localStorage.getItem(
      'hoopcast-events'
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [highlights] = useState(() => {
    const saved = localStorage.getItem(
      'hoopcast-highlights'
    );

    return saved ? JSON.parse(saved) : [];
  });

  const statLines = {};

  roster.forEach((player) => {
    statLines[player.id] =
      calculatePlayerStats(
        player.id,
        events
      );
  });

  return (
    <RecruitProfile
      roster={roster}
      statLines={statLines}
      highlights={highlights}
    />
  );
}

export default function App() {
  return (
    <div className="app">
      <Routes>

        <Route
          path="/"
          element={<AppDashboard />}
        />

        <Route
          path="/player/:playerId"
          element={<JoeyProfile />}
        />

        <Route
          path="*"
          element={
            <div className="not-found">
              <p>Page not found.</p>

              <Link to="/">
                Back home
              </Link>
            </div>
          }
        />

      </Routes>
    </div>
  );
}
