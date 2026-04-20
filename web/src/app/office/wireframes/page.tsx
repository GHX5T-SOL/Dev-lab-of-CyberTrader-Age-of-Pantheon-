import { PROTOTYPES, type Prototype } from "@/data/wireframes";
import { Panel, PanelHeader } from "@/components/Panel";
import { CyberText } from "@/components/CyberText";

export const metadata = { title: "Monitor Wall — Wireframes" };

const STATUS_TONE: Record<Prototype["status"], "cyan" | "violet" | "acid"> = {
  archived: "cyan",
  reference: "violet",
  active: "acid",
};

const STATUS_DOT: Record<Prototype["status"], string> = {
  archived: "#8A94A7",
  reference: "#7A5BFF",
  active: "#67FFB5",
};

export default function WireframesPage() {
  const withDemo = PROTOTYPES.filter((p) => p.demo);
  const noDemo = PROTOTYPES.filter((p) => !p.demo);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">monitor_wall_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">
          WIREFRAMES
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Every prior prototype, live on the wall. Each phone-bezel below is an actual iframe of
          that version&apos;s Vercel deployment — scroll and click inside any frame to interact with
          the real build. Compare versions side-by-side to trace how the design evolved.
        </p>
        <p className="max-w-3xl text-[12px] leading-relaxed text-dust/70">
          Frames load lazily. If one appears blank, the target site blocks iframe embedding — use
          the <span className="text-cyan">open ↗</span> link on that card to view it directly.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-acid">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-acid" />
          live demos · {withDemo.length} deployments framed
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {withDemo.map((p) => (
            <PrototypeCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {noDemo.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-dust">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-dust/60" />
            repo-only · no live deployment
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {noDemo.map((p) => (
              <PrototypeCard key={p.slug} p={p} />
            ))}
          </div>
        </section>
      )}

      <Panel>
        <PanelHeader eyebrow="how-to" title="Import a prior prototype as a branch" />
        <pre className="overflow-x-auto rounded-sm border border-cyan/10 bg-ink p-3 text-[12px] leading-relaxed text-chrome/90">{`# inside Dev Lab repo root
git remote add v5 https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v5.git
git fetch v5
git checkout -b reference/v5 v5/main
git push -u origin reference/v5

# now you can:
#   - diff against main:     git diff main..reference/v5
#   - cherry-pick a commit:  git cherry-pick <sha>
#   - open a PR from ref →   https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-/compare/main...reference/v5`}</pre>
      </Panel>

      <Panel tone="violet">
        <PanelHeader eyebrow="phase B upgrade" title="Where the monitor wall goes next" />
        <ul className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            Hover-state: pause the iframe and render a higher-res screenshot so the wall scrolls
            smoothly even with 7 phones live.
          </li>
          <li>
            Click-state: zoom a single phone to full-size, other phones dim and halve-opacity
            (diegetic &quot;focused monitor&quot; effect).
          </li>
          <li>
            Branch-diff overlay: when in comparison mode, show which files changed between the
            focused phone&apos;s <code className="text-cyan">importBranch</code> and main.
          </li>
          <li>
            Snack fallback: for repos without a Vercel deployment, embed an Expo Snack that spins
            up the prototype on-demand.
          </li>
        </ul>
      </Panel>
    </div>
  );
}

function PrototypeCard({ p }: { p: Prototype }) {
  const tone = STATUS_TONE[p.status];
  const toneHex = p.status === "active" ? "#67FFB5" : p.status === "reference" ? "#7A5BFF" : "#00F5FF";

  return (
    <article
      className="panel rounded-sm p-5 flex flex-col gap-4"
      style={{ borderColor: `${toneHex}44` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ color: toneHex }}
          >
            {p.version}
          </div>
          <h3 className="mt-1 text-base leading-snug tracking-wide text-chrome">{p.title}</h3>
        </div>
        <span className="flex items-center gap-1.5 rounded-sm border border-cyan/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.25em] text-dust">
          <span
            className="inline-block h-1 w-1 rounded-full"
            style={{ background: STATUS_DOT[p.status] }}
          />
          {p.status}
        </span>
      </div>

      {/* Phone bezel with live iframe */}
      <PhoneFrame demo={p.demo} label={p.version} toneHex={toneHex} />

      {/* Summary */}
      <p className="text-[12px] leading-relaxed text-chrome/85">{p.summary}</p>

      {/* Learnings */}
      <div>
        <div className="text-[9px] uppercase tracking-[0.3em] text-cyan/70">learnings</div>
        <ul className="mt-1.5 space-y-1 text-[11.5px] text-dust">
          {p.learnings.map((l) => (
            <li key={l} className="flex gap-1.5">
              <span className="text-cyan">»</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer links */}
      <div className="mt-auto flex flex-col gap-1 border-t border-cyan/10 pt-3 text-[11px]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-dust/70">repo</span>
          <a
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            className="truncate text-cyan hover:text-acid"
          >
            {p.repo.replace("https://github.com/", "")}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-dust/70">branch</span>
          <code className="text-acid">{p.importBranch}</code>
        </div>
        {p.demo && (
          <div className="flex items-center gap-2">
            <span className="text-dust/70">demo</span>
            <a
              href={p.demo}
              target="_blank"
              rel="noreferrer"
              className="truncate text-cyan hover:text-acid"
            >
              {p.demo.replace("https://", "")} ↗
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Diegetic phone bezel. Renders an iframe in portrait aspect (9:19) with a
 * thick dark bezel, notch strip, and a subtle glow in the card's accent color.
 * Lazy-loads so a wall of phones doesn't hammer the page on first paint.
 */
function PhoneFrame({
  demo,
  label,
  toneHex,
}: {
  demo?: string;
  label: string;
  toneHex: string;
}) {
  return (
    <div
      className="relative mx-auto w-full max-w-[260px] rounded-[2rem] border-[6px] border-black bg-black p-[2px]"
      style={{
        boxShadow: `0 0 0 1px ${toneHex}55, 0 10px 40px -12px ${toneHex}33`,
      }}
    >
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-[14px] w-[72px] -translate-x-1/2 translate-y-[1px] rounded-b-xl bg-black" />

      {/* Power button accent (decorative) */}
      <div
        className="absolute -right-[8px] top-[40px] h-[40px] w-[3px] rounded-sm"
        style={{ background: toneHex, opacity: 0.4 }}
      />

      {/* Screen */}
      <div
        className="relative aspect-[9/19] overflow-hidden rounded-[1.5rem] bg-void"
        style={{ borderColor: `${toneHex}22` }}
      >
        {demo ? (
          <iframe
            src={demo}
            title={`${label} live demo`}
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 bg-ink"
          />
        ) : (
          <NoDemoPlaceholder label={label} toneHex={toneHex} />
        )}
      </div>
    </div>
  );
}

function NoDemoPlaceholder({ label, toneHex }: { label: string; toneHex: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink p-4 text-center">
      <div
        className="text-[10px] uppercase tracking-[0.3em]"
        style={{ color: toneHex }}
      >
        {label}
      </div>
      <div className="text-[11px] text-dust">no live deployment</div>
      <div className="mt-1 text-[10px] text-dust/60">
        repo available · no Vercel URL
      </div>
    </div>
  );
}
