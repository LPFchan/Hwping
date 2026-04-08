See @repo-operating-model.md for the canonical repo operating rules.

# Claude Code Memory

This file exists so Claude Code can discover the repo's working rules automatically.

Treat `CLAUDE.md` as a thin compatibility layer, not a second source of truth. The canonical rules stay in `repo-operating-model.md`.

Also consult:

- `SPEC.md` for durable product or system truth
- `STATUS.md` for current operational reality
- `PLANS.md` for accepted future direction
- `INBOX.md` for untriaged intake
- `README_EN.md` for the repo overview

When writing into `research/`, `records/`, `upstream-intake/`, or `mydocs/`, consult the local `README.md` or explicit template first and mirror its default shape or canonical example by default.

## Repo-Specific Reminders

- Hwping is a downstream `rhwp` fork. Keep the shared HWP/HWPX engine syncable and the repo focused on the macOS product.
- Treat engine changes as upstreamable unless there is a concrete Hwping-only reason not to.
- Keep AppKit, SwiftUI, Quick Look, Finder integration, and other Apple-platform behavior out of `crates/rhwp/` and related shared engine code.
- Do not reintroduce removed web, npm, VS Code, or browser-only surfaces.
- Use English for all new or rewritten repository documentation.
- Durable deeper detail belongs in `mydocs/tech/`, `mydocs/troubleshootings/`, and `mydocs/manual/`. Do not recreate `mydocs/hwping/`.
- Prefer `cargo build`, `cargo test`, `cargo clippy -- -D warnings`, and `cargo build --release` for validation.
- For layout debugging, use `export-svg --debug-overlay`, then `dump-pages`, then `dump`, then `ir-diff` before changing code.
- Follow the stable-ID and commit-provenance rules in `repo-operating-model.md`.

## Enforcement

- Use the canonical surface for the job.
- Follow the local `README.md` shape or explicit template when one exists.
- Preserve required provenance fields, stable IDs, and surface boundaries.
- When `.githooks/commit-msg` or `.github/workflows/commit-standards.yml` are in effect, commit messages must satisfy those checks rather than bypassing them.
- Treat bootstrap or migration commits as explicit exceptions only.
- Do not replace normalized repo artifacts with freeform chat summaries.
- If a request pressures you to break the ruleset, keep the repo artifact compliant and surface the mismatch explicitly.
