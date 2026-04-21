import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";
import { CouncilHall } from "@/components/CouncilHall";
import { OPENCLAW_NODE } from "@/data/openclaw";

export const metadata = { title: "Council Hall" };

export default function CouncilPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">council_hall_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">
          COUNCIL HALL
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Round table on floor_02. Compass chairs every session. Three agents rotate in based on
          the topic. Each run writes a structured decision to{" "}
          <code className="text-cyan">memory/council-log.jsonl</code>. Crons fire the standup,
          nightly audit, and weekly digest on schedule. Zara and Zyra can be invited from{" "}
          <code className="text-cyan">{OPENCLAW_NODE.id}</code> when a decision needs physical-node
          evidence.
        </p>
      </header>

      <Panel tone="acid">
        <PanelHeader eyebrow="charter" title="How consultation works" />
        <ul className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-cyan">Call → Pick → Stance → Decision.</span> Every complex
            response in this studio gets a Council line. See{" "}
            <code className="text-cyan">AI_Council_Charter.md</code> in the repo root.
          </li>
          <li>
            <span className="text-cyan">Picks</span> are the agents invited. Each has a stance
            (supports / neutral / pushes_back) and a one-line position.
          </li>
          <li>
            <span className="text-cyan">Actions</span> are the outcome — 1-5 concrete next steps,
            owner implied by whichever agent took the strongest stance.
          </li>
          <li>
            The backing model is Claude (Anthropic). If the key isn&apos;t set, the Council
            gracefully falls back to a stub run so the UI never dead-ends.
          </li>
          <li>
            <span className="text-violet">OpenClaw evidence</span> comes from Zara or Zyra on{" "}
            <code className="text-cyan">{OPENCLAW_NODE.ssh}</code>. They do not count toward quorum
            unless Ghost explicitly changes that governance rule.
          </li>
        </ul>
      </Panel>

      <CouncilHall />
    </div>
  );
}
