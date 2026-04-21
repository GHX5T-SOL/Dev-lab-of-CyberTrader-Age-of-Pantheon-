/**
 * Live-spend probes for each configured AI / infra provider.
 *
 * This runs server-side only. Never imported into client components.
 *
 * Each probe is best-effort:
 *   - returns { ok: true, usdRemaining?, usdSpent24h?, note? } on success
 *   - returns { ok: false, note: "<reason>" } when the key is missing, the
 *     endpoint is down, or the provider doesn't expose a billing API.
 *
 * Probes are WRAPPED in a timeout + try/catch. A single provider going down
 * never breaks the aggregate response. We cap the per-probe budget so /api/spend
 * stays well under Vercel's 300s Fluid Compute timeout.
 *
 * When a provider's API isn't available, we fall back to returning just the
 * existence-of-key boolean so the ticker can at least show "configured".
 */

import { PROVIDERS, type Provider } from "@/data/providers";

export interface SpendSnapshot {
  slug: string;
  label: string;
  accent: string;
  category: Provider["category"];
  configured: boolean;
  ok: boolean;
  usdRemaining?: number;
  usdSpent24h?: number;
  note?: string;
  dashboardUrl?: string;
  /** When the probe ran (ISO). */
  at: string;
}

export interface SpendReport {
  at: string;
  totals: {
    usdRemaining: number;
    usdSpent24h: number;
    providersConfigured: number;
    providersLive: number;
  };
  providers: SpendSnapshot[];
}

const PER_PROBE_TIMEOUT_MS = 5_000;

/** Fetch with a hard timeout so a single hung provider can't stall the page. */
async function fetchT(url: string, init: RequestInit = {}): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), PER_PROBE_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

/** Reads an env key and reports whether it's present. */
function getKey(envKey: string): string | undefined {
  const raw = process.env[envKey];
  if (!raw) return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/* -------------------------------------------------------------------------- *
 * Per-provider probes
 * -------------------------------------------------------------------------- */

// Anthropic — currently no public billing endpoint for end-users. We check the
// Messages API with a tiny 1-token request to confirm the key works, then
// return a configured-but-no-amount signal.
async function probeAnthropic(key: string): Promise<Partial<SpendSnapshot>> {
  try {
    const r = await fetchT("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1,
        messages: [{ role: "user", content: "ping" }],
      }),
    });
    if (r.status === 401 || r.status === 403) {
      return { ok: false, note: "invalid key" };
    }
    // 200 or 4xx-other is fine — it proves the key works. No USD figure.
    return { ok: true, note: "key valid · open dashboard for exact balance" };
  } catch {
    return { ok: false, note: "probe timeout" };
  }
}

// OpenAI — subscription/usage requires an admin key; the standard key can call
// the /v1/dashboard/billing/credit_grants endpoint on some orgs. We try it; on
// 404 we fall back to a simple models listing as a key-valid check.
async function probeOpenAI(key: string): Promise<Partial<SpendSnapshot>> {
  try {
    // Try the legacy credit-grants endpoint.
    const r = await fetchT("https://api.openai.com/v1/dashboard/billing/credit_grants", {
      headers: { authorization: `Bearer ${key}` },
    });
    if (r.ok) {
      const j = (await r.json()) as {
        total_granted?: number;
        total_used?: number;
        total_available?: number;
      };
      return {
        ok: true,
        usdRemaining: typeof j.total_available === "number" ? j.total_available : undefined,
        note: "legacy credit grants",
      };
    }
    // Fall back to models listing as a key-valid check.
    const mr = await fetchT("https://api.openai.com/v1/models", {
      headers: { authorization: `Bearer ${key}` },
    });
    if (mr.status === 401) return { ok: false, note: "invalid key" };
    return { ok: true, note: "key valid · balance not exposed via API" };
  } catch {
    return { ok: false, note: "probe timeout" };
  }
}

// OpenRouter — /api/v1/key exposes credits + usage.
async function probeOpenRouter(key: string): Promise<Partial<SpendSnapshot>> {
  try {
    const r = await fetchT("https://openrouter.ai/api/v1/key", {
      headers: { authorization: `Bearer ${key}` },
    });
    if (!r.ok) return { ok: false, note: `http ${r.status}` };
    const j = (await r.json()) as { data?: { limit?: number; usage?: number } };
    const limit = j.data?.limit;
    const usage = j.data?.usage ?? 0;
    const remaining = typeof limit === "number" ? Math.max(limit - usage, 0) : undefined;
    return {
      ok: true,
      usdRemaining: remaining,
      usdSpent24h: undefined, // not exposed
      note: remaining === undefined ? "unlimited or pay-as-you-go" : undefined,
    };
  } catch {
    return { ok: false, note: "probe timeout" };
  }
}

// ElevenLabs — /v1/user/subscription returns character quota; we convert to USD
// using the current plan's credit cost. Without plan SKU mapping we report
// characters remaining as a proxy.
async function probeElevenLabs(key: string): Promise<Partial<SpendSnapshot>> {
  try {
    const r = await fetchT("https://api.elevenlabs.io/v1/user/subscription", {
      headers: { "xi-api-key": key },
    });
    if (!r.ok) return { ok: false, note: `http ${r.status}` };
    const j = (await r.json()) as {
      character_count?: number;
      character_limit?: number;
      tier?: string;
    };
    const used = j.character_count ?? 0;
    const limit = j.character_limit ?? 0;
    const remaining = Math.max(limit - used, 0);
    const pctRemaining = limit > 0 ? (remaining / limit) * 100 : 0;
    return {
      ok: true,
      // Characters, not USD — we show it in the note until we add plan pricing.
      note: `${j.tier ?? "plan"} · ${remaining.toLocaleString()} chars (${pctRemaining.toFixed(1)}%) remaining`,
    };
  } catch {
    return { ok: false, note: "probe timeout" };
  }
}

// Conway — documented in the system instructions as having a credits endpoint.
async function probeConway(key: string): Promise<Partial<SpendSnapshot>> {
  try {
    const r = await fetchT("https://api.conway.so/v1/credits/balance", {
      headers: { authorization: `Bearer ${key}` },
    });
    if (!r.ok) return { ok: false, note: `http ${r.status}` };
    const j = (await r.json()) as { balance?: number; currency?: string };
    return {
      ok: true,
      usdRemaining: typeof j.balance === "number" ? j.balance : undefined,
    };
  } catch {
    return { ok: false, note: "probe timeout" };
  }
}

// Hugging Face — /api/whoami-v2 returns plan. No direct USD.
async function probeHuggingFace(key: string): Promise<Partial<SpendSnapshot>> {
  try {
    const r = await fetchT("https://huggingface.co/api/whoami-v2", {
      headers: { authorization: `Bearer ${key}` },
    });
    if (!r.ok) return { ok: false, note: `http ${r.status}` };
    const j = (await r.json()) as { plan?: string; periodEnd?: string };
    return {
      ok: true,
      note: `${j.plan ?? "free"} plan`,
    };
  } catch {
    return { ok: false, note: "probe timeout" };
  }
}

// SpriteCook — per MCP tool spec, exposes get_credit_balance via MCP only.
// Over HTTP we fall back to a placeholder. The Spend page will also surface
// the MCP number when the agent has MCP access.
async function probeSpriteCook(): Promise<Partial<SpendSnapshot>> {
  return { ok: true, note: "use SpriteCook MCP get_credit_balance for live figure" };
}

// GitHub — /rate_limit is a good health check; billing is not exposed.
async function probeGithub(key: string): Promise<Partial<SpendSnapshot>> {
  try {
    const r = await fetchT("https://api.github.com/rate_limit", {
      headers: { authorization: `Bearer ${key}`, accept: "application/vnd.github+json" },
    });
    if (!r.ok) return { ok: false, note: `http ${r.status}` };
    const j = (await r.json()) as { rate?: { remaining?: number; limit?: number } };
    const r0 = j.rate?.remaining ?? 0;
    const r1 = j.rate?.limit ?? 0;
    return { ok: true, note: `api rate ${r0}/${r1}` };
  } catch {
    return { ok: false, note: "probe timeout" };
  }
}

// EVM wallet — use a public RPC to fetch ETH balance. No key needed.
async function probeEvmWallet(address: string): Promise<Partial<SpendSnapshot>> {
  try {
    const rpc = process.env.EVM_RPC_URL ?? "https://ethereum-rpc.publicnode.com";
    const r = await fetchT(rpc, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getBalance",
        params: [address, "latest"],
      }),
    });
    if (!r.ok) return { ok: false, note: `rpc http ${r.status}` };
    const j = (await r.json()) as { result?: string };
    const wei = j.result ? BigInt(j.result) : 0n;
    const eth = Number(wei) / 1e18;
    return { ok: true, note: `${eth.toFixed(4)} ETH @ ${address.slice(0, 6)}...${address.slice(-4)}` };
  } catch {
    return { ok: false, note: "rpc unreachable" };
  }
}

// Solana wallet — use the Solana JSON-RPC public endpoint.
async function probeSolanaWallet(address: string): Promise<Partial<SpendSnapshot>> {
  try {
    const rpc = process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
    const r = await fetchT(rpc, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [address],
      }),
    });
    if (!r.ok) return { ok: false, note: `rpc http ${r.status}` };
    const j = (await r.json()) as { result?: { value?: number } };
    const lamports = j.result?.value ?? 0;
    const sol = lamports / 1e9;
    return { ok: true, note: `${sol.toFixed(4)} SOL @ ${address.slice(0, 6)}...${address.slice(-4)}` };
  } catch {
    return { ok: false, note: "rpc unreachable" };
  }
}

/* -------------------------------------------------------------------------- *
 * Aggregator
 * -------------------------------------------------------------------------- */

type ProbeFn = (valueFromEnv: string) => Promise<Partial<SpendSnapshot>>;

const PROBES: Record<string, ProbeFn> = {
  anthropic: probeAnthropic,
  openai: probeOpenAI,
  openrouter: probeOpenRouter,
  elevenlabs: probeElevenLabs,
  conway: probeConway,
  huggingface: probeHuggingFace,
  spritecook: probeSpriteCook,
  github: probeGithub,
  "evm-wallet": probeEvmWallet,
  "solana-wallet": probeSolanaWallet,
};

export async function getSpendReport(): Promise<SpendReport> {
  const at = new Date().toISOString();

  const entries = await Promise.all(
    PROVIDERS.map(async (p): Promise<SpendSnapshot> => {
      const base: SpendSnapshot = {
        slug: p.slug,
        label: p.label,
        accent: p.accent,
        category: p.category,
        configured: false,
        ok: false,
        dashboardUrl: p.dashboardUrl,
        at,
      };
      const key = getKey(p.envKey);
      if (!key) {
        return { ...base, note: "not configured" };
      }
      base.configured = true;

      const probe = PROBES[p.slug];
      if (!probe || !p.hasLiveProbe) {
        return {
          ...base,
          ok: true,
          note: "configured · no live probe — open dashboard",
        };
      }
      try {
        const extra = await probe(key);
        return { ...base, ...extra, ok: extra.ok ?? false };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { ...base, ok: false, note: `probe error: ${message}` };
      }
    }),
  );

  const providersConfigured = entries.filter((e) => e.configured).length;
  const providersLive = entries.filter((e) => e.ok).length;
  const usdRemaining = entries.reduce((s, e) => s + (e.usdRemaining ?? 0), 0);
  const usdSpent24h = entries.reduce((s, e) => s + (e.usdSpent24h ?? 0), 0);

  return {
    at,
    totals: { usdRemaining, usdSpent24h, providersConfigured, providersLive },
    providers: entries,
  };
}
