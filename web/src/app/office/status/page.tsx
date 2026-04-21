import { STATUS } from "@/data/status";
import { Panel, PanelHeader } from "@/components/Panel";
import { CyberText } from "@/components/CyberText";
import { OPENCLAW_AGENT_STATUS, OPENCLAW_NODE } from "@/data/openclaw";

export const metadata = { title: "Status Terminal" };

const COLORS = { green: "#67FFB5", amber: "#FFB341", red: "#FF2A4D" } as const;

export default function StatusPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">status_terminal_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">STATUS</CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Live signals. Updated each session. Edit{" "}
          <code className="text-cyan">web/src/data/status.ts</code>.
        </p>
      </header>

      <Panel tone="acid">
        <div className="text-[10px] uppercase tracking-[0.25em] text-acid">headline</div>
        <h2 className="mt-1 text-lg leading-snug text-chrome">{STATUS.headline}</h2>
        <div className="mt-3 grid gap-2 text-[13px] md:grid-cols-2">
          <div>
            <span className="text-dust">phase:</span>{" "}
            <span className="text-chrome">{STATUS.phaseId}</span>
          </div>
          <div>
            <span className="text-dust">updated:</span>{" "}
            <span className="text-chrome">{STATUS.updated}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-dust">next milestone:</span>{" "}
            <span className="text-chrome">{STATUS.nextMilestone}</span>
          </div>
        </div>
      </Panel>

      <Panel tone="violet">
        <PanelHeader eyebrow="physical layer" title={OPENCLAW_NODE.label} />
        <div className="grid gap-3 text-[13px] leading-relaxed md:grid-cols-[1fr_1fr]">
          <div>
            <div className="text-dust">command:</div>
            <code className="text-cyan">{OPENCLAW_NODE.ssh}</code>
            <div className="mt-2 text-dust">host:</div>
            <span className="text-chrome">{OPENCLAW_NODE.host}</span>
            <p className="mt-3 text-[12px] text-dust">{OPENCLAW_NODE.note}</p>
          </div>
          <div className="grid gap-2">
            {OPENCLAW_AGENT_STATUS.map((agent) => (
              <div key={agent.slug} className="rounded-sm border border-violet/25 p-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-violet">
                  {agent.name} · {agent.state}
                </div>
                <div className="mt-1 text-chrome">{agent.role}</div>
                <div className="mt-1 text-[12px] text-dust">{agent.heartbeat}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <section>
        <PanelHeader eyebrow="live signals" title="System health" />
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {STATUS.signals.map((s) => {
            const c = COLORS[s.state];
            return (
              <div
                key={s.label}
                className="panel rounded-sm p-4"
                style={{ borderColor: `${c}55` }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-dust">
                    {s.label}
                  </div>
                  <span
                    className="rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.25em]"
                    style={{ borderColor: `${c}55`, color: c }}
                  >
                    {s.state}
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-chrome/90">{s.detail}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <Panel tone="heat">
          <PanelHeader eyebrow="now" title="Blockers" />
          <ul className="space-y-2 text-[13px] text-chrome/90">
            {STATUS.blockers.length === 0 ? (
              <li className="text-acid">» none</li>
            ) : (
              STATUS.blockers.map((b) => (
                <li key={b}>
                  <span className="text-heat">×</span> {b}
                </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel tone="acid">
          <PanelHeader eyebrow="recent" title="Wins" />
          <ul className="space-y-2 text-[13px] text-chrome/90">
            {STATUS.recentWins.map((w) => (
              <li key={w}>
                <span className="text-acid">✓</span> {w}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
