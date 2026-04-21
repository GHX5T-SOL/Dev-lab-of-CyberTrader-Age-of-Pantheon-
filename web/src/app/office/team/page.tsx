import { AGENTS, FOUNDERS, OPENCLAW_AGENTS } from "@/data/team";
import { CharacterCard } from "@/components/CharacterCard";
import { CyberText } from "@/components/CyberText";
import { OPENCLAW_AGENT_STATUS, OPENCLAW_NODE } from "@/data/openclaw";

export const metadata = { title: "Team Wall" };

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">team_wall_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl" glitch>
          TEAM
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          16 operators. Ghost is the human Lead Developer. Zoro is the human Creative Lead and
          co-founder. The 12 AI agents form the Council roster, while Zara and Zyra are OpenClaw
          Living Agents on the secure Mac mini node.
        </p>
      </header>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <CyberText as="h2" className="text-xl">
            FOUNDERS
          </CyberText>
          <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
            Ghost technical sign-off · Zoro creative sign-off
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {FOUNDERS.map((m) => (
            <CharacterCard key={m.slug} member={m} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <CyberText as="h2" className="text-xl">
            OPENCLAW LIVING AGENTS
          </CyberText>
          <span className="text-[10px] uppercase tracking-[0.25em] text-violet">
            {OPENCLAW_NODE.ssh}
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {OPENCLAW_AGENTS.map((m) => (
            <CharacterCard key={m.slug} member={m} />
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {OPENCLAW_AGENT_STATUS.map((agent) => (
            <div key={agent.slug} className="panel rounded-sm p-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-violet">
                {agent.name} · {agent.node}
              </div>
              <h3 className="mt-1 text-base tracking-wide text-chrome">{agent.role}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-dust">{agent.heartbeat}</p>
              <ul className="mt-3 space-y-1 text-[11px] leading-relaxed text-chrome/90">
                {agent.responsibilities.map((item) => (
                  <li key={item}>
                    <span className="text-violet">»</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <CyberText as="h2" className="text-xl">
            AI TEAM
          </CyberText>
          <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
            12 agents · council members
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
  Ghost (human Lead Developer, elite coder)
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
    │    ├── Talon       (OpenClaw governance / long-running task owner)
    │    └── Hydra       (ElizaOS market swarm)
    ├── Zara (OpenClaw asset ops on zyra-mini)
    └── Zyra (OpenClaw node watch on zyra-mini)

  Zoro (human Creative Lead, co-founder)
    └── owns mood, lore feel, visual canon, avatar placement, and final art review

  Council = any 5-7 agents convened by Compass per AI_Council_Charter.md.
  Ghost and Zoro have final say on scope, brand, and ship decisions.
`}</pre>
      </section>
    </div>
  );
}
