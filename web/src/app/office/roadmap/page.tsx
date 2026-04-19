import { ROADMAP } from "@/data/roadmap";
import { Panel, PanelHeader } from "@/components/Panel";
import { CyberText } from "@/components/CyberText";

export const metadata = { title: "Calendar — Roadmap" };

const STATUS_COLOR: Record<string, string> = {
  active: "#67FFB5",
  upcoming: "#8A94A7",
  complete: "#00F5FF",
};

export default function RoadmapPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">calendar_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">ROADMAP</CyberText>
        <p className="max-w-3xl text-sm text-dust">
          Six phases, thirteen weeks. Dates are guidance — milestones are the truth. Source canon:{" "}
          <code className="text-cyan">docs/Roadmap.md</code>.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        {ROADMAP.map((p) => {
          const tone =
            p.status === "active" ? "acid" : p.status === "complete" ? "cyan" : "cyan";
          const color = STATUS_COLOR[p.status] ?? "#8A94A7";
          return (
            <Panel key={p.id} tone={tone}>
              <PanelHeader
                eyebrow={p.dates}
                title={p.name}
                right={
                  <span
                    className="rounded-sm border px-2 py-0.5 text-[10px] uppercase tracking-[0.25em]"
                    style={{ borderColor: `${color}55`, color }}
                  >
                    {p.status}
                  </span>
                }
              />
              <p className="text-sm leading-relaxed text-chrome/90">{p.summary}</p>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/80">
                  deliverables
                </div>
                <ul className="mt-2 space-y-1 text-[13px] text-dust">
                  {p.deliverables.map((d) => (
                    <li key={d}>
                      <span className="text-cyan">»</span> {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/80">
                  milestones
                </div>
                <ul className="mt-2 space-y-1 text-[13px]">
                  {p.milestones.map((m) => (
                    <li key={m.label}>
                      <span className={m.done ? "text-acid" : "text-dust/60"}>
                        {m.done ? "[x]" : "[ ]"}
                      </span>{" "}
                      <span className={m.done ? "text-chrome" : "text-dust"}>{m.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.owners.map((o) => (
                  <span
                    key={o}
                    className="rounded-sm border border-cyan/20 bg-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-chrome/80"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
