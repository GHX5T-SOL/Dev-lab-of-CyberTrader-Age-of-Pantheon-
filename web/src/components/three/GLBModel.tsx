"use client";

import { useEffect, useMemo } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import { clone as cloneSkeleton } from "three/examples/jsm/utils/SkeletonUtils.js";
import * as THREE from "three";

type GLTFResult = {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
};

export interface GLBModelProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  accent?: string;
  emissiveBoost?: number;
  animationName?: string;
  receiveShadow?: boolean;
  castShadow?: boolean;
}

export function GLBModel({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  accent,
  emissiveBoost = 0.035,
  animationName,
  receiveShadow = true,
  castShadow = true,
}: GLBModelProps) {
  const gltf = useGLTF(modelPath) as unknown as GLTFResult;
  const scene = useMemo(() => {
    const cloned = cloneSkeleton(gltf.scene) as THREE.Group;
    cloned.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      const wasArray = Array.isArray(mesh.material);
      const materials: THREE.Material[] = wasArray
        ? (mesh.material as THREE.Material[])
        : [mesh.material as THREE.Material];
      const clonedMaterials = materials.map((material: THREE.Material) => {
        const clonedMaterial = material.clone();
        if (accent && clonedMaterial instanceof THREE.MeshStandardMaterial) {
          clonedMaterial.emissive = new THREE.Color(accent);
          clonedMaterial.emissiveIntensity = emissiveBoost;
        }
        return clonedMaterial;
      });
      mesh.material = wasArray ? clonedMaterials : clonedMaterials[0]!;
    });
    return cloned;
  }, [accent, castShadow, emissiveBoost, gltf.scene, receiveShadow]);

  const { actions, names } = useAnimations(gltf.animations, scene);

  useEffect(() => {
    const name = animationName && actions[animationName] ? animationName : names[0];
    if (!name) return;
    const action = actions[name];
    action?.reset().fadeIn(0.25).play();
    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, animationName, names]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}
