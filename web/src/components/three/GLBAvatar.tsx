"use client";

import { useEffect, useMemo, useRef } from "react";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";
import type { PerformerBehavior, PerformerSpec } from "@/data/performers";

type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

interface GLBAvatarProps {
  performer?: PerformerSpec;
  modelPath: string;
  accent: string;
  name: string;
  role: string;
  position?: [number, number, number];
  rotationY?: number;
  modelScale?: number;
  behavior?: PerformerBehavior;
  isSelected?: boolean;
  showLabel?: boolean;
  compact?: boolean;
  onSelect?: (slug: string) => void;
}

const DEFAULT_POSITION: [number, number, number] = [0, 0, 0];

export function GLBAvatar({
  performer,
  modelPath,
  accent,
  name,
  role,
  position,
  rotationY,
  modelScale,
  behavior,
  isSelected = false,
  showLabel = true,
  compact = false,
  onSelect,
}: GLBAvatarProps) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const slug = performer?.slug ?? name.toLowerCase();
  const basePosition = position ?? performer?.desk3D.position ?? DEFAULT_POSITION;
  const baseRotation = rotationY ?? performer?.desk3D.rotationY ?? 0;
  const activeBehavior = behavior ?? performer?.behavior ?? "idle";
  const scale = modelScale ?? performer?.modelScale ?? (compact ? 0.86 : 0.95);

  const gltf = useGLTF(modelPath) as unknown as GLTFResult;
  const scene = useMemo(() => {
    const cloned = cloneSkeleton(gltf.scene) as THREE.Group;
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials: THREE.Material[] = Array.isArray(mesh.material)
        ? (mesh.material as THREE.Material[])
        : [mesh.material as THREE.Material];
      const clonedMaterials = materials.map((material: THREE.Material) => {
        const clonedMaterial = material.clone();
        if (clonedMaterial instanceof THREE.MeshStandardMaterial) {
          clonedMaterial.emissive = new THREE.Color(accent);
          clonedMaterial.emissiveIntensity = isSelected ? 0.12 : 0.045;
          clonedMaterial.roughness = Math.min(0.82, clonedMaterial.roughness + 0.08);
        }
        return clonedMaterial;
      });
      mesh.material = Array.isArray(mesh.material) ? clonedMaterials : clonedMaterials[0]!;
    });
    return cloned;
  }, [accent, gltf.scene, isSelected]);

  const { actions, names } = useAnimations(gltf.animations, scene);

  useEffect(() => {
    const name = names[0];
    if (!name) return;
    const action = actions[name];
    action?.reset().fadeIn(0.25).play();
    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, names]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const phase = basePosition[0] * 0.37 + basePosition[2] * 0.19 + slug.length;
    const selectedPulse = isSelected ? Math.sin(t * 5 + phase) * 0.025 : 0;
    const breath = Math.sin(t * 1.15 + phase) * (compact ? 0.018 : 0.028);
    const walk = activeBehavior === "walk" ? Math.sin(t * 0.42 + phase) * 1.15 : 0;
    const sideWalk = activeBehavior === "walk" ? Math.cos(t * 0.32 + phase) * 0.35 : 0;
    const typingBob = activeBehavior === "typing" || activeBehavior === "node_watch"
      ? Math.sin(t * 3.4 + phase) * 0.018
      : 0;
    const councilTurn = activeBehavior === "council" ? Math.sin(t * 0.52 + phase) * 0.16 : 0;
    const boardLean = activeBehavior === "whiteboard" ? Math.sin(t * 0.8 + phase) * 0.08 : 0;

    if (group.current) {
      group.current.position.set(
        basePosition[0] + walk,
        basePosition[1] + breath + typingBob,
        basePosition[2] + sideWalk,
      );
      group.current.rotation.y = baseRotation + councilTurn + boardLean + selectedPulse;
      const sway = 1 + Math.sin(t * 0.8 + phase) * 0.006 + (isSelected ? 0.035 : 0);
      group.current.scale.setScalar(sway);
    }
    if (ring.current) {
      ring.current.rotation.z += delta * (isSelected ? 1.6 : 0.55);
    }
  });

  return (
    <group
      ref={group}
      position={basePosition}
      rotation={[0, baseRotation, 0]}
      onClick={(event) => {
        event.stopPropagation();
        if (performer && onSelect) onSelect(performer.slug);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (onSelect) document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (onSelect) document.body.style.cursor = "default";
      }}
    >
      <mesh ref={ring} position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[compact ? 0.46 : 0.58, compact ? 0.62 : 0.78, 48]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={isSelected ? 0.92 : 0.42}
          side={THREE.DoubleSide}
        />
      </mesh>

      <primitive object={scene} scale={scale} />

      {(activeBehavior === "typing" || activeBehavior === "node_watch") && (
        <group position={[0, compact ? 1.05 : 1.25, 0.55]} rotation={[-0.35, 0, 0]}>
          <mesh>
            <planeGeometry args={[compact ? 0.42 : 0.58, compact ? 0.16 : 0.22]} />
            <meshBasicMaterial color={accent} transparent opacity={0.34} side={THREE.DoubleSide} />
          </mesh>
          <pointLight color={accent} intensity={0.35} distance={2.5} />
        </group>
      )}

      {activeBehavior === "whiteboard" && (
        <mesh position={[0.38, compact ? 1.35 : 1.5, 0.26]} rotation={[0, 0, Math.PI / 8]}>
          <boxGeometry args={[0.04, 0.38, 0.04]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.8} />
        </mesh>
      )}

      <pointLight
        position={[0, compact ? 1.2 : 1.5, 0]}
        color={accent}
        intensity={isSelected ? 1.1 : compact ? 0.28 : 0.45}
        distance={compact ? 3 : 4.5}
      />

      {showLabel && (
        <Html
          position={[0, compact ? 1.95 : 2.18, 0]}
          center
          distanceFactor={compact ? 6 : 8}
          occlude={false}
          style={{
            pointerEvents: "none",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-mono, monospace)",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontSize: compact ? "8px" : "10px",
            color: accent,
            textShadow: "0 0 10px rgba(0,0,0,0.95)",
            padding: "2px 6px",
            border: `1px solid ${accent}66`,
            background: "rgba(5,6,8,0.82)",
            borderRadius: 2,
          }}
        >
          <div>{name}</div>
          <div style={{ fontSize: compact ? "7px" : "8px", color: "#8A94A7", marginTop: 1 }}>
            {role}
          </div>
        </Html>
      )}
    </group>
  );
}
