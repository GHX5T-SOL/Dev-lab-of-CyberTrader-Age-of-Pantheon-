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
  headline: "Phase 0 Foundation — Dev Lab web Phase A scaffolded. Deploying to Vercel next.",
  phaseId: "phase-0",
  nextMilestone: "Phase 0 close: Vercel deploy green + first live AI Council session.",
  blockers: [
    "Supabase project not yet created (SUPABASE_* env vars empty)",
    "SpriteCook credits balance unknown — need to check before asset batch",
    "docs/Economy-Design.md tickers out of sync with v0.1.3 commodity artboard",
  ],
  recentWins: [
    "Dev Lab repo root commit shipped (7f05d90)",
    "12-agent roster named and personified",
    "AI Council charter + Collaboration Protocol locked",
    "Brand palette and motion rules locked",
    "Memory persistence wired (in-repo + global auto-load)",
  ],
  signals: [
    { label: "Repo health", state: "green", detail: "clean main, recent commit, CI not yet configured" },
    { label: "Stack lock", state: "green", detail: "Expo + RN + TS + Zustand + MMKV + Supabase — no drift" },
    { label: "Docs coverage", state: "amber", detail: "6 core docs present; tickers mismatch pending" },
    { label: "Brand assets", state: "amber", detail: "palette + spec locked; PNGs not yet generated" },
    { label: "Team ready", state: "green", detail: "12 agents + Ghost + Zoro defined" },
    { label: "Cron automation", state: "amber", detail: "endpoint stubbed; real logic in Phase C" },
  ],
  updated: "2026-04-19",
};
