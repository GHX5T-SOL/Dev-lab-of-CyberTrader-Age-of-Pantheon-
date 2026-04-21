import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";

export const metadata = {
  title: "Reel Booth — Dev Lab Explainers",
  description:
    "Programmatic explainer videos rendered with Remotion + ElevenLabs narration. Welcome, AI Council, First Day.",
};

type Reel = {
  id: string;
  slug: "welcome" | "ai-council" | "first-day";
  title: string;
  eyebrow: string;
  duration: string;
  narrator: string;
  accent: string;
  blurb: string;
  beats: string[];
};

const REELS: Reel[] = [
  {
    id: "welcome",
    slug: "welcome",
    title: "Welcome to the Lab",
    eyebrow: "reel 01 · orientation",
    duration: "0:40",
    narrator: "Ghost",
    accent: "#00F5FF",
    blurb:
      "A 40-second cold-open. Glitch title, a pan across Neon Void City, the roster of 16 operators, and the five stations on the floor.",
    beats: [
      "00:00 — glitch title card (DEV LAB)",
      "00:09 — skyline pan, Neon Void City 2077 tagline",
      "00:18 — the roster: 16 operators staggered on a grid",
      "00:28 — the five workstations: Council, Floor 3D, Reel, Broadcast, Studio",
      "00:36 — outro slate, URL drop",
    ],
  },
  {
    id: "ai-council",
    slug: "ai-council",
    title: "The AI Council",
    eyebrow: "reel 02 · governance",
    duration: "0:26",
    narrator: "Compass",
    accent: "#7A5BFF",
    blurb:
      "How twelve council subagents plus Zyra and Zara run alongside Ghost + Zoro. Quorum ring, the work-flow diagram, and the three non-negotiables that keep the pace honest.",
    beats: [
      "00:00 — chapter 01 title reveal",
      "00:03 — rotating circle of twelve with central quorum emblem",
      "00:13 — flow diagram: founders → council → Zyra/Zara → shipped commits + live ops",
      "00:21 — three non-negotiables cascade in",
      "00:24 — outro URL",
    ],
  },
  {
    id: "first-day",
    slug: "first-day",
    title: "Your First Day",
    eyebrow: "reel 03 · onboarding",
    duration: "0:25",
    narrator: "Zoro",
    accent: "#67FFB5",
    blurb:
      "Three concrete moves a new collaborator makes in their first hour. Whiteboard tickets, the run-book, and the ping that gets Compass in-room.",
    beats: [
      "00:00 — chapter 02 title reveal",
      "00:03 — whiteboard with sprint-01 tickets",
      "00:10 — three-step run-book (floor, brief, council)",
      "00:18 — CTA: cybertrader.app / office / floor-3d",
      "00:23 — signoff: built by Ghost + Zoro + 14 AI workers",
    ],
  },
];

export default function ReelPage() {
  // REELS has three compile-time literals; the non-null assertion tells TS
  // what it can see but can't prove with noUncheckedIndexedAccess.
  const featured = REELS[0]!;
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-violet">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-violet" />
          <span>reel booth · 3 cuts on the tray</span>
          <span className="text-dust">·</span>
          <span className="text-dust">rendered with remotion · voiced by elevenlabs</span>
        </div>
        <CyberText as="h1" className="text-4xl md:text-5xl" glitch>
          THE REEL BOOTH
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Three programmatic explainer cuts. Every pixel is code — React components rendered into
          MP4 by Remotion. Narration is rendered server-side through the ElevenLabs proxy at{" "}
          <code className="text-cyan">/api/voice/speak</code> and dropped into{" "}
          <code className="text-cyan">/public/voices</code>. When you press play, you&apos;re
          hearing the same voices that talk in the 3D floor.
        </p>
      </header>

      {/* Featured reel */}
      <section className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: featured.accent }}
            >
              {featured.eyebrow}
            </div>
            <h2 className="mt-1 text-2xl tracking-wide text-chrome">{featured.title}</h2>
            <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-dust">
              {featured.duration} · narrated by {featured.narrator}
            </div>
          </div>
          <a
            href={`/videos/${featured.slug}.mp4`}
            download
            className="text-[10px] uppercase tracking-[0.25em] text-cyan"
          >
            download mp4 →
          </a>
        </div>

        <div
          className="relative overflow-hidden rounded-sm border"
          style={{
            borderColor: `${featured.accent}55`,
            boxShadow: `0 0 0 1px ${featured.accent}22 inset, 0 0 60px ${featured.accent}22`,
          }}
        >
          <video
            controls
            playsInline
            preload="metadata"
            poster="/brand/reel-poster-welcome.png"
            className="h-auto w-full bg-void"
          >
            <source src={`/videos/${featured.slug}.mp4`} type="video/mp4" />
            Your browser does not support the HTML5 video element.
          </video>
        </div>

        <p className="max-w-3xl text-[13px] leading-relaxed text-chrome/90">{featured.blurb}</p>
        <ul className="grid gap-1.5 text-[12px] leading-relaxed text-dust md:grid-cols-2">
          {featured.beats.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-[7px] inline-block h-1 w-1 rounded-full bg-cyan" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Reel tray — all three */}
      <section className="flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">
          the tray · all three cuts
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {REELS.map((r) => (
            <article
              key={r.id}
              className="panel flex flex-col rounded-sm p-4"
              style={{ borderColor: `${r.accent}44` }}
            >
              <div
                className="relative overflow-hidden rounded-sm border"
                style={{ borderColor: `${r.accent}33` }}
              >
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="h-auto w-full bg-void"
                >
                  <source src={`/videos/${r.slug}.mp4`} type="video/mp4" />
                </video>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.25em]">
                <span style={{ color: r.accent }}>{r.eyebrow}</span>
                <span className="text-dust">{r.duration}</span>
              </div>
              <h3 className="mt-1 text-lg tracking-wide text-chrome">{r.title}</h3>
              <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-dust">
                narrated by {r.narrator}
              </div>
              <p className="mt-2 text-[12px] leading-relaxed text-dust">{r.blurb}</p>
              <div className="mt-auto flex items-center justify-between pt-4 text-[10px] uppercase tracking-[0.25em]">
                <a href={`/videos/${r.slug}.mp4`} download className="text-cyan">
                  download →
                </a>
                <span className="rounded-sm border border-violet/30 px-2 py-0.5 text-violet">
                  1920 × 1080 · 30 fps
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Pipeline explainer */}
      <Panel tone="violet">
        <PanelHeader eyebrow="how a reel is made" title="Code → voice → MP4" />
        <div className="grid gap-6 md:grid-cols-3">
          <Step
            n="01"
            title="Compose in React"
            body="Every cut is a Remotion composition under /web/remotion/compositions. Title reveals, grids, carousels — all plain React with interpolate() and spring() for motion."
          />
          <Step
            n="02"
            title="Narrate with ElevenLabs"
            body="Scripts are rendered server-side via /api/voice/speak. The resulting MP3 is saved to /public/voices/<slug>.mp3 and mounted with Remotion's <Audio> primitive."
          />
          <Step
            n="03"
            title="Render to MP4"
            body="npx remotion render remotion/index.ts <id> public/videos/<id>.mp4 writes 1080p30 H.264 + AAC. Vercel serves the MP4 statically from /videos."
          />
        </div>
      </Panel>

      {/* Technical details */}
      <Panel>
        <PanelHeader eyebrow="under the hood" title="The stack that ships the reel" />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan">video engine</div>
            <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-chrome/90">
              <li>
                <span className="text-chrome">Remotion 4.x</span> —{" "}
                <code className="text-cyan">@remotion/cli</code> +{" "}
                <code className="text-cyan">@remotion/media-utils</code>
              </li>
              <li>
                <span className="text-chrome">Shared Backdrop</span> — scanlines + grid floor + neon
                glow under every composition
              </li>
              <li>
                <span className="text-chrome">Brand tokens</span> — import{" "}
                <code className="text-cyan">BRAND</code> from{" "}
                <code className="text-cyan">remotion/shared/brand</code>
              </li>
              <li>
                <span className="text-chrome">Public dir</span> — shared with Next.js via{" "}
                <code className="text-cyan">Config.setPublicDir(&quot;./public&quot;)</code>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-acid">voice engine</div>
            <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-chrome/90">
              <li>
                <span className="text-chrome">Model</span> —{" "}
                <code className="text-cyan">eleven_multilingual_v2</code>
              </li>
              <li>
                <span className="text-chrome">Per-agent settings</span> — stability, similarity
                boost, style; see <code className="text-cyan">/data/performers.ts</code>
              </li>
              <li>
                <span className="text-chrome">Key safety</span> — key never leaves the server; proxy
                streams mp3 back via <code className="text-cyan">Response(upstream.body)</code>
              </li>
              <li>
                <span className="text-chrome">Cost control</span> — narrations pre-rendered once,
                static-served forever
              </li>
            </ul>
          </div>
        </div>
      </Panel>

      {/* Next phase */}
      <Panel tone="acid">
        <PanelHeader eyebrow="phase b roadmap" title="What lands next on the tray" />
        <ol className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-acid">·</span> <span className="text-chrome">Sprint recaps</span>{" "}
            — auto-generated every Friday from the task board via a Vercel cron.
          </li>
          <li>
            <span className="text-acid">·</span>{" "}
            <span className="text-chrome">Cutscene reels</span> — game moments cut from the live R3F
            office camera feed.
          </li>
          <li>
            <span className="text-acid">·</span>{" "}
            <span className="text-chrome">HeyGen Hyperframe crossovers</span> — talking-head inserts
            from the Broadcast booth, stitched into Remotion timelines.
          </li>
          <li>
            <span className="text-acid">·</span>{" "}
            <span className="text-chrome">Scored soundtrack</span> — ElevenLabs Music API for
            under-score beds; SFX generated on demand via Player API.
          </li>
        </ol>
      </Panel>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-3xl font-bold text-violet">{n}</div>
      <h3 className="text-base tracking-wide text-chrome">{title}</h3>
      <p className="text-[12px] leading-relaxed text-dust">{body}</p>
    </div>
  );
}
