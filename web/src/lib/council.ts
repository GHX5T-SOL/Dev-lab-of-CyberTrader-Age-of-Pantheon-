/**
 * Server-side Council runner.
 *
 * A "council run" is one autonomous turn where a rotating subset of agents
 * react to the current state of the project and optionally produce an action
 * (a decision-log entry, a code comment, a tweet draft, etc.).
 *
 * Phase A/B: this calls Anthropic directly with a structured prompt. The
 * response is parsed + persisted to memory/council-log.jsonl via the
 * appendCouncilLog helper. Phase C swaps direct calls for Vercel AI Gateway
 * so we get fallback + per-provider observability.
 *
 * This file is NODE-ONLY. Never import into client bundles.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { TEAM, type TeamMember } from "@/data/team";
import { STATUS } from "@/data/status";
import { TASKS } from "@/data/tasks";

export interface CouncilPick {
  slug: string;
  stance: "supports" | "neutral" | "pushes_back";
  oneLine: string;
}

export interface CouncilRun {
  at: string;
  trigger: "standup" | "manual" | "nightly-audit" | "weekly-digest";
  topic: string;
  participants: string[];
  picks: CouncilPick[];
  summary: string;
  actions: string[];
  provider: "anthropic" | "stub";
  tokensIn?: number;
  tokensOut?: number;
}

const LOG_PATH = path.join(process.cwd(), "memory", "council-log.jsonl");

export async function appendCouncilLog(entry: CouncilRun): Promise<void> {
  try {
    const dir = path.dirname(LOG_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.appendFile(LOG_PATH, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    // Vercel serverless FS is read-only outside /tmp. Fall back to /tmp.
    try {
      const tmp = path.join("/tmp", "council-log.jsonl");
      await fs.appendFile(tmp, JSON.stringify(entry) + "\n", "utf8");
    } catch (err2) {
      console.warn("[council] log write failed:", err2);
    }
  }
}

export async function readCouncilLog(limit = 50): Promise<CouncilRun[]> {
  const candidates = [LOG_PATH, path.join("/tmp", "council-log.jsonl")];
  for (const p of candidates) {
    try {
      const raw = await fs.readFile(p, "utf8");
      const lines = raw.trim().split("\n").slice(-limit);
      return lines
        .map((l) => {
          try {
            return JSON.parse(l) as CouncilRun;
          } catch {
            return null;
          }
        })
        .filter((x): x is CouncilRun => x !== null);
    } catch {
      // try next
    }
  }
  return [];
}

function pickParticipants(topic: string): TeamMember[] {
  const must = TEAM.filter((m) => m.slug === "compass" || m.slug === "cipher"); // always present
  const agents = TEAM.filter((m) => m.kind === "agent" && !must.some((s) => s.slug === m.slug));
  // Simple heuristic: rotate based on time hash so different agents show up.
  const now = Date.now();
  const seed = Math.floor(now / 60_000);
  const pool = [...agents];
  const picked: TeamMember[] = [];
  while (picked.length < 3 && pool.length > 0) {
    const idx = (seed + picked.length) % pool.length;
    const candidate = pool[idx];
    if (!candidate) break;
    picked.push(candidate);
    pool.splice(idx, 1);
  }
  // Topic-bias: if the topic mentions a keyword, force the owner into the mix.
  const lower = topic.toLowerCase();
  const keywordOwner: Array<[string[], string]> = [
    [["asset", "logo", "palette", "brand", "color"], "palette"],
    [["market", "price", "commodity", "economy", "curve"], "oracle"],
    [["task", "roadmap", "plan", "sprint", "phase"], "compass"],
    [["ui", "ux", "screen", "motion"], "vex"],
    [["rn", "expo", "reanimated", "mobile"], "rune"],
    [["supabase", "rls", "wallet", "solana", "sol"], "kite"],
    [["video", "reel", "cutscene", "remotion"], "reel"],
    [["test", "bug", "qa", "regression"], "axiom"],
    [["api", "library", "package", "lib", "framework"], "cipher"],
    [["design", "mechanic", "loop", "rank"], "nyx"],
    [["openclaw", "cron", "automation", "autonomous", "health", "status"], "zyra"],
    [["branch", "build", "pr", "pull request", "implementation", "code"], "zara"],
  ];
  for (const [kws, slug] of keywordOwner) {
    if (kws.some((k) => lower.includes(k))) {
      const forced = TEAM.find((m) => m.slug === slug);
      if (forced && !must.some((p) => p.slug === slug) && !picked.some((p) => p.slug === slug)) {
        picked.pop(); // trim to keep size
        picked.push(forced);
      }
    }
  }
  return [...must, ...picked];
}

function stubPicks(members: TeamMember[], topic: string): CouncilPick[] {
  const STANCES = ["supports", "neutral", "pushes_back"] as const;
  return members.map((m, i) => ({
    slug: m.slug,
    stance: STANCES[i % STANCES.length] ?? "neutral",
    oneLine: `${m.name}: ${topic} — input from the ${m.role.toLowerCase()} seat.`,
  }));
}

/**
 * Ask Claude to produce structured council output. Falls back to stub if
 * ANTHROPIC_API_KEY is missing or the API is unreachable.
 */
async function callClaude(
  topic: string,
  context: string,
  members: TeamMember[],
): Promise<{
  picks: CouncilPick[];
  summary: string;
  actions: string[];
  tokensIn?: number;
  tokensOut?: number;
}> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) {
    return {
      picks: stubPicks(members, topic),
      summary: `[stub] Council convened on "${topic}". No ANTHROPIC_API_KEY configured — add it to enable real output.`,
      actions: ["Set ANTHROPIC_API_KEY in Vercel env"],
    };
  }

  const roster = members
    .map((m) => `- ${m.name} (${m.role}): ${m.persona.split(".")[0]}`)
    .join("\n");

  const system = [
    "You are the AI Council of the CyberTrader: Age of Pantheon Dev Lab.",
    "Ghost is the human founder and Lead Developer. Zoro is the human co-founder and Creative Lead.",
    "Zyra and Zara are named OpenClaw workers on the Mac mini; include them when automation, QA, build, branch, or PR risk matters.",
    "You output strict JSON matching this TypeScript type:",
    "{",
    '  "picks": Array<{ "slug": string, "stance": "supports" | "neutral" | "pushes_back", "oneLine": string }>,',
    '  "summary": string, // under 400 chars',
    '  "actions": string[] // 1-5 concrete next steps',
    "}",
    "",
    "Only respond with JSON. No prose outside the JSON object.",
    "Each agent stays in character per their role. Keep voice terse, neo-hacker, in-world.",
    "No external IP. No Ghost in the Shell / Watch Dogs references.",
  ].join("\n");

  const user = [
    `TOPIC: ${topic}`,
    "",
    "CURRENT STATE:",
    context,
    "",
    "COUNCIL ROSTER (use slug in picks):",
    roster,
  ].join("\n");

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!r.ok) {
      throw new Error(`anthropic http ${r.status}`);
    }
    const j = (await r.json()) as {
      content: Array<{ type: string; text?: string }>;
      usage?: { input_tokens?: number; output_tokens?: number };
    };
    const text = j.content?.find((c) => c.type === "text")?.text ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("no JSON in Claude response");
    const parsed = JSON.parse(jsonMatch[0]) as {
      picks: CouncilPick[];
      summary: string;
      actions: string[];
    };
    return {
      picks: parsed.picks,
      summary: parsed.summary,
      actions: parsed.actions,
      tokensIn: j.usage?.input_tokens,
      tokensOut: j.usage?.output_tokens,
    };
  } catch (err) {
    console.warn("[council] Claude call failed, using stub:", err);
    return {
      picks: stubPicks(members, topic),
      summary: `[stub-fallback] Claude unreachable. Topic: ${topic}`,
      actions: ["Check ANTHROPIC_API_KEY", "Retry from /office/council"],
    };
  }
}

export async function runCouncil(input: {
  trigger: CouncilRun["trigger"];
  topic?: string;
}): Promise<CouncilRun> {
  const openTasks = TASKS.filter((t) => t.status !== "done");
  const firstOpen = openTasks[0];
  const topic =
    input.topic ??
    (firstOpen
      ? `Stale task — ${firstOpen.title}`
      : "Routine standup — nothing blocked, what do we push on next");

  const members = pickParticipants(topic);
  const context = [
    `Phase: ${STATUS.phaseId}`,
    `Headline: ${STATUS.headline}`,
    `Open tasks: ${openTasks.length}`,
    `Next milestone: ${STATUS.nextMilestone}`,
    firstOpen ? `Top task: ${firstOpen.title} (owner: ${firstOpen.owner}, status: ${firstOpen.status})` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await callClaude(topic, context, members);

  const run: CouncilRun = {
    at: new Date().toISOString(),
    trigger: input.trigger,
    topic,
    participants: members.map((m) => m.slug),
    picks: result.picks,
    summary: result.summary,
    actions: result.actions,
    provider: process.env.ANTHROPIC_API_KEY ? "anthropic" : "stub",
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
  };

  await appendCouncilLog(run);
  return run;
}
