# Shared `mydocs/` Classification For Hwping

## Purpose

This note classifies the shared documentation that lives outside `mydocs/hwping/` from the perspective of Hwping.

The goal is straightforward:

- keep documentation that still helps Hwping directly
- keep documentation that still has value after upstream syncs
- remove or shrink documentation that only existed for deleted web, npm, VS Code, or legacy browser surfaces

## Core Retention Model

The durable shared documentation core for Hwping is:

1. engine, format, and rendering knowledge
2. troubleshooting and regression notes
3. a small set of reusable debugging and onboarding manuals

The lowest-value material is:

1. daily work logs
2. step-by-step plans and completion reports for finished tasks
3. documents that assume removed web, npm, VS Code, or browser-only surfaces
4. large-scale English mirror trees that double repository size without adding enough product value

## Folder Policy

The shared documentation tree is now intentionally reduced to three shared roots plus the Hwping-specific area.

### `mydocs/tech/`

Keep this folder as the shared engine knowledge base.

Default policy:

- keep engine, format, layout, save, font, and rendering notes
- organize documents by technical domain rather than by task history
- remove product strategy, browser UI, TypeScript bridge, and removed-surface documents

### `mydocs/troubleshootings/`

Keep this folder as the durable bug-diagnosis corpus.

Default policy:

- preserve concrete root-cause analysis
- preserve regression notes that help future debugging
- group notes by parser, layout, rendering, and save behavior
- remove entries that are tightly bound to deleted browser-only surfaces

### `mydocs/manual/`

Keep only durable operational guides and stable references.

Default policy:

- keep CLI debugging manuals
- keep onboarding and development environment guides only if they reflect the current Hwping repository
- keep reference assets such as OWPML schema material
- remove process ideology and manuals tied to removed web or browser workflows

### Removed Shared Roots

The following top-level folders are intentionally removed and should not be rebuilt as permanent documentation areas.

- `mydocs/eng/`
- `mydocs/feedback/`
- `mydocs/report/`
- `mydocs/plans/`
- `mydocs/working/`
- `mydocs/orders/`

## Current Classification

### A. Keep Actively

- core engine and format notes in `mydocs/tech/`
- the troubleshooting corpus in `mydocs/troubleshootings/`
- stable CLI and debugging manuals in `mydocs/manual/`

### B. Keep Selectively

- shared manuals that still need periodic updating
- extracted research or troubleshooting notes that were promoted out of temporary task folders

### C. Shrink Aggressively

- mixed `tech/` documents that still carry upstream product baggage
- any new documentation that starts drifting back into task logs or mirror trees

### D. Remove By Default

- removed-surface documents
- abandoned POC documents with no current engine value
- mirror content that duplicates a canonical English source
- temporary reports, plans, and working logs once their durable knowledge has been extracted

## Executed Reduction

The current prune pass applied this policy in the shared documentation tree.

Executed changes:

- removed `mydocs/orders/`
- removed the full `mydocs/eng/` mirror tree
- removed top-level `mydocs/feedback/`, `mydocs/report/`, `mydocs/plans/`, and `mydocs/working/`
- removed archive leftovers that only existed as planning residue
- extracted a small durable subset of research and troubleshooting notes before deleting the temporary roots
- removed process and browser-product manuals that no longer belong in Hwping
- reorganized surviving shared docs into `manual/`, `tech/`, and `troubleshootings/` domain subfolders

## Ongoing Rule

When a task finishes, do not leave behind large planning or reporting residue by default.

Instead:

1. extract durable technical knowledge into `tech`, `troubleshootings`, or `manual`
2. remove the temporary planning and working artifacts instead of preserving them as standing folders
3. keep the repository smaller and easier to sync with upstream