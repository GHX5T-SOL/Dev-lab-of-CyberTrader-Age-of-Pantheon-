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
  headline: "Phase 0 Foundation — Dev Lab web is live, repo tests are green, and Zyra/Zara OpenClaw workers are armed.",
  phaseId: "phase-0",
  nextMilestone: "Phase 0 close: first live Council decision + Ghost selects the Phase 1 coding spike.",
  blockers: [
    "Supabase project not yet created (SUPABASE_* env vars empty)",
    "docs/Economy-Design.md tickers out of sync with v0.1.3 commodity artboard",
    "ClawRouter wallet balance is empty; BlockRun paid models currently fall back to free",
  ],
  recentWins: [
    "Dev Lab web app responds on Vercel and redirects to /gate",
    "Root verify:phase1, root lint, web typecheck, and web production build pass",
    "Zyra and Zara OpenClaw workers configured on zyra-mini with autonomous cron loops",
    "GitHub access verified for the Mac mini OpenClaw workflow",
    "12-subagent council roster plus 2 OpenClaw workers named and personified",
    "AI Council charter + Collaboration Protocol locked",
    "Brand palette, commodity PNGs, and motion rules locked",
  ],
  signals: [
    { label: "Repo health", state: "green", detail: "root verify:phase1, web typecheck, and web build pass locally" },
    { label: "Stack lock", state: "green", detail: "Expo + RN + TS + Zustand + MMKV + Supabase — no drift" },
    { label: "Docs coverage", state: "amber", detail: "6 core docs present; tickers mismatch pending" },
    { label: "Brand assets", state: "green", detail: "palette + spec locked; commodity PNGs generated; avatars pending" },
    { label: "Team ready", state: "green", detail: "Ghost + Zoro + 12 council subagents + Zyra/Zara defined" },
    { label: "OpenClaw", state: "green", detail: "gateway health OK, Telegram OK, Zyra/Zara cron jobs armed" },
    { label: "Cron automation", state: "green", detail: "Vercel cron routes exist; OpenClaw Mac mini loops are active" },
    { label: "Model routing", state: "amber", detail: "direct Anthropic primary; BlockRun falls back to free until wallet is funded" },
  ],
  updated: "2026-04-21",
};
