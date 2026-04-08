---
name: repo-orchestrator
description: "Route work into the correct artifact layer in the Hwping repo-template operating model."
argument-hint: "Task, intake item, or maintenance request"
---

# Repo Orchestrator

Use this skill with:

- [../../REPO.md](../../REPO.md)
- [../../SPEC.md](../../SPEC.md)
- [../../STATUS.md](../../STATUS.md)
- [../../PLANS.md](../../PLANS.md)

## What This Skill Produces

- correctly routed repo artifacts
- clear separation between truth, plans, research, decisions, logs, and detailed `mydocs/` notes
- stable IDs plus lightweight provenance
- operator escalation only when a real judgment call exists

## Procedure

1. Classify the work in routing order.
   - Is this untriaged intake?
   - Is this recurring upstream review?
   - Is this durable truth?
   - Is this current operational reality?
   - Is this accepted future direction?
   - Is this reusable research?
   - Is this a durable decision?
   - Is this execution history?
   - Is this deeper technical, troubleshooting, or manual detail?

2. Route it to the correct artifact layer.
   - `SPEC.md`
   - `STATUS.md`
   - `PLANS.md`
   - `INBOX.md`
   - `research/`
   - `records/decisions/`
   - `records/agent-worklogs/`
   - `upstream-intake/`
   - `mydocs/`

3. Assign stable IDs when needed.
   - `IBX-*`
   - `RSH-*`
   - `DEC-*`
   - `LOG-*`
   - `UPS-*`
   - Use the least available `NNN` for that date and artifact type.

4. Write the artifact with provenance.
   - Include `Opened: YYYY-MM-DD HH-mm-ss KST`
   - Include `Recorded by agent: <agent-id>`

5. Preserve the separation rules.
   - Do not write speculation straight into `PLANS.md`.
   - Do not let worklogs masquerade as decisions.
   - Do not let inbox entries become long-term truth.
   - Do not let `mydocs/` replace the root truth docs.

6. If the task crosses layers, create multiple artifacts deliberately.
   - Example: `DEC-*` plus `PLANS.md`
   - Example: `LOG-*` plus `STATUS.md`
   - Example: `RSH-*` plus a deep technical note in `mydocs/`
   - Prefer appending to the current relevant `LOG-*` before creating a new one.

7. If Git commits are created, add commit trailers.
   - `project: hwping`
   - `agent: <agent-id>`
   - `role: orchestrator|worker|subagent|operator`
   - `artifacts: <artifact-id>[, <artifact-id>...]`
   - A normal commit may reference an existing updated artifact; it does not require a brand-new `LOG-*`.

8. If the task is recurring upstream maintenance, use `upstream-intake/` instead of inventing a parallel workflow.

## Escalation Triggers

Escalate instead of guessing when the work:

- changes durable product or system truth
- changes public contracts or compatibility posture
- resolves a real policy conflict
- changes operator-facing workflow in a non-obvious way
- overrides a security-sensitive upstream change

## Quality Bar

- clear routing
- clear provenance
- clean separation of layers
- reusable artifacts instead of chat-only outcomes
