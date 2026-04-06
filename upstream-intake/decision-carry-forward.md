# Decision Carry-Forward

Use this register to preserve intake outcomes that should automatically inform later reviews.

This exists to stop the same `accept`, `adapt`, `decline`, or `defer` question from being re-litigated every cycle without new evidence.

## Entry Template

- Candidate area:
- First decision date:
- Most recent confirmation date:
- Current standing decision: `accept` | `adapt` | `decline` | `defer`
- Carry-forward rationale:
- What new evidence would justify reopening this:
- Related report, ADR, or note:

## Current Entries

- Candidate area: Upstream shared-core correctness fixes in renderer and pagination code
- First decision date: 2026-04-07
- Most recent confirmation date: 2026-04-07
- Current standing decision: `adapt`
- Carry-forward rationale: When upstream fixes shared engine behavior that still belongs in `crates/rhwp/`, Hwping should usually preserve the upstream behavior and adapt it into the relocated crate layout instead of inventing a fork-specific alternative.
- What new evidence would justify reopening this: Hwping already has a stronger local fix, the upstream change conflicts with a stated Hwping policy, or the change depends on an upstream-only surface that the fork has removed.
- Related report, ADR, or note: [reports/internal-records/2026-04-07-upstream-main-to-local-devel.md](reports/internal-records/2026-04-07-upstream-main-to-local-devel.md)

- Candidate area: Upstream repo artifacts that are market research or product-positioning notes rather than Hwping runtime or maintenance guidance
- First decision date: 2026-04-07
- Most recent confirmation date: 2026-04-07
- Current standing decision: `decline`
- Carry-forward rationale: Hwping should not accumulate upstream social-listening or market-research documents that do not change the engine, product boundary, or native macOS roadmap.
- What new evidence would justify reopening this: the document becomes an explicit Hwping planning input with a named owner, or it is rewritten into a durable Hwping-specific plan under the proper docs tree.
- Related report, ADR, or note: [reports/internal-records/2026-04-07-upstream-main-to-local-devel.md](reports/internal-records/2026-04-07-upstream-main-to-local-devel.md)