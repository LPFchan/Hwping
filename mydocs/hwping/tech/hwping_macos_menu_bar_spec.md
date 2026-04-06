# Hwping macOS Menu Bar Specification

## Purpose

This document defines the intended Hwping macOS menu bar for the reader app and serves as the explicit deviation log from [TextEdit menu bar reference](textedit_menubar_reference.md).

Use this document for two things:

- record the Hwping target menu bar structure
- document every intentional deviation from the TextEdit baseline as a product decision

## Baseline Reference

The baseline reference is [TextEdit menu bar reference](textedit_menubar_reference.md).

That reference remains the canonical example of a well-formed macOS document-app menu bar for:

- top-level menu ordering
- separator grouping
- shortcut conventions
- submenu depth
- distinction between system-provided and app-owned items

## Hwping v1 Top-Level Menu Plan

The planned Hwping v1 top-level menu order is:

```text
[App Name]  File  Edit  View  Window  Help
```

## Confirmed Deviations From TextEdit Baseline

### 1. Omit the top-level Format menu in v1

TextEdit baseline:

```text
[App Name]  File  Edit  Format  View  Window  Help
```

Hwping v1 plan:

```text
[App Name]  File  Edit  View  Window  Help
```

Reason:

- Hwping v1 is a read-only document reader, not an editor
- the TextEdit Format menu is primarily for editing and authoring commands that do not belong in the v1 reader surface

Constraint:

- omitting Format does not permit arbitrary menu drift elsewhere
- remaining menus should still follow standard macOS document-app conventions

## Deviation Log Rules

Add a new entry here whenever Hwping intentionally differs from the TextEdit baseline.

Each deviation entry should include:

- affected menu or command
- baseline behavior in TextEdit
- Hwping behavior
- reason for the deviation
- whether the deviation is intended for v1 only or permanent

## Open Items

The following areas still need explicit Hwping decisions and must be recorded here once settled:

- exact Edit menu contents for a read-only reader
- whether any File menu items such as Duplicate, Rename, Move To, Revert To, or Share are exposed in v1
- whether a sidebar toggle appears only in View or also in the toolbar/command system
- whether page navigation commands live only in View or also receive additional menu placement