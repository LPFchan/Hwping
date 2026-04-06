# macOS Menu Bar Reference — TextEdit

> **Purpose:** Reference document for app developer agents showing a canonical, well-populated macOS menu bar structure. TextEdit is a first-party Apple app that follows the [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/menus) precisely. Use this as a baseline for what a well-formed macOS menu bar should look like.

---

## Menu Order

The standard macOS menu bar order is:

```
[App Name]  File  Edit  Format  View  Window  Help
```

> ⚠️ The **App Name** menu (e.g. "TextEdit") is always the first menu and its name is managed by macOS automatically. However, apps are responsible for populating its contents. See below.

---

## TextEdit *(App Name Menu)*

> This is the **first menu** in every macOS app and is always named after the app. macOS sets the menu title automatically — the app populates the items.

| Item | Shortcut | Notes |
|---|---|---|
| About TextEdit | | Opens the About panel (version, copyright). macOS provides this automatically. |
| *(separator)* | | |
| Settings… | ⌘, | Opens the app's preferences/settings window. ⌘, is the **universal macOS standard** for Settings — always use this shortcut. |
| Services | → | System-provided submenu. Apps get this automatically via NSApplication. |
| *(separator)* | | |
| Hide TextEdit | ⌘H | Hides all app windows. System-provided. |
| Hide Others | ⌥⌘H | Hides all other apps' windows. System-provided. |
| Show All | | Unhides all hidden apps. Grayed out when nothing is hidden. System-provided. |
| *(separator)* | | |
| Quit TextEdit | ⌘Q | Terminates the app. System-provided. |

> **All items in this menu are system-provided** via NSApplication — apps do not need to implement them manually. The only item apps typically customize is **Settings…** (to point to their own preferences window).

---

## File

| Item | Shortcut | Notes |
|---|---|---|
| New | ⌘N | |
| Open… | ⌘O | |
| Open Recent | → | Submenu. See below. |
| *(separator)* | | |
| Close | ⌘W | |
| Save… | ⌘S | |
| Duplicate | ⇧⌘S | |
| Rename… | | |
| Move To… | | |
| Revert To | → | Submenu |
| *(separator)* | | |
| Import from iPhone | → | Continuity Camera submenu |
| Export as PDF… | | |
| Share… | → | Submenu. See below. |
| *(separator)* | | |
| Show Properties | | |
| *(separator)* | | |
| Page Setup… | ⇧⌘P | |
| Print… | ⌘P | |

### File → Open Recent (submenu)
```
[Recently opened file 1]
[Recently opened file 2]
[Recently opened file 3]
─────────────────────────
Clear Menu
```

### File → Share (submenu)
```
Cloud Storage (iCloud Drive)
AirDrop
Mail
Messages
Notes
Reminders
─────────────────────────
More…
```

---

## Edit

| Item | Shortcut | Notes |
|---|---|---|
| Undo | ⌘Z | Label changes to reflect last action, e.g. "Undo Typing" |
| Redo | ⇧⌘Z | |
| *(separator)* | | |
| Cut | ⌘X | |
| Copy | ⌘C | |
| Paste | ⌘V | |
| Paste and Match Style | ⌥⇧⌘V | |
| *(separator)* | | |
| Select All | ⌘A | |
| Insert | → | Submenu for special insertions |
| *(separator)* | | |
| Find | → | Submenu. See below. |
| Spelling and Grammar | → | Submenu. See below. |
| Substitutions | → | Submenu. See below. |
| Transformations | → | Submenu. See below. |
| Speech | → | Submenu. See below. |
| *(separator)* | | |
| AutoFill | | |
| Emoji & Symbols | ⌃⌘Space | Opens the character picker |

### Edit → Find (submenu)
```
Find…                     ⌘F
Find and Replace…         ⌥⌘F
Find Next                 ⌘G
Find Previous             ⇧⌘G
Use Selection for Find    ⌘E
Jump to Selection         ⌘J
```

### Edit → Spelling and Grammar (submenu)
```
Show Spelling and Grammar    ⌘:
Check Document Now           ⌘;
─────────────────────────────────
[✓] Check Spelling While Typing
[ ] Check Grammar With Spelling
[ ] Correct Spelling Automatically
```
> These bottom three are toggleable checkmark items.

### Edit → Substitutions (submenu)
```
Show Substitutions
─────────────────────
[ ] Smart Copy/Paste
[✓] Smart Quotes
[✓] Smart Dashes
[✓] Smart Links
[ ] Data Detectors
[✓] Text Replacement
```
> Checkmark items — each toggles independently.

### Edit → Transformations (submenu)
```
Make Upper Case
Make Lower Case
Capitalize
```

### Edit → Speech (submenu)
```
Start Speaking
Stop Speaking
```

---

## Format

| Item | Shortcut | Notes |
|---|---|---|
| Font | → | Submenu. See below. |
| Text | → | Submenu. See below. |
| *(separator)* | | |
| Make Rich Text / Make Plain Text | ⌥⌘T | Toggles based on current document mode |
| *(separator)* | | |
| Wrap to Page / Wrap to Window | | Toggles based on current state |
| Allow Hyphenation | | Checkmark toggle |
| *(separator)* | | |
| List Style | → | Submenu for list formatting options |

### Format → Font (submenu)
| Item | Shortcut |
|---|---|
| Show Fonts | ⌘T |
| Bold | ⌘B |
| Italic | ⌘I |
| Underline | ⌘U |
| Strikethrough | |
| *(separator)* | |
| Bigger | ⌘+ |
| Smaller | ⌘- |
| *(separator)* | |
| Show Colors | ⇧⌘C |
| *(separator)* | |
| Copy Style | ⌥⌘C |
| Paste Style | ⌥⌘V |
| *(separator)* | |
| Ligatures | → |
| Baseline | → |
| Character Shape | → |

#### Format → Font → Ligatures (sub-submenu)
```
[ ] Use Default
[ ] Use None
[ ] Use All
```
> Radio-style selection — only one active at a time.

#### Format → Font → Baseline (sub-submenu)
```
[ ] Use Default
[ ] Superscript
[ ] Subscript
```
> Radio-style selection.

#### Format → Font → Character Shape (sub-submenu)
```
[ ] Traditional
[ ] Simple (Simplified)
[ ] JIS
[ ] Expert
[ ] Monospaced
[ ] Traditional Extended
[ ] Simple Extended
```
> Radio-style selection. Primarily relevant for CJK typography.

### Format → Text (submenu)
| Item | Shortcut |
|---|---|
| Align Left | ⌘{ |
| Center | ⌘\| |
| Align Right | ⌘} |
| Justify | |
| *(separator)* | |
| Writing Direction | → |
| *(separator)* | |
| Show Ruler | |

#### Format → Text → Writing Direction (sub-submenu)
```
Paragraph:
  ● Default
  ○ Right to Left
  ○ Left to Right
─────────────────
Character:
  ● Default
  ○ Right to Left
  ○ Left to Right
```
> Two grouped radio sections — Paragraph direction and Character direction are set independently.

---

## View

| Item | Shortcut | Notes |
|---|---|---|
| Show Tab Bar | | Toggles to "Hide Tab Bar" when visible |
| Show All Tabs | | |
| *(separator)* | | |
| Use Dark Background for Windows | | Checkmark toggle |
| *(separator)* | | |
| Actual Size | | |
| Zoom In | ⌘+ | |
| Zoom Out | ⌘- | |
| *(separator)* | | |
| Enter Full Screen | ⌃⌘F | Toggles to "Exit Full Screen" |

---

## Window

| Item | Shortcut | Notes |
|---|---|---|
| Move & Resize | → | System-provided tiling/arrangement submenu |
| *(separator)* | | |
| Minimize | ⌘M | |
| Zoom | | |
| *(separator)* | | |
| Bring All to Front | | |
| *(separator)* | | |
| *[Open window list]* | | Each open document window listed here |

### Window → Move & Resize (submenu)
> This is a **system-provided submenu** populated by macOS for window tiling (Stage Manager, tiled layouts, etc.). Apps get this for free when they opt in to standard NSWindow behavior.

```
Fill
Center
Front Tile
Back Tile (if applicable)
Left / Right / Top / Bottom halves
Arrange in Grid
─────────────────────────
More…
```

---

## Help

| Item | Shortcut | Notes |
|---|---|---|
| *[App Name]* Help | ⌘? | Opens app's built-in help documentation |

> The Help menu should always have at least one item — the app's own help book. macOS provides the ⌘? shortcut system-wide.

---

## Design Patterns & Notes for Agent Reference

### Separator usage
Separators group related actions. Common groupings in File:
- Document lifecycle (New / Open / Recent)
- Save operations (Close / Save / Duplicate / Rename / Move / Revert)
- Import/Export
- Metadata (Properties)
- Print

### Keyboard shortcut conventions
| Modifier pattern | Typical use |
|---|---|
| ⌘ + letter | Primary action (Save, Open, Copy…) |
| ⇧⌘ + letter | Variant of primary (Save As / Duplicate, Redo…) |
| ⌥⌘ + letter | Less frequent variant (Paste Style, Close All…) |
| ⌥⇧⌘ + letter | Rare extended variant |
| ⌃⌘ + letter | System-level feel (Full Screen) |
| ⌃⌘Space | Emoji picker (system standard) |

### Toggleable items
- Use **checkmarks** (✓) for independent boolean options (e.g. Smart Quotes, Check Spelling)
- Use **radio-style** (filled circle ●) for mutually exclusive choices within a group (e.g. Baseline, Writing Direction)
- Toggle the **label itself** for mode switches when the action is destructive or reversible (e.g. "Make Rich Text" ↔ "Make Plain Text", "Enter Full Screen" ↔ "Exit Full Screen")

### Submenu depth
TextEdit uses **at most 3 levels** of nesting (menu → submenu → sub-submenu). Avoid going deeper — it degrades usability significantly.

### System-provided menus / items
The following are provided by macOS automatically and apps should **not** re-implement them:

| Item | Source |
|---|---|
| About *AppName* | NSApplication |
| Services submenu | NSApplication |
| Hide *AppName* (⌘H) | NSApplication |
| Hide Others (⌥⌘H) | NSApplication |
| Show All | NSApplication |
| Quit *AppName* (⌘Q) | NSApplication |
| Emoji & Symbols (⌃⌘Space) | NSTextView / system |
| Window → Move & Resize tiling submenu | macOS 15+ / NSWindow |
| Import from iPhone (Continuity Camera) | NSApplication |

The app is only responsible for **Settings…** (⌘,) in the App Name menu — wiring it up to open the preferences window.
