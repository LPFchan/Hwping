# HwpingFFISmoke

This Swift executable target is the M1 smoke sample for the Rust FFI boundary.

Build the Rust static library first:

```bash
cargo build -p hwping-ffi
```

Then build and run the Swift sample from this directory:

```bash
swift run HwpingFFISmoke ../../../samples/re-01-hangul-only.hwp ../../../output/ffi-smoke-preview.pdf
```

The sample opens the document through the C ABI, reads normalized document metadata, reads first-page size information, and writes a preview PDF.