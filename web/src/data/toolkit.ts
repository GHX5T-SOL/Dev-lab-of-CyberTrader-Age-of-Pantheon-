/**
 * Studio Toolkit — the media + AI tools Ghost and Zoro have keys or
 * licenses for. Agents should reach for these first before suggesting
 * third-party replacements.
 *
 * Every entry maps to an env key (or "n/a" if the tool is a desktop app
 * or web studio Ghost operates manually). The Spend dashboard probes
 * the live-billing ones; this file is the *capability* registry.
 */

export type ToolkitCategory =
  | "voice" // TTS, voice cloning
  | "video" // rendering, compositing, cinematics
  | "avatar" // character generation + rigging
  | "design" // layout, branding, illustration
  | "reasoning" // LLM / agent orchestration
  | "infra"; // build, host, auth, data

export interface ToolkitEntry {
  slug: string;
  name: string;
  category: ToolkitCategory;
  envKey?: string;
  useFor: string;
  notes?: string;
  docsUrl?: string;
  accent: string;
}

export const TOOLKIT: ToolkitEntry[] = [
  // ── Voice ──────────────────────────────────────────────────────────
  {
    slug: "elevenlabs",
    name: "ElevenLabs",
    category: "voice",
    envKey: "ELEVENLABS_API_KEY",
    useFor:
      "Character voices, narrator lines, in-game VO, Reel's explainer voiceovers, Oracle's market-bulletin delivery.",
    notes:
      "Prefer this for any spoken line in the Dev Lab or game. Match voice to each AI agent's persona in data/team.ts.",
    docsUrl: "https://elevenlabs.io/docs",
    accent: "#FFB341",
  },

  // ── Avatars ────────────────────────────────────────────────────────
  {
    slug: "heygen",
    name: "HeyGen + Hyperframes",
    category: "avatar",
    envKey: "HEYGEN_API_KEY",
    useFor:
      "Photoreal talking-head avatars for explainer videos, Council broadcast clips, on-site hero intros.",
    notes:
      "Ghost has Hyperframes skills installed — prefer the frame-accurate pipeline for anything that needs lip sync or sustained eye contact.",
    docsUrl: "https://docs.heygen.com",
    accent: "#7A5BFF",
  },
  {
    slug: "spritecook",
    name: "SpriteCook MCP",
    category: "avatar",
    envKey: "SPRITECOOK_API_KEY",
    useFor:
      "2D character portraits, item icons, tilesets, UI elements, short 2D animations. Phase A avatar source.",
    notes:
      "Prompts for all 16 operators live in data/avatars.ts. Use pixel mode for in-game, HD mode for office portraits.",
    docsUrl: "https://spritecook.com/docs",
    accent: "#00F5FF",
  },
  {
    slug: "readyplayerme",
    name: "Ready Player Me",
    category: "avatar",
    useFor:
      "Research reference for animation-library clips and retargeting patterns; the live Phase B office uses local GLB files.",
    notes:
      "No creator iframe or remote avatar dependency in the app. Local avatar files live in /web/public/GLB_Assets and are bound through data/performers.ts.",
    docsUrl: "https://docs.readyplayer.me",
    accent: "#67FFB5",
  },

  // ── Video ──────────────────────────────────────────────────────────
  {
    slug: "remotion",
    name: "Remotion",
    category: "video",
    envKey: "REMOTION_LICENSE_KEY",
    useFor:
      "Programmatic video rendering — explainer tray on Zoro's desk, weekly recap reels, cutscenes with deterministic data.",
    notes:
      "Compositions live in /web/remotion/ (Phase B). Use Remotion skills installed at the repo root.",
    docsUrl: "https://www.remotion.dev/docs",
    accent: "#FF2A4D",
  },
  {
    slug: "canva",
    name: "Canva + Claude Design",
    category: "design",
    useFor:
      "Fast social / promo assets, pitch deck frames, static marketing cards, one-off thumbnails.",
    notes:
      "No API integration — used as a studio tool. Source of truth for brand still lives in /web/public/brand + data/brand.ts.",
    docsUrl: "https://www.canva.com",
    accent: "#00F5FF",
  },

  // ── Reasoning ──────────────────────────────────────────────────────
  {
    slug: "anthropic",
    name: "Anthropic / Claude",
    category: "reasoning",
    envKey: "ANTHROPIC_API_KEY",
    useFor:
      "Council deliberation, persona voice, long-form reasoning, code review, design critique. Default planner.",
    notes:
      "Council routes use claude-haiku-4-5 for latency-bound work; swap to Sonnet/Opus for deep planning.",
    docsUrl: "https://docs.anthropic.com",
    accent: "#7A5BFF",
  },
  {
    slug: "openai",
    name: "OpenAI",
    category: "reasoning",
    envKey: "OPENAI_API_KEY",
    useFor: "Fallback LLM, image generation (DALL-E), embeddings for memory.",
    accent: "#67FFB5",
  },
  {
    slug: "openrouter",
    name: "OpenRouter",
    category: "reasoning",
    envKey: "OPENROUTER_API_KEY",
    useFor: "Multi-provider routing for cost / model-choice optimization.",
    accent: "#FFB341",
  },
  {
    slug: "vercel-gateway",
    name: "Vercel AI Gateway",
    category: "reasoning",
    envKey: "VERCEL_AI_GATEWAY_API_KEY",
    useFor:
      "Unified AI access with fallbacks + observability. Phase C Council switches to this for graceful provider degradation.",
    docsUrl: "https://vercel.com/docs/ai/ai-gateway",
    accent: "#00F5FF",
  },
  {
    slug: "huggingface",
    name: "Hugging Face",
    category: "reasoning",
    envKey: "HF_TOKEN",
    useFor: "Open-weight models, datasets, specialized pipelines (diffusion, VQA, etc.).",
    accent: "#FFB341",
  },
  {
    slug: "conway",
    name: "Conway",
    category: "infra",
    envKey: "CONWAY_API_KEY",
    useFor:
      "Sandboxed code execution, domain management, wallet ops — the agent's runtime utility belt.",
    docsUrl: "https://conway.ai/docs",
    accent: "#7A5BFF",
  },

  // ── Infra ──────────────────────────────────────────────────────────
  {
    slug: "supabase",
    name: "Supabase",
    category: "infra",
    envKey: "SUPABASE_URL",
    useFor:
      "Postgres + RLS + Edge Functions for the actual game (leaderboards, wallets, rank ledger, trade receipts).",
    docsUrl: "https://supabase.com/docs",
    accent: "#67FFB5",
  },
  {
    slug: "github",
    name: "GitHub",
    category: "infra",
    envKey: "GITHUB_TOKEN",
    useFor: "Source of truth. Push triggers Vercel redeploy.",
    accent: "#E8ECF5",
  },
];

export const TOOLKIT_BY_CATEGORY = TOOLKIT.reduce<Record<ToolkitCategory, ToolkitEntry[]>>(
  (acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  },
  {} as Record<ToolkitCategory, ToolkitEntry[]>,
);

export const CATEGORY_LABELS: Record<ToolkitCategory, string> = {
  voice: "Voice & audio",
  video: "Video & cinematics",
  avatar: "Avatars & characters",
  design: "Design & branding",
  reasoning: "Reasoning & agents",
  infra: "Infrastructure",
};
