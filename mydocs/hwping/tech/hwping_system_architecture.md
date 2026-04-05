# Hwping System Architecture

## Status

This document describes the intended target architecture for Hwping.

As of 2026-04-05, M0 boundary setup is in place: the repository root is a Cargo workspace, the upstream-aligned engine lives in `crates/rhwp`, placeholder `crates/hwping-core` and `crates/hwping-ffi` crates exist, and placeholder app and Quick Look extension directories are present.

The macOS app target, Quick Look extension targets, and product-facing APIs described below do not exist yet.

Read this document as architectural direction and boundary guidance, not as a description of the repository's current implementation state.

## Purpose

This document outlines the architecture for Hwping, a native macOS HWP reader built on top of the `rhwp` engine.

The architecture is driven by four goals.

1. Build a read-only document app that feels at home on macOS.
2. Ship Quick Look preview and thumbnail support as separate extensions.
3. Use a single command model across menus, keyboard shortcuts, Finder integration, and Shortcuts.app.
4. Preserve a repository structure that can stay in sync with upstream `rhwp`.

## Product Principles

### 1. v1 Is a Reader

- prioritize reading quality over editing scope
- target the feel of Preview and TextEdit as native macOS document apps
- make document opening, navigation, search, printing, PDF export, Quick Look, and automation the core of v1

### 2. Keep the Engine and the Product Separate

- Rust owns HWP parsing, layout, and rendering
- Swift owns document lifecycle, menus, windows, Finder integration, Quick Look, and App Intents
- the engine layer should stay as close to upstream as possible

### 3. Reuse the Same Capability Boundary Across Apple Surfaces

- main app
- Quick Look Preview extension
- Quick Look Thumbnail extension
- Shortcuts and App Intents

These surfaces have different UI requirements, but they should all call the same document-loading, rendering, search, and metadata APIs.

## Recommended Top-Level Structure

```text
user document (.hwp)
  -> Hwping.app (NSDocument-based)
  -> Quick Look Preview extension
  -> Quick Look Thumbnail extension
  -> App Intents / Shortcuts

each surface
  -> Swift call layer
    -> hwping-ffi
      -> hwping-core
        -> rhwp
          -> parser / model / layout / renderer / serializer
```

## Recommended Repository Structure

```text
/
  Cargo.toml
  crates/
    rhwp/                 # upstream-aligned area
    hwping-core/          # app-facing Rust facade
    hwping-ffi/           # Swift-facing FFI layer
  apps/
    hwping-macos/         # NSDocument-based macOS app
  extensions/
    hwping-ql-preview/    # Quick Look Preview Extension
    hwping-ql-thumbnail/  # Quick Look Thumbnail Extension
  tests/
    corpus/
    golden/
    integration/
  mydocs/
    tech/
    plans/
    manual/
```

## Component Responsibilities

### `crates/rhwp`

Responsibilities:

- HWP and HWPX parsing
- document model
- layout calculation
- foundational SVG, PDF, and bitmap rendering
- serialization

Principles:

- do not introduce macOS-specific concepts here
- do not add Quick Look, PDFKit, AppKit, SwiftUI, or App Intents dependencies
- evaluate upstreamability before making changes

### `crates/hwping-core`

Responsibilities:

- provide a narrow API for product-facing surfaces
- normalize error categories
- define cache keys and rendering options
- expose shared operations reused by the main app and the Quick Look extensions

Expected API:

- `open_document(bytes|path)`
- `document_info()`
- `page_count()`
- `page_size(index)`
- `render_page_bitmap(index, scale)`
- `render_first_page_thumbnail(max_size)`
- `build_preview_pdf(page_range)`
- `extract_text()`
- `search(query)`
- `export_pdf(output)`

### `crates/hwping-ffi`

Responsibilities:

- define the ABI boundary between Swift and Rust
- convert strings, bytes, errors, and structs
- define async work units and cancellation points

Recommendation:

- pick one bridge style and use it consistently, either UniFFI or an explicit C ABI
- keep the v1 API surface as small as possible

### `apps/hwping-macos`

Responsibilities:

- `NSDocument`-based document app
- windows, tabs, recent documents, and state restoration
- menus, toolbar, search, printing, and sharing
- PDFKit-based page viewing or another PDF-backed view path

Recommended implementation:

- have Rust generate preview-ready PDF when a document opens, and use `PDFKit.PDFView` as the primary content view in v1
- do not rely solely on PDF text for extraction and search; combine it with Rust-driven results

### `extensions/hwping-ql-preview`

Responsibilities:

- provide Space bar preview using `QLPreviewingController` or the relevant Quick Look preview API
- call `hwping-core.build_preview_pdf()` internally to generate PDF data

Principles:

- do not depend on the app UI layer
- stay within tighter time and memory budgets than the main app

### `extensions/hwping-ql-thumbnail`

Responsibilities:

- provide Finder thumbnails through `QLThumbnailProvider`
- render the first page or a representative page into a bitmap quickly

Principles:

- optimize first-page rendering, scaling, and cache behavior
- avoid a full document load on every thumbnail request if a cheaper path is available

## Reference Architecture Notes

The review of `/Users/yeowool/Documents/Whipping/ref/hancom_hwp_decomp` suggests that Hancom uses a similar split.

- main app target
- Quick Look Preview extension target
- Quick Look Thumbnail extension target
- a small shared render-session and document-loader layer used by both extensions

Hwping should borrow the separation of responsibilities, not the implementation.

The shared interface should stay close to the following.

- open document
- read page count
- read first-page size
- build a page render plan
- generate preview PDF
- generate thumbnail bitmap

## Recommended Viewing Pipeline

### v1: PDF-Backed Native Viewing

```text
.hwp
  -> rhwp parsing
  -> page SVG generation
  -> PDF generation
  -> display in PDFKit PDFView
```

Advantages:

- gets you native macOS scrolling, zooming, and printing behavior quickly
- makes it easier to deliver a Preview-like user experience
- allows the main app and Quick Look Preview to share much of the same pipeline

Limitations:

- precise text selection, accessibility trees, and semantic search may need additional work
- the interface should remain open enough to support a direct page renderer later

### v2 and Beyond: Consider a Direct Page Renderer

Conditions:

- the PDF-backed approach proves inadequate for text selection, search quality, or accessibility
- advanced overlays, selection behavior, or navigation features become important

## Command Model

All user-facing behavior should be organized under a single command identifier set.

Examples:

- `file.open`
- `file.exportPdf`
- `view.zoomIn`
- `view.zoomOut`
- `view.actualSize`
- `view.fitWidth`
- `navigate.nextPage`
- `navigate.previousPage`
- `search.find`
- `search.findNext`
- `window.toggleSidebar`

This command model should be reused by all of the following.

- menu bar
- keyboard shortcuts
- toolbar buttons
- general action routing
- App Intents and Shortcuts

## Shortcuts and App Intents

Recommended v1 actions:

- open document
- get document info
- get page count
- extract full text
- search for a string
- export PDF
- export first-page image

Principles:

- provide data-oriented intents rather than UI scripting hooks
- keep app commands and intent semantics aligned

## Finder and Document Type Integration

Required items:

- declare `UTType`
- register the `.hwp` document type
- provide document icons
- review Spotlight- and Quick Look-friendly metadata exposure
- verify default-app registration behavior

Optional item:

- decide whether `.hwpx` should be treated as a separate type or part of the same family

## Cache Strategy

Cache targets:

- preview PDF
- first-page thumbnail
- page size and document metadata

Candidate cache keys:

- file path
- file size
- modification time
- render parameters
- engine version

Principles:

- keep Quick Look cache logically separate from app cache
- make engine-version-based invalidation straightforward

## Error Model

User-visible errors should be normalized into a small set of categories.

- open failure
- corrupted document
- unsupported document features
- visible differences caused by font substitution
- render failure
- permission or file-access failure

Developer logs can be more detailed, but user-facing messages should stay short and actionable.

## Draft Performance Targets

- first visible screen for ordinary documents: about 1 second
- first visible screen for large documents: within 3 seconds
- Finder thumbnails: use a fast first-page path to avoid obvious lag
- Quick Look Preview: work without initializing the full app stack

## Accessibility Targets

- base menus, buttons, and search UI should be navigable with VoiceOver
- opening, page movement, search, and zooming should be possible using only the keyboard
- over time, improve document-content accessibility as well, but v1 should at minimum get the app-shell accessibility right

## Security and Distribution Considerations

- code signing
- notarization
- bundling extensions inside the app bundle
- deciding sandbox policy early in the design

Recommendation:

- choose the sandbox strategy based on the intended v1 distribution path
- test Quick Look and file-access permission flows before distribution time

## Architecture Decisions

1. Hwping should be built as an `NSDocument`-based native document app.
2. v1 should favor a PDF-backed viewing strategy.
3. Quick Look Preview and Quick Look Thumbnail should live in separate extensions.
4. the app, extensions, and Shortcuts should all use the same `hwping-core` API.
5. the repository should separate `rhwp` from product code to preserve upstream sync.