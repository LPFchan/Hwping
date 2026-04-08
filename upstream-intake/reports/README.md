# Upstream Intake Report Artifacts

Store completed upstream intake artifacts in this directory.

Each review window should usually create two separate files:

- one full internal record
- one lighter operator brief

Use separate folders for those artifacts:

- [internal-records/](internal-records/README.md)
- [operator-briefs/](operator-briefs/README.md)

## Recommended Naming

Use one paired set of files per review window.

- `internal-records/UPS-YYYYMMDD-NNN-<scope>.md`
- `operator-briefs/UPS-YYYYMMDD-NNN-<scope>-operator-brief.md`

## Expected Contents

Each review should leave behind:

- the full intake record using [../weekly-upstream-intake-template.md](../weekly-upstream-intake-template.md)
- the separate concise operator brief using [../operator-weekly-brief-template.md](../operator-weekly-brief-template.md)
- links to follow-up PRs, issues, ADRs, or notes

Do not store raw chat summaries here. Normalize the result into the intake format first.
