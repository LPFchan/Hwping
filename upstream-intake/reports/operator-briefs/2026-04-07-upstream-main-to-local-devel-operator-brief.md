# Operator Brief: `upstream/main..upstream/local/devel`

## Review Metadata

- Review date: 2026-04-07
- Upstream window: `upstream/main..upstream/local/devel`
- Baseline reviewed against: Hwping `main` at `6e2f2da`
- Overall recommendation: adapt one shared-core renderer fix into `crates/rhwp/`; decline one upstream research document that does not fit the Hwping docs boundary

## This Period At A Glance

- No operator decision is required in this window.
- One upstream renderer fix is worth taking soon because it improves pagination correctness for ClickHere fields and TAC-table paragraphs without changing Hwping product policy.
- One upstream market-research document should stay out of Hwping mainline docs because it adds sync noise without changing the engine, app, or roadmap.
- The main watch item for the next real sync batch is renderer correctness around measured height, page count, and preview output.

## Decisions Requiring Operator Input

None this cycle.

## Watchlist

- Compatibility surfaces to monitor next: `crates/rhwp/` pagination and measured-height logic, plus any downstream page-count or preview regressions that surface through `crates/hwping-core/` and Quick Look outputs
- Decisions to carry forward next review: shared-core renderer fixes should usually be adapted into the relocated `crates/rhwp/` tree; upstream research-only repo artifacts should usually be declined unless they are rewritten into Hwping-owned planning material
- Deferred items and revisit date: none

## Decisions Made Autonomously

### Adapt Task #61 into the relocated engine crate

The important upstream item in this window is Task #61, which fixes two renderer bookkeeping issues: invisible ClickHere guide text should not consume pagination height, and TAC-table overlay state should not survive into the wrong follow-on paragraph. In Hwping, that belongs in shared core, so the right move is to port the logic into `crates/rhwp/` rather than invent a fork-specific variant.

- Why this was safe to decide: it is an implementation-level shared-core fix with no product-direction conflict
- Next: port the change into `crates/rhwp/`, then validate page-count and preview behavior on `samples/field-01.hwp` and a table-heavy sample before merging

### Decline the X and Twitter viewer-sentiment report

The other upstream item is a social-listening document under `mydocs/report/`. It may be useful upstream, but it does not change Hwping runtime behavior or the native macOS roadmap, and it would introduce a doc location that Hwping is not otherwise using. The right move is to keep it out of the fork and record the rationale once here.

- Why this was safe to decide: Hwping already has a documented docs-boundary policy and this item does not ask for a new product-direction decision
- Next: keep the decline rationale in the carry-forward register so later reviews do not re-litigate similar upstream research notes