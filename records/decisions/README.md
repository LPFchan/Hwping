# Decisions

This directory stores durable decision records.

## Naming

Create one file per meaningful decision:

- `DEC-YYYYMMDD-NNN-short-title.md`

## Decision Hygiene

- Decision records are append-only by new file.
- If a decision changes later, create a new `DEC-*` that supersedes the old one.
- Do not fold raw execution history into a decision record.

## Required Opening

Each decision file should begin with:

- `# DEC-YYYYMMDD-NNN: <Short Decision Title>`
- `Opened: YYYY-MM-DD HH-mm-ss KST`
- `Recorded by agent: <agent-id>`

## Default Shape

- Metadata
- Decision
- Context
- Options considered
- Rationale
- Consequences

Use that section order by default unless the decision genuinely needs a different structure.

## Canonical Example

```md
# DEC-20260409-001: Adopt Repo Template As Hwping Operating Model

Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Status: accepted
- Decision owner: Hwping operator
- Related ids: LOG-20260409-001

## Decision

Hwping adopts `LPFchan/repo-template` as its canonical repository operating model.

## Context

The repo already had durable technical notes and an upstream-review workflow, but it did not yet have one canonical home for project truth, current state, accepted future direction, decisions, and execution history.

## Options Considered

### Keep Selective Adoption

- Upside: less migration work
- Downside: durable truth and provenance stay fragmented

### Full Adoption And Migration

- Upside: makes routing, truth, and execution history explicit inside the repo
- Downside: requires contributor guidance and artifact migration

## Rationale

Full adoption was chosen because Hwping is a downstream fork with both upstream-sync cost and downstream product-specific decisions to preserve.

## Consequences

- Root truth now lives in `SPEC.md`, `STATUS.md`, and `PLANS.md`.
- Decisions, research, worklogs, and upstream-intake reviews use stable artifact IDs.
- `mydocs/` remains the deeper shared technical and manual layer instead of the truth layer.
```
