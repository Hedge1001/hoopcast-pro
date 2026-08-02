import './HighlightReel.css';

// Horizontal strip of captured highlights, newest first. Clips may come
// from the local camera capture path or (once configured) from Xbotgo.
export default function HighlightReel({ highlights }) {
  return (
    <section className="highlight-reel">
      <h2>Highlight Reel</h2>
      {highlights.length === 0 ? (
        <p className="highlight-reel__empty">
          No highlights captured yet. Hit "Capture Highlight" during a scoring play.
        </p>
      ) : (
        <div className="highlight-reel__strip">
          {highlights.map((h) => (
            <article key={h.id} className="highlight-card">
              {h.clipUrl ? (
                <video src={h.clipUrl} muted controls className="highlight-card__video" />
              ) : (
                <div className="highlight-card__placeholder">
                  {h.source === 'xbotgo' ? 'Xbotgo clip pending' : 'No clip captured'}
                </div>
              )}
              <div className="highlight-card__meta">
                <strong>{h.playerName}</strong>
                <span>{h.statLabel || 'Highlight'}</span>
                <span className="highlight-card__source">{h.source}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
