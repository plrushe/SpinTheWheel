# FIFA Position Roulette

A responsive, client-only match-night utility built with React, TypeScript, Tailwind CSS and Vite. Add 1–22 players, spin a physical position wheel, and see both teams on responsive SVG football pitches.

## Develop

Use Node.js 22+ (validated with Node 24).

```sh
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

## Validate

```sh
npm test
npm run build
```

`npm run preview` serves the production build. No backend, API keys, external pitch images or runtime network access are needed.

## Features

- All 51 requested FIFA 22 formation names, including named aliases/variations, with 11 distinct coordinate-based slots each.
- Unbiased cryptographic rejection sampling for each available slot; sequential Spin All reveals each assignment individually.
- Balanced, random team selection followed by a random available position. Spin All shuffles player order; locks preserve both team and position.
- Team A / Team B pitch tabs with independent formations and a responsive, keyboard-accessible two-board overview.
- Individual rerolls, player and formation locks, instant mode, optional synthesised sound, goalkeeper exclusion and custom formation pools.
- Player names save automatically to browser localStorage. Save Roster explicitly saves them too; assignments are intentionally fresh after reload.
- Dynamic pitch markers, results summary, reset without losing names, and a self-contained SVG-to-PNG export for the selected team.
- Formation changes clear only that team’s positions and player locks, preserving the other team. Reset both teams clears all assignments and locks. Excluding goalkeeper affects future spins, preserving existing assignments.
- With GK excluded, each team can have at most 10 new non-GK assignments (20 total); extra players remain unassigned with an explanation. Existing locked GK assignments are preserved.

Formation data is separate in `src/formations.ts`. Named aliases share the corresponding tactical layout. The linked FIFPlay source returned HTTP 403 during implementation; layouts use the supplied catalogue, explicit examples and role-based structures rather than scraped source imagery.

## Validation coverage

Vitest checks all formation counts, unique labels/coordinates, required example positions, single-player support, full-team uniqueness across every formation, locked-player preservation, rerolls, goalkeeper exclusion and formation resets. Two-team checks cover 1–22 players, balance, team-scoped uniqueness, separate formations, capacity, locks, rerolls, and resetting only one team.

Headless Chromium was also used to verify a real animated spin, full-team assignment, locks, PNG download, formation switching, roster persistence, GK exclusion, group filtering, and mobile overflow. The two-team browser checks also cover 22-player assignment, tabs, the side-by-side popover, Escape and focus restoration, team-scoped formation changes and PNG export. Those browser smoke checks exercised the actual UI; it is separate from the committed unit suite.
