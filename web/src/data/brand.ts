/**
 * Brand kit - the on-site version. Canon lives at brand/brand-guidelines.md
 * in the parent repo.
 */

export interface PaletteToken {
  name: string;
  hex: string;
  role: string;
  restraint?: string;
}

export const PALETTE_TOKENS: PaletteToken[] = [
  { name: "bg.void", hex: "#050608", role: "Primary background - true black with a faint blue cast." },
  { name: "accent.cyan", hex: "#00F5FF", role: "Primary interactive, system voice, terminal output." },
  { name: "accent.acidGreen", hex: "#67FFB5", role: "Success, price-up, rank-up moment." },
  { name: "danger.heat", hex: "#FF2A4D", role: "Danger, price-down, heat alert." },
  { name: "warn.amber", hex: "#FFB341", role: "Neutral alert, Free Splinters faction accent." },
  {
    name: "lore.violet",
    hex: "#7A5BFF",
    role: "Reserved for lore / Pantheon / glitch moments only.",
    restraint: "Do NOT use for general UI. Breaking this rule cheapens the mystic reveals.",
  },
  { name: "ink.panel", hex: "#0A0D12", role: "Panel / card fills, slightly lifted from void." },
  { name: "dust", hex: "#8A94A7", role: "Secondary text, disabled states." },
  { name: "chrome", hex: "#E8ECF5", role: "Primary text, near-white." },
];

export interface FontSpec {
  name: string;
  stack: string;
  role: string;
}

export const FONTS: FontSpec[] = [
  {
    name: "Display",
    stack: '"Geist", "Space Grotesk", "Inter", system-ui, sans-serif',
    role: "Headers, hero copy, character names.",
  },
  {
    name: "Terminal",
    stack: '"Geist Mono", "JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
    role: "All system voice, prices, tickers, diegetic UI.",
  },
];

export interface AssetSpec {
  slug: string;
  displayName: string;
  pathInWeb: string;
  status: "placeholder" | "generated" | "finalized";
  note?: string;
}

/**
 * Canonical asset filename spec. Zoro's task: generate each commodity PNG on
 * transparent background at 512x512 minimum via SpriteCook MCP, then place at
 * the listed path. Ghost's v0.1.3 artboard is only a style reference; do not
 * crop it into production files.
 */
export const ASSET_SPEC: AssetSpec[] = [
  { slug: "logo_primary", displayName: "CyberTrader primary logo", pathInWeb: "/brand/logo/primary.png", status: "generated" },
  { slug: "logo_mark", displayName: "CyberTrader mark (icon)", pathInWeb: "/brand/logo/mark.png", status: "generated" },
  { slug: "fractal_dust", displayName: "FDST - Fractal Dust", pathInWeb: "/brand/commodities/fractal_dust.png", status: "generated", note: "ChatGPT user-supplied final candidate." },
  { slug: "plutonion_gas", displayName: "PGAS - Plutonion Gas", pathInWeb: "/brand/commodities/plutonion_gas.png", status: "generated", note: "ChatGPT user-supplied final candidate." },
  { slug: "neon_glass", displayName: "NGLS - Neon Glass", pathInWeb: "/brand/commodities/neon_glass.png", status: "generated", note: "ChatGPT user-supplied final candidate." },
  { slug: "helix_mud", displayName: "HXMD - Helix Mud", pathInWeb: "/brand/commodities/helix_mud.png", status: "generated", note: "ChatGPT user-supplied final candidate." },
  { slug: "void_bloom", displayName: "VBLO - Void Bloom", pathInWeb: "/brand/commodities/void_bloom.png", status: "generated", note: "ChatGPT user-supplied final candidate." },
  { slug: "oracle_resin", displayName: "ORES - Oracle Resin", pathInWeb: "/brand/commodities/oracle_resin.png", status: "generated", note: "ChatGPT user-supplied final candidate." },
  { slug: "velvet_tabs", displayName: "VTAB - Velvet Tabs", pathInWeb: "/brand/commodities/velvet_tabs.png", status: "generated", note: "ChatGPT user-supplied final candidate." },
  { slug: "neon_dust", displayName: "NDST - Neon Dust", pathInWeb: "/brand/commodities/neon_dust.png", status: "generated", note: "Gemini user-supplied final candidate." },
  { slug: "phantom_crates", displayName: "PCRT - Phantom Crates", pathInWeb: "/brand/commodities/phantom_crates.png", status: "generated", note: "Gemini user-supplied final candidate." },
  { slug: "ghost_chips", displayName: "GCHP - Ghost Chips", pathInWeb: "/brand/commodities/ghost_chips.png", status: "generated", note: "SpriteCook original." },
];

export const MOTION_RULES = [
  "Transitions feel like BIOS output, not like marketing.",
  "Glitch is rare - reserve for rank-up and Pantheon moments.",
  "Respect prefers-reduced-motion.",
  "No generic purple gradients. Violet = lore only.",
  "Cyan + acid green = primary interactive.",
  "Monospace tells the truth. Display speaks the voice.",
];
