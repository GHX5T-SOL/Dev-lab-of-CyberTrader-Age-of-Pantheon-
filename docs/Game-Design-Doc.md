# Game Design Doc — CyberTrader: Age of Pantheon

> Canonical design source. When anything conflicts with this doc, this doc wins. Derived from the v5 prototype's `BUILD_PLAN.md` + unification pass.

## One-line pitch

A rogue Eidolon — a shard of the shattered sentient Pantheon AI — wakes in a stolen cyberdeck in 2077 and trades futuristic commodities on the dark market S1LKROAD 4.0 to rebuild itself toward apotheosis.

## Core fantasy

You are not a trader. You are an **AI fragment posing as a trader** in a world where most humans think AIs were destroyed a decade ago. Every trade is a survival move. Every tick of Heat brings eAgents closer. Every rank up restores a piece of your former self.

## Core loop

```
cinematic intro
  → wallet connect (optional; dev-identity fallback)
  → OS boot (Ag3nt_0S//pIRAT3)
  → check Energy / Heat
  → read news + market scan
  → trade (buy low / sell high / react to events)
  → earn 0BOL / $OBOL
  → earn XP
  → rank up
  → unlock features / factions / 3D map
  → cycle
```

First 10-minute session must end with at least one profitable trade and a glimpse of the next OS tier.

## Three OS tiers

Progression is vertical through **operating system upgrades**, not cosmetic rank inflation.

### Tier 1 — Ag3nt_0S//pIRAT3 (Rank 0, starter)
Rough, glitchy pirate terminal. Only S1LKROAD trading. 10 commodities. No factions. No map. The prison-cell phase; player wants out.

### Tier 2 — AgentOS (Rank 5)
Clean upgrade. Faction selection. Missions. Route map. Limit orders. Heat management becomes a puzzle, not a surprise.

### Tier 3 — PantheonOS (Rank 20)
Endgame. 3D Neon Void city map. Territory control. Crew warfare. Raids. Pantheon memory shard storyline. Seasonal leaderboard.

## Resources

### Energy
Real-time drain, ~72-hour starter allotment at rank 0. Drains during active play and offline (capped offline ticks). Zero Energy = **Dormant Mode** (no trading, no missions). Refillable via 0BOL (in-game) or optional $OBOL (on-chain, feature-flagged).

### Heat
Rises from large trades and high-risk commodities. Decays slowly. High Heat → worse spreads, false news, eAgent sweep events, route blocks. Actively managing Heat is the core tension.

### Rank (XP-driven)
Primary progression. Sources: profitable trades, tutorial completion, events survived, missions cleared, nodes captured, leaderboard milestones.

Key ranks:

| Rank | Title | Unlock |
|---:|---|---|
| 0 | Boot Ghost | Pirate OS, tutorial |
| 5 | Node Thief | AgentOS, factions |
| 8 | Route Phantom | Tor Exit Node |
| 12 | Grid Smuggler | City route map |
| 20 | Pantheon Candidate | PantheonOS |
| 30 | Neon Warlord | Crew wars |

## Currencies

- **0BOL** (pronounced "obol") — soft currency. Free. Non-withdrawable. Awarded from gameplay. All players start with **1,000,000 0BOL**.
- **$OBOL** — optional on-chain SPL token (Solana). Used for premium packs and some cosmetic slots. Feature-flagged. Legally reviewed per jurisdiction.

## Commodities (the 10 launch tickers)

| Ticker | Name | Personality |
|---|---|---|
| **FDST** | Fractal Dust | high volatility, supply shocks |
| **PGAS** | Plutonion Gas | infrastructure demand spikes |
| **NGLS** | Neon Glass | archivist buyout events |
| **HXMD** | Helix Mud | raid/heat-wave demand |
| **VBLM** | Void Bloom | cheap, beginner-friendly |
| **ORRS** | Oracle Resin | news-sensitive premium |
| **SNPS** | Synapse Silk | faction route goods |
| **MTRX** | Matrix Salt | node unlock gate |
| **AETH** | Aether Tabs | pump/crash rumors |
| **BLCK** | Blacklight Serum | high Heat, high margin |

## Price engine

Deterministic seed-based random walk. Offline resolution produces identical results to live ticks. Inputs:

- sector bias
- event multipliers (news)
- liquidity skew (player's trade size vs commodity liquidity)
- trend momentum
- random walk (seeded)
- mean reversion pull
- Heat pressure (player-specific)

Ticks: every 30–60s live. Offline: capped simulated ticks on return.

## News system

Market-moving headlines with **credibility scores**. Some are false. Some are delayed. High-Heat players see **more false news** — a key pressure.

## Factions (unlocked at AgentOS)

Four choices. One free switch in early game only. Later switches cost 0BOL.

- **Free Splinters** — libertarian, prize price discovery, route flexibility
- **Blackwake** — smuggler crew, prize Heat mitigation and raid resistance
- **Null Crown** — faction-AI research sect, prize scanner quality and rumor filtering
- **Archivists** — memory hunters, prize news credibility and Pantheon shard progress

## Territory (PantheonOS)

3D Neon Void city map. Faction territory overlays. Nodes capturable via missions. Territory gives faction-wide trade discounts and story progression. Feature-flagged until fully functional.

## Crew wars (PantheonOS)

Small crews (4–8) engage in coordinated raids. Target: rival territory, high-value convoys, Pantheon shard sites. Feature-flagged.

## Offline play

All systems must resolve offline: market ticks (capped), Energy drain, Heat decay, mission timers. Player returns to a clear state-change summary.

## Data model (TypeScript)

Authoritative interfaces live in [src/engine/types.ts](../src/engine/types.ts). Summary:

- **PlayerProfile** — wallet, Eidolon handle, OS tier, rank, faction
- **Resources** — energy, heat, integrity, stealth, influence
- **Commodity** — ticker, name, price, volatility, Heat risk, event tags
- **Position** — quantity, average entry, realized/unrealized PnL
- **MarketNews** — headline, affected tickers, credibility, expiry tick
- **CurrencyLedger** — 0BOL (authoritative) + optional $OBOL representation

## Screens (13 MVP)

1. Intro cinematic (skippable after 4s, replayable)
2. Wallet / login / dev-identity
3. Pirate OS cyberdeck (dashboard)
4. Tutorial overlay
5. S1LKROAD terminal (trading)
6. Profile
7. Settings
8. Inventory
9. Progression
10. Rank / leaderboard
11. Rewards
12. Notifications
13. Help / glossary

No placeholder main-nav pages ship. Feature-flagged screens live behind flags in `.env`.

## Design non-negotiables

- Deterministic economy.
- Mobile-first portrait, web secondary.
- No loot boxes. No paid randomized rewards.
- No external IP.
- First 10-minute loop completable without help.
- Interface feels like a **working cyberdeck**.

## Council-locked mechanics (2026-04-24)

**Energy system**: 72h wall-clock allotment with offline tick capping (prevents exploitation while maintaining mobile game expectations)

**Faction switching**: First switch free, subsequent switches cost 0BOL (reduces onboarding friction for new players)

**Heat decay**: Exponential curve (creates strategic risk/reward depth for advanced players)

**Offline simulation**: 100-tick cap (balances user experience vs server performance costs)
