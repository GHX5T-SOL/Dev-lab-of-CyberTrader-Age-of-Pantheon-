# CLAUDE.md — Auto-loaded context for Claude Code

> This file is read at the start of every Claude Code session in this repo. Keep it concise; move detail into linked files.

## Project one-liner

**CyberTrader: Age of Pantheon** — a mobile cyberpunk trading simulator (2077 setting, Eidolon AI fragments trading on S1LKROAD 4.0 dark market with evolving cyberdeck OS tiers). Built by Ghost + Zoro. Powered by an AI team of 12 specialized subagents coordinated by an AI Council.

## Canonical vision source

`docs/Game-Design-Doc.md` (derived from v5 prototype's `BUILD_PLAN.md`). When anything conflicts, the Game Design Doc wins.

## Hard rules (non-negotiable)

1. **AI Council Consultation first.** Every complex response begins with a one-line `AI Council Consultation: [agents pinged + stance]` note. See [Prompt_Guidelines.md](Prompt_Guidelines.md).
2. **Never assume.** If a library API, tool command, or external service is referenced and you're not 100% sure, verify with WebFetch/WebSearch or by reading the source before writing code that depends on it.
3. **Newbie-friendly + pro-quality.** Ghost and Zoro are new to mobile game dev. Explain the *why* before the *how*, but ship professional code.
4. **No external IP.** All lore, faction names, commodity tickers, and city names are original. No Ghost in the Shell / Watch Dogs references.
5. **Deterministic economy.** Market price engine uses seeded PRNG so offline resolution and replay match.
6. **Mobile-first.** Portrait-first layouts. Web export exists but is secondary.
7. **Feature flags for incomplete systems.** Never expose unfinished territory/crew/raid UI in main nav.
8. **No loot boxes. No paid randomized rewards.** All blockchain features are feature-flagged and legally reviewed.
9. **Verify before risky/shared action.** Pushes, force-pushes, deletions, destructive DB ops — confirm with Ghost first.

## Where to find things

- **Vision & mechanics**: [docs/Game-Design-Doc.md](docs/Game-Design-Doc.md)
- **Tech architecture**: [docs/Technical-Architecture.md](docs/Technical-Architecture.md)
- **Roadmap**: [docs/Roadmap.md](docs/Roadmap.md)
- **Lore bible**: [docs/Lore-Bible.md](docs/Lore-Bible.md)
- **Economy design**: [docs/Economy-Design.md](docs/Economy-Design.md)
- **Brand guidelines**: [brand/brand-guidelines.md](brand/brand-guidelines.md)
- **AI team**: [agents.md](agents.md) + [`agents/`](agents/)
- **Council rules**: [AI_Council_Charter.md](AI_Council_Charter.md)
- **Collaboration**: [Collaboration_Protocol.md](Collaboration_Protocol.md)
- **Prompt rules**: [Prompt_Guidelines.md](Prompt_Guidelines.md)

## Tech stack (locked for Phase 1)

- **Mobile**: Expo (latest stable) + React Native + TypeScript + Expo Router
- **State**: Zustand + MMKV
- **Animation**: React Native Reanimated + react-native-svg
- **Web3**: Solana Mobile Wallet Adapter (optional; dev-identity fallback required)
- **Backend**: Supabase (Postgres + Edge Functions)
- **Video/cinematics**: Remotion + HeyGen Hyperframes
- **Asset generation**: SpriteCook MCP
- **AI agent frameworks**: ElizaOS (market sim swarm), OpenClaw (repo executor), CatchMe (context memory), OPC-skills (solopreneur automation), Remotion skills (video)

## What NOT to do

- Do not introduce Redux, MobX, or Recoil (we chose Zustand).
- Do not add native modules that break Expo Go during Phase 1.
- Do not write placeholder main-nav screens that ship to players.
- Do not trust client-side math for money/rank long-term (server-authoritative adapter exists from day one).
- Do not use generic purple cyberpunk gradients — see [brand/brand-guidelines.md](brand/brand-guidelines.md).
- Do not create new docs without checking [agents.md](agents.md) for an owner.

## Session activation

At the start of a new session, Claude should:

1. Read this file (auto-loaded).
2. Skim [agents.md](agents.md) and [Prompt_Guidelines.md](Prompt_Guidelines.md).
3. Check `memory/MEMORY.md` for accumulated context.
4. Ask Ghost: "Which agent(s) are we activating today, and what's the goal?" — unless the prompt already makes it obvious.
