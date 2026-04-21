import { AvatarGLBGallery } from "@/components/three/AvatarGLBGallery";
import { CyberText } from "@/components/CyberText";
import { Panel, PanelHeader } from "@/components/Panel";
import { AVATAR_SPECS } from "@/data/avatars";
import { GLB_ASSETS_BY_KIND } from "@/data/glbAssets";
import { PERFORMERS } from "@/data/performers";
import { TEAM } from "@/data/team";

export const metadata = { title: "Avatar Lab — Character Rigs" };

export default function AvatarsPage() {
  const avatarRows = PERFORMERS.flatMap((performer) => {
    const member = TEAM.find((m) => m.slug === performer.slug);
    return member ? [{ performer, member }] : [];
  });
  const furnitureCount =
    GLB_ASSETS_BY_KIND.furniture.length + GLB_ASSETS_BY_KIND.prop.length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">
          avatar_lab_01 // phase_b_live
        </div>
        <CyberText as="h1" className="text-3xl md:text-4xl" glitch>
          AVATAR LAB
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Local GLB character rigs for Ghost, Zoro, Zara, Zyra, and the AI Council. The remote
          creator embed is gone; Phase B now renders the actual assets from{" "}
          <code className="text-cyan">/public/GLB_Assets</code> in React Three Fiber.
        </p>
      </header>

      <Panel tone="acid">
        <PanelHeader
          eyebrow="phase b · live now"
          title="3D GLB avatars gallery"
          right={
            <span className="rounded-sm border border-acid/35 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-acid">
              {avatarRows.length} live rigs
            </span>
          }
        />
        <p className="mb-5 max-w-4xl text-[13px] leading-relaxed text-chrome/90">
          The gallery uses one shared 3D viewport to avoid WebGL context exhaustion while still
          letting every operator select, inspect, orbit, and voice-test their local GLB rig. The
          same records drive the immersive office, so role fixes, Zara/Zyra placement, and
          OpenClaw node metadata stay synchronized.
        </p>
        <AvatarGLBGallery rows={avatarRows} />
      </Panel>

      <Panel tone="violet">
        <PanelHeader eyebrow="pipeline" title="Local rig binding" />
        <div className="grid gap-5 md:grid-cols-3">
          <div className="panel rounded-sm p-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">source</div>
            <h3 className="mt-1 text-base tracking-wide text-chrome">GLB assets</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-dust">
              Avatar and office files live under{" "}
              <code className="text-cyan">web/public/GLB_Assets</code>. The manifest currently
              tracks {GLB_ASSETS_BY_KIND.avatar.length} avatars, {GLB_ASSETS_BY_KIND.office.length}{" "}
              office shells, and {furnitureCount} furniture or prop files.
            </p>
          </div>
          <div className="panel rounded-sm p-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-acid">runtime</div>
            <h3 className="mt-1 text-base tracking-wide text-chrome">R3F + drei</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-dust">
              <code className="text-cyan">GLBAvatar</code> clones skinned models safely, plays any
              embedded clips, and adds procedural idle, typing, whiteboard, walk, node-watch, and
              council behaviors.
            </p>
          </div>
          <div className="panel rounded-sm p-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-violet">physical layer</div>
            <h3 className="mt-1 text-base tracking-wide text-chrome">Zara + Zyra</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-dust">
              The OpenClaw agents now have local rigs, server-room anchors, and{" "}
              <code className="text-cyan">zyra-mini</code> node metadata. They own the long-running
              asset, heartbeat, and render-queue work outside a single browser session.
            </p>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHeader eyebrow="voice ↔ rig binding" title="Floor data contract" />
        <p className="mb-3 text-[13px] leading-relaxed text-chrome/90">
          The 3D floor reads from <code className="text-cyan">/data/performers.ts</code>. Every
          performer has a local <code className="text-cyan">glbModelPath</code>, station position,
          behavior loop, and optional voice sample. Click a rig on the floor to focus the camera
          and trigger their spoken line.
        </p>
        <div className="grid gap-2 text-[12px] md:grid-cols-2">
          {PERFORMERS.map((p) => {
            const member = TEAM.find((m) => m.slug === p.slug);
            const voice = Boolean(p.voiceSampleUrl);
            return (
              <div
                key={`bind-${p.slug}`}
                className="flex items-center justify-between gap-3 rounded-sm border border-cyan/15 px-3 py-2"
              >
                <div className="min-w-0">
                  <span className="text-chrome">{member?.name ?? p.slug}</span>
                  <span className="ml-2 text-[11px] text-dust">· {member?.role ?? "—"}</span>
                </div>
                <div className="flex shrink-0 gap-2 text-[10px] uppercase tracking-[0.2em]">
                  <span className="text-acid">glb ✓</span>
                  <span className={voice ? "text-acid" : "text-dust"}>
                    voice {voice ? "✓" : "live"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel tone="heat">
        <PanelHeader eyebrow="asset manifest" title="What is loaded locally" />
        <div className="grid gap-3 text-[12px] md:grid-cols-2 xl:grid-cols-3">
          {GLB_ASSETS_BY_KIND.avatar.map((asset) => (
            <div key={asset.slug} className="rounded-sm border border-cyan/15 p-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-cyan">{asset.file}</div>
              <div className="mt-1 text-dust">{asset.note}</div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-chrome/80">
                {asset.sizeMB.toFixed(2)} MB
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel>
        <PanelHeader eyebrow="zoro prompt deck" title="2D portrait recipes still archived" />
        <p className="mb-4 text-[13px] leading-relaxed text-chrome/90">
          SpriteCook remains the fast 2D portrait and icon pipeline. These prompts are kept for
          future profile cards, broadcast overlays, and app-store art, but this page now previews
          the 3D rigs first.
        </p>
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
                  <span className="rounded-sm border border-acid/20 px-2 py-0.5 text-acid">
                    local glb bound
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
