// Thin localStorage wrapper so game state (roster, events, highlights)
// survives a refresh. Swap this for a real backend/DB by keeping the same
// function signatures (load/save are the only two call sites elsewhere).

const KEY = 'hoopcast-pro:v1';

export function loadState(fallback) {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('HoopCast: failed to load saved state, using defaults.', err);
    return fallback;
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('HoopCast: failed to persist state.', err);
  }
}
