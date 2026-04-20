"use client";

/**
 * The room shell: floor, ceiling, walls with a giant window strip on the
 * back wall (z = -12), and some deco elements (the council table at origin,
 * monitor-wall banks, whiteboard).
 *
 * Sized ≈ 24m x 7m x 26m. Scale from there.
 */
import * as THREE from "three";
import { useMemo } from "react";

const ROOM = { halfX: 12, height: 7, halfZ: 13 };
const WALL_COLOR = "#0a0d12";
const FLOOR_COLOR = "#050608";
const TRIM = "#00F5FF";

export function OfficeRoom() {
  return (
    <group>
      <FloorGrid />
      {/* Ceiling */}
      <mesh position={[0, ROOM.height, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM.halfX * 2, ROOM.halfZ * 2]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Side walls */}
      <mesh position={[-ROOM.halfX, ROOM.height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM.halfZ * 2, ROOM.height]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>
      <mesh position={[ROOM.halfX, ROOM.height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM.halfZ * 2, ROOM.height]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Front wall (behind camera default view) */}
      <mesh position={[0, ROOM.height / 2, ROOM.halfZ]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM.halfX * 2, ROOM.height]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.9} />
      </mesh>

      {/* Back "wall" — a low trim band + top trim, middle is open to the skyline */}
      <mesh position={[0, 0.5, -ROOM.halfZ + 0.01]}>
        <planeGeometry args={[ROOM.halfX * 2, 1]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      <mesh position={[0, ROOM.height - 0.4, -ROOM.halfZ + 0.01]}>
        <planeGeometry args={[ROOM.halfX * 2, 0.8]} />
        <meshStandardMaterial color={WALL_COLOR} />
      </mesh>
      {/* Window-frame verticals — thin trims between glass panes */}
      {[-8, -4, 0, 4, 8].map((x) => (
        <mesh key={x} position={[x, ROOM.height / 2, -ROOM.halfZ + 0.02]}>
          <boxGeometry args={[0.15, ROOM.height - 1, 0.05]} />
          <meshStandardMaterial color={TRIM} emissive={TRIM} emissiveIntensity={0.4} />
        </mesh>
      ))}

      <CeilingLamps />
    </group>
  );
}

function FloorGrid() {
  // Procedural grid texture — cyan lines on ink.
  const texture = useMemo(() => {
    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    if (!canvas) return null;
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = FLOOR_COLOR;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = "rgba(0, 245, 255, 0.28)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 8; i++) {
      const v = (i / 8) * 512;
      ctx.beginPath();
      ctx.moveTo(v, 0);
      ctx.lineTo(v, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, v);
      ctx.lineTo(512, v);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    return tex;
  }, []);

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[ROOM.halfX * 2, ROOM.halfZ * 2]} />
      <meshStandardMaterial
        color="#050608"
        emissive="#00F5FF"
        emissiveIntensity={0.05}
        map={texture ?? undefined}
        roughness={0.6}
        metalness={0.2}
      />
    </mesh>
  );
}

function CeilingLamps() {
  // Three overhead strip lights — emissive bars that also cast pointLight.
  const positions: [number, number, number][] = [
    [-6, ROOM.height - 0.2, 0],
    [0, ROOM.height - 0.2, 0],
    [6, ROOM.height - 0.2, 0],
  ];
  return (
    <group>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <boxGeometry args={[0.2, 0.1, 8]} />
            <meshStandardMaterial
              color="#00F5FF"
              emissive="#00F5FF"
              emissiveIntensity={2.5}
            />
          </mesh>
          <pointLight color="#00F5FF" intensity={0.8} distance={16} decay={2} />
        </group>
      ))}
    </group>
  );
}

/**
 * The central round Council table. Anchored at origin.
 */
export function CouncilTable() {
  return (
    <group position={[0, 0, 0]}>
      {/* Floor inlay ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.0, 64]} />
        <meshStandardMaterial
          color="#7A5BFF"
          emissive="#7A5BFF"
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Table disc */}
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.1, 48]} />
        <meshStandardMaterial color="#0a0d12" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Holographic axis column */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 1, 12]} />
        <meshStandardMaterial
          color="#00F5FF"
          emissive="#00F5FF"
          emissiveIntensity={2}
          transparent
          opacity={0.85}
        />
      </mesh>
      <pointLight position={[0, 2, 0]} color="#7A5BFF" intensity={1.2} distance={10} />
    </group>
  );
}

/**
 * The "monitor wall" — a stack of thin screens mounted on the -Z side near x=0.
 * Each screen is emissive in an accent color (cycles).
 */
export function MonitorWall() {
  const screens: { pos: [number, number, number]; tint: string }[] = [
    { pos: [-3, 2.5, -11.5], tint: "#00F5FF" },
    { pos: [-1, 2.5, -11.5], tint: "#67FFB5" },
    { pos: [1, 2.5, -11.5], tint: "#FF2A4D" },
    { pos: [3, 2.5, -11.5], tint: "#FFB341" },
    { pos: [-2, 4, -11.5], tint: "#7A5BFF" },
    { pos: [2, 4, -11.5], tint: "#00F5FF" },
  ];
  return (
    <group>
      {screens.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <boxGeometry args={[1.6, 1, 0.05]} />
          <meshStandardMaterial
            color={s.tint}
            emissive={s.tint}
            emissiveIntensity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The whiteboard — a big emissive plane up on the +X wall.
 */
export function Whiteboard() {
  return (
    <group position={[-ROOM.halfX + 0.1, 2.5, 4]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial
          color="#e8ecf5"
          emissive="#e8ecf5"
          emissiveIntensity={0.05}
          roughness={0.9}
        />
      </mesh>
      {/* Sketched lines */}
      {[
        { y: 1, w: 3, offsetX: -0.5, tint: "#FF2A4D" },
        { y: 0.4, w: 2.2, offsetX: 0, tint: "#00F5FF" },
        { y: -0.2, w: 1.6, offsetX: 0.4, tint: "#67FFB5" },
        { y: -0.8, w: 2.6, offsetX: -0.1, tint: "#FFB341" },
      ].map((l, i) => (
        <mesh key={i} position={[l.offsetX, l.y, 0.02]}>
          <planeGeometry args={[l.w, 0.06]} />
          <meshStandardMaterial
            color={l.tint}
            emissive={l.tint}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

export const ROOM_DIMS = ROOM;
