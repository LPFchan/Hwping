# Hwping macOS Reader Milestone Plan

## Status

This document is an active target-state milestone plan.

As of 2026-04-05, M0 and M1 are complete: the repository root is a Cargo workspace, the engine lives in `crates/rhwp`, `crates/hwping-core` exposes a typed document facade, `crates/hwping-ffi` exposes a C ABI for Swift, and `apps/hwping-macos/ffi-smoke` validates document open, first-page metadata, and preview PDF generation from Swift.

Read the milestones below as forward-looking execution stages rather than as completed or partially implemented deliverables unless another document explicitly records that progress.

## Product Goal

Hwping is meant to be a native macOS reader for `.hwp` documents: open a file from Finder, browse it naturally, preview it through Quick Look, automate common tasks through Shortcuts, and have the whole experience feel at home on macOS.

The v1 quality bar is straightforward.

- double-clicking a document in Finder opens it in Hwping
- Space bar Quick Look works
- Finder thumbnails are available
- zooming, page navigation, and printing feel comparable to Preview
- menus and keyboard shortcuts follow normal macOS conventions
- core read-only workflows are exposed in Shortcuts.app
- syncing with upstream `rhwp` remains practical

## Out of Scope

The following are explicitly out of scope for v1.

- full editing
- annotations and collaboration
- cloud sync
- complex authoring workflows
- an iOS release alongside the macOS app

## Milestone Overview

| Milestone | Name | Primary Deliverable |
|-----------|------|---------------------|
| M0 | Boundary Setup | workspace structure, facade definition, sync rules |
| M1 | Engine Embedding | `hwping-core`, `hwping-ffi`, basic document opening |
| M2 | App Shell | `NSDocument`-based macOS app with baseline viewing and navigation |
| M3 | Viewing Quality | PDF-backed viewing, search, printing, state restoration |
| M4 | Finder Integration | UTType, document icons, Quick Look Preview, Quick Look Thumbnail |
| M5 | Automation and Shortcuts | App Intents, Shortcuts support, unified command model |
| M6 | Quality and Distribution | regression coverage, performance, code signing, notarization |

## M0. Boundary Setup

### Goal

- establish a repository structure that supports upstream sync from day one
- make the responsibilities of the engine, facade, app, and extensions explicit in both the docs and the code layout

### Work

- convert the root into a Cargo workspace
- split out `crates/rhwp`
- create `crates/hwping-core`
- create `crates/hwping-ffi`
- document the branch, remote, and sync policy

### Done Criteria

- the existing engine still builds and tests cleanly
- Hwping product code lives outside the engine core path

## M1. Engine Embedding

### Goal

- define the smallest stable boundary needed to call the Rust engine from Swift

### Work

- define the facade API
- choose the FFI approach and connect a sample target
- provide APIs for opening documents, reading document info, getting page count, reading first-page size, and generating preview PDF output
- normalize error codes and diagnostics

### Done Criteria

- a Swift sample can open `.hwp` files
- the sample can retrieve first-page information and generate preview PDF output

## M2. App Shell

### Goal

- deliver the baseline document-app experience users expect from apps like Preview and TextEdit

### Menu Bar Baseline

Treat [TextEdit menu bar reference](../tech/textedit_menubar_reference.md) as the canonical baseline for the first complete Hwping menu bar.

Record Hwping-specific structure and every intentional deviation in [Hwping macOS menu bar specification](../tech/hwping_macos_menu_bar_spec.md).

- match the standard macOS top-level order: App Name, File, Edit, View, Window, Help
- use the reference document to define separators, submenu depth, and shortcut conventions before adding Hwping-specific commands
- keep system-provided items system-provided rather than re-implementing them manually
- document every intentional deviation from the TextEdit baseline in [Hwping macOS menu bar specification](../tech/hwping_macos_menu_bar_spec.md), especially omissions driven by Hwping's read-only v1 scope

### Work

- create an `NSDocument`-based app
- define document opening, recent documents, multiple windows, and tab behavior
- establish the base menu structure from [TextEdit menu bar reference](../tech/textedit_menubar_reference.md), maintain the concrete Hwping plan in [Hwping macOS menu bar specification](../tech/hwping_macos_menu_bar_spec.md), implement the standard App Name, File, Edit, View, Window, and Help menus before considering any extra top-level menus, and record omitted or changed TextEdit commands as explicit Hwping reader decisions
- add the toolbar and search field
- define commands for zooming, page movement, and sidebar toggling

### Done Criteria

- Finder double-click opens the app
- documents can be opened and navigated inside the app
- the shipped menu bar has been reviewed against [TextEdit menu bar reference](../tech/textedit_menubar_reference.md), and every intentional deviation is documented in [Hwping macOS menu bar specification](../tech/hwping_macos_menu_bar_spec.md)
- top-level menu order, standard shortcuts, recent documents, and Help behavior match normal macOS document-app expectations
- base keyboard shortcuts work

## M3. Viewing Quality

### Goal

- move the app from a promising prototype to a reader people can actually use every day

### Work

- adopt the PDF-backed viewing path
- refine PDFKit scrolling and zoom behavior
- connect the document search UI
- finish printing and PDF export flows
- restore window state, zoom level, and last-viewed page
- review font substitution warnings and fallback behavior

### Done Criteria

- common documents can be browsed comfortably
- search, zooming, printing, and PDF export behave reliably

## M4. Finder Integration

### Goal

- make Hwping feel like a real system app inside Finder, not just a standalone viewer

### Work

- declare `UTType` and document types
- apply document icons
- implement the Quick Look Preview extension
- implement the Quick Look Thumbnail extension
- test Finder integration end to end

### Done Criteria

- `.hwp` files display appropriate icons in Finder
- Space bar Quick Look works
- thumbnails appear in icon and list views

## M5. Automation and Shortcuts

### Goal

- complete the keyboard-first and automation story using native macOS systems

### Work

- define command IDs
- connect menus, keyboard shortcuts, toolbar actions, and intents
- implement App Intents
- publish App Shortcuts
- expose core read-only workflows for automation

### Recommended App Intents

- open document
- get document info
- get page count
- extract text
- search text
- export PDF
- generate first-page image

### Done Criteria

- Hwping actions appear in Shortcuts.app
- menus, shortcuts, and intents all share the same command semantics

## M6. Quality and Distribution

### Goal

- make the product reliable on clean end-user machines, not just on development setups

### Work

- organize the regression corpus
- verify golden thumbnail and preview results
- measure large-document performance
- polish damaged-document error handling
- review accessibility
- code signing
- notarization
- distribution testing

### Done Criteria

- installation and execution work on a clean macOS environment
- the full app bundle, including Quick Look extensions, works correctly

## Ongoing Tracks

These tracks continue alongside every milestone.

### A. Upstream Sync

- sync with upstream at least once per month
- maintain a local patch inventory for `crates/rhwp`
- keep upstreamable patches ready to separate out

### B. Document Quality

- maintain the supported and unsupported feature list
- document the font fallback policy
- collect damaged-document cases

### C. macOS UX

- keep menu naming aligned with macOS conventions and review it against [TextEdit menu bar reference](../tech/textedit_menubar_reference.md)
- maintain shortcut consistency
- record any deliberate menu or shortcut deviations from the TextEdit baseline in [Hwping macOS menu bar specification](../tech/hwping_macos_menu_bar_spec.md) as product decisions, not accidental drift
- continuously review Finder and Quick Look experience quality

## Priority Order

Decisions should follow this order.

1. system integration quality
2. document rendering stability
3. upstream sync feasibility
4. feature count

In practice, Finder integration, Quick Look, viewing quality, and structural discipline matter more than having a long feature list.

## Risks and Responses

### 1. Limits of PDF-Backed Viewing

Risk:

- text selection, search quality, and accessibility may hit limits

Response:

- use PDF-backed viewing for v1, but keep search and text extraction driven by the Rust engine
- preserve the facade so a direct renderer can be introduced later if needed

### 2. Font Dependency

Risk:

- Korean document quality will depend heavily on fallback behavior

Response:

- document the fallback policy
- keep golden tests for common real-world document sets

### 3. Quick Look Performance

Risk:

- the app may feel fine while Finder extensions still feel slow

Response:

- build a fast first-page path
- define cache keys clearly
- keep preview and thumbnail pipelines separate

### 4. Upstream Drift

Risk:

- as product work grows, the fork may gradually harden into a separate codebase

Response:

- preserve the engine/product boundary
- minimize local compatibility patches
- make sync a routine operating practice, not optional cleanup

## v1 Release Checklist

- open `.hwp` documents from Finder
- deliver solid baseline viewing quality
- support search, zooming, page navigation, printing, and PDF export
- support Quick Look Preview
- support Finder thumbnails
- expose core actions in Shortcuts.app
- run without critical failures across the regression corpus
- document and validate the upstream sync procedure at least once

## Summary

Hwping will succeed by feeling complete and trustworthy as a document app, not by chasing the longest feature list.

That means the milestones should be executed in this order.

- establish the structure
- narrow the engine boundary
- build the app shell
- add Finder and Quick Look
- complete automation and shortcuts
- finish distribution quality last

If that sequence holds, Hwping can grow into a native macOS reader while still tracking upstream `rhwp` in a disciplined way.