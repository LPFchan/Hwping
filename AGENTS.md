# Hwping Agent Guide

Hwping is a macOS-focused downstream fork of upstream `rhwp`.

Use this file as the repo-root entrypoint for agent behavior. The canonical operating rules still live in `repo-operating-model.md`.

## Read First

- `README_EN.md` for the repo's scope and product boundary
- `repo-operating-model.md` for routing, artifact rules, and commit provenance
- `SPEC.md`, `STATUS.md`, `PLANS.md`, and `INBOX.md` for current project truth
- the local `README.md` or template for any surface you are about to edit

## Hwping Priorities

- Keep the shared HWP/HWPX engine syncable with upstream `rhwp`.
- Keep the repo focused on the macOS product and the layers it actually needs.
- Treat engine changes as upstreamable unless there is a concrete Hwping-only reason not to.
- Keep AppKit, SwiftUI, Quick Look, Finder integration, and other Apple-platform behavior out of shared engine code such as `crates/rhwp/`.
- Do not reintroduce removed web demo, npm, VS Code, or browser-only surfaces into the main tree.

## Documentation Rules

- Use English for all new or rewritten repository documents.
- Route truth and provenance through the repo-template surfaces instead of ad hoc notes.
- Keep deeper shared detail in `mydocs/tech/`, `mydocs/troubleshootings/`, and `mydocs/manual/`.
- Do not recreate `mydocs/hwping/`.
- If a local guide defines section order, naming, provenance fields, or a canonical example, follow it.

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

- New commits should carry the provenance trailers required by `repo-operating-model.md`.
- Local hook and CI enforcement live in `.githooks/commit-msg` and `.github/workflows/commit-standards.yml`.
- Do not bypass commit checks with ad hoc formatting or `--no-verify`.
- Treat bootstrap or migration commits as explicit exceptions only.
