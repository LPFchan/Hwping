# hwping-macos

This directory is the future home of the native macOS shell.

Phase 2 carries over the file integration, Quick Look, Finder, and menu bar companion surfaces on top of the same shared document boundary that the Chrome extension and Electron shell use.

M1 adds `ffi-smoke/`, a Swift executable sample that links against `crates/hwping-ffi` and proves the Rust embedding boundary can open documents, read first-page info, and generate preview PDF output.
