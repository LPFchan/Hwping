# DEC-20260409-004: Accept The Hwping v1 Menu Bar Baseline
Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Project: Hwping
- Project id: `hwping`
- Decision owner: Hwping operator
- Status: accepted direction
- Related ids: `RSH-20260409-001`, `DEC-20260409-003`

## Decision

Hwping v1 uses TextEdit as the baseline reference for a standard macOS document-app menu bar, with one confirmed top-level deviation:

- omit the top-level `Format` menu in v1 because Hwping is a read-only reader

The planned top-level order for v1 is therefore:

```text
[App Name]  File  Edit  View  Window  Help
```

## Context

Hwping needs a menu bar that feels conventional on macOS while reflecting a reader-only v1 scope. TextEdit provides a strong baseline for menu order, separator grouping, shortcut conventions, and the difference between system-provided and app-owned items.

## Rationale

- Matching standard macOS document-app expectations makes Hwping easier to learn.
- A read-only reader does not benefit from a top-level editing format surface in v1.
- Using a named baseline reference helps future menu work avoid accidental drift.

## Consequences

- `File`, `Edit`, `View`, `Window`, and `Help` should stay close to standard macOS document-app conventions.
- Future deliberate menu or shortcut deviations should be captured as new decision records instead of being buried in an ad hoc spec file.
- The baseline research reference now lives in `RSH-20260409-001`.

## Open Follow-Up Questions

These are accepted future design tasks, not resolved decisions yet:

- exact read-only `Edit` menu contents
- whether `Duplicate`, `Rename`, `Move To`, `Revert To`, or `Share` ship in v1
- where sidebar and page-navigation commands should surface beyond the baseline menus
