/**
 * Roadmap — mirrors docs/Roadmap.md.
 * Keep in sync; the docs file is canonical.
 */

export type PhaseStatus = "complete" | "active" | "upcoming";

export interface Milestone {
  label: string;
  done: boolean;
}

export interface Phase {
  id: string;
  name: string;
  dates: string;
  status: PhaseStatus;
  summary: string;
  deliverables: string[];
  milestones: Milestone[];
  owners: string[];
}

export const ROADMAP: Phase[] = [
  {
    id: "phase-0",
    name: "Phase 0 — Foundation",
    dates: "2026-04-19 → 2026-04-25",
    status: "complete",
    summary: "Scaffold the Dev Lab, lock the stack, and get the virtual office online.",
    deliverables: [
      "Dev Lab repo live on GitHub (done)",
      "12-agent AI team roster + personas (done)",
      "AI Council charter + prompt guidelines (done)",
      "Dev Lab website Phase A deployed",
      "Brand guidelines + palette locked (done)",
      "docs/ design canon: GDD, Tech Arch, Roadmap, Lore, Economy, Decision Log (done)",
    ],
    milestones: [
      { label: "Repo pushed to GitHub", done: true },
      { label: "CLAUDE.md auto-loading for all future sessions", done: true },
      { label: "Memory files global-indexed", done: true },
      { label: "Dev Lab web scaffold deployed to Vercel", done: true },
      { label: "First AI Council session held on live question", done: true },
    ],
    owners: ["Ghost", "Compass", "Cipher"],
  },
  {
    id: "phase-b-dev-lab",
    name: "Phase B — Live 3D Dev Lab",
    dates: "2026-04-21 → 2026-04-28",
    status: "active",
    summary:
      "Turn the companion site into a living cyberpunk command center with local GLB avatars, a dynamic R3F office, and OpenClaw physical-layer surfacing.",
    deliverables: [
      "Avatar Lab uses 16 local GLB rigs instead of a remote creator iframe",
      "Floor 3D loads office_floor_option_2.glb, furniture props, and moving operators",
      "Ghost = Lead Developer; Zoro = Creative Lead across data and UI",
      "Zara + Zyra appear on Team Wall, header, status terminal, task board, and docs",
      "Whiteboard seeded with 60+ owner-tagged Phase B tasks",
      "Credit Ops page and persistent header meter refreshed",
    ],
    milestones: [
      { label: "Local GLB avatar gallery live", done: true },
      { label: "OpenClaw node status surfaced", done: true },
      { label: "GLB compression / LOD pass complete", done: false },
      { label: "Browser performance benchmark signed off", done: false },
    ],
    owners: ["Ghost", "Zoro", "Zara", "Zyra", "Vex", "Axiom"],
  },
  {
    id: "phase-1",
    name: "Phase 1 — MVP",
    dates: "weeks 2-5 (2026-04-26 → 2026-05-23)",
    status: "upcoming",
    summary:
      "Stand up the deterministic tick loop + BIOS→Terminal Home flow against LocalAuthority. 13 screen stubs feature-flagged.",
    deliverables: [
      "BIOS boot screen → Terminal Home transition",
      "Deterministic tick loop (Mulberry32 + xfnv1a)",
      "Authority Adapter: LocalAuthority complete; SupabaseAuthority stub",
      "First trade flow end-to-end (buy / sell / ledger write)",
      "13 nav screens stubbed and feature-flagged by OS tier",
      "Brand palette applied in-app; cyberpunk UI pass",
    ],
    milestones: [
      { label: "First green build on iOS + Android + Web", done: false },
      { label: "Trade round-trips through LocalAuthority", done: false },
      { label: "Deterministic replay harness passes 1000 seeds", done: false },
    ],
    owners: ["Zoro", "Rune", "Kite", "Oracle", "Vex"],
  },
  {
    id: "phase-2",
    name: "Phase 2 — AgentOS",
    dates: "weeks 6-8 (2026-05-24 → 2026-06-13)",
    status: "upcoming",
    summary:
      "Unlock the AgentOS tier. Factions meaningful. Supabase authoritative. First cinematics.",
    deliverables: [
      "SupabaseAuthority wired behind a feature flag",
      "Faction choice → world reaction",
      "Heat decay live + eAgent sweeps",
      "Remotion onboarding reel cut",
      "First HeyGen Hyperframe UI prototype",
    ],
    milestones: [
      { label: "Supabase RLS review signed off", done: false },
      { label: "First cinematic shown at team review", done: false },
    ],
    owners: ["Rune", "Kite", "Reel", "Nyx"],
  },
  {
    id: "phase-3",
    name: "Phase 3 — PantheonOS",
    dates: "weeks 9-11 (2026-06-14 → 2026-07-04)",
    status: "upcoming",
    summary: "Endgame tier. Pantheon shard reveal arcs. Optional Solana Mobile Wallet Adapter.",
    deliverables: [
      "Shard-of-the-Seven reveal arcs",
      "Solana Mobile Wallet Adapter (feature-flagged)",
      "ElizaOS synthetic market swarm live in staging",
      "Rank 30 Neon Warlord endgame pacing verified",
    ],
    milestones: [
      { label: "Wallet feature flag passes security review", done: false },
      { label: "ElizaOS swarm hits stable 8-agent steady state", done: false },
    ],
    owners: ["Nyx", "Kite", "Hydra", "Oracle"],
  },
  {
    id: "phase-4",
    name: "Phase 4 — Soft Launch",
    dates: "week 12 (2026-07-05 → 2026-07-11)",
    status: "upcoming",
    summary: "Closed beta with a small circle. Feedback loop. Store page prep.",
    deliverables: [
      "TestFlight + Play Console internal testing",
      "Feedback intake pipeline",
      "First 20 real players",
      "App Store / Play Store listing drafts",
    ],
    milestones: [
      { label: "Crash-free sessions > 99%", done: false },
      { label: "D1 retention baseline measured", done: false },
    ],
    owners: ["Axiom", "Ghost", "Compass"],
  },
  {
    id: "phase-5",
    name: "Phase 5 — Public Launch",
    dates: "week 13+ (2026-07-12 →)",
    status: "upcoming",
    summary: "App Store + Play Store release. Marketing reel live. First real economy pressure test.",
    deliverables: [
      "App Store approval",
      "Play Store approval",
      "Launch reel live on primary channels",
      "First real player cohort",
    ],
    milestones: [
      { label: "Launched on both stores", done: false },
      { label: "1,000 sessions completed", done: false },
    ],
    owners: ["Ghost", "Zoro", "Reel", "Compass"],
  },
];
