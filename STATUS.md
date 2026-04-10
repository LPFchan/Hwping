# Hwping Status

This document tracks current operational truth.

## Snapshot

- Last updated: `2026-04-10`
- Overall posture: `active`
- Current focus: institutionalize the root repo-template layers while continuing the macOS reader boundary build
- Highest-priority blocker: the full macOS app target and Quick Look extension targets are still planned surfaces rather than finished product targets
- Next operator decision needed: none immediately
- Related decisions: `DEC-20260409-001`

## Current State Summary

Hwping has completed the Cargo workspace split and the initial typed facade and FFI boundary work, but the main app and Quick Look targets remain future implementation work. As of 2026-04-10, the repository also adopts the full repo-template operating model, including root truth docs, provenance records, commit-backed execution history, and stable artifact conventions.

## Active Phases Or Tracks

### Repo Operating Model Migration

- Goal: make repo-template the canonical operating model for Hwping
- Status: `in progress`
- Why this matters now: the fork needs durable truth, provenance, and recurring upstream-review discipline before more product work piles up
- Current work: root truth docs are installed, initial `DEC-*` records are seeded, the legacy markdown execution history has been backfilled into commit-backed `LOG-*` records, the upstream-intake sample has been normalized to `UPS-*` naming, and the old Hwping-specific docs namespace and markdown execution-history surface have been retired into root docs, `DEC-*`, and `RSH-*` artifacts
- Exit criteria: new durable work routes through the correct artifact layers and new commits carry commit-backed provenance trailers by default
- Dependencies: contributor discipline and future tooling support
- Risks: partial adoption would leave competing documentation habits in place
- Related ids: `DEC-20260409-001`, `LOG-20260410-225424-codex`

### macOS Reader Boundary Build

- Goal: grow the app-facing and Apple-platform surfaces on top of the workspace split
- Status: `in progress`
- Why this matters now: the product direction depends on a stable reader stack, not only on engine cleanup
- Current work: `crates/hwping-core/` and `crates/hwping-ffi/` exist, and `apps/hwping-macos/ffi-smoke` proves the current FFI path
- Exit criteria: the main app and Quick Look targets can open documents and produce preview output through the shared boundaries
- Dependencies: shared-core renderer correctness, stable facade design, and continued upstream alignment
- Risks: product code may drift into engine code if boundaries are not held firmly
- Related ids: `DEC-20260409-001`

### Upstream Intake Cadence

- Goal: keep recurring upstream review cheap and repeatable
- Status: `in progress`
- Why this matters now: Hwping is a downstream fork and depends on explicit upstream decision records
- Current work: the canonical `upstream-intake/` package exists and includes a seeded example review window
- Exit criteria: each future review window produces paired `UPS-*` internal and operator-brief artifacts plus updated carry-forward knowledge when needed
- Dependencies: maintainer cadence and disciplined artifact naming
- Risks: accumulated upstream drift if review windows stop being recorded
  - Related ids: `LOG-20260410-225424-codex`

## Recent Changes To Project Reality

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

- Blocker or risk: app and extension targets remain mostly future work
  - Effect: Hwping can validate boundaries and preview flows, but it cannot yet ship the intended native user experience
  - Owner: Hwping maintainer
  - Mitigation: keep the facade and FFI layers narrow and continue implementing product surfaces outside the engine core
  - Related ids: `DEC-20260409-001`
- Blocker or risk: provenance discipline depends on habit until tooling improves
  - Effect: commits or artifacts may drift back into ad hoc patterns if contributors do not use stable IDs and trailers consistently
  - Owner: Hwping maintainer and collaborating agents
  - Mitigation: keep contributor guidance current and prefer artifact-backed work for durable outcomes
  - Related ids: `LOG-20260410-225424-codex`

## Immediate Next Steps

- Next: start routing new durable work through `INBOX.md`, `research/`, `records/decisions/`, and git commit history via `commit: LOG-*` instead of relying only on `mydocs/`
  - Owner: maintainers and orchestrator agents
  - Trigger: the next task that produces durable planning, research, decision, or execution history
  - Related ids: `DEC-20260409-001`
- Next: keep future upstream reviews in `UPS-*` format and update carry-forward notes when a review establishes standing knowledge
  - Owner: maintainers and upstream-intake agents
  - Trigger: the next upstream compare window or sync candidate
  - Related ids: `LOG-20260410-225424-codex`
