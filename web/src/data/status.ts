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
  headline: "Phase B live — local GLB avatar gallery, dynamic 3D office, massive whiteboard, and OpenClaw node surfacing are active.",
  phaseId: "phase-b",
  nextMilestone: "Phase B hardening: GLB compression/LOD pass, persistent task-board storage, and browser performance budget sign-off.",
  blockers: [
    "Supabase project not yet created (SUPABASE_* env vars empty)",
    "zyra-mini SSH resolves, but tailscale/openclaw CLIs were not on PATH during verification",
    "Large furniture GLBs need Zara compression/LOD pass before mobile-grade reuse",
  ],
  recentWins: [
    "Ghost and Zoro roles corrected globally in the Dev Lab data model",
    "Zara and Zyra added as OpenClaw Living Agents on zyra-mini",
    "16 local GLB avatar paths bound in web/src/data/performers.ts",
    "office_floor_option_2.glb chosen as the Phase B base scene for performance",
    "Whiteboard expanded into 60+ owner-tagged tasks with estimates and acceptance criteria",
  ],
  signals: [
    { label: "Repo health", state: "green", detail: "main is active; push to GitHub triggers Vercel redeploy" },
    { label: "3D office", state: "green", detail: "R3F floor uses local office shell, furniture props, Bloom, camera focus, and GLB avatars" },
    { label: "Avatar lab", state: "green", detail: "Remote creator section removed; live local GLB gallery is primary" },
    { label: "OpenClaw node", state: "amber", detail: "ssh zyra-mini reaches Bruces-Mac-mini.local; heartbeat cron still needs final enable" },
    { label: "Team ready", state: "green", detail: "Ghost + Zoro + 12 AI + Zara/Zyra defined with local rigs" },
    { label: "Spend monitor", state: "green", detail: "Persistent header ticker and full Credit Ops dashboard are wired to /api/spend" },
  ],
  updated: "2026-04-21",
};
