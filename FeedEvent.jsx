import { STAT_TYPES } from '../data/mockGame';

const LABELS = Object.fromEntries(STAT_TYPES.map((s) => [s.key, s.label]));

export default function FeedEvent({ event, playerName }) {
  const time = new Date(event.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <li className="feed-event">
      <span className="feed-event__time">{time}</span>
      <span className="feed-event__body">
        <strong>{playerName}</strong> — {LABELS[event.statKey] || event.statKey}
      </span>
      <span className="feed-event__q">Q{event.quarter}</span>
    </li>
  );
}
