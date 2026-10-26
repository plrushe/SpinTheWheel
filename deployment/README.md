# cPanel upload package

Download `football-roulette-cpanel.zip` using GitHub's **Download raw file** button. It contains the compiled production site, not the development source.

Upload the ZIP into the domain's document root in cPanel and extract it there, replacing the previous website files. `index.html`, `privacy.html`, `ads.txt` and the `assets` directory must sit directly in the document root. Files have 0644 permissions and directories have 0755 permissions.

The ZIP was tested on a plain static HTTP server: the app loads and adds a player. Its index loads `/assets/index-CBxUstDQ.js`, not `/src/main.tsx`. This is a deployment snapshot; rebuild the production package after changing the application. AdSense remains gated pending an independently configured advertising CMP.
