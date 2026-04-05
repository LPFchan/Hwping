# Hwping Onboarding Guide

## Purpose

This guide is for contributors working in the Hwping repository.

Hwping is a downstream fork of `rhwp`. The main goals in this repository are:

- keep the HWP and HWPX engine easy to sync with upstream
- keep only the code and documentation required to build and maintain Hwping as a macOS-focused product

If a code path or document exists only for removed web, npm, or VS Code surfaces, treat it as removal candidate by default.

## Repository Shape

The repository is intentionally centered on the Rust engine and durable documentation.

Important areas:

- `src/` — Rust engine, CLI, parser, layout, renderer, and related modules
- `samples/` — sample HWP and HWPX files used for debugging and regression work
- `mydocs/hwping/` — Hwping-specific plans and technical notes
- `mydocs/tech/` — shared engine knowledge that can still matter across forks
- `mydocs/troubleshootings/` — durable bug diagnosis and regression notes
- `mydocs/manual/` — durable operational guides such as this one

Legacy process-heavy folders may still exist temporarily, but they are not the center of normal development.

## Baseline Tooling

Install and verify these tools before making changes:

- Rust toolchain with `cargo` and `rustc`
- Git

Optional but useful:

- `clippy` through `rustup component add clippy`
- a local SVG viewer for inspecting renderer output

Quick verification:

```bash
cargo --version
rustc --version
git --version
```

## First Validation Pass

Run the standard local checks from the repository root:

```bash
cargo build
cargo test
cargo clippy -- -D warnings
```

If you are debugging a rendering issue, also use the CLI against a sample document:

```bash
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp
```

## Recommended Debug Workflow

When layout, spacing, pagination, or table behavior diverges, prefer inspecting the engine state before editing code.

Use this order:

1. `cargo run --bin rhwp -- export-svg samples/biz_plan.hwp --debug-overlay`
2. `cargo run --bin rhwp -- dump-pages samples/biz_plan.hwp -p 0`
3. `cargo run --bin rhwp -- dump samples/biz_plan.hwp -s 0 -p 45`
4. `cargo run --bin rhwp -- ir-diff sample.hwpx sample.hwp`

This keeps investigation grounded in actual document state instead of guesswork.

## Documentation Expectations

New or rewritten repository documentation should be written in English.

Use the documentation tree intentionally:

- `mydocs/hwping/tech/` for Hwping-specific architecture and boundary decisions
- `mydocs/hwping/plans/` for Hwping product or repository plans
- `mydocs/tech/` for shared engine knowledge
- `mydocs/troubleshootings/` for durable bug and regression notes
- `mydocs/manual/` for durable build, debug, and operation guides

Avoid creating new process logs unless the task clearly needs durable planning or investigation notes.

## Product Boundary Rules

Keep these repository rules in mind while onboarding:

- engine changes should stay upstreamable unless there is a concrete Hwping-only reason not to
- Apple platform integration belongs outside the engine core
- do not reintroduce removed web, browser-only, npm, or VS Code product surfaces into the main tree
- when in doubt, prefer the smaller and easier-to-sync repository shape

## Typical Contribution Loop

For most work, this is enough:

1. Reproduce the issue with a sample file or targeted command.
2. Inspect engine output with `export-svg`, `dump-pages`, `dump`, or `ir-diff`.
3. Make the smallest defensible code change.
4. Re-run `cargo build`, `cargo test`, and `cargo clippy -- -D warnings`.
5. Update durable documentation only if the change adds lasting knowledge.

## Where To Look Next

Start here if you need more context:

- `CLAUDE.md` for repository working rules and boundaries
- `README.md` for the current product-facing overview
- `mydocs/manual/dump_command.md` for dump command usage
- `mydocs/manual/ir_diff_command.md` for HWP versus HWPX comparison workflow