# Economy Design

> The numbers, curves, and formulas behind trading, Heat, Energy, and rank. Owned by the Economy & Trading Sim Agent with review by Game Designer and Backend.

## Guiding principles

1. **Determinism**. Given the same seed, the same inputs produce the same outputs. Always.
2. **Player-authored tension**. Every decision (hold / buy / sell / rest) should feel non-trivial.
3. **No pay-to-win**. On-chain purchases accelerate *time*, never *outcomes*.
4. **Reversibility**. Bad balancing decisions are reversible via server-side engine swap. Don't hard-code values into client-unique state.

## PRNG

```ts
// src/engine/prng.ts
// Mulberry32, 32-bit seeded PRNG. Fast, good-enough distribution, deterministic.
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Seeds derive from `hash(player_id + tick_number + ticker)`. Each commodity gets its own stream per tick to keep cross-ticker noise independent.

## Price tick formula

```
new_price = base_price * (1
  + sector_bias
  + event_multiplier
  + liquidity_skew(player_trade_size, commodity_liquidity)
  + trend_momentum
  + random_walk(seed)
  - mean_reversion(base_price, current_price)
  - heat_pressure(player_heat)
)
```

Each term clamped to its window to prevent runaway compounding.

### Default windows (Phase 1)

| Term | Range | Notes |
|---|---|---|
| `sector_bias` | ±3% | per-commodity daily drift |
| `event_multiplier` | ±25% | decays over 1–8 ticks |
| `liquidity_skew` | -5% … +5% | proportional to (trade / depth) |
| `trend_momentum` | ±2% | EMA of last 10 tick deltas |
| `random_walk` | ±1.5% | mulberry32 output |
| `mean_reversion` | 0–2% pull | stronger farther from `base` |
| `heat_pressure` | 0–3% | spreads widen at heat > 60 |

### Tick cadence

- **Live**: 30–60s (varies slightly per commodity to avoid synchronized UI churn)
- **Offline**: capped at **100 simulated ticks** on return, bucketed into 10-tick summaries

## Commodity profiles

| Ticker | Base | Volatility | Heat risk | Event sensitivity |
|---|---:|---:|---:|---|
| FDST | 180 | high | med | supply shocks |
| PGAS | 520 | med | low | launch windows |
| NGLS | 90 | low | low | archivist auctions |
| HXMD | 240 | high | high | raid seasons |
| VBLM | 14 | low | very low | beginner safe |
| ORRS | 880 | high | med | news snaps in 2 ticks |
| SNPS | 430 | med | med | faction route shifts |
| MTRX | 1,200 | med | med | node unlocks |
| AETH | 70 | very high | high | pump-rumor cycles |
| BLCK | 2,500 | high | very high | contraband spikes |

## Heat mechanic

Heat is a 0–100 meter with three bands:

| Band | Range | Effects |
|---|---|---|
| Green | 0–29 | nominal spreads, full news credibility |
| Amber | 30–69 | +10% spread, 15% chance news is delayed 1 tick |
| Red | 70–100 | +25% spread, 30% chance news is false, eAgent sweep chance rises per tick |

### Heat accrual

- Per trade: `ceil(trade_value / 5000)` for low-risk commodities
- High-risk commodities (BLCK, AETH, HXMD): `ceil(trade_value / 2500)`
- Event-triggered: eAgent sweeps can add +10 instantly

### Heat decay

**Decay curve (default: exponential)**:
```
heat(t+1) = heat(t) * 0.985     // ~1.5%/tick
```

Per-tick decay is slow — active play cannot out-decay active risk. Accelerated decay via mission clears: `-5 heat` per mission.

*(Open question: linear vs exponential vs piecewise. Council decision target: end of week 4. Default in MVP: exponential.)*

## Energy mechanic

Energy is **time-based**, not action-based. Cleaner UX and blocks grinding.

- Starter allotment: **72 hours = 259,200 seconds**
- Drain rate: 1s per real-life 1s while the player is **actively playing**
- Offline drain: capped at 8h/day (i.e., stepping away overnight doesn't nuke a new player)
- Dormant Mode: at 0 energy, no trading, no missions, no leaderboard. Player can still browse.
- Refill: 1h energy = 1,000 0BOL (in-game) or optional $OBOL pack (feature-flagged)

## Rank XP

Source-weighted to reward *variety*, not grinding:

| Source | XP |
|---|---:|
| First profitable trade of day | +50 |
| Any profitable trade | +5 |
| Surviving an event with < +10 Heat | +20 |
| Completing a mission | +40 |
| Node capture (AgentOS+) | +60 |
| Tutorial step | +15 |
| Leaderboard top-100 at week close | +200 |

### Rank curve

Geometric, tuned so Rank 5 arrives in ~6 hours of focused play, Rank 20 in ~60 hours:

```
xp_to_rank(r) = 100 * 1.35^r
cumulative_xp(r) = sum_{i=0..r} xp_to_rank(i)
```

Tunable via constants in `src/engine/rank.ts`. All numbers are initial; ElizaOS simulation will refine.

## Ledger invariants (must hold)

1. `sum(ledger_entries.delta by player, currency) === current balance`
2. Every trade produces **exactly two** ledger entries (currency out, asset in, or vice versa) and **one** trade row.
3. `balance_after` on each ledger row equals `balance_before + delta`.

Enforced in `SupabaseAuthority` via a Postgres trigger.

## Legal guardrails

- **No loot boxes. No paid randomized rewards.** If a proposed feature has "random outcome + real money" → block.
- **$OBOL on-chain is feature-flagged and regionally gated.** Not available in jurisdictions that classify it as a security or prohibit game tokens.
- **0BOL is non-withdrawable, non-transferable, explicit in the TOS.**

## Simulation and tuning

The Economy & Trading Sim Agent + ElizaOS Swarm Coordinator run **multi-agent simulations** weekly during Phase 1–2:

- ~500 simulated Eidolons with diverse strategies
- 30-day accelerated clock
- Output: median PnL distribution, Heat distribution, rank progression, dormancy rate
- Targets:
  - Median rank-5 reach: 4–8 hours
  - Dormancy rate (week 1): < 15%
  - Top 10% / median PnL ratio: < 8x (prevent whale-blowouts)

Simulation runs live in `simulations/` (ElizaOS project). Reports land in `docs/sim-reports/`.
