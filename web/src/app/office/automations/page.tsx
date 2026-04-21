import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";
import { AUTOMATIONS } from "@/data/automations";
import { TEAM } from "@/data/team";

export const metadata = { title: "Automations — Cron Ops" };

const PHASE_COLOR: Record<"A" | "B" | "C", string> = {
  A: "#8A94A7",
  B: "#FFB341",
  C: "#67FFB5",
};

export default function AutomationsPage() {
  const vercelArmed = AUTOMATIONS.filter((a) => a.tier === "vercel");
  const localOnly = AUTOMATIONS.filter((a) => a.tier === "local");
  const openClawJobs = AUTOMATIONS.filter((a) => a.tier === "openclaw");

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">cron_ops_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">
          AUTOMATIONS
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Every automation the Dev Lab runs. Vercel entries map 1:1 to a route handler under{" "}
          <code className="text-cyan">web/src/app/api/cron/</code>. Vercel-armed jobs are listed in{" "}
          <code className="text-cyan">vercel.json</code>; local-only jobs live in the repo as
          callable endpoints. Zyra and Zara run OpenClaw jobs from the Mac mini scheduler.
        </p>
      </header>

      <Panel tone="acid">
        <PanelHeader eyebrow="how cron works here" title="Hobby plan, Pro plan, and why some jobs are local" />
        <ul className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-cyan">Vercel Cron Jobs</span> invoke our route handlers on the
            schedule declared in <code className="text-cyan">vercel.json</code>. Each request
            carries <code className="text-cyan">Authorization: Bearer $CRON_SECRET</code> so the
            route can verify it&apos;s really Vercel, not a random visitor.
          </li>
          <li>
            <span className="text-heat">Hobby plan caps Vercel crons at one run per day.</span>{" "}
            So <code className="text-cyan">ai-team-tick</code> (hourly) and{" "}
            <code className="text-cyan">market-tick</code> (every 15 min) are kept as
            local-only jobs: same route handler, just not scheduled on Vercel. Fire them from a
            local <code className="text-cyan">node</code> loop, a macOS{" "}
            <code className="text-cyan">launchd</code> job, or a GitHub Actions workflow. Upgrade
            to Pro → flip <code className="text-cyan">tier</code> to{" "}
            <code className="text-cyan">&quot;vercel&quot;</code> and add to{" "}
            <code className="text-cyan">vercel.json</code>.
          </li>
          <li>
            <span className="text-cyan">Fluid Compute</span> keeps the function warm, so the
            Council&apos;s Anthropic call responds fast. Default timeout is 300s — we cap the
            Council routes at 60s to be safe.
          </li>
          <li>
            <span className="text-acid">OpenClaw jobs</span> run on{" "}
            <code className="text-cyan">zyra-mini</code>. Zyra owns PM / QA / status loops; Zara owns
            build / branch / draft-PR loops. Their endpoints are{" "}
            <code className="text-cyan">openclaw://cron/*</code> handles, not public HTTP routes.
          </li>
          <li>
            Every run <span className="text-cyan">logs to the Vercel Runtime Logs</span>. The
            Council runs also append to <code className="text-cyan">memory/council-log.jsonl</code>{" "}
            (or <code className="text-cyan">/tmp</code> on serverless FS) for the UI to replay.
            OpenClaw runs report through GitHub branches, logs, and the evening status task.
          </li>
        </ul>
      </Panel>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-acid">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-acid" />
          vercel-armed · {vercelArmed.length} jobs · fire automatically on schedule
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {vercelArmed.map((a) => (
            <AutomationCard key={a.slug} a={a} />
          ))}
        </div>
      </section>

      {openClawJobs.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-cyan">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
            openclaw · {openClawJobs.length} jobs · zyra-mini autonomous workers
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {openClawJobs.map((a) => (
              <AutomationCard key={a.slug} a={a} />
            ))}
          </div>
        </section>
      )}

      {localOnly.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-heat">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-heat" />
            local-only · {localOnly.length} jobs · manual trigger / dev loop / actions
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {localOnly.map((a) => (
              <AutomationCard key={a.slug} a={a} />
            ))}
          </div>
        </section>
      )}

      <Panel>
        <PanelHeader eyebrow="manual trigger" title="How to fire a cron right now" />
        <ul className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-cyan">Vercel dashboard:</span> Project → Cron Jobs → pick one →
            Run Job.
          </li>
          <li>
            <span className="text-cyan">CLI:</span>{" "}
            <code className="text-cyan">vercel crons run &lt;job&gt;</code>
          </li>
          <li>
            <span className="text-cyan">curl:</span>{" "}
            <code className="text-cyan">
              curl -H &quot;Authorization: Bearer $CRON_SECRET&quot; https://&lt;host&gt;/api/cron/&lt;slug&gt;
            </code>
          </li>
          <li>
            <span className="text-cyan">Local dev loop</span> for hourly / 15-min jobs — a one-liner
            you can run on your laptop:
            <pre className="mt-2 overflow-x-auto rounded-sm border border-cyan/20 bg-void p-3 text-[11px] text-chrome/80">{`# hourly ai-team-tick
while true; do
  curl -sS -H "Authorization: Bearer $CRON_SECRET" \\
    http://localhost:3000/api/cron/ai-team-tick
  sleep 3600
done`}</pre>
          </li>
          <li>
            <span className="text-cyan">GitHub Actions</span> (free tier) can run sub-daily crons if
            you don&apos;t want to upgrade Vercel — add a workflow that{" "}
            <code className="text-cyan">curl</code>s the production URL on the schedule you want.
          </li>
          <li>
            <span className="text-cyan">OpenClaw:</span>{" "}
            <code className="text-cyan">ssh zyra-mini</code>, then inspect{" "}
            <code className="text-cyan">~/.openclaw/cron/jobs.json</code> and the Zyra/Zara agent
            docs before changing schedules.
          </li>
        </ul>
      </Panel>
    </div>
  );
}

function AutomationCard({ a }: { a: (typeof AUTOMATIONS)[number] }) {
  const owner = TEAM.find((m) => m.slug === a.owner);
  const tierColor =
    a.tier === "vercel" ? "#67FFB5" : a.tier === "openclaw" ? "#00F5FF" : "#FFB341";
  const tierLabel =
    a.tier === "vercel" ? "vercel-armed" : a.tier === "openclaw" ? "openclaw-armed" : "local-only";
  return (
    <article
      className="panel rounded-sm p-5"
      style={{ borderColor: `${a.accent}44` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
            {a.humanSchedule}
          </div>
          <h3 className="mt-1 text-lg tracking-wide text-chrome">{a.name}</h3>
          <div className="mt-1 text-[11px] text-dust">
            owner:{" "}
            <span
              className="uppercase tracking-[0.25em]"
              style={{ color: owner?.accent ?? "#E8ECF5" }}
            >
              {owner?.name ?? a.owner}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="rounded-sm border px-2 py-0.5 text-[9px] uppercase tracking-[0.25em]"
            style={{ borderColor: `${PHASE_COLOR[a.phase]}66`, color: PHASE_COLOR[a.phase] }}
          >
            phase {a.phase}
          </span>
          <span
            className="rounded-sm border px-2 py-0.5 text-[9px] uppercase tracking-[0.25em]"
            style={{ borderColor: `${tierColor}66`, color: tierColor }}
          >
            {tierLabel}
          </span>
        </div>
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-dust">{a.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
        <span className="rounded-sm border border-cyan/20 px-2 py-0.5 text-cyan">
          {a.schedule}
        </span>
        <span className="rounded-sm border border-dust/20 px-2 py-0.5 text-dust">
          {a.endpoint}
        </span>
      </div>
    </article>
  );
}
