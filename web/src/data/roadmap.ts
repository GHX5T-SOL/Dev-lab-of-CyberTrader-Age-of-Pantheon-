/**
 * Roadmap - mirrors docs/Roadmap.md.
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
    name: "Phase 0 - Foundation",
    dates: "2026-04-19 -> 2026-04-25",
    status: "complete",
    summary: "The studio/control-plane foundation is complete.",
    deliverables: [
      "Dev Lab repo scaffolded",
      "AI Council and 12-agent roster created",
      "Ghost/Zoro collaboration model documented and later superseded by no-approval autonomous execution",
      "Brand, lore, economy, architecture, roadmap, and setup docs created",
      "Prototype history consolidated from v1 through v6",
    ],
    milestones: [
      { label: "Repo pushed to GitHub", done: true },
      { label: "AI Council charter live", done: true },
      { label: "Core docs created", done: true },
      { label: "v6 selected as active product repo", done: true },
    ],
    owners: ["Ghost", "Compass", "Cipher"],
  },
  {
    id: "phase-b-dev-lab-office",
    name: "Phase B - Dev Lab 3D Office",
    dates: "2026-04-21 -> 2026-04-25",
    status: "complete",
    summary:
      "The Dev Lab office/metaverse work is complete. The Dev Lab is now the control plane, not the product roadmap.",
    deliverables: [
      "/office rebuilt into the playable studio runtime",
      "Founder selection for Ghost/Zoro live as personas/reference points",
      "16 agent profiles plus Zara/Zyra surfaced",
      "Open PRs/issues cleaned to zero open items",
      "Task/status/roadmap data refocused on CyberTrader v6",
    ],
    milestones: [
      { label: "Playable office runtime shipped", done: true },
      { label: "Zara/Zyra surfaced", done: true },
      { label: "Dev Lab GitHub backlog cleaned", done: true },
      { label: "v6 app-store task map created", done: true },
    ],
    owners: ["Ghost", "Zoro", "Rune", "Vex", "Talon", "Compass"],
  },
  {
    id: "phase-1-v6-reliable-demo",
    name: "Phase 1 - v6 Reliable Demo",
    dates: "2026-04-26 -> 2026-05-10",
    status: "active",
    summary:
      "Make CyberTrader v6 a reliable, continuously improving demo across Web, iOS simulator, and Android emulator. The autonomous team now ships without Ghost/Zoro approval gates while preserving safety rails, rollback protocol, store-readiness evidence, and the completed launch-identity/provenance workflows.",
    deliverables: [
      "Typecheck, tests, and web export green",
      "Expo Router route recovery and Android/menu back paths hardened",
      "Native storage save/load, reset clearing, and corrupt data recovery covered by Jest",
      "1000-seed deterministic economy replay harness for soft-lock and tuning checks",
      "Launch survival, Heat, raid, and reward tuning bands locked with zero strategy issues",
      "Release blockers, direct-push criteria, and full no-human-approval autonomous execution rules documented",
      "Top 10 App Store architecture risks assigned to owners with evidence requirements",
      "SupabaseAuthority guarded behind explicit feature flag and public config checks",
      "SupabaseAuthority deterministic migration and RPC write-boundary baseline",
      "Launch identity and account recovery baseline: local handle only, no wallet/backend/payment requirement, and on-device recovery limits documented",
      "Store-safe wallet/token/non-custodial copy guard with Legal/Settings copy wiring and prohibited-claims tests",
      "First-session home/terminal guidance and manual market tick action for the starter profitable sell loop",
      "10-minute demo pressure bands for starter, route-runner, and contraband strategies",
      "Mobile HUD readability and one-hand first-trade controls",
      "Exported-web responsive viewport QA and capture evidence for web desktop, small phone, large phone, and tablet portrait",
      "Autonomous safety preflight and full ship check command",
      "Local crash/log diagnostics capture runtime errors, unhandled promise rejections, and console errors with redacted QA context",
      "App Store-safe loading, empty, offline, and error states",
      "Live Vercel shell-marker health command",
      "Live Axiom Chromium smoke waits for visible boot-shell markers instead of network idle",
      "Axiom player smoke route covers intro, login, tutorial, buy, sell, inventory, and settings",
      "Axiom performance budgets cover web export size, JS size, media, active art, and native Gate B measurement targets",
      "App Store preview storyboard and capture route map",
      "2026 Apple/Google/Expo submission requirements with Xcode 26 / iOS 26 SDK and Android API 35 gates",
      "Store-facing asset audit, Dev Lab provenance report, and zara-p1-005 repeatable 37-asset provenance inventory/check workflow",
      "Screenshot-safe visual state captures for home, terminal, market, missions, inventory, and profile",
      "Privacy, token naming, simulated trading, wallet, Data Safety, and age-rating risk matrix",
      "Hydra market-swarm scenarios plus first-20 retention/churn watch fixtures",
      "v6 GitHub issue batches for active P0/P1 readiness work",
      "PirateOS polish, AgentOS rank-5 systems, and PantheonOS late-game territory roadmap",
      "Live Vercel smoke passes on verified v6 origin/main 15308c9",
      "iOS simulator smoke passes",
      "Android emulator smoke passes",
      "First 10-minute player loop complete without developer guidance",
      "No blank screens, route dead-ends, or clipped critical text",
    ],
    milestones: [
      { label: "v6 live deployment returns 200", done: true },
      { label: "LocalAuthority trade loop implemented", done: true },
      { label: "Rune technical audit green", done: true },
      { label: "Expo Router route hardening", done: true },
      { label: "Storage regression coverage", done: true },
      { label: "1000-seed economy replay harness", done: true },
      { label: "Oracle launch tuning bands", done: true },
      { label: "Ghost release authority bar", done: true },
      { label: "Ghost architecture risk audit", done: true },
      { label: "SupabaseAuthority flag boundary", done: true },
      { label: "SupabaseAuthority migration baseline", done: true },
      { label: "Launch identity/recovery baseline", done: true },
      { label: "Kite store-safe wallet/token boundaries", done: true },
      { label: "Axiom store-submission regression checklist", done: true },
      { label: "Nyx first-session loop map", done: true },
      { label: "Nyx demo pressure bands", done: true },
      { label: "First-session creative pass", done: true },
      { label: "Vex mobile HUD readability", done: true },
      { label: "Vex responsive viewport captures", done: true },
      { label: "Talon autonomous safety preflight", done: true },
      { label: "Vex diegetic system states", done: true },
      { label: "Live shell-marker health command", done: true },
      { label: "Reel preview storyboard", done: true },
      { label: "Cipher store requirements", done: true },
      { label: "Palette store asset audit", done: true },
      { label: "Palette screenshot-safe captures", done: true },
      { label: "Zara generated provenance workflow", done: true },
      { label: "Cipher policy risk matrix", done: true },
      { label: "Hydra market swarm scenarios", done: true },
      { label: "Rune crash/log capture hooks", done: true },
      { label: "Axiom player smoke route", done: true },
      { label: "v6 GitHub issue batches", done: true },
      { label: "Axiom performance budgets", done: true },
      { label: "Hydra retention/churn scenarios", done: true },
      { label: "Web production smoke rerun", done: true },
      { label: "iOS simulator smoke", done: false },
      { label: "Android emulator smoke", done: false },
    ],
    owners: ["Ghost", "Zoro", "Rune", "Vex", "Nyx", "Axiom", "Oracle", "Kite", "Talon"],
  },
  {
    id: "phase-2-native-internal-testing",
    name: "Phase 2 - Native Internal Testing",
    dates: "2026-05-11 -> 2026-05-24",
    status: "upcoming",
    summary: "Produce TestFlight and Play Internal Testing builds.",
    deliverables: [
      "EAS preview/internal/store profiles",
      "Bundle IDs, app schemes, icon, splash, permissions, and env policy",
      "Xcode 26 / iOS 26 SDK and Android API 35 target compliance evidence",
      "Crash/log capture path exists for internal QA attachment; native simulator validation still needs to exercise it",
      "Native persistence hydration and reset recovery",
      "SupabaseAuthority live project application, RLS validation, and launch-scope decision after the committed migration baseline",
      "Store-safe privacy/token/trading language baseline, with public privacy policy and final legal declarations still required",
    ],
    milestones: [
      { label: "EAS profiles committed", done: true },
      { label: "First TestFlight build uploaded", done: false },
      { label: "First Play Internal Testing build uploaded", done: false },
    ],
    owners: ["Ghost", "Rune", "Kite", "Axiom", "Cipher", "Talon"],
  },
  {
    id: "phase-3-store-candidate",
    name: "Phase 3 - App Store Candidate",
    dates: "2026-05-25 -> 2026-06-14",
    status: "upcoming",
    summary: "Reach a submission-quality candidate.",
    deliverables: [
      "App Store preview storyboard and capture plan",
      "App Store screenshot captures generated and iterated by agents",
      "App preview video",
      "Autonomous Palette/Reel/Zara asset polish on icon/splash, screenshot-safe visual states, trailer staging, and source-rights evidence",
      "Store description, keywords, support URL, privacy copy, and age rating notes",
      "Legal/security review of $OBOL naming, simulated trading, wallet flags, and data handling using the completed Cipher policy matrix and Kite store-safety guard",
      "Final economy tuning",
      "Regression suite green",
      "AI Council autonomous store-readiness checkpoint",
    ],
    milestones: [
      { label: "Preview storyboard and capture plan", done: true },
      { label: "Store asset audit", done: true },
      { label: "Screenshot-safe visual presets", done: true },
      { label: "Policy risk matrix", done: true },
      { label: "Store-safe wallet/token boundary review", done: true },
      { label: "Store metadata drafted", done: false },
      { label: "Preview video generated and validated", done: false },
      { label: "Council autonomous store-readiness checkpoint", done: false },
    ],
    owners: ["Reel", "Palette", "Cipher", "Kite", "Oracle", "Compass", "Zara", "Zyra"],
  },
  {
    id: "phase-4-closed-beta",
    name: "Phase 4 - Closed Beta",
    dates: "2026-06-15 -> 2026-07-12",
    status: "upcoming",
    summary: "Run a controlled beta and tune from real play.",
    deliverables: [
      "20-100 invited players",
      "Crash-free sessions above 99%",
      "D1 retention baseline from the completed first-20 Hydra scenario harness",
      "Feedback intake loop",
      "Economy and retention-risk reports from Hydra/ElizaOS and beta data",
      "Store listing refinements",
    ],
    milestones: [
      { label: "First 20 beta players invited", done: false },
      { label: "Crash-free target reached", done: false },
      { label: "Retention baseline measured", done: false },
    ],
    owners: ["Axiom", "Compass", "Hydra", "Oracle", "Ghost", "Zoro"],
  },
  {
    id: "phase-5-public-launch",
    name: "Phase 5 - Public Launch",
    dates: "target 2026-08",
    status: "upcoming",
    summary: "Public launch after store approval and beta hardening. Agents prepare everything possible; account-owner submission actions are tracked separately when credentials or legal declarations are missing.",
    deliverables: [
      "App Store approval",
      "Play Store approval",
      "Launch trailer and screenshots live",
      "Support/feedback path active",
      "First real player cohort monitored",
    ],
    milestones: [
      { label: "Launched on both stores", done: false },
      { label: "First real cohort monitored", done: false },
    ],
    owners: ["Ghost", "Zoro", "Reel", "Compass", "Axiom"],
  },
];
