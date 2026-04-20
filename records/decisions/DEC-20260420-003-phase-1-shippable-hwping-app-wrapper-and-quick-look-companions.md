# DEC-20260420-003: Phase 1 Shippable Hwping.app Wrapper And Quick Look Companions

Opened: 2026-04-20 20-15-00 KST
Recorded by agent: codex-20260420-phase1-wrapper

## Metadata

- Status: accepted
- Decision owner: Hwping operator
- Supersedes: `DEC-20260420-002`
- Related ids: `DEC-20260420-002`

## Decision

Phase 1 for Hwping is a shippable `Hwping.app` wrapper that opens into the existing browser-extension UI and carries the native macOS niceties needed to feel like a real app:

- native file picker
- drag-and-drop open
- Finder/open-with file association
- recent documents
- native macOS app menu with shortcut support
- Quick Look Preview and Quick Look Thumbnail companions

Phase 2 is the eventual native macOS shell. It stays out of scope for this session and must not be required for phase 1 to be shippable.

## Context

The previous phase boundary treated the Electron shell as "done" too early and let the later native shell leak into the definition of a shippable product. The operator clarified that the current deliverable is a browser-extension-backed desktop wrapper with macOS niceties, not a native AppKit/SwiftUI document app.

The Quick Look companion layer also needs to exist in phase 1, but the reference tree at `/Users/yeowool/Documents/Whipping/ref/hancom_hwp_decomp` is reference-only. It can inform bundle boundaries and responsibilities, but no proprietary function bodies, parameter lists, or source shapes may be copied.

## Options Considered

### Treat Electron Packaging As A Complete Desktop Milestone

- Upside: matches the existing browser-extension UI and the shared renderer boundary
- Downside: leaves the wrapper without the native macOS niceties the operator wants before phase 1 can ship

### Push Quick Look And Native Menu Work Into The Future Native Shell

- Upside: keeps the current wrapper smaller
- Downside: incorrectly makes phase 1 depend on phase 2 and delays the desired macOS product shape

### Define Phase 1 As A Shippable Wrapper With Quick Look And Native Menu Support

- Upside: matches the operator's requested exit criteria and keeps phase 2 independent
- Downside: requires the Electron wrapper and companion surfaces to be treated as first-class product code now

## Rationale

The operator's desired shipping shape is a `Hwping.app` that can be opened directly, presents the browser-extension UI, and includes the native macOS niceties that make it a real desktop app. That is the correct phase 1 boundary.

Quick Look belongs in that boundary because it is part of the minimum useful macOS companion set and it reuses the same shared document outputs as the wrapper. The native shell remains a later milestone, not a prerequisite.

## Consequences

- The Electron wrapper must be packaged as `Hwping.app`, not just runnable from `electron .`.
- The macOS app menu becomes the primary menu surface in the wrapper, with the browser menu acting as a fallback.
- Quick Look Preview and Quick Look Thumbnail support are treated as phase 1 companion work.
- Phase 2 native shell work stays explicitly deferred and cannot block phase 1 shippability.
- Repo truth, status, plans, and readmes should reflect the clarified phase boundary.
