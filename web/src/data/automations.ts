/**
 * Registered automations. Vercel jobs correspond to:
 *   1. A cron entry in vercel.json
 *   2. A route handler under web/src/app/api/cron/<slug>/route.ts
 *
 * OpenClaw jobs correspond to the Mac mini scheduler at ~/.openclaw/cron/jobs.json.
 *
 * The Dev Lab surfaces this list at /office/automations so Ghost + Zoro can
 * see what's running autonomously on the project without them touching a
 * keyboard.
 */

export type AutomationOwner =
  | "compass" // project manager
  | "cipher" // research
  | "axiom" // QA
  | "palette" // brand
  | "oracle" // economy
  | "talon" // openclaw long-running
  | "zyra" // named OpenClaw PM/QA worker
  | "zara" // named OpenClaw build worker
  | "hydra" // elizaos swarm
  | "council"; // whole team

export interface Automation {
  slug: string;
  name: string;
  owner: AutomationOwner;
  schedule: string; // cron expression
  humanSchedule: string; // "daily 09:00 UTC"
  endpoint: string; // "/api/cron/<slug>"
  description: string;
  phase: "A" | "B" | "C"; // A = stub, B = partial, C = autonomous
  accent: string;
  /**
   * Where this job runs. Vercel Hobby caps crons at 1/day, so sub-daily jobs
   * are kept as "local" — still callable (manual POST / dev scripts / local
   * tick) but not armed in vercel.json. Upgrade to Pro → flip to "vercel".
   * OpenClaw jobs are armed on zyra-mini and do not map to Vercel route handlers.
   */
  tier: "vercel" | "local" | "openclaw";
}

export const AUTOMATIONS: Automation[] = [
  {
    slug: "council-standup",
    name: "Council Standup",
    owner: "council",
    schedule: "0 9 * * *",
    humanSchedule: "daily at 09:00 UTC",
    endpoint: "/api/cron/council-standup",
    description:
      "Compass calls the Council. Top 3 stale tasks get picked up. Owners update status lines. Decision log appended.",
    phase: "B",
    accent: "#67FFB5",
    tier: "vercel",
  },
  {
    slug: "nightly-audit",
    name: "Nightly Repo Audit",
    owner: "talon",
    schedule: "0 2 * * *",
    humanSchedule: "daily at 02:00 UTC",
    endpoint: "/api/cron/nightly-audit",
    description:
      "Talon (OpenClaw) scans the repo: brand asset integrity, stale TODOs, broken internal links, missing docs.",
    phase: "B",
    accent: "#FFB341",
    tier: "vercel",
  },
  {
    slug: "cybertrader-zyra-autonomy-loop",
    name: "Zyra Autonomy Loop",
    owner: "zyra",
    schedule: "0 */2 * * *",
    humanSchedule: "every 2 hours on zyra-mini",
    endpoint: "openclaw://cron/cybertrader-zyra-autonomy-loop",
    description:
      "Zyra pulls latest main, reads the task board, checks repo/OpenClaw health, convenes Council when needed, and starts the next safe PM/QA/docs/config task.",
    phase: "C",
    accent: "#00F5FF",
    tier: "openclaw",
  },
  {
    slug: "cybertrader-zara-build-loop",
    name: "Zara Build Loop",
    owner: "zara",
    schedule: "30 */4 * * *",
    humanSchedule: "every 4 hours on zyra-mini",
    endpoint: "openclaw://cron/cybertrader-zara-build-loop",
    description:
      "Zara selects a scoped implementation slice, creates a branch, verifies locally, pushes, and opens or updates a draft PR for review.",
    phase: "C",
    accent: "#67FFB5",
    tier: "openclaw",
  },
  {
    slug: "cybertrader-zyra-daily-qa",
    name: "Zyra Daily QA",
    owner: "zyra",
    schedule: "20 8 * * *",
    humanSchedule: "daily at 08:20 Africa/Johannesburg",
    endpoint: "openclaw://cron/cybertrader-zyra-daily-qa",
    description:
      "Runs repo tests, typechecks, web build, OpenClaw health, cron list, and security audit summary before the humans start the day.",
    phase: "C",
    accent: "#00F5FF",
    tier: "openclaw",
  },
  {
    slug: "cybertrader-zara-daily-build",
    name: "Zara Daily Build",
    owner: "zara",
    schedule: "50 8 * * *",
    humanSchedule: "daily at 08:50 Africa/Johannesburg",
    endpoint: "openclaw://cron/cybertrader-zara-daily-build",
    description:
      "Runs the build lane after Zyra's QA pass, then picks one implementation task if the repo is healthy.",
    phase: "C",
    accent: "#67FFB5",
    tier: "openclaw",
  },
  {
    slug: "cybertrader-zyra-evening-status",
    name: "Zyra Evening Status",
    owner: "zyra",
    schedule: "30 18 * * 1-5",
    humanSchedule: "weekdays at 18:30 Africa/Johannesburg",
    endpoint: "openclaw://cron/cybertrader-zyra-evening-status",
    description:
      "Posts the day-end status: PRs, blockers, next autonomous move, model/credit state, and Council decisions that need Ghost or Zoro.",
    phase: "C",
    accent: "#00F5FF",
    tier: "openclaw",
  },
  {
    slug: "cybertrader-zara-weekly-roadmap",
    name: "Zara Weekly Roadmap",
    owner: "zara",
    schedule: "15 10 * * 5",
    humanSchedule: "Fridays at 10:15 Africa/Johannesburg",
    endpoint: "openclaw://cron/cybertrader-zara-weekly-roadmap",
    description:
      "Reviews roadmap drift, task-board gaps, and the next implementation batch, then prepares a draft plan for the Council.",
    phase: "C",
    accent: "#67FFB5",
    tier: "openclaw",
  },
  {
    slug: "brand-qa",
    name: "Brand Asset QA",
    owner: "palette",
    schedule: "0 6 * * *",
    humanSchedule: "daily at 06:00 UTC",
    endpoint: "/api/cron/brand-qa",
    description:
      "Palette scans /public/brand and parent repo /brand for missing files, wrong dimensions, palette drift.",
    phase: "A",
    accent: "#FF2A4D",
    tier: "vercel",
  },
  {
    slug: "weekly-digest",
    name: "Weekly Digest",
    owner: "compass",
    schedule: "0 8 * * 1",
    humanSchedule: "Mondays at 08:00 UTC",
    endpoint: "/api/cron/weekly-digest",
    description:
      "Compass compiles last-week wins, open blockers, next-week plan. Goes to memory/MEMORY.md + posts to Discord (Phase C).",
    phase: "B",
    accent: "#7A5BFF",
    tier: "vercel",
  },
  {
    slug: "ai-team-tick",
    name: "AI Team Tick",
    owner: "compass",
    schedule: "0 * * * *",
    humanSchedule: "every hour (local dev only on Hobby)",
    endpoint: "/api/cron/ai-team-tick",
    description:
      "Heartbeat. Confirms cron infrastructure is alive. Phase C dispatches outstanding tasks to the right agent. Hobby plan caps Vercel crons at daily — run locally via `curl` or `vercel dev` loop, or upgrade to Pro.",
    phase: "A",
    accent: "#00F5FF",
    tier: "local",
  },
  {
    slug: "market-tick",
    name: "Synthetic Market Tick",
    owner: "hydra",
    schedule: "*/15 * * * *",
    humanSchedule: "every 15 min (local dev only on Hobby)",
    endpoint: "/api/cron/market-tick",
    description:
      "Hydra's ElizaOS swarm runs a 5-minute deterministic market simulation. Validates the price engine before it ships to the game. Hobby plan caps Vercel crons at daily — run locally or upgrade to Pro.",
    phase: "A",
    accent: "#FF2A4D",
    tier: "local",
  },
];

export const AUTOMATIONS_BY_OWNER = AUTOMATIONS.reduce<Record<AutomationOwner, Automation[]>>(
  (acc, a) => {
    (acc[a.owner] ??= []).push(a);
    return acc;
  },
  {} as Record<AutomationOwner, Automation[]>,
);
