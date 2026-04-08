# Research

This directory stores curated research memos, not raw execution logs.

## Naming

Create one file per reusable exploration:

- `RSH-YYYYMMDD-NNN-short-title.md`

## When To Create One

Create an `RSH-*` memo when a session produces learning worth future retrieval.

Do not create one for:

- raw work trace that belongs in `records/agent-worklogs/`
- casual brainstorm fragments that still belong in `INBOX.md`

## Required Opening

Each memo should begin with:

- `# RSH-YYYYMMDD-NNN: <Short Research Title>`
- `Opened: YYYY-MM-DD HH-mm-ss KST`
- `Recorded by agent: <agent-id>`

## Default Shape

- Metadata
- Research question
- Why this belongs to this repo
- Findings
- Promising directions
- Dead ends or rejected paths
- Recommended routing

Use that section order by default unless the research genuinely needs a different structure.

## Canonical Example

```md
# RSH-20260409-001: TextEdit Menu Bar Reference For Hwping

Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Status: completed
- Question: What menu-bar baseline should Hwping use for the first complete macOS reader app?
- Related ids: DEC-20260409-004

## Research Question

What menu-bar baseline should Hwping use for the first complete macOS reader app?

## Why This Belongs To This Repo

Hwping is building a native macOS document app, so a reusable menu-bar baseline belongs in repo research rather than in transient chat notes.

## Findings

- TextEdit is a useful baseline for standard macOS document-app menu ordering and grouping.
- Hwping v1 should preserve native document-app expectations while staying read-only.

## Promising Directions

- Use TextEdit as a baseline when evaluating first-pass Hwping menu structure.
- Capture accepted menu decisions in `records/decisions/` instead of keeping them only in research.

## Dead Ends Or Rejected Paths

- Blind command-for-command copying from TextEdit without checking Hwping's read-only scope.

## Recommended Routing

- Keep this memo as reusable reference material.
- Move accepted product decisions into `DEC-*` records.
```
