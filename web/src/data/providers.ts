/**
 * AI + infrastructure providers feeding the Dev Lab.
 *
 * Used by:
 *   - /office (wall-mounted SpendTicker showing live credit totals)
 *   - /office/spend (full dashboard)
 *   - /api/spend (the route that aggregates balances)
 *
 * Each provider declares:
 *   - envKey: the .env variable that stores its API key
 *   - billingStyle: how we probe spend (prepaid credits, metered usage, flat)
 *   - probe: the server-side path we call in lib/spend.ts to get a live figure
 *
 * SECURITY: provider definitions are safe to render; secrets stay server-side
 * in lib/spend.ts. The UI only sees { usdRemaining, usdSpent24h, ok, note }.
 */
export type BillingStyle =
  | "prepaid_credits" // buy credits up front; we show USD remaining
  | "metered_usage" // pay-as-you-go; we show USD spent over a window
  | "flat" // subscription; we show plan + "unlimited-ish"
  | "self_hosted" // no billing — local wallet / model
  | "unknown";

export interface Provider {
  slug: string;
  name: string;
  /** Shown in UI. Short. */
  label: string;
  envKey: string;
  /** Fallback if no direct billing API — useful for providers without one. */
  billingStyle: BillingStyle;
  /** Accent hex for the ticker bar. */
  accent: string;
  /** One-line in-world description. */
  tagline: string;
  /**
   * Whether lib/spend.ts has a live probe for this provider.
   * If false, the UI renders "no live feed — check dashboard manually".
   */
  hasLiveProbe: boolean;
  /** Public docs URL for the billing/usage dashboard. */
  dashboardUrl?: string;
  /** Category for grouping on the Spend page. */
  category: "llm" | "media" | "infra" | "data" | "on-chain";
}

export const PROVIDERS: Provider[] = [
  // ------------------------------- LLMs -------------------------------
  {
    slug: "anthropic",
    name: "Anthropic",
    label: "Anthropic",
    envKey: "ANTHROPIC_API_KEY",
    billingStyle: "prepaid_credits",
    accent: "#D97757",
    tagline: "Claude — primary reasoning model for Council + Cipher + Nyx.",
    hasLiveProbe: true,
    dashboardUrl: "https://console.anthropic.com/settings/billing",
    category: "llm",
  },
  {
    slug: "openai",
    name: "OpenAI",
    label: "OpenAI",
    envKey: "OPENAI_API_KEY",
    billingStyle: "prepaid_credits",
    accent: "#10A37F",
    tagline: "GPT-family — fallback + embeddings.",
    hasLiveProbe: true,
    dashboardUrl: "https://platform.openai.com/settings/organization/billing/overview",
    category: "llm",
  },
  {
    slug: "openrouter",
    name: "OpenRouter",
    label: "OpenRouter",
    envKey: "OPENROUTER_API_KEY",
    billingStyle: "prepaid_credits",
    accent: "#6C5CE7",
    tagline: "Gateway to 200+ models. Good for spot-testing a model.",
    hasLiveProbe: true,
    dashboardUrl: "https://openrouter.ai/credits",
    category: "llm",
  },
  {
    slug: "vercel-ai-gateway",
    name: "Vercel AI Gateway",
    label: "Vercel AI GW",
    envKey: "VERCEL_AI_GATEWAY_API_KEY",
    billingStyle: "metered_usage",
    accent: "#00F5FF",
    tagline: "Unified gateway — observability, fallbacks, zero data retention.",
    hasLiveProbe: false,
    dashboardUrl: "https://vercel.com/dashboard/ai-gateway",
    category: "llm",
  },
  {
    slug: "gemini",
    name: "Google Gemini",
    label: "Gemini",
    envKey: "GEMINI_API_KEY",
    billingStyle: "metered_usage",
    accent: "#4285F4",
    tagline: "Gemini — multimodal fallback.",
    hasLiveProbe: false,
    dashboardUrl: "https://aistudio.google.com/app/billing",
    category: "llm",
  },
  {
    slug: "cerebras",
    name: "Cerebras",
    label: "Cerebras",
    envKey: "CEREBRAS_API_KEY",
    billingStyle: "metered_usage",
    accent: "#FFB341",
    tagline: "Ultra-fast inference. Use for low-latency agent chatter.",
    hasLiveProbe: false,
    dashboardUrl: "https://cloud.cerebras.ai/",
    category: "llm",
  },
  {
    slug: "huggingface",
    name: "Hugging Face",
    label: "HF",
    envKey: "HF_TOKEN",
    billingStyle: "flat",
    accent: "#FFD21E",
    tagline: "Hub + Inference endpoints. Pro subscription.",
    hasLiveProbe: true,
    dashboardUrl: "https://huggingface.co/settings/billing",
    category: "llm",
  },

  // --------------------------- Media / Video ---------------------------
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    label: "ElevenLabs",
    envKey: "ELEVENLABS_API_KEY",
    billingStyle: "prepaid_credits",
    accent: "#67FFB5",
    tagline: "Voiceover for Reel's explainer videos.",
    hasLiveProbe: true,
    dashboardUrl: "https://elevenlabs.io/app/subscription",
    category: "media",
  },
  {
    slug: "heygen",
    name: "HeyGen",
    label: "HeyGen",
    envKey: "HEYGEN_API_KEY",
    billingStyle: "prepaid_credits",
    accent: "#7A5BFF",
    tagline: "Hyperframes — avatar + lip-sync video.",
    hasLiveProbe: false,
    dashboardUrl: "https://app.heygen.com/subscription",
    category: "media",
  },
  {
    slug: "spritecook",
    name: "SpriteCook",
    label: "SpriteCook",
    envKey: "SPRITECOOK_API_KEY",
    billingStyle: "prepaid_credits",
    accent: "#FF2A4D",
    tagline: "Game art + animation generation. Palette uses this daily.",
    hasLiveProbe: true, // via the spritecook MCP tool list
    dashboardUrl: "https://spritecook.ai/dashboard",
    category: "media",
  },
  {
    slug: "remotion",
    name: "Remotion",
    label: "Remotion",
    envKey: "REMOTION_LICENSE_KEY",
    billingStyle: "flat",
    accent: "#67FFB5",
    tagline: "Programmatic video. Reel owns the pipeline.",
    hasLiveProbe: false,
    dashboardUrl: "https://www.remotion.pro/dashboard",
    category: "media",
  },

  // ------------------------------ Infra ------------------------------
  {
    slug: "conway",
    name: "Conway",
    label: "Conway",
    envKey: "CONWAY_API_KEY",
    billingStyle: "prepaid_credits",
    accent: "#FFB341",
    tagline: "Sandboxes + domains + DNS + wallet ops.",
    hasLiveProbe: true,
    dashboardUrl: "https://conway.so/dashboard",
    category: "infra",
  },
  {
    slug: "github",
    name: "GitHub",
    label: "GitHub",
    envKey: "GITHUB_TOKEN",
    billingStyle: "flat",
    accent: "#E8ECF5",
    tagline: "Repo + Actions minutes.",
    hasLiveProbe: true,
    dashboardUrl: "https://github.com/settings/billing",
    category: "infra",
  },
  {
    slug: "supabase",
    name: "Supabase",
    label: "Supabase",
    envKey: "SUPABASE_SERVICE_ROLE_KEY",
    billingStyle: "flat",
    accent: "#3ECF8E",
    tagline: "Postgres + Edge Functions + Storage. Backend for the game.",
    hasLiveProbe: false,
    dashboardUrl: "https://supabase.com/dashboard",
    category: "infra",
  },
  {
    slug: "sentry",
    name: "Sentry",
    label: "Sentry",
    envKey: "SENTRY_DSN",
    billingStyle: "flat",
    accent: "#FF2A4D",
    tagline: "Error + performance monitoring.",
    hasLiveProbe: false,
    dashboardUrl: "https://sentry.io/settings/billing/",
    category: "infra",
  },

  // ------------------------------ Data -------------------------------
  {
    slug: "brave",
    name: "Brave Search",
    label: "Brave",
    envKey: "BRAVE_API_KEY",
    billingStyle: "metered_usage",
    accent: "#FB542B",
    tagline: "Cipher's search-first research feed.",
    hasLiveProbe: false,
    dashboardUrl: "https://api.search.brave.com/app/dashboard",
    category: "data",
  },
  {
    slug: "zep",
    name: "Zep",
    label: "Zep",
    envKey: "ZEP_API_KEY",
    billingStyle: "flat",
    accent: "#7A5BFF",
    tagline: "Long-term memory store for agents.",
    hasLiveProbe: false,
    dashboardUrl: "https://app.getzep.com/",
    category: "data",
  },

  // --------------------------- On-chain / Wallets ---------------------------
  {
    slug: "evm-wallet",
    name: "EVM Wallet",
    label: "EVM Wallet",
    envKey: "EVM_WALLET_ADDRESS",
    billingStyle: "self_hosted",
    accent: "#00F5FF",
    tagline: "Ops wallet (treasury + cron payments).",
    hasLiveProbe: true,
    category: "on-chain",
  },
  {
    slug: "solana-wallet",
    name: "Solana Wallet",
    label: "SOL Wallet",
    envKey: "SOLANA_WALLET_ADDRESS",
    billingStyle: "self_hosted",
    accent: "#9945FF",
    tagline: "On-chain identity + Obol token mint (Phase D).",
    hasLiveProbe: true,
    category: "on-chain",
  },
];

export const PROVIDERS_BY_CATEGORY = {
  llm: PROVIDERS.filter((p) => p.category === "llm"),
  media: PROVIDERS.filter((p) => p.category === "media"),
  infra: PROVIDERS.filter((p) => p.category === "infra"),
  data: PROVIDERS.filter((p) => p.category === "data"),
  "on-chain": PROVIDERS.filter((p) => p.category === "on-chain"),
} as const;

export const SPEND_REFRESH_MS = 60_000; // client-side poll cadence
