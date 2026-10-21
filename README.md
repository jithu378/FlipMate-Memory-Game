# FlipMate — Flip. Match. Win.

FlipMate is a responsive memory card game built with React and Vite. Flip cards, find matching pairs, and beat your best time. Play solo or take turns with friends on the same device.

**Live demo:** https://flipmate-memory-game.vercel.app/

> **Online multiplayer is planned, not implemented.** The app shows an "Online Multiplayer — Coming Soon" page, but there are no online rooms, accounts, or cross-device play yet. All current gameplay and data are local to your browser.

## Features

- **Solo mode** with timer, move counter, one hint per round, pause, and restart.
- **Local multiplayer** for 2, 3, or 4 players, taking turns on the same device.
- **Five difficulty levels:** Easy (6 pairs), Normal (8), Medium (12), Hard (18), Extreme (24).
- **Card themes:** Symbols, Space, Tech, Everyday, Animals, and a Random option.
- **Leaderboard** with solo, multiplayer, and overall views, built from results saved on your device.
- **Game history** for solo and multiplayer matches.
- **Profile** with a display name and personal stats calculated from your local history.
- **Settings:** light/dark mode and a sound toggle.
- **How to Play** and **About Developer** pages.

> Leaderboard, history, and profile data are stored in the browser's `localStorage`. They are not synced across devices or browsers, and there is no global leaderboard.

## Planned

- Online multiplayer (private rooms, inviting friends, real-time matches, online leaderboards). This is in development and has no release date.
- The repository includes an unused [`supabase/`](supabase/) folder and a placeholder [`.env.example`](.env.example) reserved for this future work. The current app does not use Supabase.

## Tech Stack

| Area | Technology |
| --- | --- |
| UI | [React](https://react.dev/) |
| Build tool / dev server | [Vite](https://vite.dev/) with `@vitejs/plugin-react` |
| Icons | [lucide-react](https://lucide.dev/) |
| Analytics | `@vercel/analytics` |
| Styling | Plain CSS (`src/styles.css`, `src/responsive.css`) |
| Persistence | Browser `localStorage` |
| Hosting | Vercel (see `vercel.json`) |

## Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+
- npm (included with Node.js)

## Getting Started

```bash
# 1. Clone the repository
git clone <repository-url>
cd FlipMate

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open the local URL printed in the terminal (Vite's default is http://localhost:5173).

## Scripts

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

No environment variables are needed to run the game locally.

## Developer

Built by **Jithu Biju** (JB Devs).

Portfolio: https://jithu-portfolio-alpha.vercel.app/
