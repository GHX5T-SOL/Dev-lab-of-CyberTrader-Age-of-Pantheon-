-- ============================================================================
-- 0001_init.sql — starter schema for CyberTrader: Age of Pantheon
-- ----------------------------------------------------------------------------
-- Phase 0 skeleton. Tables only. RLS policies + triggers land in 0002.
-- Reversible: see `-- DOWN` section at bottom.
-- ============================================================================

-- players -------------------------------------------------------------------
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  wallet_address text unique,
  dev_identity text unique,
  eidolon_handle text not null,
  os_tier text not null default 'PIRATE' check (os_tier in ('PIRATE','AGENT','PANTHEON')),
  rank integer not null default 0 check (rank >= 0),
  faction text check (faction in ('FREE_SPLINTERS','BLACKWAKE','NULL_CROWN','ARCHIVISTS')),
  created_at timestamptz not null default now()
);

-- resources -----------------------------------------------------------------
create table if not exists public.resources (
  player_id uuid primary key references public.players(id) on delete cascade,
  energy_seconds integer not null default 259200 check (energy_seconds >= 0),
  heat integer not null default 0 check (heat between 0 and 100),
  integrity integer not null default 100 check (integrity between 0 and 100),
  stealth integer not null default 0 check (stealth between 0 and 100),
  influence integer not null default 0 check (influence between 0 and 100),
  updated_at timestamptz not null default now()
);

-- positions -----------------------------------------------------------------
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  ticker text not null,
  quantity numeric not null,
  avg_entry numeric not null,
  realized_pnl numeric not null default 0,
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);

create index if not exists positions_player_open_idx
  on public.positions(player_id)
  where closed_at is null;

-- trades (audit log) --------------------------------------------------------
create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  ticker text not null,
  side text not null check (side in ('BUY','SELL')),
  quantity numeric not null check (quantity > 0),
  price numeric not null check (price > 0),
  heat_delta integer not null,
  executed_at timestamptz not null default now()
);

create index if not exists trades_player_time_idx on public.trades(player_id, executed_at desc);

-- ledger (0BOL authoritative, $OBOL mirrored from chain) -------------------
create table if not exists public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  currency text not null check (currency in ('0BOL','$OBOL')),
  delta numeric not null,
  reason text not null,
  balance_after numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists ledger_player_currency_time_idx
  on public.ledger_entries(player_id, currency, created_at desc);

-- market news ---------------------------------------------------------------
create table if not exists public.market_news (
  id uuid primary key default gen_random_uuid(),
  headline text not null,
  affected_tickers text[] not null,
  credibility integer not null check (credibility between 0 and 100),
  price_multiplier numeric not null,
  tick_published integer not null,
  tick_expires integer not null
);

-- ============================================================================
-- DOWN (manual rollback)
-- ============================================================================
--   drop table if exists public.market_news;
--   drop table if exists public.ledger_entries;
--   drop table if exists public.trades;
--   drop table if exists public.positions;
--   drop table if exists public.resources;
--   drop table if exists public.players;
