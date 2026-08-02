import { useParams, Link } from 'react-router-dom';
import './RecruitProfile.css';

// Public-facing profile page, meant to be shared as a link with scouts and
// recruiters. Shows season-to-date averages plus every highlight captured
// for that player. No login/auth gate — this route is intentionally
// shareable (add auth later if a private-roster mode is ever needed).
export default function RecruitProfile({ roster, statLines, highlights }) {
  const { playerId } = useParams();
  const player = roster.find((p) => p.id === playerId);
  const line = statLines[playerId];
  const playerHighlights = highlights.filter((h) => h.playerId === playerId);

  if (!player) {
    return (
      <div className="recruit-profile recruit-profile--missing">
        <p>Player not found.</p>
        <Link to="/">Back to live feed</Link>
      </div>
    );
  }

  const avg = line?.averages ?? { points: 0, reb: 0, ast: 0, stl: 0, blk: 0 };

  return (
    <div className="recruit-profile">
      <Link to="/" className="recruit-profile__back">
        ← Live feed
      </Link>

      <header className="recruit-profile__header">
        <div className="recruit-profile__number">{player.number}</div>
        <div>
          <h1>{player.name}</h1>
          <p>
            {player.position} · Class of {player.grad}
          </p>
        </div>
      </header>

      <section className="recruit-profile__stats">
        <Stat label="PPG" value={avg.points} />
        <Stat label="RPG" value={avg.reb} />
        <Stat label="APG" value={avg.ast} />
        <Stat label="SPG" value={avg.stl} />
        <Stat label="BPG" value={avg.blk} />
        <Stat label="GP" value={line?.totals?.gamesPlayed ?? 0} />
      </section>

      <section className="recruit-profile__reel">
        <h2>Highlights</h2>
        {playerHighlights.length === 0 ? (
          <p className="recruit-profile__empty">No highlights captured yet for this player.</p>
        ) : (
          <div className="recruit-profile__grid">
            {playerHighlights.map((h) => (
              <article key={h.id} className="recruit-clip">
                {h.clipUrl ? (
                  <video src={h.clipUrl} controls className="recruit-clip__video" />
                ) : (
                  <div className="recruit-clip__placeholder">Clip pending ({h.source})</div>
                )}
                <p>{h.statLabel || 'Highlight'}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="recruit-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
