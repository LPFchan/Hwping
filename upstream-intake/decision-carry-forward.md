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
- Related report, ADR, or note: [reports/internal-records/UPS-20260407-001-upstream-main-to-local-devel.md](reports/internal-records/UPS-20260407-001-upstream-main-to-local-devel.md)

- Candidate area: Upstream shared-core parser fixes in CFB and HWPX parsing code
- First decision date: 2026-04-20
- Most recent confirmation date: 2026-04-20
- Current standing decision: `adapt`
- Carry-forward rationale: Parser correctness, security hardening, and stream-path normalization belong in shared core even when upstream file paths differ; Hwping should port them into the relocated crate instead of inventing a fork-specific alternative.
- What new evidence would justify reopening this: Hwping already has a stronger local parser fix, the upstream change conflicts with a stated Hwping policy, or the change depends on an upstream-only surface that the fork has removed.
- Related report, ADR, or note: [reports/internal-records/UPS-20260420-001-upstream-main-to-devel.md](reports/internal-records/UPS-20260420-001-upstream-main-to-devel.md)

- Candidate area: Upstream repo artifacts that are market research or product-positioning notes rather than Hwping runtime or maintenance guidance
- First decision date: 2026-04-07
- Most recent confirmation date: 2026-04-07
- Current standing decision: `decline`
- Carry-forward rationale: Hwping should not accumulate upstream social-listening or market-research documents that do not change the engine, product boundary, or native macOS roadmap.
- What new evidence would justify reopening this: the document becomes an explicit Hwping planning input with a named owner, or it is rewritten into a durable Hwping-specific plan under the proper docs tree.
- Related report, ADR, or note: [reports/internal-records/UPS-20260407-001-upstream-main-to-local-devel.md](reports/internal-records/UPS-20260407-001-upstream-main-to-local-devel.md)

- Candidate area: Upstream Chrome extension product surface in `rhwp-chrome/`
- First decision date: 2026-04-20
- Most recent confirmation date: 2026-04-20
- Current standing decision: `accept`
- Carry-forward rationale: The Chrome extension is now the first ship target, so upstream changes in `rhwp-chrome/` usually belong in Hwping unless they depend on unrelated browser ecosystem surfaces or conflict with the Chrome/Electron rollout.
- What new evidence would justify reopening this: a change conflicts with the Chrome/Electron rollout, requires a different product-direction decision, or introduces unrelated browser-only distribution surfaces that Hwping still does not want.
- Related report, ADR, or note: [records/decisions/DEC-20260420-002-electron-first-desktop-rollout-with-chrome-packaging.md](records/decisions/DEC-20260420-002-electron-first-desktop-rollout-with-chrome-packaging.md)

- Candidate area: Upstream Firefox extension product surface in `rhwp-firefox/`
- First decision date: 2026-04-20
- Most recent confirmation date: 2026-04-20
- Current standing decision: `defer`
- Carry-forward rationale: Firefox remains in the repository history, but it is not the active browser lane in the current rollout.
- What new evidence would justify reopening this: the operator reopens Firefox as a supported browser lane or the browser packaging strategy changes again.
- Related report, ADR, or note: [records/decisions/DEC-20260420-002-electron-first-desktop-rollout-with-chrome-packaging.md](records/decisions/DEC-20260420-002-electron-first-desktop-rollout-with-chrome-packaging.md)
