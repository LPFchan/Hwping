# Hwping Repo Operating Model

This document is the canonical rules layer for Hwping's adoption of `LPFchan/repo-template`.

## Purpose

Hwping uses the repo-template model to keep project truth, current reality, accepted future direction, intake, research, decisions, worklogs, and recurring upstream review legible inside the repository itself.

The goal is to preserve a syncable downstream fork while making the repository understandable to future maintainers and agents without reconstructing context from chat history.

## Core Surfaces

| Surface | Role | Mutability |
| --- | --- | --- |
| `SPEC.md` | Durable statement of what Hwping is supposed to be. | rewritten |
| `STATUS.md` | Current accepted operational reality. | rewritten |
| `PLANS.md` | Accepted future direction that is not current truth yet. | rewritten |
| `INBOX.md` | Ephemeral intake waiting for triage. | append then purge |
| `research/` | Curated reusable exploration. | append by new file |
| `records/decisions/` | Durable decision records with rationale. | append-only by new file |
| `records/agent-worklogs/` | Execution history for runs, sessions, agents, and subagents. | append-only |
| `upstream-intake/` | Recurring upstream-review subsystem for the downstream fork. | append by cadence |
| `mydocs/` | Detailed shared technical, troubleshooting, and manual material that supports the root truth docs. | append or rewrite by document type |

## Separation Rules

These boundaries are mandatory:

- `SPEC.md` is not a changelog.
- `STATUS.md` is not a transcript.
- `PLANS.md` is not a brainstorm dump.
- `INBOX.md` is not durable truth.
- `research/` is not raw execution history.
- `records/decisions/` is not the same as `records/agent-worklogs/`.
- `mydocs/` is not a substitute for the root truth docs.
- Do not recreate a dedicated Hwping-only subtree under `mydocs/`.
- Root truth docs should summarize and point to deeper material in `mydocs/` when detail matters.

That separation answers distinct questions quickly:

- What is Hwping supposed to be? -> `SPEC.md`
- What is true right now? -> `STATUS.md`
- What future direction is actually accepted? -> `PLANS.md`
- What new intake still needs routing? -> `INBOX.md`
- What reusable exploration did we learn? -> `research/`
- What did we decide and why? -> `records/decisions/`
- What actually happened during execution? -> `records/agent-worklogs/`
- What is the standing upstream-review context? -> `upstream-intake/`
- Where is the deeper shared technical or troubleshooting detail? -> `mydocs/`

## Roles

### Operator

The operator is the final authority for product direction, escalation outcomes, and acceptance of truth changes.

### Orchestrator Agent

The orchestrator owns synthesis and routing.

It may:

- triage inbox items
- update `SPEC.md`, `STATUS.md`, and `PLANS.md`
- create research memos
- create decision records
- append or create worklogs
- route shared technical, troubleshooting, or manual depth into `mydocs/`
- maintain recurring upstream-intake artifacts
- escalate non-obvious product, architecture, workflow, or policy calls

### Worker Agents

Worker agents execute bounded tasks.

They may:

- append to worklogs
- create evidence, summaries, and implementation outputs
- propose truth changes through the orchestrator

They should not update `SPEC.md`, `STATUS.md`, or `PLANS.md` directly unless the operator explicitly allows that flow.

### Messenger Surfaces

Messenger surfaces are intake and control channels.

They may:

- create or append inbox intake
- request approvals
- deliver summaries
- surface blocked states

They must not write truth docs directly.

## Routing Ladder

When new work arrives, classify it in this order:

1. Is this untriaged intake?
   - Route to `INBOX.md`.
2. Is this recurring upstream review?
   - Route to `upstream-intake/`.
3. Is this durable project or product truth?
   - Route to `SPEC.md`.
4. Is this current operational reality?
   - Route to `STATUS.md`.
5. Is this accepted future direction?
   - Route to `PLANS.md`.
6. Is this reusable exploration or horizon expansion?
   - Route to `research/`.
7. Is this a durable decision with rationale?
   - Route to `records/decisions/`.
8. Is this execution history?
   - Route to `records/agent-worklogs/`.
9. Is this detailed shared technical, troubleshooting, or manual material?
   - Route to `mydocs/`.

One task may legitimately touch multiple layers. For example:

- a repo migration can create `DEC-*`, `LOG-*`, and update `STATUS.md`
- a research session can create `RSH-*` plus a `mydocs/` note
- an upstream review can create `UPS-*` artifacts and update `PLANS.md` or `STATUS.md`

## Write Rules

- `SPEC.md`, `STATUS.md`, and `PLANS.md` should be updated only by the operator or orchestrator.
- `INBOX.md` is an aggressive scratch disk. Purge entries once they are reflected elsewhere.
- `research/` keeps curated findings only.
- `records/decisions/` is append-only by new file.
- `records/agent-worklogs/` is append-only by new file or appended entries.
- `upstream-intake/` should preserve its paired internal-record and operator-brief workflow.
- `mydocs/` should keep durable shared technical, troubleshooting, and manual depth that would make the root truth docs too noisy.
- When a `mydocs/` note changes current truth, accepted direction, or standing policy, reflect that summary in the root truth docs too.

## Local Writing Guides

The repo's local `README.md` files and explicit surface templates are part of the writing contract, not optional style notes.

- Before creating or rewriting a repo document, read the matching local guide first.
- If a local guide defines scope, section order, provenance fields, naming, or a canonical example, follow it by default.
- Use repo-specific truth in the artifact, but use the local guide for structure and discipline.
- Make the smallest justified deviation if an artifact genuinely needs a different shape, and keep the core metadata and surface boundary intact.

## Stable IDs

Use these stable identifiers:

- project id: `hwping`
- `IBX-YYYYMMDD-NNN` for inbox items
- `RSH-YYYYMMDD-NNN` for research memos
- `DEC-YYYYMMDD-NNN` for decision records
- `LOG-YYYYMMDD-NNN` for worklogs
- `UPS-YYYYMMDD-NNN` for upstream-intake review windows

Numbering is per day and per artifact type. Any agent may claim the least available `NNN` for that date and prefix.

Until dedicated runtime tooling is in place, agents should mint a unique run-scoped `agent-id` manually. Recommended format:

- `codex-YYYYMMDD-short-scope`
- `github-copilot-YYYYMMDD-short-scope`

Every stable-ID-bearing artifact should open with:

- `Opened: YYYY-MM-DD HH-mm-ss KST`
- `Recorded by agent: <agent-id>`

## Commit Provenance

All new commits should include these trailers:

- `project: hwping`
- `agent: <agent-id>`
- `role: orchestrator|worker|subagent|operator`
- `artifacts: <artifact-id>[, <artifact-id>...]`

Artifact-less commits should be treated as bootstrap or migration exceptions only.

Local enforcement lives in:

- `.githooks/commit-msg` for local commit-time validation
- `scripts/check-commit-standards.sh` for single-message validation
- `scripts/check-commit-range.sh` for pushed or pull-request commit ranges
- `.github/workflows/commit-standards.yml` for remote CI enforcement

Bootstrap or migration exceptions must be explicit in the commit message. They are exceptions, not the default path.

Example:

```text
project: hwping
agent: codex-20260409-full-repo-template-migration
role: worker
artifacts: DEC-20260409-001, LOG-20260409-001
```
