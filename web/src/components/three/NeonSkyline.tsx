"use client";

/**
 * A skyline of emissive neon towers seen through the back windows of the
 * Dev Lab. Cheap to render — just a bunch of boxes with neon tints plus a
 * far-plane gradient billboard. Deterministic (seeded).
 */
import { useMemo } from "react";
import * as THREE from "three";

// Tiny deterministic PRNG so the skyline looks the same on every reload.
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Tower {
  pos: [number, number, number];
  size: [number, number, number];
  tint: string;
  emissiveIntensity: number;
}

function buildTowers(count = 60, seed = 0xc47b1a): Tower[] {
  const rand = mulberry32(seed);
  const tints = ["#00F5FF", "#FF2A4D", "#7A5BFF", "#67FFB5", "#FFB341"];
  const towers: Tower[] = [];
  for (let i = 0; i < count; i++) {
    const x = (rand() - 0.5) * 120;
    const z = -25 - rand() * 90; // way behind the window wall at z = -12
    const h = 4 + rand() * 26;
    const w = 1.2 + rand() * 3.5;
    const d = 1.2 + rand() * 3.5;
    towers.push({
      pos: [x, h / 2 - 6, z],
      size: [w, h, d],
      tint: tints[Math.floor(rand() * tints.length)]!,
      emissiveIntensity: 0.4 + rand() * 1.6,
    });
  }
  return towers;
}

export function NeonSkyline() {
  const towers = useMemo(() => buildTowers(), []);

  return (
    <group>
      {/* Back haze plane — soft violet glow across the horizon */}
      <mesh position={[0, 2, -110]}>
        <planeGeometry args={[260, 60]} />
        <meshBasicMaterial
          color="#0a0618"
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      {towers.map((t, i) => (
        <mesh key={i} position={t.pos}>
          <boxGeometry args={t.size} />
          <meshStandardMaterial
            color={t.tint}
            emissive={t.tint}
            emissiveIntensity={t.emissiveIntensity}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Low fog band at ground level for the city */}
      <mesh position={[0, -5, -60]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 120]} />
        <meshBasicMaterial color="#7A5BFF" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}
