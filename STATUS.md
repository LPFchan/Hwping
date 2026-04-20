# Hwping Status

This document tracks current operational truth.

## Snapshot

- Last updated: `2026-04-20`
- Overall posture: `active`
- Current focus: validate the Chrome packaging path and the phase 1 Electron shell while continuing the shared-engine boundary work
- Highest-priority blocker: Chrome runtime smoke coverage, Electron runtime smoke coverage, and the native macOS file extension, Quick Look, and menu bar targets are still future work rather than finished product targets
- Next operator decision needed: none immediately
- Related decisions: `DEC-20260409-001`, `DEC-20260420-001`, `DEC-20260420-002`

## Current State Summary

Hwping has completed the Cargo workspace split and the initial typed facade and FFI boundary work. As of 2026-04-20, the repository has shifted to a Chrome-packaging and Electron-first desktop rollout, the `rhwp-chrome/` browser-extension surface is restored from upstream, the Chrome packaging path builds end-to-end, the Electron package builds and hosts the shared renderer through a local HTTP server and preload bridge, and the native macOS shell remains phase 2 implementation work.

## Active Phases Or Tracks

### Repo Operating Model Migration

- Goal: make repo-template the canonical operating model for Hwping
- Status: `in progress`
- Why this matters now: the fork needs durable truth, provenance, and recurring upstream-review discipline before more product work piles up
- Current work: root truth docs are installed, initial `DEC-*` records are seeded, the legacy markdown execution history has been backfilled into commit-backed `LOG-*` records, the upstream-intake sample has been normalized to `UPS-*` naming, and the Chrome/Electron rollout update has been captured in `DEC-20260420-002`
- Exit criteria: new durable work routes through the correct artifact layers and new commits carry commit-backed provenance trailers by default
- Dependencies: contributor discipline and future tooling support
- Risks: partial adoption would leave competing documentation habits in place
- Related ids: `DEC-20260409-001`, `LOG-20260410-225424-codex`, `DEC-20260420-002`

### Chrome Packaging And Electron Shell Rollout

- Goal: ship `rhwp-chrome/` as the first public browser surface and use `apps/hwping-electron/` as the phase 1 desktop shell
- Status: `in progress`
- Why this matters now: the product direction depends on a browser surface and a thin desktop shell before the native macOS shell fills out
- Current work: `rhwp-chrome/` has been restored from upstream, `rhwp-studio/` and `web/fonts/` are back in the tree, the Chrome build now runs through `wasm-pack` plus Vite, and `apps/hwping-electron/` now hosts the shared renderer through a local HTTP server plus preload bridge
- Exit criteria: the Chrome extension can open documents, the Electron shell can open/save/recent/print through shared boundaries, and the next macOS shell phase can reuse the same document outputs
- Dependencies: shared-core rendering correctness, stable facade design, and continued browser/Electron/macOS boundary discipline
- Risks: browser-specific or Electron-specific code may drift into engine code if the boundary is not held firmly
- Related ids: `DEC-20260420-002`

### Native macOS Shell Phase 2

- Goal: grow the macOS file integration, Quick Look, Finder, and menu bar surfaces after the Electron shell stabilizes
- Status: `planned`
- Why this matters now: the operator still wants native macOS entry points, but only after the Chrome and Electron rollout proves out
- Current work: `crates/hwping-core/` and `crates/hwping-ffi/` still exist, and `apps/hwping-macos/ffi-smoke` proves the current FFI path
- Exit criteria: the macOS companion surfaces can open documents and produce preview output through the shared boundaries
- Dependencies: phase 1 Electron stabilization, shared-core renderer correctness, stable facade design, and continued upstream alignment
- Risks: product code may drift into engine code if boundaries are not held firmly
- Related ids: `DEC-20260409-001`, `DEC-20260409-003`, `DEC-20260409-004`, `DEC-20260420-002`

### Upstream Intake Cadence

- Goal: keep recurring upstream review cheap and repeatable
- Status: `in progress`
- Why this matters now: Hwping is a downstream fork and depends on explicit upstream decision records
- Current work: the canonical `upstream-intake/` package exists, includes the seeded example review window, and now has a fresh live review window in `UPS-20260420-001`
- Exit criteria: each future review window produces paired `UPS-*` internal and operator-brief artifacts plus updated carry-forward knowledge when needed
- Dependencies: maintainer cadence and disciplined artifact naming
- Risks: accumulated upstream drift if review windows stop being recorded
  - Related ids: `LOG-20260410-225424-codex`, `UPS-20260420-001`

## Recent Changes To Project Reality

- Date: `2026-04-20`
  - Change: product direction shifted to a Chrome-packaging and Electron-first desktop rollout, `rhwp-chrome/`, `rhwp-studio/`, and `web/fonts/` were restored from upstream, the Chrome packaging path now builds successfully, and `apps/hwping-electron/` now builds successfully too
  - Why it matters: Hwping now has an explicit browser ship target and a thin desktop shell before the native macOS shell, so the remaining companion work can be sequenced instead of defining the whole product
  - Related ids: `DEC-20260420-002`
- Date: `2026-04-05`
  - Change: the repository root became a Cargo workspace and the upstream-aligned engine moved under `crates/rhwp/`
  - Why it matters: this made the downstream product boundary explicit and reduced sync pressure on the engine core
  - Related ids: `DEC-20260409-005`
- Date: `2026-04-05`
  - Change: `crates/hwping-core/`, `crates/hwping-ffi/`, and `apps/hwping-macos/ffi-smoke` established the first downstream embedding boundary
  - Why it matters: Hwping now has a concrete non-engine boundary for future app and extension work
  - Related ids: `DEC-20260409-003`
- Date: `2026-04-09`
  - Change: the full repo-template operating model was adopted with root truth docs, provenance records, stable artifact rules, and the retirement of `mydocs/hwping/` into those layers
  - Why it matters: the repository now has a canonical home for truth, plans, decisions, commit-backed execution history, and upstream intake
  - Related ids: `DEC-20260409-001`, `DEC-20260409-002`, `LOG-20260410-225424-codex`

## Active Blockers And Risks

- Blocker or risk: Chrome runtime smoke coverage, Electron runtime smoke coverage, and the native macOS companion surfaces remain future work
  - Effect: Hwping can build the new rollout path, but it still needs real browser and desktop validation before it can ship the full product direction
  - Owner: Hwping maintainer
  - Mitigation: keep browser, Electron, and macOS product code outside `crates/rhwp/` and reuse the same document boundary everywhere
  - Related ids: `DEC-20260420-002`
- Blocker or risk: provenance discipline depends on habit until tooling improves
  - Effect: commits or artifacts may drift back into ad hoc patterns if contributors do not use stable IDs and trailers consistently
  - Owner: Hwping maintainer and collaborating agents
  - Mitigation: keep contributor guidance current and prefer artifact-backed work for durable outcomes
  - Related ids: `LOG-20260410-225424-codex`

## Immediate Next Steps

- Next: keep routing browser-extension, Electron, and macOS companion work through `INBOX.md`, `research/`, `records/decisions/`, and git commit history instead of relying only on legacy notes
  - Owner: maintainers and orchestrator agents
  - Trigger: the next task that produces durable planning, research, decision, or execution history
  - Related ids: `DEC-20260420-002`
- Next: smoke the rebuilt Chrome extension in a real browser session and continue the Electron desktop shell work
  - Owner: Hwping maintainer
  - Trigger: the next browser-validation pass after packaging
  - Related ids: `DEC-20260420-002`
- Next: begin the native macOS shell phase after Electron stabilizes
  - Owner: Hwping maintainer
  - Trigger: the phase 1 Electron rollout proves out
  - Related ids: `DEC-20260420-002`
- Next: keep future upstream reviews in `UPS-*` format and update carry-forward notes when a review establishes standing knowledge
  - Owner: maintainers and upstream-intake agents
  - Trigger: the next upstream compare window or sync candidate
  - Related ids: `LOG-20260410-225424-codex`, `UPS-20260420-001`
