"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars, useAnimations, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";
import { SpendTicker } from "@/components/SpendTicker";
import { SpendPanel } from "@/components/SpendPanel";
import { GLBAvatar } from "@/components/three/GLBAvatar";
import { GLBModel } from "@/components/three/GLBModel";
import { NeonSkyline } from "@/components/three/NeonSkyline";
import { CouncilTable, MonitorWall, OfficeRoom, Whiteboard } from "@/components/three/OfficeRoom";
import { AUTOMATIONS } from "@/data/automations";
import { ASSET_SPEC, MOTION_RULES, PALETTE_TOKENS } from "@/data/brand";
import { BIBLE, BIBLE_INTRO } from "@/data/bible";
import { CHOSEN_OFFICE_FLOOR } from "@/data/glbAssets";
import { COMMODITIES } from "@/data/commodities";
import { OPENCLAW_AGENT_STATUS, OPENCLAW_NODE } from "@/data/openclaw";
import { PERFORMERS, type PerformerSpec } from "@/data/performers";
import { PROVIDERS } from "@/data/providers";
import { ROADMAP } from "@/data/roadmap";
import { STATUS } from "@/data/status";
import { TASKS } from "@/data/tasks";
import { TEAM, type TeamMember } from "@/data/team";
import {
  WORLD_BLOCKERS,
  WORLD_HOTSPOTS,
  WORLD_ROOMS,
  type WorldBlocker,
  type WorldHotspot,
  type WorldHotspotId,
} from "@/data/world";
import { PROTOTYPES } from "@/data/wireframes";

type FounderSlug = "ghost" | "zoro";
type NotesByAgent = Record<string, string[]>;

type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

const PLAYER_SPAWNS: Record<FounderSlug, [number, number, number]> = {
  ghost: [1.2, 0, 5.6],
  zoro: [-1.2, 0, 5.6],
};

const REELS = [
  {
    id: "welcome",
    title: "Welcome to the Lab",
    duration: "0:40",
    narrator: "Ghost",
    accent: "#00F5FF",
  },
  {
    id: "ai-council",
    title: "The AI Council",
    duration: "0:26",
    narrator: "Compass",
    accent: "#7A5BFF",
  },
  {
    id: "first-day",
    title: "Your First Day",
    duration: "0:25",
    narrator: "Zoro",
    accent: "#67FFB5",
  },
] as const;

function usePersistentJson<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        setValue(fallbackRef.current);
        return;
      }
      setValue(JSON.parse(raw) as T);
    } catch {
      setValue(fallbackRef.current);
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage failures in private mode
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export default function ImmersiveOfficeGame() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [selectedCharacter, setSelectedCharacter] = usePersistentJson<FounderSlug | null>(
    "devlab.selected-founder",
    null,
  );
  const [agentNotes, setAgentNotes] = usePersistentJson<NotesByAgent>(
    "devlab.agent-notes",
    {},
  );
  const [activeHotspotId, setActiveHotspotId] = useState<WorldHotspotId | null>(null);
  const [activeAgentSlug, setActiveAgentSlug] = useState<string | null>(null);
  const [nearbyHotspotId, setNearbyHotspotId] = useState<WorldHotspotId | null>(null);
  const [nearbyAgentSlug, setNearbyAgentSlug] = useState<string | null>(null);

  const founderOptions = TEAM.filter((member) => member.kind === "founder") as Array<
    TeamMember & { slug: FounderSlug }
  >;
  const currentFounder = selectedCharacter
    ? TEAM.find((member) => member.slug === selectedCharacter) ?? null
    : null;
  const currentPerformer = selectedCharacter
    ? PERFORMERS.find((performer) => performer.slug === selectedCharacter) ?? null
    : null;
  const activeHotspot =
    activeHotspotId
      ? WORLD_HOTSPOTS.find((hotspot) => hotspot.id === activeHotspotId) ?? null
      : null;
  const activeAgent =
    activeAgentSlug ? TEAM.find((member) => member.slug === activeAgentSlug) ?? null : null;
  const activeAgentPerformer =
    activeAgentSlug ? PERFORMERS.find((performer) => performer.slug === activeAgentSlug) ?? null : null;

  const currentFounderTasks = useMemo(
    () => TASKS.filter((task) => task.owner === selectedCharacter && task.status !== "done"),
    [selectedCharacter],
  );

  const addAgentNote = useCallback(
    (slug: string, message: string) => {
      const clean = message.trim();
      if (!clean) return;
      setAgentNotes((current) => ({
        ...current,
        [slug]: [clean, ...(current[slug] ?? [])].slice(0, 12),
      }));
    },
    [setAgentNotes],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selectedCharacter) {
        if (event.key === "1") setSelectedCharacter("ghost");
        if (event.key === "2") setSelectedCharacter("zoro");
        return;
      }

      if (event.key === "Escape") {
        if (activeAgentSlug) {
          setActiveAgentSlug(null);
          return;
        }
        if (activeHotspotId) {
          setActiveHotspotId(null);
          return;
        }
      }

      if (event.key.toLowerCase() === "e") {
        if (nearbyAgentSlug) {
          setActiveAgentSlug(nearbyAgentSlug);
          setActiveHotspotId(null);
          return;
        }
        if (nearbyHotspotId) {
          setActiveHotspotId(nearbyHotspotId);
          setActiveAgentSlug(null);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    activeAgentSlug,
    activeHotspotId,
    nearbyAgentSlug,
    nearbyHotspotId,
    selectedCharacter,
    setSelectedCharacter,
  ]);

  async function lockOffice() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/gate");
  }

  return (
    <div className="game-shell relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <WorldScene
          activeHotspotId={activeHotspotId}
          activeAgentSlug={activeAgentSlug}
          movementEnabled={Boolean(selectedCharacter) && !activeHotspotId && !activeAgentSlug}
          onActivateAgent={(slug) => {
            setActiveAgentSlug(slug);
            setActiveHotspotId(null);
          }}
          onActivateHotspot={(id) => {
            setActiveHotspotId(id);
            setActiveAgentSlug(null);
          }}
          onNearbyAgentChange={setNearbyAgentSlug}
          onNearbyHotspotChange={setNearbyHotspotId}
          playerSlug={selectedCharacter}
          reduceMotion={Boolean(reduceMotion)}
        />
      </div>

      {!selectedCharacter ? (
        <CharacterSelectOverlay
          options={founderOptions}
          onSelect={setSelectedCharacter}
        />
      ) : (
        <>
          <GameHud
            founder={currentFounder}
            tasks={currentFounderTasks}
            nearbyAgent={nearbyAgentSlug ? TEAM.find((member) => member.slug === nearbyAgentSlug) ?? null : null}
            nearbyHotspot={nearbyHotspotId ? WORLD_HOTSPOTS.find((item) => item.id === nearbyHotspotId) ?? null : null}
            onLock={lockOffice}
            onSwap={() => {
              setSelectedCharacter(null);
              setActiveAgentSlug(null);
              setActiveHotspotId(null);
            }}
          />
          <PromptBar
            activeAgent={activeAgent}
            activeHotspot={activeHotspot}
            nearbyAgent={nearbyAgentSlug ? TEAM.find((member) => member.slug === nearbyAgentSlug) ?? null : null}
            nearbyHotspot={nearbyHotspotId ? WORLD_HOTSPOTS.find((item) => item.id === nearbyHotspotId) ?? null : null}
          />
        </>
      )}

      {activeHotspot && (
        <WorldOverlay
          hotspot={activeHotspot}
          onClose={() => setActiveHotspotId(null)}
        />
      )}

      {activeAgent && activeAgentPerformer && (
        <AgentConsole
          agent={activeAgent}
          performer={activeAgentPerformer}
          notes={agentNotes[activeAgent.slug] ?? []}
          onClose={() => setActiveAgentSlug(null)}
          onSubmit={addAgentNote}
        />
      )}

      {selectedCharacter && currentFounder && currentPerformer && (
        <div className="pointer-events-none absolute bottom-5 left-5 z-20 hidden max-w-sm rounded-sm border border-cyan/20 bg-void/78 p-4 text-[11px] uppercase tracking-[0.22em] text-dust backdrop-blur xl:block">
          <div className="flex items-center justify-between gap-3">
            <span className="text-cyan">rooms online</span>
            <span>{WORLD_ROOMS.length}</span>
          </div>
          <div className="mt-3 space-y-2 text-[12px] normal-case tracking-normal text-chrome">
            <p>{currentPerformer.voiceOver ?? currentPerformer.signatureLine}</p>
            <div className="grid gap-2">
              {WORLD_ROOMS.map((room) => (
                <div key={room.id} className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-acid">
                      {room.name}
                    </div>
                    <div className="text-dust">{room.summary}</div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-dust">
                    {room.anchors.length} nodes
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CharacterSelectOverlay({
  options,
  onSelect,
}: {
  options: Array<TeamMember & { slug: FounderSlug }>;
  onSelect: (slug: FounderSlug) => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-void/52 px-5 py-10 backdrop-blur-md">
      <div className="w-full max-w-6xl rounded-sm border border-cyan/20 bg-ink/82 p-6 shadow-[0_0_120px_rgba(0,0,0,0.5)] md:p-8">
        <div className="flex flex-col gap-3">
          <div className="text-[10px] uppercase tracking-[0.34em] text-cyan">
            character_select_01 // live floor ingress
          </div>
          <h1 className="font-display text-4xl uppercase tracking-[0.18em] text-chrome md:text-5xl">
            Choose Who Enters The Lab
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-dust">
            This is no longer a workstation dashboard. Pick Ghost or Zoro, spawn into the office,
            move with <span className="text-cyan">WASD</span> or the arrow keys, and walk up to
            the systems you want to inspect. Hover or click any live surface. Walk close to an AI
            operator to open their console and leave them a task.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {options.map((member, index) => {
            const tasks = TASKS.filter((task) => task.owner === member.slug && task.status !== "done").slice(0, 3);
            const accent = member.accent;
            return (
              <button
                key={member.slug}
                type="button"
                onClick={() => onSelect(member.slug)}
                className="group rounded-sm border bg-void/70 p-5 text-left transition-transform duration-200 hover:-translate-y-1"
                style={{
                  borderColor: `${accent}55`,
                  boxShadow: `0 0 0 1px ${accent}16 inset, 0 0 45px ${accent}18`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em]" style={{ color: accent }}>
                      player_{index + 1} // {member.codename}
                    </div>
                    <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.14em] text-chrome">
                      {member.name}
                    </h2>
                    <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-dust">
                      {member.role}
                    </div>
                  </div>
                  <div
                    className="rounded-sm border px-3 py-2 text-[10px] uppercase tracking-[0.3em]"
                    style={{ borderColor: `${accent}55`, color: accent }}
                  >
                    press {index + 1}
                  </div>
                </div>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-chrome/90">
                  {member.description}
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_0.9fr]">
                  <div className="rounded-sm border border-cyan/12 bg-ink/80 p-3">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">
                      current queue
                    </div>
                    <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-chrome">
                      {tasks.map((task) => (
                        <li key={task.id}>
                          <span className="text-acid">■</span> {task.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-sm border border-cyan/12 bg-ink/80 p-3">
                    <div className="text-[10px] uppercase tracking-[0.24em] text-acid">
                      controls
                    </div>
                    <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-dust">
                      <li>move: WASD / arrows</li>
                      <li>interact: E / click</li>
                      <li>camera: drag / scroll</li>
                      <li>close visor: Esc</li>
                    </ul>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GameHud({
  founder,
  tasks,
  nearbyHotspot,
  nearbyAgent,
  onSwap,
  onLock,
}: {
  founder: TeamMember | null;
  tasks: typeof TASKS;
  nearbyHotspot: WorldHotspot | null;
  nearbyAgent: TeamMember | null;
  onSwap: () => void;
  onLock: () => void;
}) {
  if (!founder) return null;
  const currentTask = tasks[0] ?? null;
  return (
    <>
      <div className="pointer-events-none absolute left-5 top-5 z-20 max-w-md rounded-sm border border-cyan/18 bg-void/78 p-4 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-cyan">
              live_floor // {founder.codename}
            </div>
            <h2 className="mt-1 font-display text-2xl uppercase tracking-[0.18em] text-chrome">
              {founder.name}
            </h2>
            <div className="text-[11px] uppercase tracking-[0.24em] text-dust">
              {founder.role}
            </div>
          </div>
          <div
            className="rounded-sm border px-2 py-1 text-[10px] uppercase tracking-[0.25em]"
            style={{ borderColor: `${founder.accent}55`, color: founder.accent }}
          >
            avatar live
          </div>
        </div>
        {currentTask && (
          <div className="mt-4 rounded-sm border border-cyan/10 bg-ink/80 p-3 text-[12px]">
            <div className="text-[10px] uppercase tracking-[0.24em] text-acid">
              current focus
            </div>
            <div className="mt-1 text-chrome">{currentTask.title}</div>
            <div className="mt-1 text-dust">
              {currentTask.priority} · {currentTask.estimate}
            </div>
          </div>
        )}
        <div className="mt-3 grid gap-2 text-[11px] md:grid-cols-2">
          <div className="rounded-sm border border-cyan/10 bg-ink/70 p-2 text-dust">
            nearby node:{" "}
            <span className="text-chrome">{nearbyHotspot?.title ?? "none"}</span>
          </div>
          <div className="rounded-sm border border-cyan/10 bg-ink/70 p-2 text-dust">
            nearby operator:{" "}
            <span className="text-chrome">{nearbyAgent?.name ?? "none"}</span>
          </div>
        </div>
      </div>

      <div className="absolute right-5 top-5 z-20 flex items-center gap-3">
        <SpendTicker />
        <button
          type="button"
          onClick={onSwap}
          className="rounded-sm border border-cyan/25 bg-void/76 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-cyan backdrop-blur hover:bg-cyan/8"
        >
          swap avatar
        </button>
        <button
          type="button"
          onClick={onLock}
          className="rounded-sm border border-heat/28 bg-void/76 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-heat backdrop-blur hover:bg-heat/10"
        >
          lock
        </button>
      </div>
    </>
  );
}

function PromptBar({
  nearbyHotspot,
  nearbyAgent,
  activeHotspot,
  activeAgent,
}: {
  nearbyHotspot: WorldHotspot | null;
  nearbyAgent: TeamMember | null;
  activeHotspot: WorldHotspot | null;
  activeAgent: TeamMember | null;
}) {
  const message = activeAgent
    ? `Console open: ${activeAgent.name}`
    : activeHotspot
      ? `Visor open: ${activeHotspot.title}`
      : nearbyAgent
        ? `Press E or click to talk to ${nearbyAgent.name}`
        : nearbyHotspot
          ? `Press E or click to open ${nearbyHotspot.title}`
          : "Walk the floor. Hover over a live surface or approach an operator.";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-5">
      <div className="max-w-3xl rounded-sm border border-cyan/18 bg-void/82 px-5 py-3 text-center text-[11px] uppercase tracking-[0.28em] text-chrome backdrop-blur">
        {message}
      </div>
    </div>
  );
}

function WorldScene({
  playerSlug,
  movementEnabled,
  activeHotspotId,
  activeAgentSlug,
  onNearbyHotspotChange,
  onNearbyAgentChange,
  onActivateHotspot,
  onActivateAgent,
  reduceMotion,
}: {
  playerSlug: FounderSlug | null;
  movementEnabled: boolean;
  activeHotspotId: WorldHotspotId | null;
  activeAgentSlug: string | null;
  onNearbyHotspotChange: (id: WorldHotspotId | null) => void;
  onNearbyAgentChange: (slug: string | null) => void;
  onActivateHotspot: (id: WorldHotspotId) => void;
  onActivateAgent: (slug: string) => void;
  reduceMotion: boolean;
}) {
  const controlsRef = useRef<any>(null);
  const [playerPosition, setPlayerPosition] = useState<[number, number, number] | null>(null);
  const ambientPerformers = playerSlug
    ? PERFORMERS.filter((performer) => performer.slug !== playerSlug)
    : PERFORMERS;

  return (
    <Canvas
      shadows
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [12, 6.5, 12], fov: 44, near: 0.1, far: 240 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#020208"]} />
      <fog attach="fog" args={["#020208", 24, 108]} />

      <ambientLight intensity={0.28} color="#50607c" />
      <hemisphereLight args={["#93c5fd", "#030408", 0.54]} />
      <directionalLight
        position={[8, 12, 7]}
        intensity={0.8}
        color="#bed8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-8, 6, 2]} intensity={0.55} color="#00F5FF" />
      <directionalLight position={[3, 5, -12]} intensity={0.45} color="#FF2A4D" />
      <pointLight position={[0, 3.4, 0]} color="#7A5BFF" intensity={0.9} distance={22} />

      <Stars radius={120} depth={60} count={650} factor={3.1} fade speed={0.4} />
      <NeonSkyline />
      <OfficeRoom />
      <CouncilTable />
      <MonitorWall />
      <Whiteboard />
      <HotspotLayer
        activeHotspotId={activeHotspotId}
        onActivateHotspot={onActivateHotspot}
        playerPosition={playerPosition}
        playerSlug={playerSlug}
      />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[6.4, 6.9, 96]} />
        <meshBasicMaterial color="#00F5FF" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>

      <Suspense fallback={null}>
        <GLBModel
          modelPath={CHOSEN_OFFICE_FLOOR.path}
          position={[-1.5, -1.02, 0.6]}
          scale={0.34}
          accent="#00F5FF"
          emissiveBoost={0.018}
        />
        <FurnitureLayer />
      </Suspense>

      <Suspense fallback={null}>
        {ambientPerformers.map((performer) => {
          const member = TEAM.find((item) => item.slug === performer.slug);
          return member ? (
            <GLBAvatar
              key={performer.slug}
              performer={performer}
              modelPath={performer.glbModelPath}
              accent={member.accent}
              name={member.name}
              role={member.role}
              behavior={performer.behavior}
              isSelected={activeAgentSlug === performer.slug}
              onSelect={onActivateAgent}
            />
          ) : null;
        })}
      </Suspense>
      <PlayerRig
        controlsRef={controlsRef}
        movementEnabled={movementEnabled}
        onNearbyAgentChange={onNearbyAgentChange}
        onNearbyHotspotChange={onNearbyHotspotChange}
        onPositionChange={setPlayerPosition}
        playerSlug={playerSlug}
      />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={4.5}
        maxDistance={11}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
        autoRotate={!playerSlug && !reduceMotion}
        autoRotateSpeed={0.45}
      />
    </Canvas>
  );
}

function PlayerRig({
  playerSlug,
  controlsRef,
  movementEnabled,
  onNearbyHotspotChange,
  onNearbyAgentChange,
  onPositionChange,
}: {
  playerSlug: FounderSlug | null;
  controlsRef: React.RefObject<any>;
  movementEnabled: boolean;
  onNearbyHotspotChange: (id: WorldHotspotId | null) => void;
  onNearbyAgentChange: (slug: string | null) => void;
  onPositionChange: (position: [number, number, number]) => void;
}) {
  const { camera } = useThree();
  const player = playerSlug
    ? PERFORMERS.find((performer) => performer.slug === playerSlug) ?? null
    : null;
  const member = playerSlug ? TEAM.find((item) => item.slug === playerSlug) ?? null : null;
  const group = useRef<THREE.Group>(null);
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
  });
  const sampleClock = useRef(0);
  const proximity = useRef<{ hotspot: WorldHotspotId | null; agent: string | null }>({
    hotspot: null,
    agent: null,
  });

  useEffect(() => {
    if (!playerSlug || !group.current) return;
    const spawn = PLAYER_SPAWNS[playerSlug];
    group.current.position.set(...spawn);
  }, [playerSlug]);

  useEffect(() => {
    if (!playerSlug) return;
    const spawn = PLAYER_SPAWNS[playerSlug];
    if (controlsRef.current) {
      controlsRef.current.target.set(spawn[0], 1.45, spawn[2]);
      camera.position.set(spawn[0], 4.6, spawn[2] + 5.6);
      controlsRef.current.update();
    }
  }, [camera, controlsRef, playerSlug]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          keys.current.forward = true;
          break;
        case "s":
        case "arrowdown":
          keys.current.backward = true;
          break;
        case "a":
        case "arrowleft":
          keys.current.left = true;
          break;
        case "d":
        case "arrowright":
          keys.current.right = true;
          break;
        case "shift":
          keys.current.sprint = true;
          break;
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.key.toLowerCase()) {
        case "w":
        case "arrowup":
          keys.current.forward = false;
          break;
        case "s":
        case "arrowdown":
          keys.current.backward = false;
          break;
        case "a":
        case "arrowleft":
          keys.current.left = false;
          break;
        case "d":
        case "arrowright":
          keys.current.right = false;
          break;
        case "shift":
          keys.current.sprint = false;
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!player || !playerSlug || !group.current) return;

    const position = group.current.position;
    const moveDir = new THREE.Vector3();
    const cameraForward = new THREE.Vector3();
    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;
    cameraForward.normalize();
    const cameraRight = new THREE.Vector3().crossVectors(cameraForward, new THREE.Vector3(0, 1, 0)).normalize();

    if (movementEnabled) {
      if (keys.current.forward) moveDir.add(cameraForward);
      if (keys.current.backward) moveDir.sub(cameraForward);
      if (keys.current.left) moveDir.sub(cameraRight);
      if (keys.current.right) moveDir.add(cameraRight);
    }

    const isMoving = moveDir.lengthSq() > 0.0001;
    if (isMoving) {
      moveDir.normalize();
      const speed = keys.current.sprint ? 4.5 : 3.15;
      const nextX = position.x + moveDir.x * speed * delta;
      const nextZ = position.z + moveDir.z * speed * delta;
      const resolved = resolvePosition(nextX, nextZ, position, WORLD_BLOCKERS);
      position.set(resolved[0], 0, resolved[1]);
      group.current.rotation.y = Math.atan2(moveDir.x, moveDir.z);
    }

    if (controlsRef.current) {
      const target = controlsRef.current.target as THREE.Vector3;
      target.lerp(new THREE.Vector3(position.x, 1.45, position.z), 0.2);
      controlsRef.current.update();
    }

    sampleClock.current += delta;
    if (sampleClock.current >= 0.14) {
      sampleClock.current = 0;
      onPositionChange([position.x, position.y, position.z]);
      const nearestHotspot = findNearestHotspot(position);
      const nearestAgent = findNearestAgent(position, playerSlug);

      if (nearestHotspot !== proximity.current.hotspot) {
        proximity.current.hotspot = nearestHotspot;
        onNearbyHotspotChange(nearestHotspot);
      }
      if (nearestAgent !== proximity.current.agent) {
        proximity.current.agent = nearestAgent;
        onNearbyAgentChange(nearestAgent);
      }
    }
  });

  if (!player || !member) return null;

  return (
    <group
      ref={group}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <Suspense fallback={<PlayerFallback accent={member.accent} />}>
        <PlayerAvatar performer={player} member={member} movementEnabled={movementEnabled} />
      </Suspense>
      <Html
        position={[0, 2.2, 0]}
        center
        distanceFactor={8}
        style={{ pointerEvents: "none" }}
      >
        <div className="rounded-sm border border-cyan/25 bg-void/85 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-cyan">
          {member.name}
        </div>
      </Html>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.48, 0.66, 48]} />
        <meshBasicMaterial color={member.accent} transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 1.4, 0]} color={member.accent} intensity={0.55} distance={4} />
    </group>
  );
}

function PlayerFallback({ accent }: { accent: string }) {
  return (
    <group position={[0, 0.92, 0]}>
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.34, 1.2, 8, 16]} />
        <meshStandardMaterial color="#0f1722" emissive={accent} emissiveIntensity={0.3} />
      </mesh>
      <pointLight position={[0, 0.55, 0]} color={accent} intensity={0.45} distance={3.5} />
    </group>
  );
}

function PlayerAvatar({
  performer,
  member,
  movementEnabled,
}: {
  performer: PerformerSpec;
  member: TeamMember;
  movementEnabled: boolean;
}) {
  const inner = useRef<THREE.Group>(null);
  const gltf = useGLTF(performer.glbModelPath) as unknown as GLTFResult;
  const scene = useMemo(() => {
    const cloned = cloneSkeleton(gltf.scene) as THREE.Group;
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials: THREE.Material[] = Array.isArray(mesh.material)
        ? (mesh.material as THREE.Material[])
        : [mesh.material];
      const next = materials.map((material) => {
        const clonedMaterial = material.clone();
        if (clonedMaterial instanceof THREE.MeshStandardMaterial) {
          clonedMaterial.emissive = new THREE.Color(member.accent);
          clonedMaterial.emissiveIntensity = 0.08;
          clonedMaterial.roughness = Math.min(0.82, clonedMaterial.roughness + 0.06);
        }
        return clonedMaterial;
      });
      mesh.material = Array.isArray(mesh.material) ? next : next[0]!;
    });
    return cloned;
  }, [gltf.scene, member.accent]);

  const { actions, names } = useAnimations(gltf.animations, scene);

  useEffect(() => {
    const clipName = names[0];
    if (!clipName) return;
    const action = actions[clipName];
    action?.reset().fadeIn(0.3).play();
    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, names]);

  useFrame((state) => {
    if (!inner.current) return;
    const t = state.clock.elapsedTime;
    const breath = Math.sin(t * 1.3) * 0.025;
    const drift = movementEnabled ? Math.sin(t * 8) * 0.01 : 0;
    inner.current.position.y = breath + drift;
    inner.current.rotation.z = movementEnabled ? Math.sin(t * 6) * 0.012 : 0;
  });

  return (
    <group ref={inner}>
      <primitive object={scene} scale={performer.modelScale ?? 0.95} />
    </group>
  );
}

function HotspotLayer({
  activeHotspotId,
  onActivateHotspot,
  playerPosition,
  playerSlug,
}: {
  activeHotspotId: WorldHotspotId | null;
  onActivateHotspot: (id: WorldHotspotId) => void;
  playerPosition: [number, number, number] | null;
  playerSlug: FounderSlug | null;
}) {
  return (
    <group>
      {WORLD_HOTSPOTS.map((hotspot) => (
        <HotspotSurface
          key={hotspot.id}
          hotspot={hotspot}
          isActive={hotspot.id === activeHotspotId}
          onOpen={onActivateHotspot}
          playerPosition={playerPosition}
          playerSlug={playerSlug}
        />
      ))}
    </group>
  );
}

function HotspotSurface({
  hotspot,
  isActive,
  onOpen,
  playerPosition,
  playerSlug,
}: {
  hotspot: WorldHotspot;
  isActive: boolean;
  onOpen: (id: WorldHotspotId) => void;
  playerPosition: [number, number, number] | null;
  playerSlug: FounderSlug | null;
}) {
  const [hovered, setHovered] = useState(false);
  const allowPointer = Boolean(playerSlug);
  const isNearby = playerPosition
    ? Math.hypot(playerPosition[0] - hotspot.position[0], playerPosition[2] - hotspot.position[2]) <=
      hotspot.radius + 0.9
    : false;
  const showPreview = allowPointer && (hovered || isActive || isNearby);
  const previewScale = hovered || isActive ? 1.05 : 1;
  const previewOpacity = showPreview ? 1 : 0.88;
  const plateSize: [number, number] = showPreview ? hotspot.panelSize : [1.02, 0.32];

  return (
    <group position={hotspot.position} rotation={[0, hotspot.rotationY, 0]}>
      <mesh
        position={[0, 0, -0.02]}
        scale={hovered || isActive ? 1.03 : 1}
        onClick={() => onOpen(hotspot.id)}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <planeGeometry args={plateSize} />
        <meshStandardMaterial
          color="#081016"
          emissive={new THREE.Color(hotspot.accent)}
          emissiveIntensity={showPreview ? (hovered || isActive ? 0.24 : 0.14) : hovered ? 0.34 : 0.18}
          transparent
          opacity={0.72}
          side={THREE.DoubleSide}
        />
      </mesh>
      {showPreview ? (
        <Html
          transform
          position={[0, 0, 0.01]}
          style={{
            width: `${hotspot.panelSize[0] * 108}px`,
            height: `${hotspot.panelSize[1] * 108}px`,
            pointerEvents: allowPointer ? "auto" : "none",
            opacity: previewOpacity,
          }}
        >
          <button
            type="button"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onOpen(hotspot.id)}
            className="h-full w-full border p-3 text-left transition-transform duration-200"
            style={{
              transform: `scale(${previewScale})`,
              borderColor: `${hotspot.accent}66`,
              background:
                "linear-gradient(180deg, rgba(5,6,8,0.82) 0%, rgba(10,13,18,0.96) 100%)",
              boxShadow: `0 0 0 1px ${hotspot.accent}18 inset, 0 0 30px ${hotspot.accent}1f`,
            }}
          >
            <HotspotPreview hotspot={hotspot} />
          </button>
        </Html>
      ) : (
        <Html
          transform
          position={[0, 0.02, 0.01]}
          center
          style={{ pointerEvents: "none", opacity: previewOpacity }}
        >
          <div
            className="rounded-sm border px-3 py-1 text-[10px] uppercase tracking-[0.26em] backdrop-blur"
            style={{
              borderColor: `${hotspot.accent}66`,
              color: hotspot.accent,
              background: "rgba(5,6,8,0.82)",
              boxShadow: `0 0 18px ${hotspot.accent}24`,
            }}
          >
            {hotspot.title}
          </div>
        </Html>
      )}
      <pointLight
        position={[0, 0.15, 0.15]}
        color={hotspot.accent}
        intensity={showPreview ? (hovered || isActive ? 0.8 : 0.45) : hovered ? 0.75 : 0.38}
        distance={4}
      />
    </group>
  );
}

function HotspotPreview({ hotspot }: { hotspot: WorldHotspot }) {
  const accent = hotspot.accent;
  if (hotspot.id === "tasks") {
    const focus = TASKS.filter(
      (task) => (task.owner === "ghost" || task.owner === "zoro") && task.status !== "done",
    ).slice(0, 4);
    return (
      <div className="flex h-full flex-col">
        <PreviewHeader hotspot={hotspot} />
        <div className="mt-2 grid gap-2 text-[11px] text-chrome">
          {focus.map((task) => (
            <div key={task.id} className="rounded-sm border border-cyan/10 bg-ink/80 p-2">
              <div className="text-[9px] uppercase tracking-[0.18em] text-acid">
                {task.owner} · {task.priority}
              </div>
              <div className="mt-1 leading-relaxed">{task.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hotspot.id === "wireframes") {
    return (
      <div className="flex h-full flex-col">
        <PreviewHeader hotspot={hotspot} />
        <div className="mt-2 grid flex-1 grid-cols-3 gap-2">
          {PROTOTYPES.slice(0, 3).map((prototype) => (
            <div
              key={prototype.slug}
              className="flex flex-col justify-between rounded-sm border border-cyan/10 bg-void/80 p-2"
            >
              <div className="text-[9px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                {prototype.version}
              </div>
              <div className="text-[11px] leading-snug text-chrome">{prototype.title}</div>
              <div className="text-[9px] uppercase tracking-[0.16em] text-dust">
                {prototype.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hotspot.id === "spend") {
    return (
      <div className="flex h-full flex-col">
        <PreviewHeader hotspot={hotspot} />
        <div className="mt-3 grid gap-2 text-[11px] text-chrome">
          <PreviewMetric label="providers" value={String(PROVIDERS.length)} accent={accent} />
          <PreviewMetric
            label="live probes"
            value={String(PROVIDERS.filter((provider) => provider.hasLiveProbe).length)}
            accent="#67FFB5"
          />
          <PreviewMetric label="rule" value="no silent burn" accent="#FFB341" />
        </div>
      </div>
    );
  }

  if (hotspot.id === "commodities") {
    return (
      <div className="flex h-full flex-col">
        <PreviewHeader hotspot={hotspot} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {COMMODITIES.slice(0, 4).map((commodity) => (
            <div key={commodity.slug} className="rounded-sm border border-cyan/10 bg-ink/82 p-2">
              <div className="text-[9px] uppercase tracking-[0.18em]" style={{ color: commodity.accent }}>
                {commodity.ticker}
              </div>
              <div className="mt-1 text-[11px] text-chrome">{commodity.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hotspot.id === "brand") {
    return (
      <div className="flex h-full flex-col">
        <PreviewHeader hotspot={hotspot} />
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PALETTE_TOKENS.slice(0, 6).map((token) => (
            <div key={token.name} className="rounded-sm border border-cyan/10 bg-ink/82 p-2">
              <div className="h-5 w-full rounded-sm border border-white/10" style={{ background: token.hex }} />
              <div className="mt-2 text-[9px] uppercase tracking-[0.16em] text-dust">{token.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hotspot.id === "reel") {
    return (
      <div className="flex h-full flex-col">
        <PreviewHeader hotspot={hotspot} />
        <div className="mt-2 flex-1 space-y-2">
          {REELS.map((reel) => (
            <div key={reel.id} className="rounded-sm border border-cyan/10 bg-ink/82 p-2">
              <div className="text-[9px] uppercase tracking-[0.18em]" style={{ color: reel.accent }}>
                {reel.duration} · {reel.narrator}
              </div>
              <div className="mt-1 text-[11px] text-chrome">{reel.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hotspot.id === "council") {
    const activePhase = ROADMAP.find((phase) => phase.status === "active");
    return (
      <div className="flex h-full flex-col">
        <PreviewHeader hotspot={hotspot} />
        <div className="mt-2 rounded-sm border border-cyan/10 bg-ink/82 p-2">
          <div className="text-[9px] uppercase tracking-[0.18em] text-acid">
            phase
          </div>
          <div className="mt-1 text-[11px] text-chrome">{activePhase?.name ?? STATUS.phaseId}</div>
          <div className="mt-1 text-[10px] leading-relaxed text-dust">{STATUS.nextMilestone}</div>
        </div>
      </div>
    );
  }

  if (hotspot.id === "status") {
    return (
      <div className="flex h-full flex-col">
        <PreviewHeader hotspot={hotspot} />
        <div className="mt-2 grid gap-2">
          <PreviewMetric label="wins" value={String(STATUS.recentWins.length)} accent="#67FFB5" />
          <PreviewMetric label="blockers" value={String(STATUS.blockers.length)} accent="#FF2A4D" />
          <PreviewMetric label="signals" value={String(STATUS.signals.length)} accent="#00F5FF" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <PreviewHeader hotspot={hotspot} />
      <div className="mt-2 flex-1 rounded-sm border border-cyan/10 bg-ink/82 p-2 text-[11px] leading-relaxed text-chrome">
        <div className="text-[9px] uppercase tracking-[0.18em] text-violet">
          {OPENCLAW_NODE.id}
        </div>
        <div className="mt-1">{OPENCLAW_AGENT_STATUS[0]?.name} + {OPENCLAW_AGENT_STATUS[1]?.name}</div>
        <div className="mt-1 text-dust">{OPENCLAW_NODE.ssh}</div>
      </div>
    </div>
  );
}

function PreviewHeader({ hotspot }: { hotspot: WorldHotspot }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="text-[9px] uppercase tracking-[0.22em]" style={{ color: hotspot.accent }}>
          {hotspot.room}
        </div>
        <div className="mt-1 text-[14px] uppercase tracking-[0.12em] text-chrome">
          {hotspot.title}
        </div>
      </div>
      <div className="rounded-sm border border-cyan/15 px-2 py-1 text-[8px] uppercase tracking-[0.22em] text-dust">
        hover / click
      </div>
    </div>
  );
}

function PreviewMetric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-sm border border-cyan/10 bg-ink/82 p-2">
      <div className="text-[9px] uppercase tracking-[0.18em] text-dust">{label}</div>
      <div className="mt-1 text-[13px] uppercase tracking-[0.1em]" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function WorldOverlay({
  hotspot,
  onClose,
}: {
  hotspot: WorldHotspot;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-void/68 px-4 py-6 backdrop-blur-sm">
      <div
        className="lab-overlay-panel max-h-[88vh] w-full max-w-7xl overflow-hidden rounded-sm border bg-ink/94"
        style={{
          borderColor: `${hotspot.accent}55`,
          boxShadow: `0 0 0 1px ${hotspot.accent}18 inset, 0 0 80px ${hotspot.accent}22`,
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cyan/12 px-5 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em]" style={{ color: hotspot.accent }}>
              {hotspot.room} // {hotspot.id}
            </div>
            <h2 className="mt-1 font-display text-3xl uppercase tracking-[0.16em] text-chrome">
              {hotspot.title}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-dust">{hotspot.summary}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-cyan/20 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-cyan hover:bg-cyan/8"
          >
            close
          </button>
        </div>
        <div className="max-h-[calc(88vh-112px)] overflow-y-auto px-5 py-5">
          <HotspotOverlayContent hotspot={hotspot} />
        </div>
      </div>
    </div>
  );
}

function HotspotOverlayContent({ hotspot }: { hotspot: WorldHotspot }) {
  if (hotspot.id === "tasks") {
    const founders = TEAM.filter((member) => member.slug === "ghost" || member.slug === "zoro");
    const supportOwners = TEAM.filter(
      (member) => member.kind !== "founder" && TASKS.some((task) => task.owner === member.slug && task.status !== "done"),
    );

    return (
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5">
          {founders.map((member) => {
            const tasks = TASKS.filter((task) => task.owner === member.slug && task.status !== "done");
            return (
              <section key={member.slug} className="rounded-sm border border-cyan/12 bg-void/72 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: member.accent }}>
                      {member.name}
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.2em] text-dust">{member.role}</div>
                  </div>
                  <div className="rounded-sm border border-cyan/15 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-dust">
                    {tasks.length} open
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-[13px] text-chrome">{task.title}</div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-dust">
                          {task.priority}
                        </div>
                      </div>
                      <div className="mt-1 text-[11px] text-dust">
                        {task.estimate} · {task.status}
                      </div>
                      {task.acceptanceCriteria.length > 0 && (
                        <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-chrome/90">
                          {task.acceptanceCriteria.slice(0, 3).map((item) => (
                            <li key={item}>
                              <span className="text-acid">✓</span> {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">support operators</div>
          <div className="mt-4 space-y-3">
            {supportOwners.map((member) => {
              const tasks = TASKS.filter((task) => task.owner === member.slug && task.status !== "done").slice(0, 2);
              return (
                <div key={member.slug} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[12px] uppercase tracking-[0.2em]" style={{ color: member.accent }}>
                        {member.name}
                      </div>
                      <div className="text-[11px] text-dust">{member.role}</div>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-dust">
                      {tasks.length} tasks
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-chrome">
                    {tasks.map((task) => (
                      <li key={task.id}>
                        <span className="text-cyan">■</span> {task.title}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  if (hotspot.id === "wireframes") {
    return (
      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {PROTOTYPES.map((prototype) => (
          <article key={prototype.slug} className="rounded-sm border border-cyan/12 bg-void/72 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-cyan">{prototype.version}</div>
                <h3 className="mt-1 text-lg tracking-wide text-chrome">{prototype.title}</h3>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-dust">{prototype.status}</div>
            </div>
            {prototype.demo ? (
              <div className="mt-4 overflow-hidden rounded-sm border border-cyan/10 bg-black transition-transform duration-200 hover:scale-[1.02]">
                <iframe
                  src={prototype.demo}
                  title={`${prototype.title} demo`}
                  loading="lazy"
                  className="h-[420px] w-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            ) : (
              <div className="mt-4 rounded-sm border border-cyan/10 bg-ink/85 p-4 text-sm text-dust">
                No live deployment. Use the repo link for branch import and diff work.
              </div>
            )}
            <p className="mt-3 text-[12px] leading-relaxed text-dust">{prototype.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em]">
              <a href={prototype.repo} target="_blank" rel="noreferrer" className="text-cyan">
                repo ↗
              </a>
              {prototype.demo && (
                <a href={prototype.demo} target="_blank" rel="noreferrer" className="text-acid">
                  open live ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (hotspot.id === "spend") {
    return <SpendPanel />;
  }

  if (hotspot.id === "commodities") {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {COMMODITIES.map((commodity) => (
          <article key={commodity.slug} className="rounded-sm border border-cyan/12 bg-void/72 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: commodity.accent }}>
                  {commodity.ticker}
                </div>
                <h3 className="mt-1 text-lg tracking-wide text-chrome">{commodity.name}</h3>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-dust">
                {commodity.volatility}
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-sm border border-cyan/10 bg-ink/88 p-3">
              <img
                src={commodity.assetFile}
                alt={commodity.name}
                className="mx-auto h-40 w-full object-contain"
              />
            </div>
            <div className="mt-3 text-[12px] text-chrome">{commodity.tagline}</div>
            <p className="mt-2 text-[12px] leading-relaxed text-dust">{commodity.narrative}</p>
          </article>
        ))}
      </div>
    );
  }

  if (hotspot.id === "brand") {
    return (
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">palette contract</div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {PALETTE_TOKENS.map((token) => (
              <div key={token.name} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
                <div className="h-12 rounded-sm border border-white/10" style={{ background: token.hex }} />
                <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-cyan">{token.name}</div>
                <div className="mt-1 text-[12px] text-chrome">{token.hex}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-dust">{token.role}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-acid">asset rack</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ASSET_SPEC.slice(0, 8).map((asset) => (
              <div key={asset.slug} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-cyan">{asset.displayName}</div>
                <code className="mt-2 block text-[11px] text-dust">{asset.pathInWeb}</code>
                {asset.note && <div className="mt-2 text-[11px] leading-relaxed text-dust">{asset.note}</div>}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-sm border border-cyan/10 bg-ink/88 p-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-violet">motion rules</div>
            <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-chrome">
              {MOTION_RULES.map((rule) => (
                <li key={rule}>
                  <span className="text-cyan">»</span> {rule}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    );
  }

  if (hotspot.id === "reel") {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {REELS.map((reel) => (
          <article key={reel.id} className="rounded-sm border border-cyan/12 bg-void/72 p-4">
            <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: reel.accent }}>
              {reel.duration} · {reel.narrator}
            </div>
            <h3 className="mt-1 text-lg tracking-wide text-chrome">{reel.title}</h3>
            <div className="mt-4 overflow-hidden rounded-sm border border-cyan/10 bg-black">
              <video controls playsInline preload="metadata" className="h-auto w-full bg-void">
                <source src={`/videos/${reel.id}.mp4`} type="video/mp4" />
              </video>
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (hotspot.id === "council") {
    const activePhase = ROADMAP.find((phase) => phase.status === "active");
    return (
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">phase live</div>
          <h3 className="mt-2 text-2xl tracking-wide text-chrome">{activePhase?.name ?? STATUS.phaseId}</h3>
          <p className="mt-3 text-sm leading-relaxed text-dust">{STATUS.headline}</p>
          <div className="mt-4 space-y-3">
            {ROADMAP.slice(0, 4).map((phase) => (
              <div key={phase.id} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[12px] text-chrome">{phase.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-dust">{phase.status}</div>
                </div>
                <div className="mt-1 text-[11px] leading-relaxed text-dust">{phase.summary}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-acid">automation quorum</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {AUTOMATIONS.map((automation) => (
              <div key={automation.slug} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: automation.accent }}>
                  {automation.humanSchedule}
                </div>
                <div className="mt-1 text-[13px] text-chrome">{automation.name}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-dust">{automation.description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (hotspot.id === "status") {
    return (
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
          <div className="text-[10px] uppercase tracking-[0.24em] text-acid">headline</div>
          <h3 className="mt-2 text-2xl tracking-wide text-chrome">{STATUS.headline}</h3>
          <div className="mt-4 space-y-3">
            {STATUS.signals.map((signal) => (
              <div key={signal.label} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[13px] text-chrome">{signal.label}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-dust">{signal.state}</div>
                </div>
                <div className="mt-1 text-[11px] leading-relaxed text-dust">{signal.detail}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-5">
          <div className="rounded-sm border border-cyan/12 bg-void/72 p-4">
            <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">recent wins</div>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-chrome">
              {STATUS.recentWins.map((item) => (
                <li key={item}>
                  <span className="text-acid">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-cyan/12 bg-void/72 p-4">
            <div className="text-[10px] uppercase tracking-[0.24em] text-heat">blockers</div>
            <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-chrome">
              {STATUS.blockers.map((item) => (
                <li key={item}>
                  <span className="text-heat">■</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
        <div className="text-[10px] uppercase tracking-[0.24em] text-violet">physical layer</div>
        <h3 className="mt-2 text-2xl tracking-wide text-chrome">{OPENCLAW_NODE.label}</h3>
        <div className="mt-4 rounded-sm border border-cyan/10 bg-ink/88 p-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-cyan">command</div>
          <code className="mt-2 block text-sm text-chrome">{OPENCLAW_NODE.ssh}</code>
          <div className="mt-2 text-[11px] text-dust">{OPENCLAW_NODE.note}</div>
        </div>
        <div className="mt-4 space-y-3">
          {OPENCLAW_AGENT_STATUS.map((agent) => (
            <div key={agent.slug} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-violet">{agent.name}</div>
                  <div className="mt-1 text-[13px] text-chrome">{agent.role}</div>
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-dust">{agent.state}</div>
              </div>
              <div className="mt-2 text-[11px] text-dust">{agent.heartbeat}</div>
              <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-chrome">
                {agent.responsibilities.map((item) => (
                  <li key={item}>
                    <span className="text-cyan">»</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
        <div className="text-[10px] uppercase tracking-[0.24em] text-acid">world note</div>
        <div className="mt-2 text-sm leading-relaxed text-dust">
          Zara handles asset ops. Zyra watches the node. Talon routes governance. This room is the
          physical executor layer that keeps the Dev Lab alive when no one is actively walking the
          floor.
        </div>
        <div className="mt-4 rounded-sm border border-cyan/10 bg-ink/88 p-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-cyan">lore anchor</div>
          <p className="mt-2 text-[12px] leading-relaxed text-chrome">{BIBLE_INTRO}</p>
          <div className="mt-3 space-y-3">
            {BIBLE.slice(0, 3).map((section) => (
              <div key={section.id}>
                <div className="text-[10px] uppercase tracking-[0.18em] text-violet">{section.title}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-dust">{section.body[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AgentConsole({
  agent,
  performer,
  notes,
  onClose,
  onSubmit,
}: {
  agent: TeamMember;
  performer: PerformerSpec;
  notes: string[];
  onClose: () => void;
  onSubmit: (slug: string, message: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const agentTasks = TASKS.filter((task) => task.owner === agent.slug && task.status !== "done").slice(0, 5);

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-end bg-void/55 px-4 py-6 backdrop-blur-sm">
      <div
        className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-sm border bg-ink/95"
        style={{
          borderColor: `${agent.accent}55`,
          boxShadow: `0 0 0 1px ${agent.accent}18 inset, 0 0 80px ${agent.accent}22`,
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cyan/12 px-5 py-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em]" style={{ color: agent.accent }}>
              operator_console // {agent.codename}
            </div>
            <h2 className="mt-1 font-display text-3xl uppercase tracking-[0.16em] text-chrome">
              {agent.name}
            </h2>
            <div className="mt-1 text-[11px] uppercase tracking-[0.22em] text-dust">
              {agent.role}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm border border-cyan/20 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-cyan hover:bg-cyan/8"
          >
            close
          </button>
        </div>

        <div className="max-h-[calc(88vh-112px)] overflow-y-auto px-5 py-5">
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-sm border border-cyan/12 bg-void/72 p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">current signal</div>
              <div className="mt-2 text-sm leading-relaxed text-chrome">{agent.statusLine}</div>
              <div className="mt-4 rounded-sm border border-cyan/10 bg-ink/88 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-acid">signature line</div>
                <p className="mt-2 text-[12px] leading-relaxed text-dust">{performer.signatureLine}</p>
              </div>
              <div className="mt-4 rounded-sm border border-cyan/10 bg-ink/88 p-3">
                <div className="text-[10px] uppercase tracking-[0.18em] text-violet">skills</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {agent.skills.map((skill) => (
                    <span key={skill} className="rounded-sm border border-cyan/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-dust">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-5">
              <div className="rounded-sm border border-cyan/12 bg-void/72 p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">assigned work</div>
                <div className="mt-3 space-y-3">
                  {agentTasks.length > 0 ? (
                    agentTasks.map((task) => (
                      <div key={task.id} className="rounded-sm border border-cyan/10 bg-ink/88 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-[13px] text-chrome">{task.title}</div>
                          <div className="text-[10px] uppercase tracking-[0.18em] text-dust">
                            {task.priority}
                          </div>
                        </div>
                        <div className="mt-1 text-[11px] text-dust">
                          {task.status} · {task.estimate}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-sm border border-cyan/10 bg-ink/88 p-3 text-sm text-dust">
                      No open tasks on the board.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-sm border border-cyan/12 bg-void/72 p-4">
                <div className="text-[10px] uppercase tracking-[0.24em] text-acid">leave a note</div>
                <div className="mt-3 grid gap-3">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={`Give ${agent.name} a task, question, or instruction.`}
                    className="min-h-28 rounded-sm border border-cyan/16 bg-ink/88 px-3 py-3 text-sm text-chrome outline-none placeholder:text-dust"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] text-dust">Stored locally on this browser for now.</div>
                    <button
                      type="button"
                      onClick={() => {
                        onSubmit(agent.slug, draft);
                        setDraft("");
                      }}
                      className="rounded-sm border border-acid/28 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-acid hover:bg-acid/10"
                    >
                      queue note
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {notes.length > 0 ? (
                    notes.map((note, index) => (
                      <div key={`${note}-${index}`} className="rounded-sm border border-cyan/10 bg-ink/88 p-3 text-[12px] leading-relaxed text-chrome">
                        {note}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-sm border border-cyan/10 bg-ink/88 p-3 text-sm text-dust">
                      No local notes yet.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
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
        scale={0.045}
        accent="#00F5FF"
        emissiveBoost={0.18}
      />
    </group>
  );
}

function resolvePosition(
  nextX: number,
  nextZ: number,
  current: THREE.Vector3,
  blockers: WorldBlocker[],
): [number, number] {
  const x = clamp(nextX, -8.75, 8.75);
  const z = clamp(nextZ, -8.8, 4.9);
  if (!isBlocked(x, z, blockers)) return [x, z];
  const slideX = clamp(x, -8.75, 8.75);
  const slideZ = clamp(z, -8.8, 4.9);
  if (!isBlocked(slideX, current.z, blockers)) return [slideX, current.z];
  if (!isBlocked(current.x, slideZ, blockers)) return [current.x, slideZ];
  return [current.x, current.z];
}

function isBlocked(x: number, z: number, blockers: WorldBlocker[]) {
  return blockers.some(
    (blocker) => x >= blocker.minX && x <= blocker.maxX && z >= blocker.minZ && z <= blocker.maxZ,
  );
}

function findNearestHotspot(position: THREE.Vector3): WorldHotspotId | null {
  let nearest: { id: WorldHotspotId; distance: number } | null = null;
  for (const hotspot of WORLD_HOTSPOTS) {
    const dx = hotspot.position[0] - position.x;
    const dz = hotspot.position[2] - position.z;
    const distance = Math.hypot(dx, dz);
    if (distance <= hotspot.radius && (!nearest || distance < nearest.distance)) {
      nearest = { id: hotspot.id, distance };
    }
  }
  return nearest?.id ?? null;
}

function findNearestAgent(position: THREE.Vector3, playerSlug: FounderSlug): string | null {
  let nearest: { slug: string; distance: number } | null = null;
  for (const performer of PERFORMERS) {
    if (performer.slug === playerSlug) continue;
    const dx = performer.desk3D.position[0] - position.x;
    const dz = performer.desk3D.position[2] - position.z;
    const distance = Math.hypot(dx, dz);
    if (distance <= 2.1 && (!nearest || distance < nearest.distance)) {
      nearest = { slug: performer.slug, distance };
    }
  }
  return nearest?.slug ?? null;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
