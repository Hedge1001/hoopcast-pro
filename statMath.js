// Pure functions for turning a raw event log into per-game totals and
// running (career/season-to-date) averages. Kept dependency-free so it can
// be unit tested or reused server-side later.

import { STAT_TYPES } from './mockGame';

function blankTotals() {
  const totals = { points: 0, gamesPlayed: 0 };
  STAT_TYPES.forEach((s) => {
    totals[s.key] = 0;
  });
  return totals;
}

/**
 * events: array of { playerId, statKey, gameId, timestamp }
 * players: array of { id, name, ... }
 * Returns: { [playerId]: { totals, perGame: { [gameId]: totals }, averages } }
 */
export function computeStatLines(events, players) {
  const statByKey = Object.fromEntries(STAT_TYPES.map((s) => [s.key, s]));
  const lines = {};

  players.forEach((p) => {
    lines[p.id] = { totals: blankTotals(), perGame: {} };
  });

  events.forEach((evt) => {
    const line = lines[evt.playerId];
    if (!line) return;
    const stat = statByKey[evt.statKey];
    if (!stat) return;

    if (!line.perGame[evt.gameId]) {
      line.perGame[evt.gameId] = blankTotals();
    }

    [line.totals, line.perGame[evt.gameId]].forEach((bucket) => {
      bucket[evt.statKey] += 1;
      bucket.points += stat.points;
    });
  });

  Object.values(lines).forEach((line) => {
    line.totals.gamesPlayed = Object.keys(line.perGame).length;
  });

  // Running averages = career totals / games played so far.
  Object.values(lines).forEach((line) => {
    const g = line.totals.gamesPlayed || 1;
    line.averages = {
      points: round1(line.totals.points / g),
      reb: round1(line.totals.reb / g),
      ast: round1(line.totals.ast / g),
      stl: round1(line.totals.stl / g),
      blk: round1(line.totals.blk / g),
      tov: round1(line.totals.tov / g),
    };
  });

  return lines;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}
