# Hwping Upstream Intake Method

This document defines the working method for upstream intake in Hwping.

Treat upstream review as a fork-maintenance decision workflow. The goal is not to paraphrase upstream notes. The goal is to decide what Hwping should do with upstream work while preserving the fork boundary.

## Candidate Decision Unit

Do not treat a commit as the default review unit.

The default review unit is a candidate decision:

- one upstream change with one practical downstream consequence, or
- several related commits that together require one Hwping decision

Use a candidate decision when grouped commits:

- solve the same bug or correctness issue
- change one compatibility-sensitive seam
- express one product or policy shift
- land one maintenance theme that Hwping should either accept or decline as a set

Split candidate decisions when different parts clearly need different outcomes such as `accept` for one part and `decline` for another.

## Hwping Surface Map

Always name the exact local surface affected.

Use these names instead of vague phrases such as `local code` or `product layer`:

- `crates/rhwp/` for upstream-aligned shared engine work
- `crates/hwping-core/` for the typed downstream facade
- `crates/hwping-ffi/` for the Swift-facing C ABI
- `apps/hwping-macos/` for the document app
- `extensions/` for Quick Look preview and thumbnail integration
- `mydocs/hwping/` for Hwping-specific product and operating docs

## Duplicate-Detection Pass

Before deciding, always ask:

1. Does Hwping already have this fix or behavior in another shape?
2. If yes, is the local version weaker, stronger, or merely relocated because of the workspace split?
3. Does the overlap live in `crates/rhwp/`, or in a downstream-only surface such as `crates/hwping-core/` or `apps/hwping-macos/`?
4. Is the disagreement about implementation, or about product policy?

If the disagreement is implementation-only, prefer the upstream-shaped behavior and adapt it into the moved Hwping tree.
If the disagreement is policy, escalate before choosing an implementation.

## Required Drill-Down

Do not stop at the upstream summary.

For each meaningful candidate, explain all of the following in concrete terms:

- Exact upstream thing changing:
- Exact local downstream surface affected:
- Before:
- After:
- Concrete consequence:
- What is not changing:

Then answer these prompts explicitly:

- What concrete behavior changes if this lands in Hwping?
- Who notices first: maintainer, macOS user, Quick Look user, or nobody?
- Where does it surface first: parser behavior, pagination, PDF export, page count, FFI, app UX, or docs?
- What problem disappears?
- What new cost, constraint, or maintenance burden appears?
- If nothing user-visible changes, what sync or maintenance pressure changes instead?

## Literal Scenario Requirement

Every major candidate needs at least one literal scenario.

Examples:

- A macOS user opens a form document and page 2 no longer shifts because non-rendered ClickHere guide text no longer consumes pagination height.
- A maintainer declines an upstream research note because importing it would add sync noise without changing any Hwping runtime surface.

If you cannot write one literal scenario, the analysis is not deep enough yet.

## Ambiguity Lint

Before finalizing an item, remove phrases that leave the referent unresolved.

Rewrite any phrase like:

- `this path`
- `that surface`
- `some cases`
- `vendor-specific`
- `upstream-only`

Replace it with the exact crate, app, extension, file path, vendor, feature, or contract.

## Evidence Ladder

Work from top to bottom until the decision is high confidence.

1. Upstream compare window, release notes, or commit summary
2. Underlying upstream commit or diff
3. Local Hwping code surface affected
4. Local Hwping policy or architecture docs
5. Verification commands or tests if the change is being merged now

When the decision depends on Apple platform policy, vendor terms, pricing, legal language, or external product positioning, use internet lookup and prefer official sources.

## Policy vs Implementation

Always separate these two questions:

- What exactly changed upstream?
- Why does that matter to Hwping?

Then ask:

- Is the disagreement about policy, implementation, or both?

Implementation overlap usually resolves inside `crates/rhwp/`.
Policy conflicts usually require operator input first.

## Hwping Decision Rules

- Shared-core fixes in `crates/rhwp/` should generally preserve the upstream behavior and land as `accept as-is` or `adapt into shared core`.
- Hwping-only product surfaces should preserve the local shape. Adapt upstream ideas into `crates/hwping-core/`, `crates/hwping-ffi/`, `apps/hwping-macos/`, or `extensions/` instead of forcing upstream product assumptions into the fork.
- Do not reintroduce removed web demo, npm, browser-only, or VS Code distribution surfaces into the main Hwping tree unless the operator has explicitly changed product direction.
- Do not silently local-override a security-relevant upstream change when the real disagreement is policy. Escalate first.

## Operator Question Packet

When escalation is required, package the question like this:

- the exact decision the operator must make
- what it means in simple language
- the affected Hwping surface
- realistic options
- pros of each option
- cons of each option
- the recommended option
- what remains blocked until a decision lands

Do not escalate with a vague request for approval.

## Urgency Scoring

### Priority 0

- security boundary issue
- correctness failure with data loss or severe document corruption risk
- breaking compatibility on a core public contract

### Priority 1

- important correctness or rendering fix in `crates/rhwp/`
- change that affects preview PDF, page count, or core macOS reader behavior
- work that blocks near-term Hwping milestones

### Priority 2

- meaningful maintenance improvement with limited blast radius
- duplicate work that still needs a collision decision
- repo-boundary cleanup that keeps sync cheap

### Priority 3

- optional upstream surfaces outside current Hwping direction
- documentation-only work with no near-term runtime consequence
- low-value housekeeping that can be deferred safely

## Standard Recommendation Shapes

Use one of these recommendation shapes in every report:

- `accept as-is`
- `accept with local follow-up`
- `adapt into shared core`
- `adapt into downstream-only surface`
- `decline and carry forward rationale`
- `defer pending operator decision`