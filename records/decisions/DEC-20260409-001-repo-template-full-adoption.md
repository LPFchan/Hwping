# DEC-20260409-001: Adopt Repo Template As Hwping Operating Model
Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Project: Hwping
- Project id: `hwping`
- Decision owner: Hwping operator
- Status: accepted
- Related ids: `LOG-20260409-001`

## Decision

Hwping adopts `LPFchan/repo-template` as its canonical repository operating model.

That adoption includes:

- root `SPEC.md`, `STATUS.md`, `PLANS.md`, and `INBOX.md`
- append-only `research/`, `records/decisions/`, and `records/agent-worklogs/`
- stable artifact IDs using `IBX-*`, `RSH-*`, `DEC-*`, `LOG-*`, and `UPS-*`
- commit provenance trailers on new commits
- `upstream-intake/` as the recurring upstream-review subsystem inside the operating model

`mydocs/` remains in place as the deeper technical, troubleshooting, and manual layer that supports the root truth docs.

## Context

Hwping had already adopted the upstream-intake package shape and had strong documentation under `mydocs/`, but it did not yet have the full root truth stack or the append-only provenance surfaces from repo-template.

That left the repository with useful detail but no single canonical home for:

- what Hwping is supposed to be
- what is true right now
- what future direction is accepted
- what was decided and why
- what actually happened during execution

As the fork continues to grow, that gap would make future sync work and product work harder to reason about.

## Options Considered

### Option 1: Keep Selective Adoption

Preserve only `upstream-intake/` and continue relying on `mydocs/` for most durable context.

### Option 2: Add The Root Truth Docs Only

Install `SPEC.md`, `STATUS.md`, `PLANS.md`, and `INBOX.md`, but defer stable IDs, decisions, worklogs, and commit provenance.

### Option 3: Full Adoption And Migration

Install the full operating model, seed the first decision and worklog artifacts, and normalize the upstream-intake package to the same provenance conventions.

## Rationale

Option 3 was chosen because Hwping is already a fork with a real upstream-maintenance burden and a growing downstream product boundary. The repo now needs more than detailed technical notes; it also needs durable top-level truth, provenance, and routing rules.

Selective adoption solved only the upstream-review part of the problem. Full adoption makes the repository itself explain:

- project truth
- current state
- accepted direction
- durable decisions
- execution history

Keeping `mydocs/` as the deep-detail layer preserves the work already invested in architecture, troubleshooting, and manuals without forcing the root truth docs to become noisy.

## Consequences

- Root `SPEC.md`, `STATUS.md`, and `PLANS.md` are now the authoritative summary surfaces for project truth, current state, and accepted future direction.
- `INBOX.md`, `research/`, `records/decisions/`, and `records/agent-worklogs/` now exist as canonical routing and provenance layers.
- `upstream-intake/` remains canonical, but its reports and templates should follow `UPS-*` naming and provenance metadata.
- New commits should carry `project:`, `agent:`, `role:`, and `artifacts:` trailers.
- `mydocs/` remains important, but it no longer acts as the only durable home for operational truth and decision history.
