// Edge Function stub for Phase 1/2 energy purchases.
//
// The intended write path is:
//   1. validate caller JWT
//   2. price the refill server-side
//   3. call `public.purchase_energy_atomic(...)`

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

serve(() =>
  Response.json(
    {
      code: "not_implemented",
      message:
        "energy-purchase is scaffolded but not yet wired. Call purchase_energy_atomic from a signed Edge Function next.",
      retryable: false,
    },
    { status: 501 },
  ),
);
