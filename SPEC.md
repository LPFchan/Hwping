# Hwping Spec

This file is the canonical durable statement of what Hwping is supposed to be.

It is not the implementation-status report or milestone tracker. Current state lives in `STATUS.md`; accepted future sequencing lives in `PLANS.md`.

## Project Identity

- Project: Hwping
- Canonical repo: `https://github.com/LPFchan/Hwping`
- Project id: `hwping`
- Operator: `LPFchan`
- Last updated: `2026-04-09`
- Key decisions: `DEC-20260409-001`, `DEC-20260409-002`, `DEC-20260409-003`, `DEC-20260409-004`, `DEC-20260409-005`

## What Hwping Is

Hwping is a native macOS-focused HWP reader product and downstream fork of upstream `rhwp`.

It is meant to let macOS users open `.hwp` and `.hwpx` documents from familiar Apple-platform surfaces, read them comfortably, preview them in Finder, automate simple read-only workflows, and export or print them without turning the shared document engine into app code.

## Product Principles

### v1 Is A Reader

- Prioritize opening, reading, navigation, search, printing, PDF export, Quick Look, and automation.
- Favor Preview-like document viewing and TextEdit-like macOS document-app conventions.
- Keep full editing, annotations, collaboration, cloud sync, and complex authoring workflows out of the v1 promise.

### Keep Engine And Product Separate

- Rust owns the upstream-aligned HWP/HWPX parser, model, layout, renderer, serializer, and CLI behavior.
- Downstream facade and FFI layers own the app-facing capability boundary.
- Swift and Apple-platform targets own document lifecycle, windows, menus, Finder integration, Quick Look, App Intents, Shortcuts, and app UI.
- AppKit, SwiftUI, PDFKit, Quick Look, Finder, App Intents, and Shortcuts behavior must not leak into `crates/rhwp/`.

### Share One Capability Boundary

The main app, Quick Look Preview extension, Quick Look Thumbnail extension, Shortcuts/App Intents, smoke targets, and future automation should reuse one document-loading and rendering capability boundary instead of each surface inventing its own engine path.

## Intended System Shape

```text
user document (.hwp / .hwpx)
  -> Hwping.app (NSDocument-based)
  -> Quick Look Preview extension
  -> Quick Look Thumbnail extension
  -> App Intents / Shortcuts

each surface
  -> Apple-platform call layer
    -> hwping-ffi
      -> hwping-core
        -> rhwp
          -> parser / model / layout / renderer / serializer
```

## Core Surfaces

### `crates/rhwp/`

Upstream-aligned shared engine area.

Owns:

- HWP and HWPX parsing
- document model
- layout and pagination
- foundational SVG, PDF, bitmap, or preview-ready rendering paths
- serialization
- platform-independent CLI and debugging paths

Default rule: treat changes here as upstreamable unless there is a concrete recorded reason for a local compatibility patch.

### `crates/hwping-core/`

App-facing Rust facade.

Expected operation families:

- open a document from bytes or path
- report document info, page count, page size, and first-page metadata
- render preview-ready PDF or page images
- render first-page thumbnail data
- extract text and search for a query
- export PDF
- normalize product-facing errors

### `crates/hwping-ffi/`

Swift-facing ABI boundary.

Owns conversion of strings, paths, bytes, handles, errors, metadata structs, preview bytes, ownership, and lifetime rules.

### `apps/` And `extensions/`

Downstream Apple-platform product targets.

Intended targets:

- main `NSDocument`-based Hwping app
- Quick Look Preview extension
- Quick Look Thumbnail extension
- smoke and integration targets needed to validate the app boundary

## Native Reader Experience

The target app should behave like a normal macOS document app:

- Finder double-click opens a document in Hwping.
- Recent documents, windows, tabs, state restoration, printing, and standard app menus behave consistently with macOS expectations.
- Space bar Quick Look preview works without launching the full app UI.
- Finder thumbnails are fast enough not to make ordinary folder browsing feel broken.
- Search, page movement, zooming, fit behavior, printing, and PDF export use one command model across menus, shortcuts, toolbar actions, intents, and automation when practical.

## Viewing Strategy

The accepted v1 direction favors a PDF-backed viewing path:

```text
.hwp / .hwpx
  -> rhwp parsing and layout
  -> preview-ready PDF generation
  -> native PDF-backed viewing or preview surface
```

This path should get Hwping to native scrolling, zooming, printing, and Preview-like behavior faster than a custom page view. It must not prevent a direct page renderer later if text selection, accessibility, overlays, search quality, or navigation demands it.

## Error, Cache, And Quality Expectations

User-visible errors should stay short and actionable, grouped around cases like open failure, corrupted document, unsupported feature, font substitution difference, render failure, permission failure, or file-access failure.

Likely cache targets include preview PDF, first-page thumbnail, page size, page count, document metadata, and render options. Cache invalidation should be able to account for file identity, file size, modification time, render parameters, and engine version.

Quality expectations:

- Ordinary documents should show a first useful reading surface quickly.
- Quick Look and thumbnail paths should have tighter budgets than the full app.
- App-shell menus, buttons, search UI, zoom, opening, and page movement should be keyboard-accessible and VoiceOver-friendly.
- Document-content accessibility can improve after v1, but app-shell accessibility is part of the baseline product quality.

## Repository Operating Contract

Hwping uses the repo-template model, with Hwping-specific rules in `REPO.md`.

- `SPEC.md`, `STATUS.md`, and `PLANS.md` hold canonical truth, current state, and accepted future direction.
- `records/decisions/` holds durable decisions.
- `records/agent-worklogs/` holds useful execution history.
- `research/` holds reusable exploration.
- `upstream-intake/` holds recurring upstream-review artifacts.
- `mydocs/tech/`, `mydocs/troubleshootings/`, and `mydocs/manual/` hold deeper shared technical, investigation, and manual material.

Do not recreate a dedicated `mydocs/hwping/` tree.

## Non-Goals

- full editing for v1
- annotations and collaboration for v1
- cloud sync for v1
- an iOS release alongside the first macOS app
- web demo hosting in the main Hwping tree
- npm package distribution for old web or editor surfaces
- VS Code extension distribution
- legacy browser-only infrastructure kept only for history

## Success Criteria

Hwping succeeds when:

- a macOS user can open an HWP/HWPX document, preview it, navigate it, search it, print it, export it, and automate basic read-only tasks through native-feeling surfaces
- shared engine correctness keeps improving without product code contaminating upstream-aligned code
- upstream `rhwp` changes can be reviewed and adapted deliberately
- maintainers can recover current truth, accepted direction, key decisions, research, execution history, and upstream-intake outcomes from the repo itself
