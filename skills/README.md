# /skills — Installed Claude Code skills

This folder is the install log + configs for skill packs used by the AI team. The actual skill binaries / manifests live under `~/.claude/skills/` (managed by the `skills` CLI), not here.

## What goes here

- `install-log.md` — a plain-text log of which skills were installed, when, and by whom.
- Per-skill config overrides (if any).
- Example prompts that pair well with each skill.

## Recommended install set (Phase 0)

Run these from the repo root (inside a Claude Code session):

```bash
# Solopreneur / automation
npx skills add ReScienceLab/opc-skills

# Programmatic video (Cinematic Agent)
npx skills add remotion-dev/skills

# HTML → video (Hyperframes)
npx skills add heygen-com/hyperframes
```

## Built-in Claude Code skills we rely on

(These come pre-listed; no install needed. Pair them with agent prompting templates.)

- `deep-research`, `iterative-retrieval`, `search-first` — Research Agent
- `frontend-design`, `design-token`, `visual-hierarchy`, `color-system`, `typography-scale` — UI/UX Agent
- `spritecook-generate-sprites`, `spritecook-animate-assets`, `spritecook-workflow-essentials` — Brand & Asset Agent
- `state-machine`, `user-flow-diagram`, `jobs-to-be-done` — Game Designer
- `testing-strategies`, `verification-loop`, `browser-qa` — QA Agent
- `schedule`, `loop` — Project Manager / OpenClaw

## Discovery

```bash
# list installed
npx skills list

# search for a skill
npx skills search <keyword>
```

## Reference

- OPC-skills: https://github.com/ReScienceLab/opc-skills
- Remotion skills: https://github.com/remotion-dev/skills
- Hyperframes: https://hyperframes.heygen.com
