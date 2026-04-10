<p align="center">
  <img src="assets/logo/logo-256.png" alt="Hwping logo" width="128" />
</p>

<h1 align="center">Hwping</h1>

<p align="center">
  <strong>Downstream fork for a macOS-focused HWP product</strong><br/>
  <em>Tracks upstream `rhwp` while keeping only the code Hwping actually needs.</em>
</p>

<p align="center">
  <a href="README.md">한국어</a> | <strong>English</strong>
</p>

---

Hwping is a macOS-focused downstream fork that tracks upstream `rhwp`.

This repository has two goals.

- Keep the HWP/HWPX engine syncable with upstream
- Prune web, npm, and VS Code product surfaces that are not required to build Hwping

This fork no longer treats the web demo, npm distribution, or VS Code extension as first-class deliverables. The repository is being narrowed to the engine, CLI tools, regression assets, and the structure needed for the Hwping product layers.

For the current direction, see [PLANS.md](PLANS.md) and [DEC-20260409-005-hwping-repo-boundary-and-upstream-sync-model.md](records/decisions/DEC-20260409-005-hwping-repo-boundary-and-upstream-sync-model.md).

## Current Scope

- HWP 5.0 / HWPX parsing
- Paragraph, table, equation, image, and chart rendering
- Pagination, header/footer, master page, and footnote handling
- HWP serialization plus PDF/SVG export paths
- CLI-based debugging tools and regression samples

## Quick Start

### Requirements

- Rust 1.75+

### Build

```bash
cargo build
cargo test
cargo clippy -- -D warnings
```

### Useful CLI Commands

```bash
# Export SVG
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp

# Export SVG with debug overlay
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp --debug-overlay

# Inspect page layout output
cargo run --bin rhwp -- dump-pages samples/biz_plan.hwp -p 0

# Inspect one paragraph in detail
cargo run --bin rhwp -- dump samples/biz_plan.hwp -s 0 -p 45
```

## Debug Workflow

When layout or spacing diverges, inspect in this order before changing code.

1. Use `export-svg --debug-overlay` to identify the paragraph or table.
2. Use `dump-pages -p N` to inspect the page placement list and heights.
3. Use `dump -s N -p M` to inspect ParaShape, LINE_SEG, and table properties.

## Repository Layout

```text
crates/rhwp/src/
  parser/            HWP/HWPX parser
  model/             document model
  document_core/     edit commands and queries
  renderer/          layout, pagination, SVG/PDF output
  serializer/        HWP writer
  wasm_api.rs        engine binding layer

crates/hwping-core/  app-facing facade boundary
crates/hwping-ffi/   Swift-facing FFI boundary
apps/hwping-macos/   placeholder for the future macOS app target
extensions/          placeholder Quick Look extension targets

samples/             regression documents
mydocs/              plans, reports, and technical notes
scripts/             quality and sync helper scripts
```

The root workspace now hosts multiple crates. The upstream-aligned engine crate remains named `rhwp` and lives under `crates/rhwp` to preserve technical continuity with upstream.

## Contribution Rules

- Treat engine changes as upstreamable by default unless proven otherwise.
- Keep Hwping-only product code out of the upstream-aligned engine core.
- Do not mix AppKit, SwiftUI, Quick Look, or Finder integration into engine internals.
- Web, npm, and VS Code surfaces that already exist upstream are not default preservation targets in this fork.

See [CONTRIBUTING.md](CONTRIBUTING.md) for workflow details.

## Repository Operating Model

Hwping adopts `LPFchan/repo-template` as its canonical repository operating model.

- `SPEC.md`, `STATUS.md`, and `PLANS.md` are the canonical top-level truth, status, and accepted-direction surfaces.
- `INBOX.md`, `research/`, and `records/decisions/` are the canonical intake and provenance surfaces.
- git commit history via commit: LOG-* is the canonical execution-history surface.
- `upstream-intake/` remains the recurring upstream-review module for the downstream fork.
- `mydocs/` remains the deeper technical, troubleshooting, and manual layer that supports the root truth docs.
- New commits are expected to carry commit-backed provenance trailers and a `commit: LOG-*` id.

For the repository-specific rules, see [REPO.md](REPO.md), [DEC-20260409-001-repo-template-full-adoption.md](records/decisions/DEC-20260409-001-repo-template-full-adoption.md), and [DEC-20260409-002-retire-mydocs-hwping-namespace.md](records/decisions/DEC-20260409-002-retire-mydocs-hwping-namespace.md).

## Documentation

The root operating surfaces hold canonical summary truth and provenance for the repository. `mydocs/` now holds only the shared deeper detail: engine knowledge under `mydocs/tech/`, durable investigations under `mydocs/troubleshootings/`, and operational guides under `mydocs/manual/`.

## Notice

This product was developed with reference to the HWP (.hwp) file format specification published by Hancom.

## License

[MIT License](LICENSE)
