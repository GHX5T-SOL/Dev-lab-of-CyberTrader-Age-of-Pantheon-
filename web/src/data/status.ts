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
    "Make v6 a reliable Web/iOS/Android demo: smoke production web, run native builds, validate cold-launch storage, and run Axiom QA against the first-session and pressure-band paths.",
  blockers: [
    "iOS simulator and Android emulator runtime validation are still pending",
    "SupabaseAuthority is feature-flagged and documented, but live Supabase migrations/RLS are not validated",
    "Apple/Google credentials and first remote EAS build runs are not yet confirmed",
    "Expo toolchain transitive dependency advisories need planned SDK/override remediation",
    "Store screenshots, final preview video, privacy copy, and age-rating notes are not ready; Reel's preview storyboard is ready",
    "OpenClaw post-fix doctor still times out in bounded runs and reports 38 skill requirement gaps",
    "OpenAI generation is currently quota-limited on the Mac mini runner, so live work falls through to Claude Code",
  ],
  recentWins: [
    "Dev Lab /office 3D metaverse work shipped and is now closed as a studio milestone",
    "Dev Lab GitHub open PRs/issues were cleaned to zero open items",
    "CyberTrader v6 live deployment returns HTTP 200, passes npm run health:live, and headless-renders the live mobile web shell in Chromium without console/page errors",
    "v6 contains the LocalAuthority trade loop, ledger, inventory, XP/rank, locations, heat/raids, couriers, news, missions, district states, streaks, daily challenges, bounty, and away report",
    "Rune completed the v6 technical audit: install, typecheck, Jest, and Expo web export pass locally",
    "Rune completed route hardening: protected deep links recover after hydration and menu/Android back actions have safe fallbacks",
    "Rune started persistence reliability coverage: native storage save/load, reset clearing, and corrupt JSON recovery are covered by Jest and documented in v6",
    "Rune completed EAS profiles for preview, iOS simulator, internal, store, and production build paths",
    "Oracle completed the 1000-seed economy replay harness with 1000 profitable sessions, 81 raid sessions, 0 soft locks, 0 impossible states, and median PnL 48.88",
    "Oracle completed launch tuning bands with 1000/1000 profitable sessions, median max Heat 60, 81 raid sessions, and zero low/medium/high-risk strategy issues",
    "Ghost release authority now documents release blockers, direct-to-main automation criteria, and Gate A/B/C sign-off rules",
    "Ghost completed the architecture risk audit with Expo dependency risks, storage/authority boundary review, EAS Node aligned to Expo SDK 52, and top 10 technical risks assigned to owners",
    "Kite completed the SupabaseAuthority flag boundary: LocalAuthority stays default, flagged Supabase config is tested, and RLS requirements are documented",
    "Axiom completed the store-submission regression checklist; the current v6 local check path passes with 59/59 Jest tests",
    "Nyx completed first-session loop tightening with live home/terminal cues, a manual market tick action, and starter VBLM profit tests",
    "Nyx completed 10-minute demo pressure tuning with starter, route-runner, and contraband strategy bands",
    "Zoro approved the first 10-minute Gate A journey and assigned polish follow-ups for Vex, Palette, Reel, and Axiom",
    "Vex completed the mobile HUD readability pass with prioritized Energy/Heat/0BOL telemetry, terminal owned-quantity visibility, scaled labels, and 44-52 px first-trade touch targets",
    "Vex completed exported-web responsive viewport captures and QA across web desktop, small phone, large phone, and tablet portrait",
    "Talon completed the autonomous safety preflight and full v6 ship check command for direct-push implementation loops",
    "Vex completed diegetic loading, empty, offline, and error states with safe system-message handling",
    "Reel completed the App Store preview storyboard, 30-second beat sheet, named capture routes, and Zoro approval checklist",
    "New v6 App Store readiness task map assigns work to Ghost, Zoro, the AI Council, Zara, and Zyra",
    "OpenClaw on zyra-mini is updated to 2026.4.24, gateway is restarted, v6 is cloned, and Zara/Zyra run through external launchd jobs",
    "OpenClaw runner config uses xhigh reasoning; OpenAI model listing works, but generation is quota-limited and falls through to Claude Code",
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
      detail: "https://cyber-trader-age-of-pantheon-v6.vercel.app returns HTTP 200, passes npm run health:live, and renders the live mobile boot shell in headless Chromium without console/page errors",
    },
    {
      label: "Build checks",
      state: "green",
      detail: "Rune audit, route hardening, storage regression checks, Oracle replay and launch tuning audits, Ghost architecture risk audit, Kite authority flag checks, Nyx first-session and pressure-band tests, Vex HUD/responsive/system-state validation, Talon safety preflight, EAS config validation, Jest tests, and Expo web export pass locally",
    },
    {
      label: "Native QA",
      state: "amber",
      detail: "EAS profiles and the Axiom store-submission regression checklist exist, but iOS simulator and Android emulator smoke runs remain the next honest readiness gate",
    },
    {
      label: "SupabaseAuthority",
      state: "amber",
      detail: "Feature-flagged adapter selection is tested and documented; live schema migrations and RLS validation are still pending",
    },
    {
      label: "Dependency audit",
      state: "amber",
      detail: "npm audit reports Expo toolchain transitive advisories; forced remediation proposes a breaking Expo change",
    },
    {
      label: "OpenClaw node",
      state: "amber",
      detail: "SSH works, OpenClaw 2026.4.24 is running, v6 is cloned, and Zara/Zyra run through external launchd jobs; residual doctor skill gaps and OpenAI quota limits remain",
    },
    {
      label: "Autonomy policy",
      state: "amber",
      detail: "Ghost direct-push criteria and Talon local safety preflight are documented; rollback protocol and first autonomous cron run verification remain pending",
    },
    {
      label: "Store assets",
      state: "red",
      detail: "Reel's preview storyboard is ready, but screenshots, final preview video, privacy copy, app metadata, and age rating notes are not yet submission-ready",
    },
  ],
  updated: "2026-04-26",
};
