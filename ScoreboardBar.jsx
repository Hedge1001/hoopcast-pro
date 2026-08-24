import './ScoreboardBar.css';

// The signature element: a broadcast-style scorebug pinned to the top of
// the app, styled after a courtside LED board rather than a generic navbar.
export default function ScoreboardBar({ game, teamName = 'HOME' }) {
  return (
    <div className="scorebug">
      <div className="scorebug__live">
        <span className="scorebug__dot" aria-hidden="true" />
        LIVE
      </div>

      <div className="scorebug__team">
        <span className="scorebug__team-name">{teamName}</span>
        <span className="scorebug__digits">{pad(game.homeScore)}</span>
      </div>

      <div className="scorebug__clock">
        <span className="scorebug__quarter">Q{game.quarter}</span>
        <span className="scorebug__time">{game.clock}</span>
      </div>

      <div className="scorebug__team scorebug__team--away">
        <span className="scorebug__digits">{pad(game.awayScore)}</span>
        <span className="scorebug__team-name">{game.opponent}</span>
      </div>
    </div>
  );
}

function pad(n) {
  return String(n).padStart(2, '0');
}
import { seedRoster, emptyGame, STAT_TYPES } from '../data/mockGame';
const POINTS_BY_KEY = Object.fromEntries(STAT_TYPES.map((s) => [s.key, s.points]));


