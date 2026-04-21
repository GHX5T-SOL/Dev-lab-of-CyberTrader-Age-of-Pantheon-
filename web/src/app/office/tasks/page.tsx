import { LAST_UPDATED, TASKS, type TaskPriority, type TaskStatus } from "@/data/tasks";
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

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  P0: "#FF2A4D",
  P1: "#FFB341",
  P2: "#67FFB5",
  P3: "#8A94A7",
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
          <CyberText as="h1" className="text-3xl md:text-4xl" glitch>
            PHASE B WHITEBOARD
          </CyberText>
          <p className="max-w-3xl text-sm leading-relaxed text-dust">
            Who owns what, right now. This board is static data shaped for a future draggable
            GitHub Issues or Supabase sync: priority, estimate, dependencies, acceptance criteria,
            and owner tags are all in <code className="text-cyan">web/src/data/tasks.ts</code>.
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
            tone={member.kind === "founder" ? "acid" : member.kind === "openclaw" ? "violet" : "cyan"}
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
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span
                          className="rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.25em]"
                          style={{ borderColor: `${PRIORITY_COLOR[t.priority]}55`, color: PRIORITY_COLOR[t.priority] }}
                        >
                          {t.priority}
                        </span>
                        <span
                          className="rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.25em]"
                          style={{ borderColor: `${color}55`, color }}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>
                    {t.notes && (
                      <div className="mt-1 text-[11px] leading-relaxed text-dust">
                        {t.notes}
                      </div>
                    )}
                    <div className="mt-2 grid gap-2 text-[10px] leading-relaxed text-dust sm:grid-cols-2">
                      <div>
                        <span className="text-dust/60">estimate:</span>{" "}
                        <span className="text-chrome">{t.estimate}</span>
                      </div>
                      {t.dependencies && t.dependencies.length > 0 && (
                        <div>
                          <span className="text-dust/60">deps:</span>{" "}
                          <span className="text-chrome">{t.dependencies.join(", ")}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 border-t border-cyan/10 pt-2">
                      <div className="text-[9px] uppercase tracking-[0.25em] text-cyan/70">
                        acceptance
                      </div>
                      <ul className="mt-1 space-y-1 text-[11px] leading-relaxed text-chrome/80">
                        {t.acceptanceCriteria.map((item) => (
                          <li key={item}>
                            <span className="text-acid">✓</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {t.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {t.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-sm border border-cyan/15 bg-void px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-dust"
                          >
                            {tag}
                          </span>
                        ))}
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
