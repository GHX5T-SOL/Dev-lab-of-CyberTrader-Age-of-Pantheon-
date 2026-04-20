/**
 * Active task board. Tasks are per-person and update frequently.
 *
 * Phase B: wire this to a Supabase table or a simple GitHub Issues sync.
 * Phase A: static, edited by hand. Refresh timestamp when updating.
 */

export type TaskStatus = "blocked" | "todo" | "doing" | "review" | "done";

export interface Task {
  id: string;
  owner: string; // team slug
  title: string;
  status: TaskStatus;
  due?: string;
  notes?: string;
  links?: { label: string; href: string }[];
}

export const LAST_UPDATED = "2026-04-19";

export const TASKS: Task[] = [
  // GHOST
  {
    id: "g-001",
    owner: "ghost",
    title: "Review Dev Lab website (Phase A) on Vercel preview URL",
    status: "todo",
    notes: "After npm install + vercel deploy. Confirm vault door + all sections render.",
  },
  {
    id: "g-002",
    owner: "ghost",
    title: "Approve or redline the 12 AI agent personas (names + codenames)",
    status: "todo",
    notes: "Team: Nyx, Vex, Rune, Kite, Oracle, Reel, Palette, Cipher, Axiom, Compass, Talon, Hydra.",
  },
  {
    id: "g-003",
    owner: "ghost",
    title: "Decide: update docs/Economy-Design.md tickers to match v0.1.3 commodity artboard?",
    status: "todo",
    notes: "Artboard uses: FDST PGAS NGLS HXMD VBLO ORES VTAB NDST PCRT GCHP. Older docs had: VBLM ORRS SNPS MTRX AETH BLCK. Pick canon.",
  },

  // ZORO
  {
    id: "z-001",
    owner: "zoro",
    title: "Clone Dev Lab repo + run setup.sh (see onboarding prompt from Ghost)",
    status: "done",
    notes: "Completed on Zoro machine: bootstrap repaired, root/web deps installed, Dev Lab site verified locally.",
  },
  {
    id: "z-002",
    owner: "zoro",
    title: "Generate the 10 commodity PNGs via SpriteCook MCP — transparent background, 512px",
    status: "done",
    notes:
      "Generated the 10 transparent commodity PNGs at web/public/brand/commodities/. SpriteCook FDST render saved as comparison/reference.",
  },
  {
    id: "z-003",
    owner: "zoro",
    title: "Generate Ghost + Zoro character portraits (SpriteCook)",
    status: "todo",
    notes: "Ghost: skull mask, hoodie, slung rifle. Zoro: neo-hacker swordsman, katana, green wrap. Save to web/public/brand/avatars/.",
  },
  {
    id: "z-004",
    owner: "zoro",
    title: "Import each prior prototype repo as a branch in Dev Lab",
    status: "todo",
    notes:
      "v1-v5 + str33t_trad3r per data/wireframes.ts importBranch mapping. `git remote add vN <url>` then `git fetch` then `git checkout -b archive/vN vN/main`.",
  },

  // TEAM TICKS
  {
    id: "t-nyx-001",
    owner: "nyx",
    title: "Lock the 10-commodity narrative + volatility profile",
    status: "review",
    notes: "Draft is in data/commodities.ts. Needs Ghost review vs. lore bible.",
  },
  {
    id: "t-oracle-001",
    owner: "oracle",
    title: "Sketch the Phase 1 deterministic tick loop spike",
    status: "todo",
    notes: "Mulberry32 + xfnv1a already scaffolded in src/engine/prng.ts. Build a 10k-tick replay harness.",
  },
  {
    id: "t-kite-001",
    owner: "kite",
    title: "Draft SupabaseAuthority adapter (stub, no live connection yet)",
    status: "todo",
    notes: "Implement Authority interface from src/engine/types.ts. Phase 2 wires the real connection.",
  },
  {
    id: "t-vex-001",
    owner: "vex",
    title: "Design the Terminal Home screen (Pirate OS v0.1.3 variants)",
    status: "doing",
    notes:
      "4 variants on the reference board: Minimal Terminal, Neon Edge, Glass Terminal, Command Deck. Pick 1 primary + 1 alt for Phase 1.",
  },
  {
    id: "t-compass-001",
    owner: "compass",
    title: "Run first AI Council session on the Terminal Home variant pick",
    status: "todo",
    notes: "5-7 agents, structured debate, Decision-Log entry.",
  },
];
