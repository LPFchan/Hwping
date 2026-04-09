# Hwping REPO Contract

This document is the canonical repo contract for Hwping's adoption of `LPFchan/repo-template`.

## Purpose

Hwping uses the repo-template model to keep project truth, current reality, accepted future direction, capture, research, decisions, worklogs, and recurring upstream review legible inside the repository itself.

The goal is to preserve a syncable downstream fork while making the repository understandable to future maintainers and agents without reconstructing context from external-tool history.

## Core Surfaces

| Surface | Role | Mutability |
| --- | --- | --- |
| `SPEC.md` | Durable statement of what Hwping is supposed to be. | rewritten |
| `STATUS.md` | Current accepted operational reality. | rewritten |
| `PLANS.md` | Accepted future direction that is not current truth yet. | rewritten |
| `INBOX.md` | Ephemeral capture waiting for triage. | append then purge |
| `research/` | Curated reusable exploration. | append by new file |
| `records/decisions/` | Durable decision records with rationale. | append-only by new file |
| `records/agent-worklogs/` | Execution history for runs, sessions, agents, and subagents. | append-only |
| `skills/` | Required procedural workflows for repeatable agent tasks. | edit by skill |
| `upstream-intake/` | Recurring upstream-review subsystem for the downstream fork. | append by cadence |
| `mydocs/` | Detailed shared technical, troubleshooting, and manual material that supports the root truth docs. | append or rewrite by document type |

## Agent Compatibility Files

Some coding agents look for repo-root instruction files such as `AGENTS.md` or `CLAUDE.md`.

When a repo using this model includes them:

- they should act as entrypoints into the canonical rules, not competing policy documents
- they should stay short enough that they do not drift from `REPO.md`
- `AGENTS.md` should be the main editable agent-instructions file when both files exist
- `CLAUDE.md` should be a thin shim that points to `AGENTS.md` when the tool supports it
- `SKILL.md` stays separate because it defines a bounded reusable procedure, not repo-wide policy
- `skills/` should ship with adopted repos as repo-native procedural documentation, even when the agent runtime does not auto-load skills
- optional repo subsystems may have optional companion skills

Recommended split:

- `REPO.md`
  - canonical rules
- `AGENTS.md`
  - canonical editable agent-instructions file
- `CLAUDE.md`
  - Claude Code shim that points to `AGENTS.md`
- `skills/<name>/SKILL.md`
  - procedure for one repeatable workflow

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
- What new capture still needs routing? -> `INBOX.md`
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
- run daily inbox pressure reviews
- update `SPEC.md`, `STATUS.md`, and `PLANS.md`
- create research memos
- create decision records
- append to the current relevant worklog or create a new one when clarity requires it
- translate external capture into repo artifacts
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

### External Capture Surfaces

External capture surfaces are capture and control channels.

They may:

- create or append inbox capture
- request approvals
- deliver summaries
- surface blocked states

They must not write truth docs directly.

### Capture Packets

Raw external source events are immutable Off-Git events.
Do not treat every raw source event as a separate repo artifact.
Do not treat a full external-tool history as one giant inbox item.

Use capture packets as mutable working envelopes around one or more relevant raw source events.

A capture packet may be:

- appended as new related source events arrive
- edited into a clearer operator-intent summary
- split when it contains multiple independent asks
- merged when several source events are one meaningful thread
- summarized into `INBOX.md` as an `IBX-*`
- routed into durable repo artifacts after triage

Triage should happen per meaningful capture packet.
Routed repo artifacts should copy a short summary, the stable inbox ID, and any needed external provenance handle instead of relying on raw external source staying visible.

## Inbox Pressure Review

`INBOX.md` is an ephemeral scratch disk for untriaged capture.
It is not a backlog, roadmap, brainstorm archive, or project digest.

Run a daily inbox pressure review when the project receives substantial capture.
This review is focus-protecting triage.
It is not an unconditional digest of every random idea.

During the review:

- group related `IBX-*` entries and capture packets into meaningful clusters
- identify stale, duplicate, low-confidence, noisy, or "maybe later" capture
- ask whether each meaningful cluster should route, research, plan, discard, or stay held
- promote only items that survived triage and have an accepted destination
- report counts or clusters of held, discarded, stale, or noisy capture instead of summarizing every low-signal item
- preserve `IBX-*` as a permanent provenance ID even if the inbox line is deleted

Do not update `SPEC.md`, `STATUS.md`, `PLANS.md`, `research/`, or `records/decisions/` directly from raw inbox pressure.
The orchestrator or operator-approved routing step owns promotion.

## Promotion Discipline

Promotion should be sparse.
Do not mirror one evolving thought into every repo surface.

Raw shaping may stay in external capture, generic notes, off-Git capture packets, or `INBOX.md` while the thought is still forming.
Repo artifacts are a refinery: each layer should receive only the part that belongs there, when it is ready.

Use each layer for its distinct job:

- `INBOX.md`
  - ephemeral routed capture
- `research/`
  - reusable exploration, evidence, framing, rejected paths, and open questions
- `records/decisions/`
  - meaningful accepted choices and why the winning choice won
- `PLANS.md`
  - accepted future work that survived triage
- `SPEC.md`
  - concise durable product or system truth after the argument is settled
- `STATUS.md`
  - current operational reality
- `upstream-intake/`
  - upstream review, upstream conflict, carry-forward, and operator escalation for upstream-related choices
- `records/agent-worklogs/`
  - execution history, not truth, decision, plan, or research mirrors

A research memo may remain research forever.
A decision record should exist only when a real product, architecture, workflow, trust, upstream, or repo-operating choice has been made.
`SPEC.md`, `STATUS.md`, and `PLANS.md` should receive concise outcomes, not copied debate.

One task may touch multiple layers, but each touched layer must have its own distinct job.

## Routing Ladder

When new work arrives, classify it in this order:

1. Is this untriaged capture?
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

Touch multiple layers only when each layer receives distinct information.
Do not copy the same evolving thought into research, decision, plan, spec, status, upstream, and log surfaces.

## Write Rules

- `SPEC.md`, `STATUS.md`, and `PLANS.md` should be updated only by the operator or orchestrator.
- `INBOX.md` is an aggressive scratch disk. Purge entries once they are reflected elsewhere.
- Daily inbox review should reduce pressure by clustering, routing, holding, or purging capture; it should not generate a larger digest by default.
- `research/` keeps curated findings only.
- `records/decisions/` is append-only by new file.
- `records/agent-worklogs/` is append-only, with append-first reuse of the current relevant `LOG-*`.
- `upstream-intake/` should preserve its paired internal-record and operator-brief workflow.
- `mydocs/` should keep durable shared technical, troubleshooting, and manual depth that would make the root truth docs too noisy.
- When a `mydocs/` note changes current truth, accepted direction, or standing policy, reflect that summary in the root truth docs too.

### Worklog Reuse Policy

Do not create a new `LOG-*` just to satisfy provenance.

Append to the latest relevant `LOG-*` when:

- the same workstream, goal, or blocker is still in scope
- the same agent run or bounded execution thread is continuing
- a new timestamped entry preserves clarity

Create a new `LOG-*` only when:

- the work is materially distinct from the current log's scope
- a separate agent or subagent owns a distinct execution thread
- reusing the old log would make provenance harder to follow
- the new execution record would be more useful for future retrieval than another appended entry

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

Normal commit provenance should stay useful, not bureaucratic.

- A normal commit should reference at least one relevant artifact, newly created or updated.
- A commit may reference an existing updated `LOG-*`, `DEC-*`, `RSH-*`, `UPS-*`, or other relevant artifact type.
- Normal commits do not require a brand-new `LOG-*`.
- Prefer appending to the current relevant `LOG-*` when the same workstream is continuing.
- Create a new `LOG-*` only when it materially improves clarity.

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
