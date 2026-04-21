import Image from "next/image";
import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";
import { AVATAR_SPECS } from "@/data/avatars";
import { PERFORMERS } from "@/data/performers";
import { TEAM } from "@/data/team";

export const metadata = { title: "Avatar Lab — Character Rigs" };

export default function AvatarsPage() {
  const avatarCount = AVATAR_SPECS.length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">avatar_lab_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">
          AVATAR LAB
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Character rigs for the {avatarCount} residents of the Dev Lab. Two pipelines run side by side: a
          fast 2D portrait path via SpriteCook, and a true-3D animated path via Ready Player Me +
          React Three Fiber for the Phase B immersive office.
        </p>
      </header>

      <Panel tone="acid">
        <PanelHeader eyebrow="the two pipelines" title="SpriteCook ↔ Ready Player Me" />
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">phase a · now</div>
            <h3 className="mt-1 text-base tracking-wide text-chrome">SpriteCook 2D portraits</h3>
            <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-dust">
              <li>• one transparent PNG per character at <code className="text-cyan">/public/brand/avatars/&lt;slug&gt;.png</code></li>
              <li>• hyperrealistic anime / neo-Tokyo style, on-brand palette</li>
              <li>• generated via <code className="text-cyan">spritecook.generate_game_art</code> MCP tool using the spec prompts below</li>
              <li>• 1024×1536, half-body, subject centered, head-room for overlays</li>
              <li>• Palette QAs each render against <code className="text-cyan">brand/brand-guidelines.md</code></li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-acid">phase b · next</div>
            <h3 className="mt-1 text-base tracking-wide text-chrome">RPM 3D + R3F immersive scene</h3>
            <ul className="mt-2 space-y-1 text-[13px] leading-relaxed text-dust">
              <li>• Ready Player Me avatar ids (one per character) — hand-tuned in the RPM creator</li>
              <li>• glTF loaded via <code className="text-cyan">@react-three/fiber</code> + <code className="text-cyan">drei</code></li>
              <li>• idle loops + ambient gestures from the RPM animation library</li>
              <li>• each character anchored to an office station (whiteboard, terminal, couch, etc.)</li>
              <li>• orbit controls + click-to-zoom on each workstation</li>
            </ul>
          </div>
        </div>
      </Panel>

      {/* RPM creator embed — Phase B hook, live now for hand-tuning rigs */}
      <Panel tone="violet">
        <PanelHeader
          eyebrow="phase b · live now"
          title="Ready Player Me creator — tune a rig in-frame"
          right={
            <a
              href="https://readyplayer.me/avatar"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] uppercase tracking-[0.25em] text-cyan"
            >
              open in new tab →
            </a>
          }
        />
        <p className="mb-3 text-[13px] leading-relaxed text-chrome/90">
          Shape a rig, snap a portrait, grab the glTF URL — all inside the Lab. When you&apos;re
          done, copy the model URL and paste it into{" "}
          <code className="text-cyan">PERFORMERS[slug].rpmAvatarUrl</code>. The Floor 3D scene
          picks it up on the next load; the stand-in disappears and the real rig takes the desk.
        </p>
        <div
          className="relative overflow-hidden rounded-sm border border-violet/40"
          style={{ boxShadow: "0 0 30px rgba(122,91,255,0.25) inset" }}
        >
          <iframe
            src="https://demo.readyplayer.me/avatar?frameApi"
            title="Ready Player Me avatar creator"
            allow="camera *; microphone *; clipboard-write"
            loading="lazy"
            className="block h-[640px] w-full bg-void"
          />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-dust">
          Output URL looks like{" "}
          <code className="text-cyan">https://models.readyplayer.me/&lt;id&gt;.glb</code>. The Floor
          3D loader handles both plain glTF and gzip variants. Avatar mesh is served from RPM CDN,
          so no storage cost on our side.
        </p>
      </Panel>

      {/* Portrait gallery — live preview of whichever /brand/avatars/<slug>.png exists */}
      <Panel tone="acid">
        <PanelHeader
          eyebrow="spritecook gallery"
          title="2D portraits — live preview"
          right={
            <span className="rounded-sm border border-cyan/40 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-cyan">
              drop .png · page renders it
            </span>
          }
        />
        <p className="mb-4 text-[13px] leading-relaxed text-chrome/90">
          Every card below points at <code className="text-cyan">/brand/avatars/&lt;slug&gt;.png</code>.
          Drop a SpriteCook render in that folder with the correct slug and the card wakes up. No
          code change, no deploy — just a static asset at the known URL.
        </p>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {AVATAR_SPECS.map((a) => {
            const member = TEAM.find((m) => m.slug === a.slug);
            const accent = member?.accent ?? "#00F5FF";
            return (
              <div
                key={`gallery-${a.slug}`}
                className="flex flex-col items-center gap-2 rounded-sm border p-2"
                style={{ borderColor: `${accent}55` }}
              >
                <div
                  className="relative aspect-[2/3] w-full overflow-hidden rounded-sm"
                  style={{
                    background: `linear-gradient(160deg, ${accent}22 0%, #0a0d12 100%)`,
                    boxShadow: `inset 0 0 30px ${accent}22`,
                  }}
                >
                  {/* Next/Image handles the 404 → placeholder path gracefully via fallback styling */}
                  <Image
                    src={`/brand/avatars/${a.slug}.png`}
                    alt={`${a.displayName} portrait`}
                    fill
                    sizes="(max-width: 768px) 40vw, 180px"
                    className="object-cover object-top"
                    style={{ mixBlendMode: "screen" }}
                    unoptimized
                  />
                  {/* Diegetic corner tag */}
                  <div
                    className="absolute top-1 left-1 rounded-sm px-1.5 py-0.5 text-[8px] uppercase tracking-[0.2em]"
                    style={{ background: `${accent}55`, color: "#050608" }}
                  >
                    {a.slug}
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-[11px] tracking-wide"
                    style={{ color: accent }}
                  >
                    {a.displayName}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.2em] text-dust">
                    {a.animPose.replace(/_/g, " ")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Voice + rig pairing — cross-reference from performers.ts */}
      <Panel>
        <PanelHeader
          eyebrow="voice ↔ rig binding"
          title="Which rigs also have a voice"
        />
        <p className="mb-3 text-[13px] leading-relaxed text-chrome/90">
          The 3D floor reads from <code className="text-cyan">/data/performers.ts</code>. When a
          rig has both a <code className="text-cyan">rpmAvatarUrl</code> <em>and</em> a{" "}
          <code className="text-cyan">voiceSampleUrl</code>, the character walks, stands at a desk,
          and speaks on click. Everything else falls back to a stand-in.
        </p>
        <div className="grid gap-2 text-[12px] md:grid-cols-2">
          {PERFORMERS.map((p) => {
            const member = TEAM.find((m) => m.slug === p.slug);
            const rig = Boolean(p.rpmAvatarUrl);
            const voice = Boolean(p.voiceSampleUrl);
            return (
              <div
                key={`bind-${p.slug}`}
                className="flex items-center justify-between gap-3 rounded-sm border border-cyan/15 px-3 py-2"
              >
                <div>
                  <span className="text-chrome">{member?.name ?? p.slug}</span>
                  <span className="ml-2 text-[11px] text-dust">· {member?.role ?? "—"}</span>
                </div>
                <div className="flex gap-2 text-[10px] uppercase tracking-[0.2em]">
                  <span className={rig ? "text-acid" : "text-dust"}>
                    rig {rig ? "✓" : "—"}
                  </span>
                  <span className={voice ? "text-acid" : "text-dust"}>
                    voice {voice ? "✓" : "—"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <PanelHeader eyebrow="how to generate" title="Zoro's one-shot recipe" />
        <ol className="space-y-2 text-[13px] leading-relaxed text-chrome/90">
          <li>
            <span className="text-cyan">1.</span> In Claude Code, ensure SpriteCook MCP is connected
            (tools prefixed <code className="text-cyan">mcp__spritecook__*</code>).
          </li>
          <li>
            <span className="text-cyan">2.</span> For each character, call{" "}
            <code className="text-cyan">generate_game_art</code> with the prompt shown below, plus{" "}
            <code className="text-cyan">width: 1024, height: 1536, transparent_bg: true</code>.
          </li>
          <li>
            <span className="text-cyan">3.</span> Save the asset to{" "}
            <code className="text-cyan">/web/public/brand/avatars/&lt;slug&gt;.png</code>. The site
            auto-picks it up next request.
          </li>
          <li>
            <span className="text-cyan">4.</span> Palette reviews in <a className="text-cyan" href="/office/brand">/office/brand</a>.
            Rejects get regenerated.
          </li>
        </ol>
      </Panel>

      <section className="flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">
          {avatarCount} characters · anchored across the floor
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {AVATAR_SPECS.map((a) => {
            const member = TEAM.find((m) => m.slug === a.slug);
            return (
              <article
                key={a.slug}
                className="panel rounded-sm p-5"
                style={{ borderColor: `${member?.accent ?? "#00F5FF"}44` }}
              >
                <header className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
                      {a.slug} · {member?.role ?? ""}
                    </div>
                    <h3
                      className="mt-1 text-lg tracking-wide"
                      style={{ color: member?.accent ?? "#E8ECF5" }}
                    >
                      {a.displayName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-cyan">anchor</div>
                    <div className="text-[11px] text-chrome">{a.anchor.replace(/_/g, " ")}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-dust">
                      pose: {a.animPose.replace(/_/g, " ")}
                    </div>
                  </div>
                </header>
                <p className="mt-3 text-[12px] leading-relaxed text-dust">
                  {a.spriteCookPrompt}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.25em]">
                  <span className="rounded-sm border border-cyan/20 px-2 py-0.5 text-cyan">
                    /brand/avatars/{a.slug}.png
                  </span>
                  {a.rpmAvatarId ? (
                    <span className="rounded-sm border border-acid/20 px-2 py-0.5 text-acid">
                      rpm id set
                    </span>
                  ) : (
                    <span className="rounded-sm border border-dust/20 px-2 py-0.5 text-dust">
                      rpm id pending
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <Panel tone="violet">
        <PanelHeader eyebrow="phase b hook" title="R3F scene scaffolding" />
        <p className="text-[13px] leading-relaxed text-chrome/90">
          Phase B replaces the grid-floor CSS office with a React Three Fiber scene. Package adds:{" "}
          <code className="text-cyan">three</code>, <code className="text-cyan">@react-three/fiber</code>,{" "}
          <code className="text-cyan">@react-three/drei</code>. Load each character&apos;s glTF from{" "}
          <code className="text-cyan">https://models.readyplayer.me/&lt;id&gt;.glb</code>, anchor to
          the position from <code className="text-cyan">ANCHOR_POSITIONS</code>, and play the idle
          pose. Click-to-zoom maps each anchor to the workstation URL.
        </p>
      </Panel>
    </div>
  );
}
