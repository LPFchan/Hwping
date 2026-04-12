# Agent Instructions

This repo uses repo-template.

Treat `AGENTS.md` as the canonical editable agent-instructions file for the repo.
It should enforce repo behavior while deferring canonical policy details to `REPO.md`.

## Read First

- `REPO.md`
- `SPEC.md`
- `STATUS.md`
- `PLANS.md`
- `INBOX.md`
- `skills/README.md`

Before running a repeatable repo workflow, read the relevant `skills/<name>/SKILL.md`. Treat skills as repo-native procedures even when the agent runtime does not auto-load them.

When writing into an artifact directory, read that directory's `README.md` first. If it includes a prescriptive shape, follow it. If it is intentionally lightweight, keep the output lightweight too.

## Operating Rules

- Keep durable truth in repo files, not only in external tools.
- Route work using the routing ladder in `REPO.md`.
- Preserve the boundary between `SPEC.md`, `STATUS.md`, `PLANS.md`, `INBOX.md`, `research/`, `records/decisions/`, commit-backed execution history, and `upstream-intake/`.
- Worker agents should prefer evidence, proposals, and compliant commit-backed execution records. The orchestrator or operator owns truth-doc updates unless the operator explicitly allows a different flow.
- Treat `INBOX.md` as pressure, not a backlog. During inbox review, cluster capture and promote only survived triage.
- Promote sparsely. Do not mirror one evolving thought into research, decisions, plans, spec, status, upstream records, and execution records.
- If the repo tracks upstream on a cadence, use `upstream-intake/` instead of inventing a parallel workflow.
- When creating artifacts or commits, follow the stable-ID and provenance rules in `REPO.md`.
- Prefer the local `README.md` shape over ad hoc formatting when it defines one.
- Your commit message must satisfy the local repo provenance check before the commit is allowed.
- Your pushed commits must satisfy the same provenance rules remotely in CI.
- Treat each committed change as a canonical execution record through `commit: LOG-*`.
- Normal commits must use the structured body keys `timestamp:`, `changes:`, `rationale:`, and `checks:` with `notes:` optional.

## Enforcement

When you write or update repo artifacts, adherence to the repo's ruleset is required.

- Do not invent a new document shape when the repo already provides a canonical surface, directory `README.md`, or explicit template.
- Do not collapse truth, plans, decisions, research, inbox capture, and execution history into one mixed artifact.
- Do not promote exploratory debate into `SPEC.md`, `STATUS.md`, `PLANS.md`, or `records/decisions/` until there is a concise accepted outcome for that layer.
- Do not turn an inbox review into a giant digest of every low-confidence idea. Report counts or clusters when full detail does not protect focus.
- Do not write chatty transcripts where the repo expects normalized records.
- If an artifact guide is intentionally lightweight, do not over-structure the document just to make it look uniform.
- If the repo guidance and the requested output appear to conflict, follow the repo rules and explain the tension in the artifact or handoff.
- Do not bypass commit provenance checks by omitting required trailers unless the commit is an explicit bootstrap or migration exception.
- Do not put `LOG-*` ids inside `artifacts:`.

## Skills

`skills/<name>/SKILL.md` files are reusable procedures for bounded workflows.

- Keep them procedural.
- Do not duplicate canonical repo policy inside them.
- Use them to standardize repeatable tasks, escalation triggers, and output shape.
## Local Divergence

### Hwping Priorities

- Keep the shared HWP/HWPX engine syncable with upstream `rhwp`.
- Keep the repo focused on the macOS product and the layers it actually needs.
- Treat engine changes as upstreamable unless there is a concrete Hwping-only reason not to.
- Keep AppKit, SwiftUI, Quick Look, Finder integration, and other Apple-platform behavior out of shared engine code such as `crates/rhwp/`.
- Do not reintroduce removed web demo, npm, VS Code, or browser-only surfaces into the main tree.

### Documentation Rules

- Use English for all new or rewritten repository documents.
- Route truth and provenance through the repo-template surfaces instead of ad hoc notes.
- Treat `INBOX.md` as pressure, not a backlog. During inbox review, cluster capture and promote only survived triage.
- Promote sparsely. Do not mirror one evolving thought into research, decisions, plans, spec, status, upstream records, and execution records.
- Keep deeper shared detail in `mydocs/tech/`, `mydocs/troubleshootings/`, and `mydocs/manual/`.
- Do not recreate `mydocs/hwping/`.
- If a local guide defines section order, naming, provenance fields, or a canonical example, follow it.

### Validation And Debugging

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

### Commit Discipline

- New commits should carry the provenance trailers required by `REPO.md`.
- Local hook and CI enforcement live in `.githooks/commit-msg` and `.github/workflows/commit-standards.yml`.
- Local commit validation pins `project:` to `hwping`.
- A normal commit may reference an existing updated artifact; it does not need a brand-new `LOG-*`.
- Prefer appending to the current relevant `LOG-*` when the same workstream continues.
- Do not bypass commit checks with ad hoc formatting or `--no-verify`.
- Treat bootstrap or migration commits as explicit exceptions only.
