# Hwping Upstream Intake

This directory is the canonical source of truth for recurring upstream intake in Hwping.

Use it to review upstream `rhwp` changes as downstream decisions, not as release-note summaries. Each review window should answer what Hwping should accept, adapt, decline, or defer, while preserving the fork boundary and keeping future sync work cheap.

## What This Package Covers

- recurring review of upstream tags, compare windows, or sync candidates
- one full internal decision record per review window
- one separate operator-facing brief per review window
- standing knowledge that should survive from one review cycle to the next
- thin Copilot entrypoints that point back to this package instead of duplicating rules

## Canonical Files

1. [weekly-upstream-intake-template.md](weekly-upstream-intake-template.md)
   - Full internal decision template.
2. [operator-weekly-brief-template.md](operator-weekly-brief-template.md)
   - Shorter operator-facing brief template.
3. [intake-method.md](intake-method.md)
   - Hwping-specific analysis method and decision rules.
4. [compatibility-watchlist.md](compatibility-watchlist.md)
   - Compatibility-sensitive seams to check in every review.
5. [known-local-overrides.md](known-local-overrides.md)
   - Stable downstream divergences that should not be rediscovered every cycle.
6. [decision-carry-forward.md](decision-carry-forward.md)
   - Standing intake decisions to reuse until new evidence appears.
7. [reports/README.md](reports/README.md)
   - Artifact storage guidance.

## Agent Entry Points

The repo-level Copilot entrypoints are intentionally thin. They should never become a second source of truth.

- [.github/instructions/upstream-intake.instructions.md](../.github/instructions/upstream-intake.instructions.md)
- [.github/skills/weekly-upstream-intake/SKILL.md](../.github/skills/weekly-upstream-intake/SKILL.md)
- [.github/prompts/weekly-upstream-intake.prompt.md](../.github/prompts/weekly-upstream-intake.prompt.md)

If those files need behavioral changes, update this package first and keep the `.github` files as wrappers around it.

## Standard Review Flow

1. Define the exact upstream window and the local baseline.
2. Gather evidence from compare logs, commits, code, docs, and external sources when policy depends on vendor behavior.
3. Group related upstream work into candidate decisions.
4. Fill the internal record using [weekly-upstream-intake-template.md](weekly-upstream-intake-template.md) and [intake-method.md](intake-method.md).
5. Write a separate operator brief using [operator-weekly-brief-template.md](operator-weekly-brief-template.md).
6. Update [known-local-overrides.md](known-local-overrides.md) or [decision-carry-forward.md](decision-carry-forward.md) only when the review establishes durable knowledge.
7. Link any resulting PRs, issues, or follow-up notes from the report artifacts.

## Seeded Example

This package is seeded with one real review window so future work has a grounded example.

- [reports/internal-records/2026-04-07-upstream-main-to-local-devel.md](reports/internal-records/2026-04-07-upstream-main-to-local-devel.md)
- [reports/operator-briefs/2026-04-07-upstream-main-to-local-devel-operator-brief.md](reports/operator-briefs/2026-04-07-upstream-main-to-local-devel-operator-brief.md)

That sample reviews `upstream/main..upstream/local/devel` against Hwping `main` and demonstrates both an engine-fix adaptation decision and a repo-boundary decline.