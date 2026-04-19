import { LAST_UPDATED, TASKS, type TaskStatus } from "@/data/tasks";
import { TEAM } from "@/data/team";
import { Panel, PanelHeader } from "@/components/Panel";
import { CyberText } from "@/components/CyberText";

export const metadata = { title: "Whiteboard — Tasks" };

const STATUS_ORDER: TaskStatus[] = ["doing", "review", "todo", "blocked", "done"];

const STATUS_COLOR: Record<TaskStatus, string> = {
  blocked: "#FF2A4D",
  todo: "#8A94A7",
  doing: "#67FFB5",
  review: "#FFB341",
  done: "#00F5FF",
};

export default function TasksPage() {
  const byOwner = TEAM.map((m) => ({
    member: m,
    tasks: TASKS.filter((t) => t.owner === m.slug).sort(
      (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
    ),
  })).filter((g) => g.tasks.length > 0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-acid">whiteboard_01</div>
          <CyberText as="h1" className="text-3xl md:text-4xl">TASKS</CyberText>
          <p className="max-w-3xl text-sm leading-relaxed text-dust">
            Who owns what, right now. Static board in Phase A — edit{" "}
            <code className="text-cyan">web/src/data/tasks.ts</code>. Phase B syncs with GitHub
            Issues or a Supabase table.
          </p>
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
          updated {LAST_UPDATED}
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {byOwner.map(({ member, tasks }) => (
          <Panel
            key={member.slug}
            tone={member.kind === "founder" ? "acid" : "cyan"}
          >
            <PanelHeader
              eyebrow={member.role}
              title={`${member.name} · ${tasks.length} task${tasks.length === 1 ? "" : "s"}`}
            />
            <ul className="flex flex-col gap-2">
              {tasks.map((t) => {
                const color = STATUS_COLOR[t.status];
                return (
                  <li
                    key={t.id}
                    className="rounded-sm border border-cyan/10 bg-ink/60 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 text-[13px] text-chrome">{t.title}</div>
                      <span
                        className="shrink-0 rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.25em]"
                        style={{ borderColor: `${color}55`, color }}
                      >
                        {t.status}
                      </span>
                    </div>
                    {t.notes && (
                      <div className="mt-1 text-[11px] leading-relaxed text-dust">
                        {t.notes}
                      </div>
                    )}
                    {t.links && t.links.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-2 text-[11px]">
                        {t.links.map((l) => (
                          <a
                            key={l.href}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan"
                          >
                            {l.label}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="mt-1 text-[10px] text-dust/60">
                      {t.id} {t.due ? `· due ${t.due}` : ""}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
