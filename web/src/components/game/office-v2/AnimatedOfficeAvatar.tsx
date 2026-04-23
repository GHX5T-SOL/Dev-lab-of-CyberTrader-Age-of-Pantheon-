"use client";

import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

export type OfficeAnimationState = "idle" | "walk" | "talk";

interface AnimatedOfficeAvatarProps {
  modelPath: string;
  accent: string;
  label: string;
  role: string;
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
  animationState?: OfficeAnimationState;
  selected?: boolean;
  showLabel?: boolean;
  distanceFactor?: number;
  livePositionRef?: MutableRefObject<THREE.Vector3>;
  liveRotationRef?: MutableRefObject<number>;
  liveAnimationStateRef?: MutableRefObject<OfficeAnimationState>;
  onClick?: () => void;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

const MOTION_PATHS = {
  idle: "/GLB_Animations/M_Standing_Idle_001.glb",
  walk: "/GLB_Animations/M_Walk_001.glb",
  talk: "/GLB_Animations/M_Talking_Variations_001.glb",
} as const;

function findFirstSkinnedMesh(root: THREE.Object3D) {
  let target: THREE.SkinnedMesh | null = null;
  root.traverse((child) => {
    if (!target && (child as THREE.SkinnedMesh).isSkinnedMesh) {
      target = child as THREE.SkinnedMesh;
    }
  });
  return target;
}

function normalizeBoneName(name: string) {
  return name.replace(/\.\d+$/, "").replace(/_\d+$/, "").toLowerCase();
}

function buildBoneMap(target: THREE.SkinnedMesh, source: THREE.SkinnedMesh) {
  const sourceNames = new Map<string, string>();
  source.skeleton.bones.forEach((bone) => {
    sourceNames.set(normalizeBoneName(bone.name), bone.name);
  });

  const names: Record<string, string> = {};
  target.skeleton.bones.forEach((bone) => {
    const match = sourceNames.get(normalizeBoneName(bone.name));
    if (match) {
      names[bone.name] = match;
    }
  });
  return names;
}

function sanitizeClip(clip: THREE.AnimationClip, name: OfficeAnimationState) {
  const tracks = clip.tracks.filter((track) => {
    if (name === "walk" && track.name.endsWith(".position")) {
      return false;
    }
    return !track.name.endsWith(".scale");
  });
  return new THREE.AnimationClip(name, clip.duration, tracks);
}

function retargetClip(
  name: OfficeAnimationState,
  targetScene: THREE.Object3D,
  sourceScene: THREE.Object3D,
  sourceClip: THREE.AnimationClip | undefined,
) {
  const targetMesh = findFirstSkinnedMesh(targetScene);
  const sourceMesh = findFirstSkinnedMesh(sourceScene);

  if (!targetMesh || !sourceMesh || !sourceClip) {
    return null;
  }

  const names = buildBoneMap(targetMesh, sourceMesh);

  try {
    const clip = SkeletonUtils.retargetClip(targetMesh, sourceMesh, sourceClip, {
      names,
      hip: (sourceMesh as THREE.SkinnedMesh).skeleton.bones[0]?.name ?? "Hips",
      preserveBoneMatrix: false,
      preserveHipPosition: false,
      useFirstFramePosition: true,
      useTargetMatrix: true,
    });
    return sanitizeClip(clip, name);
  } catch {
    return null;
  }
}

export function AnimatedOfficeAvatar({
  modelPath,
  accent,
  label,
  role,
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  animationState = "idle",
  selected = false,
  showLabel = true,
  distanceFactor = 7.5,
  livePositionRef,
  liveRotationRef,
  liveAnimationStateRef,
  onClick,
  onPointerOver,
  onPointerOut,
}: AnimatedOfficeAvatarProps) {
  const group = useRef<THREE.Group>(null);
  const currentAction = useRef<OfficeAnimationState | null>(null);
  const targetAsset = useGLTF(modelPath) as unknown as GLTFResult;
  const idleAsset = useGLTF(MOTION_PATHS.idle) as unknown as GLTFResult;
  const walkAsset = useGLTF(MOTION_PATHS.walk) as unknown as GLTFResult;
  const talkAsset = useGLTF(MOTION_PATHS.talk) as unknown as GLTFResult;

  const scene = useMemo(() => {
    const cloned = SkeletonUtils.clone(targetAsset.scene) as THREE.Group;
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const originalMaterials = Array.isArray(mesh.material)
        ? (mesh.material as THREE.Material[])
        : [mesh.material as THREE.Material];
      const materialCopies = originalMaterials.map((material) => {
        const copy = material.clone();
        if (copy instanceof THREE.MeshStandardMaterial) {
          copy.emissive = new THREE.Color(accent);
          copy.emissiveIntensity = selected ? 0.16 : 0.065;
          copy.roughness = Math.min(0.96, copy.roughness + 0.05);
          copy.metalness = Math.max(copy.metalness, 0.1);
        }
        return copy;
      });
      mesh.material = Array.isArray(mesh.material) ? materialCopies : materialCopies[0]!;
    });
    return cloned;
  }, [accent, selected, targetAsset.scene]);

  const clips = useMemo(() => {
    const idle = retargetClip("idle", scene, idleAsset.scene, idleAsset.animations[0]);
    const walk = retargetClip("walk", scene, walkAsset.scene, walkAsset.animations[0]);
    const talk = retargetClip("talk", scene, talkAsset.scene, talkAsset.animations[0]);
    return [idle, walk, talk].filter(Boolean) as THREE.AnimationClip[];
  }, [idleAsset.animations, idleAsset.scene, scene, talkAsset.animations, talkAsset.scene, walkAsset.animations, walkAsset.scene]);

  const { actions } = useAnimations(clips, group);

  useEffect(() => {
    currentAction.current = null;
  }, [actions]);

  useFrame(() => {
    if (group.current && livePositionRef) {
      group.current.position.copy(livePositionRef.current);
    }
    if (group.current && liveRotationRef) {
      group.current.rotation.y = liveRotationRef.current;
    }

    const desired = liveAnimationStateRef?.current ?? animationState;
    if (currentAction.current === desired) return;

    const next = actions[desired] ?? actions.idle ?? Object.values(actions)[0];
    if (!next) return;

    if (currentAction.current && actions[currentAction.current]) {
      actions[currentAction.current]?.fadeOut(0.16);
    }

    next.reset().fadeIn(desired === "walk" ? 0.18 : 0.22).play();
    currentAction.current = desired;
  });

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotationY, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        onPointerOver?.();
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        onPointerOut?.();
      }}
    >
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.26 * scale, 0.38 * scale, 40]} />
        <meshBasicMaterial color={accent} transparent opacity={selected ? 0.95 : 0.45} />
      </mesh>
      <primitive object={scene} scale={scale} />
      <pointLight color={accent} intensity={selected ? 1.35 : 0.4} distance={3.2} position={[0, 1.4, 0]} />
      {showLabel && (
        <Html
          center
          position={[0, 1.92 * scale, 0]}
          distanceFactor={distanceFactor}
          style={{ pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          <div
            style={{
              border: `1px solid ${accent}66`,
              background: "rgba(4, 8, 12, 0.84)",
              boxShadow: `0 0 20px ${accent}20`,
              color: accent,
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.16em",
              padding: "4px 8px",
              textTransform: "uppercase",
              borderRadius: 4,
              fontSize: 10,
              textAlign: "center",
            }}
          >
            <div>{label}</div>
            <div style={{ color: "#8A94A7", fontSize: 8, marginTop: 2 }}>{role}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload(MOTION_PATHS.idle);
useGLTF.preload(MOTION_PATHS.walk);
useGLTF.preload(MOTION_PATHS.talk);
