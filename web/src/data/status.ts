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
    "Phase B Dev Lab is live and CyberTrader v6 is the active playable game repo. The next milestone is hardening v6 into a reliable cross-platform demo.",
  phaseId: "phase-b",
  nextMilestone:
    "Finish Phase B hardening and harden v6: validate Web, Android, and iOS, tune the economy, verify deployment, and move SupabaseAuthority beyond stub status.",
  blockers: [
    "CyberTrader v6 browser smoke is recorded, but Android and iOS runtime checks are still pending",
    "SupabaseAuthority is still a stub, so the demo depends on LocalAuthority for all real progress",
    "Standalone web typecheck depends on generated .next/types from a prior build",
    "Supabase project not yet created (SUPABASE_* env vars empty)",
    "PR #10 remains draft, so GLB preview-sync is not merged yet",
    "Large furniture GLBs need Zara compression/LOD pass before mobile-grade reuse",
  ],
  recentWins: [
    "CyberTrader v6 is the active playable repo and contains the working LocalAuthority trade loop",
    "v6 now includes XP/rank, inventory slots, locations/travel, heat/raids, couriers, real-time news, flash events, missions, district states, streaks, daily challenges, bounty, and away reports",
    "v6 intro video route plays the shipped MP4 before handing off to the text intro",
    "PR #7 GLB watcher and PR #9 persistent SSH key auth were accepted into local main for push",
    "Root chokidar dependency added so the new GLB watcher script can run",
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
      detail: "v6 has the core game and engagement systems in place; Android/iOS QA, tuning, SupabaseAuthority, and deploy checks still block a true demo-ready call",
    },
    {
      label: "v6 repo",
      state: "green",
      detail: "CyberTrader-Age-of-Pantheon-v6 is the canonical playable branch for the actual game",
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
      detail: "SSH setup is documented, GLB watcher landed, and preview-sync remains draft in PR #10",
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
  updated: "2026-04-25",
};
