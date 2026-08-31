import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { clamp01, ease, lerp, range } from "@/lib/journey";

/**
 * Stages 1 – 3 of the ritual.
 *
 * 1. Gold dust drifting in a black void, waking as the visitor pushes upward.
 * 2. The cloud is pulled magnetically into a faceted crystal.
 * 3. The crystal sinks into the furnace glow, softens, slumps and turns molten
 *    before the pipe takes over.
 *
 * Nothing plays on its own — every value is a function of the intro progress.
 */
export function Genesis({ tRef, lite = false }: { tRef: { current: number }; lite?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const molten = useRef<THREE.Mesh>(null);
  const furnace = useRef<THREE.PointLight>(null);
  const halo = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const clock = useRef(0);

  const count = lite ? 520 : 1400;

  const { scatter, target, geometry } = useMemo(() => {
    const scatter = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
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

    /* stage 1 -> 2: magnetic convergence, then the shard hardens */
    const pull = ease(range(t, 0.02, 0.22));
    const form = ease(range(t, 0.16, 0.28));
    /* stage 3: the shard sags, glows and turns into a molten gather */
    const heat = ease(range(t, 0.26, 0.4));
    const melt = ease(range(t, 0.3, 0.44));
    const fade = 1 - ease(range(t, 0.4, 0.48));

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const sx = scatter[i3] ?? 0;
      const sy = scatter[i3 + 1] ?? 0;
      const sz = scatter[i3 + 2] ?? 0;
      const tx = target[i3] ?? 0;
      const ty = target[i3 + 1] ?? 0;
      const tz = target[i3 + 2] ?? 0;
      const drift = Math.sin(clock.current * 0.35 + i * 0.7) * 0.22 * (1 - pull);
      // once molten, the dust that is left slides down toward the gather
      const sink = melt * (0.6 + ((i % 7) / 7) * 0.5);
      arr[i3] = lerp(sx + drift, tx * (1 - melt * 0.55), pull);
      arr[i3 + 1] =
        lerp(sy + Math.cos(clock.current * 0.3 + i) * 0.28 * (1 - pull), ty, pull) - sink * 0.9;
      arr[i3 + 2] = lerp(sz - drift, tz * (1 - melt * 0.55), pull);
    }
    attr.needsUpdate = true;

    if (points.current) {
      const m = points.current.material as THREE.PointsMaterial;
      m.opacity = 0.9 * (1 - ease(range(t, 0.26, 0.38))) * fade;
      m.size = lerp(0.028, 0.014, pull);
    }

    if (crystal.current) {
      const mesh = crystal.current;
      const m = mesh.material as THREE.MeshPhysicalMaterial;
      const alive = form * (1 - melt);
      m.opacity = alive * fade;
      m.emissiveIntensity = 0.28 + heat * 2.4;
      m.roughness = lerp(0.06, 0.34, heat);
      mesh.visible = m.opacity > 0.01;
      // it slumps: taller-than-wide shard collapsing into a soft gather
      mesh.scale.set(lerp(0.4, 1, form) * (1 + melt * 0.5), lerp(0.4, 1, form) * (1 - melt * 0.7), lerp(0.4, 1, form) * (1 + melt * 0.5));
      mesh.position.y = -melt * 0.42;
      mesh.rotation.z = Math.sin(clock.current * 0.6) * 0.05 * melt;
    }

    if (molten.current) {
      const mesh = molten.current;
      const m = mesh.material as THREE.MeshPhysicalMaterial;
      m.opacity = melt * fade;
      m.emissiveIntensity = 1.4 + Math.sin(clock.current * 3.1) * 0.35 * melt;
      mesh.visible = m.opacity > 0.02;
      const wobble = 1 + Math.sin(clock.current * 2.4) * 0.05 * melt;
      mesh.scale.set(0.46 * melt * wobble, 0.34 * melt, 0.46 * melt * wobble);
      mesh.position.y = -0.5 - melt * 0.18;
    }

    if (halo.current) {
      const m = halo.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.14 * heat * fade;
      halo.current.scale.setScalar(lerp(1.4, 2.6, heat));
      halo.current.visible = m.opacity > 0.01;
    }

    if (furnace.current) {
      furnace.current.intensity = 6 + heat * 22 + Math.sin(clock.current * 5) * heat * 3;
      furnace.current.color.setHex(heat > 0.2 ? 0xffb45a : 0xc5a572);
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

      {/* the molten gather that the pipe will draw from */}
      <mesh ref={molten} visible={false} position={[0, -0.5, 0]}>
        <sphereGeometry args={[1, lite ? 16 : 28, lite ? 12 : 20]} />
        <meshPhysicalMaterial
          transparent
          opacity={0}
          color="#ffd79a"
          emissive="#ff9a3c"
          emissiveIntensity={1.4}
          transmission={0.5}
          thickness={0.5}
          roughness={0.22}
        />
      </mesh>

      {/* furnace bloom */}
      <mesh ref={halo} visible={false} position={[0, -0.45, -0.4]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial
          color="#ff9a3c"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <pointLight ref={furnace} position={[0, -0.3, 1.9]} color="#c5a572" intensity={6} distance={9} />
    </group>
  );
}
