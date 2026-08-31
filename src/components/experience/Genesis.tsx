import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { clamp01, ease, lerp, pointer, range } from "@/lib/journey";

/**
 * Stage 1-3 of the ritual: layered gold dust in a black void that reacts to the
 * pointer (attraction, close-range repulsion, light vortex), then condenses
 * into a crystal and softens into molten glass — all driven purely by `tRef`,
 * so the whole thing plays backwards just as smoothly as forwards.
 */
export function Genesis({ tRef, lite = false }: { tRef: { current: number }; lite?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const melt = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const { viewport } = useThree();

  const count = lite ? 620 : 1800;

  const { scatter, target, perturb, vel, geometry } = useMemo(() => {
    const scatter = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const perturb = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // wide drifting cloud with real depth layering
      const layer = i % 3;
      const r = 2.4 + Math.random() * (3.2 + layer * 1.5);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      scatter[i * 3] = r * Math.sin(ph) * Math.cos(th);
      scatter[i * 3 + 1] = (Math.random() - 0.5) * 6.8;
      scatter[i * 3 + 2] = r * Math.cos(ph) * 0.8 - layer * 0.9;

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
    return { scatter, target, perturb, vel, geometry };
  }, [count]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    clock.current += dt;
    const t = clamp01(tRef.current);

    // gather -> shard -> molten softening -> hand over to the forge sequence
    const pull = ease(range(t, 0.05, 0.34));
    const form = ease(range(t, 0.24, 0.4));
    const soften = ease(range(t, 0.36, 0.5));
    const fade = 1 - ease(range(t, 0.42, 0.56));

    // pointer in world space (only meaningful while the cloud is still loose)
    const px = pointer.x * (viewport.width / 2);
    const py = pointer.y * (viewport.height / 2);
    const reach = 1 - pull;

    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const sx = scatter[i3] ?? 0;
      const sy = scatter[i3 + 1] ?? 0;
      const sz = scatter[i3 + 2] ?? 0;

      if (reach > 0.02 && pointer.active) {
        const bx = sx + (perturb[i3] ?? 0);
        const by = sy + (perturb[i3 + 1] ?? 0);
        const dx = px - bx;
        const dy = py - by;
        const d2 = dx * dx + dy * dy + 0.35;
        const d = Math.sqrt(d2);
        // attraction at range, repulsion very close, tangential vortex always
        const radial = (pointer.press ? -5.2 : 3.4) / d2 - 2.6 / (d2 * d2);
        const swirl = 1.7 / d2;
        vel[i3] = (vel[i3] ?? 0) + ((dx / d) * radial - (dy / d) * swirl) * reach * dt * 6;
        vel[i3 + 1] = (vel[i3 + 1] ?? 0) + ((dy / d) * radial + (dx / d) * swirl) * reach * dt * 6;
      }
      // springy return so nothing drifts away permanently
      vel[i3] = (vel[i3] ?? 0) - (perturb[i3] ?? 0) * dt * 3.2;
      vel[i3 + 1] = (vel[i3 + 1] ?? 0) - (perturb[i3 + 1] ?? 0) * dt * 3.2;
      const damp = Math.exp(-2.4 * dt);
      vel[i3] = (vel[i3] ?? 0) * damp;
      vel[i3 + 1] = (vel[i3 + 1] ?? 0) * damp;
      perturb[i3] = (perturb[i3] ?? 0) + (vel[i3] ?? 0) * dt;
      perturb[i3 + 1] = (perturb[i3 + 1] ?? 0) + (vel[i3 + 1] ?? 0) * dt;

      const tx = target[i3] ?? 0;
      const ty = target[i3 + 1] ?? 0;
      const tz = target[i3 + 2] ?? 0;
      const drift = Math.sin(clock.current * 0.35 + i * 0.7) * 0.22 * reach;
      // swirl inward while converging: particles rotate as they collapse
      const swirlAngle = pull * 2.4 + i * 0.0007;
      const cos = Math.cos(swirlAngle);
      const sin = Math.sin(swirlAngle);
      const ox = sx + drift + (perturb[i3] ?? 0) * reach;
      const oz = sz - drift;
      arr[i3] = lerp(ox * cos - oz * sin, tx, pull);
      arr[i3 + 1] = lerp(
        sy + Math.cos(clock.current * 0.3 + i) * 0.28 * reach + (perturb[i3 + 1] ?? 0) * reach,
        ty,
        pull,
      );
      arr[i3 + 2] = lerp(ox * sin + oz * cos, tz, pull);
    }
    attr.needsUpdate = true;

    if (points.current) {
      const m = points.current.material as THREE.PointsMaterial;
      m.opacity = 0.9 * fade;
      m.size = lerp(0.03, 0.014, pull);
    }
    if (crystal.current) {
      const m = crystal.current.material as THREE.MeshPhysicalMaterial;
      m.opacity = form * fade;
      m.roughness = lerp(0.06, 0.34, soften);
      m.emissiveIntensity = 0.28 + soften * 1.9;
      crystal.current.visible = m.opacity > 0.01;
      crystal.current.scale.set(
        lerp(0.4, 1, form) * lerp(1, 1.22, soften),
        lerp(0.4, 1, form) * lerp(1, 0.58, soften),
        lerp(0.4, 1, form) * lerp(1, 1.22, soften),
      );
      crystal.current.rotation.x = soften * 0.3;
    }
    if (melt.current) {
      const m = melt.current.material as THREE.MeshPhysicalMaterial;
      m.opacity = soften * fade * 0.95;
      m.emissiveIntensity = 1.4 + Math.sin(clock.current * 3) * 0.3;
      melt.current.visible = m.opacity > 0.02;
      const wob = 1 + Math.sin(clock.current * 2.4) * 0.04 * soften;
      melt.current.scale.set(lerp(0.2, 0.78, soften) * wob, lerp(0.2, 0.5, soften), lerp(0.2, 0.78, soften) * wob);
      melt.current.position.y = lerp(0, -0.42, soften);
    }
    if (group.current) {
      group.current.rotation.y = clock.current * 0.1 + t * 1.4;
      group.current.visible = fade > 0.01;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          size={0.028}
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

      {/* the softened, high-viscosity gather that hands over to the pipe */}
      <mesh ref={melt} visible={false}>
        <sphereGeometry args={[1, lite ? 16 : 28, lite ? 12 : 20]} />
        <meshPhysicalMaterial
          transparent
          opacity={0}
          color="#ffe9b8"
          emissive="#d59b3a"
          emissiveIntensity={1.4}
          transmission={0.55}
          thickness={0.9}
          roughness={0.25}
        />
      </mesh>

      <pointLight position={[0, 0, 2]} color="#c5a572" intensity={6} distance={7} />
    </group>
  );
}
