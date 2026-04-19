import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";
import { AVATAR_SPECS } from "@/data/avatars";
import { TEAM } from "@/data/team";

export const metadata = { title: "Avatar Lab — Character Rigs" };

export default function AvatarsPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">avatar_lab_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">
          AVATAR LAB
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Character rigs for the 14 residents of the Dev Lab. Two pipelines run side by side: a
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
          14 characters · anchored across the floor
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
