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
      "Ghost/Zoro collaboration model documented",
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
      "Founder selection for Ghost/Zoro live",
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
      "Make CyberTrader v6 a reliable demo across Web, iOS simulator, and Android emulator. Rune's technical audit, route hardening, storage regression checks, EAS profiles, Oracle's replay harness and launch tuning bands, Ghost's release-authority bar and architecture risk audit, EAS Node alignment, Kite's SupabaseAuthority flag boundary, Nyx's first-session loop guidance and pressure bands, Zoro's first-journey creative pass, Vex's mobile HUD readability pass, and Zyra's repeatable live health command are in place.",
    deliverables: [
      "Typecheck, tests, and web export green",
      "Expo Router route recovery and Android/menu back paths hardened",
      "Native storage save/load, reset clearing, and corrupt data recovery covered by Jest",
      "1000-seed deterministic economy replay harness for soft-lock and tuning checks",
      "Launch survival, Heat, raid, and reward tuning bands locked with zero strategy issues",
      "Release blockers, direct-push criteria, and Gate A/B/C Ghost sign-off rules documented",
      "Top 10 App Store architecture risks assigned to owners with evidence requirements",
      "SupabaseAuthority guarded behind explicit feature flag and public config checks",
      "First-session home/terminal guidance and manual market tick action for the starter profitable sell loop",
      "10-minute demo pressure bands for starter, route-runner, and contraband strategies",
      "Mobile HUD readability and one-hand first-trade controls",
      "Live Vercel shell-marker health command",
      "Live Vercel smoke passes",
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
      { label: "Axiom store-submission regression checklist", done: true },
      { label: "Nyx first-session loop map", done: true },
      { label: "Nyx demo pressure bands", done: true },
      { label: "First-session creative pass", done: true },
      { label: "Vex mobile HUD readability", done: true },
      { label: "Live shell-marker health command", done: true },
      { label: "Web production smoke rerun", done: false },
      { label: "iOS simulator smoke", done: false },
      { label: "Android emulator smoke", done: false },
    ],
    owners: ["Ghost", "Zoro", "Rune", "Vex", "Nyx", "Axiom", "Oracle"],
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
      "Crash/log capture path",
      "Native persistence hydration and reset recovery",
      "SupabaseAuthority live project, migrations, RLS validation, and launch-scope decision",
      "Store-safe privacy/token/trading language",
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
      "App Store screenshots and preview video",
      "Store description, keywords, support URL, privacy copy, and age rating notes",
      "Legal/security review of $OBOL naming, simulated trading, wallet flags, and data handling",
      "Final economy tuning",
      "Regression suite green",
      "AI Council store-readiness sign-off",
    ],
    milestones: [
      { label: "Store metadata drafted", done: false },
      { label: "Preview video approved by Zoro", done: false },
      { label: "Council store-readiness sign-off", done: false },
    ],
    owners: ["Zoro", "Reel", "Palette", "Cipher", "Kite", "Oracle", "Compass"],
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
      "D1 retention baseline",
      "Feedback intake loop",
      "Economy stress reports from Hydra/ElizaOS and beta data",
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
    summary: "Public launch after store approval and beta hardening.",
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
