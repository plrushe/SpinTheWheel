# Mobile app layout

The new layout activates below 768px. At 768px and above the existing dashboard is rendered. Game state and all draw handlers remain in `App`; changing mobile tabs or crossing the breakpoint preserves the current game.

`MobileLayout.tsx` owns presentation state (navigation, editing and roulette visibility). `mobile.css` isolates phone styles. `FootballPitch` uses the same formation slots and player markers with a flat mobile projection, while retaining the existing desktop projection. No additional runtime dependencies were added.

Game contains the formation and team selectors, pitch, compact progress, expandable duties and formation controls, and PNG export. The fixed dock provides spins and Game / Squad / Settings navigation, including safe-area padding. Squad provides add, edit, remove, lock, individual spin and save actions. Settings contains team mode, sound, instant mode, goalkeeper exclusion and the existing reset confirmation. Advertising and storage consent behavior is unchanged.

The mobile roulette opens on spin, animates before assigning, and displays the result. Closing it does not stop the existing sequential draw. Instant mode and reduced motion skip the phone animation. Native dialogs provide modal focus and Escape handling.

## Verification

- `npm test`: 95 tests passed.
- `npm run build`: TypeScript and production build passed.
- Chromium desktop screenshots compared pixel-for-pixel against the parent branch at 1024 × 1000, 1440 × 1000 and 1920 × 1000: identical.
- Chromium mobile flows checked: add/edit/remove, lock/unlock, saved roster, instant individual/all spins, closing during Spin All, team rename/switch, one-team mode, both-team dialog, random/manual duties and pitch badges, formation changes/lock, PNG export, reset confirmation and cookie settings.
- Non-instant animation and reduced-motion behavior checked separately.
- No page overflow at 320, 375, 390, 430, 600, 767, 768, 820 or 1024px widths; all three mobile screens checked below 768px.
- Physical iOS Safari and Android Chrome were not available; safe-area and keyboard support is implemented using CSS and VisualViewport.

Screenshots: [Game](mobile/game.png), [Squad](mobile/squad.png), [Roulette](mobile/roulette.png).

For repeatable browser checks, install Playwright in a development tools environment and run a local Vite server on port 4174, then `node scripts/check-mobile.cjs`. Set `TEST_URL` to test another server, `CHROMIUM_PATH` for a system browser, or `PLAYWRIGHT_MODULE` to an existing Playwright installation. The script writes screenshots and a PNG export to `/tmp`.
