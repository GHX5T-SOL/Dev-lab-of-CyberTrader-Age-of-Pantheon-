"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import clsx from "clsx";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls, Sparkles, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { GLBModel } from "@/components/three/GLBModel";
import { NeonSkyline } from "@/components/three/NeonSkyline";
import { PALETTE_TOKENS, MOTION_RULES } from "@/data/brand";
import { BIBLE_INTRO } from "@/data/bible";
import { COMMODITIES } from "@/data/commodities";
import {
  FOUNDER_SPAWNS,
  OFFICE_BLOCKERS,
  OFFICE_BOUNDS,
  OFFICE_DISTRICTS,
  OFFICE_HOTSPOTS,
  OFFICE_PATROLS,
  OFFICE_PROP_LAYOUT,
  type FounderSlug,
  type OfficeHotspot,
  type OfficeHotspotId,
} from "@/data/officeGame";
import { OPENCLAW_AGENT_STATUS, OPENCLAW_NODE } from "@/data/openclaw";
import { PERFORMERS, type PerformerSpec } from "@/data/performers";
import { ROADMAP } from "@/data/roadmap";
import { STATUS } from "@/data/status";
import { TASKS, type Task } from "@/data/tasks";
import { TEAM } from "@/data/team";
import { PROTOTYPES } from "@/data/wireframes";
import type { OfficeMessage, OfficeStatePayload } from "@/lib/officeState";
import { AnimatedOfficeAvatar, type OfficeAnimationState } from "./AnimatedOfficeAvatar";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

type GraphicsPreset = "cinematic" | "balanced" | "performance";

const REEL_QUEUE = [
  {
    id: "welcome",
    title: "Welcome to the Lab",
    owner: "Ghost",
    status: "ready",
  },
  {
    id: "council",
    title: "AI Council Systems Reel",
    owner: "Compass",
    status: "queued",
  },
  {
    id: "phase-b",
    title: "Phase B Office Flythrough",
    owner: "Reel",
    status: "rendering",
  },
] as const;

interface PlayerSample {
  position: THREE.Vector3;
  moving: boolean;
}

function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      // ignore private mode / parse issues
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function formatUsd(value: number | undefined) {
  if (typeof value !== "number") return "n/a";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapAngle(value: number) {
  while (value > Math.PI) value -= Math.PI * 2;
  while (value < -Math.PI) value += Math.PI * 2;
  return value;
}

function lerpAngle(from: number, to: number, t: number) {
  return from + wrapAngle(to - from) * t;
}

function resolveBlockedMovement(candidate: THREE.Vector3) {
  const resolved = candidate.clone();
  resolved.x = clamp(resolved.x, OFFICE_BOUNDS.minX, OFFICE_BOUNDS.maxX);
  resolved.z = clamp(resolved.z, OFFICE_BOUNDS.minZ, OFFICE_BOUNDS.maxZ);

  for (const blocker of OFFICE_BLOCKERS) {
    if (
      resolved.x > blocker.minX &&
      resolved.x < blocker.maxX &&
      resolved.z > blocker.minZ &&
      resolved.z < blocker.maxZ
    ) {
      const left = Math.abs(resolved.x - blocker.minX);
      const right = Math.abs(blocker.maxX - resolved.x);
      const top = Math.abs(resolved.z - blocker.minZ);
      const bottom = Math.abs(blocker.maxZ - resolved.z);
      const minEdge = Math.min(left, right, top, bottom);

      if (minEdge === left) resolved.x = blocker.minX - 0.08;
      else if (minEdge === right) resolved.x = blocker.maxX + 0.08;
      else if (minEdge === top) resolved.z = blocker.minZ - 0.08;
      else resolved.z = blocker.maxZ + 0.08;
    }
  }

  return resolved;
}

function founderLabel(founder: FounderSlug | null) {
  return founder === "zoro" ? "Zoro" : "Ghost";
}

export default function OfficeRuntime() {
  const [selectedFounder, setSelectedFounder] = usePersistentState<FounderSlug | null>(
    "devlab.game-founder",
    null,
  );
  const [graphicsPreset, setGraphicsPreset] = usePersistentState<GraphicsPreset>(
    "devlab.graphics-preset",
    "balanced",
  );
  const [mobileObserver, setMobileObserver] = usePersistentState<boolean>(
    "devlab.mobile-observer",
    false,
  );
  const [nearbyHotspotId, setNearbyHotspotId] = useState<OfficeHotspotId | null>(null);
  const [nearbyActorSlug, setNearbyActorSlug] = useState<string | null>(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<OfficeHotspotId | null>(null);
  const [hoveredActorSlug, setHoveredActorSlug] = useState<string | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<OfficeHotspotId | null>(null);
  const [activeActorSlug, setActiveActorSlug] = useState<string | null>(null);
  const [officeState, setOfficeState] = useState<OfficeStatePayload | null>(null);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [sendingNote, setSendingNote] = useState(false);

  const founderOptions = useMemo(
    () => TEAM.filter((member) => member.kind === "founder") as Array<(typeof TEAM)[number] & { slug: FounderSlug }>,
    [],
  );

  const playerTasks = useMemo(
    () => TASKS.filter((task) => task.owner === selectedFounder && task.status !== "done"),
    [selectedFounder],
  );

  const founderMember = useMemo(
    () => TEAM.find((member) => member.slug === selectedFounder) ?? null,
    [selectedFounder],
  );
  const founderPerformer = useMemo(
    () => PERFORMERS.find((performer) => performer.slug === selectedFounder) ?? null,
    [selectedFounder],
  );
  const activeHotspot = useMemo(
    () => OFFICE_HOTSPOTS.find((hotspot) => hotspot.id === activeHotspotId) ?? null,
    [activeHotspotId],
  );
  const activeActor = useMemo(
    () => TEAM.find((member) => member.slug === activeActorSlug) ?? null,
    [activeActorSlug],
  );
  const activeActorPerformer = useMemo(
    () => PERFORMERS.find((performer) => performer.slug === activeActorSlug) ?? null,
    [activeActorSlug],
  );
  const activeMessages = useMemo(
    () => officeState?.messages.filter((message) => message.to === activeActorSlug).slice(0, 8) ?? [],
    [activeActorSlug, officeState?.messages],
  );

  const refreshOfficeState = useCallback(async () => {
    try {
      const response = await fetch("/api/office/state", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`state_http_${response.status}`);
      }
      const payload = (await response.json()) as OfficeStatePayload;
      setOfficeState(payload);
      setFeedError(null);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "office_state_failed";
      setFeedError(detail);
    }
  }, []);

  useEffect(() => {
    void refreshOfficeState();
    const timer = window.setInterval(() => {
      void refreshOfficeState();
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [refreshOfficeState]);

  useEffect(() => {
    if (!selectedFounder) return;
    void fetch("/api/office/preferences", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        player: selectedFounder,
        founder: selectedFounder,
        graphicsPreset,
        mobileObserver,
      }),
    }).catch(() => undefined);
  }, [graphicsPreset, mobileObserver, selectedFounder]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      setMobileObserver(true);
    }
  }, [setMobileObserver]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!selectedFounder) {
        if (event.key === "1") setSelectedFounder("ghost");
        if (event.key === "2") setSelectedFounder("zoro");
        return;
      }

      if (event.key === "Escape") {
        setActiveHotspotId(null);
        setActiveActorSlug(null);
      }

      if (event.key.toLowerCase() === "e") {
        if (nearbyActorSlug) {
          setActiveActorSlug(nearbyActorSlug);
          setActiveHotspotId(null);
        } else if (nearbyHotspotId) {
          setActiveHotspotId(nearbyHotspotId);
          setActiveActorSlug(null);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nearbyActorSlug, nearbyHotspotId, selectedFounder, setSelectedFounder]);

  async function lockOffice() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/gate";
  }

  async function sendAgentNote(message: string) {
    if (!selectedFounder || !activeActorSlug || !message.trim()) return;
    setSendingNote(true);
    try {
      await fetch("/api/office/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          from: selectedFounder,
          to: activeActorSlug,
          message,
        }),
      });
      await refreshOfficeState();
    } finally {
      setSendingNote(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020409] text-chrome">
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, graphicsPreset === "cinematic" ? 1.8 : 1.45]}
          gl={{ antialias: true }}
          camera={{ position: [0, 2.6, 9.5], fov: 48, near: 0.1, far: 120 }}
        >
          <Suspense fallback={null}>
            {!selectedFounder ? (
              <SelectionWorld />
            ) : (
              <OfficeWorld
                founder={selectedFounder}
                graphicsPreset={graphicsPreset}
                mobileObserver={mobileObserver}
                onHoverActorChange={setHoveredActorSlug}
                onHoverHotspotChange={setHoveredHotspotId}
                onNearbyActorChange={setNearbyActorSlug}
                onNearbyHotspotChange={setNearbyHotspotId}
                onActivateActor={(slug) => {
                  setActiveActorSlug(slug);
                  setActiveHotspotId(null);
                }}
                onActivateHotspot={(id) => {
                  setActiveHotspotId(id);
                  setActiveActorSlug(null);
                }}
                paused={Boolean(activeActorSlug || activeHotspotId)}
              />
            )}
          </Suspense>
        </Canvas>
      </div>

      {!selectedFounder ? (
        <CharacterSelectOverlay
          founderOptions={founderOptions}
          onPick={(slug) => {
            setSelectedFounder(slug);
            setActiveActorSlug(null);
            setActiveHotspotId(null);
          }}
          mobileObserver={mobileObserver}
          onToggleMobileObserver={() => setMobileObserver((value) => !value)}
        />
      ) : (
        <>
          <HudCluster
            founder={founderMember}
            founderPerformer={founderPerformer}
            graphicsPreset={graphicsPreset}
            onGraphicsPresetChange={setGraphicsPreset}
            onSwapFounder={() => setSelectedFounder(null)}
            onLock={lockOffice}
            officeState={officeState}
            tasks={playerTasks}
            mobileObserver={mobileObserver}
          />
          <PromptStrip
            hotspot={hoveredHotspotId ? OFFICE_HOTSPOTS.find((item) => item.id === hoveredHotspotId) ?? null : OFFICE_HOTSPOTS.find((item) => item.id === nearbyHotspotId) ?? null}
            actor={hoveredActorSlug ? TEAM.find((member) => member.slug === hoveredActorSlug) ?? null : TEAM.find((member) => member.slug === nearbyActorSlug) ?? null}
          />
          {mobileObserver && (
            <MobileJumpBar
              active={activeHotspotId}
              onJump={(id) => {
                setActiveHotspotId(id);
                setActiveActorSlug(null);
              }}
            />
          )}
        </>
      )}

      {selectedFounder && activeHotspot && (
        <HotspotPanel
          hotspot={activeHotspot}
          officeState={officeState}
          onClose={() => setActiveHotspotId(null)}
        />
      )}

      {selectedFounder && activeActor && activeActorPerformer && (
        <AgentConsole
          actor={activeActor}
          performer={activeActorPerformer}
          messages={activeMessages}
          tasks={TASKS.filter((task) => task.owner === activeActor.slug).slice(0, 6)}
          onClose={() => setActiveActorSlug(null)}
          onSend={sendAgentNote}
          sending={sendingNote}
        />
      )}

      {feedError && (
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-md border border-heat/35 bg-void/80 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-heat">
          office feed degraded · {feedError}
        </div>
      )}
    </div>
  );
}

function CharacterSelectOverlay({
  founderOptions,
  onPick,
  mobileObserver,
  onToggleMobileObserver,
}: {
  founderOptions: Array<(typeof TEAM)[number] & { slug: FounderSlug }>;
  onPick: (slug: FounderSlug) => void;
  mobileObserver: boolean;
  onToggleMobileObserver: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-black/15 via-transparent to-black/70 p-6 md:items-center">
      <div className="grid w-full max-w-6xl gap-4 md:grid-cols-[1.25fr_1fr]">
        <section className="border border-cyan/15 bg-[#071018]/72 p-5 backdrop-blur-xl">
          <div className="mb-3 text-[11px] uppercase tracking-[0.34em] text-cyan">
            cybertrader // founder selection
          </div>
          <h1 className="max-w-2xl text-3xl uppercase tracking-[0.12em] text-chrome md:text-5xl">
            Enter The Dev Lab
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-dust md:text-base">
            This route is now the office itself. Pick Ghost or Zoro, spawn into the penthouse,
            walk the floor with WASD or arrows, inspect terminals, and brief the AI council from
            inside the world.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {founderOptions.map((founder, index) => (
              <button
                key={founder.slug}
                onClick={() => onPick(founder.slug)}
                className="group border border-white/10 bg-black/25 p-4 text-left transition hover:border-cyan/40 hover:bg-cyan/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-dust">P{index + 1}</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-cyan">enter lab</span>
                </div>
                <div className="mt-4 text-2xl uppercase tracking-[0.18em] text-chrome">{founder.name}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-cyan">{founder.role}</div>
                <p className="mt-3 text-sm leading-6 text-dust">{founder.description}</p>
              </button>
            ))}
          </div>
        </section>

        <aside className="border border-violet/20 bg-[#07090f]/72 p-5 backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-[0.3em] text-violet">live floor</div>
          <div className="mt-3 space-y-3 text-sm text-dust">
            <p>14 operators active in-world, including Zara and Zyra on <span className="text-violet">{OPENCLAW_NODE.id}</span>.</p>
            <p>Districts are grouped as Command Deck, Signal Wall, Market Lane, Creative Vault, and Node Core.</p>
            <p>The HUD stays light; the readable surfaces live in the world and open only when you approach or focus them.</p>
          </div>
          <button
            onClick={onToggleMobileObserver}
            className={clsx(
              "mt-6 w-full border px-4 py-3 text-left text-[11px] uppercase tracking-[0.24em]",
              mobileObserver
                ? "border-acid bg-acid/10 text-acid"
                : "border-white/12 bg-black/25 text-dust",
            )}
          >
            {mobileObserver ? "mobile observer mode enabled" : "enable mobile observer mode"}
          </button>
          <div className="mt-6 space-y-2 text-[10px] uppercase tracking-[0.18em] text-dust">
            <div>`1` Ghost</div>
            <div>`2` Zoro</div>
            <div>`WASD` move</div>
            <div>`Mouse` orbit / hover</div>
            <div>`E` focus nearby surface</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function HudCluster({
  founder,
  founderPerformer,
  officeState,
  tasks,
  graphicsPreset,
  onGraphicsPresetChange,
  onSwapFounder,
  onLock,
  mobileObserver,
}: {
  founder: (typeof TEAM)[number] | null;
  founderPerformer: PerformerSpec | null;
  officeState: OfficeStatePayload | null;
  tasks: Task[];
  graphicsPreset: GraphicsPreset;
  onGraphicsPresetChange: (preset: GraphicsPreset) => void;
  onSwapFounder: () => void;
  onLock: () => void;
  mobileObserver: boolean;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4">
      <div className="pointer-events-auto max-w-[420px] border border-cyan/18 bg-[#060b10]/80 p-4 shadow-[0_0_40px_rgba(0,245,255,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-acid shadow-[0_0_18px_rgba(103,255,181,0.75)]" />
          <div className="text-[10px] uppercase tracking-[0.28em] text-cyan">
            phase b · office runtime live
          </div>
        </div>
        <div className="mt-3 text-2xl uppercase tracking-[0.14em] text-chrome">{founder?.name}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.24em] text-dust">
          {founder?.role} · {mobileObserver ? "observer mode" : "free roam"}
        </div>
        <p className="mt-3 text-sm leading-6 text-dust">{founderPerformer?.signatureLine ?? founder?.description}</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-[10px] uppercase tracking-[0.2em]">
          <Metric label="open tasks" value={String(tasks.length)} accent="#00F5FF" />
          <Metric
            label="24h burn"
            value={formatUsd(officeState?.spend?.totals.usdSpent24h)}
            accent="#FF2A4D"
          />
          <Metric label="node" value={OPENCLAW_NODE.id} accent="#7A5BFF" />
        </div>
      </div>

      <div className="pointer-events-auto flex flex-col gap-3">
        <div className="border border-white/10 bg-[#06090f]/76 p-3 backdrop-blur-xl">
          <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-dust">graphics</div>
          <div className="flex gap-2">
            {(["cinematic", "balanced", "performance"] as GraphicsPreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => onGraphicsPresetChange(preset)}
                className={clsx(
                  "rounded-sm border px-3 py-2 text-[10px] uppercase tracking-[0.22em]",
                  graphicsPreset === preset
                    ? "border-cyan/45 bg-cyan/10 text-cyan"
                    : "border-white/10 bg-black/20 text-dust",
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-white/10 bg-[#06090f]/76 p-3 backdrop-blur-xl">
          <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-dust">controls</div>
          <div className="space-y-1 text-[10px] uppercase tracking-[0.16em] text-dust">
            <div>move · WASD / arrows</div>
            <div>look · mouse drag</div>
            <div>focus · E / click</div>
            <div>close · esc</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={onSwapFounder}
              className="rounded-sm border border-white/10 bg-black/20 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-dust"
            >
              swap founder
            </button>
            <button
              onClick={onLock}
              className="rounded-sm border border-heat/35 bg-heat/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-heat"
            >
              lock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="border border-white/8 bg-black/18 p-3">
      <div className="text-[9px] uppercase tracking-[0.16em] text-dust">{label}</div>
      <div className="mt-2 text-sm text-chrome" style={{ color: accent }}>
        {value}
      </div>
    </div>
  );
}

function PromptStrip({
  hotspot,
  actor,
}: {
  hotspot: OfficeHotspot | null;
  actor: (typeof TEAM)[number] | null;
}) {
  const content = actor
    ? `${actor.name} · ${actor.role} · click or E to open console`
    : hotspot
      ? `${hotspot.title} · ${hotspot.prompt} · click or E`
      : "walk the floor · inspect surfaces · brief the council";

  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 w-[min(92vw,720px)] -translate-x-1/2 border border-cyan/14 bg-[#04080d]/82 px-4 py-3 text-center text-[11px] uppercase tracking-[0.26em] text-cyan backdrop-blur-xl">
      {content}
    </div>
  );
}

function MobileJumpBar({
  active,
  onJump,
}: {
  active: OfficeHotspotId | null;
  onJump: (id: OfficeHotspotId) => void;
}) {
  return (
    <div className="pointer-events-auto absolute inset-x-3 bottom-20 z-20 flex gap-2 overflow-x-auto border border-violet/18 bg-[#05080d]/84 p-3 backdrop-blur-xl md:hidden">
      {OFFICE_HOTSPOTS.map((hotspot) => (
        <button
          key={hotspot.id}
          onClick={() => onJump(hotspot.id)}
          className={clsx(
            "shrink-0 rounded-sm border px-3 py-2 text-[10px] uppercase tracking-[0.2em]",
            active === hotspot.id
              ? "border-cyan/40 bg-cyan/10 text-cyan"
              : "border-white/10 bg-black/15 text-dust",
          )}
        >
          {hotspot.title}
        </button>
      ))}
    </div>
  );
}

function HotspotPanel({
  hotspot,
  officeState,
  onClose,
}: {
  hotspot: OfficeHotspot;
  officeState: OfficeStatePayload | null;
  onClose: () => void;
}) {
  const [ownerFilter, setOwnerFilter] = useState<"ghost" | "zoro">("ghost");
  const tasks = TASKS.filter((task) => task.owner === ownerFilter && task.status !== "done");

  return (
    <div className="pointer-events-auto absolute right-4 top-4 z-30 w-[min(92vw,560px)] border border-cyan/20 bg-[#060b10]/90 backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-dust">
            {OFFICE_DISTRICTS.find((district) => district.id === hotspot.districtId)?.title}
          </div>
          <div className="mt-1 text-2xl uppercase tracking-[0.12em] text-chrome">{hotspot.title}</div>
        </div>
        <button
          onClick={onClose}
          className="rounded-sm border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-dust"
        >
          close
        </button>
      </div>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
        {hotspot.id === "whiteboard" && (
          <>
            <div className="flex gap-2">
              {(["ghost", "zoro"] as const).map((owner) => (
                <button
                  key={owner}
                  onClick={() => setOwnerFilter(owner)}
                  className={clsx(
                    "rounded-sm border px-3 py-2 text-[10px] uppercase tracking-[0.2em]",
                    ownerFilter === owner
                      ? "border-cyan/45 bg-cyan/10 text-cyan"
                      : "border-white/10 bg-black/15 text-dust",
                  )}
                >
                  {founderLabel(owner)}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="border border-white/8 bg-black/18 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em]">
                    <span className="text-cyan">{task.priority}</span>
                    <span className="text-dust">{task.status}</span>
                    <span className="text-dust">{task.estimate}</span>
                  </div>
                  <div className="mt-2 text-sm uppercase tracking-[0.08em] text-chrome">{task.title}</div>
                  <ul className="mt-3 space-y-1 text-sm text-dust">
                    {task.acceptanceCriteria.slice(0, 3).map((criterion) => (
                      <li key={criterion}>• {criterion}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {hotspot.id === "wireframes" && (
          <div className="grid gap-3 md:grid-cols-2">
            {PROTOTYPES.map((prototype) => (
              <a
                key={prototype.slug}
                href={prototype.demo ?? prototype.repo}
                target="_blank"
                rel="noreferrer"
                className="border border-white/10 bg-black/18 p-4 no-underline transition hover:border-cyan/35"
              >
                <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">{prototype.version}</div>
                <div className="mt-2 text-lg uppercase tracking-[0.08em] text-chrome">{prototype.title}</div>
                <div className="mt-2 text-sm leading-6 text-dust">{prototype.summary}</div>
              </a>
            ))}
          </div>
        )}

        {hotspot.id === "credits" && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Metric label="24h burn" value={formatUsd(officeState?.spend?.totals.usdSpent24h)} accent="#FF2A4D" />
              <Metric label="remaining" value={formatUsd(officeState?.spend?.totals.usdRemaining)} accent="#67FFB5" />
              <Metric label="live probes" value={String(officeState?.spend?.totals.providersLive ?? 0)} accent="#00F5FF" />
            </div>
            <div className="space-y-2">
              {officeState?.spend?.providers.map((provider) => (
                <div key={provider.slug} className="border border-white/8 bg-black/18 p-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                    <span style={{ color: provider.accent }}>{provider.label}</span>
                    <span className={provider.ok ? "text-acid" : "text-heat"}>{provider.ok ? "live" : "degraded"}</span>
                  </div>
                  <div className="mt-2 text-sm text-dust">{provider.note ?? "no provider note"}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hotspot.id === "commodities" && (
          <div className="grid gap-3 md:grid-cols-2">
            {COMMODITIES.map((commodity) => (
              <div key={commodity.slug} className="border border-white/8 bg-black/18 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: commodity.accent }}>
                    {commodity.ticker}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-dust">{commodity.volatility}</div>
                </div>
                <div className="mt-2 text-lg uppercase tracking-[0.08em] text-chrome">{commodity.name}</div>
                <div className="mt-1 text-sm text-dust">{commodity.tagline}</div>
                <div className="mt-3 text-sm leading-6 text-dust">{commodity.narrative}</div>
              </div>
            ))}
          </div>
        )}

        {hotspot.id === "brand" && (
          <div className="space-y-4">
            <div className="border border-white/8 bg-black/18 p-4 text-sm leading-7 text-dust">{BIBLE_INTRO}</div>
            <div className="grid gap-3 md:grid-cols-2">
              {PALETTE_TOKENS.map((token) => (
                <div key={token.name} className="border border-white/8 bg-black/18 p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full border border-white/10" style={{ backgroundColor: token.hex }} />
                    <div className="text-[10px] uppercase tracking-[0.24em] text-chrome">{token.name}</div>
                  </div>
                  <div className="mt-2 text-sm text-dust">{token.role}</div>
                </div>
              ))}
            </div>
            <div className="border border-white/8 bg-black/18 p-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">motion rules</div>
              <ul className="mt-3 space-y-2 text-sm text-dust">
                {MOTION_RULES.map((rule) => (
                  <li key={rule}>• {rule}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {hotspot.id === "cinema" && (
          <div className="space-y-3">
            {REEL_QUEUE.map((reel) => (
              <div key={reel.id} className="border border-white/8 bg-black/18 p-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                  <span className="text-cyan">{reel.owner}</span>
                  <span className="text-dust">{reel.status}</span>
                </div>
                <div className="mt-2 text-lg uppercase tracking-[0.08em] text-chrome">{reel.title}</div>
              </div>
            ))}
          </div>
        )}

        {hotspot.id === "council" && (
          <div className="space-y-3">
            {ROADMAP.map((phase) => (
              <div key={phase.id} className="border border-white/8 bg-black/18 p-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                  <span className="text-cyan">{phase.name}</span>
                  <span className="text-dust">{phase.status}</span>
                </div>
                <div className="mt-2 text-sm leading-6 text-dust">{phase.summary}</div>
              </div>
            ))}
          </div>
        )}

        {hotspot.id === "status" && (
          <div className="space-y-4">
            <div className="border border-white/8 bg-black/18 p-4 text-sm leading-7 text-dust">
              {STATUS.headline}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {STATUS.signals.map((signal) => (
                <div key={signal.label} className="border border-white/8 bg-black/18 p-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em]">
                    <span className={clsx("h-2 w-2 rounded-full", signal.state === "green" ? "bg-acid" : signal.state === "amber" ? "bg-amber" : "bg-heat")} />
                    <span className="text-chrome">{signal.label}</span>
                  </div>
                  <div className="mt-2 text-sm leading-6 text-dust">{signal.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {hotspot.id === "openclaw" && (
          <div className="space-y-3">
            <div className="border border-white/8 bg-black/18 p-4 text-sm leading-6 text-dust">
              {OPENCLAW_NODE.ssh} · {OPENCLAW_NODE.host} · {OPENCLAW_NODE.note}
            </div>
            {OPENCLAW_AGENT_STATUS.map((agent) => (
              <div key={agent.slug} className="border border-white/8 bg-black/18 p-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em]">
                  <span className="text-violet">{agent.name}</span>
                  <span className="text-dust">{agent.state}</span>
                </div>
                <div className="mt-2 text-sm text-dust">{agent.role}</div>
                <ul className="mt-3 space-y-1 text-sm text-dust">
                  {agent.responsibilities.map((responsibility) => (
                    <li key={responsibility}>• {responsibility}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentConsole({
  actor,
  performer,
  tasks,
  messages,
  onClose,
  onSend,
  sending,
}: {
  actor: (typeof TEAM)[number];
  performer: PerformerSpec;
  tasks: Task[];
  messages: OfficeMessage[];
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
  sending: boolean;
}) {
  const [draft, setDraft] = useState("");

  return (
    <div className="pointer-events-auto absolute left-4 top-4 z-30 w-[min(92vw,520px)] border border-violet/20 bg-[#060b10]/92 backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-violet">{actor.codename}</div>
          <div className="mt-1 text-2xl uppercase tracking-[0.12em] text-chrome">{actor.name}</div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-dust">{actor.role}</div>
        </div>
        <button
          onClick={onClose}
          className="rounded-sm border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-dust"
        >
          close
        </button>
      </div>

      <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
        <div className="border border-white/8 bg-black/18 p-4 text-sm leading-7 text-dust">
          {performer.signatureLine}
        </div>

        <section>
          <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">current tasks</div>
          <div className="mt-3 space-y-2">
            {tasks.length === 0 ? (
              <div className="border border-white/8 bg-black/18 p-4 text-sm text-dust">No direct tasks assigned yet.</div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="border border-white/8 bg-black/18 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-violet">{task.priority} · {task.status}</div>
                  <div className="mt-2 text-sm uppercase tracking-[0.06em] text-chrome">{task.title}</div>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">send note / task</div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={4}
            className="mt-3 w-full border border-white/10 bg-black/20 p-3 text-sm text-chrome outline-none"
            placeholder={`Message ${actor.name}...`}
          />
          <button
            onClick={async () => {
              await onSend(draft);
              setDraft("");
            }}
            disabled={sending || !draft.trim()}
            className="mt-3 rounded-sm border border-cyan/35 bg-cyan/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-cyan disabled:opacity-50"
          >
            {sending ? "sending..." : "send to operator"}
          </button>
        </section>

        <section>
          <div className="text-[10px] uppercase tracking-[0.24em] text-cyan">recent notes</div>
          <div className="mt-3 space-y-2">
            {messages.length === 0 ? (
              <div className="border border-white/8 bg-black/18 p-4 text-sm text-dust">No messages on this operator yet.</div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="border border-white/8 bg-black/18 p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-dust">
                    {message.from} · {new Date(message.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-chrome">{message.message}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SelectionWorld() {
  return (
    <>
      <color attach="background" args={["#010307"]} />
      <fog attach="fog" args={["#010307", 10, 34]} />
      <ambientLight intensity={0.35} />
      <spotLight position={[0, 8, 5]} angle={0.3} penumbra={0.45} intensity={80} color="#00F5FF" castShadow />
      <spotLight position={[4.5, 5.5, 2]} angle={0.35} penumbra={0.55} intensity={55} color="#7A5BFF" />
      <spotLight position={[-4.5, 5.5, 2]} angle={0.35} penumbra={0.55} intensity={55} color="#67FFB5" />
      <Sparkles count={120} scale={[14, 7, 14]} size={2.4} speed={0.3} color="#00F5FF" />
      <Stars radius={80} depth={30} count={2000} factor={3.4} fade speed={0.6} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[10, 80]} />
        <meshStandardMaterial color="#03070b" metalness={0.2} roughness={0.22} />
      </mesh>
      <SelectionPedestal position={[-2.8, 0, 0]} accent="#00F5FF" label="Ghost" role="Lead Developer" modelPath="/GLB_Assets/Avatar_ghost.glb" />
      <SelectionPedestal position={[2.8, 0, 0]} accent="#67FFB5" label="Zoro" role="Creative Lead" modelPath="/GLB_Assets/Avatar_zoro.glb" />
      <Text position={[0, 4.4, -2]} fontSize={0.44} color="#E8ECF5" letterSpacing={0.12} anchorX="center">
        CYBERTRADER DEV LAB
      </Text>
      <Text position={[0, 3.78, -2]} fontSize={0.18} color="#00F5FF" letterSpacing={0.18} anchorX="center">
        CHOOSE YOUR FOUNDER // ENTER THE OFFICE
      </Text>
    </>
  );
}

function SelectionPedestal({
  position,
  accent,
  label,
  role,
  modelPath,
}: {
  position: [number, number, number];
  accent: string;
  label: string;
  role: string;
  modelPath: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.05, 1.28, 0.56, 36]} />
        <meshStandardMaterial color="#071018" metalness={0.65} roughness={0.22} emissive={new THREE.Color(accent)} emissiveIntensity={0.14} />
      </mesh>
      <AnimatedOfficeAvatar
        modelPath={modelPath}
        accent={accent}
        label={label}
        role={role}
        scale={1}
        position={[0, 0.58, 0]}
        animationState="talk"
        selected
        distanceFactor={8}
      />
    </group>
  );
}

function OfficeWorld({
  founder,
  graphicsPreset,
  mobileObserver,
  paused,
  onNearbyHotspotChange,
  onNearbyActorChange,
  onHoverHotspotChange,
  onHoverActorChange,
  onActivateHotspot,
  onActivateActor,
}: {
  founder: FounderSlug;
  graphicsPreset: GraphicsPreset;
  mobileObserver: boolean;
  paused: boolean;
  onNearbyHotspotChange: (id: OfficeHotspotId | null) => void;
  onNearbyActorChange: (slug: string | null) => void;
  onHoverHotspotChange: (id: OfficeHotspotId | null) => void;
  onHoverActorChange: (slug: string | null) => void;
  onActivateHotspot: (id: OfficeHotspotId) => void;
  onActivateActor: (slug: string) => void;
}) {
  const actorPositions = useRef<Record<string, THREE.Vector3>>({});
  const playerState = useRef<PlayerSample>({
    position: new THREE.Vector3(...FOUNDER_SPAWNS[founder]),
    moving: false,
  });

  const npcs = useMemo(() => PERFORMERS.filter((performer) => performer.slug !== founder), [founder]);

  return (
    <>
      <color attach="background" args={["#010306"]} />
      <fog attach="fog" args={["#010306", 12, 42]} />
      <EnvironmentLights graphicsPreset={graphicsPreset} />
      <group position={[0, -0.4, -25]} scale={1.7}>
        <NeonSkyline />
      </group>
      <Stars radius={120} depth={40} count={graphicsPreset === "performance" ? 1100 : 2200} factor={3.2} fade />
      <Sparkles count={graphicsPreset === "performance" ? 45 : 120} scale={[20, 8, 20]} size={2.4} speed={0.18} color="#00F5FF" />
      <Suspense fallback={null}>
        {OFFICE_PROP_LAYOUT.map((prop) => (
          <GLBModel
            key={prop.id}
            modelPath={prop.modelPath}
            position={prop.position}
            rotation={prop.rotation}
            scale={prop.scale}
            accent={prop.accent}
            emissiveBoost={prop.emissiveBoost}
            animationName={prop.animationName}
          />
        ))}
      </Suspense>

      <group position={[0, 0, 0]}>
        {OFFICE_HOTSPOTS.map((hotspot) => (
          <HotspotBeacon
            key={hotspot.id}
            hotspot={hotspot}
            playerState={playerState}
            onHoverChange={onHoverHotspotChange}
            onActivate={onActivateHotspot}
          />
        ))}
      </group>

      {npcs.map((performer) => {
        const member = TEAM.find((item) => item.slug === performer.slug)!;
        const patrol = OFFICE_PATROLS[performer.slug];
        return (
          <NpcActor
            key={performer.slug}
            performer={performer}
            member={member}
            patrol={patrol}
            actorPositions={actorPositions}
            playerState={playerState}
            onHoverChange={onHoverActorChange}
            onActivate={onActivateActor}
          />
        );
      })}

      <PlayerController
        founder={founder}
        paused={paused}
        mobileObserver={mobileObserver}
        playerState={playerState}
      />

      <ProximitySystem
        founder={founder}
        actorPositions={actorPositions}
        playerState={playerState}
        onNearbyActorChange={onNearbyActorChange}
        onNearbyHotspotChange={onNearbyHotspotChange}
      />

      <ContactShadows position={[0, 0.02, 0]} blur={2.4} opacity={0.35} scale={24} far={14} />
      {graphicsPreset !== "performance" && (
        <EffectComposer>
          <Bloom luminanceThreshold={0.55} luminanceSmoothing={0.32} intensity={graphicsPreset === "cinematic" ? 0.65 : 0.38} />
        </EffectComposer>
      )}
    </>
  );
}

function EnvironmentLights({ graphicsPreset }: { graphicsPreset: GraphicsPreset }) {
  return (
    <>
      <ambientLight intensity={0.34} />
      <hemisphereLight args={["#0D1927", "#040608", 0.58]} />
      <directionalLight
        castShadow
        position={[4.5, 10, 7]}
        intensity={graphicsPreset === "performance" ? 1.8 : 2.4}
        color="#EAF9FF"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-camera-left={-14}
        shadow-camera-right={14}
      />
      <pointLight position={[-7.2, 3.4, 2.8]} color="#67FFB5" intensity={26} distance={7} />
      <pointLight position={[0, 3.2, -7.8]} color="#00F5FF" intensity={32} distance={8.5} />
      <pointLight position={[7.2, 3.2, 2.4]} color="#FF2A4D" intensity={24} distance={7} />
      <pointLight position={[7.9, 3.4, -4.5]} color="#7A5BFF" intensity={28} distance={7.5} />
      <spotLight position={[-6.7, 5.2, -4.6]} angle={0.46} penumbra={0.48} intensity={20} color="#7A5BFF" />
    </>
  );
}

function PlayerController({
  founder,
  paused,
  mobileObserver,
  playerState,
}: {
  founder: FounderSlug;
  paused: boolean;
  mobileObserver: boolean;
  playerState: MutableRefObject<PlayerSample>;
}) {
  const founderMember = TEAM.find((member) => member.slug === founder)!;
  const founderPerformer = PERFORMERS.find((performer) => performer.slug === founder)!;
  const controlsRef = useRef<any>(null);
  const positionRef = useRef(new THREE.Vector3(...FOUNDER_SPAWNS[founder]));
  const rotationRef = useRef(founder === "ghost" ? Math.PI : Math.PI);
  const animationStateRef = useRef<OfficeAnimationState>("idle");
  const keys = useRef({ up: false, down: false, left: false, right: false });
  const sampleAccumulator = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    positionRef.current.set(...FOUNDER_SPAWNS[founder]);
    rotationRef.current = Math.PI;
    if (controlsRef.current) {
      camera.position.set(0, 2.8, 9.2);
    }
  }, [camera, founder]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent, value: boolean) => {
      const key = event.key.toLowerCase();
      if (key === "w" || key === "arrowup") keys.current.up = value;
      if (key === "s" || key === "arrowdown") keys.current.down = value;
      if (key === "a" || key === "arrowleft") keys.current.left = value;
      if (key === "d" || key === "arrowright") keys.current.right = value;
    };

    const down = (event: KeyboardEvent) => onKey(event, true);
    const up = (event: KeyboardEvent) => onKey(event, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const target = positionRef.current;
    const moveInput = new THREE.Vector3(
      Number(keys.current.right) - Number(keys.current.left),
      0,
      Number(keys.current.down) - Number(keys.current.up),
    );

    let moving = false;
    if (!paused && !mobileObserver && moveInput.lengthSq() > 0) {
      moving = true;
      moveInput.normalize();
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
      const movement = forward.multiplyScalar(-moveInput.z).add(right.multiplyScalar(moveInput.x));
      const nextPosition = resolveBlockedMovement(target.clone().addScaledVector(movement, delta * 2.55));
      target.copy(nextPosition);
      const heading = Math.atan2(movement.x, movement.z);
      rotationRef.current = lerpAngle(rotationRef.current, heading, Math.min(1, delta * 8));
    }
    animationStateRef.current = moving ? "walk" : "idle";

    if (controlsRef.current) {
      const targetLook = new THREE.Vector3(target.x, 1.45, target.z);
      controlsRef.current.target.lerp(targetLook, 0.16);
      controlsRef.current.update();
    }

    sampleAccumulator.current += delta;
    if (sampleAccumulator.current > 0.08) {
      playerState.current = {
        position: target.clone(),
        moving,
      };
      sampleAccumulator.current = 0;
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3.15}
        maxDistance={5.4}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={Math.PI / 3.1}
      />
      <AnimatedOfficeAvatar
        modelPath={founderMember.glbModelPath}
        accent={founderMember.accent}
        label={founderMember.name}
        role={founderMember.role}
        livePositionRef={positionRef}
        liveRotationRef={rotationRef}
        liveAnimationStateRef={animationStateRef}
        scale={founderPerformer.modelScale ?? 1}
        animationState="idle"
        selected
        showLabel={false}
      />
    </>
  );
}

function NpcActor({
  performer,
  member,
  patrol,
  actorPositions,
  playerState,
  onHoverChange,
  onActivate,
}: {
  performer: PerformerSpec;
  member: (typeof TEAM)[number];
  patrol?: { speed: number; waitMs: number; nodes: [number, number, number][] };
  actorPositions: MutableRefObject<Record<string, THREE.Vector3>>;
  playerState: MutableRefObject<PlayerSample>;
  onHoverChange: (slug: string | null) => void;
  onActivate: (slug: string) => void;
}) {
  const position = useRef(new THREE.Vector3(...performer.desk3D.position));
  const rotationY = useRef(performer.desk3D.rotationY);
  const animationStateRef = useRef<OfficeAnimationState>(
    patrol ? "walk" : performer.behavior === "node_watch" ? "talk" : "idle",
  );
  const pathIndex = useRef(0);
  const waitTimer = useRef(0);
  const [isNearby, setIsNearby] = useState(false);

  useFrame((_, delta) => {
    let animationState: OfficeAnimationState = patrol ? "walk" : performer.behavior === "node_watch" ? "talk" : "idle";

    if (patrol && patrol.nodes.length > 1) {
      if (waitTimer.current > 0) {
        waitTimer.current -= delta * 1000;
        animationState = "idle";
      } else {
        const targetNode = patrol.nodes[pathIndex.current]!;
        const target = new THREE.Vector3(...targetNode);
        const direction = target.clone().sub(position.current);
        const distance = direction.length();

        if (distance < 0.08) {
          pathIndex.current = (pathIndex.current + 1) % patrol.nodes.length;
          waitTimer.current = patrol.waitMs;
          animationState = "idle";
        } else {
          direction.normalize();
          position.current.addScaledVector(direction, delta * patrol.speed);
          rotationY.current = lerpAngle(rotationY.current, Math.atan2(direction.x, direction.z), Math.min(1, delta * 6));
          animationState = "walk";
        }
      }
    }

    actorPositions.current[performer.slug] = position.current.clone();
    animationStateRef.current = animationState;
    const nextNearby = playerState.current.position.distanceTo(position.current) < 2.5;
    setIsNearby((current) => (current === nextNearby ? current : nextNearby));
  });

  return (
    <AnimatedOfficeAvatar
      modelPath={performer.glbModelPath}
      accent={member.accent}
      label={member.name}
      role={member.role}
      livePositionRef={position}
      liveRotationRef={rotationY}
      liveAnimationStateRef={animationStateRef}
      scale={performer.modelScale ?? 1}
      animationState="idle"
      selected={isNearby}
      distanceFactor={8}
      onClick={() => {
        if (playerState.current.position.distanceTo(position.current) < 2.5) {
          onActivate(performer.slug);
        }
      }}
      onPointerOver={() => onHoverChange(performer.slug)}
      onPointerOut={() => onHoverChange(null)}
    />
  );
}

function HotspotBeacon({
  hotspot,
  playerState,
  onHoverChange,
  onActivate,
}: {
  hotspot: OfficeHotspot;
  playerState: MutableRefObject<PlayerSample>;
  onHoverChange: (id: OfficeHotspotId | null) => void;
  onActivate: (id: OfficeHotspotId) => void;
}) {
  const [isNear, setIsNear] = useState(false);
  const hotspotVector = useMemo(
    () => new THREE.Vector3(hotspot.position[0], hotspot.position[1], hotspot.position[2]),
    [hotspot.position],
  );

  useFrame(() => {
    const near = playerState.current.position.distanceTo(hotspotVector) < hotspot.interactionRadius + 0.55;
    setIsNear((current) => (current === near ? current : near));
  });

  return (
    <group position={hotspot.position} rotation={[0, hotspot.rotationY, 0]}>
      <mesh
        position={[0, -1.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          if (isNear) onActivate(hotspot.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverChange(hotspot.id);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHoverChange(null);
        }}
      >
        <ringGeometry args={[0.25, 0.4, 40]} />
        <meshBasicMaterial color={hotspot.accent} transparent opacity={isNear ? 0.95 : 0.42} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color={hotspot.accent} emissive={new THREE.Color(hotspot.accent)} emissiveIntensity={1.6} />
      </mesh>

      <Html
        transform
        occlude={false}
        position={[0, 0.65, 0]}
        rotation={[0, 0, 0]}
        distanceFactor={7}
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            border: `1px solid ${hotspot.accent}44`,
            background: "rgba(4, 8, 12, 0.78)",
            boxShadow: `0 0 28px ${hotspot.accent}22`,
            color: hotspot.accent,
            fontFamily: "var(--font-mono, monospace)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "6px 10px",
            borderRadius: 4,
            fontSize: "10px",
            minWidth: "160px",
          }}
        >
          <div>{hotspot.title}</div>
          <div style={{ color: "#8A94A7", fontSize: "8px", marginTop: 4 }}>{hotspot.summary}</div>
        </div>
      </Html>
    </group>
  );
}

function ProximitySystem({
  founder,
  actorPositions,
  playerState,
  onNearbyActorChange,
  onNearbyHotspotChange,
}: {
  founder: FounderSlug;
  actorPositions: MutableRefObject<Record<string, THREE.Vector3>>;
  playerState: MutableRefObject<PlayerSample>;
  onNearbyActorChange: (slug: string | null) => void;
  onNearbyHotspotChange: (id: OfficeHotspotId | null) => void;
}) {
  const lastHotspot = useRef<OfficeHotspotId | null>(null);
  const lastActor = useRef<string | null>(null);

  useFrame(() => {
    const player = playerState.current.position;

    let nearestHotspot: OfficeHotspotId | null = null;
    let nearestHotspotDistance = Number.POSITIVE_INFINITY;
    for (const hotspot of OFFICE_HOTSPOTS) {
      const distance = player.distanceTo(new THREE.Vector3(...hotspot.position));
      if (distance < hotspot.interactionRadius && distance < nearestHotspotDistance) {
        nearestHotspot = hotspot.id;
        nearestHotspotDistance = distance;
      }
    }

    let nearestActor: string | null = null;
    let nearestActorDistance = Number.POSITIVE_INFINITY;
    for (const [slug, position] of Object.entries(actorPositions.current)) {
      if (slug === founder) continue;
      const distance = player.distanceTo(position);
      if (distance < 2.4 && distance < nearestActorDistance) {
        nearestActor = slug;
        nearestActorDistance = distance;
      }
    }

    if (lastHotspot.current !== nearestHotspot) {
      lastHotspot.current = nearestHotspot;
      onNearbyHotspotChange(nearestHotspot);
    }
    if (lastActor.current !== nearestActor) {
      lastActor.current = nearestActor;
      onNearbyActorChange(nearestActor);
    }
  });

  return null;
}
