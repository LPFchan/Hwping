# Hwping Spec

This file is the canonical durable statement of what Hwping is supposed to be.

It is not the implementation-status report or milestone tracker. Current state lives in `STATUS.md`; accepted future sequencing lives in `PLANS.md`.

## Project Identity

- Project: Hwping
- Canonical repo: `https://github.com/LPFchan/Hwping`
- Project id: `hwping`
- Operator: `LPFchan`
- Last updated: `2026-04-20`
- Key decisions: `DEC-20260409-001`, `DEC-20260409-002`, `DEC-20260409-003`, `DEC-20260409-004`, `DEC-20260409-005`, `DEC-20260420-001`, `DEC-20260420-002`

## What Hwping Is

Hwping is a Chrome-extension-first HWP reader product and downstream fork of upstream `rhwp`.

It is meant to let users open `.hwp` and `.hwpx` documents from a Chrome-packaged browser surface, then from a thin Electron desktop shell, then from native macOS companion surfaces, while keeping the shared document engine out of app code.

## Product Principles

### v1 Is A Reader

- Prioritize Chrome opening, reading, navigation, search, printing, PDF export, Electron desktop shell actions, macOS file integration, Quick Look, Finder integration, menu bar controls, and automation.
- Favor browser-led reader UX and Preview-like document viewing plus TextEdit-like macOS document-app conventions where the companion surfaces need them.
- Keep full editing, annotations, collaboration, cloud sync, and complex authoring workflows out of the v1 promise.

### Keep Engine And Product Separate

- Rust owns the upstream-aligned HWP/HWPX parser, model, layout, renderer, serializer, and CLI behavior.
- Downstream facade and FFI layers own the app-facing capability boundary.
- Browser-extension, Electron desktop shell, and Apple-platform targets own document lifecycle, browser UI, windows, menus, Finder integration, Quick Look, App Intents, Shortcuts, and app UI.
- Browser-extension UI, Electron shell behavior, AppKit, SwiftUI, PDFKit, Quick Look, Finder, App Intents, and Shortcuts behavior must not leak into `crates/rhwp/`.

### Share One Capability Boundary

The Chrome extension, Electron shell, macOS file integration, Quick Look Preview extension, Quick Look Thumbnail extension, menu bar integration, Shortcuts/App Intents, smoke targets, and future automation should reuse one document-loading and rendering capability boundary instead of each surface inventing its own engine path.

## Intended System Shape

```text
user document (.hwp / .hwpx)
  -> rhwp-chrome browser extension
  -> hwping-electron desktop shell
  -> macOS file integration / Quick Look / menu bar companions

each surface
  -> browser or Apple-platform call layer
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

### `rhwp-chrome/`

Browser-extension product surface.

Owns Chrome packaging, content scripts, background scripts, options UI, browser-specific downloads and context menus, and browser-led reader behavior.

### `apps/` And `extensions/`

Downstream desktop companion targets.

Intended targets:

- Electron desktop shell
- macOS file integration and menu bar companion surfaces
- Quick Look Preview extension
- Quick Look Thumbnail extension
- smoke and integration targets needed to validate the companion boundary

## Reader Experience

The target product should behave like a normal reader across browser, Electron, and macOS companion surfaces:

- Chrome opening gets a document into Hwping without requiring the full macOS app shell.
- Electron opening gets a document into Hwping without requiring the native macOS shell.
- Finder double-click opens a document in Hwping through macOS file integration.
- Recent documents, windows, tabs, state restoration, printing, and standard app menus behave consistently with the surface they live on.
- Space bar Quick Look preview works without launching the full app UI.
- Finder thumbnails are fast enough not to make ordinary folder browsing feel broken.
- Search, page movement, zooming, fit behavior, printing, PDF export, and menu bar actions use one command model across browser, shortcuts, and macOS companions when practical.

## Viewing Strategy

The accepted v1 direction favors a Chrome-led viewing path backed by shared-core rendering.

The Chrome extension is the first ship target. Electron is phase 1 for the desktop shell. Companion macOS surfaces should use the same document outputs when that is the cheapest stable route for preview, printing, and export.

This should not prevent a direct page renderer later if text selection, accessibility, overlays, search quality, or navigation demands it.

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
- git commit history via `commit: LOG-*` holds useful execution history.
- `research/` holds reusable exploration.
- `upstream-intake/` holds recurring upstream-review artifacts.
- `rhwp-chrome/` holds the browser-extension product surface.
- `mydocs/tech/`, `mydocs/troubleshootings/`, and `mydocs/manual/` hold deeper shared technical, investigation, and manual material.

Do not recreate a dedicated `mydocs/hwping/` tree.

## Non-Goals

- full editing for v1
- annotations and collaboration for v1
- cloud sync for v1
- an iOS release alongside the first shipable reader surfaces
- web demo hosting in the main Hwping tree
- npm package distribution for old web or editor surfaces
- VS Code extension distribution

## Success Criteria

Hwping succeeds when:

- a browser user can open an HWP/HWPX document in the Chrome extension and use the core read-only workflows
- an Electron user can open an HWP/HWPX document in the desktop shell and use the core read-only workflows
- macOS companion surfaces can preview, navigate, and expose the document through file integration, Quick Look, Finder, and menu bar entry points
- shared engine correctness keeps improving without product code contaminating upstream-aligned code
- upstream `rhwp` changes can be reviewed and adapted deliberately
- maintainers can recover current truth, accepted direction, key decisions, research, execution history, and upstream-intake outcomes from the repo itself
