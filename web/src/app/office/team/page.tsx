import { AGENTS, FOUNDERS } from "@/data/team";
import { CharacterCard } from "@/components/CharacterCard";
import { CyberText } from "@/components/CyberText";

export const metadata = { title: "Team Wall" };

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">team_wall_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">TEAM</CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          16 operators. Two founders. Twelve council subagents. Two named OpenClaw workers. Each
          agent has a name, a persona, and a spec file under{" "}
          <code className="text-cyan">agents/</code>. Portraits land in Phase B via SpriteCook.
          Until then — initials block + accent.
        </p>
      </header>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <CyberText as="h2" className="text-xl">FOUNDERS</CyberText>
          <span className="text-[10px] uppercase tracking-[0.25em] text-dust">the builders</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {FOUNDERS.map((m) => (
            <CharacterCard key={m.slug} member={m} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <CyberText as="h2" className="text-xl">AI TEAM</CyberText>
          <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
            14 AI workers · 12 council subagents · 2 OpenClaw agents
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {AGENTS.map((m) => (
            <CharacterCard key={m.slug} member={m} />
          ))}
        </div>
      </section>

      <section className="panel rounded-sm p-5">
        <div className="text-[10px] uppercase tracking-[0.25em] text-cyan">org chart</div>
        <h2 className="mt-1 text-lg">How they relate</h2>
        <pre className="mt-3 overflow-x-auto text-[12px] leading-relaxed text-chrome/90">{`
  Ghost (founder, lead developer)
    ├── Compass (PM) — runs the board
    │    ├── Nyx         (game design)
    │    ├── Vex         (UI/UX)
    │    ├── Rune        (frontend mobile)
    │    ├── Kite        (backend/web3)
    │    ├── Oracle      (economy/sim)
    │    ├── Reel        (cinematic)
    │    ├── Palette     (brand/asset)
    │    ├── Cipher      (research)
    │    ├── Axiom       (QA)
    │    ├── Talon       (OpenClaw — long-running tasks)
    │    ├── Zyra        (OpenClaw — PM / QA autonomy)
    │    ├── Zara        (OpenClaw — implementation loops)
    │    └── Hydra       (ElizaOS — market swarm)
    └── Zoro (co-founder, creative lead)

  Council = any 5-7 agents convened by Compass per AI_Council_Charter.md.
  Zyra joins PM / QA / cron calls. Zara joins build / branch / PR calls.
  Council never locks out founders — Ghost + Zoro can overrule.
`}</pre>
      </section>
    </div>
  );
}
