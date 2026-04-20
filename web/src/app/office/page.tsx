import { Workstation } from "@/components/Workstation";
import { CyberText } from "@/components/CyberText";
import { SpendPanel } from "@/components/SpendPanel";
import { STATUS } from "@/data/status";
import { TASKS } from "@/data/tasks";
import { TEAM } from "@/data/team";
import { AUTOMATIONS } from "@/data/automations";
import { TOOLKIT, CATEGORY_LABELS, type ToolkitCategory } from "@/data/toolkit";

export const metadata = { title: "Office Floor — Dev Lab" };

export default function OfficePage() {
  const ghostTask = TASKS.find((t) => t.owner === "ghost" && t.status !== "done");
  const zoroTask = TASKS.find((t) => t.owner === "zoro" && t.status !== "done");
  const agentsPresent = TEAM.filter((m) => m.kind === "agent").length;
  const activeCrons = AUTOMATIONS.filter((a) => a.tier === "vercel").length;
  const toolkitByCat = TOOLKIT.reduce<Record<ToolkitCategory, typeof TOOLKIT>>(
    (acc, t) => {
      (acc[t.category] ??= []).push(t);
      return acc;
    },
    {} as Record<ToolkitCategory, typeof TOOLKIT>,
  );

  return (
    <div className="flex flex-col gap-10">
      {/* Hero strip */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-cyan">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-acid" />
          <span>signal stable · {agentsPresent} agents on floor</span>
          <span className="text-dust">·</span>
          <span className="text-dust">{activeCrons} crons armed on vercel</span>
          <span className="text-dust">·</span>
          <span className="text-dust">penthouse, s1lkroad tower, sector 7</span>
        </div>
        <CyberText as="h1" className="text-4xl md:text-5xl" glitch>
          THE FLOOR
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Welcome to the Dev Lab. The office overlooks Neon Void City. The team is working — click a
          station to zoom in. Every station maps to a section of the project: calendar (roadmap),
          whiteboard (tasks), team wall, asset vault, monitor wall of wireframes, lore library,
          status terminal, and Zoro&apos;s desk tray.
        </p>
      </section>

      {/* Current focus strip — what Ghost + Zoro are on right now */}
      <section className="grid gap-4 md:grid-cols-2">
        <FocusCard
          label="Ghost — current focus"
          accent="#00F5FF"
          task={ghostTask?.title ?? "No open task."}
          note={ghostTask?.notes}
        />
        <FocusCard
          label="Zoro — current focus"
          accent="#67FFB5"
          task={zoroTask?.title ?? "No open task."}
          note={zoroTask?.notes}
        />
      </section>

      {/* The wall-mounted spend monitor — Ghost + Zoro watch this live */}
      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-acid">
              wall_monitor_03 // credit ops
            </div>
            <h2 className="mt-1 text-2xl tracking-wide">Live credit tracker</h2>
          </div>
          <a
            href="/office/spend"
            className="text-[10px] uppercase tracking-[0.25em] text-cyan"
          >
            open full dashboard →
          </a>
        </div>
        <SpendPanel />
      </section>

      {/* The floor — workstations */}
      <section className="office-floor rounded-sm border border-cyan/10 p-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan">
              floor_01 // office map
            </div>
            <h2 className="mt-1 text-2xl tracking-wide">Workstations</h2>
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
            {STATUS.phaseId.toUpperCase()} · {STATUS.updated}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <Workstation
            href="/office/roadmap"
            title="Calendar"
            subtitle="roadmap · phases"
            icon="◷"
            tone="cyan"
            occupants={["Compass"]}
            preview="Six phases pinned to the wall. Current: Phase 0. Next milestone on the top-right sticky note."
          />
          <Workstation
            href="/office/tasks"
            title="Whiteboard"
            subtitle="task board"
            icon="▦"
            tone="acid"
            occupants={["Zoro", "Compass"]}
            preview="Who owns what, right now. Drag me into the next stand-up."
          />
          <Workstation
            href="/office/team"
            title="Team Wall"
            subtitle="14 operators"
            icon="◉"
            tone="cyan"
            occupants={["all"]}
            preview="Ghost + Zoro + 12 AI agents. Each profile card, each persona, each spec file."
          />
          <Workstation
            href="/office/bible"
            title="Library"
            subtitle="lore bible"
            icon="⌘"
            tone="violet"
            occupants={["Nyx", "Cipher"]}
            preview="The Pantheon, the factions, the commodities, the voice. Non-negotiable canon."
          />
          <Workstation
            href="/office/brand"
            title="Asset Vault"
            subtitle="palette · logos · icons"
            icon="◇"
            tone="heat"
            occupants={["Palette"]}
            preview="Palette locked. Commodity PNG filename spec. Fonts. Motion rules."
          />
          <Workstation
            href="/office/wireframes"
            title="Monitor Wall"
            subtitle="prototypes v1-v5"
            icon="▭"
            tone="cyan"
            occupants={["Rune", "Vex"]}
            preview="Every prior prototype indexed. Import branches to compare. Active build flagged."
          />
          <Workstation
            href="/office/status"
            title="Status Terminal"
            subtitle="live signals"
            icon="◈"
            tone="acid"
            occupants={["Axiom"]}
            preview="Six signals green/amber/red. Blockers. Recent wins. Updated each session."
          />
          <Workstation
            href="/office/notes"
            title="Zoro's Desk"
            subtitle="notes · explainer videos"
            icon="❋"
            tone="acid"
            occupants={["Zoro"]}
            preview="Tray of notes from Reel. Explainer videos land here in Phase B."
          />
          <Workstation
            href="/office/council"
            title="Council Table"
            subtitle="rotating 4-seat round"
            icon="⎔"
            tone="violet"
            occupants={["Compass", "+3"]}
            preview="Convene now, or wait for the 09:00 UTC standup. Decision log auto-appends."
          />
          <Workstation
            href="/office/automations"
            title="Cron Rack"
            subtitle="6 scheduled jobs"
            icon="⟳"
            tone="cyan"
            occupants={["Talon"]}
            preview="Every automation armed. Phase A heartbeats + Phase B Council hooks live."
          />
          <Workstation
            href="/office/spend"
            title="Credit Ops"
            subtitle="live spend · 17 providers"
            icon="◐"
            tone="heat"
            occupants={["Kite"]}
            preview="Live USD / credit balances across every AI + infra provider. Watch the burn."
          />
          <Workstation
            href="/office/avatars"
            title="Avatar Lab"
            subtitle="SpriteCook + RPM rigs"
            icon="☊"
            tone="violet"
            occupants={["Palette", "Reel"]}
            preview="14 character rigs. Generate via SpriteCook MCP — Phase B binds them to an R3F scene."
          />
          <Workstation
            href="/office/floor-3d"
            title="Floor 3D"
            subtitle="immersive R3F office"
            icon="◬"
            tone="acid"
            occupants={["all"]}
            preview="Walkable 3D scene with 14 operators. Click any character, hear their voice in real time."
          />
          <Workstation
            href="/office/reel"
            title="Reel Booth"
            subtitle="Remotion explainer videos"
            icon="▶"
            tone="violet"
            occupants={["Reel"]}
            preview="MP4s cut with Remotion, voiced with ElevenLabs. Zoro's welcome reel, AI Council, First Day."
          />
          <Workstation
            href="/office/broadcast"
            title="Broadcast"
            subtitle="HeyGen Hyperframes"
            icon="☍"
            tone="heat"
            occupants={["Reel"]}
            preview="Hyperrealistic talking avatars with lip sync. Any agent, any script, rendered on demand."
          />
        </div>
      </section>

      {/* Studio toolkit — media + AI the agents reach for first */}
      <section className="flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-violet">
              shelf_02 // studio toolkit
            </div>
            <h2 className="mt-1 text-2xl tracking-wide">What the studio runs on</h2>
          </div>
          <a
            href="https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-/blob/main/docs/Studio-Toolkit.md"
            target="_blank"
            rel="noreferrer"
            className="text-[10px] uppercase tracking-[0.25em] text-cyan"
          >
            open toolkit doc →
          </a>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Keys + licenses the team has and defaults to. Voice → ElevenLabs. Talking avatars →
          HeyGen + Hyperframes. 2D portraits → SpriteCook. 3D rigs → Ready Player Me. Video →
          Remotion. Design → Canva + Claude Design. Every tool here is wired; reach for these
          before suggesting third-party alternatives.
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(toolkitByCat) as ToolkitCategory[]).map((cat) => {
            const tools = toolkitByCat[cat];
            if (!tools || tools.length === 0) return null;
            return (
              <div
                key={cat}
                className="panel rounded-sm p-4"
                style={{ borderColor: `${tools[0]?.accent ?? "#00F5FF"}33` }}
              >
                <div
                  className="text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: tools[0]?.accent ?? "#00F5FF" }}
                >
                  {CATEGORY_LABELS[cat]}
                </div>
                <ul className="mt-2 space-y-1.5 text-[12px] text-chrome/90">
                  {tools.map((t) => (
                    <li key={t.slug} className="flex items-start gap-2">
                      <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-acid" />
                      <span>
                        <span className="text-chrome">{t.name}</span>
                        {t.envKey && (
                          <span className="ml-1 text-[10px] text-dust">· {t.envKey}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel rounded-sm p-6">
        <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/80">
          phase notes
        </div>
        <h3 className="mt-1 text-lg tracking-wide">What this office is — and is not</h3>
        <p className="mt-2 text-sm leading-relaxed text-dust">
          This is the <span className="text-chrome">Dev Lab</span>, our internal studio — not the
          game itself. The game is the Expo + React Native build that lives in{" "}
          <code className="text-cyan">/src</code> of the parent repo and will ship to iOS, Android,
          and web. The Dev Lab exists so Ghost, Zoro, and the 12-agent AI team can see the whole
          project at a glance and make progress every session.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-dust">
          Current session output (Phase A): this site exists, gates behind a password, renders all
          project canon, and hosts the hourly cron stub for autonomous AI team ticks. Phase B
          upgrades to a real 3D R3F office with SpriteCook-rendered characters and Remotion
          explainer videos. See{" "}
          <a className="text-cyan" href="https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-/blob/main/PHASE_B.md">
            PHASE_B.md
          </a>{" "}
          for the roadmap.
        </p>
      </section>
    </div>
  );
}

function FocusCard({
  label,
  accent,
  task,
  note,
}: {
  label: string;
  accent: string;
  task: string;
  note?: string;
}) {
  return (
    <div
      className="panel rounded-sm p-5"
      style={{ borderColor: `${accent}55`, boxShadow: `0 0 0 1px ${accent}15 inset` }}
    >
      <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: accent }}>
        {label}
      </div>
      <div className="mt-2 text-base leading-snug text-chrome">{task}</div>
      {note && <div className="mt-2 text-[12px] leading-relaxed text-dust">{note}</div>}
    </div>
  );
}
