# Dev Lab of CyberTrader: Age of Pantheon

> **The single organized hub** where Ghost, Zoro, and the full AI team turn six scattered prototypes into a shippable cyberpunk trading game.

[![status](https://img.shields.io/badge/status-phase--b--live--3d--dev--lab-00ffcc)]()
[![platform](https://img.shields.io/badge/platform-Expo%20%7C%20iOS%20%7C%20Android%20%7C%20Web-00ffcc)]()
[![web3](https://img.shields.io/badge/web3-Solana-14F195)]()

---

## What this repo is

A **playground + workspace + command center** for CyberTrader: Age of Pantheon — a mobile cyberpunk trading simulator set in 2077 where players are rogue Eidolons running evolving cyberdeck OS tiers (Ag3nt_0S//pIRAT3 → AgentOS → PantheonOS) and trading commodities on the dark market S1LKROAD 4.0.

**Canonical vision source**: the v5 prototype's `BUILD_PLAN.md`. **Canonical playable build**: `CyberTrader-Age-of-Pantheon-v6`, exported from this Dev Lab's `src/` app and verified as the active game repo on 2026-04-25. This Dev Lab remains the organized source of docs, decisions, and the wider ship pipeline.

## Who this is for

- **Ghost** (founder, Lead Developer, elite human coder, final technical sign-off)
- **Zoro** (co-founder, Creative Lead, artistic visionary, final feel/brand sign-off)
- **The AI Team** — 12 specialized subagents coordinated by an AI Council (see [agents.md](agents.md) and [AI_Council_Charter.md](AI_Council_Charter.md))
- **Zara + Zyra** — OpenClaw Living Agents on the secure Mac mini node (`ssh zyra-mini` over Tailscale) for local file ops, GLB processing, heartbeat checks, and long-running render queues.

## Quickstart

```bash
# 1. Clone
git clone https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-.git
cd Dev-lab-of-CyberTrader-Age-of-Pantheon-

# 2. Run the one-command setup (prompts before anything destructive)
bash setup.sh

# 3. Fill secrets
cp .env.example .env
# then edit .env with your keys

# 4. Start the mobile app (Expo)
npm run dev:mobile

# 5. Launch the AI team workspace
npm run team:activate
```

Full step-by-step for a newbie: **[SETUP.md](SETUP.md)**.

## Repo structure

```
.
├── README.md                    ← you are here
├── SETUP.md                     ← newbie-friendly setup walkthrough
├── CLAUDE.md                    ← auto-loaded context for Claude Code sessions
├── agents.md                    ← master index of the AI team
├── AI_Council_Charter.md        ← governance for AI Council decisions
├── Collaboration_Protocol.md    ← how humans + agents + subagents work together
├── Prompt_Guidelines.md         ← permanent prompting rules (Claude obeys these)
├── package.json                 ← npm scripts hub
├── setup.sh                     ← one-command installer
├── .env.example                 ← secrets template
│
├── brand/                       ← brand guidelines, logos, color, typography
├── docs/                        ← Game Design Doc, Technical Arch, Roadmap, Lore
├── agents/                      ← one file per subagent (roles, skills, triggers)
├── skills/                      ← installed Claude skill configs + examples
├── src/                         ← Expo / React Native mobile app
├── backend/                     ← Supabase schema + edge functions
├── design-system/               ← tokens, components contracts
├── assets/                      ← icons, sprites, UI, audio, cinematics
├── playground/                  ← experimental scratch area (gitignored)
└── memory/                      ← persistent project memory (auto-loaded)
```

## The AI Team at a glance

| Agent | Mission |
|---|---|
| Game Designer | Mechanics, balance, player psychology, progression curves |
| UI/UX & Cyberpunk Aesthetic | Terminal look, motion, CRT feel, mobile ergonomics |
| Frontend/Mobile | Expo, React Native, Reanimated, offline-first |
| Backend/Web3 | Supabase, Edge Functions, Solana Mobile Wallet Adapter |
| Economy & Trading Sim | Deterministic market engine, commodity tuning, Heat/Energy |
| Cinematic & Animation | Remotion + Hyperframes, intros, OS boot sequences |
| Brand & Asset | Logo variants, sprites, icons (SpriteCook), illustration |
| Research & Best-Practices | Deep research, competitive analysis, pitfalls |
| QA & Testing | Unit + integration + manual UI verification |
| Project Manager | Roadmap, sprint cadence, unblocks |
| OpenClaw Living | Repo-embedded executor for file ops and long-running tasks |
| ElizaOS Swarm Coordinator | Multi-agent market simulation and Web3 agent orchestration |

Detailed profiles: [`/agents/`](agents/).

## Current phase: **Phase B — Live 3D Dev Lab**

Phase 0 foundation is complete. The web companion now runs as a Phase B command center: `/office` is a password-gated office-game runtime with founder selection, in-world movement, local GLB avatars, React Three Fiber office traversal, OpenClaw node surfacing, persistent credit meter, and a large owner-tagged Whiteboard for Ghost, Zoro, the AI Council, Zara, and Zyra.

Next game phase: **Phase 1 - MVP hardening**. The core playable loop now lives in the v6 game repo; Dev Lab work should focus on validation, balancing, cross-platform QA, SupabaseAuthority, and deployment readiness. See [docs/Roadmap.md](docs/Roadmap.md), [PHASE_B.md](PHASE_B.md), and [docs/V6-Prototype-Export.md](docs/V6-Prototype-Export.md).

## CyberTrader v6 current state

The selected playable build is now:

```text
https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6
```

What is in place in v6:

- Working LocalAuthority buy/sell loop with 0BOL ledger updates, inventory positions, average entry, realized PnL, XP, rank, and inventory slots.
- Real-time game loop: clock, 30-second market ticks, deterministic news, missed-tick catch-up, heat decay, travel resolution, courier resolution, and raid checks.
- World systems: 10 locations, location pricing, travel lockouts, Black Market heat reduction, heat/bounty pressure, raids, and courier shipments.
- Engagement systems: flash market events, NPC missions, dynamic district states, trade streaks, daily challenges, bounty escalation, away report, and action feedback.
- Intro cinematic route using the shipped MP4, with browser smoke verification that `/video-intro` plays and can hand off into the intro flow.

Most recent v6 verification recorded in Dev Lab: `npm run typecheck`, `npm test -- --runInBand`, `npx expo export --platform web`, and browser smoke for intro/login/trading passed on the exported game.

## Prototype lineup

- `v1` to `v4` are archived reference prototypes.
- `v5` remains the design-source reference because its `BUILD_PLAN.md` seeded the current roadmap.
- `v6` is the chosen playable game branch and lives in its own repo: `https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v6`
- This Dev Lab continues as the command center where docs, planning, decisions, assets, and support systems stay organized around the shipping game.

## Brand & vision (one-line)

> A **ghost in the machine** hacker terminal, built like a premium mobile game, trading across the neon void of 2077 — every pixel feels like a working cyberdeck, not a website.

Full brand guidelines: [`brand/brand-guidelines.md`](brand/brand-guidelines.md).

## Contributing (humans)

Every non-trivial change goes through the AI Council. See [Collaboration_Protocol.md](Collaboration_Protocol.md).

## License

UNLICENSED / proprietary to Ghost & Zoro during pre-launch. License TBD at public release.
