# FIFA Position Roulette

A responsive, client-only match-night utility built with React, TypeScript, Tailwind CSS and Vite. Add 1–11 players, spin a physical position wheel, and see the lineup on a responsive SVG football pitch.

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
- Individual rerolls, player and formation locks, instant mode, optional synthesised sound, goalkeeper exclusion and custom formation pools.
- Player names save automatically to browser localStorage. Save Roster explicitly saves them too; assignments are intentionally fresh after reload.
- Dynamic pitch markers, results summary, reset without losing names, and a self-contained SVG-to-PNG lineup export.
- Formation changes clear all positions and player locks, even if the new formation shares position labels. Excluding goalkeeper affects future spins, preserving existing assignments.
- With GK excluded, an 11-player squad can have at most 10 non-GK assignments; the remaining player is left unassigned with an explanation.

Formation data is separate in `src/formations.ts`. Named aliases share the corresponding tactical layout. The linked FIFPlay source returned HTTP 403 during implementation; layouts use the supplied catalogue, explicit examples and role-based structures rather than scraped source imagery.

## Validation coverage

Vitest checks all formation counts, unique labels/coordinates, required example positions, single-player support, full-team uniqueness across every formation, locked-player preservation, rerolls, goalkeeper exclusion and formation resets.

Headless Chromium was also used to verify a real animated spin, full-team assignment, locks, PNG download, formation switching, roster persistence, GK exclusion, group filtering, and mobile overflow. That browser smoke check exercised the actual UI; it is separate from the committed unit suite.
