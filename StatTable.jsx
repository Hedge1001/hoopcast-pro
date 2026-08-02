import { Link } from 'react-router-dom';
import './StatTable.css';

// Team stat table showing running (season-to-date) averages per player,
// computed from the full event log by useGameStore/computeStatLines.
export default function StatTable({ roster, statLines }) {
  return (
    <section className="stat-table">
      <h2>Running Averages</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Player</th>
            <th scope="col">GP</th>
            <th scope="col">PTS</th>
            <th scope="col">REB</th>
            <th scope="col">AST</th>
            <th scope="col">STL</th>
            <th scope="col">BLK</th>
          </tr>
        </thead>
        <tbody>
          {roster.map((p) => {
            const line = statLines[p.id];
            const avg = line?.averages ?? { points: 0, reb: 0, ast: 0, stl: 0, blk: 0 };
            const gp = line?.totals?.gamesPlayed ?? 0;
            return (
              <tr key={p.id}>
                <td>
                  <Link to={`/player/${p.id}`} className="stat-table__player">
                    #{p.number} {p.name}
                  </Link>
                </td>
                <td>{gp}</td>
                <td>{avg.points}</td>
                <td>{avg.reb}</td>
                <td>{avg.ast}</td>
                <td>{avg.stl}</td>
                <td>{avg.blk}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
