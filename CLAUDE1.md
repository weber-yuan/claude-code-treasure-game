# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Build to build/ directory
```

No test or lint commands are configured.

## Architecture

Single-page React + TypeScript game built with Vite. All game logic lives in `src/App.tsx`.

**Tech Stack:**
- React 18 + TypeScript, built with Vite (SWC compiler)
- Tailwind CSS — styles are compiled into `src/index.css` (no `tailwind.config.js`)
- Framer Motion (`motion` package) for animations
- shadcn/ui components in `src/components/ui/` (Radix UI-based, 50+ components available but mostly unused)

**Game Logic (`src/App.tsx`):**
- State: `boxes` (array of 3, each with `isOpen` and `hasTreasure`), `score`, `gameEnded`
- One box is randomly assigned treasure at game init
- Treasure found: +$100 | Skeleton found: -$50
- Game ends when treasure is found or all boxes opened
- 3D flip animation via Framer Motion on box open

**Assets:**
- Images: `src/assets/` — `key.png`, `treasure_closed.png`, `treasure_opened.png`, `treasure_opened_skeleton.png`
- Audio: `src/audios/` — `chest_open.mp3`, `chest_open_with_evil_laugh.mp3`

**CSS Variables / Design Tokens:** `src/styles/globals.css`

**Vite config** (`vite.config.ts`): defines 50+ path aliases (e.g., `@/components` → `src/components`).
