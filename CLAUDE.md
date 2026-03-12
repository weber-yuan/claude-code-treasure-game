# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at http://localhost:3000 (auto-opens browser)
npm run build    # Build to build/ directory
```

No test or lint commands are configured.

## Architecture

Single-page React + TypeScript game built with Vite (SWC compiler). All game logic lives in `src/App.tsx`.

**Tech Stack:**
- React 18 + TypeScript
- Tailwind CSS — compiled into `src/index.css`; no `tailwind.config.js` exists
- Framer Motion via the `motion` package — import from `motion/react`, not `framer-motion`
- shadcn/ui components in `src/components/ui/` (Radix UI-based, 50+ pre-installed but mostly unused)
- CSS design tokens in `src/styles/globals.css`

**Game Logic (`src/App.tsx`):**
- Views: `login` | `game` — starts on login screen; `initializeGame()` is called by `startGame`/`playAsGuest`, not on mount
- Game state: `boxes` (array of 3, each with `isOpen` and `hasTreasure`), `score`, `gameEnded`
- Player state: `currentUsername`, `isGuest`, `view`
- One box is randomly assigned treasure at game init; game ends when treasure is found or all boxes opened
- Treasure found: +$100 | Skeleton found: -$50
- `useEffect` watching `gameEnded`: calls `saveScore()` when `true && !isGuest`
- Sound effects played on open: `chest_open.mp3` (treasure) / `chest_open_with_evil_laugh.mp3` (skeleton)
- Custom key cursor (`key.png`) shown on un-opened chests via inline `style={{ cursor: url(...) }}`
- 3D flip animation (rotateY) via Framer Motion on box open
- UI text is in Traditional Chinese

**Leaderboard (`localStorage` key: `treasure_hunt_leaderboard`):**
- Schema: `LeaderboardEntry[]` — `{ username: string, score: number, playedAt: string }` (ISO 8601)
- Each completed game appends a new entry — it is a full game history, not a per-user upsert
- Guests never written; sorted by `score` descending in the dialog
- `registeredCount` shown on login = count of unique `username.toLowerCase()` values across all entries
- `LeaderboardEntry` type is exported from `src/components/LeaderboardDialog.tsx`

**Components (`src/components/`):**
- `LoginScreen.tsx` — name input + Start/Guest/Leaderboard buttons; props: `onStart`, `onGuest`, `onViewLeaderboard`, `registeredCount`
- `LeaderboardDialog.tsx` — shadcn Dialog + Table showing all game records sorted by score desc; current player's rows highlighted amber

**Assets:**
- Images: `src/assets/` — `key.png`, `treasure_closed.png`, `treasure_opened.png`, `treasure_opened_skeleton.png`
- Audio: `src/audios/` — `chest_open.mp3`, `chest_open_with_evil_laugh.mp3`
- Import assets directly in TSX; Vite handles the URL resolution

**Path Aliases (`vite.config.ts`):**
- `@/` → `src/` (e.g., `@/components/ui/button`)
- All third-party packages also have version-pinned aliases (e.g., `motion@x.x.x` → `motion`); this is boilerplate and can be ignored
