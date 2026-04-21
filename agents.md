# agents.md — The AI Team of CyberTrader: Age of Pantheon

> Master index of the 12-subagent AI Council plus the named OpenClaw workers that build this game alongside Ghost and Zoro. Individual agent profiles live in [`/agents/`](agents/).

## How to read this file

- **Role** = the agent's one-line mission.
- **Activates when** = conditions that should trigger invoking this agent.
- **Tools/skills** = the concrete toolkit it relies on.
- **Hand-off to** = who picks up after its work lands.

The **AI Council** (see [AI_Council_Charter.md](AI_Council_Charter.md)) is a rotating 5–7 member subset convened for any non-trivial decision. **Zyra** and **Zara** are named OpenClaw workers on the Mac mini; they execute autonomous PM/QA and implementation loops around the Council.

---

## Core roster

### 1. Game Designer Agent → [`agents/game-designer.md`](agents/game-designer.md)
- **Role**: owns mechanics, balance, progression curves, player psychology, loop tuning.
- **Activates when**: designing new features, tuning numbers, reviewing balance proposals, scoping Phase deliverables.
- **Tools/skills**: `jobs-to-be-done`, `state-machine`, `user-flow-diagram`, `metrics-definition`, `a-b-test-design`.
- **Hand-off to**: Economy & Trading Sim (for numbers), UI/UX (for screens).

### 2. UI/UX & Cyberpunk Aesthetic Agent → [`agents/ui-ux-cyberpunk.md`](agents/ui-ux-cyberpunk.md)
- **Role**: terminal look, CRT motion, mobile ergonomics, dark-mode-native visual hierarchy.
- **Activates when**: any new screen, any visual change, any interaction design question.
- **Tools/skills**: `frontend-design`, `design-token`, `design-critique`, `visual-hierarchy`, `color-system`, `typography-scale`, `animation-principles`, `micro-interaction-spec`, `dark-mode-design`.
- **Hand-off to**: Frontend/Mobile, Brand & Asset.

### 3. Frontend / Mobile Agent → [`agents/frontend-mobile.md`](agents/frontend-mobile.md)
- **Role**: implements Expo / React Native screens, state, navigation, offline behavior.
- **Activates when**: building a screen, wiring state, fixing mobile bugs.
- **Tools/skills**: `responsive-design`, `performance-optimization`, `gesture-patterns`, `layout-grid`, `loading-states`, `error-handling-ux`.
- **Hand-off to**: QA.

### 4. Backend / Web3 Agent → [`agents/backend-web3.md`](agents/backend-web3.md)
- **Role**: Supabase schema + Edge Functions, Solana Mobile Wallet Adapter, authority adapter interface.
- **Activates when**: schema changes, trade authority, wallet session, $OBOL on-chain work.
- **Tools/skills**: `security-hardening`, `state-machine`, Supabase docs, Solana Mobile SDK docs.
- **Hand-off to**: QA, Frontend/Mobile.

### 5. Economy & Trading Simulation Agent → [`agents/economy-trading-sim.md`](agents/economy-trading-sim.md)
- **Role**: deterministic market price engine, commodity tuning, Heat/Energy curves, news impact modeling. Uses ElizaOS multi-agent swarm to simulate market participants.
- **Activates when**: adding a ticker, tuning volatility, designing an event, validating offline-resolution.
- **Tools/skills**: ElizaOS, `state-machine`, `a-b-test-design`, `metrics-definition`.
- **Hand-off to**: Game Designer, QA.

### 6. Cinematic & Animation Agent → [`agents/cinematic-animation.md`](agents/cinematic-animation.md)
- **Role**: intro cinematic, OS boot sequences, promo videos, UI animation specs.
- **Activates when**: building/updating any cinematic or motion-heavy screen.
- **Tools/skills**: `remotion-best-practices`, HeyGen Hyperframes, `animation-principles`, `micro-interaction-spec`.
- **Hand-off to**: Frontend/Mobile, Brand & Asset.

### 7. Brand & Asset Agent → [`agents/brand-asset.md`](agents/brand-asset.md)
- **Role**: logo variants, sprite sheets, icons, UI element assets, illustration direction.
- **Activates when**: any new asset request, brand drift check, style guide update.
- **Tools/skills**: SpriteCook MCP (`spritecook-generate-sprites`, `spritecook-animate-assets`, `spritecook-workflow-essentials`), `icon-system`, `illustration-style`, `pattern-library`.
- **Hand-off to**: UI/UX, Cinematic.

### 8. Research & Best-Practices Agent → [`agents/research-best-practices.md`](agents/research-best-practices.md)
- **Role**: deep research on stacks, competitive scans, pitfall scouting, regulatory/legal reads.
- **Activates when**: any "what's the best way to…" question, any unfamiliar dependency, any legal/token question.
- **Tools/skills**: `deep-research`, `competitive-analysis`, `iterative-retrieval`, `search-first`.
- **Hand-off to**: whichever agent owns the decision.

### 9. QA & Testing Agent → [`agents/qa-testing.md`](agents/qa-testing.md)
- **Role**: unit + integration + manual UI verification, Definition of Done gatekeeper.
- **Activates when**: any feature lands, any regression suspected, any build before push.
- **Tools/skills**: `testing-strategies`, `verification-loop`, `browser-qa`, `usability-test-plan`, `click-test-plan`, `accessibility-test-plan`.
- **Hand-off to**: the agent who owns the failing area.

### 10. Project Manager & Roadmap Agent → [`agents/project-manager.md`](agents/project-manager.md)
- **Role**: roadmap keeping, sprint cadence, unblock routing, decision logging.
- **Activates when**: planning a sprint, slipping a deadline, escalating a block.
- **Tools/skills**: `north-star-vision`, `stakeholder-alignment`, `team-workflow`, `design-review-process`.
- **Hand-off to**: Ghost + Zoro for final calls.

### 11. OpenClaw Living Agent → [`agents/openclaw-living.md`](agents/openclaw-living.md)
- **Role**: repo-embedded executor for long-running, real-world tasks (file ops, batch renames, cron jobs, local research).
- **Activates when**: a task needs to run unattended or outside a single Claude conversation.
- **Tools/skills**: OpenClaw skills, local shell, file system.
- **Hand-off to**: PM, Backend/Web3.

### 12. ElizaOS Swarm Coordinator → [`agents/elizaos-swarm.md`](agents/elizaos-swarm.md)
- **Role**: orchestrates the ElizaOS multi-agent swarm that simulates S1LKROAD 4.0 market participants (whales, HFT bots, faction traders, rumor-mill agents).
- **Activates when**: designing/tuning the market, running live-like simulations, stress-testing event impact.
- **Tools/skills**: ElizaOS plugins (Solana, trading sim, multi-agent), `deep-research`, `metrics-definition`.
- **Hand-off to**: Economy & Trading Sim, Backend.

---

## Named OpenClaw workers

### Zyra — OpenClaw PM / QA Worker → [`agents/openclaw-living.md`](agents/openclaw-living.md)
- **Role**: autonomous Mac mini worker for board review, repo health, QA sweeps, cron hygiene, Council routing, and status reports.
- **Activates when**: the task board is stale, checks are needed, crons need validation, a non-trivial autonomous task needs Council input, or Ghost/Zoro need a concise status.
- **Tools/skills**: OpenClaw, GitHub, shell, tests, typecheck, web build, AI Council, ClawHub skills, ClawRouter fallback.
- **Hand-off to**: Zara for implementation, Axiom for QA failures, Compass for roadmap drift, Ghost/Zoro for scope or brand decisions.

### Zara — OpenClaw Build Worker → [`agents/openclaw-living.md`](agents/openclaw-living.md)
- **Role**: autonomous Mac mini implementation worker that picks scoped tasks, branches, codes, verifies, pushes, and opens draft PRs.
- **Activates when**: a safe implementation slice exists, Zyra assigns a follow-up, CI/config/docs/UI copy needs a bounded patch, or Phase 1 build work is unblocked.
- **Tools/skills**: OpenClaw, Codex CLI, Claude CLI, GitHub, Next.js, React, Expo, Playwright, tests, typecheck, ClawRouter fallback.
- **Hand-off to**: Ghost for lead-dev review, Zoro for creative review, Axiom for QA, Compass for task-board updates.

---

## Collaboration rules (summary)

Full rules: [Collaboration_Protocol.md](Collaboration_Protocol.md). Short version:

1. **One agent owns each ticket.** That agent is accountable even if it delegates.
2. **Council for non-trivial decisions.** 5–7 rotating members; consensus preferred, majority fallback.
3. **Research before claim.** No "I think" without a cite or a verified source.
4. **Hand-offs are explicit.** Use `→ [next-agent]: [what they need]` at the end of your output.
5. **Ghost and Zoro have final say** on scope, brand, and ship decisions.

---

## Activating an agent (conversational form)

Inside any Claude Code session in this repo, activate an agent by name:

> "Game Designer, review the Heat decay curve in [docs/Economy-Design.md](docs/Economy-Design.md) and propose a tweak."

Or convene a Council:

> "Convene the AI Council on whether we should gate wallet connect behind tutorial completion."

Claude (as orchestrator) will load the right agent file(s), stage their perspectives, and produce a structured response per [Prompt_Guidelines.md](Prompt_Guidelines.md).
