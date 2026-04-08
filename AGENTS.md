# Agent Instructions

This repo uses `LPFchan/repo-template`.

Treat `AGENTS.md` as a compatibility entrypoint for tools that auto-discover repo-root agent instructions. The canonical operating rules live in `repo-operating-model.md`.

## Read First

- `repo-operating-model.md`
- `SPEC.md`
- `STATUS.md`
- `PLANS.md`
- `INBOX.md`
- `README_EN.md` for the repo overview
- `skills/README.md` and the relevant `skills/<name>/SKILL.md` when using a reusable workflow

When writing into `research/`, `records/`, `upstream-intake/`, or `mydocs/`, read the local `README.md` or explicit template first. If it defines scope, section order, provenance fields, naming, or a canonical example, treat that guide as binding.

## Repo-Specific Rules

- Hwping is a downstream fork of upstream `rhwp`. Keep the shared HWP/HWPX engine syncable and keep the repo focused on the macOS product.
- Treat engine changes as upstreamable unless there is a concrete Hwping-only reason not to.
- Keep AppKit, SwiftUI, Quick Look, Finder integration, and other Apple-platform behavior out of the shared engine core.
- Do not reintroduce removed web, npm, VS Code, or browser-only surfaces into the main tree.
- Use English for all new or rewritten repository documentation.
- Durable deeper detail belongs in `mydocs/tech/`, `mydocs/troubleshootings/`, and `mydocs/manual/`. Do not recreate `mydocs/hwping/`.
- If older docs still point at retired surfaces, treat the root repo-template surfaces and `repo-operating-model.md` as authoritative.

## Verification And Debugging

Prefer local Rust tooling for normal validation:

```bash
cargo build
cargo test
cargo clippy -- -D warnings
cargo build --release
```

When layout, spacing, or pagination diverges, debug in this order before changing code:

1. `cargo run --bin rhwp -- export-svg <sample> --debug-overlay`
2. `cargo run --bin rhwp -- dump-pages <sample> -p N`
3. `cargo run --bin rhwp -- dump <sample> -s N -p M`
4. `cargo run --bin rhwp -- ir-diff <sample.hwpx> <sample.hwp>`

Reference paths:

- `samples/`
- `output/`
- `mydocs/manual/dump_command.md`
- `mydocs/manual/ir_diff_command.md`

## Enforcement

- Keep durable truth in repo files, not only in chat.
- Use the canonical surface for the job instead of inventing mixed-format notes.
- Preserve stable IDs, `Opened:`, and `Recorded by agent:` fields where the surface requires them.
- Keep `SPEC.md`, `STATUS.md`, `PLANS.md`, research, decisions, worklogs, and upstream-intake reports separate.
- When creating commits tied to durable artifacts, follow the provenance trailer rules in `repo-operating-model.md`.
- When `.githooks/commit-msg` or `.github/workflows/commit-standards.yml` are in effect, commit messages must satisfy those checks. Do not bypass them with ad hoc formatting or `--no-verify`.
- Treat bootstrap or migration commits as explicit exceptions only.
- If repo guidance and a requested output conflict, keep the repo artifact compliant and flag the tension explicitly.
