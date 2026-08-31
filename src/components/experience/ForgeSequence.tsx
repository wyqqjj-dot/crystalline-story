import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import mouldAsset from "@/assets/mould.glb.asset.json";
import pipeAsset from "@/assets/pipe.glb.asset.json";
import boxModelAsset from "@/assets/box.glb.asset.json";
import { clamp01, ease, lerp, range } from "@/lib/journey";

function setOpacity(root: THREE.Object3D, opacity: number) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      if (!material) return;
      material.transparent = opacity < 0.99;
      material.opacity = opacity;
      material.depthWrite = opacity > 0.72;
    });
  });
}

function ImportedModel({
  url,
  position,
  scale,
  rotation,
  opacity,
  visible = true,
}: {
  url: string;
  position: [number, number, number];
  scale: number;
  rotation?: [number, number, number];
  opacity: number;
  visible?: boolean;
}) {
  const { scene } = useGLTF(url);
  const root = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    root.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mesh.material = materials.map((material) => material.clone());
    });
    setOpacity(root, opacity);
  }, [root, opacity]);

  useFrame(() => setOpacity(root, opacity));

  return (
    <primitive
      object={root}
      position={position}
      scale={scale}
      rotation={rotation}
      visible={visible && opacity > 0.01}
    />
  );
}

function FlowField({ t, lite }: { t: number; lite: boolean }) {
  const points = useRef<THREE.Points>(null);
  const bead = useRef<THREE.Mesh>(null);
  const count = lite ? 36 : 72;
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);

  useFrame((state) => {
    const flow = ease(range(t, 0.39, 0.7));
    const arrive = ease(range(t, 0.6, 0.76));
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const data = attr.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      const u = (i / Math.max(1, count - 1) + state.clock.elapsedTime * 0.16) % 1;
      const travel = clamp01(flow * 1.22 - u * 0.76);
      const x = lerp(1.72, 0.14, travel);
      const y = lerp(1.58, -0.22, travel) + Math.sin(i * 1.9 + state.clock.elapsedTime * 2.2) * 0.045;
      const z = Math.sin(i * 2.1) * 0.07 * (1 - travel) + Math.cos(i * 0.8) * 0.035;
      data[i * 3] = x;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = z;
    }
    attr.needsUpdate = true;
    if (points.current) {
      const material = points.current.material as THREE.PointsMaterial;
      material.opacity = 0.82 * (1 - arrive * 0.55);
      material.size = lerp(0.055, 0.032, arrive);
    }
    if (bead.current) {
      const u = ease(range(t, 0.43, 0.7));
      bead.current.position.set(lerp(1.72, 0.14, u), lerp(1.58, -0.22, u), 0);
      bead.current.scale.setScalar(lerp(0.13, 0.34, arrive));
      const material = bead.current.material as THREE.MeshPhysicalMaterial;
      material.opacity = 0.88 * (1 - arrive * 0.82);
    }
  });

  return (
    <group>
      <points ref={points} geometry={geometry}>
        <pointsMaterial color="#e5c88d" size={0.05} transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <mesh ref={bead}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#fff2ce"
          emissive="#c5a572"
          emissiveIntensity={0.45}
          transmission={0.8}
          thickness={0.32}
          roughness={0.12}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

function Mould({ t, lite }: { t: number; lite: boolean }) {
  const open = ease(range(t, 0.68, 0.86));
  const fill = ease(range(t, 0.58, 0.78));
  const opacity = 0.98 * (1 - ease(range(t, 0.84, 0.98)));
  const spread = open * 1.05;
  const scale = lite ? 1.08 : 1.18;

  return (
    <group position={[0, -0.2, 0]} rotation={[0, 0, 0.04]}>
      <group position={[-spread, 0, 0]}>
        <ImportedModel url={mouldAsset.url} position={[0, 0, 0]} scale={scale} opacity={opacity} />
      </group>
      <group position={[spread, 0, 0]} rotation={[0, open * 0.2, 0]}>
        <ImportedModel url={mouldAsset.url} position={[0, 0, 0]} scale={scale} opacity={opacity} />
      </group>
      <mesh position={[0, -0.48, 0.2]} scale={[0.72, 0.12 + fill * 0.36, 0.28]}>
        <sphereGeometry args={[1, lite ? 12 : 20, lite ? 8 : 12]} />
        <meshPhysicalMaterial
          color="#c5a572"
          emissive="#c5a572"
          emissiveIntensity={0.36}
          transmission={0.35}
          roughness={0.2}
          transparent
          opacity={fill * (1 - open * 0.55)}
        />
      </mesh>
    </group>
  );
}

/** Pure WebGL continuation of the ritual: pipe, flowing glass, mould fill, open. */
export function ForgeSequence({ tRef, lite }: { tRef: { current: number }; lite: boolean }) {
  const root = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = clamp01(tRef.current);
    const opacity = ease(range(t, 0.34, 0.47)) * (1 - ease(range(t, 0.86, 1)));
    if (root.current) {
      root.current.visible = opacity > 0.01;
      root.current.position.y = Math.sin(t * Math.PI) * 0.08;
    }
  });

  const pipeOpacity = ease(range(0.38, 0.39, 0.48)) * (1 - ease(range(0.8, 0.78, 0.94)));
  const mouldOpacity = ease(range(0.56, 0.56, 0.67)) * (1 - ease(range(0.84, 0.82, 0.98)));

  return (
    <group ref={root}>
      <ImportedModel
        url={pipeAsset.url}
        position={[2.02, 0.78, 0.1]}
        scale={lite ? 1.05 : 1.2}
        rotation={[0, 0, -0.12]}
        opacity={pipeOpacity}
      />
      <FlowField t={tRef.current} lite={lite} />
      <group visible={mouldOpacity > 0.01}>
        <Mould t={tRef.current} lite={lite} />
      </group>
      <ImportedModel
        url={boxModelAsset.url}
        position={[-2.05, -0.75, -0.3]}
        scale={0.24}
        opacity={ease(range(tRef.current, 0.82, 0.9))}
      />
    </group>
  );
}

useGLTF.preload(mouldAsset.url);
useGLTF.preload(pipeAsset.url);
useGLTF.preload(boxModelAsset.url);
