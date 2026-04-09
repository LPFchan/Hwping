# Skills

This directory is part of Hwping's repo-template operating model.

Use it as repo-native procedural documentation.
Agents should read the relevant workflow even when their runtime does not auto-load skills.

Each reusable workflow should live at `skills/<name>/SKILL.md`.

What lives here:

- `repo-orchestrator/`
  - routing workflow for truth, status, plans, research, decisions, worklogs, inbox capture, and deeper `mydocs/` notes
- `daily-inbox-pressure-review/`
  - Focus-protecting daily triage for `IBX-*` capture and capture packets.
- `upstream-intake/`
  - companion workflow for the canonical upstream-review module

Keep skills procedural.
Do not duplicate the canonical rules from `REPO.md` inside them.

Use `SKILL.md` for:

- step-by-step procedures
- required inputs and expected outputs
- escalation triggers
- links to supporting templates or reference docs

Do not use `SKILL.md` for:

- repo-wide policy
- general project truth
- local or personal preferences that belong in tool-specific memory files
