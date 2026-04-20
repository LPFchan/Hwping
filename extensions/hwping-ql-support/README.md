# hwping-ql-support

This package holds the shared Quick Look support code for Hwping's preview and thumbnail surfaces.

It is intentionally new Hwping-owned code. The reverse-engineered Hancom tree was used only as a structural reference for bundle boundaries and extension responsibilities, not as source material.

## What belongs here

- FFI-backed document opening
- preview PDF generation
- first-page thumbnail rasterization
- shared error handling and metadata shaping

## Build

This package follows the same FFI boundary pattern as `apps/hwping-macos/ffi-smoke/`.
The concrete macOS extension wrappers will import this package later when the Xcode project scaffold lands.
