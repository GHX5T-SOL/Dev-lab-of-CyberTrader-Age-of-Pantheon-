# Technical Architecture

> How the game is actually built. Locked for Phase 1; Phase 2+ additions require a council session.

## Recommendation: **Expo + React Native + TypeScript + Supabase**

### Why this stack (vs alternatives)

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Expo + RN + TS** ✅ | fast iteration, OTA updates, Solana Mobile Wallet Adapter, v5 already uses it, web export | native modules complexity at scale | **chosen** |
| Unity | AAA visuals, 3D out-of-the-box | huge overhead for a 2D terminal game, slower iteration, harder Web3 integration | rejected for MVP |
| Unity + RN hybrid | flexibility | double the surface area, double the bugs | rejected — premature |
| Godot | free, lightweight, scripting-friendly | smaller Web3 ecosystem, no Solana Mobile SDK, harder App Store deploy | rejected |
| Flutter | single codebase | weaker Web3/Solana story than RN | rejected |

The game is **primarily a stylized 2D terminal UI** with occasional 3D (PantheonOS map). Expo handles this. If PantheonOS later needs real 3D, we add Three.js via `expo-gl` or a WebView fallback.

## Layer map

```
┌────────────────────────────────────────────────────────────┐
│  UI layer (React Native + Reanimated + SVG)                │
│  screens/, components/, theme/                             │
├────────────────────────────────────────────────────────────┤
│  State layer (Zustand + MMKV persistence)                  │
│  state/ — player, market, ui, notifications                │
├────────────────────────────────────────────────────────────┤
│  Engine layer (pure TS, deterministic, portable)           │
│  engine/ — market ticker, trade executor, heat/energy,     │
│            news generator, PRNG, offline resolver          │
├────────────────────────────────────────────────────────────┤
│  Authority adapter (interface)                             │
│  adapter/ — profile, wallet, market, trade validate,       │
│             energy purchase, rank, notifications           │
├────────────────────────────────────────────────────────────┤
│       ↓ local impl (MVP)            ↓ remote impl          │
│  LocalAuthority                  SupabaseAuthority         │
│  (pure engine calls)             (Postgres + Edge Fns)     │
└────────────────────────────────────────────────────────────┘
```

The **authority adapter** is the critical abstraction. Engine + UI never talk to storage/network directly. This lets us:

1. Ship MVP with local-first, no backend.
2. Swap `LocalAuthority` → `SupabaseAuthority` without touching UI or engine.
3. Fuzz-test engine in isolation.

## Dependency list (Phase 1, locked)

### Mobile runtime
- `expo` (latest stable SDK)
- `react-native`
- `typescript`
- `expo-router` — navigation
- `react-native-reanimated` — animations
- `react-native-gesture-handler`
- `react-native-svg` — charts, custom icons
- `react-native-mmkv` — fast key-value persistence
- `zustand` — client state

### Web3 (feature-flagged)
- `@solana-mobile/mobile-wallet-adapter-protocol`
- `@solana-mobile/mobile-wallet-adapter-protocol-web3js`
- `@solana/web3.js`

### Backend
- `@supabase/supabase-js`
- Supabase CLI (dev)
- Deno for Edge Functions

### Dev
- `jest` + `@testing-library/react-native`
- `eslint` + `eslint-config-expo`
- `prettier`

### Forbidden in Phase 1
- Redux / MobX / Recoil (chose Zustand)
- any charting library that requires native linking (breaks Expo Go)
- react-navigation (we use Expo Router)
- Moment.js (use Date + Intl)

## Backend (Supabase)

### Postgres schema (minimum)

```sql
-- players
create table players (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique,
  dev_identity text unique,      -- nullable; for dev-identity fallback
  eidolon_handle text not null,
  os_tier text not null default 'PIRATE',
  rank integer not null default 0,
  faction text,                  -- null until AgentOS unlock
  created_at timestamptz default now()
);

-- resources (denormalized for fast reads)
create table resources (
  player_id uuid primary key references players(id),
  energy_seconds integer not null default 259200,  -- 72h
  heat integer not null default 0,
  integrity integer not null default 100,
  updated_at timestamptz default now()
);

-- positions (open + closed)
create table positions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id),
  ticker text not null,
  quantity numeric not null,
  avg_entry numeric not null,
  realized_pnl numeric not null default 0,
  opened_at timestamptz default now(),
  closed_at timestamptz
);

-- trades (audit log)
create table trades (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id),
  ticker text not null,
  side text not null check (side in ('BUY','SELL')),
  quantity numeric not null,
  price numeric not null,
  heat_delta integer not null,
  executed_at timestamptz default now()
);

-- currency ledger (0BOL authoritative)
create table ledger_entries (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id),
  currency text not null check (currency in ('0BOL','$OBOL')),
  delta numeric not null,
  reason text not null,
  balance_after numeric not null,
  created_at timestamptz default now()
);

-- market ticks (optional: materialize for offline replay)
-- market_news (headlines with credibility)
-- missions (Phase 2+)
-- factions, territories (Phase 3)
```

### Edge Functions (Phase 2+)

- `/trade-execute` — validates against server price, updates positions + ledger + heat atomically
- `/energy-purchase` — debits ledger, credits energy
- `/rank-recompute` — idempotent rank calculation from XP events
- `/offline-resolve` — given player + last-seen tick, returns capped tick deltas

All write paths go through Edge Functions. The mobile client **never** writes to trade or ledger tables directly.

## State management pattern

```ts
// src/state/playerStore.ts (sketch)
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const mmkv = new MMKV();
const storage = {
  getItem: (k: string) => mmkv.getString(k) ?? null,
  setItem: (k: string, v: string) => mmkv.set(k, v),
  removeItem: (k: string) => mmkv.delete(k),
};

export const usePlayer = create(persist(
  (set, get) => ({
    profile: null,
    resources: null,
    hydrate: async () => { /* calls authority adapter */ },
    // ...
  }),
  { name: 'player', storage: createJSONStorage(() => storage) }
));
```

## Testing strategy

- **Unit (engine)**: every pure engine function has a test with a fixed seed. Market tick determinism, PnL math, heat decay, energy drain.
- **Integration (authority adapter)**: both `LocalAuthority` and `SupabaseAuthority` pass the same test suite.
- **UI (component)**: React Native Testing Library for core screens.
- **Manual QA**: scripted checklist in [docs/QA-Checklist.md](QA-Checklist.md). First 10-minute loop is always part of the suite.

Definition of Done from v5 BUILD_PLAN carries forward.

## Performance budgets (mobile)

- Cold start to first interactive: **< 2.5s** on iPhone 12 / Pixel 5
- Market tick render: **< 8ms** (60fps floor, 120fps target on capable devices)
- Chart update: **< 16ms**
- Bundle size (JS): **< 3.5 MB** gzipped at MVP

## Observability

Phase 2: Sentry for errors, PostHog for events. Phase 1: dev-only `console` wrapped in a `log` util that's a no-op in production.

## Security

- Supabase RLS on every table. Player can only read/write own rows.
- Edge Functions validate every trade against server-computed price + deterministic engine state.
- Wallet adapter auth flow uses PKCE where available.
- No secrets in client bundle.
- `$OBOL` mint authority remains with a Solana multisig (Ghost + Zoro + treasury) when minted.

## Deploy targets

- **iOS** via EAS → TestFlight → App Store
- **Android** via EAS → Internal Testing → Play Store
- **Web** via `expo export --platform web` → a static host (we are NOT committing to Vercel; options include Netlify, Cloudflare Pages, or a simple static bucket). Web is secondary.

## Migration path

MVP local-first. As soon as MVP is playable end-to-end, migrate writes to Supabase behind the authority adapter. No UI or engine changes required.
