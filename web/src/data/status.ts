export interface StatusSignal {
  label: string;
  state: "green" | "amber" | "red";
  detail: string;
}

export interface StatusBlock {
  headline: string;
  phaseId: string;
  nextMilestone: string;
  blockers: string[];
  recentWins: string[];
  signals: StatusSignal[];
  updated: string;
}

export const STATUS: StatusBlock = {
  headline:
    "Phase B Dev Lab is live and the first playable slice now exists. The next milestone is turning that local slice into a reliable cross-platform demo.",
  phaseId: "phase-b",
  nextMilestone:
    "Finish Phase B hardening and harden Phase 1: validate the playable slice on Web, Android, and iOS, wire the intro cut into boot, and move SupabaseAuthority beyond stub status.",
  blockers: [
    "The first playable loop is only validated honestly on web so far; Android and iOS runtime checks are still pending",
    "SupabaseAuthority is still a stub, so the demo depends on LocalAuthority for all real progress",
    "Standalone web typecheck depends on generated .next/types from a prior build",
    "Supabase project not yet created (SUPABASE_* env vars empty)",
    "zyra-mini SSH resolves, but tailscale/openclaw CLIs were not on PATH during verification",
    "Large furniture GLBs need Zara compression/LOD pass before mobile-grade reuse",
  ],
  recentWins: [
    "First playable slice now supports boot, handle claim, terminal home, market scan, buy, sell, and local persistence",
    "LocalAuthority backs the current trading loop and deterministic replay passes 1000 seeds",
    "Phase 1 cinematic workspace added under src/cinematics and the first teaser MP4 renders successfully",
    "AI Council runtime log is wired to memory/council-log.jsonl and /api/council/log",
    "Ghost and Zoro roles corrected globally in the Dev Lab data model",
    "Zara and Zyra added as OpenClaw Living Agents on zyra-mini",
    "16 local GLB avatar paths bound in web/src/data/performers.ts",
    "office_floor_option_2.glb chosen as the Phase B base scene for performance",
    "Whiteboard expanded and re-aligned around demo hardening tasks",
  ],
  signals: [
    {
      label: "Repo health",
      state: "green",
      detail: "web build passes; root TypeScript and PRNG tests pass in the current workspace",
    },
    {
      label: "Playable game",
      state: "amber",
      detail: "Boot, handle claim, terminal, trade loop, LocalAuthority, and local persistence are live; cross-platform QA and polish still block a true demo-ready call",
    },
    {
      label: "3D office",
      state: "green",
      detail: "R3F floor uses local office shell, furniture props, Bloom, camera focus, and GLB avatars",
    },
    {
      label: "Avatar lab",
      state: "green",
      detail: "Remote creator section removed; live local GLB gallery is primary",
    },
    {
      label: "OpenClaw node",
      state: "amber",
      detail: "ssh zyra-mini reaches Bruces-Mac-mini.local; heartbeat cron still needs final enable",
    },
    {
      label: "Team ready",
      state: "green",
      detail: "Ghost + Zoro + 12 AI + Zara/Zyra defined with local rigs and a live Phase 1 workstream",
    },
    {
      label: "Spend monitor",
      state: "green",
      detail: "Persistent header ticker and full Credit Ops dashboard are wired to /api/spend",
    },
  ],
  updated: "2026-04-23",
};
