# Backend Demo Status

> What the backend needs for a playable demo, and what now exists in the repo.

## Honest answer

For a **solo playable internal demo**, the backend is **not the current blocker**. The blocker is still the playable game loop in `src/`.

For anything beyond a local-only toy, the backend needs four things:
- player bootstrap
- row-level security
- transactional trade writes
- energy refill writes

Those foundations now exist in the repo as SQL scaffolding, and the mobile app
now has a feature-flagged Supabase authority path that can sit behind the same
first playable UI.

## What was added

### 1. Auth + player mapping

`backend/supabase/migrations/0002_phase1_foundation.sql`

- adds `players.auth_user_id`
- adds `public.current_player_id()`
- keeps `dev_identity` for local/dev bootstrap

### 2. RLS on every table

The Phase 0 schema said this was required but it was not implemented. The new migration enables RLS and adds policies for:
- `players`
- `resources`
- `positions`
- `trades`
- `ledger_entries`
- `market_news`

### 3. Dev-player bootstrap

`public.bootstrap_dev_player(p_eidolon_handle, p_dev_identity)`

This function:
- creates or reuses a player
- creates `resources`
- seeds the starting `0BOL` ledger entry

That gives us a clean bridge between dev identity and a future authenticated player row.

### 4. Transactional SQL write paths

Two SQL functions now exist for future Edge Functions:
- `public.execute_trade_atomic(...)`
- `public.purchase_energy_atomic(...)`

These are the real backend heart of the demo path. Once the app starts talking to Supabase, these are the safest write points to call from signed server handlers.

`backend/supabase/migrations/0003_supabase_authority_energy_cost.sql` updates
`execute_trade_atomic(...)` so the edge function can pass the same side/quantity
energy cost used by the local authority.

### 5. Edge Function write path

Implemented:
- `backend/supabase/functions/trade-execute/index.ts`
- `backend/supabase/functions/energy-purchase/index.ts`

These handlers validate the caller through Supabase Auth, verify the requested
player belongs to that auth user, compute the current demo price server-side, and
delegate writes to:
- `public.execute_trade_atomic(...)`
- `public.purchase_energy_atomic(...)`

They are not deployed automatically; they become live only after the Supabase
project and CLI deployment are set up.

### 6. Feature-flagged client authority

Implemented:
- `src/lib/supabase.ts`
- `src/authority/supabase-authority.ts`
- feature flag selection in `src/authority/index.ts`

The default remains `LocalAuthority`. Setting
`EXPO_PUBLIC_USE_SUPABASE_AUTHORITY=true` plus
`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` switches the
mobile app to `SupabaseAuthority`.

## What is still missing before Supabase becomes live gameplay backend

- actual Supabase project creation and env wiring
- Supabase anonymous auth enabled or a real login path added
- deploying the two edge functions through Supabase CLI
- integration tests for SQL functions and edge handlers
- a server-backed XP/rank model; current Supabase rank reads the player row but does not yet mirror LocalAuthority XP exactly

## Recommended order

1. Finish the playable demo in `src/`
2. Add a `LocalAuthority` implementation for the demo loop
3. Create the Supabase project
4. Enable anonymous auth or wire a real login provider
5. Deploy the migrations
6. Deploy `trade-execute` and `energy-purchase`
7. Flip `EXPO_PUBLIC_USE_SUPABASE_AUTHORITY=true`

## Bottom line

We now have the **backend foundation and client authority bridge**, but the game
is still not backend-blocked.
The fastest road to a working demo is still:
- finish the loop in the app
- then swap the write path from local state to Supabase
