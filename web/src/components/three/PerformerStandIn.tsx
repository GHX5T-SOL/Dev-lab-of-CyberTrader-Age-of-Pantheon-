"use client";

/**
 * A low-poly "operator" stand-in for a performer.
 *
 * Each has:
 *   - capsule body in their accent color
 *   - glass head (dark, with a thin visor glow)
 *   - a floating "fragment" orb above (the Eidolon tag)
 *   - accent rim light on the floor under them
 *   - idle animation (float + slow yaw bob)
 *   - pose variant: sit/stand/patrol/couch/whiteboard/terminal — adjusts
 *     height, hand position, and idle movement
 *   - clickable (invokes onSelect callback)
 *   - a Html name tag via drei floats above the head
 *
 * Phase B now uses GLBAvatar for local rigs. Keep this component as an
 * emergency lightweight fallback if a model fails to load.
 */
import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { PerformerSpec } from "@/data/performers";

interface Props {
  performer: PerformerSpec;
  /** TEAM accent hex. */
  accent: string;
  /** Display name over the head. */
  name: string;
  /** Role string. */
  role: string;
  /** Selected state (camera is focused on this character). */
  isSelected: boolean;
  onSelect: (slug: string) => void;
}

const POSE_Y_OFFSET: Record<PerformerSpec["desk3D"]["pose"], number> = {
  stand: 0,
  whiteboard: 0,
  patrol: 0,
  sit: -0.35,
  couch: -0.45,
  terminal: -0.3,
};

export function PerformerStandIn({ performer, accent, name, role, isSelected, onSelect }: Props) {
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const orb = useRef<THREE.Mesh>(null);

  const yOff = POSE_Y_OFFSET[performer.desk3D.pose];
  const isPatrol = performer.desk3D.pose === "patrol";

  // Idle animation — gentle float + yaw sway + orb orbit.
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const phase = performer.desk3D.position[0] * 0.3; // unique per character
    if (group.current) {
      const floatY = Math.sin(t * 0.8 + phase) * 0.04;
      const patrolX = isPatrol ? Math.sin(t * 0.35 + phase) * 1.2 : 0;
      group.current.position.y = yOff + floatY + 1.2;
      group.current.position.x = performer.desk3D.position[0] + patrolX;
      group.current.rotation.y =
        performer.desk3D.rotationY + Math.sin(t * 0.4 + phase) * 0.08;
    }
    if (body.current && isSelected) {
      const pulse = 1 + Math.sin(t * 4) * 0.05;
      body.current.scale.set(pulse, 1, pulse);
    }
    if (orb.current) {
      orb.current.position.y = 1.1 + Math.sin(t * 1.4 + phase) * 0.1;
      orb.current.rotation.y = t * 0.6;
    }
  });

  return (
    <group
      ref={group}
      position={performer.desk3D.position}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(performer.slug);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
      }}
    >
      {/* Floor glow puck */}
      <mesh position={[0, -1.15 - yOff, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.75, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={isSelected ? 0.95 : 0.55}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Body capsule */}
      <mesh ref={body} position={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.32, 0.8, 8, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={isSelected ? 0.7 : 0.25}
          roughness={0.35}
          metalness={0.45}
        />
      </mesh>

      {/* Head — dark glass */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.24, 20, 16]} />
        <meshStandardMaterial
          color="#0a0d12"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Visor — thin bright strip across the head */}
      <mesh position={[0, 0.85, 0.19]}>
        <boxGeometry args={[0.4, 0.06, 0.02]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={2.2}
        />
      </mesh>

      {/* Fragment orb */}
      <mesh ref={orb} position={[0.35, 1.1, 0]}>
        <icosahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Name plate — Html billboard */}
      <Html
        position={[0, 1.7, 0]}
        center
        distanceFactor={8}
        occlude={false}
        style={{
          pointerEvents: "none",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-mono, monospace)",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          fontSize: "10px",
          color: accent,
          textShadow: "0 0 8px rgba(0,0,0,0.9)",
          padding: "2px 6px",
          border: `1px solid ${accent}55`,
          background: "rgba(5,6,8,0.78)",
          borderRadius: 2,
          transform: isSelected ? "scale(1.05)" : "scale(1)",
          transition: "transform 180ms ease",
        }}
      >
        <div>{name}</div>
        <div style={{ fontSize: "8px", color: "#8A94A7", marginTop: 1 }}>{role}</div>
      </Html>

      {/* Per-character point light */}
      <pointLight position={[0, 1, 0]} color={accent} intensity={isSelected ? 1.2 : 0.35} distance={4} decay={2} />
    </group>
  );
}
