# DEC-20260409-002: Retire `mydocs/hwping/` As An Active Namespace
Opened: 2026-04-09 05-29-07 KST
Recorded by agent: codex-20260409-full-repo-template-migration

## Metadata

- Project: Hwping
- Project id: `hwping`
- Decision owner: Hwping operator
- Status: accepted
- Related ids: `DEC-20260409-001`, `LOG-20260409-001`

## Decision

Retire `mydocs/hwping/` completely and migrate its durable content into the repo-template operating surfaces plus the remaining shared `mydocs/` roots.

After this decision:

- Hwping-specific accepted direction lives in `SPEC.md`, `STATUS.md`, and `PLANS.md`
- durable Hwping decisions live in `records/decisions/`
- reusable reference material lives in `research/`
- shared technical knowledge lives in `mydocs/tech/`
- troubleshooting lives in `mydocs/troubleshootings/`
- operational guides live in `mydocs/manual/`

## Context

Hwping first organized its downstream-specific notes under `mydocs/hwping/`. That structure helped while the repo still centered its durable context inside `mydocs/`.

After adopting the full repo-template operating model, `mydocs/hwping/` became a second routing system that overlapped with:

- root truth docs
- decision records
- research memos
- provenance worklogs

Keeping it alive would make the repo less legible by letting product plans, operating plans, architectural direction, and menu decisions live in two places.

## Options Considered

### Option 1: Keep `mydocs/hwping/`

Continue using it for Hwping-specific plans and technical notes alongside the repo-template surfaces.

### Option 2: Keep It As A Tombstone

Delete the content but leave a redirecting README behind.

### Option 3: Migrate The Content And Delete The Namespace

Move surviving knowledge into the repo-template layers and remove the directory entirely.

## Rationale

Option 3 was chosen because full repo-template adoption works best when the repository has one routing model.

The namespace retirement keeps:

- one canonical home for accepted plans
- one canonical home for durable decisions
- one canonical home for reusable reference material
- one shared location for technical, troubleshooting, and manual depth

It also reduces sync noise by removing a product-specific subtree whose main purpose is now better served by the root operating model.

## Consequences

- `mydocs/hwping/` is deleted with no tombstone.
- References to that namespace must point to root docs, decision records, research memos, or the remaining shared `mydocs/` roots.
- Future Hwping-specific architecture direction should land as `DEC-*`, `PLANS.md`, or `SPEC.md`, not in a new Hwping-only docs subtree.

## Migration Mapping

- `hwping_repo_template_adoption.md` -> `repo-operating-model.md` and `DEC-20260409-001`
- `hwping_repo_sync_plan.md` -> `DEC-20260409-005`, `SPEC.md`, `PLANS.md`, and contributor guidance
- `hwping_macos_milestone_plan.md` -> `PLANS.md`
- `hwping_system_architecture.md` -> `DEC-20260409-003`, `SPEC.md`, and `PLANS.md`
- `hwping_macos_menu_bar_spec.md` -> `DEC-20260409-004`
- `textedit_menubar_reference.md` -> `RSH-20260409-001`
- `shared_mydocs_classification.md` -> this decision plus updated repo routing guidance
