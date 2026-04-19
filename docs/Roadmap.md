# Roadmap — 30-day plan + beyond

> Rebuilt from v5 `BUILD_PLAN.md` with AI-team cadence, council checkpoints, and verification gates. Dates are from **2026-04-19** (today).

## Phase 0 — Foundation (this week, 2026-04-19 → 2026-04-25)

**Goal**: organized workspace, team activated, scaffolds in place. No feature code yet.

| Day | Deliverable | Owner |
|---|---|---|
| D1 (04-19) | Dev Lab repo scaffolded, agents defined, council charter, brand v1, Game Design Doc, Roadmap, setup.sh | Orchestrator (this session) |
| D2 | Expo app boots on device + web, Zustand + MMKV wired, theme tokens imported | Frontend/Mobile |
| D3 | Supabase local stack running, schema migrated, authority adapter interface defined | Backend/Web3 |
| D4 | Deterministic PRNG + market tick engine skeleton + first unit tests | Economy & Trading Sim |
| D5 | First SpriteCook asset batch: Eidolon mark, 4 faction sigils, 10 commodity icons | Brand & Asset |
| D6 | Intro cinematic storyboard (Remotion skeleton scene) | Cinematic & Animation |
| D7 | Council retrospective on Phase 0, Phase 1 scope lock | Council |

## Phase 1 — MVP (weeks 2–5, 2026-04-26 → 2026-05-23)

**Goal**: the v5 BUILD_PLAN Phase 1 deliverables, organized and AI-augmented.

### Week 2 (04-26 → 05-02): boot + trading terminal
- Intro cinematic MVP (45s, skippable, replayable)
- Wallet/login with dev-identity fallback
- Ag3nt_0S//pIRAT3 boot sequence
- S1LKROAD terminal screen skeleton
- 10 commodities visible with live ticking prices
- Unit tests: market tick determinism, PRNG seed reproducibility

### Week 3 (05-03 → 05-09): trade loop
- Buy / sell flow end-to-end
- Position tracking (avg entry, realized/unrealized PnL)
- Energy drain + Dormant Mode
- Heat increment + slow decay
- 0BOL ledger (local authority)
- Unit tests: PnL math, energy drain, heat decay

### Week 4 (05-10 → 05-16): progression + news
- Rank + XP
- News system with credibility scores
- 3 event types (supply shock, pump rumor, eAgent sweep)
- Profile, inventory, rank screens
- Tutorial overlay guiding first buy/sell
- Unit tests: rank XP, news impact on price

### Week 5 (05-17 → 05-23): polish + verify
- 13 MVP screens complete (no placeholders)
- Settings, help/glossary, notifications
- Manual QA run-through (full 10-min tutorial loop)
- Type check + lint + tests green
- Bundle size + cold-start budgets hit
- Phase 1 ship to TestFlight internal + Play Internal Testing

**Phase 1 Definition of Done** (from v5 BUILD_PLAN, carries forward):
- Zero TypeScript errors or failing tests
- No runtime console errors on first launch
- No blank screens or placeholder main nav
- No inaccessible tap targets
- No unattributed protected IP
- First 10-minute loop completable without developer help

**Phase 1 gate**: AI Council convenes. If all ✅, proceed to Phase 2.

## Phase 2 — Progression & Polish (weeks 6–8, 2026-05-24 → 2026-06-13)

**Goal**: AgentOS unlock + faction system + missions.

- Rank 5 OS upgrade ceremony (cinematic)
- Faction selection flow + one-free-switch rule
- Node puzzle missions (routing, signal timing, pattern prediction)
- Route map (SVG)
- Market scanner
- Limit order simulation
- Active position management
- Energy auto-buy
- eAgent sweep events

## Phase 3 — Endgame & Territory (weeks 9–11, 2026-06-14 → 2026-07-04)

**Goal**: PantheonOS unlock + territory + crew.

- Rank 20 OS upgrade ceremony
- 3D Neon Void city map (SVG → Three.js if feasible)
- Territory control + faction overlays (flagged)
- Crew formation
- Advanced raids (flagged until stable)
- Pantheon memory shard storyline
- Seasonal leaderboard

## Phase 4 — Soft launch (weeks 12–13, 2026-07-05 → 2026-07-18)

- Beta with ~100 players (invite)
- Economy tuning via ElizaOS swarm + real-player data
- Bug bash
- Legal review of $OBOL mint path
- App Store + Play Store submission

## Phase 5 — Public launch (TBD, target 2026-08)

- Seasonal events live
- Creator program (if legal)
- Regional rollout

## Long-term backlog (post-launch)

- Cross-faction treaty / betrayal events
- Pantheon memory shard story chapters (seasonal)
- Optional non-loot-box cosmetic marketplace
- Community moderation + reporting tools
- $OBOL regional availability expansion (per jurisdiction)

## Council checkpoints

Convene every Sunday at phase end. Standing agenda: hit/miss, blocker triage, next week scope.

## Escalation triggers

- Any slip > 3 days on a milestone → PM drafts recovery plan → council → Ghost
- Any legal/regulatory finding → immediate escalation (no council)
- Any economy change > 10% affecting existing players → council mandatory

## Living doc

This roadmap is updated at each council checkpoint. Diffs preserved in git.
