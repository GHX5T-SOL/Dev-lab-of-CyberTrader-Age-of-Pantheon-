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
    "Phase B Dev Lab is live, but the actual mobile game is still scaffold-only. The next milestone is the first playable slice.",
  phaseId: "phase-b",
  nextMilestone:
    "Finish Phase B hardening and kick off the first playable slice: Zoro creative brief, LocalAuthority trade loop, GLB perf sign-off, and council log governance.",
  blockers: [
    "Playable mobile game is still scaffold-only: boot placeholder + PRNG + schema skeleton, no trading loop yet",
    "Standalone web typecheck depends on generated .next/types from a prior build",
    "Supabase project not yet created (SUPABASE_* env vars empty)",
    "zyra-mini SSH resolves, but tailscale/openclaw CLIs were not on PATH during verification",
    "Large furniture GLBs need Zara compression/LOD pass before mobile-grade reuse",
  ],
  recentWins: [
    "AI Council runtime log is wired to memory/council-log.jsonl and /api/council/log",
    "Ghost and Zoro roles corrected globally in the Dev Lab data model",
    "Zara and Zyra added as OpenClaw Living Agents on zyra-mini",
    "16 local GLB avatar paths bound in web/src/data/performers.ts",
    "office_floor_option_2.glb chosen as the Phase B base scene for performance",
    "Whiteboard expanded into 60+ owner-tagged tasks with estimates and acceptance criteria",
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
      detail: "Mobile app is still a scaffold: boot placeholder, PRNG, contracts, and starter schema only",
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
      detail: "Ghost + Zoro + 12 AI + Zara/Zyra defined with local rigs",
    },
    {
      label: "Spend monitor",
      state: "green",
      detail: "Persistent header ticker and full Credit Ops dashboard are wired to /api/spend",
    },
  ],
  updated: "2026-04-23",
};
