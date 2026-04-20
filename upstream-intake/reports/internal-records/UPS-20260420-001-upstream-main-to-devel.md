# UPS-20260420-001: `upstream/main..upstream/devel`

## Review Metadata

- Review id: `UPS-20260420-001`
- Opened: `2026-04-20 18-17-38 KST`
- Recorded by agent: `codex-20260420-upstream-intake`
- Review date: `2026-04-20`
- Reviewer: Codex
- Upstream window reviewed: `upstream/main..upstream/devel`
- Upstream refs or PRs reviewed: `b3ca258`, `e239a08`, `2268ea7`, `dd02344`, `c4be240`
- Downstream branch or working baseline: `main` at `e28c439`

## Window Summary

- Candidate decisions found: 3
- Autonomous decisions possible: 3
- Operator escalations required: 0
- Overall recommendation: adapt the shared-core parser fixes and decline the browser-only extension package plus its release collateral.

## Candidate 1

### Candidate Change

- Title: Normalize CFB stream paths to forward slashes in shared parser listings
- Upstream area: parser path handling in the CFB reader
- Upstream summary: commit `2268ea7` normalizes `entry.path()` strings in `src/parser/cfb_reader.rs` so stream enumeration and BinData listing use `/` consistently instead of leaking platform-specific backslashes.
- Exact upstream feature, provider, contract, or path: upstream `src/parser/cfb_reader.rs` from PR #152
- Exact local downstream surface affected: `crates/rhwp/src/parser/cfb_reader.rs`, with indirect effects on any downstream code that compares or displays CFB stream paths through `crates/hwping-core/` or `crates/hwping-ffi/`
- Why it matters: Hwping keeps the engine in shared core, so path normalization bugs in the CFB walker can create platform-specific stream names and make comparisons or lookups brittle.
- What this actually means in practice: the current Hwping reader still forwards raw CFB entry paths from `walk()`. Upstream now rewrites those paths to use `/` before they are stored or reported.
- Before: `list_bin_data`, `list_streams`, and `list_all_entries` can expose backslash-separated paths on some platforms.
- After: the same APIs report forward-slash-separated paths everywhere.
- Concrete consequence: BinData and stream enumeration become stable across platforms and easier to compare in tests, logs, and downstream tooling.
- What is not changing: the underlying CFB storage layout, stream lookup contract, and public facade APIs stay the same.
- Expected end-user effect: mostly indirect; maintainer-facing comparisons and parser tests become more reliable, and future cross-platform behavior is less surprising.
- Breaking or migration risk: low API risk, low user risk, but moderate regression risk if the path rewrite is applied in the wrong layer.
- Relevance to the fork's current stage: medium. This is shared-core hygiene rather than a visible macOS feature, but it keeps the engine easier to sync.
- Evidence source category: upstream commit, local parser code, and repo policy on shared-core alignment

### Intake Analysis

- What user or maintainer problem does this change solve upstream? It removes platform-specific path formatting from CFB stream enumeration.
- What assumptions from upstream do not carry over cleanly to Hwping? Upstream file paths live at a different repository root, but the behavior still belongs in shared engine code.
- Is the upstream change about policy, implementation, or both? Implementation only.
- Is this a duplicate or near-duplicate of an existing local change? No equivalent local fix was identified in `crates/rhwp/src/parser/cfb_reader.rs`.
- If it overlaps an existing local implementation, whose implementation should win and why? Upstream should win because this is shared-core parser behavior and Hwping has no local policy reason to diverge.
- What are the main upsides of introducing this change? Stable stream names, fewer platform-specific comparison bugs, and cheaper future syncs.
- What are the main downsides, costs, or maintenance burdens? The code change is small, but the path rewrite must be kept strictly at the presentation/enumeration layer.
- Does this include security or hardening work that collides with, duplicates, or weakens an existing local implementation? No.
- What minute compatibility details matter if this lands? Only stream path presentation should change; CFB lookup, storage, and serialization behavior should not be altered.
- Literal user or operator scenario: A maintainer compares BinData stream listings on a fixture from two different platforms and sees the same `/BinData/...` names instead of a mix of slashes and backslashes.

### Autonomy Boundary

- Can the agent decide this autonomously?: `yes`
- Why this is safe to decide autonomously, or why it is not: This is shared-core implementation work with no Hwping product-policy conflict.
- Existing policy or prior decision that authorizes the choice: Shared engine fixes should remain upstream-aligned unless there is a concrete Hwping-only reason not to.
- What still requires explicit operator judgment, if anything: Nothing at the decision level.

### Escalation

- Escalation required: `no`
- Why operator input is required: Not applicable.
- Recommended decision: `adapt`
- What can proceed without approval: Port the path normalization into `crates/rhwp/src/parser/cfb_reader.rs`.
- What is blocked pending approval: Nothing.
- Re-raise by: Not applicable.

### Decision

- Decision: `adapt`
- Decision owner: Hwping maintainer
- Ship target: next upstream sync batch
- Related issue, PR, ADR, or note: this report

### Decision Rationale

- Reason for the decision: The behavior is shared-core hygiene and Hwping should stay close to upstream here.
- Product or user impact: Mostly indirect, but it improves parser stability and comparison reliability.
- Shared-core impact: Reduces platform-specific path noise in the engine.
- Fork-specific impact: The only fork-specific work is adapting the root-relative path to the relocated crate.
- Ecosystem or extension impact: Downstream tooling that inspects stream names becomes more predictable.
- Docs or migration impact: None.
- Overlap with existing local implementation: No stronger local version was found.
- Why this decision is better than the obvious alternative: Declining it would keep a small but real portability bug in shared core for no Hwping benefit.
- Compatibility details to preserve during merge: Normalize displayed paths only; do not change how CFB entries are stored or opened.

### Acceptance Checks

- Security implications checked: yes; no security boundary issue was identified.
- Correctness or bug-fix value checked: yes; stream enumeration becomes stable across platforms.
- Maintenance cost checked: yes; the adaptation is small and reduces future divergence.
- FFI, app, extension, or public contract compatibility checked: yes; no public API change is implied.
- Existing local implementation overlap checked: yes; no equivalent local fix was identified.
- Upstream-sync clarity checked: yes; this is a shared-core behavior change Hwping should preserve.

### If `adapt`

- Upstream improvement being preserved: normalized forward-slash CFB stream paths in enumeration output
- Local adaptation approach: port the `replace('\\', "/")` normalization into `crates/rhwp/src/parser/cfb_reader.rs`
- Why direct adoption is wrong for this fork: the upstream file path does not exist in Hwping because the engine lives under `crates/rhwp/`
- Compatibility layer or bridge needed: none
- Tests that prove the adaptation: existing CFB stream listing and comparison tests in `crates/rhwp` should cover the path output; add a focused assertion if needed
- What local product or policy decision this depends on: none

### Verification

- Verification status: analysis complete; code adaptation not performed in this intake
- Commands or checks run: `git fetch upstream --prune`; `git diff --name-status upstream/main..upstream/devel`; `git show --patch --unified=40 2268ea7 -- src/parser/cfb_reader.rs`; inspection of `crates/rhwp/src/parser/cfb_reader.rs`
- Risk level: low to medium
- Rollback plan if the decision later proves wrong: revert the path normalization patch and keep the carry-forward note open until a corrected variant is available

### Notes For Next Intake

- Revisit date if needed: at the next sync batch if this has not yet been ported
- Related upstream work to watch: any future parser change that depends on path enumeration or stream-name comparisons
- Follow-up tasks: implement the adaptation and validate the existing parser tests

## Candidate 2

### Candidate Change

- Title: Add HWPX decompression caps and fail-closed strikeout parsing
- Upstream area: HWPX ZIP reading and header parsing
- Upstream summary: commit `dd02344` adds fixed per-entry decompression ceilings in `src/parser/hwpx/reader.rs`, and commit `c4be240` changes `strikeout` parsing in `src/parser/hwpx/header.rs` from a blacklist to a whitelist of real strike shapes.
- Exact upstream feature, provider, contract, or path: upstream `src/parser/hwpx/reader.rs` and `src/parser/hwpx/header.rs` from PRs #153 and #154
- Exact local downstream surface affected: `crates/rhwp/src/parser/hwpx/reader.rs` and `crates/rhwp/src/parser/hwpx/header.rs`, with indirect effects on `crates/hwping-core/`, `crates/hwping-ffi/`, and any preview or app surface that opens HWPX files
- Why it matters: HWPX parsing feeds the shared engine used by the macOS app, smoke targets, and future Quick Look surfaces. Unbounded decompression can crash the host, and a blacklist-based strike parser can mis-render whole paragraphs.
- What this actually means in practice: the current Hwping reader still reads ZIP entries to completion with no size ceiling, and the current strike parser still treats any value other than `NONE` or `3D` as a real strike. Upstream now caps decompression and fail-closes unknown strike shapes.
- Before: a small compressed HWPX entry can expand into an unbounded in-memory buffer, and placeholder strikeout values can render body text with an accidental strike-through.
- After: XML and binary entries stop at fixed ceilings with a parse error if they exceed the limit, and only known real `LineSym2` shapes are treated as `strikethrough`.
- Concrete consequence: malformed or malicious HWPX documents fail cleanly instead of exhausting memory, and placeholder strikeout metadata no longer causes false strike rendering.
- What is not changing: the public reader API, the parser entry points, and the higher-level document model stay the same.
- Expected end-user effect: a macOS user opening a bad or oversized HWPX sees an error instead of a hang or crash, and a normal document is less likely to gain an unintended strike line.
- Breaking or migration risk: low API risk, medium behavioral risk if thresholds or strike-shape mappings are ported incorrectly.
- Relevance to the fork's current stage: high. This is core reader behavior that directly affects app stability and document fidelity.
- Evidence source category: upstream commit, local parser code, and repo policy on shared-core alignment and security-aware parsing

### Intake Analysis

- What user or maintainer problem does this change solve upstream? It prevents decompression-bomb crashes and eliminates a forward-compatibility bug in strikeout parsing.
- What assumptions from upstream do not carry over cleanly to Hwping? Hwping currently has the same unbounded read behavior and the same blacklist-style strike parser, so there is no local alternative to preserve.
- Is the upstream change about policy, implementation, or both? Implementation only.
- Is this a duplicate or near-duplicate of an existing local change? No equivalent local fix was identified in the current `crates/rhwp` files.
- If it overlaps an existing local implementation, whose implementation should win and why? Upstream should win because the fix belongs in shared core and strengthens the parser without changing product policy.
- What are the main upsides of introducing this change? Better crash resistance, fail-closed parsing, and less visual corruption on placeholder strikeout metadata.
- What are the main downsides, costs, or maintenance burdens? Thresholds need to remain defensible, and the parser tests need to exercise the edge cases.
- Does this include security or hardening work that collides with, duplicates, or weakens an existing local implementation? No; it hardens the parser.
- What minute compatibility details matter if this lands? The caps are `32 MB` for XML and `64 MB` for binary entries, and unknown strike shapes must remain fail-closed.
- Literal user or operator scenario: A malformed HWPX with a tiny compressed `section.xml` that expands into hundreds of megabytes returns a clean parse error instead of freezing the app, and a press-release body with `shape="3D"` no longer renders with a bogus strike-through.

### Autonomy Boundary

- Can the agent decide this autonomously?: `yes`
- Why this is safe to decide autonomously, or why it is not: The change is shared-core parser hardening with no Hwping product-direction conflict.
- Existing policy or prior decision that authorizes the choice: Shared engine fixes should remain upstream-aligned unless there is a concrete Hwping-only reason not to.
- What still requires explicit operator judgment, if anything: Nothing at the decision level.

### Escalation

- Escalation required: `no`
- Why operator input is required: Not applicable.
- Recommended decision: `adapt`
- What can proceed without approval: Port the caps and whitelist into the relocated HWPX parser files.
- What is blocked pending approval: Nothing.
- Re-raise by: Not applicable.

### Decision

- Decision: `adapt`
- Decision owner: Hwping maintainer
- Ship target: next upstream sync batch
- Related issue, PR, ADR, or note: this report

### Decision Rationale

- Reason for the decision: This is shared-core parser behavior, and Hwping benefits from the security and correctness improvements.
- Product or user impact: Improves stability and document fidelity for HWPX files.
- Shared-core impact: Adds a needed safety ceiling and removes fail-open strike parsing.
- Fork-specific impact: The only fork-specific work is adapting the upstream file layout into `crates/rhwp/`.
- Ecosystem or extension impact: Downstream consumers of HWPX parsing inherit safer behavior without API churn.
- Docs or migration impact: No migration guide is needed, but the thresholds should be documented near the parser code.
- Overlap with existing local implementation: No stronger local version was found.
- Why this decision is better than the obvious alternative: Declining it would keep an avoidable crash class and a known rendering bug in the shared engine.
- Compatibility details to preserve during merge: Keep the public `HwpxReader` API unchanged, keep the size ceilings as internal parser policy, and preserve the current `HwpxError` surface.

### Acceptance Checks

- Security implications checked: yes; this change closes an obvious decompression-bomb risk.
- Correctness or bug-fix value checked: yes; it removes a false strike rendering bug and prevents unbounded allocation.
- Maintenance cost checked: yes; the extra tests are worth the reduction in parser risk.
- FFI, app, extension, or public contract compatibility checked: yes; the public API remains stable.
- Existing local implementation overlap checked: yes; no equivalent local fix was identified.
- Upstream-sync clarity checked: yes; this is the kind of shared-core hardening Hwping should keep aligned.

### If `adapt`

- Upstream improvement being preserved: bounded ZIP entry decompression and fail-closed strikeout parsing
- Local adaptation approach: port `read_limited` and the strike-shape whitelist into `crates/rhwp/src/parser/hwpx/reader.rs` and `crates/rhwp/src/parser/hwpx/header.rs`
- Why direct adoption is wrong for this fork: the upstream paths do not match Hwping's relocated engine layout
- Compatibility layer or bridge needed: none
- Tests that prove the adaptation: add or port parser tests that cover under-cap, at-cap, and over-cap reads plus the 13 allowed strike shapes and placeholder values like `NONE` and `3D`
- What local product or policy decision this depends on: none

### Verification

- Verification status: analysis complete; code adaptation not performed in this intake
- Commands or checks run: `git fetch upstream --prune`; `git diff --name-status upstream/main..upstream/devel`; `git show --patch --unified=40 dd02344 -- src/parser/hwpx/reader.rs`; `git show --patch --unified=40 c4be240 -- src/parser/hwpx/header.rs`; inspection of `crates/rhwp/src/parser/hwpx/reader.rs` and `crates/rhwp/src/parser/hwpx/header.rs`
- Risk level: medium until the parser tests run
- Rollback plan if the decision later proves wrong: revert the parser patch and keep the carry-forward note open until a corrected variant is available

### Notes For Next Intake

- Revisit date if needed: at the next sync batch if the adaptation has not landed
- Related upstream work to watch: future parser hardening, HWPX fixture coverage, and any follow-on strike-shape changes
- Follow-up tasks: implement the adaptation and run parser regression tests against real HWPX fixtures

## Candidate 3

### Candidate Change

- Title: Decline the Firefox extension and its browser-release collateral
- Upstream area: browser-only product surface and associated docs
- Upstream summary: commit `e239a08` adds a new `rhwp-firefox/` extension package with build, manifest, test, and README files; the same upstream window also carries browser-release collateral under `README.md`, `README_EN.md`, `rhwp-chrome/README.md`, and `mydocs/` release and feedback files.
- Exact upstream feature, provider, contract, or path: upstream `rhwp-firefox/`, `rhwp-chrome/README.md`, `README.md`, `README_EN.md`, and upstream `mydocs/release/` / `mydocs/feedback/` collateral from PR #169 and the surrounding release docs merge
- Exact local downstream surface affected: no Hwping runtime surface; the relevant local surfaces are the macOS-only product scope in `SPEC.md` / `PLANS.md`, the repo boundary in `REPO.md`, and the absence of a browser-extension package in the main tree
- Why it matters: accepting a Firefox extension would reintroduce a browser-only distribution surface that Hwping deliberately does not carry, and it would add docs churn with no macOS reader benefit.
- What this actually means in practice: the new upstream package is a browser extension, not a macOS app target, Quick Look extension, or shared engine fix. The surrounding release and README changes support that browser surface rather than Hwping's native reader roadmap.
- Before: Hwping keeps browser-only product surfaces out of the main tree and concentrates on the macOS app, Quick Look, and shared engine layers.
- After: importing this change would add browser packaging, browser build scripts, and browser release collateral that have no local home in Hwping.
- Concrete consequence: more sync noise, more documentation surface area, and no improvement to the macOS reader product.
- What is not changing: the shared engine, the macOS app plan, Quick Look, Finder integration, and FFI contracts remain unchanged.
- Expected end-user effect: none for Hwping users.
- Breaking or migration risk: none for Hwping runtime, but high repository-scope drift if imported.
- Relevance to the fork's current stage: low. This is outside the current macOS product boundary.
- Evidence source category: upstream commit, upstream docs collateral, and Hwping product-scope policy

### Intake Analysis

- What user or maintainer problem does this change solve upstream? It expands upstream into a Firefox extension and keeps the related browser release collateral coherent.
- What assumptions from upstream do not carry over cleanly to Hwping? Hwping is macOS-focused and does not want browser-only distribution paths in the main product tree.
- Is the upstream change about policy, implementation, or both? Product policy and docs scope.
- Is this a duplicate or near-duplicate of an existing local change? No; Hwping intentionally does not have a browser-extension product surface.
- If it overlaps an existing local implementation, whose implementation should win and why? Hwping's product-surface pruning should win because the fork is deliberately not a browser product.
- What are the main upsides of introducing this change? None that matter to Hwping's current roadmap.
- What are the main downsides, costs, or maintenance burdens? It would add browser packaging and docs churn, make syncs noisier, and pull attention away from the macOS reader boundary.
- Does this include security or hardening work that collides with, duplicates, or weakens an existing local implementation? No.
- What minute compatibility details matter if this lands? None, because Hwping has no supported browser-extension contract to preserve.
- Literal user or operator scenario: A maintainer reviewing a sync batch does not have to explain why a Firefox extension or browser packaging files showed up in a macOS-only fork that ships through Finder, Quick Look, and native app surfaces.

### Autonomy Boundary

- Can the agent decide this autonomously?: `yes`
- Why this is safe to decide autonomously, or why it is not: Hwping already has explicit product-scope rules that exclude browser-only surfaces.
- Existing policy or prior decision that authorizes the choice: The product-surface pruning override and the current macOS reader roadmap keep browser-only workflows out of scope.
- What still requires explicit operator judgment, if anything: Nothing, unless the operator later changes the product direction.

### Escalation

- Escalation required: `no`
- Why operator input is required: Not applicable.
- Recommended decision: `decline`
- What can proceed without approval: Keep the browser-only package and its release collateral out of Hwping.
- What is blocked pending approval: Nothing.
- Re-raise by: Only if the operator explicitly changes Hwping's product direction toward browser distribution.

### Decision

- Decision: `decline`
- Decision owner: Hwping maintainer
- Ship target: do not merge into Hwping mainline docs or product tree
- Related issue, PR, ADR, or note: this report

### Decision Rationale

- Reason for the decision: The browser extension and its supporting docs do not serve Hwping's macOS-only product direction.
- Product or user impact: None for Hwping users.
- Shared-core impact: None.
- Fork-specific impact: Keeps the fork focused on the macOS app, Quick Look, Finder integration, and shared engine.
- Ecosystem or extension impact: Avoids reintroducing browser-only distribution work that the fork has intentionally dropped.
- Docs or migration impact: Prevents browser-release collateral from becoming part of Hwping's canonical documentation surface.
- Overlap with existing local implementation: Hwping already has a product-surface pruning rule that covers browser-only surfaces.
- Why this decision is better than the obvious alternative: Accepting the browser package would add cost without adding any Hwping product value.
- Compatibility details to preserve during merge: Preserve the current absence of browser-only product surfaces in the main tree.

### Acceptance Checks

- Security implications checked: yes; no Hwping-specific security win was identified.
- Correctness or bug-fix value checked: yes; none for the Hwping product.
- Maintenance cost checked: yes; the package would increase sync noise and docs churn.
- FFI, app, extension, or public contract compatibility checked: yes; unaffected for Hwping because no browser surface exists.
- Existing local implementation overlap checked: yes; Hwping intentionally has no browser-extension counterpart.
- Upstream-sync clarity checked: yes; declining it keeps future sync reviews focused on the macOS product.

### If `decline`

- Why the fork is declining the change: It is a browser-only product surface plus browser-release collateral, neither of which fit the Hwping roadmap.
- What existing local behavior already covers this area: The product-surface pruning rule in `known-local-overrides.md` and the macOS-focused roadmap already exclude browser-only surfaces.
- What would need to change for this to be reconsidered: An explicit operator decision to restore browser distribution in Hwping.
- Whether this needs a standing note for future reviews: no new note is required; the existing product-surface pruning rule already covers it.

### Verification

- Verification status: analysis complete; no code or docs imported
- Commands or checks run: `git fetch upstream --prune`; `git diff --name-status upstream/main..upstream/devel`; `git show --stat --summary --format=fuller e239a085b8d029a25fb93c1047c6baac61e8bdc2`; review of Hwping product-scope policy
- Risk level: low
- Rollback plan if the decision later proves wrong: if the product direction changes, create a new Hwping-owned browser-surface plan instead of copying the upstream package into the current tree

### Notes For Next Intake

- Revisit date if needed: only if Hwping's product scope changes
- Related upstream work to watch: other browser-extension or browser-release collateral that should stay outside the fork
- Follow-up tasks: none
