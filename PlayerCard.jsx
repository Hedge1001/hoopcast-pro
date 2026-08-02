import { Link } from 'react-router-dom';
import './PlayerCard.css';

export default function PlayerCard({ player, averages }) {
  return (
    <Link to={`/player/${player.id}`} className="player-card">
      <div className="player-card__number">{player.number}</div>
      <div className="player-card__info">
        <strong>{player.name}</strong>
        <span>
          {player.position} · Class of {player.grad}
        </span>
      </div>
      <div className="player-card__avg">
        <strong>{averages?.points ?? 0}</strong>
        <span>PPG</span>
      </div>
    </Link>
  );
}
