import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { clamp01, ease, lerp, range } from "@/lib/journey";

/**
 * Stage 1 of the ritual: gold dust floating in a black void.
 *
 * Nothing plays on its own. As the visitor pushes the page upward the cloud is
 * pulled magnetically into a faceted crystal, which then hands over to the
 * scrubbed forge film (melt -> pipe -> mould).
 */
export function Genesis({ tRef, lite = false }: { tRef: { current: number }; lite?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const clock = useRef(0);

  const count = lite ? 520 : 1400;

  const { scatter, target, geometry } = useMemo(() => {
    const scatter = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // wide drifting cloud
      const r = 2.6 + Math.random() * 3.6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      scatter[i * 3] = r * Math.sin(ph) * Math.cos(th);
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 6.4;
      scatter[i * 3 + 2] = r * Math.cos(ph) * 0.7;

      // crystal shell target — an elongated octahedral shard
      const t2 = Math.random() * Math.PI * 2;
      const p2 = Math.acos(2 * Math.random() - 1);
      const rr = 0.62 * (0.85 + Math.random() * 0.2);
      target[i * 3] = rr * Math.sin(p2) * Math.cos(t2);
      target[i * 3 + 1] = rr * Math.cos(p2) * 1.9;
      target[i * 3 + 2] = rr * Math.sin(p2) * Math.sin(t2);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(scatter.slice(), 3));
    return { scatter, target, geometry };
  }, [count]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    clock.current += dt;
    const t = clamp01(tRef.current);

    // magnetic convergence, then the shard forms, then the film takes over
    const pull = ease(range(t, 0.04, 0.34));
    const form = ease(range(t, 0.26, 0.4));
    const fade = 1 - ease(range(t, 0.36, 0.5));

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const drift = Math.sin(clock.current * 0.35 + i * 0.7) * 0.22 * (1 - pull);
      arr[i3] = lerp(scatter[i3]! + drift, target[i3]!, pull);
      arr[i3 + 1] = lerp(
        scatter[i3 + 1]! + Math.cos(clock.current * 0.3 + i) * 0.28 * (1 - pull),
        target[i3 + 1]!,
        pull,
      );
      arr[i3 + 2] = lerp(scatter[i3 + 2]! - drift, target[i3 + 2]!, pull);
    }
    attr.needsUpdate = true;

    if (points.current) {
      const m = points.current.material as THREE.PointsMaterial;
      m.opacity = 0.9 * fade;
      m.size = lerp(0.028, 0.016, pull);
    }
    if (crystal.current) {
      const m = crystal.current.material as THREE.MeshPhysicalMaterial;
      m.opacity = form * fade;
      crystal.current.visible = m.opacity > 0.01;
      crystal.current.scale.setScalar(lerp(0.4, 1, form));
    }
    if (group.current) {
      group.current.rotation.y = clock.current * 0.12 + t * 1.4;
      group.current.visible = fade > 0.01;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          size={0.026}
          color="#e2c98f"
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh ref={crystal} visible={false}>
        <octahedronGeometry args={[0.72, 0]} />
        <meshPhysicalMaterial
          transparent
          opacity={0}
          transmission={0.9}
          thickness={0.7}
          ior={1.6}
          roughness={0.06}
          metalness={0}
          color="#f3e6c6"
          emissive="#c5a572"
          emissiveIntensity={0.28}
        />
      </mesh>
      <pointLight position={[0, 0, 2]} color="#c5a572" intensity={6} distance={7} />
    </group>
  );
}
