import { BIBLE, BIBLE_INTRO, NPCS } from "@/data/bible";
import { COMMODITIES } from "@/data/commodities";
import { FACTIONS } from "@/data/factions";
import { Panel, PanelHeader } from "@/components/Panel";
import { CyberText } from "@/components/CyberText";

export const metadata = { title: "Library — Game Bible" };

export default function BiblePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-violet">library_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">GAME BIBLE</CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          The canonical world, voice, and rules for CyberTrader: Age of Pantheon. Full text in{" "}
          <code className="text-cyan">docs/Lore-Bible.md</code>. No external IP — every name here is
          original.
        </p>
      </header>

      <Panel tone="violet">
        <PanelHeader eyebrow="world" title="The setting" />
        <p className="text-sm leading-relaxed text-chrome/90">{BIBLE_INTRO}</p>
      </Panel>

      <div className="grid gap-5 md:grid-cols-2">
        {BIBLE.map((s) => (
          <Panel key={s.id}>
            <PanelHeader eyebrow={s.id.replace(/-/g, " ")} title={s.title} />
            <div className="flex flex-col gap-3 text-sm leading-relaxed text-chrome/90">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <CyberText as="h2" className="text-xl">FACTIONS</CyberText>
          <span className="text-[10px] uppercase tracking-[0.25em] text-dust">4 playable</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FACTIONS.map((f) => (
            <div
              key={f.slug}
              className="panel rounded-sm p-4"
              style={{ borderColor: `${f.color}55` }}
            >
              <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: f.color }}>
                faction
              </div>
              <h3 className="mt-1 text-base uppercase tracking-[0.2em] text-chrome">{f.name}</h3>
              <p className="mt-2 text-[12px] italic text-dust/80">&ldquo;{f.tagline}&rdquo;</p>
              <p className="mt-3 text-[13px] leading-relaxed text-chrome/90">{f.description}</p>
              <p className="mt-3 text-[11px] text-dust">sigil: {f.sigilNote}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <CyberText as="h2" className="text-xl">COMMODITIES</CyberText>
          <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
            10 tradable · s1lkroad 4.0
          </span>
        </div>
        <div className="overflow-hidden rounded-sm border border-cyan/15">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-cyan/15 bg-ink/60 text-left text-[10px] uppercase tracking-[0.25em] text-cyan/80">
                <th className="px-3 py-2">ticker</th>
                <th className="px-3 py-2">name</th>
                <th className="px-3 py-2">tagline</th>
                <th className="px-3 py-2">vol.</th>
                <th className="px-3 py-2">heat</th>
              </tr>
            </thead>
            <tbody>
              {COMMODITIES.map((c) => (
                <tr key={c.ticker} className="border-b border-cyan/5 text-chrome/90">
                  <td className="px-3 py-2 text-cyan">{c.ticker}</td>
                  <td className="px-3 py-2">{c.name}</td>
                  <td className="px-3 py-2 text-dust">{c.tagline}</td>
                  <td className="px-3 py-2 text-[11px] uppercase text-dust">{c.volatility}</td>
                  <td className="px-3 py-2">
                    <span
                      className="rounded-sm border px-1.5 py-0.5 text-[10px] uppercase tracking-[0.2em]"
                      style={{
                        borderColor:
                          c.heatBand === "red"
                            ? "#FF2A4D55"
                            : c.heatBand === "amber"
                              ? "#FFB34155"
                              : "#67FFB555",
                        color:
                          c.heatBand === "red"
                            ? "#FF2A4D"
                            : c.heatBand === "amber"
                              ? "#FFB341"
                              : "#67FFB5",
                      }}
                    >
                      {c.heatBand}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <CyberText as="h2" className="text-xl">KEY NPCs</CyberText>
          <span className="text-[10px] uppercase tracking-[0.25em] text-dust">Phase 2+</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {NPCS.map((n) => (
            <div key={n.name} className="panel rounded-sm p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-base uppercase tracking-[0.2em] text-chrome">{n.name}</h3>
                <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
                  {n.faction}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-chrome/90">{n.role}</p>
              <p className="mt-2 text-[12px] text-dust">{n.notes}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
