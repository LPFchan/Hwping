# LOG-20260409-001: Repo Template Migration Bootstrap
Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Project: Hwping
- Project id: `hwping`
- Scope: full repo-template adoption and migration bootstrap
- Related ids: `DEC-20260409-001`

## Task

Implement the full `LPFchan/repo-template` operating model in the Hwping repository.

## Scope

- add the root truth docs
- add `research/` and `records/` provenance directories
- add the repo operating model and optional skill layer
- rewrite contributor-facing guidance for full adoption
- migrate the seeded upstream-intake sample to `UPS-*` naming and metadata

## Entries

### 2026-04-09 05-29-07 KST

- Reviewed the current Hwping repository shape, the earlier partial-adoption edits already in progress, and the source `repo-template` scaffold.
- Confirmed that `upstream-intake/` was already present but the root truth docs and provenance folders were still missing.

### 2026-04-09 05-29-07 KST

- Added `repo-operating-model.md`, `SPEC.md`, `STATUS.md`, `PLANS.md`, `INBOX.md`, `research/`, and `records/`.
- Seeded `DEC-20260409-001` and this worklog so the migration itself is recorded inside the new model.

### 2026-04-09 05-29-07 KST

- Began updating contributor and onboarding guidance so the full repo-template model, stable IDs, and commit provenance become explicit repo policy.
- Began normalizing the existing upstream-intake sample and naming guidance to `UPS-*`.

### 2026-04-09 05-29-07 KST

- Finished rewriting the earlier partial-adoption guidance into full-adoption language.
- Renamed the seeded upstream-intake sample pair to `UPS-20260407-001-*` and added the required review metadata fields.
- Confirmed that the repo now contains the root truth stack, provenance directories, operating-model doc, and optional skill layer expected by the migration.

### 2026-04-09 05-29-07 KST

- Migrated the remaining `mydocs/hwping/` content into repo-template surfaces:
  - `RSH-20260409-001` for the TextEdit menu baseline
  - `DEC-20260409-002` through `DEC-20260409-005` for namespace retirement, architecture direction, menu baseline, and repo boundary decisions
  - `PLANS.md`, `SPEC.md`, and `STATUS.md` for accepted direction and current truth
- Updated contributor, onboarding, environment, and agent-guidance docs to stop routing work into `mydocs/hwping/`.
- Deleted `mydocs/hwping/` with no tombstone, leaving only the shared `mydocs/tech/`, `mydocs/troubleshootings/`, and `mydocs/manual/` roots.

## Checks

- Verified that the new root operating surfaces exist in the repository tree.
- Verified that the canonical `upstream-intake/` package remains present and will stay the upstream-review subsystem.

## Next Steps

- Keep future durable work routed through the new root operating surfaces.
- Use repo-template commit trailers on new commits that correspond to these artifacts.
- Continue populating the root truth docs as project reality changes.
