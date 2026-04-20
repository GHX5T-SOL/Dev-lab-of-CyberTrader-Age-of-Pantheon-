/**
 * Prototype index — v1 → v5 + str33t_trad3r.
 *
 * Each prior prototype lives in its own repo and (mostly) has its own live
 * Vercel deployment we can iframe into the Dev Lab's monitor wall so Ghost
 * can compare versions at a glance.
 *
 * Phase B task for Zoro: also import each as a git remote / branch here in
 * Dev Lab so we can diff and cherry-pick.
 *
 * Status legend:
 *   - archived: kept for reference, not actively built
 *   - reference: source of canonical BUILD_PLAN
 *   - active: current working build (the Dev Lab itself)
 */

export type PrototypeStatus = "archived" | "reference" | "active";

export interface Prototype {
  slug: string;
  version: string;
  title: string;
  repo: string;
  /** Live Vercel deployment we iframe into the monitor wall. */
  demo?: string;
  status: PrototypeStatus;
  summary: string;
  learnings: string[];
  importBranch: string;
}

export const PROTOTYPES: Prototype[] = [
  {
    slug: "v1",
    version: "v1",
    title: "CyberTrader v1 — first static mockup",
    repo: "https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v1",
    demo: "https://cybertrader-v1.vercel.app",
    status: "archived",
    summary: "Initial static mockup. Terminal aesthetic proven. No trade flow.",
    learnings: ["Monospace-first UI is the right call", "Needs a price engine, not hardcoded data"],
    importBranch: "archive/v1",
  },
  {
    slug: "v2",
    version: "v2",
    title: "CyberTrader v2 — trade flow spike",
    repo: "https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v2",
    demo: "https://cybertrader-v2.vercel.app",
    status: "archived",
    summary: "Added a buy/sell screen. No persistence, no determinism.",
    learnings: ["Trade UX feel is right", "Need deterministic PRNG before we go further"],
    importBranch: "archive/v2",
  },
  {
    slug: "v3",
    version: "v3",
    title: "CyberTrader v3 — economy sim experiment",
    repo: "https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v3",
    demo: "https://cybertrader-v3.vercel.app",
    status: "archived",
    summary: "First economy sim loop. Not deterministic. Heat mechanic prototyped.",
    learnings: ["Heat mechanic is fun", "Economy math needs a determinism harness"],
    importBranch: "archive/v3",
  },
  {
    slug: "v4",
    version: "v4",
    title: "CyberTrader v4 — multi-screen prototype",
    repo: "https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v4",
    status: "archived",
    summary: "Expanded to 6 screens. Navigation felt flat. Faction UX underdeveloped.",
    learnings: ["Need Expo Router file-based routing", "Faction choice needs real stakes"],
    importBranch: "archive/v4",
  },
  {
    slug: "v5",
    version: "v5",
    title: "CyberTrader v5 — canonical BUILD_PLAN source",
    repo: "https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v5",
    demo: "https://cybertrader-v5.vercel.app",
    status: "reference",
    summary:
      "The v5 prototype's README and BUILD_PLAN.md are the source of truth for mechanics that the Dev Lab inherited. Not actively built on — Phase 1 rebuilds clean inside this Dev Lab.",
    learnings: [
      "Stack choice (Expo + RN + Supabase) validated",
      "Need portrait-first mobile layout",
      "13-screen MVP scope is correct",
    ],
    importBranch: "reference/v5",
  },
  {
    slug: "str33t-trad3r",
    version: "str33t_trad3r",
    title: "str33t_trad3r — offshoot arcade variant",
    repo: "https://github.com/GHX5T-SOL/str33t_trad3r",
    demo: "https://str33t-trad3r-v1.vercel.app",
    status: "archived",
    summary: "Arcade-flavored offshoot. Useful for tone reference, not mechanics.",
    learnings: ["Arcade pacing is a nice optional mode (Phase 4+)"],
    importBranch: "archive/str33t-trad3r",
  },
  {
    slug: "dev-lab",
    version: "dev-lab",
    title: "Dev Lab — active workspace",
    repo: "https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-",
    demo: "https://dev-lab-eight.vercel.app",
    status: "active",
    summary: "This workspace. Single source of truth going forward.",
    learnings: ["Everything we learn lands here."],
    importBranch: "main",
  },
];
