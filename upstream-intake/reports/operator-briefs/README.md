# Operator Briefs

Store the lighter operator-facing upstream-intake summaries in this folder.

Recommended naming:

- `UPS-YYYYMMDD-NNN-<scope>-operator-brief.md`

Canonical template:

- `../operator-weekly-brief-template.md`

Repo-local example:

- `UPS-20260407-001-upstream-main-to-local-devel-operator-brief.md`

## Canonical Example

```md
# UPS-20260407-001 Operator Brief: `upstream/main..upstream/local/devel`

## Review Metadata

- Review id: `UPS-20260407-001`
- Opened: `2026-04-07 00-00-00 KST`
- Recorded by agent: `github-copilot-20260407-upstream-intake`
- Review date: 2026-04-07
- Upstream window: `upstream/main..upstream/local/devel`
- Baseline reviewed against: Hwping `main` at `6e2f2da`
- Overall recommendation: adapt one shared-core renderer fix into `crates/rhwp/`; decline one upstream research document that does not fit the Hwping docs boundary

## This Period At A Glance

No operator decision is required in this window. One shared-core renderer fix is worth taking soon because it improves pagination correctness, while one upstream research document should stay out of Hwping mainline docs because it adds sync noise without changing the engine, app, or roadmap.

## Decisions Requiring Operator Input

None this cycle.

## Watchlist

- Compatibility surfaces to monitor next: `crates/rhwp/` pagination and measured-height logic
- Decisions to carry forward next review: shared-core renderer fixes should usually be adapted into the relocated engine tree; upstream research-only artifacts should usually be declined
- Deferred items and revisit date: none

## Decisions Made Autonomously

### Adapt Task #61 into the relocated engine crate

This was safe to decide autonomously because it is an implementation-level shared-core renderer fix with no Hwping product-direction conflict.

- Why this was safe to decide: shared engine correctness change with no operator-policy tradeoff
- Next: port the change into `crates/rhwp/` and validate representative samples
```
