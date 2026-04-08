---
name: weekly-upstream-intake
description: "Run recurring upstream intake review inside Hwping's full repo-template operating model."
argument-hint: "Upstream release, compare window, or refs to review"
---

# Weekly Upstream Intake

Use this skill with:

- [../../REPO.md](../../REPO.md)
- [../../upstream-intake/README.md](../../upstream-intake/README.md)
- [../../upstream-intake/intake-method.md](../../upstream-intake/intake-method.md)
- [../../upstream-intake/weekly-upstream-intake-template.md](../../upstream-intake/weekly-upstream-intake-template.md)
- [../../upstream-intake/operator-weekly-brief-template.md](../../upstream-intake/operator-weekly-brief-template.md)

Use it when a downstream fork needs a repeatable review of upstream changes.

## What This Skill Produces

- a structured `UPS-*` decision record for important upstream changes or grouped change sets
- a separate operator-facing brief that explains what matters and why
- explicit escalation packets for product, compatibility, or policy decisions that cannot be made autonomously

## Procedure

1. Define the upstream scope.
   - Capture the release tag, compare window, or commit range.
   - Record the current downstream branch or baseline.

2. Gather upstream evidence.
   - Start with release notes or compare logs.
   - Read underlying commits, PRs, docs, or code when the practical impact is not obvious.

3. Group changes into candidate decisions.
   - Combine near-duplicate commits into one decision when they solve the same problem.
   - Separate product-shaping work from routine bug fixes.

4. Analyze each candidate deeply.
   - Follow the drill-down and ambiguity rules in [../../upstream-intake/intake-method.md](../../upstream-intake/intake-method.md).
   - Make sure each candidate covers the exact upstream and local surfaces, the before and after state, the concrete consequence, what is not changing, overlap or collision with local work, tradeoffs, compatibility details, and at least one literal user or operator scenario.
   - If any of this depends on vendor policy, pricing, legal terms, or external product behavior, use internet lookup and prefer official sources.

5. Decide `accept`, `adapt`, `decline`, or `defer pending operator decision`.
   - Use repo policy, not personal preference.
   - If the change is blocked on product direction, public contract risk, or security-versus-compatibility tradeoffs, escalate.

6. Fill the canonical template.
   - Use [../../upstream-intake/weekly-upstream-intake-template.md](../../upstream-intake/weekly-upstream-intake-template.md).
   - Write the full record under `upstream-intake/reports/internal-records/`.

7. Produce the operator brief.
   - Use [../../upstream-intake/operator-weekly-brief-template.md](../../upstream-intake/operator-weekly-brief-template.md).
   - Store it as a separate artifact under `upstream-intake/reports/operator-briefs/`.
   - Keep the full reasoning in the internal record; the operator brief is the shorter human-facing translation.

8. If Git commits happen as part of intake or follow-up work, include:
   - `project: hwping`
   - `agent: <agent-id>`
   - `role: orchestrator|worker|subagent|operator`
   - `artifacts: UPS-..., LOG-..., DEC-...`

## Escalation Triggers

Escalate instead of guessing when the change:

- affects plugin-facing contracts or migration-sensitive compatibility surfaces
- changes onboarding, user workflow, or product positioning
- conflicts with an existing fork-owned implementation and the winning policy is not already explicit
- requires declining or locally overriding a security-relevant upstream change
- removes a compatibility layer or changes a public contract

## Output Quality Bar

- plain-language explanations, not release-note paraphrases
- explicit tradeoffs
- explicit compatibility details
- clear autonomous-versus-operator split
- recommendations grounded in current fork policy and architecture
