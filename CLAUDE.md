# CLAUDE.md

This file provides repository-specific guidance for coding agents working in Hwping.

## Repository Identity

Hwping is a downstream fork of upstream `rhwp`.

The repository has two goals:

- keep the HWP/HWPX engine syncable with upstream `rhwp`
- keep only the code and documentation that are actually needed to build and maintain Hwping as a macOS-focused product

This repository is not the place to keep removed product surfaces alive by habit.

Non-goals for the main Hwping tree:

- web demo hosting
- npm package distribution for the old web/editor surfaces
- VS Code extension distribution
- legacy browser-only infrastructure

## Language Policy

Use English for all new or rewritten repository documentation.

That includes:

- new markdown documents
- rewritten architecture notes
- maintenance notes
- issue and planning notes stored in the repository

Do not create Korean/English mirror trees for new content.
Prefer one English source document over duplicated translations.

User-facing chat should still follow the language the user asks for, but repository-facing written artifacts should default to English.

## Documentation Placement

Use the documentation tree intentionally.

Durable documentation belongs in these locations:

- `SPEC.md` / `STATUS.md` / `PLANS.md` — canonical project truth, current reality, and accepted future direction
- `records/decisions/` — durable Hwping-specific architecture, product, and operating decisions
- `research/` — reusable reference or exploration material
- `records/agent-worklogs/` — durable execution history when it is worth keeping
- `upstream-intake/` — recurring upstream-review artifacts
- `mydocs/tech/` — shared engine knowledge that could still matter to upstream or any downstream product
- `mydocs/troubleshootings/` — durable bug diagnosis, root-cause analysis, regression notes
- `mydocs/manual/` — durable CLI/debugging/build guides

Treat these areas as legacy or temporary unless explicitly asked otherwise:

- `mydocs/plans/` — broad historical task planning inventory
- `mydocs/working/` — stage-by-stage execution reports
- `mydocs/eng/` — legacy mirrored documentation tree

Do not add new material to those legacy folders by default.
If a task produces durable knowledge, extract that knowledge into the root repo-template surfaces, `tech/`, `troubleshootings/`, or `manual/` instead of growing the legacy process folders.

## Build and Validation

Prefer local Rust tooling for all normal verification.

### Core Commands

```bash
cargo build
cargo test
cargo clippy -- -D warnings
cargo build --release
```

Use the CLI directly through Cargo unless the binary is already installed globally.

### Useful Debug Commands

```bash
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp --debug-overlay
cargo run --bin rhwp -- dump-pages samples/biz_plan.hwp -p 0
cargo run --bin rhwp -- dump samples/biz_plan.hwp -s 0 -p 45
cargo run --bin rhwp -- ir-diff sample.hwpx sample.hwp
```

### Debug Workflow

When layout, spacing, or pagination diverges, use this order before changing code:

1. `export-svg --debug-overlay` to identify the paragraph or table
2. `dump-pages -p N` to inspect page placement and measured heights
3. `dump -s N -p M` to inspect ParaShape, LINE_SEG, and table properties
4. `ir-diff` when comparing HWP and HWPX behavior

This workflow should stay code-free until the root cause is clear.

### Reference Paths

- `samples/` — regression and debugging sample documents
- `output/` — generated SVG or other local outputs
- `mydocs/manual/dump_command.md` — dump command guide
- `mydocs/manual/ir_diff_command.md` — IR diff guide

### HWPUNIT Reference

- 1 inch = 7200 HWPUNIT
- 1 inch = 25.4 mm

## Product Boundary Rules

Keep the fork boundary sharp.

- Treat engine changes as upstreamable unless there is a concrete reason they are Hwping-only.
- Keep AppKit, SwiftUI, Quick Look, Finder integration, and other Apple-platform behavior out of the engine core.
- Do not reintroduce removed web, npm, VS Code, or browser-only surfaces into the main Hwping tree.
- When pruning upstream-derived surfaces from Hwping, optimize for a smaller and cheaper-to-sync fork rather than preserving redundant history.
- Upstream `rhwp` is the sync source and the historical source for removed upstream surfaces.

## Git and Branch Model

Assume the following repository roles unless the actual remotes say otherwise:

- `origin` — the Hwping fork
- `upstream` — the original `rhwp` repository

Use branches with clear intent:

- `main` — Hwping stable branch
- `devel` — integration branch
- `local/devel` — local integration branch when needed
- `local/taskNNN` — per-task working branches

General rules:

- do not develop directly on upstream-tracking branches
- keep upstream sync cheap and explicit
- do task work on local task branches
- merge product changes into Hwping branches, never into upstream branches

If creating issues or milestones from the CLI, target the Hwping fork repository, not upstream `rhwp`.

## Planning and Reporting Policy

Do not assume every task needs a full waterfall of plan, stage report, and completion report documents.

Use documentation proportionally:

- small code changes may need no repository document at all
- risky architectural work may justify a focused entry in `PLANS.md` or a new `DEC-*`
- durable technical decisions belong in `records/decisions/` or `mydocs/tech/`
- bug investigations worth preserving belong in `mydocs/troubleshootings/`

Avoid generating process paperwork just because legacy folders exist.

## Working Rules

- Do not time-box work autonomously; let the project owner decide when to stop or ship.
- Prefer durable technical notes over temporary progress logs.
- If a change crosses the upstream/downstream boundary, make that tradeoff explicit before broadening scope.
- If a document or code path exists only because of removed surfaces, prefer deleting it over maintaining it.
- Keep the repository easier to sync, easier to understand, and smaller by default.
