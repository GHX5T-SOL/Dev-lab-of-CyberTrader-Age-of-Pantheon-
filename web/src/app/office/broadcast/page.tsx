import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";
import { PERFORMERS } from "@/data/performers";
import { TEAM } from "@/data/team";

export const metadata = {
  title: "Broadcast — HeyGen Hyperframes",
  description:
    "Hyperrealistic talking avatars. Any operator, any script, rendered on demand with HeyGen + Hyperframes.",
};

type BroadcastSlot = {
  slug: string;
  role: string;
  sampleLine: string;
  targetLength: string;
  accent: string;
};

// Curated first-wave broadcasts — every one of these has a pre-rendered voice
// sample already, so Hyperframe binding can start on day one.
const BROADCASTS: BroadcastSlot[] = [
  {
    slug: "ghost",
    role: "Lead Developer",
    sampleLine:
      "This is the Dev Lab. Twelve AI operators, two humans, one mission — ship the cyberpunk trading sim you've been waiting for.",
    targetLength: "0:12",
    accent: "#00F5FF",
  },
  {
    slug: "zoro",
    role: "Creative Lead / Co-founder",
    sampleLine:
      "Walk the floor with me. Every desk is wired. Click an operator, hear them speak — then check the repo, they probably just pushed.",
    targetLength: "0:10",
    accent: "#67FFB5",
  },
  {
    slug: "compass",
    role: "AI Council Chair",
    sampleLine:
      "The Council meets on the violet table, Monday nine hundred UTC. Twelve seats. Every decision logs to the vault. Quorum is twelve of twelve.",
    targetLength: "0:14",
    accent: "#7A5BFF",
  },
  {
    slug: "reel",
    role: "Cinematic Director",
    sampleLine:
      "Every cut on this tray is a React component. Thirty frames a second, straight to MP4. Narration is rendered, never recorded live.",
    targetLength: "0:11",
    accent: "#FF2A4D",
  },
];

export default function BroadcastPage() {
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-heat">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-heat" />
          <span>broadcast booth · hyperframes pending bind</span>
          <span className="text-dust">·</span>
          <span className="text-dust">16 operators queued</span>
        </div>
        <CyberText as="h1" className="text-4xl md:text-5xl" glitch>
          BROADCAST
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Hyperrealistic talking avatars powered by HeyGen + Hyperframes. Any operator, any script,
          rendered on demand with full lip-sync and dynamic movement. This page holds the scripts
          and bindings; the moment HEYGEN_API_KEY + a Hyperframe avatar-id land in env, every card
          below wakes up and starts streaming video.
        </p>
      </header>

      {/* Pipeline */}
      <Panel tone="heat">
        <PanelHeader eyebrow="the broadcast pipeline" title="Script → voice → hyperframe → stream" />
        <div className="grid gap-6 md:grid-cols-4">
          <Step
            n="01"
            title="Write the script"
            body="Short, punchy, in-voice lines. Each operator has a signature cadence documented in /data/performers.ts."
            accent="#FF2A4D"
          />
          <Step
            n="02"
            title="Render voice"
            body="ElevenLabs multilingual v2 via /api/voice/speak. Same key, same proxy, same per-agent settings as the Reel Booth."
            accent="#FFB341"
          />
          <Step
            n="03"
            title="Bind Hyperframe"
            body="POST the voice + avatar-id to HeyGen Hyperframes API. Returns a stream URL with dynamic lip-sync + idle motion."
            accent="#00F5FF"
          />
          <Step
            n="04"
            title="Embed on the floor"
            body="Stream URL drops into the 3D office + this page. When the key isn't set, the card shows a voiceable still."
            accent="#67FFB5"
          />
        </div>
      </Panel>

      {/* Integration status */}
      <Panel>
        <PanelHeader
          eyebrow="integration status"
          title="What's wired, what's gated"
          right={
            <span className="rounded-sm border border-amber/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-amber">
              beta · hold-out
            </span>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Row
            label="ElevenLabs"
            value="ready"
            tone="acid"
            note="Proxy live at /api/voice/speak. 4 pre-rendered samples on the tray."
          />
          <Row
            label="HeyGen API key"
            value="pending"
            tone="amber"
            note={"Set HEYGEN_API_KEY in Vercel env. Free tier gives 10 minutes of video/mo."}
          />
          <Row
            label="Hyperframe avatar ids"
            value="pending"
            tone="amber"
            note="One id per operator, created in the HeyGen Studio. Store in PERFORMER.heygenAvatarId (schema ready)."
          />
          <Row
            label="Local GLB rigs"
            value="tracked"
            tone="violet"
            note="16 rigs tracked in /data/performers.ts and /public/GLB_Assets. Hyperframes stay a video layer; R3F owns the local office rigs."
          />
        </div>
      </Panel>

      {/* Broadcast slots */}
      <section className="flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-heat">
          four slots · first wave · hyperframe binding pending
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {BROADCASTS.map((b) => {
            const performer = PERFORMERS.find((p) => p.slug === b.slug);
            const member = TEAM.find((m) => m.slug === b.slug);
            return (
              <article
                key={b.slug}
                className="panel flex flex-col gap-3 rounded-sm p-5"
                style={{ borderColor: `${b.accent}55` }}
              >
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
                      {b.slug}
                    </div>
                    <h3
                      className="mt-1 text-xl tracking-wide"
                      style={{ color: b.accent }}
                    >
                      {member?.name ?? b.slug.toUpperCase()}
                    </h3>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-dust">
                      {b.role} · target {b.targetLength}
                    </div>
                  </div>
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.25em]"
                    style={{
                      borderColor: `${b.accent}66`,
                      color: b.accent,
                    }}
                  >
                    slot live
                  </span>
                </header>

                {/* Hyperframe placeholder — reserves the 16:9 frame shape */}
                <div
                  className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-sm border"
                  style={{
                    borderColor: `${b.accent}44`,
                    background:
                      "linear-gradient(160deg, rgba(10,13,18,0.8) 0%, rgba(5,6,8,1) 100%)",
                  }}
                >
                  {/* Soft animated rings */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background: `radial-gradient(500px 240px at 50% 60%, ${b.accent}33 0%, transparent 70%)`,
                    }}
                  />
                  <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <div
                      className="text-3xl"
                      style={{ color: b.accent, textShadow: `0 0 24px ${b.accent}99` }}
                    >
                      ◉
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-dust">
                      hyperframe standby
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.3em] text-chrome/80">
                      awaiting HEYGEN_API_KEY
                    </div>
                  </div>
                </div>

                {/* Script */}
                <blockquote
                  className="border-l-2 pl-3 text-[13px] leading-relaxed italic text-chrome/90"
                  style={{ borderColor: b.accent }}
                >
                  “{b.sampleLine}”
                </blockquote>

                {/* Voice preview link — if there's a pre-rendered sample */}
                {performer?.voiceSampleUrl && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-acid">
                      voice preview ready
                    </span>
                    <audio
                      controls
                      preload="metadata"
                      className="h-8 flex-1 max-w-full"
                      src={performer.voiceSampleUrl}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Full roster */}
      <Panel tone="violet">
        <PanelHeader
          eyebrow="the full roster"
          title="16 Hyperframe slots — scripts in waiting"
        />
        <p className="mb-4 text-[13px] leading-relaxed text-chrome/90">
          Every operator gets a broadcast slot. The four above are first-wave (scripts locked,
          voices rendered). The rest cascade in as HeyGen avatar-ids come back from the Studio. The
          canonical cadence lives in <code className="text-cyan">/data/performers.ts</code> — one
          signatureLine per operator.
        </p>
        <div className="grid gap-2 text-[12px] md:grid-cols-2">
          {PERFORMERS.map((p) => {
            const member = TEAM.find((m) => m.slug === p.slug);
            return (
              <div
                key={p.slug}
                className="flex items-center justify-between gap-3 rounded-sm border border-cyan/15 px-3 py-2"
              >
                <div>
                  <span className="text-chrome">{member?.name ?? p.slug}</span>
                  <span className="ml-2 text-dust">· {member?.role ?? "—"}</span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
                  {p.voiceSampleUrl ? "voice · ready" : "voice · queued"}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Safety + cost notes */}
      <Panel>
        <PanelHeader eyebrow="guardrails" title="Safety, cost, and legal notes" />
        <ul className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-cyan">·</span> Every voice belongs to an <em>original</em>{" "}
            character. No cloning of real-world people without explicit written consent — see{" "}
            <code className="text-cyan">brand/brand-guidelines.md</code>.
          </li>
          <li>
            <span className="text-cyan">·</span> Hyperframe renders bill per second; every render
            tracked in <a className="text-cyan" href="/office/spend">/office/spend</a> before it
            ships.
          </li>
          <li>
            <span className="text-cyan">·</span> No loot-box or paid-randomised rewards anywhere
            near broadcast material. Scripts are reviewed by Compass before binding.
          </li>
          <li>
            <span className="text-cyan">·</span> Avatars never make financial or medical claims.
            Every broadcast lands on a Council decision log entry.
          </li>
        </ul>
      </Panel>
    </div>
  );
}

function Step({
  n,
  title,
  body,
  accent,
}: {
  n: string;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-3xl font-bold" style={{ color: accent }}>
        {n}
      </div>
      <h3 className="text-base tracking-wide text-chrome">{title}</h3>
      <p className="text-[12px] leading-relaxed text-dust">{body}</p>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value: string;
  tone: "acid" | "amber" | "violet" | "heat" | "cyan";
  note: string;
}) {
  const color =
    tone === "acid"
      ? "#67FFB5"
      : tone === "amber"
        ? "#FFB341"
        : tone === "violet"
          ? "#7A5BFF"
          : tone === "heat"
            ? "#FF2A4D"
            : "#00F5FF";
  return (
    <div
      className="flex flex-col gap-1 rounded-sm border p-3"
      style={{ borderColor: `${color}44` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[0.25em] text-dust">{label}</span>
        <span
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color }}
        >
          {value}
        </span>
      </div>
      <p className="text-[12px] leading-relaxed text-chrome/80">{note}</p>
    </div>
  );
}
