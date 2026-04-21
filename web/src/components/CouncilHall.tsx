"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { TEAM } from "@/data/team";

type Pick = {
  slug: string;
  stance: "supports" | "neutral" | "pushes_back";
  oneLine: string;
};

type Run = {
  at: string;
  trigger: "standup" | "manual" | "nightly-audit" | "weekly-digest";
  topic: string;
  participants: string[];
  picks: Pick[];
  summary: string;
  actions: string[];
  provider: "anthropic" | "stub";
  tokensIn?: number;
  tokensOut?: number;
};

/**
 * Client-side Council hall. Lets Ghost + Zoro kick off a round manually,
 * and shows the recent log that Zyra/Zara can also consult before work loops.
 */
export function CouncilHall() {
  const [log, setLog] = useState<Run[]>([]);
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function loadLog() {
    try {
      const r = await fetch("/api/council/log?limit=20", { cache: "no-store" });
      if (!r.ok) throw new Error(`http ${r.status}`);
      const j = (await r.json()) as { runs: Run[] };
      setLog(j.runs.reverse()); // newest first
    } catch (e) {
      setErr(e instanceof Error ? e.message : "log read failed");
    }
  }

  useEffect(() => {
    loadLog();
  }, []);

  async function runNow() {
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/council/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() || undefined }),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { detail?: string };
        throw new Error(j.detail ?? `http ${r.status}`);
      }
      setTopic("");
      await loadLog();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "council run failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="panel rounded-sm p-5">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">convene</div>
        <div className="mt-1 text-lg tracking-wide text-chrome">Call the Council</div>
        <p className="mt-2 text-[13px] leading-relaxed text-dust">
          Compass always sits. Topic keywords pull in the right specialists; Zyra joins automation
          and QA calls, Zara joins build and PR calls. Output is structured JSON — picks + summary
          + actions — persisted to{" "}
          <code className="text-cyan">memory/council-log.jsonl</code>.
        </p>

        <div className="mt-4 flex flex-col gap-2 md:flex-row">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="optional topic — e.g. 'which wireframe version is closest to GDD?'"
            className="flex-1 rounded-sm border border-cyan/20 bg-ink px-3 py-2 text-[13px] text-chrome outline-none focus:border-cyan/60"
          />
          <button
            disabled={busy}
            onClick={runNow}
            className={clsx(
              "rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.25em] transition-colors",
              busy
                ? "border-dust/30 text-dust"
                : "border-acid/40 text-acid hover:bg-acid/10",
            )}
          >
            {busy ? "convening…" : "convene"}
          </button>
        </div>
        {err && <div className="mt-2 text-[11px] text-heat">error: {err}</div>}
      </div>

      <section className="flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">council log</div>
        {log.length === 0 ? (
          <div className="rounded-sm border border-cyan/10 bg-ink p-5 text-[13px] text-dust">
            No runs yet. Kick one off above, or wait for the 09:00 UTC cron.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {log.map((r, i) => (
              <RunCard key={`${r.at}_${i}`} run={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RunCard({ run }: { run: Run }) {
  return (
    <article
      className={clsx(
        "panel rounded-sm p-4",
        run.trigger === "manual" && "panel-acid",
        run.trigger === "weekly-digest" && "panel-violet",
        run.trigger === "nightly-audit" && "panel-heat",
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-[10px] uppercase tracking-[0.25em] text-cyan">
          {run.trigger} · {new Date(run.at).toLocaleString()}
        </div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
          provider: <span style={{ color: run.provider === "anthropic" ? "#D97757" : "#8A94A7" }}>{run.provider}</span>
          {run.tokensIn && run.tokensOut ? (
            <span className="ml-2">
              tokens: {run.tokensIn} → {run.tokensOut}
            </span>
          ) : null}
        </div>
      </header>
      <h4 className="mt-2 text-base tracking-wide text-chrome">{run.topic}</h4>
      <p className="mt-2 text-[13px] leading-relaxed text-dust">{run.summary}</p>

      {run.picks.length > 0 && (
        <div className="mt-3 flex flex-col gap-1">
          {run.picks.map((p, i) => {
            const member = TEAM.find((m) => m.slug === p.slug);
            const stanceColor =
              p.stance === "supports"
                ? "#67FFB5"
                : p.stance === "pushes_back"
                  ? "#FF2A4D"
                  : "#8A94A7";
            return (
              <div key={i} className="flex items-start gap-2 text-[12px]">
                <span
                  className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: stanceColor }}
                />
                <span className="shrink-0 text-chrome" style={{ color: member?.accent }}>
                  {member?.name ?? p.slug}
                </span>
                <span className="text-dust">{p.oneLine}</span>
              </div>
            );
          })}
        </div>
      )}

      {run.actions.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1">
          {run.actions.map((a, i) => (
            <li key={i} className="text-[12px] text-chrome/90">
              <span className="text-acid">→</span> {a}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
