# Collaboration Protocol

> How humans (Ghost, Zoro) and AI agents actually work together inside this repo. Read this before your first PR, first agent invocation, or first council session.

## The team

- **Ghost** — founder, product + creative direction, final authority on scope/brand/ship.
- **Zoro** — co-founder, final authority shared with Ghost.
- **AI Orchestrator (Claude)** — default assistant in every session; routes work to subagents, chairs councils, enforces [Prompt_Guidelines.md](Prompt_Guidelines.md).
- **12 Subagents** — see [agents.md](agents.md).
- **AI Council** — rotating 5–7 member deliberative body, see [AI_Council_Charter.md](AI_Council_Charter.md).

## Information flow

```
         ┌──────────────────────────────┐
         │   Ghost + Zoro (humans)      │
         └──────────────┬───────────────┘
                        │ prompt / direction
                        ▼
         ┌──────────────────────────────┐
         │   AI Orchestrator (Claude)   │  ← intercepts EVERY prompt
         │   • refines the prompt       │
         │   • consults council if      │
         │     non-trivial              │
         │   • routes to subagent(s)    │
         └────┬──────────┬──────────┬───┘
              │          │          │
              ▼          ▼          ▼
        ┌─────────┐┌─────────┐┌─────────┐
        │ agent 1 ││ agent 2 ││ agent N │
        └────┬────┘└────┬────┘└────┬────┘
             │          │          │
             └──────────┴──────────┘
                        │
                        ▼
              structured output →
              back to Ghost + Zoro
              + logged to memory
              + logged to decision log
```

## Session types

### 1. Direct request
Ghost types a prompt. Orchestrator refines, pings relevant agent, delivers answer. No council. Used for small tasks.

### 2. Council session
Orchestrator detects non-trivial topic (see [AI_Council_Charter.md](AI_Council_Charter.md) triggers). Convenes council, outputs structured debate + decision + log entry.

### 3. Build session
Orchestrator + one lead agent work through a feature. QA agent reviews at the end. Council convenes only if unexpected architectural choice surfaces.

### 4. Long-running / background
Handed to **OpenClaw Living Agent** for unattended execution (cron jobs, batch renames, continuous monitoring). Reports back via commit + log file.

## Hand-off contract

Every agent response that isn't final ends with:

```
→ [next-agent]: [specifically what they need to do, with file paths]
```

If the work is final: `→ done. no hand-off.`

## Commit conventions

```
<type>(<scope>): <summary>

<body>

Agents: <agent-1>, <agent-2>    # attribution (AI + human)
Council: <yes|no> [link to Decision-Log.md#entry-id]
```

Types: `feat`, `fix`, `chore`, `docs`, `brand`, `econ`, `ui`, `test`, `charter`, `agent`.

Example:
```
feat(economy): add FDST fractal-dust supply shock event

Adds triggered event with 20% price spike and 2-tick duration. Tuned
via ElizaOS swarm simulation; median FDST holder PnL delta +7%.

Agents: economy-trading-sim, elizaos-swarm, qa
Council: yes (docs/Decision-Log.md#2026-04-22-fdst-event)
```

## Branching

- `main` — always deployable. Only the AI Council or Ghost/Zoro merge here.
- `phase-<N>-<slug>` — active phase branches, e.g. `phase-1-pirate-os`.
- `feat/<scope>-<slug>` — short-lived feature branches off the phase branch.
- `experiment/<slug>` — lives in `/playground/` — never merged to main.

## Pull requests

Even solo, open a PR for any change that:
- Adds a screen to main nav
- Changes a public API contract
- Touches brand, aesthetics, or economy values
- Modifies auth / wallet / Web3

PR template auto-fills with: scope, agents involved, council verdict link, QA checklist.

## Memory discipline

The orchestrator writes to `memory/` when it learns:
- A new user preference or working-style rule (`feedback`)
- A decision that outlives the session (`project`)
- An external system pointer (`reference`)
- A long-lived fact about Ghost or Zoro (`user`)

It **does not** write:
- Code patterns (read the code)
- Task-level state (use todos, not memory)
- Duplicate facts (update existing entries)

See [memory/MEMORY.md](memory/MEMORY.md) for the index.

## Disagreement protocol

- Agents disagree → council.
- Council splits → escalate to Ghost.
- Ghost + Zoro disagree → document both positions, take the smaller-blast-radius option, revisit in 7 days with new data.

## Cadence

- **Daily** (async): PM Agent posts a one-line status in `docs/Daily-Log.md`.
- **Weekly**: council review of roadmap progress.
- **Per phase**: retrospective in `docs/Retrospectives/phase-N.md`.
