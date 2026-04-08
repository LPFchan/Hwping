# Contributing to Hwping

Thank you for contributing to Hwping.

Hwping is a macOS-focused downstream fork of upstream `rhwp`. The contribution standard is straightforward: keep what Hwping actually needs, preserve cheap upstream sync, and avoid reviving surfaces that no longer belong in the fork.

## Getting Started

```bash
git clone https://github.com/LPFchan/Hwping.git
cd Hwping

# Add the upstream remote if it is missing
git remote add upstream https://github.com/edwardkim/rhwp.git

cargo build
cargo test
cargo clippy -- -D warnings
```

## Repository Operating Model

Hwping adopts `LPFchan/repo-template` as its canonical repository operating model.

- `SPEC.md`, `STATUS.md`, and `PLANS.md` are the canonical summary surfaces for truth, current state, and accepted future direction.
- `INBOX.md`, `research/`, `records/decisions/`, and `records/agent-worklogs/` are the canonical intake and provenance surfaces.
- `upstream-intake/` is the recurring upstream-review module for the downstream fork.
- `mydocs/` remains the detailed technical, troubleshooting, and manual layer that supports the root truth docs.
- Stable IDs and commit provenance trailers are now part of the expected workflow.

For the repository-specific rules, see [repo-operating-model.md](repo-operating-model.md), [DEC-20260409-001-repo-template-full-adoption.md](records/decisions/DEC-20260409-001-repo-template-full-adoption.md), and [DEC-20260409-002-retire-mydocs-hwping-namespace.md](records/decisions/DEC-20260409-002-retire-mydocs-hwping-namespace.md).

## Contribution Rules

- Treat changes under `crates/rhwp/src/` as upstreamable by default unless there is a concrete reason they are Hwping-only.
- Keep Hwping-specific code in downstream layers instead of mixing it into the engine core.
- Do not put AppKit, SwiftUI, Quick Look, Finder integration, or other Apple-platform code into engine internals.
- Do not reintroduce removed web demo, npm distribution, VS Code, or browser-only surfaces into the main Hwping tree.
- Write new or substantially rewritten repository documentation in English.

## Documentation Placement

Use the root operating surfaces and the existing `mydocs/` layout intentionally.

- `SPEC.md`, `STATUS.md`, and `PLANS.md` for top-level truth, current state, and accepted direction
- `INBOX.md` for untriaged intake
- `research/` for reusable exploration
- `records/decisions/` for durable decision records
- `records/agent-worklogs/` for execution history

- `SPEC.md`, `STATUS.md`, and `PLANS.md` for Hwping-specific truth, current state, and accepted direction
- `records/decisions/` for Hwping-specific architectural and product decisions
- `mydocs/tech/` for shared engine and format knowledge
- `mydocs/troubleshootings/` for durable investigation and regression notes
- `mydocs/manual/` for durable operational and debugging guides

Do not let `mydocs/` replace the root truth docs, and do not let the root truth docs absorb detailed technical material that belongs in `mydocs/`.

## Change Classification

### 1. Upstreamable

- parser accuracy improvements
- renderer accuracy improvements
- serializer quality improvements
- platform-independent performance work

Keep these changes as small and isolated as possible.

### 2. Local Compatibility

- changes required for Hwping integration today that are not yet expressed as a clean generic API
- narrow temporary patches that may later move into a facade layer or a cleaner upstreamable shape

Keep this category tightly scoped and document why the patch is temporary.

### 3. Product-Only

- macOS app UX
- Quick Look extensions
- Finder integration
- FFI boundaries

Do not place this category inside the upstream-aligned engine area.

## Workflow

1. Open or reference the relevant issue and confirm the scope.
2. Create a `local/task{issue-number}` branch.
3. Route any durable planning, research, decision, or execution outputs into the repo-template surfaces.
4. Implement the change and validate it locally.
5. Open a PR against `devel`.

## Commit Provenance

New commits should carry repo-template trailers:

```text
project: hwping
agent: <agent-id>
role: orchestrator|worker|subagent|operator
artifacts: <artifact-id>[, <artifact-id>...]
```

Until dedicated tooling exists, mint a unique run-scoped `agent-id` manually, for example `codex-20260409-example-scope`.

## Validation Checklist

```bash
cargo build
cargo test
cargo clippy -- -D warnings
```

- Classify the change clearly as engine, compatibility, or product-only work.
- Explain any widening of engine-facing public surface area.
- Avoid changes that revive product surfaces unrelated to Hwping.
- Use stable artifact IDs when the work produces inbox, research, decision, worklog, or upstream-intake records.

## Debugging Guide

When investigating rendering or layout problems, start with the CLI tools before changing code.

```bash
# 1. Identify the paragraph or table
cargo run --bin rhwp -- export-svg sample.hwp --debug-overlay

# 2. Inspect page placement
cargo run --bin rhwp -- dump-pages sample.hwp -p 3

# 3. Inspect one paragraph in detail
cargo run --bin rhwp -- dump sample.hwp -s 0 -p 45
```

Debug overlay labels:

- paragraph: `s{section}:pi={index} y={position}`
- table: `s{section}:pi={index} ci={control} {rows}x{cols} y={position}`

## Repository Layout

```text
crates/rhwp/src/
├── model/          pure data structures
├── parser/         HWP/HWPX file -> model conversion
├── document_core/  edit commands and queries
├── renderer/       layout, pagination, SVG/PDF output
├── serializer/     model -> HWP file serialization
└── wasm_api.rs     engine binding layer

crates/hwping-core/ downstream app-facing facade boundary
crates/hwping-ffi/  Swift FFI boundary
apps/               macOS app targets
extensions/         Quick Look extension targets

samples/            regression documents
mydocs/             plans, technical notes, troubleshooting, manuals
scripts/            quality and sync helper scripts
```

Dependency direction: `model` <- `parser` <- `document_core` <- `renderer` <- `wasm_api`

## HWP Unit Reference

- 1 inch = 7,200 HWPUNIT
- 1 mm ~= 283.465 HWPUNIT

## Notice

This product was developed with reference to the HWP (.hwp) file format specification published by Hancom.

## License

This project is distributed under the [MIT License](LICENSE). Contributions are accepted under the same license.
