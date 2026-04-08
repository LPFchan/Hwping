# Hwping Development Environment Guide

## Scope

This guide describes the normal local development environment for Hwping.

It intentionally avoids old assumptions about office versus home machines, private network layouts, WSL-only setups, browser demo infrastructure, or `rhwp-studio` development servers. If a setup step is specific to one person's machine, it does not belong here unless it is broadly reusable.

## Required Tools

Install these tools on your machine:

- Rust toolchain
- Git

Recommended additions:

- `clippy`
- a diff tool for comparing generated SVG output

Example setup on macOS with Homebrew and rustup:

```bash
brew install rustup-init
rustup-init -y
rustup component add clippy
```

If Rust is already installed, only verify the toolchain:

```bash
cargo --version
rustc --version
```

## Repository Setup

Clone the Hwping fork and verify the remote layout if you need upstream sync work:

```bash
git clone <hwping-fork-url>
cd Hwping
git remote -v
```

Typical remote roles are:

- `origin` — the Hwping fork
- `upstream` — the original `rhwp` repository

Normal product work should happen on local task branches, not directly on upstream-tracking branches.

## Standard Validation Commands

Use Cargo directly from the repository root:

```bash
cargo build
cargo test
cargo clippy -- -D warnings
cargo build --release
```

These commands are the primary health check for the repository.

## Useful Debug Commands

The CLI is the main debugging surface for engine work.

```bash
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp
cargo run --bin rhwp -- export-svg samples/biz_plan.hwp --debug-overlay
cargo run --bin rhwp -- dump-pages samples/biz_plan.hwp -p 0
cargo run --bin rhwp -- dump samples/biz_plan.hwp -s 0 -p 45
cargo run --bin rhwp -- ir-diff sample.hwpx sample.hwp
```

Use `samples/` for regression inputs and `output/` for generated local artifacts.

## Environment Principles

Keep the environment simple:

- prefer local Rust tooling over container-only workflows
- add extra tools only when they solve a real recurring problem
- do not document removed web, npm, or VS Code extension workflows as current development requirements
- keep machine-specific secrets, IP addresses, and private infrastructure details out of shared docs

## When Docker Is Useful

Docker is optional. Use it only when you need an isolated environment for reproducibility or packaging work. It is not the default path for normal day-to-day engine development.

If you use Docker, make sure the container workflow still supports the standard Cargo validation commands.

## Documentation Placement

When you discover durable environment or debugging knowledge, record it in the right place:

- `mydocs/manual/` for reusable setup and operation instructions
- `mydocs/troubleshootings/` for root-cause analysis and regressions
- `records/decisions/` for Hwping-specific architectural decisions
- `mydocs/tech/` for engine knowledge that may still matter outside Hwping

Avoid turning this guide into a personal workstation diary.

## Minimal Bring-Up Checklist

Use this checklist on a fresh machine:

1. Install Rust.
2. Install or verify Git.
3. Clone the repository.
4. Run `cargo build`.
5. Run `cargo test`.
6. Run `cargo clippy -- -D warnings`.
7. Run one CLI command against a sample file to confirm end-to-end behavior.
