# Backend Demo Status

> What the backend needs for a playable demo, and what now exists in the repo.

## Honest answer

For a **solo playable internal demo**, the backend is **not the current blocker**. The blocker is still the playable game loop in `src/`.

For anything beyond a local-only toy, the backend needs four things:
- player bootstrap
- row-level security
- transactional trade writes
- energy refill writes

Those foundations now exist in the repo as SQL scaffolding.

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

### 5. Edge Function stubs

Scaffolded:
- `backend/supabase/functions/trade-execute/index.ts`
- `backend/supabase/functions/energy-purchase/index.ts`

They intentionally return `501` for now so the intended API surface exists without pretending it is production-ready.

## What is still missing before Supabase becomes live gameplay backend

- actual Supabase project creation and env wiring
- JWT-derived player bootstrap flow from app code
- authoritative server price computation inside the edge functions
- app-side adapter that swaps from local demo state to Supabase-backed writes
- integration tests for SQL functions and edge handlers

## Recommended order

1. Finish the playable demo in `src/`
2. Add a `LocalAuthority` implementation for the demo loop
3. Create the Supabase project
4. Wire `bootstrap_dev_player`
5. Wire `trade-execute`
6. Wire `energy-purchase`

## Bottom line

We now have the **backend foundation**, but the game is still not backend-blocked.
The fastest road to a working demo is still:
- finish the loop in the app
- then swap the write path from local state to Supabase
