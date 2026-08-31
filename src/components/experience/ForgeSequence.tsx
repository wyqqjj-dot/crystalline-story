import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

import mouldAsset from "@/assets/mould.glb.asset.json";
import pipeAsset from "@/assets/pipe.glb.asset.json";
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
  opacityRef,
}: {
  url: string;
  position: [number, number, number];
  scale: number;
  rotation?: [number, number, number];
  opacityRef: { current: number };
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
  }, [root]);

  useFrame(() => {
    setOpacity(root, opacityRef.current);
    root.visible = opacityRef.current > 0.01;
  });

  return <primitive object={root} position={position} scale={scale} rotation={rotation} />;
}

/** Stage 4: a continuous molten ribbon leaving the pipe, plus its spark trail. */
function FlowField({ tRef, lite }: { tRef: { current: number }; lite: boolean }) {
  const points = useRef<THREE.Points>(null);
  const bead = useRef<THREE.Mesh>(null);
  const stream = useRef<THREE.Mesh>(null);
  const count = lite ? 44 : 96;
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    return g;
  }, [count]);

  useFrame((state) => {
    const t = clamp01(tRef.current);
    const flow = ease(range(t, 0.42, 0.6));
    const arrive = ease(range(t, 0.56, 0.72));
    const gone = ease(range(t, 0.7, 0.82));
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const data = attr.array as Float32Array;
    for (let i = 0; i < count; i += 1) {
      const u = (i / Math.max(1, count - 1) + state.clock.elapsedTime * 0.22) % 1;
      const travel = clamp01(flow * 1.24 - u * 0.7);
      const x = lerp(1.72, 0.1, travel);
      const y = lerp(1.58, -0.26, travel) + Math.sin(i * 1.9 + state.clock.elapsedTime * 2.6) * 0.038;
      const z = Math.sin(i * 2.1) * 0.06 * (1 - travel) + Math.cos(i * 0.8) * 0.03;
      data[i * 3] = x;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = z;
    }
    attr.needsUpdate = true;

    if (points.current) {
      const material = points.current.material as THREE.PointsMaterial;
      material.opacity = 0.85 * flow * (1 - gone);
      material.size = lerp(0.05, 0.03, arrive);
    }

    /* the ribbon itself: a stretched, sagging strand from pipe lip to mould mouth */
    if (stream.current) {
      const g = stream.current;
      const head = ease(range(t, 0.42, 0.62));
      const x0 = 1.72;
      const y0 = 1.58;
      const x1 = lerp(x0, 0.1, head);
      const y1 = lerp(y0, -0.26, head);
      const dx = x1 - x0;
      const dy = y1 - y0;
      const len = Math.hypot(dx, dy);
      g.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0);
      g.rotation.z = Math.atan2(dy, dx) - Math.PI / 2;
      const thin = 1 - arrive * 0.55;
      g.scale.set(thin, Math.max(0.001, len / 2), thin);
      const material = g.material as THREE.MeshPhysicalMaterial;
      material.opacity = 0.95 * ease(range(t, 0.42, 0.5)) * (1 - gone);
      material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
      g.visible = material.opacity > 0.02;
    }

    if (bead.current) {
      const u = ease(range(t, 0.42, 0.62));
      bead.current.position.set(lerp(1.72, 0.1, u), lerp(1.58, -0.26, u), 0);
      bead.current.scale.setScalar(lerp(0.12, 0.3, arrive) * (1 - gone));
      const material = bead.current.material as THREE.MeshPhysicalMaterial;
      material.opacity = 0.9 * flow * (1 - gone);
    }
  });

  return (
    <group>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          color="#ffc477"
          size={0.05}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh ref={stream} visible={false}>
        <cylinderGeometry args={[0.055, 0.075, 2, lite ? 8 : 14, 1, true]} />
        <meshPhysicalMaterial
          color="#ffd79a"
          emissive="#ff9a3c"
          emissiveIntensity={1.5}
          transmission={0.4}
          thickness={0.3}
          roughness={0.24}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={bead}>
        <icosahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#fff2ce"
          emissive="#ffa64a"
          emissiveIntensity={0.6}
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

/** Stages 5 – 6: the mould fills, then swings open. */
function Mould({ tRef, lite }: { tRef: { current: number }; lite: boolean }) {
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const liquid = useRef<THREE.Mesh>(null);
  const leftOpacity = useRef(0);
  const rightOpacity = useRef(0);
  const scale = lite ? 1.08 : 1.18;

  useFrame((state) => {
    const t = clamp01(tRef.current);
    const fill = ease(range(t, 0.56, 0.72));
    const open = ease(range(t, 0.72, 0.88));
    const opacity = 0.98 * ease(range(t, 0.36, 0.5)) * (1 - ease(range(t, 0.88, 1)));
    const spread = open * 1.12;
    leftOpacity.current = opacity;
    rightOpacity.current = opacity;
    // a small mechanical shudder as the halves break the seal
    const shudder = Math.sin(state.clock.elapsedTime * 26) * 0.012 * ease(range(t, 0.72, 0.78));
    if (left.current) {
      left.current.position.x = -spread + shudder;
      left.current.rotation.y = -open * 0.22;
    }
    if (right.current) {
      right.current.position.x = spread - shudder;
      right.current.rotation.y = open * 0.22;
    }
    if (liquid.current) {
      liquid.current.scale.set(0.7, 0.1 + fill * 0.42, 0.28);
      liquid.current.position.y = -0.56 + fill * 0.22;
      const material = liquid.current.material as THREE.MeshPhysicalMaterial;
      material.opacity = fill * (1 - open);
      material.emissiveIntensity = 1.1 * (1 - fill * 0.55);
    }
  });

  return (
    <group position={[0, -0.2, 0]} rotation={[0, 0, 0.04]}>
      <group ref={left}>
        <ImportedModel url={mouldAsset.url} position={[0, 0, 0]} scale={scale} opacityRef={leftOpacity} />
      </group>
      <group ref={right}>
        <ImportedModel url={mouldAsset.url} position={[0, 0, 0]} scale={scale} opacityRef={rightOpacity} />
      </group>
      <mesh ref={liquid} position={[0, -0.48, 0.2]}>
        <sphereGeometry args={[1, lite ? 12 : 22, lite ? 8 : 14]} />
        <meshPhysicalMaterial
          color="#ffd79a"
          emissive="#ff9a3c"
          emissiveIntensity={1.1}
          transmission={0.35}
          roughness={0.2}
          transparent
          opacity={0}
        />
      </mesh>
    </group>
  );
}

/** Pure WebGL continuation of the ritual: pipe, flowing glass, mould fill, open. */
export function ForgeSequence({ tRef, lite }: { tRef: { current: number }; lite: boolean }) {
  const root = useRef<THREE.Group>(null);
  const pipeOpacity = useRef(0);

  useFrame(() => {
    const t = clamp01(tRef.current);
    const opacity = ease(range(t, 0.32, 0.46)) * (1 - ease(range(t, 0.9, 1)));
    pipeOpacity.current = ease(range(t, 0.34, 0.46)) * (1 - ease(range(t, 0.78, 0.9)));
    if (root.current) {
      root.current.visible = opacity > 0.01;
      root.current.position.y = Math.sin(t * Math.PI) * 0.08;
    }
  });

  return (
    <group ref={root}>
      <ImportedModel
        url={pipeAsset.url}
        position={[2.02, 0.78, 0.1]}
        scale={lite ? 1.05 : 1.2}
        rotation={[0, 0, -0.12]}
        opacityRef={pipeOpacity}
      />
      <FlowField tRef={tRef} lite={lite} />
      <Mould tRef={tRef} lite={lite} />
    </group>
  );
}

useGLTF.preload(mouldAsset.url);
useGLTF.preload(pipeAsset.url);

