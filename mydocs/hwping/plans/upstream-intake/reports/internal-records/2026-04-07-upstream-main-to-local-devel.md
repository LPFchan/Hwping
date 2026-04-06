# Upstream Intake: `upstream/main..upstream/local/devel`

## Review Metadata

- Review date: 2026-04-07
- Reviewer: GitHub Copilot
- Upstream window reviewed: `upstream/main..upstream/local/devel`
- Upstream refs or PRs reviewed: `9003e0d`, `2b58f5d`
- Downstream branch or working baseline: `main` at `6e2f2da`

## Window Summary

- Candidate decisions found: 2
- Autonomous decisions possible: 2
- Operator escalations required: 0
- Overall recommendation: adapt the shared-core renderer fix from Task #61 into `crates/rhwp/`, and decline the upstream market-research report from the Hwping mainline docs tree.

## Candidate 1

### Candidate Change

- Title: Exclude non-rendered ClickHere guide height and reset TAC fix-overlay state on positive line spacing
- Upstream area: renderer height measurement and pagination
- Upstream summary: Task #61 adjusts paragraph-height measurement so ClickHere guide text that is not rendered does not consume pagination height, and resets TAC overlay state so the same table height is not applied twice across consecutive paragraphs.
- Exact upstream feature, provider, contract, or path: upstream `src/renderer/height_measurer.rs` and `src/renderer/pagination/engine.rs` in commit `2b58f5d`
- Exact local downstream surface affected: `crates/rhwp/src/renderer/height_measurer.rs` and `crates/rhwp/src/renderer/pagination/engine.rs`, with indirect downstream impact on preview PDF generation and page-count stability exposed through `crates/hwping-core/` and `crates/hwping-ffi/`
- Why it matters: Hwping is a macOS reader. Incorrect paragraph height in the shared engine can surface as wrong page breaks, unstable preview output, and incorrect page counts in the app and Quick Look surfaces.
- What this actually means in practice: Hwping's relocated engine tree still counts non-rendered ClickHere guide text in some measured paragraph heights and can carry TAC overlay state too far when a positive line-spacing TAC table follows negative-line-spacing paragraphs. Upstream now has a concrete fix for both cases.
- Before: a form document with ClickHere guide text can reserve layout height for text that never appears on screen, and consecutive TAC-table paragraphs can over-accumulate visual height in pagination bookkeeping.
- After: measured height excludes the non-rendered guide contribution, and TAC overlay state is reset when a positive-line-spacing TAC table should terminate the previous overlay correction.
- Concrete consequence: page breaks, page counts, and preview output should better match the actual rendered content for affected documents.
- What is not changing: Hwping's crate split, FFI surface, macOS app structure, and Quick Look architecture do not change.
- Expected end-user effect: a macOS user opening an affected form or TAC-table document is less likely to see a paragraph or table pushed onto the wrong page.
- Breaking or migration risk: low user-facing migration risk, but medium correctness risk if the adaptation is ported incorrectly because pagination code is sensitive.
- Relevance to the fork's current stage: high, because reading quality and stable preview output are part of the current macOS reader milestone.
- Evidence source category: upstream commit, local code, and local Hwping sync-policy docs

### Intake Analysis

- What user or maintainer problem does this change solve upstream? It removes pagination height that should never have counted and stops a visual-height correction from being applied twice across TAC-table paragraphs.
- What assumptions from upstream do not carry over cleanly to Hwping? The logic still belongs to shared engine code, but the path layout does not carry over because Hwping moved the engine into `crates/rhwp/`.
- Is the upstream change about policy, implementation, or both? Implementation only.
- Is this a duplicate or near-duplicate of an existing local change? No equivalent local fix was identified in the current Hwping `crates/rhwp/` files that correspond to these code paths.
- If it overlaps an existing local implementation, whose implementation should win and why? Upstream should win because this is shared-core renderer correctness and Hwping policy favors upstream-shaped engine behavior when the disagreement is not product policy.
- What are the main upsides of introducing this change? Better pagination correctness, fewer false page breaks, and cleaner future sync because the fork stops carrying a known divergence in shared engine logic.
- What are the main downsides, costs, or maintenance burdens? The adaptation still needs careful porting into the relocated crate and targeted regression checks on documents that exercise ClickHere fields and TAC tables.
- Does this include security or hardening work that collides with, duplicates, or weakens an existing local implementation? No.
- What minute compatibility details matter if this lands? The adaptation must preserve Hwping's relocated crate paths and should be checked against `samples/field-01.hwp` plus at least one table-heavy sample such as `samples/hwp_table_test.hwp` or `samples/multi-table-001.hwp`.
- Literal user or operator scenario: A macOS user opens a form-style `.hwp` file with ClickHere guide text. After the fix is adapted, the page count and preview PDF no longer reserve height for invisible guide content, so later paragraphs stay on the correct page.

### Autonomy Boundary

- Can the agent decide this autonomously?: `yes`
- Why this is safe to decide autonomously, or why it is not: The change is shared-core renderer correctness with no Hwping product-direction conflict and no public-contract change that requires operator judgment.
- Existing policy or prior decision that authorizes the choice: Hwping policy says shared engine fixes should stay upstream-aligned unless there is a concrete Hwping-only reason not to.
- What still requires explicit operator judgment, if anything: Nothing at the decision level. The actual patch still needs normal code review and regression validation when implemented.

### Escalation

- Escalation required: `no`
- Why operator input is required: Not applicable.
- Recommended decision: `adapt`
- What can proceed without approval: Port the fix into the relocated `crates/rhwp/` files and validate against representative samples.
- What is blocked pending approval: Nothing.
- Re-raise by: Not applicable.

### Decision

- Decision: `adapt`
- Decision owner: Hwping maintainer
- Ship target: next upstream sync batch after 2026-04-07
- Related issue, PR, ADR, or note: this report

### Decision Rationale

- Reason for the decision: The behavior belongs in shared core, upstream already has a concrete fix, and Hwping's only material difference here is repository layout.
- Product or user impact: Better page-break correctness for affected documents in the macOS app and preview surfaces.
- Shared-core impact: Reduces divergence in renderer bookkeeping and keeps `crates/rhwp/` closer to upstream.
- Fork-specific impact: Requires a path-local adaptation into the moved crate tree but no Hwping-specific behavior fork.
- Ecosystem or extension impact: More stable preview output for downstream consumers of shared rendering results.
- Docs or migration impact: No migration guide required. The resulting sync note should mention the adaptation in the next intake record or PR.
- Overlap with existing local implementation: Current Hwping code still shows the older logic in the corresponding files.
- Why this decision is better than the obvious alternative: Declining the fix would preserve a known shared-core correctness gap for no product benefit. Re-implementing a different local fix would create unnecessary divergence.
- Compatibility details to preserve during merge: Keep the code inside `crates/rhwp/`, preserve the workspace boundary, and validate both ClickHere and TAC-table samples.

### Acceptance Checks

- Security implications checked: yes; no security boundary issue was identified.
- Correctness or bug-fix value checked: yes; this is a direct pagination correctness fix.
- Maintenance cost checked: yes; adaptation cost is modest and lower than carrying divergence.
- FFI, app, extension, or public contract compatibility checked: yes; runtime outputs may improve, but no API contract change is implied.
- Existing local implementation overlap checked: yes; no stronger local fix was found in the current corresponding files.
- Upstream-sync clarity checked: yes; this is the kind of shared-core change Hwping should keep aligned.

### If `adapt`

- Upstream improvement being preserved: correct exclusion of non-rendered ClickHere guide height and correct reset of TAC overlay bookkeeping
- Local adaptation approach: port the logic into `crates/rhwp/src/renderer/height_measurer.rs` and `crates/rhwp/src/renderer/pagination/engine.rs` without changing the Hwping crate layout
- Why direct adoption is wrong for this fork: the upstream root-level file paths do not exist in Hwping because the engine lives under `crates/rhwp/`
- Compatibility layer or bridge needed: none beyond adapting the change into the relocated crate paths
- Tests that prove the adaptation: compare page-count and preview behavior on `samples/field-01.hwp` and one table-heavy sample such as `samples/hwp_table_test.hwp`; run `cargo test` for the engine afterwards
- What local product or policy decision this depends on: none

### Verification

- Verification status: analysis complete; code adaptation not performed in this intake seed
- Commands or checks run: `git log --oneline upstream/main..upstream/local/devel`; `git show --stat --summary --format=fuller 2b58f5d`; inspection of current `crates/rhwp/src/renderer/height_measurer.rs` and `crates/rhwp/src/renderer/pagination/engine.rs`
- Risk level: medium until the actual adaptation is tested on representative samples
- Rollback plan if the decision later proves wrong: revert the adapted renderer patch and keep the carry-forward note open until a corrected upstream or local variant is ready

### Notes For Next Intake

- Revisit date if needed: at the next actual sync batch if the adaptation has not yet landed
- Related upstream work to watch: further renderer and pagination fixes around TAC tables, ClickHere fields, and measured paragraph height
- Follow-up tasks: implement the adaptation, run regression checks, and record the landing PR in future intake artifacts

## Candidate 2

### Candidate Change

- Title: X and Twitter HWP viewer sentiment analysis report
- Upstream area: repo documentation and market research
- Upstream summary: commit `9003e0d` adds a social-listening report under `mydocs/report/x_hwp_viewer_voices.md` summarizing 157 posts about HWP and HWPX viewers.
- Exact upstream feature, provider, contract, or path: upstream `mydocs/report/x_hwp_viewer_voices.md` in commit `9003e0d`
- Exact local downstream surface affected: Hwping documentation scope, report storage boundaries, and future sync noise in the main repository
- Why it matters: Even a docs-only commit can increase fork maintenance cost if it adds material that Hwping does not treat as durable product or engine guidance.
- What this actually means in practice: If Hwping accepts this file as-is, the repo gains an upstream market-research document with no direct effect on engine behavior, macOS product boundaries, or sync operations.
- Before: Hwping has no `mydocs/report/` directory and its docs policy emphasizes durable product plans, architecture notes, manuals, and troubleshooting material.
- After: the repo would gain a research note in a legacy-style report location that Hwping does not otherwise use.
- Concrete consequence: more sync noise, unclear document ownership, and no runtime benefit.
- What is not changing: engine behavior, app behavior, FFI contracts, and Quick Look surfaces all remain the same.
- Expected end-user effect: none.
- Breaking or migration risk: none.
- Relevance to the fork's current stage: low.
- Evidence source category: upstream commit and local Hwping documentation policy

### Intake Analysis

- What user or maintainer problem does this change solve upstream? It preserves upstream market-research context and public-sentiment notes for upstream planning.
- What assumptions from upstream do not carry over cleanly to Hwping? Hwping does not treat social-listening reports as durable repo artifacts by default, and the target path does not match the Hwping docs structure.
- Is the upstream change about policy, implementation, or both? Policy and documentation scope.
- Is this a duplicate or near-duplicate of an existing local change? No.
- If it overlaps an existing local implementation, whose implementation should win and why? Hwping's local docs policy should win because this is a fork-owned documentation-scope decision, not shared engine behavior.
- What are the main upsides of introducing this change? Minimal potential context value for product planning.
- What are the main downsides, costs, or maintenance burdens? It adds low-signal docs churn, creates a report location Hwping is not otherwise using, and makes future upstream sync reviews noisier.
- Does this include security or hardening work that collides with, duplicates, or weakens an existing local implementation? No.
- What minute compatibility details matter if this lands? The main detail is document placement and long-term ownership, not runtime compatibility.
- Literal user or operator scenario: A maintainer runs a monthly upstream intake and has to explain why a social-media research note appeared in the Hwping tree even though it does not change the engine or the macOS product plan.

### Autonomy Boundary

- Can the agent decide this autonomously?: `yes`
- Why this is safe to decide autonomously, or why it is not: Hwping already has a clear docs-boundary policy and this item does not request a product-direction change.
- Existing policy or prior decision that authorizes the choice: Hwping docs should stay focused on product architecture, operating plans, manuals, troubleshooting notes, and other durable material that serves the fork.
- What still requires explicit operator judgment, if anything: Nothing, unless the maintainer later wants this research rewritten into a Hwping-owned planning note.

### Escalation

- Escalation required: `no`
- Why operator input is required: Not applicable.
- Recommended decision: `decline`
- What can proceed without approval: Keep the file out of Hwping mainline docs and record the rationale here.
- What is blocked pending approval: Nothing.
- Re-raise by: Only if the document is later recast as a Hwping planning input with explicit ownership.

### Decision

- Decision: `decline`
- Decision owner: Hwping maintainer
- Ship target: do not merge into Hwping mainline docs
- Related issue, PR, ADR, or note: this report

### Decision Rationale

- Reason for the decision: The commit does not change runtime behavior or Hwping operating policy enough to justify new sync noise.
- Product or user impact: None.
- Shared-core impact: None.
- Fork-specific impact: Keeps the docs tree smaller and aligned with the documented Hwping policy.
- Ecosystem or extension impact: None.
- Docs or migration impact: Reinforces that low-durability research notes should not be copied into the canonical Hwping docs tree by default.
- Overlap with existing local implementation: No overlapping Hwping document exists.
- Why this decision is better than the obvious alternative: Accepting the file would preserve context with no corresponding runtime or maintenance gain for the fork.
- Compatibility details to preserve during merge: Preserve the existing Hwping docs placement rules and keep intake artifacts in the canonical intake package instead.

### Acceptance Checks

- Security implications checked: yes; none.
- Correctness or bug-fix value checked: yes; none present.
- Maintenance cost checked: yes; cost is unnecessary sync noise.
- FFI, app, extension, or public contract compatibility checked: yes; unaffected.
- Existing local implementation overlap checked: yes; no local counterpart exists.
- Upstream-sync clarity checked: yes; declining this keeps future sync reviews more focused.

### If `decline`

- Why the fork is declining the change: It is an upstream research artifact outside Hwping's canonical doc scope.
- What existing local behavior already covers this area: Hwping already has explicit docs placement rules for product plans, architecture, troubleshooting, and manuals.
- What would need to change for this to be reconsidered: The research would need to be rewritten into a named Hwping planning or operating document with a clear owner and durable use.
- Whether this needs a standing note for future reviews: yes; similar upstream research notes should be declined unless their role changes materially.

### Verification

- Verification status: analysis complete; no code or docs imported
- Commands or checks run: `git log --oneline upstream/main..upstream/local/devel`; `git show --stat --summary --format=fuller 9003e0d`; review of Hwping docs placement policy
- Risk level: low
- Rollback plan if the decision later proves wrong: create a new Hwping-owned planning note in the proper docs tree rather than copying the upstream report into the canonical intake package

### Notes For Next Intake

- Revisit date if needed: only if upstream research documents begin to drive actual Hwping product decisions
- Related upstream work to watch: other upstream documentation commits that may not fit Hwping's smaller docs surface
- Follow-up tasks: none