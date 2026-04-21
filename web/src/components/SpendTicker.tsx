"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

/**
 * Compact header-mounted credit ticker. Always visible at the top of every
 * office page so Ghost + Zoro can see live burn without navigating.
 *
 * Polls /api/spend every 60s. The detailed breakdown lives at /office/spend.
 */

type Snapshot = {
  at: string;
  totals: {
    usdRemaining: number;
    usdSpent24h: number;
    providersConfigured: number;
    providersLive: number;
  };
  providers: Array<{
    slug: string;
    label: string;
    accent: string;
    configured: boolean;
    ok: boolean;
    usdRemaining?: number;
    usdSpent24h?: number;
    note?: string;
  }>;
};

const POLL_MS = 60_000;

export function SpendTicker() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [prevRemaining, setPrevRemaining] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const r = await fetch("/api/spend", { cache: "no-store" });
        if (!r.ok) throw new Error(`http ${r.status}`);
        const j = (await r.json()) as Snapshot;
        if (cancelled) return;
        setPrevRemaining((p) => (data ? data.totals.usdRemaining : p));
        setData(j);
        setErr(null);
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
    // we only want one interval — deps intentionally empty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loading = !data && !err;
  const totalUsd = data?.totals.usdRemaining ?? 0;
  const deltaUsd =
    prevRemaining !== null && data ? data.totals.usdRemaining - prevRemaining : 0;
  const configured = data?.totals.providersConfigured ?? 0;
  const live = data?.totals.providersLive ?? 0;

  return (
    <Link
      href="/office/spend"
      aria-label="Open spend dashboard"
      className={clsx(
        "group flex shrink-0 items-center gap-2 rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.2em] no-underline transition-colors",
        err
          ? "border-heat/40 text-heat hover:bg-heat/10"
          : "border-acid/30 text-acid hover:bg-acid/10",
      )}
    >
      <span
        className={clsx(
          "inline-block h-1.5 w-1.5 rounded-full",
          err ? "bg-heat" : "animate-pulse bg-acid",
        )}
      />
      <span className="hidden text-dust md:inline">credits meter</span>
      <span className="font-semibold tracking-[0.15em] text-chrome">
        {loading
          ? "----"
          : err
            ? "feed down"
            : `$${totalUsd.toFixed(2)}`}
      </span>
      {!loading && !err && deltaUsd !== 0 && (
        <span
          className={clsx(
            "hidden md:inline",
            deltaUsd < 0 ? "text-heat" : "text-acid",
          )}
        >
          {deltaUsd < 0 ? "▼" : "▲"} ${Math.abs(deltaUsd).toFixed(2)}
        </span>
      )}
      <span className="hidden text-dust lg:inline">
        · {live}/{configured} live
      </span>
    </Link>
  );
}
