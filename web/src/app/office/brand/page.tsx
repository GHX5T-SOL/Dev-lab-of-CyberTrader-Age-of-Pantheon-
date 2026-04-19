import { ASSET_SPEC, FONTS, MOTION_RULES, PALETTE_TOKENS } from "@/data/brand";
import { COMMODITIES } from "@/data/commodities";
import { Panel, PanelHeader } from "@/components/Panel";
import { CyberText } from "@/components/CyberText";

export const metadata = { title: "Asset Vault — Brand" };

export default function BrandPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-heat">asset_vault_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">BRAND</CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Palette, typography, motion, asset filename spec. Canon at{" "}
          <code className="text-cyan">brand/brand-guidelines.md</code>. Anything that touches the
          product must respect this page.
        </p>
      </header>

      <section>
        <Panel>
          <PanelHeader eyebrow="palette" title="Color tokens" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PALETTE_TOKENS.map((t) => (
              <div key={t.name} className="flex items-start gap-3 rounded-sm border border-cyan/10 bg-ink/60 p-3">
                <div
                  className="h-12 w-12 shrink-0 rounded-sm border border-white/10"
                  style={{ background: t.hex }}
                />
                <div className="min-w-0">
                  <div className="font-mono text-[11px] text-cyan">{t.name}</div>
                  <div className="font-mono text-[13px] text-chrome">{t.hex}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-dust">{t.role}</div>
                  {t.restraint && (
                    <div className="mt-1 text-[11px] leading-relaxed text-heat">
                      ⚠ {t.restraint}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <Panel>
          <PanelHeader eyebrow="typography" title="Font stacks" />
          <div className="flex flex-col gap-4">
            {FONTS.map((f) => (
              <div key={f.name}>
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/80">{f.name}</div>
                <div
                  className="mt-1 text-lg text-chrome"
                  style={{ fontFamily: f.stack }}
                >
                  Neon Void City · 2077 · S1LKROAD 4.0
                </div>
                <div className="mt-1 font-mono text-[11px] text-dust">{f.stack}</div>
                <div className="mt-1 text-[11px] text-dust">{f.role}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader eyebrow="motion" title="Motion rules" />
          <ul className="space-y-2 text-[13px] text-chrome/90">
            {MOTION_RULES.map((r) => (
              <li key={r}>
                <span className="text-cyan">»</span> {r}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <section>
        <Panel tone="heat">
          <PanelHeader
            eyebrow="asset spec"
            title="Commodity PNG filenames (transparent bg, 512px min)"
            right={
              <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
                Zoro: generate via SpriteCook
              </span>
            }
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ASSET_SPEC.filter((a) => a.slug !== "logo_primary" && a.slug !== "logo_mark").map(
              (a) => {
                const ticker = COMMODITIES.find((c) => c.slug === a.slug)?.ticker;
                return (
                  <div
                    key={a.slug}
                    className="rounded-sm border border-cyan/10 bg-ink/60 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.25em] text-cyan">
                        {ticker ?? a.slug}
                      </span>
                      <span
                        className="rounded-sm border px-1.5 py-0.5 text-[9px] uppercase tracking-[0.2em]"
                        style={{
                          borderColor:
                            a.status === "finalized"
                              ? "#67FFB555"
                              : a.status === "generated"
                                ? "#FFB34155"
                                : "#8A94A755",
                          color:
                            a.status === "finalized"
                              ? "#67FFB5"
                              : a.status === "generated"
                                ? "#FFB341"
                                : "#8A94A7",
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                    <div className="mt-1 text-[13px] text-chrome">{a.displayName}</div>
                    <code className="mt-1 block text-[11px] text-dust">{a.pathInWeb}</code>
                    {a.note && <div className="mt-1 text-[11px] text-dust">{a.note}</div>}
                  </div>
                );
              }
            )}
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-dust">
            Reference: Ghost shared the v0.1.3 S1LKROAD commodity artboard. Match that aesthetic —
            dark background, holographic-material look, faint internal glow. Ticker ordering must
            match <code className="text-cyan">web/src/data/commodities.ts</code>.
          </p>
        </Panel>
      </section>
    </div>
  );
}
