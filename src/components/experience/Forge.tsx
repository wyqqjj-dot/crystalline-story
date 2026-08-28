import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { clamp01, ease, lerp, range } from "@/lib/journey";

const COUNT = 1100;

const FURNACE = new THREE.Vector3(0.95, 1.5, 0);
const MOLD = new THREE.Vector3(-1.85, 0, 0);
const MID = new THREE.Vector3(0.2, 0.85, 0.1);

/** quadratic bezier point along the delivery pipe */
function pipeAt(s: number, out: THREE.Vector3) {
  const u = 1 - s;
  out.set(
    u * u * FURNACE.x + 2 * u * s * MID.x + s * s * MOLD.x,
    u * u * FURNACE.y + 2 * u * s * MID.y + s * s * MOLD.y,
    u * u * FURNACE.z + 2 * u * s * MID.z + s * s * MOLD.z,
  );
  return out;
}

/**
 * The forge ritual — driven entirely by the user pushing the page upward.
 *
 *   crystal lifted into the furnace -> molten bubbling -> the stream runs
 *   down the pipe -> the mould fills -> the mould opens -> the bottle.
 *
 * `tRef` is 0..1 and is written by the scroll-up gesture, never by a timer.
 */
export function Forge({ tRef }: { tRef: { current: number } }) {
  const points = useRef<THREE.Points>(null);
  const crystal = useRef<THREE.Mesh>(null);
  const furnace = useRef<THREE.Group>(null);
  const glow = useRef<THREE.PointLight>(null);
  const moldL = useRef<THREE.Group>(null);
  const moldR = useRef<THREE.Group>(null);
  const pipe = useRef<THREE.Mesh>(null);

  const data = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    const bottle = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      seed[i] = Math.random();
      // bottle silhouette (body -> shoulder -> neck), local to the mould
      const h = Math.random();
      let r: number;
      let y: number;
      if (h < 0.72) {
        r = 0.4;
        y = -0.85 + h * (1.7 / 0.72);
      } else if (h < 0.86) {
        const k = (h - 0.72) / 0.14;
        r = lerp(0.4, 0.17, k);
        y = 0.85 + k * 0.24;
      } else {
        const k = (h - 0.86) / 0.14;
        r = 0.16;
        y = 1.09 + k * 0.34;
      }
      const a = Math.random() * Math.PI * 2;
      bottle.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
      positions.set([FURNACE.x, FURNACE.y, FURNACE.z], i * 3);
    }
    return { positions, seed, bottle };
  }, []);

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = clamp01(tRef.current);
    const time = state.clock.elapsedTime;
    const { positions, seed, bottle } = data;

    /* ---------------------------- the crystal ---------------------------- */
    const lift = ease(range(t, 0, 0.24));
    if (crystal.current) {
      const s = (1 - range(t, 0.24, 0.34)) * 0.62;
      crystal.current.visible = s > 0.01;
      crystal.current.position.set(
        lerp(0, FURNACE.x, lift),
        lerp(-1.5, FURNACE.y, lift),
        lerp(0.6, 0, lift),
      );
      crystal.current.scale.setScalar(s);
      crystal.current.rotation.y += dt * (0.6 + lift * 5);
      crystal.current.rotation.x += dt * (0.3 + lift * 3);
    }

    /* ---------------------------- the furnace ---------------------------- */
    const heat = range(t, 0.2, 0.34) * (1 - range(t, 0.72, 0.86));
    if (furnace.current) {
      furnace.current.visible = t > 0.08 && t < 0.9;
      const wob = 0.66 * (1 + Math.sin(time * 2.4) * 0.015 * heat);
      furnace.current.scale.setScalar(wob);
    }
    if (glow.current) {
      glow.current.intensity = heat * (3.4 + Math.sin(time * 9) * 1.1);
    }
    if (pipe.current) {
      const flow = range(t, 0.4, 0.5) * (1 - range(t, 0.8, 0.9));
      (pipe.current.material as THREE.MeshStandardMaterial).opacity = 0.35 + flow * 0.5;
      pipe.current.visible = t > 0.3 && t < 0.92;
    }

    /* ----------------------------- the mould ----------------------------- */
    const open = ease(range(t, 0.86, 1));
    const moldIn = ease(range(t, 0.42, 0.56));
    for (const [ref, dir] of [
      [moldL, -1],
      [moldR, 1],
    ] as const) {
      const g = ref.current;
      if (!g) continue;
      g.visible = t > 0.4 && open < 0.98;
      g.position.set(MOLD.x + dir * (0.34 + (1 - moldIn) * 1.6 + open * 2.1), MOLD.y, 0);
      g.rotation.z = dir * open * 0.28;
      g.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
        m.opacity = moldIn * (1 - open);
        m.emissiveIntensity = (heat * 0.12 + range(t, 0.6, 0.8) * 0.3) * (1 - open);
      });
    }

    /* --------------------------- molten particles ------------------------- */
    const geo = points.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes['position']!.array as Float32Array;
    const toFlow = ease(range(t, 0.4, 0.56));
    const toFill = ease(range(t, 0.62, 0.86));

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const s = seed[i]!;

      // bubbling inside the crucible
      const ba = time * (0.8 + s * 1.6) + s * 40;
      const br = 0.1 + s * 0.22;
      const bx = FURNACE.x + Math.cos(ba) * br;
      const by = FURNACE.y + Math.sin(time * (1.4 + s * 2) + s * 20) * 0.16;
      const bz = FURNACE.z + Math.sin(ba * 1.3) * br;

      // running down the pipe
      const sp = (s + time * 0.28) % 1;
      pipeAt(sp, tmp);
      const fx = tmp.x + Math.sin(time * 3 + s * 12) * 0.03;
      const fy = tmp.y + Math.cos(time * 2.6 + s * 9) * 0.03;
      const fz = tmp.z + Math.sin(time * 2.2 + s * 5) * 0.03;

      const mx = MOLD.x + bottle[i3]!;
      const my = MOLD.y + bottle[i3 + 1]!;
      const mz = bottle[i3 + 2]!;

      const px = lerp(lerp(bx, fx, toFlow), mx, toFill);
      const py = lerp(lerp(by, fy, toFlow), my, toFill);
      const pz = lerp(lerp(bz, fz, toFlow), mz, toFill);

      arr[i3] = px;
      arr[i3 + 1] = py;
      arr[i3 + 2] = pz;
    }
    geo.attributes['position']!.needsUpdate = true;

    const mat = points.current!.material as THREE.PointsMaterial;
    mat.opacity = clamp01(range(t, 0.18, 0.3)) * (1 - range(t, 0.88, 0.97));
    mat.size = lerp(0.05, 0.02, range(t, 0.3, 0.8));
    // molten orange cools to glass blue as it settles in the mould
    mat.color.setRGB(
      lerp(1, 0.86, toFill),
      lerp(0.52, 0.92, toFill),
      lerp(0.18, 0.95, toFill),
    );
    if (positions.length === 0) return;
  });

  return (
    <group>
      {/* raw crystal */}
      <mesh ref={crystal}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0}
          ior={1.7}
          thickness={0.8}
          color="#eef6f8"
          envMapIntensity={2}
        />
      </mesh>

      {/* crucible */}
      <group ref={furnace} position={FURNACE}>
        <mesh>
          <torusGeometry args={[0.62, 0.07, 12, 40]} />
          <meshStandardMaterial
            color="#242424"
            roughness={0.5}
            metalness={0.8}
            emissive="#ff6a1e"
            emissiveIntensity={0.22}
          />
        </mesh>
        <mesh position={[0, -0.34, 0]}>
          <cylinderGeometry args={[0.6, 0.36, 0.6, 32, 1, true]} />
          <meshStandardMaterial
            color="#181818"
            roughness={0.6}
            metalness={0.7}
            side={THREE.DoubleSide}
            emissive="#ff5a12"
            emissiveIntensity={0.18}
          />
        </mesh>
        <pointLight ref={glow} color="#ff7a2a" distance={4.2} decay={2} intensity={0} />
      </group>

      {/* delivery pipe */}
      <mesh
        ref={pipe}
        position={[(FURNACE.x + MOLD.x) / 2 + 0.05, (FURNACE.y + MOLD.y) / 2, 0]}
        rotation={[0, 0, Math.atan2(MOLD.x - FURNACE.x, FURNACE.y - MOLD.y)]}
      >
        <cylinderGeometry args={[0.075, 0.075, FURNACE.distanceTo(MOLD) * 1.02, 16, 1, true]} />
        <meshStandardMaterial
          color="#4a4a4a"
          roughness={0.4}
          metalness={0.9}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* two-part mould */}
      {[moldL, moldR].map((ref, i) => (
        <group key={i} ref={ref}>
          <mesh>
            <boxGeometry args={[0.4, 2.2, 0.95]} />
            <meshStandardMaterial
              color="#232323"
              roughness={0.45}
              metalness={0.85}
              emissive="#ff5a12"
              emissiveIntensity={0}
              transparent
              opacity={0}
            />
          </mesh>
        </group>
      ))}

      <points ref={points} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[data.positions, 3]}
            count={COUNT}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          color="#ff8a3c"
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
