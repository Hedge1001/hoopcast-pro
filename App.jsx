import { Routes, Route, Link } from 'react-router-dom';
import { useGameStore } from './hooks/useGameStore';
import { useGameVideo } from './hooks/useGameVideo';
import ScoreboardBar from './components/ScoreboardBar';
import BroadcastBar from './components/BroadcastBar';
import LiveFeed from './components/LiveFeed';
import LiveStreamPanel from './components/LiveStreamPanel';
import StatTable from './components/StatTable';
import PlayerCard from './components/PlayerCard';
import HighlightReel from './components/HighlightReel';
import RecruitProfile from './components/RecruitProfile';
import { computeStatLines } from '../statMath';
import './App.css';

const FEATURED_PLAYER_NAME = 'Joey Hedge';

function Dashboard({ store }) {
  const {
    roster,
    currentGame,
    events,
    statLines,
    highlights,
    logStat,
    addHighlight,
    setStreamUrl,
  } = store;

  const video = useGameVideo(currentGame.id);

  // Only show Joey Hedge.
  const playerRoster = roster.filter(
    (player) => player.name === FEATURED_PLAYER_NAME
  );

  // Only Joey's stat line.
  const playerIds = new Set(playerRoster.map((player) => player.id));

  const playerStatLines = Object.fromEntries(
    Object.entries(statLines).filter(([playerId]) =>
      playerIds.has(playerId)
    )
  );

  // Only Joey-related player events.
  const playerEvents = events.filter(
    (event) => !event.playerId || playerIds.has(event.playerId)
  );

  // Preserve team vs opponent scoring.
  const teamScore = Number(currentGame.homeScore ?? 0);
  const opponentScore = Number(currentGame.awayScore ?? 0);

  const result =
    teamScore > opponentScore
      ? 'WIN'
      : teamScore < opponentScore
        ? 'LOSS'
        : 'TIE';

  const handleCaptureHighlight = async (meta) => {
    const highlight = await video.captureHighlight(meta);
    addHighlight(highlight);
    return highlight;
  };

  return (
    <>
      {/* Existing live scoreboard */}
      <ScoreboardBar game={currentGame} />

      <BroadcastBar
        status={video.status}
        pendingCount={video.pendingCount}
        onStart={video.start}
        onStop={video.stop}
        getFullGameClipUrl={video.getFullGameClipUrl}
      />

      <main className="dashboard">

        <LiveStreamPanel
          embedUrl={currentGame.streamEmbedUrl}
          onSetEmbedUrl={setStreamUrl}
        />

        {/* TEAM GAME RESULT */}
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
          roster={playerRoster}
          events={playerEvents}
          onLogStat={logStat}
          onCaptureHighlight={handleCaptureHighlight}
        />

        <div className="dashboard__side">

          {/* Joey's stats only */}
          <StatTable
            roster={playerRoster}
            statLines={playerStatLines}
          />

          {/* Joey's player card only */}
          <section className="roster-panel">
            <h2>Joey Hedge</h2>

            <div className="roster-panel__list">
              {playerRoster.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  averages={
                    playerStatLines[player.id]?.averages
                  }
                />
              ))}
            </div>
          </section>

        </div>

        {/* Keep highlights */}
        <HighlightReel
          highlights={highlights}
          pendingCount={video.pendingCount}
        />

      </main>
    </>
  );
}

export default function App() {
  const store = useGameStore();

  // Only Joey is available on the recruiting/profile route.
  const playerRoster = store.roster.filter(
    (player) => player.name === FEATURED_PLAYER_NAME
  );

  const playerIds = new Set(
    playerRoster.map((player) => player.id)
  );

  const playerStatLines = Object.fromEntries(
    Object.entries(store.statLines).filter(([playerId]) =>
      playerIds.has(playerId)
    )
  );

  return (
    <div className="app">
      <Routes>

        {/* Main dashboard */}
        <Route
          path="/"
          element={<Dashboard store={store} />}
        />

        {/* Joey Hedge profile only */}
        <Route
          path="/player/:playerId"
          element={
            <RecruitProfile
              roster={playerRoster}
              statLines={playerStatLines}
              highlights={store.highlights}
            />
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="not-found">
              <p>Page not found.</p>
              <Link to="/">Back home</Link>
            </div>
          }
        />

      </Routes>
    </div>
  );
}