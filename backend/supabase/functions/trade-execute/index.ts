// Edge Function stub for Phase 1/2 trade execution.
//
// The mobile client should eventually call this handler instead of writing
// directly to Postgres. It will validate the caller, compute the authoritative
// trade price, and then delegate the write to `public.execute_trade_atomic(...)`.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() =>
  Response.json(
    {
      code: "not_implemented",
      message:
        "trade-execute is scaffolded but not yet wired. Call execute_trade_atomic from a signed Edge Function next.",
      retryable: false,
    },
    { status: 501 },
  ),
);
