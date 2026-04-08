# Internal Records

Store the full upstream-intake decision records in this folder.

Recommended naming:

- `UPS-YYYYMMDD-NNN-<scope>.md`

Canonical template:

- `../weekly-upstream-intake-template.md`

Repo-local example:

- `UPS-20260407-001-upstream-main-to-local-devel.md`

If a review window covers multiple candidates, keep one `UPS-*` record for the window and repeat the candidate sections inside it.

## Canonical Example

```md
# UPS-20260407-001: `upstream/main..upstream/local/devel`

## Review Metadata

- Review id: `UPS-20260407-001`
- Opened: `2026-04-07 00-00-00 KST`
- Recorded by agent: `github-copilot-20260407-upstream-intake`
- Review date: 2026-04-07
- Reviewer: GitHub Copilot
- Upstream window reviewed: `upstream/main..upstream/local/devel`
- Upstream refs or PRs reviewed: `9003e0d`, `2b58f5d`
- Downstream branch or working baseline: `main` at `6e2f2da`

## Window Summary

- Candidate decisions found: 2
- Autonomous decisions possible: 2
- Operator escalations required: 0
- Overall recommendation: adapt the shared-core renderer fix and decline the upstream market-research report from the Hwping mainline docs tree

## Candidate 1

### Candidate Change

- Title: Exclude non-rendered ClickHere guide height and reset TAC fix-overlay state on positive line spacing
- Upstream area: renderer height measurement and pagination
- Exact local downstream surface affected: `crates/rhwp/src/renderer/height_measurer.rs` and `crates/rhwp/src/renderer/pagination/engine.rs`

### Intake Analysis

- What user or maintainer problem does this change solve upstream? It removes height and overlay bookkeeping errors that can distort page breaks.
- What assumptions from upstream do not carry over cleanly to Hwping? The logic is shared-core, but the file paths differ because Hwping keeps the engine in `crates/rhwp/`.

### Autonomy Boundary

- Can the agent decide this autonomously?: `yes`
- Existing policy or prior decision that authorizes the choice: shared engine fixes should stay upstream-aligned unless a Hwping-only reason says otherwise

### Decision

- Decision: `adapt`
- Ship target: next upstream sync batch

### Verification

- Verification status: analysis complete; code adaptation not performed in this intake seed
- Commands or checks run: upstream commit review plus inspection of the current `crates/rhwp/` renderer files

## Notes For Next Intake

- Related upstream work to watch: further renderer and pagination fixes around TAC tables and ClickHere fields
- Follow-up tasks: implement the adaptation and run representative sample checks
```
