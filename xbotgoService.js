// -----------------------------------------------------------------------
// XBOTGO INTEGRATION — PLACEHOLDER
// -----------------------------------------------------------------------
// Xbotgo (https://www.xbotgo.com) provides auto-tracking scoreboard/camera
// units used at grassroots & school games, exposing live score data and
// recorded clips. This app has no credentials or API docs yet, so every
// function below is a stub that returns realistic mock data on the same
// shape a real integration would use.
//
// TO GO LIVE:
//   1. Get API base URL + auth token/API key from Xbotgo (ask your rep for
//      developer/API access — this is not self-serve on their public site).
//   2. Fill in XBOTGO_CONFIG below (or load from import.meta.env vars, e.g.
//      VITE_XBOTGO_API_BASE / VITE_XBOTGO_API_KEY, and a .env file that is
//      gitignored).
//   3. Replace the mock bodies in each function with real `fetch()` calls.
//      The function signatures and return shapes are designed so nothing
//      else in the app needs to change.
// -----------------------------------------------------------------------

const XBOTGO_CONFIG = {
  apiBase: import.meta.env.VITE_XBOTGO_API_BASE || null,
  apiKey: import.meta.env.VITE_XBOTGO_API_KEY || null,
  deviceId: import.meta.env.VITE_XBOTGO_DEVICE_ID || null,
};

export function isXbotgoConfigured() {
  return Boolean(XBOTGO_CONFIG.apiBase && XBOTGO_CONFIG.apiKey);
}

// Live score/clock pulled from the scoreboard unit.
export async function getLiveScore() {
  if (isXbotgoConfigured()) {
    // TODO real call:
    // const res = await fetch(`${XBOTGO_CONFIG.apiBase}/devices/${XBOTGO_CONFIG.deviceId}/score`, {
    //   headers: { Authorization: `Bearer ${XBOTGO_CONFIG.apiKey}` },
    // });
    // return res.json();
  }

  return mockDelay({
    source: 'mock',
    homeScore: null,
    awayScore: null,
    quarter: null,
    clock: null,
  });
}

// Auto-tracked camera clips around a given game timestamp (e.g. right after
// a scored basket). Real Xbotgo units auto-clip highlights already — this
// pulls those, rather than re-recording them client-side.
export async function getClipsForMoment(gameId, timestampSeconds) {
  if (isXbotgoConfigured()) {
    // TODO real call:
    // const res = await fetch(
    //   `${XBOTGO_CONFIG.apiBase}/devices/${XBOTGO_CONFIG.deviceId}/clips?game=${gameId}&t=${timestampSeconds}`,
    //   { headers: { Authorization: `Bearer ${XBOTGO_CONFIG.apiKey}` } }
    // );
    // return res.json();
  }

  return mockDelay({
    source: 'mock',
    clipUrl: null,
    thumbnailUrl: null,
    note: 'Xbotgo not connected yet — this clip is a placeholder.',
  });
}

// Pushes a highlight tag back to Xbotgo's platform so it shows up in their
// own recruiting/share tools, once that endpoint is available.
export async function pushHighlightTag(highlight) {
  if (isXbotgoConfigured()) {
    // TODO real call: POST highlight metadata to Xbotgo.
  }
  return mockDelay({ source: 'mock', accepted: false, highlight });
}

function mockDelay(value, ms = 150) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
