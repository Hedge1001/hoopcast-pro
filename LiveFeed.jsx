import { useMemo, useState } from 'react';
import FeedEvent from './FeedEvent';
import HighlightCaptureButton from './HighlightCaptureButton';
import { STAT_TYPES } from '../data/mockGame';
import './LiveFeed.css';

// Play-by-play stream plus the quick-entry stat logger. In production this
// panel is what a scorekeeper/staffer uses courtside; it doubles as the
// source of truth that everything else (averages, highlight prompts) reacts
// to. A future Xbotgo websocket feed can call `logStat` the same way this
// manual UI does, so no other code needs to change.
export default function LiveFeed({ roster, events, gameId, onLogStat, onCaptureHighlight }) {
  const [selectedPlayer, setSelectedPlayer] = useState(roster[0]?.id ?? '');
  const [lastStatLabel, setLastStatLabel] = useState(null);

  const recent = useMemo(() => [...events].slice(-40).reverse(), [events]);
  const playerName = (id) => roster.find((p) => p.id === id)?.name ?? 'Unknown';
  const selectedPlayerObj = roster.find((p) => p.id === selectedPlayer);

  return (
    <section className="live-feed">
      <header className="live-feed__header">
        <h2>Live Feed</h2>
        <p className="live-feed__hint">Log a stat, then optionally capture the highlight.</p>
      </header>

      <div className="live-feed__controls">
        <div className="live-feed__row">
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            aria-label="Select player"
          >
            {roster.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.number} {p.name}
              </option>
            ))}
          </select>

          {selectedPlayerObj && (
            <HighlightCaptureButton
              gameId={gameId}
              player={selectedPlayerObj}
              statLabel={lastStatLabel}
              onCaptured={onCaptureHighlight}
            />
          )}
        </div>

        <div className="live-feed__stat-grid">
          {STAT_TYPES.map((stat) => (
            <button
              key={stat.key}
              className="live-feed__stat-btn"
              onClick={() => {
                onLogStat(selectedPlayer, stat.key);
                setLastStatLabel(stat.label);
              }}
            >
              {stat.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="live-feed__list">
        {recent.length === 0 && (
          <li className="live-feed__empty">No plays logged yet — the feed starts here.</li>
        )}
        {recent.map((evt) => (
          <FeedEvent key={evt.id} event={evt} playerName={playerName(evt.playerId)} />
        ))}
      </ul>
    </section>
  );
}
