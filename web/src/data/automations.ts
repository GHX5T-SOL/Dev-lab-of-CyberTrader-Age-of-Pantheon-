/**
 * Registered automations. Each entry corresponds to:
 *   1. A cron entry in vercel.json
 *   2. A route handler under web/src/app/api/cron/<slug>/route.ts
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
  | "zara" // concrete openclaw asset ops on zyra-mini
  | "zyra" // concrete openclaw node watch on zyra-mini
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
   */
  tier: "vercel" | "local";
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
  {
    slug: "openclaw-heartbeat",
    name: "OpenClaw Node Heartbeat",
    owner: "zyra",
    schedule: "*/10 * * * *",
    humanSchedule: "every 10 min on zyra-mini (pending enable)",
    endpoint: "/api/cron/openclaw-heartbeat",
    description:
      "Zyra checks ssh/Tailscale reachability, GLB_Assets file watcher state, and local render queue liveness on the zyra-mini Mac mini.",
    phase: "B",
    accent: "#7A5BFF",
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
