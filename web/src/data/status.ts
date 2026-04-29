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
    "Dev Lab 3D office work is complete. CyberTrader v6 is the active game repo, and the AI team is now in full-autonomous shipping mode with no Ghost/Zoro approval gates.",
  phaseId: "phase-1-v6-reliable-demo",
  nextMilestone:
    "Ship daily visible v6 upgrades while moving through PirateOS polish, AgentOS rank-5 systems, PantheonOS late-game territory, SDK 54/native readiness, and store-candidate preparation.",
  blockers: [
    "iOS simulator and Android emulator runtime validation are still pending",
    "Current Codex host has Xcode Command Line Tools only and lacks simctl, Android Emulator, and adb, so native budget evidence needs a provisioned QA host",
    "SupabaseAuthority is feature-flagged and its migration/RPC baseline is committed, but live Supabase project application and RLS validation are not confirmed",
    "Apple/Google credentials and first remote EAS build runs are not yet confirmed",
    "iOS uploads after 2026-04-28 must prove Xcode 26 / iOS 26 SDK build output",
    "Android store builds must prove targetSdkVersion 35 or higher; v6 package manifest, lockfile, and installed package graph now align with Expo SDK 54, but native EAS build evidence is still pending",
    "Expo toolchain transitive dependency advisories remain at moderate severity and need planned SDK/override remediation",
    "Final preview video, public privacy policy, age-rating answers, and store declarations still need account-owner input or implementation; human-only items are tracked in HUMAN_ACTIONS.md and do not block daily v6 work",
    "OpenClaw doctor/security audits can still exceed bounded sessions and report skill gaps; keep these checks time-limited and non-blocking",
    "OpenClaw post-fix doctor still times out in bounded runs and reports 38 skill requirement gaps",
    "OpenAI generation is quota-limited on the Mac mini runner, so live work must use free-first OpenRouter/Goose routing, deterministic maintenance, Claude/Codex CLI, or existing paid credits only when available",
  ],
  recentWins: [
    "Dev Lab /office 3D metaverse work shipped and is now closed as a studio milestone",
    "Dev Lab GitHub open PRs/issues were cleaned to zero open items",
    "CyberTrader v6 live deployment returns HTTP 200, passes npm run health:live, passes the hardened qa:axiom:live Chromium smoke, and v6 origin/main is verified through d751d68 after persisted terminal limit orders, cyberdeck surface polish, terminal pressure flow, AgentOS contract chains, limit-order/faction-pressure interfaces, intro transmission polish, privacy policy sync, AgentOS faction selection, store-media direction approval, SDK 54 package alignment, GLCH archetype admission, and worktree-safe regression monitor repair",
    "v6 contains the LocalAuthority trade loop, ledger, inventory, XP/rank, locations, heat/raids, couriers, news, missions, district states, streaks, daily challenges, bounty, and away report",
    "Rune completed the v6 technical audit: install, typecheck, Jest, and Expo web export pass locally",
    "Rune completed route hardening: protected deep links recover after hydration and menu/Android back actions have safe fallbacks",
    "Rune started persistence reliability coverage: native storage save/load, reset clearing, and corrupt JSON recovery are covered by Jest and documented in v6",
    "Rune completed EAS profiles for preview, iOS simulator, internal, store, and production build paths",
    "Rune partially completed rune-p0-006: v6 now has an Expo SDK 54-compatible package graph with React 19, React Native 0.81.5, Expo Router 6, Reanimated 4 Worklets, and Jest Expo 54",
    "Rune completed crash/log capture hooks with redacted local diagnostics and QA session context export; v6 ship:check passes with 123/123 Jest tests",
    "Oracle completed the 1000-seed economy replay harness with 1000 profitable sessions, 81 raid sessions, 0 soft locks, 0 impossible states, and median PnL 48.88",
    "Oracle completed launch tuning bands with 1000/1000 profitable sessions, median max Heat 60, 81 raid sessions, and zero low/medium/high-risk strategy issues",
    "Ghost release authority is superseded by the full-autonomy directive: direct-to-main criteria remain, but Ghost/Zoro approvals no longer block development",
    "Ghost completed the architecture risk audit with Expo dependency risks, storage/authority boundary review, EAS Node aligned to Expo SDK 52, and top 10 technical risks assigned to owners",
    "Kite completed the SupabaseAuthority flag boundary: LocalAuthority stays default, flagged Supabase config is tested, and RLS requirements are documented",
    "Kite completed the launch-safe identity/recovery model: first playable launch requires only a local handle, with no wallet, backend account, or payment method",
    "Kite completed SupabaseAuthority migration prep: deterministic schema/rollback SQL, RPC write gates, seeded commodities, and migration guard tests are committed in v6 15308c9",
    "Kite completed the store-safe wallet/token boundary review: shared Legal/Settings copy now has prohibited-claims tests for real-money, investment, regulated-market, prize, and signing-material language",
    "Axiom completed the store-submission regression checklist; the current v6 local check path passes with 139/139 Jest tests",
    "Axiom completed launch performance budgets with npm run perf:budgets plus native cold-start, memory, latency, and runtime-error targets for axiom-p0-001",
    "Axiom completed and re-hardened the player smoke route: npm run qa:smoke covers intro, login, tutorial, buy, sell, inventory, and settings/local identity recovery on the rebuilt web export",
    "Axiom completed performance budgets: npm run perf:budgets enforces web export thresholds and Gate B now has numeric native targets",
    "Nyx completed first-session loop tightening with live home/terminal cues, a manual market tick action, and starter VBLM profit tests",
    "Nyx completed 10-minute demo pressure tuning with starter, route-runner, and contraband strategy bands",
    "Nyx/Oracle completed tuned strategy guidance: VBLM x15 starter route, Heat-aware Oracle cue, Help/NPC hints, GLCH icon coverage, 155/155 tests, smoke, responsive QA, live QA, and force regression all pass",
    "Nyx shipped AgentOS rank-5 faction selection: deterministic faction definitions, faction alignment matrix, persisted FactionChoice, one-free-switch rule, LocalAuthority chooseFaction support, faction-biased missions, mission contact linkage, and 165/165 tests passing",
    "Nyx shipped AgentOS contract chains: mission banners and contact rows now show faction stage, Heat posture, route consequence, and reputation delta from deterministic faction contracts",
    "Oracle shipped deterministic limit-order and faction-pressure engine contracts with npm run limit-orders:check coverage for order fills, cancellation, expiry, and pressure-triggered sell execution",
    "Oracle shipped terminal pressure and limit-order command flow in v6 d751d68: bound AgentOS factions apply deterministic pressure windows and /terminal now persists, cancels, expires, and resolves LocalAuthority limit orders",
    "Vex shipped the first core cyberdeck surface polish slice in v6 d751d68: /home and /terminal now use packet section headers, market tape labels, and terminal subsystem framing",
    "Reel/Codex polished the intro handoff with packet metadata, signal status, progress rails, and larger mobile-safe skip/enter commands",
    "Zoro's first 10-minute creative pass and store-media direction approval are preserved as direction, while future visual/copy work now ships autonomously",
    "Vex completed the mobile HUD readability pass with prioritized Energy/Heat/0BOL telemetry, terminal owned-quantity visibility, scaled labels, and 44-52 px first-trade touch targets",
    "Vex completed exported-web responsive viewport captures and QA across web desktop, small phone, large phone, and tablet portrait",
    "Zoro completed zoro-p0-002: the six-shot portrait screenshot direction, Reel preview story spine, and cyberdeck store-page mood are approved for autonomous iteration",
    "Talon completed the autonomous safety preflight and full v6 ship check command for direct-push implementation loops",
    "Vex completed diegetic loading, empty, offline, and error states with safe system-message handling",
    "Reel completed the App Store preview storyboard, 30-second beat sheet, and named capture routes; agents can now iterate preview media without waiting for human approval",
    "Cipher completed the 2026 Apple/Google/Expo submission requirements pass and updated the Axiom store checklist with Xcode 26 and Android API 35 gates",
    "Palette completed the v6 store asset audit and flagged provenance, icon/splash, capture-safety, and optimization follow-ups",
    "Zara completed zara-p1-005: v6 now has a repeatable provenance inventory/check workflow, with store-media clearance language aligned to the autonomy policy and 39 tracked assets current through 7bf5e38",
    "Kite completed kite-p0-002 launch identity recovery in v6 commit 747ff72, keeping first launch wallet-free while documenting recovery limitations",
    "Palette/Zyra completed screenshot-safe visual state captures for home, terminal, market, missions, inventory, and profile at 1242x2688 and synced the SuperDesign capture context",
    "Zoro completed store media direction approval: the six-shot portrait screenshot set, Reel preview story spine, and cyberdeck store-page mood are locked for autonomous iteration",
    "Cipher completed the privacy/token/simulated-trading/age-rating risk matrix with required policy copy and legal escalation triggers",
    "Hydra completed deterministic market-swarm scenarios for balanced beta, novice onramp, contraband risk-spike, and speedrun race cohorts",
    "Hydra completed first-20-player retention/churn scenarios with five personas, four beta cohorts, churn triggers, and Game Designer handoff notes",
    "Oracle completed oracle-p1-009: GLCH now participates in the deterministic momentum-trader archetype and beta-tuned mirror while retention and swarm fixtures stay green",
    "Talon follow-up repaired npm run regression:monitor for linked worktrees by persisting state through git rev-parse --git-path regression-state.json; latest post-push monitor passed on 7bf5e38",
    "Zyra/Codex hardened the live and local Axiom smokes in v6 commits 5481191, d5a0a83, 98f1623, daa33e9, ff7b7c3, and 93096a5; live smoke and qa:smoke both pass",
    "Zara pushed v6 fdd7160 with Obsidian, a rank-7 Eclipse Guild NPC, after OpenClaw repair restored active work on the Mac mini",
    "Codex pushed v6 49c1e49 to repair the Expo SDK 54 lockfile, track GLCH source/optimized art, refresh 39-asset provenance, and verify ship:check plus post-push regression:monitor",
    "Talon/Zyra completed the rollback and incident protocol: P0/P1/P2 severity tiers, bad-commit detection signals, Vercel dashboard and CLI rollback, git revert procedure, native build rollback (Gate B+), escalation contacts, and post-incident note template are all documented",
    "Compass created v6 GitHub issue batches #2-#6 for the active P0/P1 readiness work, with owner and priority mapping in each issue body",
    "New autonomous v6 task map assigns work to the AI Council, Codex automations, Zara, and Zyra, with Ghost/Zoro treated as optional observers",
    "OpenClaw on zyra-mini is updated to 2026.4.26, gateway /ready is healthy, v6 is cloned, and Zara/Zyra run through external launchd jobs plus a 15-minute watchdog",
    "OpenClaw runner config uses xhigh reasoning, free-first Goose/OpenRouter routing, optional paid routes, and deterministic local maintenance when providers fail",
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
      detail: "Open PRs and issues in the Dev Lab repo were closed as superseded by the v6 production map; v6 now has issue batches #2-#6 for active P0/P1 readiness work",
    },
    {
      label: "v6 deployment",
      state: "green",
      detail: "https://cyber-trader-age-of-pantheon-v6.vercel.app returns HTTP 200, passes npm run health:live, passes npm run qa:axiom:live, and v6 origin/main is verified through d751d68 with ship:check and qa:smoke green; prior 1631381 focused terminal-pressure/limit-order clean-cache export and prior 3ab5746 live health/live Axiom smoke remain valid",
    },
    {
      label: "Build checks",
      state: "green",
      detail: "Rune audit, SDK 54 package alignment, route hardening, storage regression checks, crash/log diagnostics hooks, Oracle replay/tuning/strategy guidance/GLCH archetype/limit-order/terminal-pressure audits, terminal limit-order UI, Hydra swarm/retention scenarios, Ghost architecture risk audit, Kite authority/store-safety checks, Nyx first-session/pressure/AgentOS faction/contract-chain tests, Zoro store-media approval, Vex HUD/responsive/system-state/cyberdeck polish validation, Talon safety preflight and worktree-safe monitor, EAS config validation, Axiom performance budgets/smokes, Palette screenshot capture, Zara provenance drift check, local Axiom QA 11/11, provenance check, live health, live smoke, latest perf budgets, and Expo web export pass locally",
    },
    {
      label: "Native QA",
      state: "amber",
      detail: "EAS profiles, Axiom checklists, and native performance budgets exist, but iOS simulator and Android emulator smoke runs remain blocked until a host with full Xcode, simctl, Android Emulator, and adb runs them",
    },
    {
      label: "SupabaseAuthority",
      state: "amber",
      detail: "Feature-flagged adapter selection, LocalAuthority launch identity/recovery, and deterministic schema/RPC migrations are committed; live project migration application and RLS validation are still pending",
    },
    {
      label: "Dependency audit",
      state: "amber",
      detail: "v6 package manifest, lockfile, and installed package graph now align with Expo SDK 54; npm audit --omit=dev --audit-level=high exits 0, while npm audit still reports 14 moderate Expo-toolchain advisories and native EAS output must prove Android API 35+ before Play Store submission",
    },
    {
      label: "Store toolchain",
      state: "amber",
      detail: "Cipher's requirements and policy matrix plus Kite's store-safety guard are complete; Gate B/C now needs Xcode 26 / iOS 26 SDK proof, Android targetSdkVersion 35 proof, public privacy policy, and final store declarations",
    },
    {
      label: "OpenClaw node",
      state: "amber",
      detail: "SSH works, OpenClaw 2026.4.26 is running, gateway /ready is healthy, v6 is cloned, and Zara/Zyra run through external launchd jobs plus a 15-minute watchdog; residual doctor skill gaps and provider limits remain",
    },
    {
      label: "Autonomy policy",
      state: "green",
      detail: "Direct-push criteria, Talon local safety preflight, rollback protocol, and no-human-approval rules are documented; Zyra autonomous run ledger is active in docs/automation-runs/",
    },
    {
      label: "Store assets",
      state: "amber",
      detail: "Zoro's store-media direction approval, Reel's storyboard, Palette's asset audit, icon/splash art, generated captures, Cipher's policy matrix, Kite's identity/recovery baseline, Dev Lab provenance report, and zara-p1-005 inventory are ready inputs; final preview video, native-device captures, public privacy policy, and store-owner declarations remain account/legal follow-ups",
    },
  ],
  updated: "2026-04-29",
};
