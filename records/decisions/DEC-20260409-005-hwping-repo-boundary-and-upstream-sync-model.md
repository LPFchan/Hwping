# DEC-20260409-005: Accept The Hwping Repo Boundary And Upstream Sync Model
Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Project: Hwping
- Project id: `hwping`
- Decision owner: Hwping operator
- Status: accepted
- Related ids: `DEC-20260409-001`, `DEC-20260409-002`, `DEC-20260409-003`

## Decision

Hwping keeps a sharp fork boundary around an upstream-aligned shared engine and downstream Apple-platform product layers.

The accepted repository model is:

- `crates/rhwp/` for upstream-aligned shared-core parser, model, renderer, serializer, and CLI behavior
- `crates/hwping-core/` and `crates/hwping-ffi/` for downstream facade and FFI boundaries
- `apps/` and `extensions/` for native product surfaces
- recurring upstream review recorded in `upstream-intake/`

The following surfaces remain out of scope for the main Hwping tree:

- web demo hosting
- npm package distribution
- VS Code extension distribution
- legacy browser-only infrastructure

## Context

Hwping is a downstream fork of `rhwp`. Without a clear boundary, product code would leak into the engine core, upstream merges would become noisier, and the repo would drift back toward a multi-product tree that Hwping no longer wants to maintain.

## Rationale

- Shared engine fixes should stay upstreamable or at least upstream-shaped whenever possible.
- Apple-platform behavior belongs in downstream layers because it reflects Hwping product policy, not general engine logic.
- Removing unused upstream product surfaces keeps the fork smaller and cheaper to sync.
- Routine upstream intake makes sync a normal operating practice rather than a rescue operation.

## Accepted Branch And Remote Model

- `origin` is the Hwping fork
- `upstream` is the original `rhwp` repository
- `main` is the Hwping stable branch
- `devel` is the integration branch
- `local/taskNNN` branches are the normal task branches

## Engine Patch Classification

### Upstreamable

- generic parser, renderer, or serializer improvements
- platform-independent performance work

### Local Compatibility

- narrow temporary patches needed for Hwping integration today

### Product-Only

- app UX
- Quick Look behavior
- Finder integration
- FFI boundaries

Product-only work must not land in `crates/rhwp/`.

## Consequences

- Upstream review should keep adapting shared-core correctness fixes into `crates/rhwp/`.
- Product work should continue growing outside the engine core.
- Future docs and contributor guidance should reference this decision instead of an old Hwping-only repo-sync plan file.
