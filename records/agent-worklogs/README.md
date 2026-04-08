# Agent Worklogs

This directory stores execution history for runs, sessions, agents, and subagents.

## Naming

Create one file per run or workstream:

- `LOG-YYYYMMDD-NNN-short-title.md`

## Worklog Hygiene

- Worklogs are append-only.
- If a correction is needed, append a new entry rather than rewriting old history.
- Do not turn worklogs into decision records or truth docs.

## Required Opening

Each worklog should begin with:

- `# LOG-YYYYMMDD-NNN: <Short Run Or Task Title>`
- `Opened: YYYY-MM-DD HH-mm-ss KST`
- `Recorded by agent: <agent-id>`

## Default Shape

- Metadata
- Task
- Scope
- Timestamped entries with actions, files touched, checks run, outputs, blockers, and next steps

Use that structure by default so worklogs stay scan-friendly and comparable across runs.

## Canonical Example

```md
# LOG-20260409-001: Repo Template Migration Bootstrap

Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Run type: worker
- Goal: bootstrap full repo-template adoption in Hwping
- Related ids: DEC-20260409-001

## Task

Implement the full `LPFchan/repo-template` operating model in the Hwping repository.

## Scope

- In scope: root truth docs, provenance directories, contributor guidance, upstream-intake normalization
- Out of scope: engine or app code changes

## Entry 2026-04-09 05-29-07 KST

- Action: audited the repo and scaffold before starting the migration
- Files touched: none
- Checks run: repository tree inspection
- Output: confirmed which root surfaces and provenance directories were still missing
- Blockers: none
- Next: add the root truth stack and seed the first migration artifacts
```
