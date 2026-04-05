# Hwping Docs

This directory is reserved for Hwping-specific product documentation.

Use `mydocs/hwping/` for documents that only make sense in the context of Hwping as a macOS product: the app itself, Quick Look support, Finder integration, Shortcuts support, packaging, and product architecture.

Do not use this directory for general engine documentation. If a document is really about the `rhwp` engine, shared rendering behavior, file-format analysis, or work that could realistically go upstream, it belongs in the shared `mydocs/` area instead.

## Directory Layout

- `plans/` - product plans, milestones, and repository operating plans
- `tech/` - architecture notes, macOS integration design, and Hwping-specific technical decisions

## Placement Rules

Put a document under `mydocs/hwping/` if the answer is yes to most of these questions.

1. Is it directly tied to the Hwping macOS app or one of its extensions?
2. Does it cover Quick Look, Finder, App Intents, AppKit, SwiftUI, or app bundle structure?
3. Would it lose important context if it were moved into upstream `rhwp`?

Keep a document in the shared `mydocs/` area if it is primarily about one of the following.

- file-format analysis
- general parser, renderer, or serializer design
- engine knowledge shared across multiple products such as the web app or VS Code extension
- engine improvements that are likely to be proposed upstream