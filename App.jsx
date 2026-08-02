import { Routes, Route, Link } from 'react-router-dom';
import { useGameStore } from './hooks/useGameStore';
import ScoreboardBar from './components/ScoreboardBar';
import LiveFeed from './components/LiveFeed';
import StatTable from './components/StatTable';
import PlayerCard from './components/PlayerCard';
import HighlightReel from './components/HighlightReel';
import RecruitProfile from './components/RecruitProfile';
import './App.css';

function Dashboard({ store }) {
  const { roster, currentGame, events, statLines, highlights, logStat, addHighlight } = store;

  return (
    <>
      <ScoreboardBar game={currentGame} />
      <main className="dashboard">
        <LiveFeed
          roster={roster}
          events={events}
          gameId={currentGame.id}
          onLogStat={logStat}
          onCaptureHighlight={addHighlight}
        />

        <div className="dashboard__side">
          <StatTable roster={roster} statLines={statLines} />
          <section className="roster-panel">
            <h2>Roster</h2>
            <div className="roster-panel__list">
              {roster.map((p) => (
                <PlayerCard key={p.id} player={p} averages={statLines[p.id]?.averages} />
              ))}
            </div>
          </section>
        </div>

        <HighlightReel highlights={highlights} />
      </main>
    </>
  );
}

export default function App() {
  const store = useGameStore();

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Dashboard store={store} />} />
        <Route
          path="/player/:playerId"
          element={
            <RecruitProfile
              roster={store.roster}
              statLines={store.statLines}
              highlights={store.highlights}
            />
          }
        />
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
