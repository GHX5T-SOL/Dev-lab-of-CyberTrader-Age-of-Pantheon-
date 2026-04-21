import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";
import Floor3DMount from "./Floor3DMount";
import { PERFORMERS } from "@/data/performers";
import { TEAM } from "@/data/team";

export const metadata = { title: "Floor 3D — The Immersive Office" };

export default function Floor3DPage() {
  const total = PERFORMERS.length;
  const withSample = PERFORMERS.filter((p) => p.voiceSampleUrl).length;
  const withRpm = PERFORMERS.filter((p) => p.rpmAvatarUrl).length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">
          floor_3d_01 // spatial_compositor
        </div>
        <CyberText as="h1" className="text-3xl md:text-4xl" glitch>
          THE IMMERSIVE OFFICE
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          The Dev Lab as a walkable 3D scene. Every operator anchored to their station — drag to
          orbit, scroll to zoom, click any character to focus the camera and hear their signature
          line in their own voice. Pre-rendered ElevenLabs samples for the founders and key
          orchestrators; live TTS for everyone else on demand.
        </p>
      </header>

      <Floor3DMount />

      <div className="grid gap-4 md:grid-cols-3">
        <Stat
          label="operators on floor"
          value={total.toString()}
          sublabel="16 residents · 3D stand-ins"
          accent="#00F5FF"
        />
        <Stat
          label="pre-rendered voices"
          value={`${withSample} / ${total}`}
          sublabel="ElevenLabs mp3 · /public/voices/"
          accent="#67FFB5"
        />
        <Stat
          label="RPM rigs bound"
          value={`${withRpm} / ${total}`}
          sublabel="Ready Player Me · .glb"
          accent="#7A5BFF"
        />
      </div>

      <Panel>
        <PanelHeader eyebrow="how to drive" title="Orbit · zoom · focus" />
        <ul className="grid gap-2 text-[13px] leading-relaxed text-chrome/90 md:grid-cols-2">
          <li>
            <span className="text-cyan">Drag</span> — orbit the camera around whatever the
            controls are currently focused on.
          </li>
          <li>
            <span className="text-cyan">Scroll / pinch</span> — dolly in and out (clamped so you
            can&apos;t zoom through a character).
          </li>
          <li>
            <span className="text-cyan">Right-drag</span> — pan laterally across the floor.
          </li>
          <li>
            <span className="text-cyan">Click a character</span> — camera pulls focus to them, an
            overlay card appears, press <code className="text-acid">▶ speak</code> to hear them.
          </li>
          <li>
            <span className="text-cyan">ESC</span> — release focus, overlay dismisses.
          </li>
          <li>
            <span className="text-cyan">Click empty space</span> — same as ESC.
          </li>
        </ul>
      </Panel>

      <Panel tone="acid">
        <PanelHeader eyebrow="what you're hearing" title="Voice pipeline" />
        <p className="text-[13px] leading-relaxed text-chrome/90">
          The <span className="text-acid">▶ speak</span> button first tries a pre-rendered
          sample at <code className="text-cyan">/voices/&lt;slug&gt;.mp3</code>. If the
          character doesn&apos;t have one, it POSTs to{" "}
          <code className="text-cyan">/api/voice/speak</code> which proxies ElevenLabs
          text-to-speech with that performer&apos;s voice_id and settings — the audio streams
          back in real time. Your API key never leaves the server.
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-dust">
          Swap any voice_id in{" "}
          <code className="text-cyan">web/src/data/performers.ts</code> for a cloned voice
          asset from your ElevenLabs account. The stand-in meshes get replaced with Ready
          Player Me .glb rigs by setting <code className="text-cyan">rpmAvatarUrl</code> on
          the same record.
        </p>
      </Panel>

      <Panel tone="violet">
        <PanelHeader eyebrow="phase B roadmap" title="What lands on this stage next" />
        <ul className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-cyan">Ready Player Me rigs</span> — swap stand-in capsules
            for 16 hand-tuned .glb avatars with idle animation library.
          </li>
          <li>
            <span className="text-cyan">Lip-sync with viseme data</span> — HeyGen Hyperframes
            emits phoneme tracks; morph targets on the RPM heads drive them in real time as
            the voice plays.
          </li>
          <li>
            <span className="text-cyan">Interactive workstations</span> — the whiteboard
            shows live task counts from <code className="text-cyan">/office/tasks</code>,
            the monitor wall iframes the wireframes page into six screens.
          </li>
          <li>
            <span className="text-cyan">Ghost walk-through</span> — a guided camera path that
            moves desk-to-desk, each operator delivers their signature line. &ldquo;Press
            play on the tour&rdquo; mode.
          </li>
        </ul>
      </Panel>

      <Panel>
        <PanelHeader eyebrow="cast list" title="Who's on the floor" />
        <div className="grid gap-2 text-[12px] leading-relaxed md:grid-cols-2">
          {PERFORMERS.map((p) => {
            const m = TEAM.find((t) => t.slug === p.slug);
            return (
              <div key={p.slug} className="flex items-center gap-3">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: m?.accent ?? "#00F5FF" }}
                />
                <span className="w-16 text-chrome">{m?.name ?? p.slug}</span>
                <span className="w-40 truncate text-dust">{m?.role ?? ""}</span>
                <span className="ml-auto text-[10px] uppercase tracking-[0.25em] text-dust">
                  {p.voiceSampleUrl ? "mp3" : "live"}
                </span>
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

function Stat({
  label,
  value,
  sublabel,
  accent,
}: {
  label: string;
  value: string;
  sublabel: string;
  accent: string;
}) {
  return (
    <div
      className="panel rounded-sm p-4"
      style={{ borderColor: `${accent}44` }}
    >
      <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
        {label}
      </div>
      <div className="mt-1 font-display text-2xl text-chrome">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-dust">
        {sublabel}
      </div>
    </div>
  );
}
