# Known Local Overrides

Use this register to record intentional Hwping divergences so they do not have to be rediscovered every review.

Only record stable, intentional divergences here. Do not use this file for temporary experiments.

## Entry Template

- Area:
- Local surface:
- Upstream surface:
- Why the fork diverged:
- Collision rule to apply during intake:
- Revisit trigger:
- Related decision record:

## Current Entries

- Area: Chrome-packaged browser surface and Electron shell rollout
- Local surface: `rhwp-chrome/`, `apps/hwping-electron/`, browser-led reader surface work, and companion macOS integrations in `apps/` and `extensions/`
- Upstream surface: upstream Chrome and Firefox extension packages plus browser-facing reader docs
- Why the fork diverged: Hwping now wants Chrome as the browser lane, Electron as phase 1 desktop shell, and native macOS as phase 2. Firefox is deferred unless the operator reopens it later.
- Collision rule to apply during intake: accept and adapt Chrome-extension and Electron-shell-adjacent renderer work into the main tree; defer Firefox-only browser surface work; decline unrelated upstream browser products such as web demo hosting, npm distribution, or VS Code surfaces unless the operator explicitly changes scope again.
- Revisit trigger: another product-direction reversal
- Related decision record: [../records/decisions/DEC-20260420-002-electron-first-desktop-rollout-with-chrome-packaging.md](../records/decisions/DEC-20260420-002-electron-first-desktop-rollout-with-chrome-packaging.md)

- Area: Deferred Firefox extension surface
- Local surface: `rhwp-firefox/`
- Upstream surface: upstream Firefox extension package and browser-facing reader docs
- Why the fork diverged: Hwping is not shipping Firefox as an active browser lane in the current rollout.
- Collision rule to apply during intake: hold Firefox-only surface changes unless the operator reopens Firefox as a supported lane.
- Revisit trigger: operator reopens Firefox as an active browser target
- Related decision record: [../records/decisions/DEC-20260420-002-electron-first-desktop-rollout-with-chrome-packaging.md](../records/decisions/DEC-20260420-002-electron-first-desktop-rollout-with-chrome-packaging.md)

- Area: Engine relocation inside a Cargo workspace
- Local surface: `crates/rhwp/` as the upstream-aligned engine subtree inside the Hwping workspace
- Upstream surface: upstream root-level engine paths such as `src/renderer/...`
- Why the fork diverged: Hwping moved the engine under `crates/rhwp/` so downstream app code can live outside the shared core and upstream sync remains practical.
- Collision rule to apply during intake: preserve the upstream behavior when possible, but adapt path-level and workspace-level changes into the relocated crate instead of trying to recreate upstream root layout.
- Revisit trigger: upstream adopts a comparable workspace split, or Hwping intentionally changes its repository boundary model
- Related decision record: [reports/internal-records/UPS-20260407-001-upstream-main-to-local-devel.md](reports/internal-records/UPS-20260407-001-upstream-main-to-local-devel.md)
