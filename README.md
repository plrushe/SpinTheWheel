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
- Optional single-team mode: turn off **Enable second team** in the top-right header to randomise only Team 1. The preference saves locally; Team 1 keeps its lineup and locks, Team 2 assignments/locks clear, and both teams’ names/formations stay saved.
- Balanced, random team selection followed by a random available position. Spin All shuffles player order; locks preserve both team and position.
- Editable team names saved locally and reflected in tabs, roster status, the matchup overview, results and PNG headers. Blank names fall back to Team A / Team B.
- Team A / Team B pitch tabs with independent formations and a responsive, keyboard-accessible two-board overview.
- Individual rerolls, player and formation locks, instant mode, optional synthesised sound, goalkeeper exclusion and custom formation pools.
- Player names save automatically to browser localStorage. Save Roster explicitly saves them too; assignments are intentionally fresh after reload.
- Per-team set-piece taker randomisation: free kicks, penalties, left corners and right corners by default, with optional throw-ins and goal kicks. Only assigned teammates are eligible; roles may repeat, supporting a one-player team. Position locks do not prevent taking set pieces.
- Dynamic pitch markers, results summary, reset without losing names, and a self-contained SVG-to-PNG export for the selected team.
- Formation changes clear only that team’s positions and player locks, preserving the other team. The bottom Reset both teams button asks “Are you sure?” before clearing assignments and locks. Cancel or Escape leaves the lineup untouched; names and formations are retained. Excluding goalkeeper affects future spins, preserving existing assignments.
- With GK excluded, each team can have at most 10 new non-GK assignments (20 total); extra players remain unassigned with an explanation. Existing locked GK assignments are preserved.

Formation data is separate in `src/formations.ts`. Named aliases share the corresponding tactical layout. The linked FIFPlay source returned HTTP 403 during implementation; layouts use the supplied catalogue, explicit examples and role-based structures rather than scraped source imagery.

## Validation coverage

Vitest checks all formation counts, unique labels/coordinates, required example positions, single-player support, full-team uniqueness across every formation, locked-player preservation, rerolls, goalkeeper exclusion and formation resets. Two-team checks cover 1–22 players, balance, team-scoped uniqueness, separate formations, capacity, locks, rerolls, and resetting only one team.

Headless Chromium was also used to verify a real animated spin, full-team assignment, locks, PNG download, formation switching, roster persistence, GK exclusion, group filtering, and mobile overflow. The two-team browser checks also cover 22-player assignment, tabs, the side-by-side popover, Escape and focus restoration, team-scoped formation changes and PNG export. Those browser smoke checks exercised the actual UI; it is separate from the committed unit suite.

## Team names and set-piece duties

Edit names directly inside the team tabs (24 characters each): click the pencil, double-click the tab or press F2 on a focused tab. Enter or blur saves; Escape cancels. Blank names fall back to Team A / Team B. Use **Randomise takers** under the active team’s pitch; **Choose duties** enables or disables roles. Results stay with their team when switching tabs. Removing a player, moving them to the other team, changing that team’s formation, or confirming a reset removes their invalid duties. Renaming a player or keeping them on the same team preserves their duties. New roles must be drawn; they are never silently assigned. Names persist across refreshes; lineups and duties start fresh.

The supplied EA controls guide returned HTTP 403, so the duty list is a configurable default and has not been independently verified against that page: https://www.ea.com/en-gb/playtesting/news/gameplay-controls-guide-set-pieces.

Validation includes unit tests for taker eligibility, team scoping, empty/single-player teams, repeated duties, stale-assignment invalidation and team-name fallbacks. Browser checks cover saved team names, named tabs/overview, team-specific draws, role selection, reset confirmation/cancellation and mobile overflow.

## Single-team mode

Disable **Enable second team** in the top-right header. Only Team 1’s editable tab, formation and set-piece duties remain visible; the two-team overview is hidden. Individual spins and Spin All draw solely from Team 1’s 11 positions (10 when GK is excluded). Locks still apply. The bottom reset confirmation adapts to one team. The team-mode preference survives refreshes alongside roster and team names.

New players can be added up to the active capacity (11 or 22). Switching an existing larger roster to one team never deletes names: Spin All shuffles unlocked players and fills the available slots, leaving extras unassigned. Re-enable the second team to restore its saved name/formation and allow assignments across both sides again.

Single-team validation covers every formation, capacity, GK exclusion, rerolls, mode transitions and preserved locks/names. Browser validation checks hidden second-team controls, set pieces, reset copy, saved mode, animated solo spins, switching back to two teams, keyboard tabs, busy-state protection and mobile layout.

The header contains the team-draw selector in place of the previous tagline, help button and formation link. On mobile it wraps below the brand. Browser checks cover inline editing via pencil, double-click and F2; Enter/blur save, Escape cancellation, focus restoration, blank-name fallback, saved names, keyboard tab navigation, disabled controls while spinning, single-team mode and mobile overflow.
