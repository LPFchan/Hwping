---
name: weekly-upstream-intake
description: "Use when: reviewing a weekly or periodic upstream rhwp compare window for Hwping and producing both an internal record and an operator brief."
argument-hint: "Release tag, compare window, or refs to review"
---

# Weekly Upstream Intake

Use this skill when Hwping needs a repeatable review of upstream `rhwp` work.

## Canonical Sources

- [REPO.md](../../../REPO.md)
- [upstream-intake/README.md](../../../upstream-intake/README.md)
- [upstream-intake/intake-method.md](../../../upstream-intake/intake-method.md)
- [upstream-intake/weekly-upstream-intake-template.md](../../../upstream-intake/weekly-upstream-intake-template.md)
- [upstream-intake/operator-weekly-brief-template.md](../../../upstream-intake/operator-weekly-brief-template.md)
- [upstream-intake/compatibility-watchlist.md](../../../upstream-intake/compatibility-watchlist.md)

## Procedure

1. Define the upstream scope.
   - Capture the compare window, tag, or ref range.
   - Record the Hwping baseline being reviewed against.

2. Gather evidence.
   - Start with compare logs or release notes.
   - Read underlying commits and local code when the practical effect is not obvious.
   - Use internet lookup when platform or vendor policy matters.

3. Group candidate decisions.
   - Combine related commits when they produce one practical Hwping decision.
   - Split items that need different outcomes such as `adapt` and `decline`.

4. Analyze each candidate deeply.
   - Name the exact upstream path, exact Hwping surface, before state, after state, concrete consequence, and what is not changing.
   - State whether the issue is policy, implementation, or both.
   - Include at least one literal user, maintainer, or operator scenario.

5. Decide the outcome.
   - Use `accept`, `adapt`, `decline`, or `defer pending operator decision`.
   - Shared-core fixes usually preserve upstream behavior in `crates/rhwp/`.
   - Hwping-only product surfaces usually preserve the local shape.

6. Write the artifacts.
   - Store the internal record under [upstream-intake/reports/internal-records/README.md](../../../upstream-intake/reports/internal-records/README.md).
   - Store the operator brief under [upstream-intake/reports/operator-briefs/README.md](../../../upstream-intake/reports/operator-briefs/README.md).
   - Use `UPS-*` review ids and file names.

7. Update standing knowledge only when appropriate.
   - Add entries to the carry-forward or local-override registers only when the review produced durable conclusions.

## Escalation Triggers

Escalate instead of guessing when the candidate:

- changes a public contract, ABI, or migration-sensitive compatibility surface
- changes product direction or reintroduces a removed upstream surface
- conflicts with a security-relevant upstream change at the policy level
- changes Apple-platform behavior in a way that depends on operator policy rather than implementation detail
