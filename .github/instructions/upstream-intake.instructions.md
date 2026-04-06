---
description: "Use when: reviewing upstream rhwp releases, compare windows, sync candidates, merge decisions, or periodic upstream intake for Hwping."
---

# Hwping Upstream Intake Instructions

Use this instruction when the task is to review, summarize, triage, or merge upstream `rhwp` work into Hwping.

The canonical upstream-intake package lives here:

- [mydocs/hwping/plans/upstream-intake/README.md](../../mydocs/hwping/plans/upstream-intake/README.md)
- [mydocs/hwping/plans/upstream-intake/intake-method.md](../../mydocs/hwping/plans/upstream-intake/intake-method.md)
- [mydocs/hwping/plans/upstream-intake/weekly-upstream-intake-template.md](../../mydocs/hwping/plans/upstream-intake/weekly-upstream-intake-template.md)
- [mydocs/hwping/plans/upstream-intake/operator-weekly-brief-template.md](../../mydocs/hwping/plans/upstream-intake/operator-weekly-brief-template.md)

Treat upstream review as a downstream decision workflow, not a changelog summary.

## Core Hwping Rules

- Review candidate decisions, not raw commit lists, unless the user explicitly wants commit-by-commit output.
- Keep exhaustive reasoning in the internal record and keep the operator brief shorter and more natural.
- Shared-core correctness fixes should usually preserve the upstream behavior and land in `crates/rhwp/`.
- Hwping-only product surfaces should preserve the local shape. Adapt upstream ideas into `crates/hwping-core/`, `crates/hwping-ffi/`, `apps/hwping-macos/`, or `extensions/` instead of forcing upstream product assumptions into the fork.
- Do not reintroduce removed web, npm, browser-only, or VS Code distribution surfaces into the main Hwping tree unless the operator has explicitly changed direction.
- If the real conflict is policy rather than implementation, escalate before choosing a patch shape.
- If the decision depends on Apple platform policy, vendor terms, pricing, legal language, or external product behavior, use internet lookup and prefer official sources.

## Required Workflow

1. Define the exact upstream window and local baseline.
2. Gather evidence from compare logs, commits, code, docs, and external sources when needed.
3. Follow [mydocs/hwping/plans/upstream-intake/intake-method.md](../../mydocs/hwping/plans/upstream-intake/intake-method.md) to group candidate decisions and remove ambiguity.
4. Write the full internal record under [mydocs/hwping/plans/upstream-intake/reports/internal-records/README.md](../../mydocs/hwping/plans/upstream-intake/reports/internal-records/README.md).
5. Write the separate operator brief under [mydocs/hwping/plans/upstream-intake/reports/operator-briefs/README.md](../../mydocs/hwping/plans/upstream-intake/reports/operator-briefs/README.md).
6. Update the carry-forward or local-override registers only when the review establishes durable standing knowledge.

Do not duplicate detailed rules here when the canonical package already covers them.