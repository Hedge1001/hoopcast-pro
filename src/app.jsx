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
import './App.css';

function Dashboard({ store }) {
  const { roster, currentGame, events, statLines, highlights, logStat, addHighlight, setStreamUrl } = store;
  const video = useGameVideo(currentGame.id);

  const handleCaptureHighlight = async (meta) => {
    const highlight = await video.captureHighlight(meta);
    addHighlight(highlight);
    return highlight;
  };

  return (
    <>
      <ScoreboardBar game={currentGame} />
      <BroadcastBar
        status={video.status}
        pendingCount={video.pendingCount}
        onStart={video.start}
        onStop={video.stop}
        getFullGameClipUrl={video.getFullGameClipUrl}
      />
      <main className="dashboard">
        <LiveStreamPanel embedUrl={currentGame.streamEmbedUrl} onSetEmbedUrl={setStreamUrl} />

        <LiveFeed
          roster={roster}
          events={events}
          onLogStat={logStat}
          onCaptureHighlight={handleCaptureHighlight}
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

        <HighlightReel highlights={highlights} pendingCount={video.pendingCount} />
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
