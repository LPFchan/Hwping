# Hwping Spec

This file is the canonical statement of what Hwping is supposed to be.

## Identity

- Project: Hwping
- Canonical repo: `https://github.com/LPFchan/Hwping`
- Project id: `hwping`
- Operator: `LPFchan`
- Last updated: `2026-04-09`
- Related decisions: `DEC-20260409-001`

## Product Thesis

Hwping is a macOS-focused downstream fork and product workspace built on top of upstream `rhwp`. It exists to ship a native HWP reader stack for Apple platforms while keeping the shared HWP and HWPX engine as upstream-aligned and syncable as possible.

## Primary User And Context

- Primary operator: Hwping maintainer and collaborators
- Primary environment: a Cargo workspace with downstream Rust, FFI, and Apple-platform targets
- Primary problem being solved: deliver reliable HWP and HWPX reading workflows on macOS without letting the fork drift into an unsyncable multi-product repository
- Why this matters: reading correctness, product focus, and upstream sync cost all depend on keeping shared engine work and Apple-platform product work sharply separated

## Primary Workspace Object

The primary user-facing object is an HWP or HWPX document rendered through an upstream-aligned engine and delivered through native macOS surfaces.

## Canonical Interaction Model

1. A user opens an HWP or HWPX document from the app, Finder, or a Quick Look surface.
2. Hwping parses and renders the document through `crates/rhwp/`.
3. Downstream facade and FFI layers expose metadata, page data, and rendered output to Apple-platform callers.
4. The app or extension presents reading, preview, search, export, and system integration workflows.
5. Maintainers preserve shared-core correctness and review upstream changes through `upstream-intake/`.

## Core Capabilities

- Capability: upstream-aligned HWP and HWPX parsing and rendering
  - Why it exists: Hwping needs accurate document understanding and output while staying cheap to sync with upstream `rhwp`
  - What must remain true: shared-core fixes should stay upstreamable or at least upstream-shaped unless a concrete Hwping-only reason exists
- Capability: downstream macOS product boundary
  - Why it exists: Hwping needs app, FFI, Quick Look, and Apple integration without contaminating the engine core
  - What must remain true: Apple-platform behavior stays outside `crates/rhwp/`
- Capability: disciplined repo operations and upstream intake
  - Why it exists: a downstream fork needs explicit truth, plans, decisions, worklogs, and recurring upstream review
  - What must remain true: root truth docs, provenance records, and `upstream-intake/` remain canonical

## Invariants

- `crates/rhwp/` is the upstream-aligned engine area.
- Apple-platform code lives in downstream layers such as `crates/hwping-core/`, `crates/hwping-ffi/`, `apps/`, and `extensions/`.
- Root `SPEC.md`, `STATUS.md`, and `PLANS.md` hold canonical project truth, current state, and accepted future direction.
- `upstream-intake/` is the canonical recurring upstream-review module.
- `mydocs/` stores shared technical, troubleshooting, and manual material that supports but does not replace the root truth docs.
- Hwping-specific accepted direction and architecture decisions live in root docs and `DEC-*` records, not in a separate `mydocs/hwping/` subtree.

## Non-Goals

- web demo hosting
- npm package distribution for old web or editor surfaces
- VS Code extension distribution
- legacy browser-only infrastructure

## Main Surfaces

- Surface: `crates/rhwp/`
  - Purpose: upstream-aligned parser, model, renderer, serializer, and CLI engine
  - Notes: treat engine changes as upstreamable by default
- Surface: `crates/hwping-core/`, `crates/hwping-ffi/`, `apps/`, and `extensions/`
  - Purpose: downstream product and Apple-platform integration surfaces
  - Notes: keep these boundaries clean and product-owned
- Surface: `SPEC.md`, `STATUS.md`, `PLANS.md`, `INBOX.md`, `research/`, `records/`, and `upstream-intake/`
  - Purpose: canonical repo operating surfaces
  - Notes: keep truth, intake, research, decisions, logs, and upstream review distinct
- Surface: `mydocs/`
  - Purpose: shared technical notes, troubleshooting references, and manuals
  - Notes: use these docs for depth, not as a substitute for root truth docs or decision records

## Success Criteria

- Hwping ships a native macOS reader stack without reabsorbing removed upstream product surfaces.
- Shared engine work remains cheap to sync with upstream `rhwp`.
- Maintainers can answer what Hwping is, what is true now, what is accepted next, what was decided, and what happened by reading the repo itself.
