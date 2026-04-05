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

### `mydocs/tech/`

Keep this folder as a shared engine knowledge base.

Default policy:

- keep engine, format, layout, save, font, and rendering notes
- rewrite mixed documents if they contain both durable engine knowledge and stale product assumptions
- remove abandoned POC, competitor-analysis, or removed-surface documents

### `mydocs/troubleshootings/`

Keep this folder broadly intact.

Default policy:

- preserve concrete root-cause analysis
- preserve regression notes that help future debugging
- only remove entries that are tightly bound to deleted surfaces and have no engine value

### `mydocs/manual/`

Keep only durable operational guides.

Default policy:

- keep CLI debugging manuals
- keep onboarding and development environment guides only if they reflect the current Hwping repository
- remove or rewrite any manual that assumes WASM-first, `rhwp-studio`, Node.js dev servers, or browser-only workflows

### `mydocs/feedback/`

Keep selectively.

Default policy:

- keep engine structure, rendering, font, or parser feedback that still informs current work
- remove feedback that only applied to removed browser or editor surfaces

### `mydocs/report/`

Keep selectively.

Default policy:

- keep architecture reviews, research notes, and durable strategy documents
- remove one-off completion reports once their lasting knowledge has been extracted elsewhere

### `mydocs/orders/`

Treat this as disposable operational history, not as core product documentation.

Default policy:

- remove aggressively when repository size and clarity matter
- do not rebuild this folder as a long-term knowledge store

### `mydocs/plans/`

Treat this as a temporary working area, not as a durable archive.

Default policy:

- keep only currently active or still-relevant plans
- remove plans that depend on deleted surfaces
- remove large historical archives that no longer justify their maintenance cost

### `mydocs/working/`

Treat this similarly to `mydocs/plans/`.

Default policy:

- keep only active execution notes or documents with still-useful measurements
- remove historical stage reports after durable knowledge has been extracted

### `mydocs/eng/`

Do not treat the full English mirror as a permanent requirement.

Default policy:

- keep only the English documents that still earn their space
- prefer a smaller English core over full-tree duplication
- shrink mirrored `orders`, `plans`, and `working` first

## Current Classification

### A. Keep Actively

- core engine and format notes in `mydocs/tech/`
- the troubleshooting corpus in `mydocs/troubleshootings/`
- stable CLI and debugging manuals in `mydocs/manual/`

### B. Keep Selectively

- `mydocs/feedback/`
- `mydocs/report/`
- shared manuals that still need periodic updating
- the small active subset of `mydocs/plans/` and `mydocs/working/`

### C. Shrink Aggressively

- historical `orders`
- most plan archives
- most working-stage reports

### D. Remove By Default

- removed-surface documents
- abandoned POC documents with no current engine value
- full-tree mirror content that does not justify the maintenance and sync cost

## Executed Reduction

The current prune pass applied this policy in the shared documentation tree.

Executed changes:

- removed `mydocs/orders/`
- removed `mydocs/eng/orders/`
- removed archive subtrees under `mydocs/plans/`, `mydocs/eng/plans/`, `mydocs/working/`, and `mydocs/eng/working/`
- reduced `mydocs/plans/` and `mydocs/eng/plans/` to a narrow active subset
- reduced `mydocs/working/` and `mydocs/eng/working/` to a narrow active subset
- removed duplicated English mirror copies of the onboarding and development environment guides after the shared manuals were rewritten in English

## Ongoing Rule

When a task finishes, do not leave behind large planning or reporting residue by default.

Instead:

1. extract durable technical knowledge into `tech`, `troubleshootings`, or `manual`
2. remove or heavily reduce the temporary planning and working artifacts
3. keep the repository smaller and easier to sync with upstream