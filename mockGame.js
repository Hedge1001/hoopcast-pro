// Seed roster + event types used until a real feed (Xbotgo or manual scoring)
// is wired in. Replace with a real roster import/API call when ready.

export const STAT_TYPES = [
  { key: 'pts2', label: '2PT Made', points: 2 },
  { key: 'pts3', label: '3PT Made', points: 3 },
  { key: 'ftm', label: 'FT Made', points: 1 },
  { key: 'reb', label: 'Rebound', points: 0 },
  { key: 'ast', label: 'Assist', points: 0 },
  { key: 'stl', label: 'Steal', points: 0 },
  { key: 'blk', label: 'Block', points: 0 },
  { key: 'tov', label: 'Turnover', points: 0 },
];

export const seedRoster = [
  { id: 'p1', name: 'Jordan Reyes', number: 4, position: 'PG', grad: 2027 },
  { id: 'p2', name: 'Marcus Vale', number: 11, position: 'SG', grad: 2026 },
  { id: 'p3', name: 'Deshawn Price', number: 23, position: 'SF', grad: 2027 },
  { id: 'p4', name: 'Elias Cho', number: 32, position: 'PF', grad: 2026 },
  { id: 'p5', name: 'Tobin Ashe', number: 55, position: 'C', grad: 2028 },
];

export function emptyGame(opponent = 'Riverbend Academy') {
  return {
    id: `game-${Date.now()}`,
    opponent,
    startedAt: new Date().toISOString(),
    clock: '10:00',
    quarter: 1,
    homeScore: 0,
    awayScore: 0,
    events: [],
  };
}
