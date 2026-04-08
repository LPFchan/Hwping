# Upstream Intake Report Artifacts

Store completed upstream intake artifacts in this directory.

By default, each review window should create two separate files:

- one full internal record
- one lighter operator brief

Use separate folders for those artifacts:

- [internal-records/](internal-records/README.md)
- [operator-briefs/](operator-briefs/README.md)

## Recommended Naming

Use one paired set of files per review window.

- `internal-records/UPS-YYYYMMDD-NNN-<scope>.md`
- `operator-briefs/UPS-YYYYMMDD-NNN-<scope>-operator-brief.md`

Examples:

- `internal-records/UPS-20260407-001-upstream-main-to-local-devel.md`
- `operator-briefs/UPS-20260407-001-upstream-main-to-local-devel-operator-brief.md`

## Expected Contents

Each review should leave behind:

- the full intake record using [../weekly-upstream-intake-template.md](../weekly-upstream-intake-template.md)
- the separate concise operator brief using [../operator-weekly-brief-template.md](../operator-weekly-brief-template.md)
- links to follow-up PRs, issues, ADRs, or notes

The child directory `README.md` files and the two templates are part of the writing contract for this subsystem. Read them before drafting or normalizing a report.

Do not store one-off chat summaries here unless they have been normalized into the intake format first.
