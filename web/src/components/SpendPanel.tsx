"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/**
 * Full provider grid. Polled from the /office/spend page.
 *
 * Each provider card shows:
 *   - label + live dot
 *   - USD remaining (if the provider exposes it)
 *   - USD spent (24h) (if exposed)
 *   - a human-readable note (e.g. "key valid · balance not exposed via API")
 *   - deep link to that provider's billing dashboard
 */

export type ProviderSnapshot = {
  slug: string;
  label: string;
  accent: string;
  category: "llm" | "media" | "infra" | "data" | "on-chain";
  configured: boolean;
  ok: boolean;
  usdRemaining?: number;
  usdSpent24h?: number;
  note?: string;
  dashboardUrl?: string;
};

type SpendReport = {
  at: string;
  totals: {
    usdRemaining: number;
    usdSpent24h: number;
    providersConfigured: number;
    providersLive: number;
  };
  providers: ProviderSnapshot[];
};

const POLL_MS = 60_000;

const CATEGORY_LABEL: Record<ProviderSnapshot["category"], string> = {
  llm: "Reasoning models",
  media: "Media generation",
  infra: "Infrastructure",
  data: "Data feeds",
  "on-chain": "On-chain wallets",
};

export function SpendPanel() {
  const [data, setData] = useState<SpendReport | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ at: string; usd: number }>>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const r = await fetch("/api/spend", { cache: "no-store" });
        if (!r.ok) throw new Error(`http ${r.status}`);
        const j = (await r.json()) as SpendReport;
        if (cancelled) return;
        setData(j);
        setErr(null);
        setHistory((h) => {
          const next = [...h, { at: j.at, usd: j.totals.usdRemaining }];
          return next.slice(-60); // keep last ~1h
        });
      } catch (e) {
        if (cancelled) return;
        setErr(e instanceof Error ? e.message : "feed down");
      }
    };
    run();
    const t = setInterval(run, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  if (err && !data) {
    return (
      <div className="rounded-sm border border-heat/40 bg-ink p-5 text-[13px] text-heat">
        Spend feed is down: {err}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="rounded-sm border border-cyan/10 bg-ink p-5 text-[13px] text-dust">
        Polling providers…
      </div>
    );
  }

  // Group by category preserving order
  const grouped: Record<string, ProviderSnapshot[]> = {};
  for (const p of data.providers) {
    (grouped[p.category] ??= []).push(p);
  }

  const categories: ProviderSnapshot["category"][] = [
    "llm",
    "media",
    "infra",
    "data",
    "on-chain",
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="credits remaining" value={`$${data.totals.usdRemaining.toFixed(2)}`} accent="#67FFB5" />
        <Stat label="spent · 24h" value={`$${data.totals.usdSpent24h.toFixed(2)}`} accent="#FFB341" />
        <Stat
          label="providers live"
          value={`${data.totals.providersLive}/${data.totals.providersConfigured}`}
          accent="#00F5FF"
        />
        <Stat
          label="refreshed"
          value={new Date(data.at).toLocaleTimeString()}
          accent="#8A94A7"
        />
      </div>

      {/* Sparkline from in-memory history */}
      <Sparkline history={history} />

      {/* Per-category grids */}
      {categories.map((cat) => {
        const list = grouped[cat];
        if (!list || list.length === 0) return null;
        return (
          <section key={cat} className="flex flex-col gap-3">
            <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">
              {CATEGORY_LABEL[cat]}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <ProviderCard key={p.slug} p={p} />
              ))}
            </div>
          </section>
        );
      })}
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
      <div className="mt-1 text-2xl tracking-tight text-chrome" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function ProviderCard({ p }: { p: ProviderSnapshot }) {
  const dot = p.configured ? (p.ok ? "bg-acid" : "bg-heat") : "bg-dust/50";
  return (
    <div
      className="panel rounded-sm p-4"
      style={{ borderColor: `${p.accent}44` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={clsx("inline-block h-1.5 w-1.5 rounded-full", dot)} />
            <div className="text-[11px] uppercase tracking-[0.25em]" style={{ color: p.accent }}>
              {p.label}
            </div>
          </div>
          <div className="mt-2 text-xl tracking-tight text-chrome">
            {typeof p.usdRemaining === "number"
              ? `$${p.usdRemaining.toFixed(2)}`
              : p.configured
                ? "—"
                : "not configured"}
          </div>
        </div>
      </div>
      {typeof p.usdSpent24h === "number" && (
        <div className="mt-1 text-[11px] text-dust">
          24h spend: <span className="text-chrome">${p.usdSpent24h.toFixed(2)}</span>
        </div>
      )}
      {p.note && <div className="mt-2 text-[11px] leading-relaxed text-dust">{p.note}</div>}
      {p.dashboardUrl && (
        <a
          href={p.dashboardUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-[10px] uppercase tracking-[0.25em] text-cyan"
        >
          open dashboard →
        </a>
      )}
    </div>
  );
}

function Sparkline({ history }: { history: Array<{ at: string; usd: number }> }) {
  if (history.length < 2) {
    return (
      <div className="rounded-sm border border-cyan/10 bg-ink p-4 text-[11px] text-dust">
        collecting data points for spark line… ({history.length}/2 min)
      </div>
    );
  }
  const vals = history.map((h) => h.usd);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = Math.max(max - min, 0.01);
  const w = 800;
  const h = 80;
  const step = w / Math.max(history.length - 1, 1);
  const points = history
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p.usd - min) / range) * (h - 10) - 5;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const first = vals[0] ?? 0;
  const last = vals[vals.length - 1] ?? 0;
  const trending = last - first;
  const trendColor = trending < 0 ? "#FF2A4D" : trending > 0 ? "#67FFB5" : "#8A94A7";

  return (
    <div className="rounded-sm border border-cyan/10 bg-ink p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">
          live burn · session window
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: trendColor }}>
          Δ ${trending.toFixed(3)} since start
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={trendColor}
          strokeWidth={1.5}
          points={points}
          opacity={0.9}
        />
      </svg>
    </div>
  );
}
