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
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">cron_ops_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">
          AUTOMATIONS
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Every cron the Dev Lab runs. Each entry maps 1:1 to a route handler under{" "}
          <code className="text-cyan">web/src/app/api/cron/</code> and a schedule in{" "}
          <code className="text-cyan">vercel.json</code>. The AI team works while Ghost + Zoro
          sleep.
        </p>
      </header>

      <Panel tone="acid">
        <PanelHeader eyebrow="how cron works here" title="What Vercel gives us" />
        <ul className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-cyan">Vercel Cron Jobs</span> invoke our route handlers on the
            schedule declared in <code className="text-cyan">vercel.json</code>. Each request
            carries <code className="text-cyan">Authorization: Bearer $CRON_SECRET</code> so the
            route can verify it&apos;s really Vercel, not a random visitor.
          </li>
          <li>
            <span className="text-cyan">Fluid Compute</span> keeps the function warm, so the
            Council&apos;s Anthropic call responds fast. Default timeout is 300s — we cap the
            Council routes at 60s to be safe.
          </li>
          <li>
            Every run <span className="text-cyan">logs to the Vercel Runtime Logs</span>. The
            Council runs also append to the council log for the UI to replay.
          </li>
        </ul>
      </Panel>

      <section className="grid gap-4 md:grid-cols-2">
        {AUTOMATIONS.map((a) => {
          const owner = TEAM.find((m) => m.slug === a.owner);
          return (
            <article
              key={a.slug}
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
                <span
                  className="rounded-sm border px-2 py-0.5 text-[9px] uppercase tracking-[0.25em]"
                  style={{ borderColor: `${PHASE_COLOR[a.phase]}66`, color: PHASE_COLOR[a.phase] }}
                >
                  phase {a.phase}
                </span>
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
        })}
      </section>

      <Panel>
        <PanelHeader eyebrow="manual trigger" title="How to fire a cron right now" />
        <p className="text-[13px] leading-relaxed text-chrome/90">
          In Vercel: <span className="text-cyan">Project → Cron Jobs → pick one → Run Job</span>.
          Locally with the CLI: <code className="text-cyan">vercel crons run &lt;job&gt;</code>.
          From a script:{" "}
          <code className="text-cyan">
            curl -H &quot;Authorization: Bearer $CRON_SECRET&quot; &lt;URL&gt;
          </code>
          . The Council routes can also be triggered from <a className="text-cyan" href="/office/council">/office/council</a>.
        </p>
      </Panel>
    </div>
  );
}
