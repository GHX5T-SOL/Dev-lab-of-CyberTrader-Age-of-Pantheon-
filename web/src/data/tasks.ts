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

export const LAST_UPDATED = "2026-04-21";

export const TASKS: Task[] = [
  // GHOST
  {
    id: "g-001",
    owner: "ghost",
    title: "Review and merge the OpenClaw workers integration PR",
    status: "review",
    due: "2026-04-22",
    notes:
      "Confirm Zyra/Zara are represented correctly across Team, Tasks, Roadmap, Council, Crons, Floor 3D, and docs.",
    links: [{ label: "repo", href: "https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-" }],
  },
  {
    id: "g-002",
    owner: "ghost",
    title: "Pick the first Phase 1 coding spike for the Lead Developer lane",
    status: "todo",
    due: "2026-04-23",
    notes:
      "Recommended candidates: Pirate OS boot shell, deterministic tick loop, or LocalAuthority trade ledger.",
  },
  {
    id: "g-003",
    owner: "ghost",
    title: "Decide: update docs/Economy-Design.md tickers to match v0.1.3 commodity artboard?",
    status: "todo",
    notes: "Artboard uses: FDST PGAS NGLS HXMD VBLO ORES VTAB NDST PCRT GCHP. Older docs had: VBLM ORRS SNPS MTRX AETH BLCK. Pick canon.",
  },
  {
    id: "g-004",
    owner: "ghost",
    title: "Create or confirm Supabase project for Phase 1 authority work",
    status: "blocked",
    due: "2026-04-24",
    notes:
      "Kite can stub locally, but real RLS and Edge Function verification need SUPABASE_URL plus service role in env.",
  },
  {
    id: "g-005",
    owner: "ghost",
    title: "Run one manual AI Council session from /office/council and save the result",
    status: "todo",
    due: "2026-04-22",
    notes:
      "Topic suggestion: 'Which Phase 1 spike should Ghost and Zara attack first?' Verify the log appears after the run.",
  },

  // ZORO
  {
    id: "z-001",
    owner: "zoro",
    title: "Approve the updated Ghost/Zoro role split on the Team Wall",
    status: "review",
    due: "2026-04-22",
    notes:
      "Ghost is Lead Developer. Zoro is Creative Lead. Confirm copy, persona, and org chart match the real working relationship.",
  },
  {
    id: "z-002",
    owner: "zoro",
    title: "Generate Ghost + Zoro character portraits (SpriteCook)",
    status: "todo",
    due: "2026-04-24",
    notes:
      "Ghost: skull mask, hoodie, slung rifle. Zoro: neo-hacker creative swordsman, katana, green wrap. Save to web/public/brand/avatars/.",
  },
  {
    id: "z-003",
    owner: "zoro",
    title: "Generate Zyra + Zara portrait direction sheets",
    status: "todo",
    due: "2026-04-24",
    notes:
      "Use avatar prompts in web/src/data/avatars.ts. Zyra should read as calm autonomous ops; Zara should read as sharp build worker.",
  },
  {
    id: "z-004",
    owner: "zoro",
    title: "Review the 3D floor cast placement for the two new OpenClaw desks",
    status: "todo",
    notes:
      "Zyra and Zara are now in the Floor 3D cast. Check whether their positions feel right once the page renders.",
  },
  {
    id: "z-005",
    owner: "zoro",
    title: "Clone Dev Lab repo + run setup.sh on any new creative workstation",
    status: "done",
    notes: "Completed on Zoro machine: bootstrap repaired, root/web deps installed, Dev Lab site verified locally.",
  },
  {
    id: "z-006",
    owner: "zoro",
    title: "Generate the 10 commodity PNGs via SpriteCook MCP — transparent background, 512px",
    status: "done",
    notes:
      "Generated the 10 transparent commodity PNGs at web/public/brand/commodities/. SpriteCook FDST render saved as comparison/reference.",
  },
  {
    id: "z-007",
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
    id: "t-nyx-002",
    owner: "nyx",
    title: "Write the Phase 1 first-10-minute game loop acceptance criteria",
    status: "todo",
    due: "2026-04-24",
    notes:
      "Define the exact player beats from BIOS boot to first buy/sell, including failure states and tutorial copy constraints.",
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
    id: "t-vex-002",
    owner: "vex",
    title: "Add OpenClaw worker affordances to the office visual language",
    status: "todo",
    notes:
      "Zyra and Zara should feel like autonomous workers, not generic cards: status LEDs, branch/cron motifs, and clear PM/build separation.",
  },
  {
    id: "t-rune-001",
    owner: "rune",
    title: "Build the Pirate OS boot shell in Expo",
    status: "todo",
    due: "2026-04-27",
    notes:
      "Use existing src/ scaffold. Wire a deterministic intro state, no external services, and keep it mobile-first.",
  },
  {
    id: "t-rune-002",
    owner: "rune",
    title: "Stub the 13 MVP navigation screens with feature flags",
    status: "todo",
    notes:
      "Screens from docs/Game-Design-Doc.md. No placeholders in final Phase 1, but lightweight route shells unblock design + QA.",
  },
  {
    id: "t-kite-001",
    owner: "kite",
    title: "Draft SupabaseAuthority adapter (stub, no live connection yet)",
    status: "todo",
    notes: "Implement Authority interface from src/engine/types.ts. Phase 2 wires the real connection.",
  },
  {
    id: "t-kite-002",
    owner: "kite",
    title: "Draft initial Postgres schema and RLS checklist",
    status: "blocked",
    notes:
      "Blocked until Supabase project exists. Prepare tables for users, ledger, positions, trades, rank, heat, and event log.",
  },
  {
    id: "t-oracle-001",
    owner: "oracle",
    title: "Sketch the Phase 1 deterministic tick loop spike",
    status: "todo",
    notes: "Mulberry32 + xfnv1a already scaffolded in src/engine/prng.ts. Build a 10k-tick replay harness.",
  },
  {
    id: "t-oracle-002",
    owner: "oracle",
    title: "Normalize commodity symbols across docs, data, and UI",
    status: "todo",
    notes:
      "Wait for Ghost's ticker decision, then update docs/Economy-Design.md, data/commodities.ts, and any tests.",
  },
  {
    id: "t-reel-001",
    owner: "reel",
    title: "Update the Dev Lab explainer slate for 16 operators",
    status: "todo",
    notes:
      "Re-cut 'How the AI team works' to include Zyra and Zara as OpenClaw workers alongside the 12 council subagents.",
  },
  {
    id: "t-reel-002",
    owner: "reel",
    title: "Storyboard a 45s OpenClaw workers intro reel",
    status: "todo",
    notes:
      "Show Mac mini, Tailscale SSH, cron rack, GitHub branches, draft PRs, and the Council handoff loop.",
  },
  {
    id: "t-palette-001",
    owner: "palette",
    title: "Generate Zyra and Zara avatar PNGs",
    status: "todo",
    due: "2026-04-25",
    notes:
      "Use web/src/data/avatars.ts prompts. Keep Zyra cyan ops, Zara acid build. Transparent background, 1024x1536 preferred.",
  },
  {
    id: "t-palette-002",
    owner: "palette",
    title: "Run brand drift pass after OpenClaw page updates",
    status: "todo",
    notes:
      "Check Team, Tasks, Automations, Floor 3D, Council, Broadcast, and Notes for palette discipline and copy consistency.",
  },
  {
    id: "t-cipher-001",
    owner: "cipher",
    title: "Verify OpenClaw docs against the Mac mini configuration",
    status: "review",
    notes:
      "Model routing, agent docs, crons, ClawHub skills, and fallback behavior were configured. Capture any doc mismatches before Phase 1.",
  },
  {
    id: "t-cipher-002",
    owner: "cipher",
    title: "Research Supabase + Expo offline authority patterns",
    status: "todo",
    notes:
      "Return a source-backed recommendation for local-first trades, eventual sync, RLS, and replay safety.",
  },
  {
    id: "t-axiom-001",
    owner: "axiom",
    title: "Add CI workflow for root tests, root typecheck, web typecheck, web build",
    status: "todo",
    due: "2026-04-25",
    notes:
      "Current local verification passes. Make GitHub Actions enforce it before OpenClaw workers start sending more PRs.",
  },
  {
    id: "t-axiom-002",
    owner: "axiom",
    title: "Create Playwright smoke for gate, office, team, tasks, crons, council",
    status: "todo",
    notes:
      "Target the Dev Lab web app. Smoke only: no visual brittleness, but prove pages load and key new workers render.",
  },
  {
    id: "t-compass-001",
    owner: "compass",
    title: "Run AI Council session on the first Phase 1 coding spike",
    status: "todo",
    due: "2026-04-22",
    notes:
      "Invite Ghost, Zoro observers. Include Zyra for PM/QA reality and Zara for implementation risk.",
  },
  {
    id: "t-compass-002",
    owner: "compass",
    title: "Maintain the expanded task board as the source of truth",
    status: "doing",
    notes:
      "Keep web/src/data/tasks.ts synchronized with GitHub Issues until Phase B sync exists.",
  },
  {
    id: "t-talon-001",
    owner: "talon",
    title: "Watch OpenClaw gateway health and security warnings",
    status: "doing",
    notes:
      "Gateway health is green; security audit has 0 critical. Remaining warnings are exec=full, ClawRouter tool reachability, and missing integrity metadata.",
  },
  {
    id: "t-talon-002",
    owner: "talon",
    title: "Reinstall or update ClawRouter with integrity metadata",
    status: "todo",
    notes:
      "Current ClawRouter works, but audit reports missing integrity metadata and a newer package is available.",
  },
  {
    id: "t-hydra-001",
    owner: "hydra",
    title: "Draft the ElizaOS market swarm personas for Phase 1 simulations",
    status: "todo",
    notes:
      "Define whales, HFT bots, faction traders, rumor-mill accounts, and one malicious event actor. Keep it deterministic for test replay.",
  },
  {
    id: "t-hydra-002",
    owner: "hydra",
    title: "Prepare first synthetic market stress scenario",
    status: "todo",
    notes:
      "Scenario: supply shock plus eAgent sweep. Output should be a JSON fixture Oracle can feed into replay tests.",
  },

  // OPENCLAW WORKERS
  {
    id: "oc-zyra-001",
    owner: "zyra",
    title: "Autonomy loop: pull main, review board, choose next safe task",
    status: "doing",
    notes:
      "Runs from the Mac mini every two hours. If no open task is assigned, inspect repo health and open a low-risk draft PR.",
  },
  {
    id: "oc-zyra-002",
    owner: "zyra",
    title: "Daily QA sweep on CyberTrader repo",
    status: "todo",
    notes:
      "Run root tests, root typecheck, web typecheck, web build, OpenClaw health, cron list, and security audit summary.",
  },
  {
    id: "oc-zyra-003",
    owner: "zyra",
    title: "Create GitHub Issues from the expanded task board",
    status: "todo",
    notes:
      "Use labels: ghost, zoro, council, openclaw, phase-1, qa, design, backend. Link issues back into tasks.ts when created.",
  },
  {
    id: "oc-zyra-004",
    owner: "zyra",
    title: "Write evening status report for Ghost and Zoro",
    status: "todo",
    notes:
      "Summarize completed PRs, blocked work, next autonomous task, model/credit status, and any Council decisions needed.",
  },
  {
    id: "oc-zara-001",
    owner: "zara",
    title: "Build loop: pick one scoped implementation task and open a draft PR",
    status: "todo",
    notes:
      "Runs every four hours. Prefer tests, docs sync, simple UI copy/data changes, or isolated Expo scaffolds.",
  },
  {
    id: "oc-zara-002",
    owner: "zara",
    title: "Implement CI workflow once Axiom confirms command matrix",
    status: "todo",
    notes:
      "Disjoint write scope: .github/workflows only. Run commands locally before pushing.",
  },
  {
    id: "oc-zara-003",
    owner: "zara",
    title: "Start the Pirate OS boot shell after Ghost picks the spike",
    status: "blocked",
    notes:
      "Blocked on Ghost + Council choosing the first Phase 1 build slice. Zara owns the implementation PR once unblocked.",
  },
  {
    id: "oc-zara-004",
    owner: "zara",
    title: "Keep Dev Lab pages synced when agents or crons change",
    status: "doing",
    notes:
      "Update team, performers, avatars, tasks, automations, status, roadmap, docs, and web copy as one coherent change.",
  },
];
