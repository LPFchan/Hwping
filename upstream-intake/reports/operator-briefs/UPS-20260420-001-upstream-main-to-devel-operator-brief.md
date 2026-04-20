# UPS-20260420-001 Operator Brief: `upstream/main..upstream/devel`

## Review Metadata

- Review id: `UPS-20260420-001`
- Opened: `2026-04-20 18-17-38 KST`
- Recorded by agent: `codex-20260420-upstream-intake`
- Review date: `2026-04-20`
- Upstream window: `upstream/main..upstream/devel`
- Baseline reviewed against: Hwping `main` at `e28c439`
- Overall recommendation: adapt the shared-core parser fixes and decline the browser-only extension package and its release collateral

## This Period At A Glance

The live upstream split now has two clear parts. The parser side on `upstream/main` should be adapted into `crates/rhwp/` because it improves shared-core correctness and hardens HWPX parsing. The browser side on `upstream/devel` should be declined because Hwping is still a macOS-focused fork and does not want browser-only product surfaces or their release collateral in the main tree.

## Decisions Requiring Operator Input

None this cycle.

## Watchlist

- Compatibility surfaces to monitor next: `crates/rhwp/src/parser/cfb_reader.rs`, `crates/rhwp/src/parser/hwpx/reader.rs`, and `crates/rhwp/src/parser/hwpx/header.rs`
- Decisions to carry forward next review: shared-core parser fixes should usually be adapted into the relocated engine tree; browser-only product surfaces should stay out of the Hwping main tree
- Deferred items and revisit date: none

## Decisions Made Autonomously

### Normalize CFB stream paths

The upstream CFB reader now normalizes stream paths to `/` before listing them. That is a shared-core cleanup, so the right move for Hwping is to port it into `crates/rhwp/` and keep the engine paths stable across platforms.

- Why this was safe to decide: implementation-only shared-core behavior with no product-policy conflict
- Next: port the path normalization into `crates/rhwp/src/parser/cfb_reader.rs`

### Cap HWPX decompression and fail closed on strike shapes

The upstream HWPX reader now limits per-entry decompression, and the header parser now only marks real strike shapes as strikes. This improves both security and document fidelity, so it should be adapted into the relocated engine files.

- Why this was safe to decide: it hardens shared-core parsing without changing public APIs
- Next: port the caps and the strike-shape whitelist into `crates/rhwp/src/parser/hwpx/reader.rs` and `crates/rhwp/src/parser/hwpx/header.rs`

### Decline the Firefox extension and browser-release collateral

The browser extension package and the surrounding README and release-doc changes do not fit Hwping's macOS-only product scope. Keeping them out of the fork avoids sync noise and keeps the repo focused on the native reader boundary.

- Why this was safe to decide: Hwping already has a product-surface pruning rule that excludes browser-only surfaces
- Next: keep the browser package and its collateral out of the main tree
