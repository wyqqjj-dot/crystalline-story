import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { clamp01, ease, lerp } from "@/lib/journey";

const COUNT = 2600;
const SHARDS = 9;

/**
 * Opening sequence (the only time-driven animation on the site):
 * floating crystal shards -> detonation -> progressive fracture into motes ->
 * chaotic drift -> magnetic convergence -> bottle silhouette.
 *
 * `t` is 0..1 over ~5 seconds, supplied by the parent.
 */
export function Genesis({ tRef }: { tRef: { current: number } }) {
  const points = useRef<THREE.Points>(null);
  const shardGroup = useRef<THREE.Group>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const origin = new Float32Array(COUNT * 3);
    const blast = new Float32Array(COUNT * 3);
    const target = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // shard cluster origin
      const ox = (Math.random() - 0.5) * 1.4;
      const oy = (Math.random() - 0.5) * 1.8;
      const oz = (Math.random() - 0.5) * 1.4;
      origin.set([ox, oy, oz], i * 3);

      // outward blast direction
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize();
      const power = 3.4 + Math.random() * 5.2;
      blast.set([dir.x * power, dir.y * power + 1.2, dir.z * power], i * 3);

      // bottle silhouette target (cylinder body + shoulder + neck)
      const h = Math.random();
      let r: number;
      let y: number;
      if (h < 0.72) {
        r = 0.42;
        y = -0.85 + h * (1.7 / 0.72);
      } else if (h < 0.86) {
        const k = (h - 0.72) / 0.14;
        r = lerp(0.42, 0.17, k);
        y = 0.85 + k * 0.24;
      } else {
        const k = (h - 0.86) / 0.14;
        r = 0.16;
        y = 1.09 + k * 0.34;
      }
      const a = Math.random() * Math.PI * 2;
      target.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);

      positions.set([ox, oy, oz], i * 3);
      seed[i] = Math.random();
    }
    return { positions, origin, blast, target, seed };
  }, []);

  const shards = useMemo(
    () =>
      Array.from({ length: SHARDS }, (_, i) => ({
        p: new THREE.Vector3(
          (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 1.2,
        ),
        dir: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        ).normalize(),
        s: 0.18 + Math.random() * 0.3,
        rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
        i,
      })),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clamp01(tRef.current);
    const { positions, origin, blast, target, seed } = data;

    // shards: drift, then explode away and vanish
    if (shardGroup.current) {
      const fly = clamp01((t - 0.2) / 0.28);
      shardGroup.current.children.forEach((child, idx) => {
        const s = shards[idx]!;
        child.position.set(
          s.p.x + s.dir.x * fly * 7,
          s.p.y + s.dir.y * fly * 7 + Math.sin(t * 6 + idx) * 0.06,
          s.p.z + s.dir.z * fly * 7,
        );
        child.rotation.x += dt * (0.4 + s.rot.x * (1 + fly * 8));
        child.rotation.y += dt * (0.4 + s.rot.y * (1 + fly * 8));
        const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
        mat.opacity = (1 - clamp01((t - 0.22) / 0.2)) * clamp01(t / 0.1);
      });
    }

    const geo = points.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes['position']!.array as Float32Array;

    // phase weights
    const detonate = clamp01((t - 0.2) / 0.25); // fly outward
    const chaos = clamp01((t - 0.5) / 0.2); // drifting motes
    const gather = ease(clamp01((t - 0.72) / 0.26)); // magnetic convergence

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const s = seed[i]!;
      const stagger = clamp01((detonate - s * 0.45) / 0.55); // chain-reaction fracture

      const ex = origin[i3]! + blast[i3]! * stagger - 0.5 * 3.2 * stagger * stagger;
      const ey = origin[i3 + 1]! + blast[i3 + 1]! * stagger - 0.5 * 5.5 * stagger * stagger;
      const ez = origin[i3 + 2]! + blast[i3 + 2]! * stagger;

      const wob = chaos * 0.5;
      const dx = ex + Math.sin(t * 3 + s * 30) * wob;
      const dy = ey + Math.cos(t * 2.4 + s * 21) * wob;
      const dz = ez + Math.sin(t * 2.1 + s * 12) * wob;

      arr[i3] = lerp(dx, target[i3]!, gather);
      arr[i3 + 1] = lerp(dy, target[i3 + 1]!, gather);
      arr[i3 + 2] = lerp(dz, target[i3 + 2]!, gather);
    }
    geo.attributes['position']!.needsUpdate = true;

    const mat = points.current!.material as THREE.PointsMaterial;
    // motes hand over to the solid bottle at the very end
    mat.opacity = clamp01(t / 0.12) * (1 - clamp01((t - 0.94) / 0.06));
    mat.size = lerp(0.05, 0.014, clamp01(t / 0.6));
    points.current!.rotation.y = t * 0.9;
  });

  return (
    <group>
      <group ref={shardGroup}>
        {shards.map((s) => (
          <mesh key={s.i} position={s.p}>
            <icosahedronGeometry args={[s.s, 0]} />
            <meshPhysicalMaterial
              transmission={1}
              roughness={0}
              ior={1.5}
              thickness={0.5}
              color="#eef6f8"
              envMapIntensity={1}
              transparent
              opacity={0}
            />
          </mesh>
        ))}
      </group>

      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
            count={COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          sizeAttenuation
          color="#dbeaf2"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
