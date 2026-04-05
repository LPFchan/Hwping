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

For the current direction, see [mydocs/hwping/plans/hwping_repo_sync_plan.md](mydocs/hwping/plans/hwping_repo_sync_plan.md).

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

## Documentation

`mydocs/` contains plans, stage reports, technical investigations, and troubleshooting notes. Hwping-specific structure and sync documents live under `mydocs/hwping/`.

## Notice

This product was developed with reference to the HWP (.hwp) file format specification published by Hancom.

## License

[MIT License](LICENSE)
