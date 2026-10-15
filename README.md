# FlipMate by JB Devs

**Flip. Match. Win.**

A clean, responsive memory card game starter built with React + Vite. The first version includes working solo play, local multiplayer for 2–4 players, difficulty selection, card themes, local stats, settings, and local score history.

> **Important:** Online room codes, cross-device multiplayer, authentication, and a global leaderboard are not connected yet. The online page currently contains a clearly labelled UI/demo flow. A real shared backend requires a configured Supabase project and server-side game validation; do not present the demo room as a real online room.

## Requirements

- Node.js 20.19+ or 22.12+ recommended
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

The production output is created in `dist/`.

## Deploy to Vercel

1. Create a GitHub repository and push this project.
2. Import the repository in Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy. The local game does not require environment variables.

## Features in this starter

- Solo game mode.
- Local turn-based multiplayer for 2, 3, or 4 players on the same device.
- Easy, Normal, Medium, Hard, and Extreme board sizes.
- Symbols, Nature, Tech, and Everyday card themes.
- Timer, move counter, matched-pair tracking, hint, pause, and restart.
- Local player name, local game history, personal best, and stats via `localStorage`.
- Light/dark theme and sound-effect toggle.
- Responsive layout and reduced-motion support.
- Online multiplayer setup screen clearly marked as a demo until a backend is connected.

## Online multiplayer implementation plan

To make cross-device rooms and a global leaderboard real:

1. Create a Supabase project.
2. Implement Supabase Auth and a profiles table.
3. Create protected room and participant tables.
4. Use trusted server-side functions to validate moves and update game state; do not accept arbitrary client score submissions.
5. Use Supabase Realtime to distribute validated room updates.
6. Implement RLS policies and test them with unauthorized users.
7. Store only validated completed results for global rankings.
8. Configure the Vercel environment variables shown in `.env.example`.

The `.env.example` is a placeholder for future integration; this starter does not import or call Supabase yet. Never put service-role or secret keys in frontend environment variables.

## Notes

- Local results are saved in the current browser only and do not sync across devices.
- The score formula is a starter formula and can be tuned after playtesting.
- Free-tier quotas and inactivity rules can change; verify provider documentation before relying on free hosting long-term.
