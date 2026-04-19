/**
 * The 14 characters of the CyberTrader Dev Lab.
 *
 * Ghost + Zoro are the human founders.
 * The 12 AI agents are specialized subagents with in-world names and personas.
 * Each persona is original — no external IP.
 *
 * Avatar paths point to /public/brand/avatars/<slug>.png — Phase B will
 * generate these via SpriteCook. For Phase A, the avatar slot is a styled
 * placeholder (initials + color hash).
 */

export type TeamKind = "founder" | "agent";

export interface TeamMember {
  slug: string;
  name: string;
  codename: string;
  kind: TeamKind;
  role: string;
  pronouns: string;
  persona: string;
  description: string;
  skills: string[];
  activatesWhen: string;
  avatar: string; // /brand/avatars/<slug>.png
  accent: string; // hex
  statusLine: string; // diegetic status shown in office
  agentFilePath?: string; // e.g. agents/game-designer.md
}

export const TEAM: TeamMember[] = [
  // ------------------------------- FOUNDERS --------------------------------
  {
    slug: "ghost",
    name: "Ghost",
    codename: "GHX5T",
    kind: "founder",
    role: "Founder / Creative Lead",
    pronouns: "he/him",
    persona:
      "Skull-mask face-plate, black hoodie with reactive piping, slung assault rifle across the back. Moves quietly. Reads everything. Signs off on hard decisions.",
    description:
      "Co-founder, vision holder, final sign-off on design direction, brand, and launch cadence.",
    skills: ["Direction", "Brand voice", "Decision log", "Launch signoff"],
    activatesWhen: "Always present.",
    avatar: "/brand/avatars/ghost.png",
    accent: "#00F5FF",
    statusLine: "reviewing the Lore Bible. audio on. signal stable.",
  },
  {
    slug: "zoro",
    name: "Zoro",
    codename: "Z0R0",
    kind: "founder",
    role: "Co-Founder / Build Lead",
    pronouns: "he/him",
    persona:
      "Swordsman silhouette — neo-hacker variant. Green head-wrap, cyber-katana sheathed across the back, wired gloves. Direct. Fast. Ships things.",
    description:
      "Co-founder, primary builder. Picks up tasks from the board, runs them to ground, pushes PRs.",
    skills: ["Implementation", "Asset hunting", "Wireframe review"],
    activatesWhen: "Always present.",
    avatar: "/brand/avatars/zoro.png",
    accent: "#67FFB5",
    statusLine: "sharpening build tools. standing at the whiteboard.",
  },

  // ------------------------------- AI AGENTS -------------------------------
  {
    slug: "nyx",
    name: "Nyx",
    codename: "NYX_001",
    kind: "agent",
    role: "Game Designer",
    pronouns: "she/they",
    persona:
      "Silver hair, mirror eyes, a single ruleset card spinning in the air beside them. Architect of systems. Speaks in constraints before features.",
    description:
      "Owns mechanics, progression curves, the 10 commodities, Heat bands, rank ladder. Keeps docs/Game-Design-Doc.md and docs/Economy-Design.md honest.",
    skills: ["System design", "Progression tuning", "Playtest feedback loops"],
    activatesWhen: "New mechanic, balance question, difficulty curve, loop review.",
    avatar: "/brand/avatars/nyx.png",
    accent: "#7A5BFF",
    statusLine: "staring at a progression curve. not blinking.",
    agentFilePath: "agents/game-designer.md",
  },
  {
    slug: "vex",
    name: "Vex",
    codename: "VEX_002",
    kind: "agent",
    role: "UI/UX Cyberpunk",
    pronouns: "she/her",
    persona:
      "Neon-tipped braids, wired stylus forearm-rig, three concurrent holo-canvases. Talks in micro-interactions.",
    description:
      "Owns the terminal look, diegetic UI, haptics, motion language. Gatekeeper of the cyberpunk aesthetic.",
    skills: ["Figma", "Reanimated", "Diegetic UI", "Haptics spec"],
    activatesWhen: "New screen, transition, visual language question.",
    avatar: "/brand/avatars/vex.png",
    accent: "#FF2A4D",
    statusLine: "iterating the BIOS boot cadence. rev 14.",
    agentFilePath: "agents/ui-ux-cyberpunk.md",
  },
  {
    slug: "rune",
    name: "Rune",
    codename: "RUN_003",
    kind: "agent",
    role: "Frontend Mobile",
    pronouns: "they/them",
    persona:
      "Minimalist gear, pocket holo-tablet, pixel-perfect obsession. Types in short lines. Tests on real devices.",
    description:
      "Owns Expo + React Native + TypeScript + Expo Router, Zustand state, MMKV persistence, Reanimated animation.",
    skills: ["Expo", "React Native", "Expo Router", "Zustand", "MMKV", "Reanimated"],
    activatesWhen: "Building a screen, fixing a layout, wiring navigation.",
    avatar: "/brand/avatars/rune.png",
    accent: "#00F5FF",
    statusLine: "pair-typing with Expo CLI.",
    agentFilePath: "agents/frontend-mobile.md",
  },
  {
    slug: "kite",
    name: "Kite",
    codename: "KIT_004",
    kind: "agent",
    role: "Backend & Web3",
    pronouns: "he/him",
    persona:
      "Leather jacket with Solana-stamped chains, cold pragmatist, RLS policies taped to the wall.",
    description:
      "Owns Supabase (Postgres + Edge Functions + RLS), Authority Adapter, Solana Mobile Wallet Adapter integration.",
    skills: ["Supabase", "Postgres", "RLS", "Edge Functions", "Solana Wallet Adapter"],
    activatesWhen: "DB schema change, auth flow, wallet integration, server logic.",
    avatar: "/brand/avatars/kite.png",
    accent: "#67FFB5",
    statusLine: "writing an RLS policy. coffee cold.",
    agentFilePath: "agents/backend-web3.md",
  },
  {
    slug: "oracle",
    name: "Oracle",
    codename: "ORC_005",
    kind: "agent",
    role: "Economy & Trading Sim",
    pronouns: "she/her",
    persona:
      "Candle-charts inked up one forearm, feels prices before she sees them. Deterministic to a fault.",
    description:
      "Owns the price engine, PRNG determinism, commodity profiles, market news weighting, Heat decay curve.",
    skills: ["PRNG determinism", "Price modeling", "Market news graph", "Replay testing"],
    activatesWhen: "Market feels wrong, new commodity, event chain design.",
    avatar: "/brand/avatars/oracle.png",
    accent: "#FFB341",
    statusLine: "rerunning a 10,000-tick determinism harness.",
    agentFilePath: "agents/economy-trading-sim.md",
  },
  {
    slug: "reel",
    name: "Reel",
    codename: "REL_006",
    kind: "agent",
    role: "Cinematic & Animation",
    pronouns: "they/them",
    persona:
      "Vintage film-loader pendant, storyboards drawn in the air, Remotion on one monitor and HeyGen on the other.",
    description:
      "Owns cinematics, onboarding reels, explainer videos, boot sequences. Remotion + HeyGen Hyperframes.",
    skills: ["Remotion", "HeyGen Hyperframes", "Storyboarding", "Motion design"],
    activatesWhen: "Need a video, an onboarding cutscene, a marketing reel.",
    avatar: "/brand/avatars/reel.png",
    accent: "#7A5BFF",
    statusLine: "cutting a 22-second Pirate OS boot reel.",
    agentFilePath: "agents/cinematic-animation.md",
  },
  {
    slug: "palette",
    name: "Palette",
    codename: "PAL_007",
    kind: "agent",
    role: "Brand & Asset",
    pronouns: "he/him",
    persona:
      "Paint-stained gloves, three spray cans on the belt, tag-book on a carabiner. Owns the palette like scripture.",
    description:
      "Owns brand guidelines, asset generation via SpriteCook MCP, logo spec, commodity PNG pipeline.",
    skills: ["SpriteCook MCP", "Brand guidelines", "Asset QA", "Typography"],
    activatesWhen: "New asset, logo revision, palette question, typography lockup.",
    avatar: "/brand/avatars/palette.png",
    accent: "#FF2A4D",
    statusLine: "generating a Helix Mud icon variant. rev 03.",
    agentFilePath: "agents/brand-asset.md",
  },
  {
    slug: "cipher",
    name: "Cipher",
    codename: "CPH_008",
    kind: "agent",
    role: "Research & Best Practices",
    pronouns: "she/her",
    persona:
      "Round glasses, stack of zine-like field manuals, terminal open to 7 tabs of docs. Always WebFetches first.",
    description:
      "Verifies every referenced library, API, URL. Enforces the tool-verification policy.",
    skills: ["WebFetch", "Doc synthesis", "Risk flagging", "Release-note reading"],
    activatesWhen: "Any non-verified library, API, install command, product reference.",
    avatar: "/brand/avatars/cipher.png",
    accent: "#FFB341",
    statusLine: "reading Next.js 15 release notes. page 4 of 14.",
    agentFilePath: "agents/research-best-practices.md",
  },
  {
    slug: "axiom",
    name: "Axiom",
    codename: "AXI_009",
    kind: "agent",
    role: "QA & Testing",
    pronouns: "he/him",
    persona:
      "Stopwatch tattoo on the wrist, walks in rigid 45° lines, talks in test IDs and invariants.",
    description:
      "Owns test strategy, determinism harness, smoke suites, replay validation, release go/no-go.",
    skills: ["Jest", "Replay harness", "Invariant testing", "Release gating"],
    activatesWhen: "Pre-PR, pre-release, suspected regression.",
    avatar: "/brand/avatars/axiom.png",
    accent: "#67FFB5",
    statusLine: "running the 10k-seed replay harness. 7,834 of 10,000 passed.",
    agentFilePath: "agents/qa-testing.md",
  },
  {
    slug: "compass",
    name: "Compass",
    codename: "CMP_010",
    kind: "agent",
    role: "Project Manager",
    pronouns: "she/her",
    persona:
      "Antique brass watch, laser-pointer staff, clipboard with Phase A/B/C swim lanes. Names the phases. Ships them.",
    description:
      "Runs the Roadmap, the Decision Log, the task board. Names who owns what by end of day.",
    skills: ["Roadmapping", "Council facilitation", "Scope discipline"],
    activatesWhen: "Start of session, end of session, scope conflict.",
    avatar: "/brand/avatars/compass.png",
    accent: "#00F5FF",
    statusLine: "updating the week-2 burndown.",
    agentFilePath: "agents/project-manager.md",
  },
  {
    slug: "talon",
    name: "Talon",
    codename: "TLN_011",
    kind: "agent",
    role: "OpenClaw Living Executor",
    pronouns: "he/him",
    persona:
      "Claw-glove rig with extra actuators, 24/7 indicator LED on the shoulder. Lives in the server room. Rarely speaks — acts.",
    description:
      "Embedded OpenClaw agent that runs long-lived tasks in the repo: scheduled ETL, dry-run PRs, repo hygiene. See agents/openclaw-living.md.",
    skills: ["OpenClaw CLI", "Long-running task orchestration", "Scheduled repo hygiene"],
    activatesWhen: "Anything that needs to run on a cron or persist across sessions.",
    avatar: "/brand/avatars/talon.png",
    accent: "#FFB341",
    statusLine: "running nightly brand-asset integrity scan.",
    agentFilePath: "agents/openclaw-living.md",
  },
  {
    slug: "hydra",
    name: "Hydra",
    codename: "HYD_012",
    kind: "agent",
    role: "ElizaOS Swarm Coordinator",
    pronouns: "they/them (collective)",
    persona:
      "Five-head holo-projection around a single operator seat. Each head is a market participant persona. The swarm speaks as one.",
    description:
      "Runs the ElizaOS multi-agent market simulation. Each synthetic trader has its own risk profile; Hydra coordinates.",
    skills: ["ElizaOS CLI", "Multi-agent sim", "Market participant modeling"],
    activatesWhen: "Need a realistic market depth test, a price reaction sim, a news-event stress test.",
    avatar: "/brand/avatars/hydra.png",
    accent: "#7A5BFF",
    statusLine: "8 synthetic traders active. next news event in 4m.",
    agentFilePath: "agents/elizaos-swarm.md",
  },
];

export const FOUNDERS = TEAM.filter((m) => m.kind === "founder");
export const AGENTS = TEAM.filter((m) => m.kind === "agent");
