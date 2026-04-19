# Dev Lab of CyberTrader: Age of Pantheon

> **The single organized hub** where Ghost, Zoro, and the full AI team turn five scattered prototypes into a shippable cyberpunk trading game.

[![status](https://img.shields.io/badge/status-phase--0--foundation-00ffcc)]()
[![platform](https://img.shields.io/badge/platform-Expo%20%7C%20iOS%20%7C%20Android%20%7C%20Web-00ffcc)]()
[![web3](https://img.shields.io/badge/web3-Solana-14F195)]()

---

## What this repo is

A **playground + workspace + command center** for CyberTrader: Age of Pantheon — a mobile cyberpunk trading simulator set in 2077 where players are rogue Eidolons running evolving cyberdeck OS tiers (Ag3nt_0S//pIRAT3 → AgentOS → PantheonOS) and trading commodities on the dark market S1LKROAD 4.0.

**Canonical vision source**: the v5 prototype's `BUILD_PLAN.md`. This Dev Lab absorbs, cleans, and continues from there — but with rock-solid organization, an AI team, and a real ship pipeline.

## Who this is for

- **Ghost** (founder, product + creative direction)
- **Zoro** (co-founder)
- **The AI Team** — 12 specialized subagents coordinated by an AI Council (see [agents.md](agents.md) and [AI_Council_Charter.md](AI_Council_Charter.md))

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

## Current phase: **Phase 0 — Foundation**

Goal: clean organization, ship-ready scaffolding, team activated. No feature code yet.

Next phase: **Phase 1 — MVP** (pirate-OS trading loop from v5 BUILD_PLAN weeks 1–4). See [docs/Roadmap.md](docs/Roadmap.md).

## Brand & vision (one-line)

> A **ghost in the machine** hacker terminal, built like a premium mobile game, trading across the neon void of 2077 — every pixel feels like a working cyberdeck, not a website.

Full brand guidelines: [`brand/brand-guidelines.md`](brand/brand-guidelines.md).

## Contributing (humans)

Every non-trivial change goes through the AI Council. See [Collaboration_Protocol.md](Collaboration_Protocol.md).

## License

UNLICENSED / proprietary to Ghost & Zoro during pre-launch. License TBD at public release.
