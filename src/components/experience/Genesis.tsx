import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

import { clamp01, ease, lerp, pointer, range } from "@/lib/journey";

/** half-height / half-width of the triangular crystal the dust condenses into */
const CRY_R = 0.82;
const CRY_H = 1.3;

/** radius of a 3-sided polygon cross-section at a given angle */
function triRadius(angle: number) {
  const sector = ((angle % ((Math.PI * 2) / 3)) + (Math.PI * 2) / 3) % ((Math.PI * 2) / 3);
  return 1 / Math.cos(sector - Math.PI / 3);
}

/**
 * Opening of the ritual: layered warm-gold dust in a black void that reacts to
 * the pointer (attraction, close-range repulsion, light vortex), condenses into
 * one large triangular glass crystal, then heats, softens and stretches into a
 * viscous molten mass. Everything is a pure function of `tRef`, so the whole
 * thing plays backwards exactly as smoothly as it plays forwards.
 */
export function Genesis({ tRef, lite = false }: { tRef: { current: number }; lite?: boolean }) {
  const points = useRef<THREE.Points>(null);
  const crystal = useRef<THREE.Group>(null);
  const melt = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const heat = useRef<THREE.PointLight>(null);
  const clock = useRef(0);
  const { viewport } = useThree();

  const count = lite ? 560 : 1500;

  /** soft round falloff sprite — square points read as a starfield */
  const sprite = useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,244,214,1)");
    g.addColorStop(0.35, "rgba(232,201,139,0.55)");
    g.addColorStop(1, "rgba(232,201,139,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const { scatter, target, perturb, vel, geometry } = useMemo(() => {
    const scatter = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    const perturb = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // wide drifting cloud with real depth layering
      const layer = i % 3;
      // density falls off away from the centre so the cloud reads as a nebula,
      // not as an even starfield
      const r = 1.35 + Math.pow(Math.random(), 1.7) * (2.6 + layer * 1.1);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      scatter[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.15;
      scatter[i * 3 + 1] = (Math.random() - 0.5) * (3.4 + layer * 0.9);
      scatter[i * 3 + 2] = r * Math.cos(ph) * 0.85 - layer * 0.8;

      // target: the shell of a triangular bipyramid — the crystal's own faces
      const a = Math.random() * Math.PI * 2;
      const h = Math.random() * 2 - 1; // -1 bottom tip .. 1 top tip
      const taper = 1 - Math.abs(h);
      const rr = CRY_R * taper * triRadius(a) * (0.94 + Math.random() * 0.08);
      target[i * 3] = Math.cos(a) * rr;
      target[i * 3 + 1] = h * CRY_H;
      target[i * 3 + 2] = Math.sin(a) * rr;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(scatter.slice(), 3));
    return { scatter, target, perturb, vel, geometry };
  }, [count]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    clock.current += dt;
    const t = clamp01(tRef.current);

    // dust -> crystal is complete at t = 0.30 (the automatic opening stops there);
    // from that point on the visitor drives the heat, the softening and the flow.
    const pull = ease(range(t, 0.02, 0.24));
    const form = ease(range(t, 0.13, 0.3));
    const soften = ease(range(t, 0.34, 0.52));
    const fade = 1 - ease(range(t, 0.46, 0.6));

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
      // the dust dims once the solid crystal has taken over the silhouette
      m.opacity = 0.92 * fade * (1 - form * 0.72);
      m.size = lerp(0.085, 0.03, pull);
    }

    if (crystal.current) {
      const shown = form * fade;
      crystal.current.visible = shown > 0.01;
      crystal.current.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const m = mesh.material as THREE.MeshPhysicalMaterial;
        m.opacity = shown;
        m.roughness = lerp(0.03, 0.36, soften);
        m.thickness = lerp(1.35, 0.7, soften);
        // cold glass -> amber hot glass
        m.emissive.setRGB(lerp(0.42, 1, soften), lerp(0.34, 0.44, soften), lerp(0.24, 0.08, soften));
        m.emissiveIntensity = 0.22 + soften * 2.6;
      });
      // grows into place, then heats: sags, widens and loses its sharp tips
      const g = lerp(0.32, 1, form);
      crystal.current.scale.set(g * lerp(1, 1.34, soften), g * lerp(1, 0.44, soften), g * lerp(1, 1.34, soften));
      crystal.current.position.y = lerp(0, -0.34, soften);
      crystal.current.rotation.y = clock.current * 0.16;
      crystal.current.rotation.z = soften * 0.16 + Math.sin(clock.current * 1.6) * 0.02 * soften;
    }

    if (melt.current) {
      const m = melt.current.material as THREE.MeshPhysicalMaterial;
      m.opacity = soften * fade * 0.96;
      m.emissiveIntensity = 1.5 + Math.sin(clock.current * 3) * 0.35;
      melt.current.visible = m.opacity > 0.02;
      // a heavy, wobbling gather that starts to draw down towards the pipe
      const wob = 1 + Math.sin(clock.current * 2.2) * 0.05 * soften;
      melt.current.scale.set(
        lerp(0.24, 0.92, soften) * wob,
        lerp(0.24, 0.5, soften),
        lerp(0.24, 0.92, soften) * wob,
      );
      melt.current.position.y = lerp(0, -0.52, soften);
    }

    if (heat.current) {
      heat.current.intensity = 3 + soften * 26 * fade;
      heat.current.color.setRGB(1, lerp(0.78, 0.52, soften), lerp(0.5, 0.16, soften));
    }

    if (group.current) {
      group.current.visible = fade > 0.01;
      group.current.rotation.y = t * 0.9;
    }
  });

  const glass = (
    <meshPhysicalMaterial
      transparent
      opacity={0}
      transmission={1}
      thickness={1.35}
      ior={1.55}
      roughness={0.03}
      metalness={0}
      clearcoat={1}
      clearcoatRoughness={0.04}
      color="#f6ecd6"
      emissive="#6b5738"
      emissiveIntensity={0.22}
      envMapIntensity={1.5}
    />
  );

  return (
    <group ref={group}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          map={sprite}
          size={0.075}
          color="#e8c98b"
          transparent
          opacity={0.92}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* the crystal: a thick triangular bipyramid, real glass with visible mass */}
      <group ref={crystal} visible={false}>
        <mesh position={[0, CRY_H / 2, 0]}>
          <coneGeometry args={[CRY_R, CRY_H, 3, 1]} />
          {glass}
        </mesh>
        <mesh position={[0, -CRY_H / 2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[CRY_R, CRY_H, 3, 1]} />
          {glass}
        </mesh>
      </group>

      {/* the softened, high-viscosity gather that hands over to the pipe */}
      <mesh ref={melt} visible={false}>
        <sphereGeometry args={[1, lite ? 16 : 30, lite ? 12 : 22]} />
        <meshPhysicalMaterial
          transparent
          opacity={0}
          color="#ffdca2"
          emissive="#e07a1c"
          emissiveIntensity={1.5}
          transmission={0.5}
          thickness={1.1}
          roughness={0.28}
        />
      </mesh>

      <pointLight ref={heat} position={[0, -0.2, 1.6]} color="#ffb765" intensity={4} distance={9} />
    </group>
  );
}
