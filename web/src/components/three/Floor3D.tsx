"use client";

/**
 * The immersive R3F office. All performers arranged around the council
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
import { CHOSEN_OFFICE_FLOOR } from "@/data/glbAssets";
import { OfficeRoom, CouncilTable, MonitorWall, Whiteboard } from "./OfficeRoom";
import { NeonSkyline } from "./NeonSkyline";
import { PerformerOverlay } from "./PerformerOverlay";
import { GLBAvatar } from "./GLBAvatar";
import { GLBModel } from "./GLBModel";
import { OPENCLAW_NODE } from "@/data/openclaw";

interface CameraFocus {
  target: [number, number, number];
  distance: number;
}

const DEFAULT_FOCUS: CameraFocus = { target: [0, 1.5, 0], distance: 18 };

export default function Floor3D() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [tourMode, setTourMode] = useState(false);

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
    <div className="relative h-[76vh] min-h-[560px] w-full overflow-hidden rounded-sm border border-cyan/30 bg-void">
      <Canvas
        className="h-full w-full"
        shadows
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [16, 9, 16], fov: 42, near: 0.1, far: 250 }}
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
          <GLBModel
            modelPath={CHOSEN_OFFICE_FLOOR.path}
            position={[-1.5, -1.02, 0.6]}
            rotation={[0, 0, 0]}
            scale={0.34}
            accent="#00F5FF"
            emissiveBoost={0.018}
          />
          <FurnitureLayer />
          <CouncilTable />
          <MonitorWall />
          <Whiteboard />

          {PERFORMERS.map((p) => {
            const member = TEAM.find((m) => m.slug === p.slug);
            return (
              <GLBAvatar
                key={p.slug}
                performer={p}
                modelPath={p.glbModelPath}
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
          maxDistance={34}
          maxPolarAngle={Math.PI / 2 - 0.08}
          autoRotate={tourMode && !selectedPerformer}
          autoRotateSpeed={0.55}
          target={selectedPerformer ? new THREE.Vector3(...selectedPerformer.desk3D.position) : new THREE.Vector3(...DEFAULT_FOCUS.target)}
        />
      </Canvas>

      {/* HUD chrome overlay (outside Canvas) */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1 text-[10px] uppercase tracking-[0.3em] text-cyan">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-acid" />
          phase b live · {PERFORMERS.length} operators
        </span>
        <span className="text-dust">local glb office · {CHOSEN_OFFICE_FLOOR.file}</span>
        <span className="text-dust">orbit: drag · zoom: scroll · focus: click</span>
      </div>
      <div className="pointer-events-none absolute right-3 top-3 text-right text-[10px] uppercase tracking-[0.3em] text-dust">
        <div>penthouse · s1lkroad tower</div>
        <div>sector 7 · 2077</div>
        <div className="mt-1 text-violet">{OPENCLAW_NODE.id} · ssh ready</div>
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
      <button
        type="button"
        onClick={() => {
          setSelectedSlug(null);
          setTourMode((value) => !value);
        }}
        className="absolute bottom-3 right-3 rounded-sm border border-cyan/40 bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cyan backdrop-blur hover:bg-cyan/10"
      >
        {tourMode ? "stop camera tour" : "walkable camera tour"}
      </button>

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

function FurnitureLayer() {
  return (
    <group>
      <GLBModel
        modelPath="/GLB_Assets/furniture_desk.glb"
        position={[-2.3, 0, -3.8]}
        rotation={[0, Math.PI * 0.5, 0]}
        scale={0.18}
        accent="#00F5FF"
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_desk.glb"
        position={[4.8, 0, -2.4]}
        rotation={[0, -Math.PI * 0.5, 0]}
        scale={0.16}
        accent="#67FFB5"
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_server_rack.glb"
        position={[8.7, 1.05, -4.4]}
        rotation={[0, -Math.PI * 0.5, 0]}
        scale={1.05}
        accent="#7A5BFF"
        emissiveBoost={0.08}
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_couch.glb"
        position={[-6.8, 0.05, -5.6]}
        rotation={[0, Math.PI * 0.55, 0]}
        scale={0.24}
        accent="#7A5BFF"
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_computer%201.glb"
        position={[-2.4, 1.0, -4.45]}
        rotation={[0, 0, 0]}
        scale={1.6}
        accent="#00F5FF"
        emissiveBoost={0.08}
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_computer_2.glb"
        position={[4.8, 0.95, -2.55]}
        rotation={[0, -Math.PI * 0.65, 0]}
        scale={0.9}
        accent="#67FFB5"
        emissiveBoost={0.05}
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_wall_computer.glb"
        position={[0, 2.2, -8.8]}
        rotation={[0, 0, 0]}
        scale={1.35}
        accent="#00F5FF"
        emissiveBoost={0.08}
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_whiteboard.glb"
        position={[-7.6, 1.3, 3.5]}
        rotation={[0, Math.PI * 0.5, 0]}
        scale={0.035}
        accent="#67FFB5"
        emissiveBoost={0.04}
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_wall_calendar.glb"
        position={[7.1, 1.7, 3.2]}
        rotation={[0, -Math.PI * 0.5, 0]}
        scale={0.06}
        accent="#FFB341"
        emissiveBoost={0.04}
      />
      <GLBModel
        modelPath="/GLB_Assets/furniture_tech.glb"
        position={[6.1, 0.05, 2.4]}
        rotation={[0, -Math.PI * 0.25, 0]}
        scale={0.045}
        accent="#FF2A4D"
        emissiveBoost={0.04}
      />
      <GLBModel
        modelPath="/GLB_Assets/cyberpunk_font.glb"
        position={[0, 3.1, -9.2]}
        rotation={[0, 0, 0]}
        scale={0.045}
        accent="#00F5FF"
        emissiveBoost={0.18}
      />
    </group>
  );
}
