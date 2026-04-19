# /backend/supabase/functions — Edge Functions (Deno)

Empty in Phase 0. Phase 2 deliverables:

| Function | Purpose |
|---|---|
| `trade-execute` | validate + write atomic: trade + position + ledger + heat |
| `energy-purchase` | debit ledger, credit energy, enforce cap |
| `rank-recompute` | idempotent XP → rank computation |
| `offline-resolve` | capped tick resolution when a player returns |

## Scaffold one

```bash
npx supabase functions new trade-execute
```

## Design rules

- Deno runtime. No Node APIs.
- Every function must return structured error with `code` + `message` + `retryable` flag.
- Every function includes its own set of integration tests in `__tests__/`.
- All writes are transactional (Postgres function or explicit `begin/commit`).
- Every handler validates the caller's JWT and derives `player_id` from it — **never** from request body.
