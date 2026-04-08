# DEC-20260409-003: Accept The Hwping Reader Architecture Direction
Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Project: Hwping
- Project id: `hwping`
- Decision owner: Hwping operator
- Status: accepted direction
- Related ids: `DEC-20260409-001`, `DEC-20260409-005`

## Decision

Hwping adopts the following architecture direction for the native macOS reader:

1. Hwping is an `NSDocument`-based macOS document app.
2. v1 favors a PDF-backed viewing strategy for native viewing behavior.
3. Quick Look Preview and Quick Look Thumbnail live in separate extensions.
4. The app, extensions, and automation surfaces share one capability boundary through `crates/hwping-core/` and `crates/hwping-ffi/`.
5. Shared parsing, layout, rendering, and serialization stay in `crates/rhwp/`.
6. App Intents and Shortcuts expose data-oriented reader operations rather than UI scripting hooks.

## Context

Hwping needs a native macOS reading experience without letting Apple-platform concerns leak into the shared engine core. The architecture must therefore preserve a clean Rust-versus-Swift split while keeping the shared-core behavior close to upstream `rhwp`.

## Options Considered

### Custom Native Renderer First

- Upside: maximum control over native viewing behavior from the start
- Downside: slower path to a usable reader and more pressure to mix product concerns into shared engine work

### PDF-Backed Reader Shell First

- Upside: reaches a practical macOS reader faster while preserving a clean engine-versus-app boundary
- Downside: keeps open the possibility of later pressure for a more direct renderer path

## Rationale

- `NSDocument` aligns naturally with Finder opening, recent documents, window restoration, and the normal behavior users expect from a macOS document app.
- A PDF-backed viewing path gets Hwping to usable scrolling, zooming, printing, and Preview-like behavior faster than a custom page renderer would.
- Separate Quick Look extensions match macOS integration boundaries and let Hwping optimize preview and thumbnail paths independently.
- A single app-facing capability boundary keeps the app, extensions, and automation surfaces from inventing separate document-loading stacks.
- Keeping Apple-platform behavior out of `crates/rhwp/` preserves upstream sync and shared-core clarity.

## Consequences

- Future app-shell and extension work should route through `crates/hwping-core/` and `crates/hwping-ffi/`.
- The PDF-backed path is the default v1 assumption, but the boundary should stay open enough for a direct renderer later if product pressure justifies it.
- Menu routing, Quick Look work, Finder integration, and automation should reuse one command and capability model rather than diverging by surface.

## Accepted Interface Direction

Expected downstream-facing operations include:

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

## Follow-Through

- Keep future architectural refinements as new `DEC-*` records instead of restoring a dedicated Hwping-only architecture subtree.
- Reflect milestone-level execution in `PLANS.md` and current implementation state in `STATUS.md`.
