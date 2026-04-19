/**
 * The 10 S1LKROAD 4.0 commodities.
 *
 * Canonical tickers from the v0.1.3 Pirate OS commodity artboard.
 * Brand asset filename spec: each commodity has a PNG with transparent bg at
 *   /public/brand/commodities/<slug>.png
 *
 * NOTE (Phase B): some tickers differ from docs/Economy-Design.md (which has
 * an older list). The commodity artboard is now canonical; docs will be
 * updated in Phase B to match this list before Phase 1 implementation.
 */

export type Volatility = "low" | "medium" | "high" | "extreme";
export type HeatBand = "green" | "amber" | "red";

export interface Commodity {
  ticker: string;
  slug: string;
  name: string;
  tagline: string;
  narrative: string;
  volatility: Volatility;
  heatBand: HeatBand;
  accent: string;
  assetFile: string;
}

export const COMMODITIES: Commodity[] = [
  {
    ticker: "FDST",
    slug: "fractal_dust",
    name: "Fractal Dust",
    tagline: "Crystallized quantum noise.",
    narrative: "Used to jam eAgent triangulation. Supply shocks when a mining fleet is raided.",
    volatility: "high",
    heatBand: "amber",
    accent: "#7A5BFF",
    assetFile: "/brand/commodities/fractal_dust.png",
  },
  {
    ticker: "PGAS",
    slug: "plutonion_gas",
    name: "Plutonion Gas",
    tagline: "Orbital thruster fuel.",
    narrative: "Infrastructure demand rises on every launch window.",
    volatility: "medium",
    heatBand: "green",
    accent: "#00F5FF",
    assetFile: "/brand/commodities/plutonion_gas.png",
  },
  {
    ticker: "NGLS",
    slug: "neon_glass",
    name: "Neon Glass",
    tagline: "Memory-etched silica.",
    narrative: "Archivists hoard it. Supply thin, demand steady.",
    volatility: "medium",
    heatBand: "green",
    accent: "#FF2A4D",
    assetFile: "/brand/commodities/neon_glass.png",
  },
  {
    ticker: "HXMD",
    slug: "helix_mud",
    name: "Helix Mud",
    tagline: "Biohack substrate.",
    narrative: "Raid-season spikes. Smells like wet copper.",
    volatility: "high",
    heatBand: "amber",
    accent: "#7A5BFF",
    assetFile: "/brand/commodities/helix_mud.png",
  },
  {
    ticker: "VBLO",
    slug: "void_bloom",
    name: "Void Bloom",
    tagline: "Synthesized mood stabilizer.",
    narrative: "Common. Cheap entry point for new traders.",
    volatility: "low",
    heatBand: "green",
    accent: "#67FFB5",
    assetFile: "/brand/commodities/void_bloom.png",
  },
  {
    ticker: "ORES",
    slug: "oracle_resin",
    name: "Oracle Resin",
    tagline: "Rumor amplifier.",
    narrative: "Reacts to news within 2 ticks. Event traders love it.",
    volatility: "extreme",
    heatBand: "amber",
    accent: "#00F5FF",
    assetFile: "/brand/commodities/oracle_resin.png",
  },
  {
    ticker: "VTAB",
    slug: "velvet_tabs",
    name: "Velvet Tabs",
    tagline: "Eidolon-compatible neural fiber.",
    narrative: "Faction-routed. Blackwake prefers, Null Crown embargoes.",
    volatility: "high",
    heatBand: "red",
    accent: "#7A5BFF",
    assetFile: "/brand/commodities/velvet_tabs.png",
  },
  {
    ticker: "NDST",
    slug: "neon_dust",
    name: "Neon Dust",
    tagline: "Lattice stabilizer.",
    narrative: "Required for node unlocks. Runs on an auction cycle.",
    volatility: "medium",
    heatBand: "amber",
    accent: "#FF2A4D",
    assetFile: "/brand/commodities/neon_dust.png",
  },
  {
    ticker: "PCRT",
    slug: "phantom_crates",
    name: "Phantom Crates",
    tagline: "Illegal thought-accelerators.",
    narrative: "Pump-and-crash magnet. Your first real risk lesson.",
    volatility: "extreme",
    heatBand: "red",
    accent: "#00F5FF",
    assetFile: "/brand/commodities/phantom_crates.png",
  },
  {
    ticker: "GCHP",
    slug: "ghost_chips",
    name: "Ghost Chips",
    tagline: "Contraband everything.",
    narrative: "High Heat. High margin. Late-game unlock.",
    volatility: "extreme",
    heatBand: "red",
    accent: "#7A5BFF",
    assetFile: "/brand/commodities/ghost_chips.png",
  },
];
