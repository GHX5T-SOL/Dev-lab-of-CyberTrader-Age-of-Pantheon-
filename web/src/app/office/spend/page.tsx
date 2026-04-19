import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";
import { SpendPanel } from "@/components/SpendPanel";
import { PROVIDERS } from "@/data/providers";

export const metadata = { title: "Spend · Credit Ops" };

export default function SpendPage() {
  const byStyle = {
    prepaid: PROVIDERS.filter((p) => p.billingStyle === "prepaid_credits").length,
    metered: PROVIDERS.filter((p) => p.billingStyle === "metered_usage").length,
    flat: PROVIDERS.filter((p) => p.billingStyle === "flat").length,
    wallet: PROVIDERS.filter((p) => p.billingStyle === "self_hosted").length,
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">spend_terminal_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">
          CREDIT OPS
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Live panel. Tracks balance + 24h burn across every provider the Dev Lab uses. Poll is
          every 60s — watch numbers tick down as crons fire and as Ghost + Zoro run prompts.
        </p>
      </header>

      <Panel tone="acid">
        <PanelHeader eyebrow="the model" title="How this ticker works" />
        <div className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <p>
            The provider registry lives at{" "}
            <code className="text-cyan">web/src/data/providers.ts</code>. For each provider we
            declare a billing style (prepaid credits, metered usage, flat subscription, self-hosted
            wallet) and whether we have a live probe.
          </p>
          <p>
            <span className="text-chrome">Live probes</span> run server-side in{" "}
            <code className="text-cyan">web/src/lib/spend.ts</code>. Each has a 5s timeout so one
            slow provider can&apos;t stall the panel. The aggregator totals remaining USD across
            every probe that returns a real number.
          </p>
          <p>
            <span className="text-chrome">Providers without a live probe</span> still appear in the
            grid with a direct link to their billing dashboard — click through to read the real
            balance. We&apos;re adding probes as providers expose them.
          </p>
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="prepaid credit pools" value={String(byStyle.prepaid)} accent="#67FFB5" />
        <Stat label="metered (pay-as-you-go)" value={String(byStyle.metered)} accent="#FFB341" />
        <Stat label="flat subscriptions" value={String(byStyle.flat)} accent="#00F5FF" />
        <Stat label="self-hosted wallets" value={String(byStyle.wallet)} accent="#7A5BFF" />
      </div>

      <SpendPanel />

      <Panel>
        <PanelHeader eyebrow="next" title="Upgrade path" />
        <ul className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-cyan">Phase B.1</span> — append every real `Δ spend` point to a
            Supabase `spend_history` table so the spark line survives a refresh.
          </li>
          <li>
            <span className="text-cyan">Phase B.2</span> — add <code>/api/spend/alerts</code> that
            fires a Slack / email ping when `usdRemaining` drops below a per-provider threshold
            (e.g. $5 on Anthropic).
          </li>
          <li>
            <span className="text-cyan">Phase B.3</span> — per-agent cost attribution: each council
            run writes `{`{ agent, provider, tokens, usd }`}` so we can see which agent burns what.
          </li>
        </ul>
      </Panel>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div
      className="panel rounded-sm p-4"
      style={{ borderColor: `${accent}55`, boxShadow: `0 0 0 1px ${accent}15 inset` }}
    >
      <div className="text-[10px] uppercase tracking-[0.25em] text-dust">{label}</div>
      <div className="mt-1 text-2xl tracking-tight" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}
