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
    "Dev Lab 3D office work is complete. CyberTrader v6 is the active game repo, and the studio is now focused on App Store / Play Store submission readiness.",
  phaseId: "phase-1-v6-reliable-demo",
  nextMilestone:
    "Make v6 a reliable Web/iOS/Android demo: rerun checks, validate native runtime, harden routing/storage, and prepare EAS internal builds.",
  blockers: [
    "iOS simulator and Android emulator runtime validation are still pending",
    "SupabaseAuthority remains a stub; LocalAuthority is the only proven authority path",
    "EAS build profiles are not yet confirmed",
    "Store screenshots, preview video, privacy copy, and age-rating notes are not ready",
    "OpenClaw post-fix doctor still times out in bounded runs and reports 38 skill requirement gaps",
    "First Zara/Zyra autonomous v6 cron runs still need verification after the gateway restart",
  ],
  recentWins: [
    "Dev Lab /office 3D metaverse work shipped and is now closed as a studio milestone",
    "Dev Lab GitHub open PRs/issues were cleaned to zero open items",
    "CyberTrader v6 live deployment returns HTTP 200",
    "v6 contains the LocalAuthority trade loop, ledger, inventory, XP/rank, locations, heat/raids, couriers, news, missions, district states, streaks, daily challenges, bounty, and away report",
    "New v6 App Store readiness task map assigns work to Ghost, Zoro, the AI Council, Zara, and Zyra",
    "OpenClaw on zyra-mini is updated to 2026.4.24, gateway is restarted, v6 is cloned, and Zara/Zyra v6 cron jobs are enabled",
    "OpenClaw config on zyra-mini points primary agents at blockrun/openai/gpt-5.5 with max thinking",
  ],
  signals: [
    {
      label: "Studio focus",
      state: "green",
      detail: "Dev Lab office work is complete; all new production work should target CyberTrader v6 unless it supports automation or planning",
    },
    {
      label: "Dev Lab backlog",
      state: "green",
      detail: "Open PRs and issues in the Dev Lab repo were closed as superseded by the v6 production map",
    },
    {
      label: "v6 deployment",
      state: "green",
      detail: "https://cyber-trader-age-of-pantheon-v6.vercel.app returns HTTP 200",
    },
    {
      label: "Native QA",
      state: "amber",
      detail: "Web has a deployed build, but iOS and Android smoke runs remain the next honest readiness gate",
    },
    {
      label: "SupabaseAuthority",
      state: "amber",
      detail: "LocalAuthority is proven; SupabaseAuthority needs a feature-flagged implementation or a documented deferral",
    },
    {
      label: "OpenClaw node",
      state: "amber",
      detail: "SSH works, OpenClaw 2026.4.24 is running, v6 is cloned, and Zara/Zyra cron jobs are enabled; residual doctor skill gaps remain",
    },
    {
      label: "Autonomy policy",
      state: "amber",
      detail: "Direct-push autonomous mode is documented with safety rails; first autonomous cron runs still need commit/log verification",
    },
    {
      label: "Store assets",
      state: "red",
      detail: "Screenshots, preview video, privacy copy, app metadata, and age rating notes are not yet submission-ready",
    },
  ],
  updated: "2026-04-25",
};
