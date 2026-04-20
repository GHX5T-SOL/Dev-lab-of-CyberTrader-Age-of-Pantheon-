"use client";

/**
 * The immersive R3F office. All 14 performers arranged around the council
 * table. Camera orbits, click-to-focus on any performer, ESC to release.
 *
 * This is the client-only entry point — import via next/dynamic with
 * ssr:false from any server page.
 */
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { PERFORMERS } from "@/data/performers";
import { TEAM } from "@/data/team";
import { OfficeRoom, CouncilTable, MonitorWall, Whiteboard } from "./OfficeRoom";
import { NeonSkyline } from "./NeonSkyline";
import { PerformerStandIn } from "./PerformerStandIn";
import { PerformerOverlay } from "./PerformerOverlay";

interface CameraFocus {
  target: [number, number, number];
  distance: number;
}

const DEFAULT_FOCUS: CameraFocus = { target: [0, 1.5, 0], distance: 18 };

export default function Floor3D() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  // Clear selection on ESC.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedSlug(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectedPerformer = selectedSlug
    ? PERFORMERS.find((p) => p.slug === selectedSlug)
    : null;
  const selectedMember = selectedPerformer
    ? TEAM.find((m) => m.slug === selectedPerformer.slug)
    : null;

  return (
    <div className="relative h-[70vh] min-h-[520px] w-full overflow-hidden rounded-sm border border-cyan/30 bg-void">
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [18, 10, 18], fov: 42, near: 0.1, far: 250 }}
        dpr={[1, 2]}
        onPointerMissed={() => setSelectedSlug(null)}
      >
        <color attach="background" args={["#020208"]} />
        <fog attach="fog" args={["#020208", 24, 110]} />

        {/* Base ambient + directional */}
        <ambientLight intensity={0.18} color="#5a6a88" />
        <directionalLight
          position={[8, 12, 8]}
          intensity={0.6}
          color="#b5d4ff"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        {/* Rim accent from the window side */}
        <directionalLight position={[0, 5, -15]} intensity={0.6} color="#FF2A4D" />
        <directionalLight position={[0, 5, 15]} intensity={0.3} color="#00F5FF" />

        <Suspense fallback={null}>
          <Environment preset="night" />
          <Stars radius={120} depth={50} count={500} factor={3} fade speed={0.5} />
          <NeonSkyline />
          <OfficeRoom />
          <CouncilTable />
          <MonitorWall />
          <Whiteboard />

          {PERFORMERS.map((p) => {
            const member = TEAM.find((m) => m.slug === p.slug);
            return (
              <PerformerStandIn
                key={p.slug}
                performer={p}
                accent={member?.accent ?? "#00F5FF"}
                name={member?.name ?? p.slug}
                role={member?.role ?? ""}
                isSelected={selectedSlug === p.slug}
                onSelect={setSelectedSlug}
              />
            );
          })}
        </Suspense>

        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.55}
            luminanceSmoothing={0.8}
            intensity={0.9}
            mipmapBlur
          />
          <Vignette offset={0.25} darkness={0.75} eskil={false} />
        </EffectComposer>

        <OrbitControls
          enablePan={true}
          enableDamping
          dampingFactor={0.08}
          minDistance={8}
          maxDistance={32}
          maxPolarAngle={Math.PI / 2 - 0.08}
          target={selectedPerformer ? new THREE.Vector3(...selectedPerformer.desk3D.position) : new THREE.Vector3(...DEFAULT_FOCUS.target)}
        />
      </Canvas>

      {/* HUD chrome overlay (outside Canvas) */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1 text-[10px] uppercase tracking-[0.3em] text-cyan">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-acid" />
          floor_3d · {PERFORMERS.length} operators
        </span>
        <span className="text-dust">orbit: drag · zoom: scroll · focus: click</span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 text-right text-[10px] uppercase tracking-[0.3em] text-dust">
        <div>penthouse · s1lkroad tower</div>
        <div>sector 7 · 2077</div>
      </div>

      {/* Click anywhere black pill -> clear focus */}
      {selectedSlug && (
        <button
          onClick={() => setSelectedSlug(null)}
          className="absolute bottom-3 left-3 rounded-sm border border-heat/40 bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-heat backdrop-blur hover:bg-heat/10"
        >
          release focus · esc
        </button>
      )}

      {selectedPerformer && selectedMember && (
        <PerformerOverlay
          performer={selectedPerformer}
          member={selectedMember}
          onClose={() => setSelectedSlug(null)}
        />
      )}
    </div>
  );
}
