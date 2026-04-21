"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import type { PerformerSpec } from "@/data/performers";
import type { TeamMember } from "@/data/team";
import { GLBAvatar } from "./GLBAvatar";

export interface AvatarGalleryRow {
  performer: PerformerSpec;
  member: TeamMember;
}

type VoiceState = "idle" | "loading" | "playing" | "error";

export function AvatarGLBGallery({ rows }: { rows: AvatarGalleryRow[] }) {
  const [activeSlug, setActiveSlug] = useState(rows[0]?.performer.slug ?? "");
  const [modalOpen, setModalOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const active = useMemo(
    () => rows.find((row) => row.performer.slug === activeSlug) ?? rows[0],
    [activeSlug, rows],
  );

  if (!active) return null;

  async function speak() {
    const performer = active!.performer;
    audioRef.current?.pause();
    setVoiceState("loading");
    try {
      const audio = performer.voiceSampleUrl
        ? new Audio(performer.voiceSampleUrl)
        : new Audio(
            URL.createObjectURL(
              await fetch("/api/voice/speak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: performer.slug }),
              }).then(async (res) => {
                if (!res.ok) throw new Error(`voice ${res.status}`);
                return res.blob();
              }),
            ),
          );
      audioRef.current = audio;
      audio.onended = () => setVoiceState("idle");
      audio.onerror = () => setVoiceState("error");
      await audio.play();
      setVoiceState("playing");
    } catch {
      setVoiceState("error");
    }
  }

  function stopVoice() {
    audioRef.current?.pause();
    setVoiceState("idle");
  }

  return (
    <>
      <div className="grid gap-5 xl:grid-cols-[minmax(360px,0.95fr)_1.4fr]">
        <section
          className="sticky top-24 h-[min(680px,calc(100vh-8rem))] min-h-[520px] overflow-hidden rounded-sm border bg-void"
          style={{
            borderColor: `${active.member.accent}66`,
            boxShadow: `0 0 0 1px ${active.member.accent}18 inset, 0 24px 70px -40px ${active.member.accent}`,
          }}
        >
          <AvatarStage row={active} selected />
          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between text-[10px] uppercase tracking-[0.25em]">
            <span style={{ color: active.member.accent }}>{active.member.codename}</span>
            <span className="text-dust">shared glb viewport</span>
          </div>
          <div className="absolute inset-x-4 bottom-4 rounded-sm border border-cyan/15 bg-ink/85 p-4 backdrop-blur">
            <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
              {active.member.kind} · {active.performer.behavior.replace(/_/g, " ")}
            </div>
            <h2
              className="mt-1 text-2xl uppercase tracking-[0.18em]"
              style={{ color: active.member.accent }}
            >
              {active.member.name}
            </h2>
            <div className="mt-1 text-[12px] uppercase tracking-[0.2em] text-chrome/80">
              {active.member.role}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-dust">
              &ldquo;{active.performer.signatureLine}&rdquo;
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-sm border border-cyan/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cyan hover:bg-cyan/10"
              >
                inspect rig
              </button>
              <button
                type="button"
                onClick={voiceState === "playing" ? stopVoice : speak}
                disabled={voiceState === "loading"}
                className="rounded-sm border border-acid/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-acid hover:bg-acid/10 disabled:opacity-50"
              >
                {voiceState === "loading" ? "loading voice" : voiceState === "playing" ? "stop voice" : "voice sample"}
              </button>
            </div>
            <div className="mt-2 truncate text-[10px] uppercase tracking-[0.16em] text-dust">
              <code className="text-cyan">{active.performer.glbModelPath}</code>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => {
            const isActive = row.performer.slug === active.performer.slug;
            return (
              <button
                key={row.performer.slug}
                type="button"
                onClick={() => setActiveSlug(row.performer.slug)}
                className="group min-h-[196px] rounded-sm border bg-ink/70 p-4 text-left transition-colors hover:bg-cyan/5"
                style={{
                  borderColor: isActive ? `${row.member.accent}aa` : `${row.member.accent}44`,
                  boxShadow: isActive ? `0 0 0 1px ${row.member.accent}33 inset` : undefined,
                }}
              >
                <div
                  className="relative mb-3 flex h-24 items-center justify-center overflow-hidden rounded-sm border"
                  style={{
                    borderColor: `${row.member.accent}33`,
                    background: `radial-gradient(circle at 50% 40%, ${row.member.accent}33, transparent 62%), linear-gradient(180deg, #050608, #0a0d12)`,
                  }}
                >
                  <div
                    className="h-14 w-14 rounded-full border"
                    style={{
                      borderColor: `${row.member.accent}88`,
                      boxShadow: `0 0 28px ${row.member.accent}55 inset, 0 0 24px ${row.member.accent}44`,
                    }}
                  />
                  <span
                    className="absolute text-xl uppercase tracking-[0.2em]"
                    style={{ color: row.member.accent }}
                  >
                    {row.member.name.slice(0, 2)}
                  </span>
                  <span className="absolute bottom-2 text-[8px] uppercase tracking-[0.2em] text-dust">
                    bound to shared 3d stage
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-dust">
                  {row.member.codename}
                </div>
                <h3
                  className="mt-1 text-base uppercase tracking-[0.18em]"
                  style={{ color: row.member.accent }}
                >
                  {row.member.name}
                </h3>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-chrome/80">
                  {row.member.role}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[8px] uppercase tracking-[0.18em]">
                  <span className="rounded-sm border border-acid/30 px-1.5 py-0.5 text-acid">
                    live glb
                  </span>
                  {row.member.node && (
                    <span className="rounded-sm border border-violet/30 px-1.5 py-0.5 text-violet">
                      {row.member.node}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-void/85 p-5 backdrop-blur"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="grid w-[min(980px,100%)] overflow-hidden rounded-sm border bg-ink md:grid-cols-[1.2fr_0.8fr]"
            style={{ borderColor: `${active.member.accent}66` }}
          >
            <div className="h-[520px] min-h-[360px] bg-void">
              <AvatarStage row={active} selected />
            </div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em]" style={{ color: active.member.accent }}>
                    {active.member.codename}
                  </div>
                  <h2 className="mt-1 text-2xl uppercase tracking-[0.18em] text-chrome">
                    {active.member.name}
                  </h2>
                  <div className="mt-1 text-[12px] uppercase tracking-[0.2em] text-dust">
                    {active.member.role}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-sm border border-dust/30 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-dust hover:text-chrome"
                >
                  close
                </button>
              </div>
              <p className="text-[13px] leading-relaxed text-chrome/90">
                &ldquo;{active.performer.signatureLine}&rdquo;
              </p>
              <div className="grid gap-2 text-[11px] leading-relaxed text-dust">
                <div>
                  <span className="text-dust/60">GLB:</span>{" "}
                  <code className="text-cyan">{active.performer.glbModelPath}</code>
                </div>
                <div>
                  <span className="text-dust/60">Station:</span>{" "}
                  <span className="text-chrome">{active.performer.desk3D.pose}</span>
                </div>
                <div>
                  <span className="text-dust/60">Behavior:</span>{" "}
                  <span className="text-chrome">{active.performer.behavior}</span>
                </div>
                {active.member.node && (
                  <div>
                    <span className="text-dust/60">Node:</span>{" "}
                    <code className="text-acid">{active.member.node}</code>
                  </div>
                )}
              </div>
              <div className="border-t border-cyan/10 pt-3 text-[12px] leading-relaxed text-dust">
                {active.member.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AvatarStage({ row, selected }: { row: AvatarGalleryRow; selected?: boolean }) {
  return (
    <Canvas
      className="h-full w-full"
      shadows
      camera={{ position: [0, 1.2, 3.35], fov: 35, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#050608"]} />
      <ambientLight intensity={0.85} color="#91a3c6" />
      <directionalLight position={[2, 4, 3]} intensity={1.25} color="#d8f6ff" castShadow />
      <pointLight position={[-1.8, 1.8, 1.6]} color={row.member.accent} intensity={1.5} distance={5} />
      <Suspense fallback={null}>
        <Environment preset="night" />
        <GLBAvatar
          performer={row.performer}
          modelPath={row.performer.glbModelPath}
          accent={row.member.accent}
          name={row.member.name}
          role={row.member.role}
          position={[0, 0, 0]}
          rotationY={0}
          compact
          showLabel={Boolean(selected)}
          isSelected={Boolean(selected)}
        />
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={2.25}
        maxDistance={4.6}
        autoRotate
        autoRotateSpeed={0.55}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1.0, 0]}
      />
    </Canvas>
  );
}
