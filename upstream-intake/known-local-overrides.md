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

- Area: Product-surface pruning
- Local surface: `apps/hwping-macos/`, `extensions/`, `crates/hwping-core/`, `crates/hwping-ffi/`, and the absence of web, npm, browser-only, and VS Code distribution paths in the main product direction
- Upstream surface: upstream web demo, npm packages, browser-only workflows, and VS Code distribution surfaces
- Why the fork diverged: Hwping is a macOS-focused downstream fork that keeps only the code and docs needed for engine maintenance and the native product surface.
- Collision rule to apply during intake: decline changes that only restore removed upstream product surfaces; adapt shared engine improvements without reintroducing those surfaces.
- Revisit trigger: an explicit Hwping product decision to restore a non-macOS product surface
- Related decision record: [../mydocs/hwping/plans/hwping_repo_sync_plan.md](../mydocs/hwping/plans/hwping_repo_sync_plan.md)

- Area: Engine relocation inside a Cargo workspace
- Local surface: `crates/rhwp/` as the upstream-aligned engine subtree inside the Hwping workspace
- Upstream surface: upstream root-level engine paths such as `src/renderer/...`
- Why the fork diverged: Hwping moved the engine under `crates/rhwp/` so downstream app code can live outside the shared core and upstream sync remains practical.
- Collision rule to apply during intake: preserve the upstream behavior when possible, but adapt path-level and workspace-level changes into the relocated crate instead of trying to recreate upstream root layout.
- Revisit trigger: upstream adopts a comparable workspace split, or Hwping intentionally changes its repository boundary model
- Related decision record: [reports/internal-records/2026-04-07-upstream-main-to-local-devel.md](reports/internal-records/2026-04-07-upstream-main-to-local-devel.md)