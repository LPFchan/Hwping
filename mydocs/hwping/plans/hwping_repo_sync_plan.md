# Hwping Repository Structure and Upstream Sync Plan

## Purpose

This document explains how to turn the current `rhwp`-based repository into a Hwping product repository without losing the ability to sync cleanly with upstream `rhwp`.

The central question is simple.

> How do we build Hwping without letting the fork drift into a permanent split from upstream?

The answer is to define clear boundaries, adopt a disciplined repository layout, and treat upstream sync as an ordinary part of the workflow rather than as cleanup work.

## Current State

The repository already serves several roles at once.

- the root Rust crate is the engine
- `rhwp-studio` is the web product
- `rhwp-vscode` is the VS Code extension
- the repository also contains samples, scripts, and extensive documentation

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
  crates/
    rhwp/                         # upstream-aligned engine
    hwping-core/                  # downstream Rust facade
    hwping-ffi/                   # Swift bridge
  apps/
    hwping-macos/                 # macOS app target
  extensions/
    hwping-ql-preview/            # Quick Look preview extension
    hwping-ql-thumbnail/          # Quick Look thumbnail extension
  rhwp-studio/                    # existing web product
  rhwp-vscode/                    # existing VS Code extension
  samples/
  tests/
    corpus/
    golden/
    integration/
  mydocs/
```

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

### Step 1. Convert the Root into a Workspace

- move the current root crate into `crates/rhwp`
- turn the root `Cargo.toml` into a workspace manifest
- fix CLI, test, and sample paths

Success criteria:

- `cargo build`
- `cargo test`
- the `rhwp` CLI still works

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
7. document the result and integrate

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
- sync result reports under `mydocs/report/` when needed

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
- independent evolution of the app, extensions, and automation features
- long-term product maintainability