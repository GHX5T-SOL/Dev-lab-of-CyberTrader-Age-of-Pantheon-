-- ============================================================================
-- 0003_backend_functions.sql - complete backend helpers for Phase 1 Supabase
-- ============================================================================

create extension if not exists pgcrypto;

alter table public.players
  add column if not exists xp integer not null default 0 check (xp >= 0);

create table if not exists public.commodities (
  ticker text primary key,
  name text not null,
  base_price numeric not null check (base_price > 0),
  volatility text not null check (volatility in ('very_low','low','med','high','very_high')),
  heat_risk text not null check (heat_risk in ('very_low','low','med','high','very_high')),
  tags text[] not null default '{}',
  lore text,
  icon text
);

create table if not exists public.market_prices (
  id uuid primary key default gen_random_uuid(),
  ticker text not null,
  tick integer not null check (tick >= 0),
  price numeric not null check (price > 0),
  created_at timestamptz not null default now(),
  unique (ticker, tick)
);

insert into public.commodities (ticker, name, base_price, volatility, heat_risk, tags)
values
  ('FDST', 'Fractal Dust', 138, 'high', 'high', array['supply_shock','evasion']),
  ('PGAS', 'Plutonion Gas', 91, 'med', 'med', array['infrastructure','launch']),
  ('NGLS', 'Neon Glass', 73, 'low', 'low', array['archivist','memory']),
  ('HXMD', 'Helix Mud', 66, 'med', 'high', array['biohack','raid']),
  ('VBLM', 'Void Bloom', 24, 'low', 'very_low', array['starter','stabilizer']),
  ('ORRS', 'Oracle Resin', 112, 'med', 'med', array['news','signal']),
  ('SNPS', 'Synapse Silk', 84, 'med', 'med', array['faction','fiber']),
  ('MTRX', 'Matrix Salt', 58, 'low', 'low', array['lattice','unlock']),
  ('AETH', 'Aether Tabs', 41, 'high', 'high', array['rumor','pump']),
  ('BLCK', 'Blacklight Serum', 179, 'very_high', 'very_high', array['contraband','margin'])
on conflict (ticker) do update
set name = excluded.name,
    base_price = excluded.base_price,
    volatility = excluded.volatility,
    heat_risk = excluded.heat_risk,
    tags = excluded.tags;

-- Helper: append_ledger_entry (idempotent)
create or replace function public.append_ledger_entry(
  p_player_id uuid,
  p_currency text,
  p_delta numeric,
  p_reason text
) returns void as $$
declare
  current_balance numeric;
begin
  select balance_after into current_balance from public.ledger_entries
   where player_id = p_player_id and currency = p_currency
   order by created_at desc limit 1;
  if current_balance is null then
    if p_delta >= 0 then current_balance := p_delta;
    else raise exception 'Cannot start with negative balance';
    end if;
  else
    current_balance := current_balance + p_delta;
  end if;

  insert into public.ledger_entries (player_id, currency, delta, reason, balance_after)
  values (p_player_id, p_currency, p_delta, p_reason, current_balance);
end;
$$ language plpgsql security definer set search_path = public;

-- Helper: update_heat
create or replace function public.update_heat(p_player_id uuid, p_delta int)
returns void as $$
begin
  update public.resources
  set heat = greatest(0, least(100, heat + p_delta)),
      updated_at = now()
  where player_id = p_player_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Helper: add_energy (seconds)
create or replace function public.add_energy(p_player_id uuid, p_seconds int)
returns void as $$
begin
  update public.resources
  set energy_seconds = energy_seconds + p_seconds,
      updated_at = now()
  where player_id = p_player_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Helper: get_ledger
create or replace function public.get_ledger(p_player_id uuid)
returns table(zero_bol numeric, obol_token numeric) as $$
begin
  return query
  select
    coalesce((select balance_after from public.ledger_entries where player_id = p_player_id and currency = '0BOL' order by created_at desc limit 1), 0),
    coalesce((select balance_after from public.ledger_entries where player_id = p_player_id and currency = '$OBOL' order by created_at desc limit 1), 0);
end;
$$ language plpgsql security definer set search_path = public;

-- Helper: add_xp
create or replace function public.add_xp(p_player_id uuid, p_delta int)
returns void as $$
begin
  if auth.uid() is not null and not exists (
    select 1 from public.players
    where id = p_player_id
      and auth_user_id = auth.uid()
  ) then
    raise exception 'player not owned by current auth user';
  end if;

  update public.players
  set xp = greatest(0, xp + p_delta),
      rank = greatest(1, 1 + floor(greatest(0, xp + p_delta) / 100)::int)
  where id = p_player_id;
end;
$$ language plpgsql security definer set search_path = public;

-- Ensure RLS is enabled and set appropriate policies (if not already done)
alter table public.players enable row level security;
alter table public.resources enable row level security;
alter table public.positions enable row level security;
alter table public.trades enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.market_prices enable row level security;
alter table public.market_news enable row level security;
alter table public.commodities enable row level security;

-- Players: users can only see their own row
drop policy if exists "Players select own" on public.players;
create policy "Players select own" on public.players for select
using (auth.uid() = id or auth.uid() = auth_user_id);

-- Resources
drop policy if exists "Resources select own" on public.resources;
create policy "Resources select own" on public.resources for select
using (
  player_id = auth.uid()
  or exists (select 1 from public.players where players.id = resources.player_id and players.auth_user_id = auth.uid())
);

-- Positions
drop policy if exists "Positions select own" on public.positions;
create policy "Positions select own" on public.positions for select
using (
  player_id = auth.uid()
  or exists (select 1 from public.players where players.id = positions.player_id and players.auth_user_id = auth.uid())
);

-- Trades
drop policy if exists "Trades select own" on public.trades;
create policy "Trades select own" on public.trades for select
using (
  player_id = auth.uid()
  or exists (select 1 from public.players where players.id = trades.player_id and players.auth_user_id = auth.uid())
);

-- Ledger entries
drop policy if exists "Ledger select own" on public.ledger_entries;
create policy "Ledger select own" on public.ledger_entries for select
using (
  player_id = auth.uid()
  or exists (select 1 from public.players where players.id = ledger_entries.player_id and players.auth_user_id = auth.uid())
);

-- Market prices: anyone can read
drop policy if exists "Prices read public" on public.market_prices;
create policy "Prices read public" on public.market_prices for select using (true);

-- Market news: anyone can read
drop policy if exists "News read public" on public.market_news;
create policy "News read public" on public.market_news for select using (true);

-- Commodities: anyone can read
drop policy if exists "Commodities read public" on public.commodities;
create policy "Commodities read public" on public.commodities for select using (true);

grant execute on function public.append_ledger_entry(uuid, text, numeric, text) to service_role;
grant execute on function public.update_heat(uuid, int) to service_role;
grant execute on function public.add_energy(uuid, int) to service_role;
grant execute on function public.get_ledger(uuid) to authenticated, service_role;
grant execute on function public.add_xp(uuid, int) to authenticated, service_role;
