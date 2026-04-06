---
name: "Weekly Upstream Intake"
description: "Run the Hwping upstream-intake workflow for a specified upstream rhwp release, compare window, or sync candidate."
argument-hint: "Release tag, compare window, or refs to review"
---

Run the Hwping upstream-intake workflow for the provided upstream `rhwp` window.

Use the canonical workflow and templates here:

- [upstream-intake/README.md](../../upstream-intake/README.md)
- [upstream-intake/intake-method.md](../../upstream-intake/intake-method.md)
- [upstream-intake/weekly-upstream-intake-template.md](../../upstream-intake/weekly-upstream-intake-template.md)
- [upstream-intake/operator-weekly-brief-template.md](../../upstream-intake/operator-weekly-brief-template.md)
- [upstream-intake/compatibility-watchlist.md](../../upstream-intake/compatibility-watchlist.md)

Expected outputs:

1. A full internal record under [upstream-intake/reports/internal-records/README.md](../../upstream-intake/reports/internal-records/README.md)
2. A separate operator brief under [upstream-intake/reports/operator-briefs/README.md](../../upstream-intake/reports/operator-briefs/README.md)

Do not stop at a release-note summary. Update standing registers only if the review establishes durable new knowledge.