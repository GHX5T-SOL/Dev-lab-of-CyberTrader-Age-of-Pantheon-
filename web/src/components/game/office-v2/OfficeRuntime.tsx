"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, Sparkles, Stars, Text } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  FOUNDERS_2077,
  METAVERSE_AGENTS,
  METAVERSE_ZONES,
  tasksForAgent,
  type FounderProfile,
  type FounderSlug,
  type MetaverseAgent,
  type MetaverseZone,
} from "@/data/metaverseAgents";
import { COMMODITIES } from "@/data/commodities";
import { OPENCLAW_AGENT_STATUS, OPENCLAW_NODE } from "@/data/openclaw";
import { PROTOTYPES } from "@/data/wireframes";
import { ROADMAP } from "@/data/roadmap";
import { STATUS } from "@/data/status";
import { TASKS, type Task } from "@/data/tasks";

type InteractionTarget =
  | { kind: "agent"; id: string }
  | { kind: "zone"; id: string }
  | null;

interface ProximityState {
  agentSlug: string | null;
  zoneId: string | null;
}

interface DirectiveNote {
  id: string;
  targetId: string;
  from: FounderSlug;
  message: string;
  createdAt: string;
}

const WORLD_BOUNDS = {
  minX: -9.6,
  maxX: 9.6,
  minZ: -7.7,
  maxZ: 7.7,
};

const KEYBOARD_HELP = "WASD / arrows move | Shift sprint | E interact | Esc close";

function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // localStorage can fail in private browser contexts.
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Persisting is useful, but the game should still run without it.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapAngle(value: number) {
  let next = value;
  while (next > Math.PI) next -= Math.PI * 2;
  while (next < -Math.PI) next += Math.PI * 2;
  return next;
}

function lerpAngle(from: number, to: number, t: number) {
  return from + wrapAngle(to - from) * t;
}

function makeId() {
  if (typeof window !== "undefined" && "crypto" in window && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }
  return `note-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isTypingTarget() {
  if (typeof document === "undefined") return false;
  const tag = document.activeElement?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function founderBySlug(slug: FounderSlug | null) {
  return FOUNDERS_2077.find((founder) => founder.slug === slug) ?? FOUNDERS_2077[0]!;
}

function taskStatusTone(status: Task["status"]) {
  if (status === "done") return "#67ffb5";
  if (status === "review") return "#00f5ff";
  if (status === "doing") return "#ffb341";
  if (status === "blocked") return "#ff2a4d";
  return "#7a5bff";
}

export default function OfficeRuntime() {
  const [selectedFounder, setSelectedFounder] = usePersistentState<FounderSlug | null>(
    "devlab.metaverse-founder",
    null,
  );
  const [proximity, setProximity] = useState<ProximityState>({
    agentSlug: null,
    zoneId: null,
  });
  const [activeTarget, setActiveTarget] = useState<InteractionTarget>(null);
  const [notesByTarget, setNotesByTarget] = usePersistentState<Record<string, DirectiveNote[]>>(
    "devlab.metaverse-directives",
    {},
  );
  const [toast, setToast] = useState<string | null>(null);

  const founder = useMemo(() => founderBySlug(selectedFounder), [selectedFounder]);
  const activeAgent = useMemo(
    () =>
      activeTarget?.kind === "agent"
        ? METAVERSE_AGENTS.find((agent) => agent.slug === activeTarget.id) ?? null
        : null,
    [activeTarget],
  );
  const activeZone = useMemo(
    () =>
      activeTarget?.kind === "zone"
        ? METAVERSE_ZONES.find((zone) => zone.id === activeTarget.id) ?? null
        : null,
    [activeTarget],
  );

  const openNearest = useCallback(() => {
    if (proximity.agentSlug) {
      setActiveTarget({ kind: "agent", id: proximity.agentSlug });
      return;
    }
    if (proximity.zoneId) {
      setActiveTarget({ kind: "zone", id: proximity.zoneId });
    }
  }, [proximity.agentSlug, proximity.zoneId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selectedFounder) return;
      if (isTypingTarget()) return;

      if (event.key === "Escape") {
        setActiveTarget(null);
        return;
      }

      if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        openNearest();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openNearest, selectedFounder]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const saveDirective = useCallback(
    async (targetId: string, message: string) => {
      if (!selectedFounder) return;
      const trimmed = message.trim();
      if (!trimmed) return;

      const note: DirectiveNote = {
        id: makeId(),
        targetId,
        from: selectedFounder,
        message: trimmed,
        createdAt: new Date().toISOString(),
      };

      setNotesByTarget((current) => ({
        ...current,
        [targetId]: [note, ...(current[targetId] ?? [])].slice(0, 12),
      }));

      await fetch("/api/office/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          from: selectedFounder,
          to: targetId,
          message: trimmed,
        }),
      }).catch(() => undefined);

      setToast("Directive synced to Council Memory");
    },
    [selectedFounder, setNotesByTarget],
  );

  if (!selectedFounder) {
    return <CharacterSelect onSelect={setSelectedFounder} />;
  }

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-[#02030a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_16%,rgba(0,245,255,0.16),transparent_34%),radial-gradient(circle_at_78%_75%,rgba(255,42,77,0.14),transparent_30%),linear-gradient(180deg,#02030a_0%,#050713_54%,#02030a_100%)]" />
      <Canvas
        shadows
        dpr={[1, 1.65]}
        camera={{ position: [0, 5.2, 10], fov: 52, near: 0.1, far: 120 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <MetaverseScene
            founder={founder}
            proximity={proximity}
            onProximityChange={setProximity}
            onInteract={setActiveTarget}
          />
        </Suspense>
      </Canvas>

      <GameHud
        founder={founder}
        proximity={proximity}
        onOpenNearest={openNearest}
        onExit={() => {
          setActiveTarget(null);
          setSelectedFounder(null);
        }}
      />

      <AnimatePresence>
        {activeTarget && (
          <InteractionModal
            key={`${activeTarget.kind}-${activeTarget.id}`}
            founder={founder}
            target={activeTarget}
            agent={activeAgent}
            zone={activeZone}
            notes={notesByTarget[activeTarget.id] ?? []}
            onClose={() => setActiveTarget(null)}
            onSaveDirective={saveDirective}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="pointer-events-none absolute bottom-8 left-1/2 z-50 -translate-x-1/2 border border-[#67ffb5]/50 bg-[#02040b]/90 px-5 py-3 text-xs uppercase tracking-[0.24em] text-[#67ffb5] shadow-[0_0_34px_rgba(103,255,181,0.3)] backdrop-blur-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CharacterSelect({ onSelect }: { onSelect: (slug: FounderSlug) => void }) {
  const [focused, setFocused] = useState<FounderSlug>("ghost");
  const activeFounder = founderBySlug(focused);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#02030a] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(0,245,255,0.22),transparent_28%),radial-gradient(circle_at_82%_24%,rgba(255,42,77,0.18),transparent_30%),linear-gradient(135deg,#02030a_0%,#081020_50%,#02030a_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(0,245,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,42,77,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="relative z-10 flex min-h-screen flex-col px-5 py-6">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-[#00f5ff]">
              CYBERTRADER: AGE OF PANTHEON // DEV LAB
            </p>
            <h1 className="mt-2 text-2xl font-semibold uppercase tracking-[0.18em] text-white md:text-4xl">
              Sector 7 Character Select
            </h1>
          </div>
          <div className="hidden border border-[#ff2a4d]/40 bg-[#ff2a4d]/10 px-4 py-2 text-right text-[10px] uppercase tracking-[0.22em] text-[#ff9aaa] md:block">
            2077-04-25
            <br />
            phase b metaverse runtime
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-5 py-6 lg:grid-cols-[1fr_0.68fr_1fr]">
          {FOUNDERS_2077.map((founder) => (
            <button
              key={founder.slug}
              type="button"
              onClick={() => setFocused(founder.slug)}
              onDoubleClick={() => onSelect(founder.slug)}
              className={`group relative h-[58vh] min-h-[420px] overflow-hidden border bg-[#040713]/76 text-left shadow-2xl transition duration-300 ${
                focused === founder.slug
                  ? "border-white/50 shadow-[0_0_70px_rgba(0,245,255,0.25)]"
                  : "border-white/12 hover:border-white/30"
              }`}
            >
              <div
                className="absolute inset-0 opacity-35"
                style={{
                  background: `radial-gradient(circle at 50% 26%, ${founder.accent}55, transparent 34%), radial-gradient(circle at 18% 82%, ${founder.secondary}3f, transparent 28%)`,
                }}
              />
              <Canvas camera={{ position: [0, 2.2, 5.4], fov: 40 }} dpr={[1, 1.5]}>
                <ambientLight intensity={1.2} />
                <directionalLight position={[2, 4, 4]} intensity={2.3} />
                <pointLight position={[-2, 2, 2]} color={founder.accent} intensity={3} />
                <FounderPreview founder={founder} selected={focused === founder.slug} />
                <EffectComposer>
                  <Bloom intensity={1.2} luminanceThreshold={0.18} luminanceSmoothing={0.62} />
                </EffectComposer>
              </Canvas>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#02030a] via-[#02030a]/82 to-transparent p-5">
                <p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: founder.accent }}>
                  {founder.archetype}
                </p>
                <h2 className="mt-2 text-4xl font-semibold uppercase tracking-[0.14em]">{founder.name}</h2>
                <p className="mt-2 max-w-lg text-sm leading-6 text-white/72">{founder.visual}</p>
              </div>
            </button>
          ))}

          <aside className="order-first border border-white/14 bg-[#02040b]/72 p-5 shadow-[0_0_60px_rgba(0,245,255,0.14)] backdrop-blur-xl lg:order-none">
            <p className="text-[10px] uppercase tracking-[0.36em]" style={{ color: activeFounder.accent }}>
              selected operator
            </p>
            <h2 className="mt-3 text-3xl font-semibold uppercase tracking-[0.16em]">{activeFounder.name}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/62">{activeFounder.title}</p>
            <div className="mt-5 grid gap-3 text-sm leading-6 text-white/72">
              <p>{activeFounder.authority}</p>
              <p>"{activeFounder.quote}"</p>
              <p>
                Entering the lab spawns you into a third-person 2077 work floor with live
                agent proximity prompts, a Task Nexus, Roadmap Spire, Asset Vault, Market
                Room, Cinema Room, and OpenClaw node telemetry.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelect(activeFounder.slug)}
              className="mt-6 w-full border px-5 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:scale-[1.02]"
              style={{
                borderColor: activeFounder.accent,
                boxShadow: `0 0 44px ${activeFounder.accent}55`,
                background: `linear-gradient(135deg, ${activeFounder.accent}35, ${activeFounder.secondary}25)`,
              }}
            >
              Enter the Lab as {activeFounder.name}
            </button>
            <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-white/45">
              Single click a character to inspect. Double click or press enter button to spawn.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FounderPreview({ founder, selected }: { founder: FounderProfile; selected: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.45) * 0.22 + (selected ? 0 : founder.slug === "ghost" ? -0.16 : 0.16);
    group.current.position.y = Math.sin(t * 1.2) * 0.045;
  });

  return (
    <group ref={group} position={[0, -0.78, 0]}>
      <ProceduralHumanoid
        accent={founder.accent}
        secondary={founder.secondary}
        variant={founder.slug === "ghost" ? 0 : 1}
        behavior={founder.slug === "ghost" ? "research" : "asset"}
        moving={false}
        founderSlug={founder.slug}
        scale={1.18}
      />
      <ShardOrbit accent={founder.accent} secondary={founder.secondary} radius={1.45} count={founder.slug === "ghost" ? 14 : 8} />
      {founder.slug === "zoro" && <KatanaPreview />}
    </group>
  );
}

function MetaverseScene({
  founder,
  proximity,
  onProximityChange,
  onInteract,
}: {
  founder: FounderProfile;
  proximity: ProximityState;
  onProximityChange: (state: ProximityState) => void;
  onInteract: (target: Exclude<InteractionTarget, null>) => void;
}) {
  const playerRef = useRef<THREE.Group>(null);
  const agentRefs = useRef<Record<string, THREE.Group | null>>({});
  const lastProximity = useRef<ProximityState>({ agentSlug: null, zoneId: null });

  useFrame(() => {
    const player = playerRef.current;
    if (!player) return;
    const playerPosition = player.position;
    let nearbyAgent: string | null = null;
    let nearbyAgentDistance = 3.55;

    for (const agent of METAVERSE_AGENTS) {
      const group = agentRefs.current[agent.slug];
      if (!group) continue;
      const distance = group.position.distanceTo(playerPosition);
      if (distance < nearbyAgentDistance) {
        nearbyAgentDistance = distance;
        nearbyAgent = agent.slug;
      }
    }

    let nearbyZone: string | null = null;
    let nearbyZoneDistance = 999;
    for (const zone of METAVERSE_ZONES) {
      const distance = playerPosition.distanceTo(new THREE.Vector3(...zone.position));
      if (distance < zone.radius && distance < nearbyZoneDistance) {
        nearbyZoneDistance = distance;
        nearbyZone = zone.id;
      }
    }

    if (
      lastProximity.current.agentSlug !== nearbyAgent ||
      lastProximity.current.zoneId !== nearbyZone
    ) {
      lastProximity.current = { agentSlug: nearbyAgent, zoneId: nearbyZone };
      onProximityChange(lastProximity.current);
    }
  });

  return (
    <>
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#04111e", 11, 39]} />
      <ambientLight intensity={0.36} />
      <hemisphereLight color="#6ffcff" groundColor="#05000d" intensity={0.74} />
      <directionalLight position={[0, 8, 5]} intensity={1.45} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-7, 3.3, -5]} color="#7a5bff" intensity={36} distance={12} />
      <pointLight position={[7, 3.3, -4]} color="#00f5ff" intensity={34} distance={12} />
      <pointLight position={[0, 5, 5]} color="#ff2a4d" intensity={26} distance={14} />

      <SmartGlassShell />
      <NeonRain />
      <FlyingTraffic />
      <OfficeFloor />
      <HoloCommandTable />
      <TaskNexus onInteract={() => onInteract({ kind: "zone", id: "task-nexus" })} />
      <RoadmapSpire onInteract={() => onInteract({ kind: "zone", id: "roadmap-spire" })} />
      <AssetVault onInteract={() => onInteract({ kind: "zone", id: "asset-vault" })} />
      <BuildStatusWall onInteract={() => onInteract({ kind: "zone", id: "build-status" })} />
      <MarketRoom onInteract={() => onInteract({ kind: "zone", id: "market-room" })} />
      <CinemaRoom onInteract={() => onInteract({ kind: "zone", id: "cinema-room" })} />
      <ZoneBeacon zone={METAVERSE_ZONES.find((zone) => zone.id === "holo-command")!} onInteract={() => onInteract({ kind: "zone", id: "holo-command" })} />

      {METAVERSE_AGENTS.map((agent, index) => (
        <AgentNpc
          key={agent.slug}
          agent={agent}
          index={index}
          nearby={proximity.agentSlug === agent.slug}
          setRef={(group) => {
            agentRefs.current[agent.slug] = group;
          }}
          onInteract={() => onInteract({ kind: "agent", id: agent.slug })}
        />
      ))}

      <PlayerController refObject={playerRef} founder={founder} />
      <Sparkles count={120} speed={0.35} size={1.8} color="#00f5ff" opacity={0.38} scale={[20, 8, 16]} position={[0, 3, 0]} />
      <Stars radius={70} depth={32} count={1300} factor={4} saturation={0} fade speed={0.2} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.45} luminanceThreshold={0.16} luminanceSmoothing={0.55} mipmapBlur />
      </EffectComposer>
    </>
  );
}

function PlayerController({
  refObject,
  founder,
}: {
  refObject: MutableRefObject<THREE.Group | null>;
  founder: FounderProfile;
}) {
  const keys = useRef<Record<string, boolean>>({});
  const moving = useRef(false);
  const stepTimer = useRef(0);
  const audioContext = useRef<AudioContext | null>(null);
  const { camera } = useThree();

  useEffect(() => {
    const setKey = (event: KeyboardEvent, pressed: boolean) => {
      if (isTypingTarget()) return;
      keys.current[event.key.toLowerCase()] = pressed;
    };
    const down = (event: KeyboardEvent) => setKey(event, true);
    const up = (event: KeyboardEvent) => setKey(event, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const pulseStep = useCallback(() => {
    try {
      audioContext.current ??= new AudioContext();
      const ctx = audioContext.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = founder.slug === "ghost" ? 78 : 92;
      gain.gain.value = 0.0001;
      gain.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch {
      // Audio is progressive enhancement.
    }
  }, [founder.slug]);

  useFrame((_, delta) => {
    const group = refObject.current;
    if (!group) return;

    const x =
      (keys.current.a || keys.current.arrowleft ? -1 : 0) +
      (keys.current.d || keys.current.arrowright ? 1 : 0);
    const z =
      (keys.current.w || keys.current.arrowup ? -1 : 0) +
      (keys.current.s || keys.current.arrowdown ? 1 : 0);
    const direction = new THREE.Vector3(x, 0, z);
    const isMoving = direction.lengthSq() > 0.01;
    moving.current = isMoving;

    if (isMoving) {
      direction.normalize();
      const sprint = keys.current.shift ? 1.55 : 1;
      const next = group.position.clone().addScaledVector(direction, delta * 3.25 * sprint);
      next.x = clamp(next.x, WORLD_BOUNDS.minX, WORLD_BOUNDS.maxX);
      next.z = clamp(next.z, WORLD_BOUNDS.minZ, WORLD_BOUNDS.maxZ);
      group.position.copy(next);

      const targetYaw = Math.atan2(direction.x, direction.z);
      group.rotation.y = lerpAngle(group.rotation.y, targetYaw, Math.min(1, delta * 10));
      stepTimer.current += delta;
      if (stepTimer.current > 0.34 / sprint) {
        stepTimer.current = 0;
        pulseStep();
      }
    } else {
      stepTimer.current = 0.24;
    }

    const cameraDistance = keys.current.shift ? 7.4 : 6.6;
    const cameraHeight = 4.6;
    const yaw = group.rotation.y;
    const cameraGoal = new THREE.Vector3(
      group.position.x - Math.sin(yaw) * cameraDistance,
      cameraHeight,
      group.position.z - Math.cos(yaw) * cameraDistance,
    );
    camera.position.lerp(cameraGoal, 1 - Math.exp(-delta * 5.2));
    camera.lookAt(group.position.x, group.position.y + 1.35, group.position.z);
  });

  return (
    <group ref={refObject} position={founder.spawn} name={`player-${founder.slug}`}>
      <ProceduralHumanoid
        accent={founder.accent}
        secondary={founder.secondary}
        variant={founder.slug === "ghost" ? 0 : 1}
        behavior={founder.slug === "ghost" ? "code" : "asset"}
        movingRef={moving}
        founderSlug={founder.slug}
        scale={0.78}
      />
    </group>
  );
}

function AgentNpc({
  agent,
  index,
  nearby,
  setRef,
  onInteract,
}: {
  agent: MetaverseAgent;
  index: number;
  nearby: boolean;
  setRef: (group: THREE.Group | null) => void;
  onInteract: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const moving = useRef(false);
  const pause = useRef(0);
  const routeIndex = useRef(index % agent.route.length);

  useEffect(() => {
    setRef(group.current);
    return () => setRef(null);
  }, [setRef]);

  useFrame(({ clock }, delta) => {
    const npc = group.current;
    if (!npc) return;
    const t = clock.elapsedTime + index * 0.37;
    const route = agent.route;
    const destination = new THREE.Vector3(...(route[routeIndex.current] ?? route[0]!));
    const distance = npc.position.distanceTo(destination);

    if (pause.current > 0) {
      pause.current -= delta;
      moving.current = false;
      npc.rotation.y += Math.sin(t * 0.7) * delta * 0.08;
      return;
    }

    if (distance < 0.1) {
      routeIndex.current = (routeIndex.current + 1) % route.length;
      pause.current = 1.2 + ((index * 0.31) % 1.8);
      moving.current = false;
      return;
    }

    const direction = destination.sub(npc.position).normalize();
    npc.position.addScaledVector(direction, delta * (0.72 + (index % 4) * 0.08));
    npc.rotation.y = lerpAngle(npc.rotation.y, Math.atan2(direction.x, direction.z), Math.min(1, delta * 4));
    moving.current = true;
  });

  return (
    <group
      ref={group}
      position={agent.station}
      onClick={(event) => {
        event.stopPropagation();
        onInteract();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
      name={`agent-${agent.slug}`}
    >
      <ProceduralHumanoid
        accent={agent.accent}
        secondary={agent.secondary}
        variant={index + 3}
        behavior={agent.behavior}
        movingRef={moving}
        scale={0.72}
      />
      <AgentAccessory agent={agent} index={index} />
      {nearby && (
        <Html position={[0, 2.72, 0]} center distanceFactor={7}>
          <div className="min-w-56 border border-white/30 bg-[#02040b]/90 px-4 py-3 text-center text-white shadow-[0_0_34px_rgba(0,245,255,0.22)] backdrop-blur-xl">
            <div className="text-[10px] uppercase tracking-[0.24em]" style={{ color: agent.accent }}>
              {agent.name}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/60">{agent.role}</div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#67ffb5]">Press E to sync</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function ProceduralHumanoid({
  accent,
  secondary,
  variant,
  behavior,
  founderSlug,
  scale = 1,
  moving = false,
  movingRef,
}: {
  accent: string;
  secondary: string;
  variant: number;
  behavior: string;
  founderSlug?: FounderSlug;
  scale?: number;
  moving?: boolean;
  movingRef?: MutableRefObject<boolean>;
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);
  const cloak = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + variant * 0.41;
    const activeMoving = movingRef?.current ?? moving;
    if (root.current) {
      root.current.position.y = Math.sin(t * (activeMoving ? 6.8 : 1.2)) * (activeMoving ? 0.035 : 0.025);
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.7) * 0.22;
      head.current.rotation.x = Math.sin(t * 0.52) * 0.05;
    }
    const walk = activeMoving ? Math.sin(t * 8.5) : Math.sin(t * 1.4) * 0.22;
    if (leftArm.current) leftArm.current.rotation.x = -0.15 + walk * 0.58;
    if (rightArm.current) rightArm.current.rotation.x = -0.15 - walk * 0.58;
    if (leftLeg.current) leftLeg.current.rotation.x = -walk * 0.5;
    if (rightLeg.current) rightLeg.current.rotation.x = walk * 0.5;
    if (cloak.current) cloak.current.rotation.z = Math.sin(t * 1.1) * 0.035;
  });

  const isGhost = founderSlug === "ghost";
  const isZoro = founderSlug === "zoro";
  const bodyShape = 0.52 + (variant % 4) * 0.035;
  const helmetHeight = 1.52 + ((variant + 1) % 3) * 0.035;

  return (
    <group ref={root} scale={scale}>
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <capsuleGeometry args={[bodyShape * 0.5, 0.72, 8, 18]} />
        <meshStandardMaterial
          color="#101522"
          metalness={0.72}
          roughness={0.26}
          emissive={accent}
          emissiveIntensity={0.18}
        />
      </mesh>
      <mesh ref={cloak} castShadow position={[0, 1.06, 0.16]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[0.9, 1.18, 0.08]} />
        <meshStandardMaterial
          color={isGhost ? "#071827" : "#170711"}
          transparent
          opacity={isGhost ? 0.48 : 0.82}
          metalness={0.22}
          roughness={0.34}
          emissive={secondary}
          emissiveIntensity={isGhost ? 0.34 : 0.18}
        />
      </mesh>
      <group ref={head} position={[0, helmetHeight, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.28, 24, 18]} />
          <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.22} emissive={secondary} emissiveIntensity={0.12} />
        </mesh>
        <mesh position={[0, 0.02, -0.25]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.42, 0.075, 0.045]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2.6} toneMapped={false} />
        </mesh>
        {isGhost && (
          <mesh position={[0, 0.1, 0.02]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[0.39, 0.42, 5]} />
            <meshStandardMaterial color="#08131f" transparent opacity={0.72} emissive={accent} emissiveIntensity={0.16} />
          </mesh>
        )}
        {isZoro && (
          <mesh position={[0, 0.18, -0.02]}>
            <torusGeometry args={[0.31, 0.018, 8, 36]} />
            <meshStandardMaterial color="#ff2a4d" emissive="#ff2a4d" emissiveIntensity={1.4} />
          </mesh>
        )}
      </group>

      <group ref={leftArm} position={[-0.47, 1.13, 0]}>
        <mesh castShadow rotation={[0.18, 0, 0.1]} position={[0, -0.33, 0]}>
          <capsuleGeometry args={[0.105, 0.62, 6, 12]} />
          <meshStandardMaterial color={isGhost ? secondary : "#131925"} metalness={0.78} roughness={0.24} emissive={isGhost ? secondary : accent} emissiveIntensity={isGhost ? 0.7 : 0.2} />
        </mesh>
      </group>
      <group ref={rightArm} position={[0.47, 1.13, 0]}>
        <mesh castShadow rotation={[0.18, 0, -0.1]} position={[0, -0.33, 0]}>
          <capsuleGeometry args={[0.105, 0.62, 6, 12]} />
          <meshStandardMaterial color="#131925" metalness={0.78} roughness={0.24} emissive={accent} emissiveIntensity={0.2} />
        </mesh>
      </group>
      <group ref={leftLeg} position={[-0.18, 0.48, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.12, 0.65, 6, 12]} />
          <meshStandardMaterial color="#090c16" metalness={0.68} roughness={0.3} emissive={secondary} emissiveIntensity={0.08} />
        </mesh>
      </group>
      <group ref={rightLeg} position={[0.18, 0.48, 0]}>
        <mesh castShadow position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.12, 0.65, 6, 12]} />
          <meshStandardMaterial color="#090c16" metalness={0.68} roughness={0.3} emissive={secondary} emissiveIntensity={0.08} />
        </mesh>
      </group>

      <mesh position={[0, 1.23, -0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.012, 8, 42]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {behavior === "node" && <mesh position={[0, 0.72, 0.45]} rotation={[0.5, 0, 0]}><torusKnotGeometry args={[0.22, 0.018, 64, 8]} /><meshStandardMaterial color={secondary} emissive={secondary} emissiveIntensity={1.5} /></mesh>}
      {isZoro && <KatanaRack />}
    </group>
  );
}

function AgentAccessory({ agent, index }: { agent: MetaverseAgent; index: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime + index;
    group.current.rotation.y = t * 0.55;
    group.current.position.y = 1.34 + Math.sin(t * 1.4) * 0.07;
  });

  const count = agent.behavior === "pm" ? 5 : agent.behavior === "code" ? 4 : 3;
  return (
    <group ref={group}>
      {Array.from({ length: count }).map((_, itemIndex) => {
        const angle = (itemIndex / count) * Math.PI * 2;
        const radius = agent.behavior === "cinema" ? 0.82 : 0.68;
        return (
          <mesh key={itemIndex} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <boxGeometry args={[0.16, 0.1, 0.018]} />
            <meshStandardMaterial color="#050713" emissive={itemIndex % 2 ? agent.accent : agent.secondary} emissiveIntensity={1.9} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function KatanaRack() {
  return (
    <group position={[0, 1.23, 0.42]} rotation={[0.55, 0, 0]}>
      {[-0.18, 0, 0.18].map((offset, index) => (
        <mesh key={offset} position={[offset, 0, 0]} rotation={[0, 0, index === 1 ? 0 : offset * 1.8]}>
          <cylinderGeometry args={[0.018, 0.018, 1.05, 10]} />
          <meshStandardMaterial color={index === 1 ? "#67ffb5" : "#ff2a4d"} emissive={index === 1 ? "#67ffb5" : "#ff2a4d"} emissiveIntensity={2.1} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function KatanaPreview() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = -0.55 + Math.sin(clock.elapsedTime * 0.7) * 0.16;
  });
  return (
    <group ref={group} position={[0.8, 1.4, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 1.35, 12]} />
        <meshStandardMaterial color="#67ffb5" emissive="#67ffb5" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ShardOrbit({
  accent,
  secondary,
  radius,
  count,
}: {
  accent: string;
  secondary: string;
  radius: number;
  count: number;
}) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.elapsedTime * 0.36;
      group.current.rotation.x = Math.sin(clock.elapsedTime * 0.22) * 0.18;
    }
  });

  return (
    <group ref={group} position={[0, 1.15, 0]}>
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              Math.sin(index * 1.7) * 0.42,
              Math.sin(angle) * radius,
            ]}
            rotation={[angle, angle * 0.4, angle * 0.8]}
          >
            <octahedronGeometry args={[0.055 + (index % 3) * 0.015, 0]} />
            <meshStandardMaterial
              color={index % 2 ? accent : secondary}
              emissive={index % 2 ? accent : secondary}
              emissiveIntensity={1.8}
              transparent
              opacity={0.86}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function OfficeFloor() {
  const gridLines = useMemo(() => {
    const lines: Array<[[number, number, number], [number, number, number], string]> = [];
    for (let x = -10; x <= 10; x += 1) {
      lines.push([[x, 0.021, -8], [x, 0.021, 8], x % 4 === 0 ? "#00f5ff" : "#123849"]);
    }
    for (let z = -8; z <= 8; z += 1) {
      lines.push([[-10, 0.022, z], [10, 0.022, z], z % 4 === 0 ? "#ff2a4d" : "#182d43"]);
    }
    return lines;
  }, []);

  return (
    <group>
      <mesh receiveShadow position={[0, -0.01, 0]}>
        <boxGeometry args={[21, 0.04, 17]} />
        <meshStandardMaterial color="#030712" metalness={0.65} roughness={0.18} emissive="#050b16" emissiveIntensity={0.24} />
      </mesh>
      {gridLines.map(([start, end, color], index) => (
        <Line key={index} points={[start, end]} color={color} lineWidth={index % 4 === 0 ? 1.4 : 0.45} transparent opacity={0.62} />
      ))}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.25, 2.32, 96]} />
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={1.1} transparent opacity={0.68} toneMapped={false} />
      </mesh>
    </group>
  );
}

function SmartGlassShell() {
  return (
    <group>
      <mesh position={[0, 2.6, -8.1]}>
        <boxGeometry args={[21, 5.2, 0.08]} />
        <meshStandardMaterial color="#06111e" transparent opacity={0.34} metalness={0.7} roughness={0.05} emissive="#00f5ff" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[-10.25, 2.55, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[16.2, 5.1, 0.08]} />
        <meshStandardMaterial color="#080617" transparent opacity={0.22} metalness={0.8} roughness={0.04} emissive="#7a5bff" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[10.25, 2.55, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[16.2, 5.1, 0.08]} />
        <meshStandardMaterial color="#150611" transparent opacity={0.22} metalness={0.8} roughness={0.04} emissive="#ff2a4d" emissiveIntensity={0.09} />
      </mesh>
      {[-9.8, -4.9, 0, 4.9, 9.8].map((x) => (
        <Line key={x} points={[[x, 0.05, -8.16], [x, 5.2, -8.16]]} color="#00f5ff" lineWidth={1.2} transparent opacity={0.7} />
      ))}
      {[1.2, 2.6, 4.0].map((y) => (
        <Line key={y} points={[[-10.2, y, -8.17], [10.2, y, -8.17]]} color="#ff2a4d" lineWidth={0.9} transparent opacity={0.5} />
      ))}
    </group>
  );
}

function NeonRain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 72 }).map((_, index) => ({
        x: -10 + ((index * 2.73) % 20),
        y: 0.6 + ((index * 1.91) % 4.8),
        z: -9.1 - ((index * 0.19) % 1.2),
        color: index % 3 === 0 ? "#00f5ff" : index % 3 === 1 ? "#ff2a4d" : "#7a5bff",
      })),
    [],
  );

  return (
    <group>
      {drops.map((drop, index) => (
        <Line
          key={index}
          points={[
            [drop.x, drop.y, drop.z],
            [drop.x + 0.05, drop.y - 0.45, drop.z],
          ]}
          color={drop.color}
          lineWidth={0.8}
          transparent
          opacity={0.5}
        />
      ))}
    </group>
  );
}

function FlyingTraffic() {
  const group = useRef<THREE.Group>(null);
  const cars = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, index) => ({
        x: -11 + index * 2.2,
        y: 2.1 + (index % 4) * 0.52,
        z: -10.4 - (index % 3) * 0.55,
        speed: 0.35 + (index % 5) * 0.08,
        color: index % 2 ? "#00f5ff" : "#ff2a4d",
      })),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      const car = cars[index];
      if (!car) return;
      child.position.x = ((car.x + clock.elapsedTime * car.speed * 3 + 12) % 24) - 12;
    });
  });

  return (
    <group ref={group}>
      {cars.map((car, index) => (
        <group key={index} position={[car.x, car.y, car.z]}>
          <mesh>
            <boxGeometry args={[0.62, 0.12, 0.2]} />
            <meshStandardMaterial color="#090c16" emissive={car.color} emissiveIntensity={0.9} />
          </mesh>
          <Line points={[[-0.58, 0, 0.11], [-1.45, 0, 0.11]]} color={car.color} lineWidth={1.2} transparent opacity={0.85} />
        </group>
      ))}
    </group>
  );
}

function HoloCommandTable() {
  const city = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (city.current) city.current.rotation.y = clock.elapsedTime * 0.12;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.58, 0]}>
        <cylinderGeometry args={[1.75, 1.92, 0.22, 64]} />
        <meshStandardMaterial color="#070b15" metalness={0.85} roughness={0.18} emissive="#ffb341" emissiveIntensity={0.22} />
      </mesh>
      <mesh position={[0, 0.77, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.65, 96]} />
        <meshStandardMaterial color="#06111e" transparent opacity={0.54} emissive="#00f5ff" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      <group ref={city} position={[0, 0.9, 0]}>
        {Array.from({ length: 28 }).map((_, index) => {
          const x = -1.2 + (index % 7) * 0.4;
          const z = -0.72 + Math.floor(index / 7) * 0.44;
          const h = 0.16 + ((index * 13) % 9) * 0.055;
          return (
            <mesh key={index} position={[x, h / 2, z]}>
              <boxGeometry args={[0.18, h, 0.18]} />
              <meshStandardMaterial color="#02040b" emissive={index % 3 === 0 ? "#ff2a4d" : "#00f5ff"} emissiveIntensity={1.4} transparent opacity={0.84} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
      <Text position={[0, 1.68, 0]} fontSize={0.16} color="#ffb341" anchorX="center">
        HOLO-COMMAND // NEON VOID CITY
      </Text>
    </group>
  );
}

function ZoneBeacon({
  zone,
  onInteract,
}: {
  zone: MetaverseZone;
  onInteract: () => void;
}) {
  return (
    <group
      position={zone.position}
      onClick={(event) => {
        event.stopPropagation();
        onInteract();
      }}
    >
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[zone.radius * 0.82, zone.radius * 0.86, 64]} />
        <meshStandardMaterial color={zone.accent} emissive={zone.accent} emissiveIntensity={0.8} transparent opacity={0.28} toneMapped={false} />
      </mesh>
    </group>
  );
}

function HologramPanel({
  width,
  height,
  accent,
  title,
  subtitle,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  children,
  onInteract,
}: {
  width: number;
  height: number;
  accent: string;
  title: string;
  subtitle: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  children?: React.ReactNode;
  onInteract?: () => void;
}) {
  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(event) => {
        event.stopPropagation();
        onInteract?.();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <mesh>
        <boxGeometry args={[width, height, 0.055]} />
        <meshStandardMaterial color="#02040b" transparent opacity={0.72} emissive={accent} emissiveIntensity={0.24} metalness={0.65} roughness={0.18} />
      </mesh>
      <Line points={[[-width / 2, height / 2, 0.04], [width / 2, height / 2, 0.04], [width / 2, -height / 2, 0.04], [-width / 2, -height / 2, 0.04], [-width / 2, height / 2, 0.04]]} color={accent} lineWidth={1.8} transparent opacity={0.9} />
      <Text position={[0, height / 2 - 0.25, 0.08]} fontSize={0.16} color={accent} anchorX="center" maxWidth={width - 0.3}>
        {title}
      </Text>
      <Text position={[0, height / 2 - 0.52, 0.08]} fontSize={0.08} color="#ffffff" anchorX="center" maxWidth={width - 0.4}>
        {subtitle}
      </Text>
      {children}
    </group>
  );
}

function TaskNexus({ onInteract }: { onInteract: () => void }) {
  const tasks = TASKS.filter((task) => task.owner === "ghost" || task.owner === "zoro").slice(0, 12);
  return (
    <group position={[-8.25, 1.8, 0.8]} rotation={[0, Math.PI / 2, 0]}>
      <HologramPanel width={3.2} height={3.6} accent="#67ffb5" title="TASK NEXUS" subtitle="Ghost / Zoro live work board" onInteract={onInteract}>
        {tasks.map((task, index) => {
          const x = -1.1 + (index % 2) * 2.2;
          const y = 0.9 - Math.floor(index / 2) * 0.43;
          return (
            <group key={task.id} position={[x, y, 0.09]}>
              <mesh>
                <boxGeometry args={[0.92, 0.24, 0.025]} />
                <meshStandardMaterial color="#06111e" emissive={taskStatusTone(task.status)} emissiveIntensity={0.35} transparent opacity={0.8} />
              </mesh>
              <Text position={[0, 0.02, 0.03]} fontSize={0.045} color="#ffffff" anchorX="center" maxWidth={0.8}>
                {task.priority} {task.owner.toUpperCase()} // {task.title}
              </Text>
            </group>
          );
        })}
      </HologramPanel>
      <ZoneBeacon zone={METAVERSE_ZONES.find((zone) => zone.id === "task-nexus")!} onInteract={onInteract} />
    </group>
  );
}

function RoadmapSpire({ onInteract }: { onInteract: () => void }) {
  return (
    <group position={[0, 0, -7.25]} onClick={(event) => { event.stopPropagation(); onInteract(); }}>
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[0.16, 0.22, 3.7, 24]} />
        <meshStandardMaterial color="#02040b" emissive="#00f5ff" emissiveIntensity={0.72} transparent opacity={0.82} toneMapped={false} />
      </mesh>
      {ROADMAP.slice(0, 6).map((phase, index) => {
        const y = 0.5 + index * 0.56;
        const accent = phase.status === "complete" ? "#67ffb5" : phase.status === "active" ? "#ffb341" : "#7a5bff";
        return (
          <group key={phase.id} position={[0, y, 0]}>
            <mesh>
              <torusGeometry args={[0.58 + index * 0.08, 0.014, 8, 72]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.4} toneMapped={false} />
            </mesh>
            <Text position={[1.25, 0.03, 0]} rotation={[0, 0, 0]} fontSize={0.105} color={accent} anchorX="left" maxWidth={2.7}>
              {phase.name}
            </Text>
          </group>
        );
      })}
      <Text position={[0, 4.08, 0]} fontSize={0.16} color="#00f5ff" anchorX="center">
        ROADMAP SPIRE
      </Text>
      <ZoneBeacon zone={METAVERSE_ZONES.find((zone) => zone.id === "roadmap-spire")!} onInteract={onInteract} />
    </group>
  );
}

function AssetVault({ onInteract }: { onInteract: () => void }) {
  return (
    <group position={[-7.9, 1.75, -5.0]} rotation={[0, Math.PI / 4, 0]}>
      <HologramPanel width={3.2} height={2.7} accent="#7a5bff" title="ASSET VAULT" subtitle="wireframes / brand renders / prototypes" onInteract={onInteract}>
        {PROTOTYPES.slice(0, 6).map((prototype, index) => (
          <group key={prototype.slug} position={[-1.1 + (index % 3) * 1.1, 0.45 - Math.floor(index / 3) * 0.72, 0.09]}>
            <mesh>
              <boxGeometry args={[0.78, 0.48, 0.025]} />
              <meshStandardMaterial color="#060816" emissive={prototype.status === "active" ? "#67ffb5" : "#7a5bff"} emissiveIntensity={0.42} transparent opacity={0.78} />
            </mesh>
            <Text position={[0, 0.05, 0.03]} fontSize={0.055} color="#ffffff" anchorX="center" maxWidth={0.66}>
              {prototype.version.toUpperCase()}
            </Text>
            <Text position={[0, -0.12, 0.03]} fontSize={0.035} color="#b8c7ff" anchorX="center" maxWidth={0.66}>
              {prototype.status}
            </Text>
          </group>
        ))}
      </HologramPanel>
      <ZoneBeacon zone={METAVERSE_ZONES.find((zone) => zone.id === "asset-vault")!} onInteract={onInteract} />
    </group>
  );
}

function BuildStatusWall({ onInteract }: { onInteract: () => void }) {
  return (
    <group position={[8.18, 1.85, 0.8]} rotation={[0, -Math.PI / 2, 0]}>
      <HologramPanel width={3.25} height={3.1} accent="#ff2a4d" title="BUILD STATUS WALL" subtitle={OPENCLAW_NODE.label} onInteract={onInteract}>
        {STATUS.signals.slice(0, 6).map((signal, index) => (
          <group key={signal.label} position={[-1.1 + (index % 2) * 2.2, 0.78 - Math.floor(index / 2) * 0.54, 0.08]}>
            <mesh>
              <boxGeometry args={[0.96, 0.32, 0.025]} />
              <meshStandardMaterial color="#080711" emissive={signal.state === "green" ? "#67ffb5" : signal.state === "amber" ? "#ffb341" : "#ff2a4d"} emissiveIntensity={0.36} transparent opacity={0.8} />
            </mesh>
            <Text position={[0, 0.04, 0.03]} fontSize={0.045} color="#ffffff" anchorX="center" maxWidth={0.84}>
              {signal.label}
            </Text>
            <Text position={[0, -0.08, 0.03]} fontSize={0.035} color="#cbd5e1" anchorX="center" maxWidth={0.84}>
              {signal.state.toUpperCase()}
            </Text>
          </group>
        ))}
      </HologramPanel>
      <ZoneBeacon zone={METAVERSE_ZONES.find((zone) => zone.id === "build-status")!} onInteract={onInteract} />
    </group>
  );
}

function MarketRoom({ onInteract }: { onInteract: () => void }) {
  return (
    <group position={[7.2, 1.7, 4.85]} rotation={[0, -Math.PI * 0.68, 0]}>
      <HologramPanel width={2.9} height={2.2} accent="#ffb341" title="MARKET ROOM" subtitle="S1LKROAD commodities" onInteract={onInteract}>
        {COMMODITIES.slice(0, 8).map((commodity, index) => (
          <group key={commodity.slug} position={[-1.06 + (index % 4) * 0.7, 0.45 - Math.floor(index / 4) * 0.62, 0.08]}>
            <mesh>
              <boxGeometry args={[0.48, 0.28, 0.02]} />
              <meshStandardMaterial color="#070b12" emissive={commodity.accent} emissiveIntensity={0.42} transparent opacity={0.82} />
            </mesh>
            <Text position={[0, 0.015, 0.025]} fontSize={0.043} color="#ffffff" anchorX="center" maxWidth={0.42}>
              {commodity.ticker}
            </Text>
          </group>
        ))}
      </HologramPanel>
      <ZoneBeacon zone={METAVERSE_ZONES.find((zone) => zone.id === "market-room")!} onInteract={onInteract} />
    </group>
  );
}

function CinemaRoom({ onInteract }: { onInteract: () => void }) {
  return (
    <group position={[-7.25, 1.7, 4.85]} rotation={[0, Math.PI * 0.68, 0]}>
      <HologramPanel width={2.9} height={2.2} accent="#7a5bff" title="CINEMA ROOM" subtitle="boot reels / trailers / council cuts" onInteract={onInteract}>
        <mesh position={[0, 0.05, 0.08]}>
          <boxGeometry args={[1.9, 0.96, 0.04]} />
          <meshStandardMaterial color="#050816" emissive="#7a5bff" emissiveIntensity={0.58} transparent opacity={0.82} />
        </mesh>
        <Text position={[0, 0.18, 0.13]} fontSize={0.12} color="#ffffff" anchorX="center" maxWidth={1.6}>
          PHASE B OFFICE FLYTHROUGH
        </Text>
        <Text position={[0, -0.06, 0.13]} fontSize={0.065} color="#cbd5e1" anchorX="center" maxWidth={1.6}>
          queued for Reel and Jax Cipher
        </Text>
      </HologramPanel>
      <ZoneBeacon zone={METAVERSE_ZONES.find((zone) => zone.id === "cinema-room")!} onInteract={onInteract} />
    </group>
  );
}

function GameHud({
  founder,
  proximity,
  onOpenNearest,
  onExit,
}: {
  founder: FounderProfile;
  proximity: ProximityState;
  onOpenNearest: () => void;
  onExit: () => void;
}) {
  const nearbyAgent = METAVERSE_AGENTS.find((agent) => agent.slug === proximity.agentSlug);
  const nearbyZone = METAVERSE_ZONES.find((zone) => zone.id === proximity.zoneId);

  return (
    <>
      <div className="pointer-events-none absolute left-5 top-5 z-30 w-[min(390px,calc(100vw-40px))] border border-white/14 bg-[#02040b]/74 p-4 text-white shadow-[0_0_50px_rgba(0,245,255,0.14)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: founder.accent }}>
              active operator
            </p>
            <h2 className="mt-1 text-xl font-semibold uppercase tracking-[0.14em]">{founder.name}</h2>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">{founder.title}</p>
          </div>
          <div className="text-right text-[10px] uppercase tracking-[0.2em] text-[#67ffb5]">
            {METAVERSE_AGENTS.length} agents live
            <br />
            {OPENCLAW_NODE.id} partial
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.14em] text-white/62">
          <span className="border border-[#00f5ff]/20 bg-[#00f5ff]/10 px-2 py-2">Task Nexus</span>
          <span className="border border-[#ff2a4d]/20 bg-[#ff2a4d]/10 px-2 py-2">Build Wall</span>
          <span className="border border-[#7a5bff]/20 bg-[#7a5bff]/10 px-2 py-2">Asset Vault</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="absolute right-5 top-5 z-40 border border-white/16 bg-[#02040b]/70 px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-xl transition hover:border-[#ff2a4d]/70 hover:text-white"
      >
        character select
      </button>

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 w-[min(720px,calc(100vw-40px))] -translate-x-1/2">
        <div className="border border-white/14 bg-[#02040b]/74 p-4 text-center shadow-[0_0_48px_rgba(0,245,255,0.12)] backdrop-blur-xl">
          {nearbyAgent || nearbyZone ? (
            <>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#67ffb5]">interaction range</p>
              <button
                type="button"
                onClick={onOpenNearest}
                className="pointer-events-auto mt-2 text-sm uppercase tracking-[0.18em] text-white"
              >
                Press E or click to open {nearbyAgent?.name ?? nearbyZone?.title}
              </button>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/58">{KEYBOARD_HELP}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/38">
                Walk to an agent, wall monitor, Task Nexus, Roadmap Spire, Market Room, or Cinema Room.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function InteractionModal({
  founder,
  target,
  agent,
  zone,
  notes,
  onClose,
  onSaveDirective,
}: {
  founder: FounderProfile;
  target: Exclude<InteractionTarget, null>;
  agent: MetaverseAgent | null;
  zone: MetaverseZone | null;
  notes: DirectiveNote[];
  onClose: () => void;
  onSaveDirective: (targetId: string, message: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const title = agent?.name ?? zone?.title ?? "Unknown Signal";
  const subtitle = agent?.role ?? zone?.label ?? "Council Interface";
  const accent = agent?.accent ?? zone?.accent ?? "#00f5ff";

  return (
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[2147483647] flex items-center justify-center bg-[#02030a]/70 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", damping: 24, stiffness: 210 }}
        className="max-h-[92vh] w-[min(1080px,96vw)] overflow-hidden border bg-[#030611]/94 shadow-[0_0_80px_rgba(0,245,255,0.2)]"
        style={{ borderColor: `${accent}88` }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid max-h-[92vh] overflow-y-auto lg:grid-cols-[360px_1fr]">
          <aside className="relative min-h-[360px] border-b border-white/10 bg-[#02040b] lg:border-b-0 lg:border-r">
            <Canvas camera={{ position: [0, 2.1, 5], fov: 42 }} dpr={[1, 1.5]}>
              <ambientLight intensity={1.1} />
              <directionalLight position={[2, 4, 4]} intensity={2.2} />
              <pointLight position={[-2, 2, 1.5]} color={accent} intensity={4} />
              {agent ? (
                <group position={[0, -0.8, 0]}>
                  <ProceduralHumanoid
                    accent={agent.accent}
                    secondary={agent.secondary}
                    variant={METAVERSE_AGENTS.findIndex((item) => item.slug === agent.slug) + 4}
                    behavior={agent.behavior}
                    scale={1.18}
                  />
                  <ShardOrbit accent={agent.accent} secondary={agent.secondary} radius={1.25} count={8} />
                </group>
              ) : (
                <group position={[0, -0.2, 0]}>
                  <mesh>
                    <octahedronGeometry args={[1.1, 1]} />
                    <meshStandardMaterial color="#02040b" emissive={accent} emissiveIntensity={1.4} transparent opacity={0.72} />
                  </mesh>
                  <ShardOrbit accent={accent} secondary="#ffffff" radius={1.65} count={10} />
                </group>
              )}
              <EffectComposer>
                <Bloom intensity={1.25} luminanceThreshold={0.12} luminanceSmoothing={0.55} mipmapBlur />
              </EffectComposer>
            </Canvas>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#02040b] via-[#02040b]/82 to-transparent p-5">
              <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: accent }}>
                {target.kind === "agent" ? "live agent feed" : "interactive zone"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold uppercase tracking-[0.13em] text-white">{title}</h2>
              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">{subtitle}</p>
            </div>
          </aside>

          <section className="p-5 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: accent }}>
                  {founder.name} interface
                </p>
                <h3 className="mt-2 text-2xl font-semibold uppercase tracking-[0.12em] text-white">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="border border-white/16 px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-white/50 hover:text-white"
              >
                close
              </button>
            </div>

            {agent ? <AgentModalContent agent={agent} /> : zone ? <ZoneModalContent zone={zone} /> : null}

            <div className="mt-6 border border-white/10 bg-white/[0.03] p-4">
              <label className="text-[10px] uppercase tracking-[0.28em]" style={{ color: accent }}>
                attach note / send directive
              </label>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Send ${title} a directive...`}
                className="mt-3 min-h-28 w-full resize-none border border-white/12 bg-[#02040b]/80 p-3 text-sm leading-6 text-white outline-none placeholder:text-white/28 focus:border-white/40"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/42">
                  Saves locally and mirrors through /api/office/messages when available.
                </p>
                <button
                  type="button"
                  disabled={sending || !draft.trim()}
                  onClick={async () => {
                    setSending(true);
                    await onSaveDirective(target.id, draft);
                    setDraft("");
                    setSending(false);
                  }}
                  className="border px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ borderColor: accent, background: `${accent}22` }}
                >
                  {sending ? "syncing" : "sync directive"}
                </button>
              </div>
            </div>

            {notes.length > 0 && (
              <div className="mt-5 grid gap-2">
                {notes.slice(0, 4).map((note) => (
                  <div key={note.id} className="border border-white/10 bg-white/[0.025] p-3">
                    <div className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
                      {note.from} // {new Date(note.createdAt).toLocaleString()}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/72">{note.message}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AgentModalContent({ agent }: { agent: MetaverseAgent }) {
  const tasks = tasksForAgent(agent, TASKS);

  return (
    <div className="mt-6 grid gap-4">
      <p className="text-sm leading-7 text-white/72">{agent.description}</p>
      <p className="text-sm leading-7 text-white/62">Visual identity: {agent.visual}</p>
      <p className="text-sm leading-7 text-white/62">Live behavior: {agent.special}</p>
      <div className="grid gap-3 md:grid-cols-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em]">
                <span style={{ color: taskStatusTone(task.status) }}>{task.priority}</span>
                <span className="text-white/45">{task.status}</span>
              </div>
              <h4 className="mt-2 text-sm font-semibold leading-5 text-white">{task.title}</h4>
              <p className="mt-2 text-xs uppercase tracking-[0.14em] text-white/42">{task.estimate}</p>
            </div>
          ))
        ) : (
          <div className="border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-white/60">
            No live task mapped yet. Use the directive box to assign the next piece of work.
          </div>
        )}
      </div>
    </div>
  );
}

function ZoneModalContent({ zone }: { zone: MetaverseZone }) {
  if (zone.kind === "tasks") {
    const humanTasks = TASKS.filter((task) => ["ghost", "zoro"].includes(task.owner)).slice(0, 18);
    return (
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {humanTasks.map((task) => (
          <div key={task.id} className="border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.16em]">
              <span style={{ color: taskStatusTone(task.status) }}>{task.priority} // {task.owner}</span>
              <span className="text-white/45">{task.status}</span>
            </div>
            <h4 className="mt-2 text-sm font-semibold leading-5 text-white">{task.title}</h4>
            <p className="mt-2 text-xs leading-5 text-white/58">{task.acceptanceCriteria[0]}</p>
          </div>
        ))}
      </div>
    );
  }

  if (zone.kind === "roadmap") {
    return (
      <div className="mt-6 grid gap-3">
        {ROADMAP.map((phase) => (
          <div key={phase.id} className="border border-white/10 bg-white/[0.03] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">{phase.name}</h4>
              <span className="text-[10px] uppercase tracking-[0.16em] text-white/45">{phase.status} // {phase.dates}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/62">{phase.summary}</p>
          </div>
        ))}
      </div>
    );
  }

  if (zone.kind === "assets") {
    return (
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {PROTOTYPES.map((prototype) => (
          <div key={prototype.slug} className="border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{prototype.version} // {prototype.status}</p>
            <h4 className="mt-2 text-sm font-semibold text-white">{prototype.title}</h4>
            <p className="mt-2 text-xs leading-5 text-white/60">{prototype.summary}</p>
          </div>
        ))}
      </div>
    );
  }

  if (zone.kind === "market") {
    return (
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {COMMODITIES.map((commodity) => (
          <div key={commodity.slug} className="border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: commodity.accent }}>{commodity.ticker} // {commodity.heatBand}</p>
            <h4 className="mt-2 text-sm font-semibold text-white">{commodity.name}</h4>
            <p className="mt-2 text-xs leading-5 text-white/60">{commodity.narrative}</p>
          </div>
        ))}
      </div>
    );
  }

  if (zone.kind === "build") {
    return (
      <div className="mt-6 grid gap-3">
        <div className="border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#67ffb5]">{OPENCLAW_NODE.label}</p>
          <p className="mt-2 text-sm leading-6 text-white/62">{OPENCLAW_NODE.ssh} // {OPENCLAW_NODE.note}</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {OPENCLAW_AGENT_STATUS.map((agent) => (
            <div key={agent.slug} className="border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#00f5ff]">{agent.name} // {agent.state}</p>
              <h4 className="mt-2 text-sm font-semibold text-white">{agent.role}</h4>
              <p className="mt-2 text-xs leading-5 text-white/60">{agent.responsibilities.join(" / ")}</p>
            </div>
          ))}
        </div>
        {STATUS.signals.map((signal) => (
          <div key={signal.label} className="border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/45">{signal.label} // {signal.state}</p>
            <p className="mt-2 text-sm leading-6 text-white/62">{signal.detail}</p>
          </div>
        ))}
      </div>
    );
  }

  if (zone.kind === "cinema") {
    return (
      <div className="mt-6 grid gap-3">
        {[
          "Welcome to the Lab",
          "AI Council Systems Reel",
          "Phase B Office Flythrough",
          "CyberTrader v6 First Playable Slice",
        ].map((title, index) => (
          <div key={title} className="border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#7a5bff]">reel {index + 1} // queued</p>
            <h4 className="mt-2 text-sm font-semibold text-white">{title}</h4>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm leading-7 text-white/70">{zone.summary}</p>
      <p className="mt-3 text-sm leading-7 text-white/62">{STATUS.headline}</p>
    </div>
  );
}
