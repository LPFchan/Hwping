# Hwping Compatibility Watchlist

Use this watchlist during every upstream intake review.

These surfaces need explicit scrutiny because they can break downstream compatibility, upgrade flow, or user-visible reader behavior even when the upstream diff looks routine.

| Surface | Why it is sensitive | Questions to ask every time |
| --- | --- | --- |
| `crates/rhwp/` parser, renderer, pagination, serializer, and export paths | Small engine changes can shift page count, preview PDF output, SVG output, or saved document semantics | Does this change parsed document meaning, layout height, page breaks, save output, or metadata extraction? |
| `crates/hwping-core/` facade API | The facade is the typed downstream contract used to keep app code out of the engine | Does this add, remove, rename, or reinterpret a facade type, field, or error? |
| `crates/hwping-ffi/` C ABI and ownership rules | ABI drift can break Swift integration or introduce lifetime bugs | Does this change exported names, structs, threading assumptions, or memory ownership rules? |
| `apps/hwping-macos/` document lifecycle and commands | Finder open, search, printing, zoom, and restore behavior are user-facing and regression-sensitive | Does this change document open, navigation, search, print, export, or state restoration behavior? |
| `extensions/` Quick Look preview and thumbnail outputs | System integration depends on stable bundle identity, supported types, and rendering assumptions | Does this change supported document types, preview generation, thumbnail generation, or extension identity? |
| Sample corpus and golden outputs | Rendering fixes can silently move page boundaries or preview output | Which sample files or golden outputs prove the change is correct in Hwping? |
| Removed upstream product surfaces | Reintroducing web, npm, browser-only, or VS Code distribution surfaces increases sync cost without serving current Hwping goals | Does this change bring back a removed upstream surface that Hwping currently treats as out of scope? |
| Intake artifact locations and standing notes | Lost or scattered reports make later sync work slower and more repetitive | Does this review leave durable knowledge in the canonical intake package so later reviews can reuse it? |

Update this watchlist when the same sensitive seam appears in more than one review cycle.