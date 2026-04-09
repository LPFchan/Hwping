# RSH-20260409-001: TextEdit Menu Bar Reference For Hwping

Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Status: completed
- Question: What does a canonical, well-populated macOS document-app menu bar look like, and how should Hwping use that baseline?
- Related ids: `DEC-20260409-004`
- Historical source: retired `mydocs/hwping/tech/textedit_menubar_reference.md`

## Research Question

What menu-bar baseline should Hwping use for the first complete macOS reader app?

## Conclusion

Use TextEdit as a reference for macOS document-app menu order, separator grouping, shortcuts, submenu behavior, toggle semantics, and system-provided items.

Do not copy TextEdit as Hwping's target command list. TextEdit is an editor; Hwping v1 is a read-only reader. Product commitments belong in `DEC-*` records and implementation plans.

## Baseline Top-Level Order

TextEdit uses the standard document-app order:

```text
[App Name]  File  Edit  Format  View  Window  Help
```

Hwping's accepted v1 menu decision is recorded separately in `DEC-20260409-004`. That decision intentionally omits the top-level `Format` menu for v1.

## TextEdit Reference Snapshot

This is the useful baseline snapshot from the retired reference. Treat it as evidence of native macOS convention, not as a Hwping specification.

### App Name Menu

The menu title is system-managed and named after the app.

| Item | Shortcut | Hwping relevance |
| --- | --- | --- |
| About TextEdit | | System-provided About panel baseline |
| Settings... | `Cmd-,` | Universal macOS settings shortcut; app wires it to preferences |
| Services | | System-provided submenu |
| Hide TextEdit | `Cmd-H` | System-provided |
| Hide Others | `Option-Cmd-H` | System-provided |
| Show All | | System-provided |
| Quit TextEdit | `Cmd-Q` | System-provided |

### File Menu

| Item | Shortcut | Hwping relevance |
| --- | --- | --- |
| New | `Cmd-N` | likely omitted or deferred for a read-only reader |
| Open... | `Cmd-O` | baseline open command |
| Open Recent | submenu | standard document-app behavior |
| Close | `Cmd-W` | standard document-window command |
| Save... | `Cmd-S` | editor-oriented; do not inherit blindly |
| Duplicate | `Shift-Cmd-S` | needs Hwping decision if exposed |
| Rename... | | needs Hwping decision if exposed |
| Move To... | | needs Hwping decision if exposed |
| Revert To | submenu | editor-oriented; do not inherit blindly |
| Import from iPhone | submenu | system/continuity item; likely not a reader priority |
| Export as PDF... | | relevant reader/export command |
| Share... | submenu | candidate native sharing integration |
| Show Properties | | relevant metadata/info pattern |
| Page Setup... | `Shift-Cmd-P` | standard print-related command |
| Print... | `Cmd-P` | v1 reader quality-bar command |

Open Recent baseline:

```text
[Recently opened file 1]
[Recently opened file 2]
[Recently opened file 3]
-------------------------
Clear Menu
```

Share baseline:

```text
Cloud Storage / iCloud Drive
AirDrop
Mail
Messages
Notes
Reminders
-------------------------
More...
```

### Edit Menu

| Item | Shortcut | Hwping relevance |
| --- | --- | --- |
| Undo | `Cmd-Z` | only if Hwping has undoable shell state |
| Redo | `Shift-Cmd-Z` | only if Hwping has undoable shell state |
| Cut | `Cmd-X` | editor-oriented; do not inherit blindly |
| Copy | `Cmd-C` | relevant for selected text or metadata |
| Paste | `Cmd-V` | editor-oriented; do not inherit blindly |
| Paste and Match Style | `Option-Shift-Cmd-V` | editor-oriented |
| Select All | `Cmd-A` | relevant if document text/page selection is supported |
| Find | submenu | highly relevant; use conventional shortcuts |
| Emoji & Symbols | `Control-Cmd-Space` | system text behavior; usually not app-specific |

Find submenu baseline:

```text
Find...                     Cmd-F
Find and Replace...         Option-Cmd-F
Find Next                   Cmd-G
Find Previous               Shift-Cmd-G
Use Selection for Find      Cmd-E
Jump to Selection           Cmd-J
```

TextEdit also exposes editing-related submenus such as Spelling and Grammar, Substitutions, Transformations, and Speech. Hwping should only inherit these if a future product decision says they help the read-only reader.

### Format Menu

TextEdit's `Format` menu contains font, rich/plain-text, wrapping, hyphenation, list, text alignment, ruler, ligature, baseline, character-shape, and writing-direction controls.

Hwping v1 intentionally does not have a top-level `Format` menu. Keep this research only as a reminder of what TextEdit means by authoring/formatting surface.

### View Menu

| Item | Shortcut | Hwping relevance |
| --- | --- | --- |
| Show Tab Bar | | standard document-window behavior when tabbing is enabled |
| Show All Tabs | | standard document-window behavior |
| Use Dark Background for Windows | | TextEdit-specific display option; do not inherit blindly |
| Actual Size | | relevant zoom command |
| Zoom In | `Cmd-+` | relevant zoom command |
| Zoom Out | `Cmd--` | relevant zoom command |
| Enter Full Screen | `Control-Cmd-F` | standard window/app behavior |

### Window Menu

| Item | Shortcut | Hwping relevance |
| --- | --- | --- |
| Move & Resize | submenu | system-provided tiling/arrangement behavior on newer macOS |
| Minimize | `Cmd-M` | standard window behavior |
| Zoom | | standard window behavior |
| Bring All to Front | | standard app behavior |
| open window list | | system/application window list baseline |

### Help Menu

| Item | Shortcut | Hwping relevance |
| --- | --- | --- |
| App Help | `Cmd-?` | every shipped app should have a help affordance |

## Design Patterns Worth Preserving

### Separator Grouping

TextEdit groups File-menu actions roughly as:

- document lifecycle: New, Open, Recent
- close/save/duplicate/rename/move/revert
- import/export/share
- metadata/properties
- page setup and print

### Shortcut Conventions

| Pattern | Typical use |
| --- | --- |
| `Cmd` + letter | primary command such as Open, Print, Copy, Find |
| `Shift-Cmd` + letter | primary variant such as Redo or previous result |
| `Option-Cmd` + letter | less common variant |
| `Option-Shift-Cmd` + letter | rare extended variant |
| `Control-Cmd` + letter | system-level-feeling command such as Full Screen |
| `Control-Cmd-Space` | Emoji & Symbols / character picker |

### Toggles And Choices

- Use checkmarks for independent boolean options.
- Use radio-style selection for mutually exclusive choices inside a group.
- Toggle the label itself for reversible mode changes such as Enter Full Screen / Exit Full Screen.

### Submenu Depth

TextEdit uses at most three levels: menu -> submenu -> sub-submenu.

Avoid deeper navigation unless a future Hwping decision explicitly accepts the usability cost.

### System-Provided Items

Do not re-implement standard app/window behavior by hand unless there is a recorded Hwping reason.

System-provided or usually system-owned baseline:

- About App
- Services submenu
- Hide App
- Hide Others
- Show All
- Quit App
- Emoji & Symbols
- Window -> Move & Resize tiling submenu
- app/window list population

## Hwping-Specific Takeaway

Hwping should feel like a normal macOS document app while staying honest about reader-only scope.

The reference is especially useful for:

- top-level order
- the boundary between system-provided and app-owned items
- standard shortcuts
- Find submenu shape
- zoom/fullscreen/window behavior
- File-menu grouping around open/export/print/properties

## Dead Ends Or Rejected Paths

- Blind command-for-command copying from TextEdit without checking Hwping's read-only scope.
- Keeping native menu reference material only in transient notes or retired doc namespaces.
- Treating the TextEdit `Format` menu as a v1 Hwping requirement.

## Recommended Routing

- Use this memo as reusable evidence during future menu and shortcut work.
- Keep accepted Hwping menu decisions in `records/decisions/`.
- Keep implementation tasks in `PLANS.md`, issues, or app-surface task branches instead of turning this research memo into a product spec.
