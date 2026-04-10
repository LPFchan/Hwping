# Hwping Agent Guide

Hwping is a macOS-focused downstream fork of upstream `rhwp`.

Use this file as the repo-root entrypoint for agent behavior. The canonical operating rules live in `REPO.md`.

## Read First

- `README_EN.md` for the repo's scope and product boundary
- `REPO.md` for routing, artifact rules, and commit provenance
- `SPEC.md`, `STATUS.md`, `PLANS.md`, and `INBOX.md` for current project truth
- `skills/README.md`
- the local `README.md` or template for any surface you are about to edit

Before running a repeatable repo workflow, read the relevant `skills/<name>/SKILL.md`. Treat skills as repo-native procedures even when the agent runtime does not auto-load them.

## Hwping Priorities

- Keep the shared HWP/HWPX engine syncable with upstream `rhwp`.
- Keep the repo focused on the macOS product and the layers it actually needs.
- Treat engine changes as upstreamable unless there is a concrete Hwping-only reason not to.
- Keep AppKit, SwiftUI, Quick Look, Finder integration, and other Apple-platform behavior out of shared engine code such as `crates/rhwp/`.
- Do not reintroduce removed web demo, npm, VS Code, or browser-only surfaces into the main tree.

## Documentation Rules

- Use English for all new or rewritten repository documents.
- Route truth and provenance through the repo-template surfaces instead of ad hoc notes.
- Treat `INBOX.md` as pressure, not a backlog. During inbox review, cluster capture and promote only survived triage.
- Promote sparsely. Do not mirror one evolving thought into research, decisions, plans, spec, status, upstream records, and execution records.
- Keep deeper shared detail in `mydocs/tech/`, `mydocs/troubleshootings/`, and `mydocs/manual/`.
- Do not recreate `mydocs/hwping/`.
- If a local guide defines section order, naming, provenance fields, or a canonical example, follow it.
- Treat each committed change as a canonical execution record through `commit: LOG-*`.
- Normal commits must use the structured body keys `timestamp:`, `changes:`, `rationale:`, and `checks:` with `notes:` optional.

## Artifact Enforcement

- Do not promote exploratory debate into `SPEC.md`, `STATUS.md`, `PLANS.md`, or `records/decisions/` until there is a concise accepted outcome for that layer.
- Do not turn an inbox review into a giant digest of every low-confidence idea. Report counts or clusters when full detail does not protect focus.
- If an artifact guide is intentionally lightweight, do not over-structure the document just to make it look uniform.
- Do not put `LOG-*` ids inside `artifacts:`.
- Do not bypass commit provenance checks by omitting required trailers unless the commit is an explicit bootstrap or migration exception.

## Skills

`skills/<name>/SKILL.md` files are reusable procedures for bounded workflows.

- Keep them procedural.
- Do not duplicate canonical repo policy inside them.
- Use them to standardize repeatable tasks, escalation triggers, and output shape.

## Validation And Debugging

Prefer local Rust tooling:

```bash
cargo build
cargo test
cargo clippy -- -D warnings
cargo build --release
```

When layout or pagination diverges, inspect before editing code:

1. `cargo run --bin rhwp -- export-svg <sample> --debug-overlay`
2. `cargo run --bin rhwp -- dump-pages <sample> -p N`
3. `cargo run --bin rhwp -- dump <sample> -s N -p M`
4. `cargo run --bin rhwp -- ir-diff <sample.hwpx> <sample.hwp>`

Reference paths:

- `samples/`
- `output/`
- `mydocs/manual/dump_command.md`
- `mydocs/manual/ir_diff_command.md`

## Commit Discipline

- New commits should carry the provenance trailers required by `REPO.md`.
- Local hook and CI enforcement live in `.githooks/commit-msg` and `.github/workflows/commit-standards.yml`.
- A normal commit may reference an existing updated artifact; it does not need a brand-new `LOG-*`.
- Prefer appending to the current relevant `LOG-*` when the same workstream continues.
- Do not bypass commit checks with ad hoc formatting or `--no-verify`.
- Treat bootstrap or migration commits as explicit exceptions only.
