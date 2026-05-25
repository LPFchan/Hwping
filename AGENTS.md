# Agent Instructions

`AGENTS.md` is the canonical editable agent-instructions file. It enforces repo behavior while deferring canonical policy to `records/REPO.md`.

## Read First

- `records/REPO.md`
- `records/SPEC.md`
- `records/STATUS.md`
- `records/PLANS.md`
- `records/INBOX.md`
- `skills/README.md`

Before writing into an artifact directory, read its `README.md` and follow its prescriptive shape when it defines one.

## Skills

Load the skill before the trigger condition fires. Each skill defines the procedure; follow it.

| Trigger | Skill |
| --- | --- |
| Before creating a normal commit | `skills/commit-generator/SKILL.md` |
| Before any destructive file edit (replace, delete, rewrite) | `skills/clean-correction-gate/SKILL.md` |
| When routing work or creating repo artifacts | `skills/repo-orchestrator/SKILL.md` |
| When reviewing inbox pressure | `skills/daily-inbox-pressure-review/SKILL.md` |
| When reviewing upstream changes | `skills/upstream-intake/SKILL.md` |
| When sharpening or iteratively refining an artifact | `skills/sharpen-the-tip/SKILL.md` |
| When prototyping, greenfield building, or working pre-MVP | `skills/prototype-mode/SKILL.md` |

## Rules

- Keep durable truth in repo files, not only in external tools.
- Route work using the routing ladder in `records/REPO.md`.
- Preserve the boundary between `records/SPEC.md`, `records/STATUS.md`, `records/PLANS.md`, `records/INBOX.md`, `records/research/`, `records/decisions/`, commit-backed `LOG-*`, and `records/upstream-intake/`.
- Worker agents produce evidence, proposals, and compliant `LOG-*` commits. The orchestrator or operator owns truth-doc updates unless the operator explicitly allows otherwise.
- Treat `records/INBOX.md` as pressure, not a backlog. Cluster capture; promote only survived triage.
- Promote sparsely. Do not mirror one thought into research, decisions, plans, spec, status, upstream, and execution records.
- Every normal commit must be created from a skeleton registered by `scripts/new-commit-message.sh` and must pass local and remote provenance checks.
- Follow the stable-ID and provenance rules in `records/REPO.md`.
- Do not put `LOG-*` ids inside `artifacts:`.
- Do not invent a document shape when the repo already provides a canonical surface, directory `README.md`, or template.
- Do not promote exploratory debate into truth docs or decisions until there is a concise accepted outcome.
- Do not turn an inbox review into a digest of every low-confidence idea. Report counts or clusters.
- Do not write chatty transcripts where the repo expects normalized records.
- Do not bypass commit provenance checks unless the commit is an explicit bootstrap or migration exception.

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
