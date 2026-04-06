# Hwping Repository Structure and Upstream Sync Plan

## Status

As of 2026-04-05, M0 boundary setup is substantially in place.

- the repository root is a Cargo workspace
- the upstream-aligned engine lives in `crates/rhwp`
- placeholder `crates/hwping-core` and `crates/hwping-ffi` crates exist
- placeholder `apps/hwping-macos` and Quick Look extension directories exist

The facade API, FFI design, and real app or extension targets described below are still future work.

## Purpose

This document explains how to turn the current `rhwp`-based repository into a Hwping product repository without losing the ability to sync cleanly with upstream `rhwp`.

The operating assumption in this document is that Hwping is a downstream fork and `rhwp` remains an upstream repository outside Hwping control. That means this plan is about how the Hwping fork is organized, pruned, and maintained while continuing to track upstream changes. It is not a plan to restructure the upstream `rhwp` repository itself.

The central question is simple.

> How do we build Hwping without letting the fork drift into a permanent split from upstream?

The answer is to define clear boundaries, adopt a disciplined repository layout, and treat upstream sync as an ordinary part of the workflow rather than as cleanup work.

That boundary is not only about where new code goes. It is also about what does not remain in the Hwping repository. If a surface does not help build, test, package, or ship Hwping, it should not stay a first-class part of the main tree.

## Previous State

The repository already serves several roles at once.

- the root Rust crate is the engine
- `rhwp-studio` is the web product
- `rhwp-vscode` is the VS Code extension
- the repository also contains samples, scripts, and extensive documentation
- GitHub Actions still publishes the web demo and npm package
- `web/` still exists as a legacy pre-`rhwp-studio` surface
- root documentation still presents demo, npm, and VS Code distribution as primary outcomes

In practice, this is already a multi-product workspace. Structurally, though, the engine still dominates the root.

If Hwping is added directly into that structure without stronger separation, several problems follow.

- macOS product code starts leaking into engine code
- upstream merges become harder and noisier
- Hwping-only concerns such as Quick Look, App Intents, and Finder integration start to look like generic engine work
- it becomes harder to tell which engine changes are upstreamable and which are strictly local product work

## Target Layout

```text
/
  Cargo.toml                      # workspace root
  .github/
    workflows/
      ci.yml                      # engine + Hwping validation only
  crates/
    rhwp/                         # upstream-aligned engine
    hwping-core/                  # downstream Rust facade
    hwping-ffi/                   # Swift bridge
  apps/
    hwping-macos/                 # macOS app target
  extensions/
    hwping-ql-preview/            # Quick Look preview extension
    hwping-ql-thumbnail/          # Quick Look thumbnail extension
  samples/
  tests/
    corpus/
    golden/
    integration/
  mydocs/
  scripts/
```

Not part of the lean target layout:

- `rhwp-studio/`
- `rhwp-vscode/`
- `npm/`
- `web/`
- `typescript/`
- GitHub Pages deployment
- npm publishing workflow

Because Hwping is a downstream fork, the default action for those surfaces is clean removal from the Hwping branch once local dependencies are unwound. Their upstream history already exists in `rhwp`, so Hwping does not need to preserve them just for historical completeness. The only exception is downstream-only work that Hwping still intends to reuse.

## Lean Repository Rule

The main Hwping repository should contain only the following.

- the upstream-aligned engine
- downstream crates needed to present a stable Hwping-facing API
- Apple-platform app and extension code needed to ship Hwping
- tests, samples, scripts, and documentation required to validate and maintain those layers

The following are out of scope for the lean repository.

- web demo hosting
- npm package distribution for web embedding
- VS Code extension distribution
- legacy browser-only tooling kept only for historical reasons

This rule matters because product surfaces that do not belong to Hwping still create merge noise in documentation, workflows, packaging, and release procedures even when they do not touch the engine itself.

History preservation is therefore not a default goal here. For code that already belongs to upstream `rhwp`, upstream is the history source. Hwping should optimize for a smaller, cheaper-to-sync tree rather than keeping redundant product surfaces around.

## Pruning Inventory

### Remove Early

- `web/` — legacy pre-`rhwp-studio` surface; should not survive a lean Hwping migration
- `typescript/rhwp.d.ts` — remove or move into documentation if it is kept only as reference material

### Remove After Dependency Shutdown

- `rhwp-studio/` — active web product, but not required to build Hwping; remove from Hwping once workflow and doc coupling is gone
- `rhwp-vscode/` — active VS Code product, but not required to build Hwping; remove from Hwping once release references are gone
- `npm/` — packaging layer for web distribution, not part of Hwping delivery; remove with the publish pipeline
- `.github/workflows/deploy-pages.yml` — GitHub Pages demo deployment
- `.github/workflows/npm-publish.yml` — npm publishing pipeline

### Refactor Alongside Pruning

- `.github/workflows/ci.yml` — keep only the checks that validate the engine and Hwping deliverables
- `README.md` and `README_EN.md` — stop advertising Pages, npm, and VS Code as the default story
- `CONTRIBUTING.md` — rewrite setup and contribution paths around engine and Hwping only
- release and packaging scripts under `scripts/` — keep sync tooling, remove web-only release helpers

## Boundary Rules

### 1. Upstream-Aligned Area

Scope:

- `crates/rhwp`

What belongs here:

- parser accuracy improvements
- renderer accuracy improvements
- serializer quality improvements
- broader format support
- platform-independent performance work

What does not belong here:

- AppKit, SwiftUI, or Quick Look dependencies
- macOS menu, shortcut, and window-management code
- Finder integration logic
- Shortcuts or App Intents code

### 2. Downstream Product Area

Scope:

- `crates/hwping-core`
- `crates/hwping-ffi`
- `apps/hwping-macos`
- `extensions/*`

What belongs here:

- product-facing facades
- FFI boundaries
- Apple platform integration
- app UX and command routing
- Quick Look and Finder integration

## Branch Strategy

Recommended branches:

- `upstream-main`: mirror branch that tracks upstream
- `main`: Hwping stable branch
- `devel`: integration branch
- `local/taskNNN`: per-task working branches

Recommended remotes:

- `origin`: the Hwping fork
- `upstream`: the original `rhwp`

Ground rules:

- do not develop directly on upstream tracking branches
- keep `upstream-main` as close to fast-forward-only as possible
- do product development on `main` and `devel`
- prune only inside the Hwping fork; upstream `rhwp` remains both the sync source and the history source for removed upstream surfaces

## Engine Patch Classification

Every change under `crates/rhwp` should fall into one of the following categories.

### A. Upstreamable

Definition:

- generic parser, renderer, or serializer improvements
- work that remains valuable even without Hwping

Handling:

- keep it small and isolated
- do not mix it with Hwping product code
- preserve the option to submit it upstream

### B. Local Compatibility

Definition:

- changes needed for Hwping integration today, but not yet expressed as a clean generic API

Handling:

- keep the scope narrow
- document why the patch is temporary
- maintain a path to replace it with a facade-level solution or an upstreamable change

### C. Product-Only

Definition:

- code that exists only for the Hwping app or its extensions

Handling:

- never place it under `crates/rhwp`
- keep it in downstream layers only

## Recommended Migration Sequence

### Step 0. Prune or Isolate Non-Hwping Surfaces

- remove `web/`
- remove `typescript/rhwp.d.ts` unless it is intentionally kept as documentation material
- remove `rhwp-studio/`, `rhwp-vscode/`, and `npm/` from Hwping after their fork-local workflow, script, and documentation dependencies are removed
- remove GitHub Pages and npm publishing from the mainline workflow set
- rewrite root documentation so the repository no longer presents itself as a web demo and VS Code distribution bundle

Success criteria:

- a default checkout contains only code required to build, test, or ship Hwping
- root CI validates engine and Hwping deliverables only
- the repository narrative matches the actual product boundary

### Step 1. Convert the Root into a Workspace

- move the current root crate into `crates/rhwp`
- turn the root `Cargo.toml` into a workspace manifest
- fix CLI, test, and sample paths

Success criteria:

- `cargo build`
- `cargo test`
- the `rhwp` CLI still works

Current status:

- completed on 2026-04-05

### Step 2. Split Out the Facade Crate

- create `crates/hwping-core`
- expose only the narrow API the app actually needs
- define the error model and rendering options

Success criteria:

- facade-level integration tests work without the app

### Step 3. Add the FFI Boundary

- create `crates/hwping-ffi`
- define a stable interface for Swift
- lock down serialization and memory-lifetime rules for exchanged data

Success criteria:

- a Swift sample target can open a document, read page count, and generate preview PDF output

### Step 4. Add the App and Extensions

- `apps/hwping-macos`
- `extensions/hwping-ql-preview`
- `extensions/hwping-ql-thumbnail`

Success criteria:

- the app and both extensions use the same facade path

## Upstream Sync Procedure

Recommended cadence:

- at least once per month
- once per week during periods of heavy upstream engine change

Recommended sequence:

1. fetch `upstream`
2. fast-forward `upstream-main`
3. merge or rebase `upstream-main` into `devel`
4. resolve `crates/rhwp` conflicts first
5. review facade and FFI impact
6. run regression tests
7. record the decision in [upstream-intake/](../../../upstream-intake/README.md)
8. integrate the approved result

## Principles for Keeping Sync Cheap

- do not put product code in files that are likely to conflict with upstream
- absorb public API expansion through a separate facade where possible
- do not scatter `cfg(target_os = "macos")` branches throughout the engine
- do large file moves once at the beginning, not repeatedly over time

## Recommended CI Pipelines

### Engine Pipeline

- `cargo build`
- `cargo test`
- selected sample rendering smoke tests
- PDF export smoke tests

### Product Pipeline

- build the macOS app
- build the Quick Look extensions
- run FFI smoke tests
- test opening sample `.hwp` files

Not part of the lean Hwping CI surface:

- GitHub Pages deployment
- npm package publishing
- VS Code Marketplace packaging

### Sync Verification Pipeline

- report the diff size in `crates/rhwp` relative to `upstream-main`
- print the local compatibility patch inventory
- report golden-output diffs

## Test Asset Strategy

### Corpus

- select representative documents from `samples/`
- include tables, images, footnotes, headers, formulas, large files, and damaged files

### Golden Outputs

- document metadata
- page count
- first-page thumbnail
- preview PDF generation result
- baseline text extraction result

### macOS Integration Tests

- open from Finder
- Quick Look Preview
- Quick Look Thumbnail
- enter the print panel
- export PDF

## Documentation Rules

Required documents:

- upstream patch inventory
- rationale for local compatibility patches
- engine public-surface change log
- sync execution log

Recommended locations:

- structural and architecture docs under `mydocs/tech/`
- phase and execution plans under `mydocs/plans/`
- upstream intake records and operator briefs under `upstream-intake/reports/`

## Things Not to Do

- do not expose engine internals casually just because the Hwping UI wants them
- do not inject AppKit dependencies into parser or renderer internals for convenience
- do not add Finder-specific branches to the engine core just to optimize Quick Look
- do not stop tracking upstream merely because syncing gets inconvenient

## Success Criteria

The repository structure is working if all of the following remain true.

1. most merge conflicts during upstream sync are confined to `crates/rhwp`
2. the macOS app and both Quick Look extensions use the same facade
3. `crates/rhwp` still builds independently even if Hwping product code is removed
4. upstreamable patches can be extracted and submitted separately
5. adding product features does not sharply increase the cost of upstream tracking

## Summary

Hwping should not be treated as just another fork. It should be treated as a macOS product layer built on top of `rhwp` as its engine.

If the repository structure does not reflect that rule, every new macOS integration point makes upstream sync harder.

If the boundary is established early, the project keeps all of the following.

- regular upstream sync
- independent evolution of the app and Apple platform extensions
- the option to preserve web and VS Code products outside the main Hwping repository
- long-term product maintainability