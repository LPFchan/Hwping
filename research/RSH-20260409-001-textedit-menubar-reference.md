# RSH-20260409-001: TextEdit Menu Bar Reference For Hwping

Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Status: completed
- Question: What menu-bar baseline should Hwping use for the first complete macOS reader app?
- Related ids: `DEC-20260409-004`

## Research Question

What menu-bar baseline should Hwping use for the first complete macOS reader app?

## Why This Belongs To This Repo

Hwping is building a native macOS document app. The reader needs a menu bar that feels standard on macOS while still reflecting Hwping's read-only v1 scope.

## Findings

- The standard top-level menu order for a document app is `App Name`, `File`, `Edit`, `Format`, `View`, `Window`, `Help`.
- The app-name menu is largely system-provided through `NSApplication`; the app normally only meaningfully customizes the settings window target.
- `File`, `Edit`, `View`, `Window`, and `Help` provide the main reader-relevant baseline for a native document app.
- TextEdit is a useful reference because it is a first-party macOS document app and follows conventional separator grouping, shortcut placement, and submenu structure.
- Hwping does not need to mirror TextEdit blindly. The reference is a baseline for what standard macOS behavior looks like, not a command list to copy wholesale.

### Key Reference Notes

#### Top-Level Order

```text
[App Name]  File  Edit  Format  View  Window  Help
```

#### Reader-Relevant Baseline Behaviors

- `Settings...` uses `Cmd-,`
- `Hide`, `Hide Others`, `Show All`, and `Quit` are system-provided
- `Open`, `Open Recent`, `Close`, `Page Setup`, and `Print` belong naturally in `File`
- `Undo`, `Redo`, `Copy`, `Select All`, and `Find` behavior in `Edit` should stay conventional
- `Window` and `Help` should follow standard macOS document-app expectations

#### Hwping-Specific Takeaway

Hwping v1 should preserve the standard macOS document-app feel while omitting editing-only surfaces that do not belong in a read-only reader. That makes the TextEdit baseline a reference point, while the actual Hwping menu shape remains a product decision.

## Promising Directions

- Use the TextEdit menu order as the first-pass baseline when shaping the macOS reader shell.
- Keep concrete Hwping menu commitments in `DEC-*` records so the research stays reusable instead of becoming policy.

## Dead Ends Or Rejected Paths

- Blind command-for-command copying from TextEdit without checking Hwping's read-only scope.
- Keeping native menu reference material only in transient notes or retired doc namespaces.

## Recommended Routing

- Use this memo as the reusable reference for future menu and shortcut work.
- Keep accepted Hwping menu decisions in `records/decisions/`, not in a standalone Hwping-specific doc tree.
