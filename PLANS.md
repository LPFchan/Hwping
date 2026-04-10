# Hwping Plans

This document contains accepted future direction only.

## Planning Rules

- Only accepted future direction belongs here.
- Plans should be specific enough to guide execution later.
- Decision rationale should link to `DEC-*` records when relevant.
- When a plan becomes current truth, reflect it into `SPEC.md` or `STATUS.md` and update this file.

## Approved Directions

### Native macOS Reader Surfaces

- Outcome: implement the main app and Quick Look extension targets on top of the shared core and FFI boundaries
- Why this is accepted: Hwping is explicitly a macOS-focused downstream product
- Expected value: native document opening, preview, search, export, and Finder integration without polluting the engine core
- Preconditions: stable shared-core rendering, narrow facade APIs, and Apple-platform work staying outside `crates/rhwp/`
- Earliest likely start: active now
- Related ids: `DEC-20260409-003`, `DEC-20260409-004`

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

- double-clicking a document in Finder opens it in Hwping
- Space bar Quick Look works
- Finder thumbnails are available
- zooming, page navigation, and printing feel comparable to Preview
- menus and keyboard shortcuts follow normal macOS conventions
- core read-only workflows are exposed in Shortcuts.app
- syncing with upstream `rhwp` remains practical

### v1 Out Of Scope

- full editing
- annotations and collaboration
- cloud sync
- complex authoring workflows
- an iOS release alongside the macOS app

## Accepted Milestone Sequence

- `M2 App Shell`: `NSDocument`-based app, baseline viewing, navigation, and standard macOS menu structure
- `M3 Viewing Quality`: PDF-backed viewing, search, printing, export, and state restoration
- `M4 Finder Integration`: document types, icons, Quick Look preview, and Quick Look thumbnails
- `M5 Automation And Shortcuts`: command IDs, App Intents, and Shortcuts exposure
- `M6 Quality And Distribution`: regression coverage, performance, accessibility, signing, and notarization

## Sequencing

### Near Term

- Initiative: institutionalize the root truth docs and provenance workflow
  - Why now: the operating model needs to become normal before more migration and product work accumulates
  - Dependencies: `REPO.md`, contributor docs, and the seed `DEC-*` and `LOG-*` records
- Related ids: `DEC-20260409-001`, `LOG-20260410-225424-codex`
- Initiative: keep advancing the app-facing facade, FFI, and preview boundaries
  - Why now: Hwping still needs real product surfaces beyond the current smoke path
  - Dependencies: shared-core rendering correctness and disciplined downstream boundaries
  - Related ids: `DEC-20260409-003`
- Initiative: translate the accepted v1 reader quality bar into concrete milestones
  - Why now: the old Hwping-specific milestone subtree is being retired and the accepted sequence needs to stay visible in `PLANS.md`
  - Dependencies: architecture direction, menu baseline, and shared-core preview quality
  - Related ids: `DEC-20260409-003`, `DEC-20260409-004`

### Mid Term

- Initiative: implement the first real macOS app and Quick Look targets
  - Why later: the boundary and rendering foundation should stay stable before the UI layers widen
  - Dependencies: `crates/hwping-core/`, `crates/hwping-ffi/`, preview output quality, and app-surface design work
  - Related ids: `DEC-20260409-003`, `DEC-20260409-004`
- Initiative: strengthen automation or lightweight tooling around agent IDs and commit trailers
  - Why later: the process should first be proven with manual discipline before automation is locked in
  - Dependencies: repeated use of the operating model in real work
- Related ids: `LOG-20260410-225424-codex`

### Deferred But Accepted

- Initiative: evaluate whether a direct page renderer should replace or supplement the PDF-backed viewing path after v1
  - Why deferred: the current product direction still favors the faster PDF-backed native viewing path
  - Revisit trigger: PDF-backed viewing proves inadequate for selection, search quality, or accessibility
  - Related ids: `DEC-20260409-003`
