# hwping-macos

This directory is the future home of the native macOS shell.

Phase 2 is the eventual native AppKit/SwiftUI shell and stays outside the current session scope.

The phase-1 macOS companion surfaces now live outside this directory:

- `extensions/hwping-ql-preview/`
- `extensions/hwping-ql-thumbnail/`

Those companions use the same shared document boundary as the Chrome extension and Electron wrapper. This directory keeps the longer-term native shell direction plus `ffi-smoke/`, a Swift executable sample that links against `crates/hwping-ffi` and proves the Rust embedding boundary can open documents, read first-page info, and generate preview PDF output.
