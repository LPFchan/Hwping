# Hwping Plans

This document contains accepted future direction only.

## Planning Rules

- Only accepted future direction belongs here.
- Plans should be specific enough to guide execution later.
- Decision rationale should link to `DEC-*` records when relevant.
- When a plan becomes current truth, reflect it into `SPEC.md` or `STATUS.md` and update this file.

## Approved Directions

### Chrome Browser Surface

- Outcome: ship `rhwp-chrome/` as the first public reader surface
- Why this is accepted: it gives Hwping a browser target that matches the current operator preference and keeps the browser lane small and explicit
- Expected value: browser-native distribution, quicker feedback, and a stable packaging lane that shares the renderer boundary
- Preconditions: stable shared-core rendering and browser-extension packaging staying outside `crates/rhwp/`
- Earliest likely start: active now
- Related ids: `DEC-20260420-002`, `DEC-20260420-003`

### Electron Desktop Wrapper

- Outcome: ship `apps/hwping-electron/` as phase 1 `Hwping.app`
- Why this is accepted: a thin Electron wrapper can reuse the shared renderer and file bridge without forcing the native macOS frontend to be the first desktop milestone
- Expected value: open/save/recent/print/menu actions, file association, drag-and-drop, and Quick Look companions in a packaged desktop app
- Preconditions: Chrome packaging, shared renderer outputs, a narrow preload bridge, and the native macOS app menu contract
- Earliest likely start: active now
- Related ids: `DEC-20260420-002`

### Native macOS Shell Phase 2

- Outcome: implement the native AppKit/SwiftUI shell after the `Hwping.app` wrapper stabilizes
- Why this is accepted: the operator wants a native shell eventually, but it must not block the browser-extension-backed wrapper from shipping first
- Expected value: a later native shell that reuses the same shared document boundary instead of re-inventing it
- Preconditions: `Hwping.app` wrapper behavior, shared-core outputs, and narrow Apple-platform boundaries
- Earliest likely start: phase 1 proves out
- Related ids: `DEC-20260420-003`

### Full Repo-Template Operational Discipline

- Outcome: use root truth docs, stable artifact IDs, provenance records, commit trailers, and namespace-free routing as the normal operating model
- Why this is accepted: Hwping needs durable in-repo truth and provenance as the fork grows
- Expected value: faster orientation, cleaner routing of work, and less reliance on external-tool history to understand project state
- Preconditions: contributor guidance, seed artifacts, and ongoing habit formation
- Earliest likely start: active now
- Related ids: `DEC-20260409-001`, `DEC-20260409-002`, `LOG-20260410-225424-codex`

### Repeatable Upstream Sync Cadence

- Outcome: treat each upstream review window as a paired `UPS-*` internal record and operator brief
- Why this is accepted: Hwping is a downstream fork and recurring upstream review is not optional
- Expected value: cheaper sync decisions, clearer carry-forward knowledge, and less repeated analysis
- Preconditions: maintain the canonical `upstream-intake/` package and keep its naming and metadata consistent
- Earliest likely start: active now
- Related ids: `DEC-20260409-005`

## Accepted Reader Scope

### v1 Quality Bar

- Chrome extension opening lands a document in Hwping without requiring the full macOS app shell
- `Hwping.app` opening lands a document in Hwping without requiring the native macOS shell
- Finder double-click opens a document in Hwping through macOS file association
- Space bar Quick Look preview works
- Finder thumbnails are available
- menu bar controls and keyboard shortcuts follow normal macOS conventions where used
- zooming, page navigation, and printing feel comparable to Preview
- core read-only workflows are exposed across the browser, Electron, and companion macOS surfaces
- syncing with upstream `rhwp` remains practical

### v1 Out Of Scope

- full editing
- annotations and collaboration
- cloud sync
- complex authoring workflows
- an iOS release
- a full native macOS app shell before the Chrome and Electron rollout proves out

## Accepted Milestone Sequence

- `M1 Chrome MVP`: `rhwp-chrome/`, browser opening, navigation, search, print, and export loops
- `M2 Hwping.app Wrapper`: open, save, recent documents, print, file association, drag-and-drop, native app menu, and Quick Look preview/thumbnail support around the shared renderer
- `M3 Native macOS Shell`: AppKit/SwiftUI shell work after the wrapper stabilizes
- `M4 Viewing Quality`: PDF-backed or browser-native viewing stability, search, printing, export, and state restoration
- `M5 Automation And Shortcuts`: command IDs, App Intents, and Shortcuts exposure
- `M6 Quality And Distribution`: regression coverage, performance, accessibility, signing, and notarization

## Sequencing

### Near Term

- Initiative: keep the Chrome browser lane and Electron wrapper aligned with the root truth docs
  - Why now: the browser surface and the phase 1 wrapper are the first ship targets and the repo needs to say that plainly before more work lands
  - Dependencies: `DEC-20260420-003`, `REPO.md`, and the updated product truth docs
  - Related ids: `DEC-20260420-002`, `DEC-20260420-003`
- Initiative: keep advancing the browser-facing facade, FFI, and preview boundaries
  - Why now: Hwping still needs real product surfaces beyond the browser entry point
  - Dependencies: shared-core rendering correctness and disciplined downstream boundaries
  - Related ids: `DEC-20260420-002`, `DEC-20260420-003`
- Initiative: keep the Electron preload bridge thin and focused on open/save/recent/print/menu actions
  - Why now: the phase 1 wrapper should stay small enough that the native macOS shell can still be phase 2
  - Dependencies: shared renderer outputs, stable file-system bridge behavior, and the native menu contract
  - Related ids: `DEC-20260420-002`, `DEC-20260420-003`
- Initiative: translate the accepted v1 reader quality bar into concrete milestones
  - Why now: the new rollout sequence needs to stay visible in `PLANS.md`
  - Dependencies: browser packaging, wrapper design, native menu design, Quick Look support, and shared-core preview quality
  - Related ids: `DEC-20260420-002`, `DEC-20260420-003`, `DEC-20260409-004`

### Mid Term

- Initiative: implement the native macOS shell
  - Why later: the Chrome MVP and `Hwping.app` wrapper should stabilize before the native shell widens the surface area
  - Dependencies: `crates/hwping-core/`, `crates/hwping-ffi/`, browser-extension outputs, wrapper outputs, and native-shell design work
  - Related ids: `DEC-20260420-003`
- Initiative: strengthen automation or lightweight tooling around agent IDs and commit trailers
  - Why later: the process should first be proven with manual discipline before automation is locked in
  - Dependencies: repeated use of the operating model in real work
  - Related ids: `LOG-20260410-225424-codex`

### Deferred But Accepted

- Initiative: keep the Firefox browser-extension lane deferred unless the operator reopens it
  - Why deferred: the current rollout is Chrome only and Firefox should not be treated as an active release lane
  - Revisit trigger: the operator reopens Firefox as a supported browser lane
  - Related ids: `DEC-20260420-002`
- Initiative: evaluate whether a direct page renderer should replace or supplement the browser-led/PDF-backed viewing path after v1
  - Why deferred: the current product direction still favors the Chrome-led reader surface, the Electron wrapper, and stable companion outputs first
  - Revisit trigger: browser-led viewing proves inadequate for selection, search quality, or accessibility
  - Related ids: `DEC-20260420-002`, `DEC-20260420-003`
