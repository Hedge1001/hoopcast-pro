# HoopCast AI

Live in-game stat tracking and recruiting highlight reels, built as a
React + Vite PWA.

## What's here

- **Live Feed** — courtside stat entry (2PT/3PT/FT, rebounds, assists,
  steals, blocks, turnovers) that streams into a play-by-play list.
- **Running Averages** — season-to-date per-player averages (PPG/RPG/APG/
  SPG/BPG), recomputed live from the full event log.
- **Highlight Capture** — a "Capture Highlight" button that records a
  short local camera/mic clip around a scoring play (rolling buffer via
  `MediaRecorder`), with a fallback to Xbotgo's own auto-clipped footage
  once that integration is live.
- **Public Recruit Profiles** — a shareable `/player/:id` page per athlete
  with averages and their highlight reel, meant to be sent straight to
  scouts/recruiters — no login required.
- **Xbotgo integration** — currently a **placeholder** (`src/services/xbotgoService.js`).
  See "Connecting Xbotgo" below.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a production
build in `dist/`; `npm run preview` serves that build locally.

Camera-based highlight capture requires the browser to grant
camera/microphone permission, and works best served over `https://` or
`localhost` (browsers block camera access on plain http origins other than
localhost).

## Project structure

```
hoopcast-pro/
├── index.html
├── manifest.json
├── package.json
├── vite.config.js
├── public/
│   └── service-worker.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data/mockGame.js          # seed roster + stat type definitions
    ├── services/
    │   ├── storageService.js     # localStorage persistence
    │   └── xbotgoService.js      # Xbotgo integration — placeholder, see below
    ├── hooks/useGameStore.js     # central state: roster, games, events, highlights
    ├── utils/statMath.js         # event log -> per-game totals -> running averages
    └── components/
        ├── ScoreboardBar.jsx     # live scorebug
        ├── LiveFeed.jsx          # stat entry + play-by-play
        ├── FeedEvent.jsx
        ├── HighlightCaptureButton.jsx
        ├── HighlightReel.jsx
        ├── StatTable.jsx
        ├── PlayerCard.jsx
        └── RecruitProfile.jsx    # public /player/:id page
```

## Connecting Xbotgo

Xbotgo's auto-tracking scoreboard/camera units expose live score data and
auto-clipped highlight footage, but this project doesn't yet have API
credentials or docs from them. `src/services/xbotgoService.js` is written
so plugging in real access is a small, contained change:

1. Contact Xbotgo (via your device/account rep — this isn't self-serve on
   their public site) for API base URL, an auth token/API key, and your
   device ID.
2. Create a `.env` file (already gitignored) with:
   ```
   VITE_XBOTGO_API_BASE=https://api.xbotgo.example.com
   VITE_XBOTGO_API_KEY=your-key-here
   VITE_XBOTGO_DEVICE_ID=your-device-id
   ```
3. In `xbotgoService.js`, uncomment and complete the `fetch()` calls marked
   `TODO real call` inside `getLiveScore`, `getClipsForMoment`, and
   `pushHighlightTag`. Nothing else in the app needs to change — those
   three functions are the only integration surface.

Until then, every Xbotgo call resolves to clearly-labeled mock data so the
rest of the app is fully usable.

## Data & persistence

All game/roster/highlight state is currently stored in the browser via
`localStorage` (`src/services/storageService.js`) — there's no backend
yet. For multi-device use (e.g. a coach's tablet and a public recruiting
site reading the same data), swap `storageService.js` for calls to a real
database/API; `useGameStore.js` is the only place that touches it.

## Pushing this to GitHub

From inside this project folder:

```bash
git init
git add .
git commit -m "Initial commit: HoopCast AI live feed, stats, highlights"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Create the empty repo on GitHub first (no README/.gitignore, since this
project already has them) if it doesn't exist yet.
