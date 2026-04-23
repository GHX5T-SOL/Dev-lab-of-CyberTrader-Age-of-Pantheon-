-- ============================================================================
-- 0002_phase1_foundation.sql - Phase 1 backend foundation
-- ----------------------------------------------------------------------------
-- Adds the minimum backend foundation needed for a playable vertical slice:
--   - auth-aware player mapping
--   - RLS on every table
--   - helper RPCs for bootstrapping a dev player
--   - transactional SQL functions intended for Edge Functions to call
--   - updated_at trigger for resources
-- ============================================================================

create extension if not exists pgcrypto;

-- players -------------------------------------------------------------------
alter table public.players
  add column if not exists auth_user_id uuid unique;

create index if not exists players_auth_user_id_idx
  on public.players(auth_user_id)
  where auth_user_id is not null;

-- helpers -------------------------------------------------------------------
create or replace function public.current_player_id()
returns uuid
language sql
stable
as $$
  select p.id
  from public.players p
  where p.auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists resources_touch_updated_at on public.resources;

create trigger resources_touch_updated_at
before update on public.resources
for each row
execute function public.touch_updated_at();

-- row level security --------------------------------------------------------
alter table public.players enable row level security;
alter table public.resources enable row level security;
alter table public.positions enable row level security;
alter table public.trades enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.market_news enable row level security;

drop policy if exists "players_select_own" on public.players;
create policy "players_select_own"
  on public.players
  for select
  to authenticated
  using (auth.uid() = auth_user_id);

drop policy if exists "players_update_own" on public.players;
create policy "players_update_own"
  on public.players
  for update
  to authenticated
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

drop policy if exists "resources_select_own" on public.resources;
create policy "resources_select_own"
  on public.resources
  for select
  to authenticated
  using (player_id = public.current_player_id());

drop policy if exists "resources_update_own" on public.resources;
create policy "resources_update_own"
  on public.resources
  for update
  to authenticated
  using (player_id = public.current_player_id())
  with check (player_id = public.current_player_id());

drop policy if exists "positions_select_own" on public.positions;
create policy "positions_select_own"
  on public.positions
  for select
  to authenticated
  using (player_id = public.current_player_id());

drop policy if exists "trades_select_own" on public.trades;
create policy "trades_select_own"
  on public.trades
  for select
  to authenticated
  using (player_id = public.current_player_id());

drop policy if exists "ledger_select_own" on public.ledger_entries;
create policy "ledger_select_own"
  on public.ledger_entries
  for select
  to authenticated
  using (player_id = public.current_player_id());

drop policy if exists "market_news_select_authenticated" on public.market_news;
create policy "market_news_select_authenticated"
  on public.market_news
  for select
  to authenticated
  using (true);

-- service-role / edge-function write paths ----------------------------------
drop policy if exists "players_insert_service_role" on public.players;
create policy "players_insert_service_role"
  on public.players
  for insert
  to service_role
  with check (true);

drop policy if exists "resources_insert_service_role" on public.resources;
create policy "resources_insert_service_role"
  on public.resources
  for insert
  to service_role
  with check (true);

drop policy if exists "positions_insert_service_role" on public.positions;
create policy "positions_insert_service_role"
  on public.positions
  for insert
  to service_role
  with check (true);

drop policy if exists "positions_update_service_role" on public.positions;
create policy "positions_update_service_role"
  on public.positions
  for update
  to service_role
  using (true)
  with check (true);

drop policy if exists "trades_insert_service_role" on public.trades;
create policy "trades_insert_service_role"
  on public.trades
  for insert
  to service_role
  with check (true);

drop policy if exists "ledger_insert_service_role" on public.ledger_entries;
create policy "ledger_insert_service_role"
  on public.ledger_entries
  for insert
  to service_role
  with check (true);

drop policy if exists "market_news_insert_service_role" on public.market_news;
create policy "market_news_insert_service_role"
  on public.market_news
  for insert
  to service_role
  with check (true);

drop policy if exists "market_news_update_service_role" on public.market_news;
create policy "market_news_update_service_role"
  on public.market_news
  for update
  to service_role
  using (true)
  with check (true);

-- bootstrap -----------------------------------------------------------------
create or replace function public.bootstrap_dev_player(
  p_eidolon_handle text,
  p_dev_identity text
)
returns public.players
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player public.players;
  v_auth_user_id uuid;
begin
  if trim(coalesce(p_eidolon_handle, '')) = '' then
    raise exception 'eidolon handle is required';
  end if;

  if trim(coalesce(p_dev_identity, '')) = '' then
    raise exception 'dev identity is required';
  end if;

  v_auth_user_id := auth.uid();

  select *
    into v_player
  from public.players
  where dev_identity = p_dev_identity
     or (v_auth_user_id is not null and auth_user_id = v_auth_user_id)
  limit 1;

  if found then
    if v_auth_user_id is not null and v_player.auth_user_id is distinct from v_auth_user_id then
      update public.players
      set auth_user_id = v_auth_user_id
      where id = v_player.id
      returning * into v_player;
    end if;

    insert into public.resources (player_id)
    values (v_player.id)
    on conflict (player_id) do nothing;

    if not exists (
      select 1
      from public.ledger_entries
      where player_id = v_player.id
        and currency = '0BOL'
        and reason = 'bootstrap'
    ) then
      insert into public.ledger_entries (
        player_id,
        currency,
        delta,
        reason,
        balance_after
      )
      values (
        v_player.id,
        '0BOL',
        1000000,
        'bootstrap',
        1000000
      );
    end if;

    return v_player;
  end if;

  insert into public.players (
    auth_user_id,
    dev_identity,
    eidolon_handle,
    os_tier,
    rank
  )
  values (
    v_auth_user_id,
    p_dev_identity,
    p_eidolon_handle,
    'PIRATE',
    0
  )
  returning * into v_player;

  insert into public.resources (
    player_id,
    energy_seconds,
    heat,
    integrity,
    stealth,
    influence
  )
  values (
    v_player.id,
    259200,
    0,
    100,
    0,
    0
  );

  insert into public.ledger_entries (
    player_id,
    currency,
    delta,
    reason,
    balance_after
  )
  values (
    v_player.id,
    '0BOL',
    1000000,
    'bootstrap',
    1000000
  );

  return v_player;
end;
$$;

grant execute on function public.bootstrap_dev_player(text, text) to authenticated;
grant execute on function public.bootstrap_dev_player(text, text) to service_role;

-- transaction helpers -------------------------------------------------------
create or replace function public.execute_trade_atomic(
  p_player_id uuid,
  p_ticker text,
  p_side text,
  p_quantity numeric,
  p_price numeric,
  p_heat_delta integer
)
returns table (
  trade_id uuid,
  position_id uuid,
  balance_after numeric,
  energy_seconds integer,
  heat integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trade_id uuid := gen_random_uuid();
  v_position public.positions;
  v_resources public.resources;
  v_previous_balance numeric := 0;
  v_cost numeric := round((p_price * p_quantity)::numeric, 2);
  v_new_balance numeric;
  v_next_quantity numeric;
  v_next_avg_entry numeric;
  v_realized_pnl numeric := 0;
begin
  if p_quantity <= 0 then
    raise exception 'quantity must be > 0';
  end if;

  if p_price <= 0 then
    raise exception 'price must be > 0';
  end if;

  if p_side not in ('BUY', 'SELL') then
    raise exception 'side must be BUY or SELL';
  end if;

  select *
    into v_resources
  from public.resources
  where player_id = p_player_id
  for update;

  if not found then
    raise exception 'resources not found for player %', p_player_id;
  end if;

  select balance_after
    into v_previous_balance
  from public.ledger_entries
  where player_id = p_player_id
    and currency = '0BOL'
  order by created_at desc
  limit 1;

  if v_previous_balance is null then
    v_previous_balance := 0;
  end if;

  select *
    into v_position
  from public.positions
  where player_id = p_player_id
    and ticker = p_ticker
    and closed_at is null
  order by opened_at desc
  limit 1
  for update;

  if p_side = 'BUY' then
    if v_previous_balance < v_cost then
      raise exception 'insufficient 0BOL';
    end if;

    if found then
      v_next_quantity := v_position.quantity + p_quantity;
      v_next_avg_entry := round((((v_position.avg_entry * v_position.quantity) + v_cost) / v_next_quantity)::numeric, 2);

      update public.positions
      set quantity = v_next_quantity,
          avg_entry = v_next_avg_entry
      where id = v_position.id
      returning * into v_position;
    else
      insert into public.positions (
        player_id,
        ticker,
        quantity,
        avg_entry
      )
      values (
        p_player_id,
        p_ticker,
        p_quantity,
        p_price
      )
      returning * into v_position;
    end if;

    v_new_balance := v_previous_balance - v_cost;
  else
    if not found or v_position.quantity < p_quantity then
      raise exception 'insufficient position';
    end if;

    v_realized_pnl := round(((p_price - v_position.avg_entry) * p_quantity)::numeric, 2);
    v_next_quantity := v_position.quantity - p_quantity;
    v_new_balance := v_previous_balance + v_cost;

    if v_next_quantity = 0 then
      update public.positions
      set quantity = 0,
          realized_pnl = v_position.realized_pnl + v_realized_pnl,
          closed_at = now()
      where id = v_position.id
      returning * into v_position;
    else
      update public.positions
      set quantity = v_next_quantity,
          realized_pnl = v_position.realized_pnl + v_realized_pnl
      where id = v_position.id
      returning * into v_position;
    end if;
  end if;

  insert into public.trades (
    id,
    player_id,
    ticker,
    side,
    quantity,
    price,
    heat_delta
  )
  values (
    v_trade_id,
    p_player_id,
    p_ticker,
    p_side,
    p_quantity,
    p_price,
    p_heat_delta
  );

  insert into public.ledger_entries (
    player_id,
    currency,
    delta,
    reason,
    balance_after
  )
  values (
    p_player_id,
    '0BOL',
    case when p_side = 'BUY' then -v_cost else v_cost end,
    lower(p_side) || ':' || p_ticker,
    v_new_balance
  );

  update public.resources
  set heat = greatest(0, least(100, heat + p_heat_delta)),
      energy_seconds = greatest(0, energy_seconds - 90)
  where player_id = p_player_id
  returning * into v_resources;

  return query
  select
    v_trade_id,
    v_position.id,
    v_new_balance,
    v_resources.energy_seconds,
    v_resources.heat;
end;
$$;

grant execute on function public.execute_trade_atomic(uuid, text, text, numeric, numeric, integer) to service_role;

create or replace function public.purchase_energy_atomic(
  p_player_id uuid,
  p_seconds integer,
  p_cost numeric
)
returns table (
  balance_after numeric,
  energy_seconds integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_resources public.resources;
  v_previous_balance numeric := 0;
  v_new_balance numeric;
begin
  if p_seconds <= 0 then
    raise exception 'seconds must be > 0';
  end if;

  if p_cost < 0 then
    raise exception 'cost must be >= 0';
  end if;

  select *
    into v_resources
  from public.resources
  where player_id = p_player_id
  for update;

  if not found then
    raise exception 'resources not found for player %', p_player_id;
  end if;

  select balance_after
    into v_previous_balance
  from public.ledger_entries
  where player_id = p_player_id
    and currency = '0BOL'
  order by created_at desc
  limit 1;

  if v_previous_balance is null then
    v_previous_balance := 0;
  end if;

  if v_previous_balance < p_cost then
    raise exception 'insufficient 0BOL';
  end if;

  v_new_balance := v_previous_balance - p_cost;

  insert into public.ledger_entries (
    player_id,
    currency,
    delta,
    reason,
    balance_after
  )
  values (
    p_player_id,
    '0BOL',
    -p_cost,
    'energy_purchase',
    v_new_balance
  );

  update public.resources
  set energy_seconds = least(259200, energy_seconds + p_seconds)
  where player_id = p_player_id
  returning * into v_resources;

  return query
  select v_new_balance, v_resources.energy_seconds;
end;
$$;

grant execute on function public.purchase_energy_atomic(uuid, integer, numeric) to service_role;

-- ============================================================================
-- DOWN (manual rollback)
-- ============================================================================
-- drop function if exists public.purchase_energy_atomic(uuid, integer, numeric);
-- drop function if exists public.execute_trade_atomic(uuid, text, text, numeric, numeric, integer);
-- drop function if exists public.bootstrap_dev_player(text, text);
-- drop trigger if exists resources_touch_updated_at on public.resources;
-- drop function if exists public.touch_updated_at();
-- drop function if exists public.current_player_id();
-- alter table public.players drop column if exists auth_user_id;
