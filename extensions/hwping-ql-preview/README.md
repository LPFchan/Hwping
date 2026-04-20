# hwping-ql-preview

This directory is the future Quick Look Preview extension target.

The actual preview logic now lives in `../hwping-ql-support/` as new Hwping-owned code:

- FFI-backed document opening
- preview PDF generation
- shared snapshot shaping

The proprietary Hancom decomp tree was used only as a high-level reference for extension boundaries and bundle structure. No function bodies, parameter lists, or source shapes were copied.
