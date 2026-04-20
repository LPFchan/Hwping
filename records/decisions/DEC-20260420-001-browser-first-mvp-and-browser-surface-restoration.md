# DEC-20260420-001: Adopt Browser-First MVP And Restore Firefox Extension Surface

Opened: 2026-04-20 18-30-50 KST
Recorded by agent: codex-20260420-browser-first-mvp

## Metadata

- Status: accepted
- Decision owner: Hwping operator
- Related ids: `DEC-20260409-003`, `DEC-20260409-005`, `UPS-20260420-001`

## Decision

Hwping restores `rhwp-firefox/` as a first-class product surface and uses a browser-first MVP.

The first ship target is the Firefox extension surface. The macOS file-extension, Quick Look, Finder, and menu bar integrations remain companion MVP surfaces, not the primary first step.

## Context

The previous Hwping direction optimized for a macOS-first reader boundary and treated browser-only surfaces as out of scope. The operator now wants to ship sooner by restoring the browser extension module and using macOS integrations as the minimum companion set instead of building the full native macOS frontend first.

This keeps the shared engine boundary intact while changing which product surface gets first-class attention.

## Options Considered

### Keep The MacOS-First Surface Plan

- Upside: preserves the prior product plan and keeps the focus on native macOS surfaces
- Downside: delays the first user-facing ship target and keeps more of the product surface unfinished

### Restore The Browser-First MVP

- Upside: gives Hwping a first-class surface sooner and reduces the need to build the entire macOS frontend first
- Downside: requires the repo truth docs and product boundaries to be updated together so the new direction stays legible

## Rationale

Browser-first is the better MVP path because it gives Hwping a concrete ship target sooner while still keeping the shared engine separate from product code. The browser extension can validate the core document workflow, and the macOS integrations can follow as companion surfaces that reuse the same engine outputs and boundaries.

The change does not reintroduce web demo, npm, or VS Code distribution surfaces. It only restores the browser extension product surface that the operator now wants to ship.

## Consequences

- `rhwp-firefox/` returns to the main tree as a first-class product surface.
- `SPEC.md`, `STATUS.md`, and `PLANS.md` now describe Hwping as browser-first rather than macOS-first.
- `upstream-intake/known-local-overrides.md` should treat browser-extension work as in-scope instead of pruning it.
- Future upstream reviews should accept or adapt browser-extension changes rather than declining them as browser-only noise.
- Unrelated browser ecosystem surfaces such as web demo hosting, npm packaging, and VS Code distribution remain out of scope unless the operator changes that again.
