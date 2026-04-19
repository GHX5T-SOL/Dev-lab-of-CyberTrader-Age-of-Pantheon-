# /backend — Supabase backend

Owned by Backend/Web3 Agent. Phase 0 skeleton only. Fleshed out starting Phase 1 week 2.

## Local dev

```bash
# prerequisites: Docker Desktop running, Supabase CLI installed
cd backend
npx supabase start
```

Then point `EXPO_PUBLIC_API_BASE_URL` and `SUPABASE_*` vars in `.env` at the local stack (the `supabase start` output prints the local URL + anon key).

## Structure

```
backend/
├── README.md
├── supabase/
│   ├── config.toml            ← supabase CLI config (created by `supabase init`)
│   ├── migrations/
│   │   └── 0001_init.sql      ← starter schema (Phase 0)
│   └── functions/
│       └── README.md          ← Deno Edge Functions land here in Phase 2
```

## Design rules

- RLS on **every** table. No exceptions.
- Mobile client **never** writes to `trades` or `ledger_entries` directly. Only Edge Functions do.
- Every migration is reversible (`DOWN` block or paired rollback script).
- Ledger invariants are enforced by Postgres triggers, not application code.
- Edge Functions validate every trade against a server-computed price from the deterministic engine.

## See also

- [../docs/Technical-Architecture.md](../docs/Technical-Architecture.md) — full schema + authority adapter design
- [../agents/backend-web3.md](../agents/backend-web3.md)
