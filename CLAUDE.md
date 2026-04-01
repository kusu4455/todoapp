# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm start        # Run production server
```

No linter, formatter, or test framework is configured.

## Architecture

This is a **client-side only** Next.js 14 app — no backend, no API routes, no data persistence. All state is in-memory React state; tasks are lost on page refresh.

### Key files

- `src/app/page.tsx` — The entire application lives here. It's a single "use client" component containing all state, logic, and JSX.
- `src/app/globals.css` — All styles, including CSS custom properties, animations, and responsive breakpoints.
- `src/app/layout.tsx` — Root layout with metadata (Japanese page title/description).

### Data model

The `Task` interface in `page.tsx`:
```ts
interface Task {
  id: number;
  text: string;
  done: boolean;
  priority: 'high' | 'mid' | 'low';
  category: 'work' | 'personal' | 'other';
  deadline?: string;      // ISO date string
  completing: boolean;    // animation flag
  removing: boolean;      // animation flag
}
```

### UI language

All UI text is in Japanese. Keep new UI labels in Japanese.

### Path aliases

`@/*` resolves to `./src/*` (configured in `tsconfig.json`).
