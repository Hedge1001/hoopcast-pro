export const STAT_TYPES = [
  {
    key: 'pts2',
    label: '2PT Made',
    points: 2,
  },
  {
    key: 'pts3',
    label: '3PT Made',
    points: 3,
  },
  {
    key: 'ftm',
    label: 'FT Made',
    points: 1,
  },
  {
    key: 'reb',
    label: 'Rebound',
    points: 0,
  },
  {
    key: 'ast',
    label: 'Assist',
    points: 0,
  },
  {
    key: 'stl',
    label: 'Steal',
    points: 0,
  },
  {
    key: 'blk',
    label: 'Block',
    points: 0,
  },
  {
    key: 'tov',
    label: 'Turnover',
    points: 0,
  },
];

export const seedRoster = [
  {
    id: 'joey-hedge',
    name: 'Joey Hedge',
    number: 30,
    position: 'G',
    grad: 2030,
  },
];

export function emptyGame(
  opponent = 'Opponent'
) {
  return {
    id: `game-${Date.now()}`,
    opponent,
    startedAt: new Date().toISOString(),
    clock: '10:00',
    quarter: 1,

    // TEAM SCORE
    homeScore: 0,

    // OPPONENT SCORE
    awayScore: 0,

    events: [],
  };
}