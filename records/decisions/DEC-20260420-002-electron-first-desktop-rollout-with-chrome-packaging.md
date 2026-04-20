# DEC-20260420-002: Electron-First Desktop Rollout With Chrome Packaging

Opened: 2026-04-20 19-20-07 KST
Recorded by agent: codex-20260420-electron-first-rollout

## Metadata

- Status: accepted
- Decision owner: Hwping operator
- Supersedes: `DEC-20260420-001`
- Related ids: `DEC-20260420-001`, `UPS-20260420-001`

## Decision

Hwping restores `rhwp-chrome/` as the active browser packaging lane, makes Electron the first desktop shell phase, and keeps the native macOS shell as phase 2.

Firefox is deferred unless the operator reopens it later.

## Context

The previous downstream direction treated Firefox as the first browser target and macOS as the only desktop product path. The operator now wants the browser extension shipped under Chrome packaging first, then a thin Electron desktop shell, and only after that the native macOS shell with the companion integrations carried over from the same shared boundary.

This keeps the shared engine and renderer boundary intact while changing which product surface gets first-class attention.

## Options Considered

### Keep The Firefox-First Browser MVP

- Upside: preserves the immediately previous browser-first plan
- Downside: keeps the wrong browser lane first for the current rollout and does not match the operator's Chrome-first preference

### Move Straight To Native macOS

- Upside: stays close to the earlier macOS-first fork direction
- Downside: delays shipping a browser lane and still asks for too much native shell work before the first desktop phase can ship

### Chrome Packaging, Then Electron, Then Native macOS

- Upside: gives Hwping a browser lane that matches the current operator preference, then a thin desktop shell that can reuse the same renderer, and finally the native macOS shell with the same boundary
- Downside: requires the repo truth docs and product boundaries to be updated together so the new direction stays legible

## Rationale

Chrome packaging is the correct browser lane for this rollout because it aligns with the operator's current ship target and keeps the browser surface simple.

Electron is the best phase 1 desktop shell because it can host the existing renderer with a thin preload bridge for file dialogs, recent documents, and menu actions without forcing a full native macOS frontend first.

The native macOS shell remains phase 2 so the companion file integration, Quick Look, Finder, and menu bar surfaces can be carried over once the Electron path proves out.

## Consequences

- `rhwp-chrome/` becomes the active browser packaging lane.
- `apps/hwping-electron/` becomes the phase 1 desktop shell.
- `apps/hwping-macos/` remains phase 2 for the native shell and companion integrations.
- `rhwp-firefox/` is deferred rather than treated as the active browser lane.
- `SPEC.md`, `STATUS.md`, `PLANS.md`, `README_EN.md`, and the local upstream-intake registers must reflect the Chrome/Electron/native-macOS sequence.
- Future upstream browser-extension review should adapt Chrome packaging first and defer Firefox-only surface work unless the operator reopens that scope.
