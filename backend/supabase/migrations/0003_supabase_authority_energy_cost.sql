-- ============================================================================
-- 0003_supabase_authority_energy_cost.sql - align remote trade energy cost
-- ----------------------------------------------------------------------------
-- The local first-playable authority scales trade energy by side and quantity.
-- This migration lets the edge function pass that computed cost into the
-- atomic trade helper instead of always draining 90 seconds.
-- ============================================================================

drop function if exists public.execute_trade_atomic(uuid, text, text, numeric, numeric, integer);

create or replace function public.execute_trade_atomic(
  p_player_id uuid,
  p_ticker text,
  p_side text,
  p_quantity numeric,
  p_price numeric,
  p_heat_delta integer,
  p_energy_cost integer
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

  if p_energy_cost < 0 then
    raise exception 'energy cost must be >= 0';
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
      energy_seconds = greatest(0, energy_seconds - p_energy_cost)
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

grant execute on function public.execute_trade_atomic(uuid, text, text, numeric, numeric, integer, integer) to service_role;

-- ============================================================================
-- DOWN (manual rollback)
-- ============================================================================
-- drop function if exists public.execute_trade_atomic(uuid, text, text, numeric, numeric, integer, integer);
