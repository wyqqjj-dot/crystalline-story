import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { clamp01, ease, journey, range } from "@/lib/journey";

/**
 * Closing stage of the journey: the finished export cartons ride a container
 * ship that grows out of the distance and sweeps across the frame, carrying the
 * black-gold industrial light into the company content below. Purely a function
 * of the shared scroll progress, so it reverses with the rest of the story.
 */
const COLS = 7;
const ROWS = 3;

export function Voyage({ lite = false }: { lite?: boolean }) {
  const root = useRef<THREE.Group>(null);
  const boxes = useRef<THREE.InstancedMesh>(null);
  const hull = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const palette = useMemo(
    () => [new THREE.Color("#8d6b3a"), new THREE.Color("#4c4a47"), new THREE.Color("#6f5730")],
    [],
  );

  useFrame((state) => {
    const p = clamp01(journey.p);
    // loading -> approach -> sweep across the frame -> gone
    const load = ease(range(p, 0.9, 0.955));
    const approach = ease(range(p, 0.9, 0.98));
    const sweep = ease(range(p, 0.96, 1));
    const shown = range(p, 0.885, 0.91) * (1 - ease(range(p, 0.995, 1)));

    if (root.current) {
      root.current.visible = shown > 0.01;
      if (!root.current.visible) return;
      const scale = 0.32 + approach * 1.15;
      root.current.scale.setScalar(scale);
      root.current.position.set(
        -14 + approach * 12.5 + sweep * 26,
        -1.5 + approach * 0.5 + Math.sin(state.clock.elapsedTime * 0.6) * 0.05,
        -16 + approach * 12.5,
      );
      root.current.rotation.y = -0.22 + sweep * 0.1;
    }
    if (hull.current) {
      hull.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.7) * 0.012;
    }
    if (boxes.current) {
      // containers land one after another as the ship closes in
      let i = 0;
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS; r++) {
          const order = (c * ROWS + r) / (COLS * ROWS);
          const set = clamp01((load - order * 0.85) * 6);
          dummy.position.set(-3 + c * 1.02, 0.62 + r * 0.44, 0);
          dummy.position.y += (1 - set) * 3.4;
          dummy.scale.set(0.96, 0.4, 1.5 * (0.35 + 0.65 * set));
          dummy.rotation.set(0, 0, (1 - set) * 0.2);
          dummy.updateMatrix();
          boxes.current.setMatrixAt(i, dummy.matrix);
          boxes.current.setColorAt(i, palette[(c + r) % palette.length]!);
          i += 1;
        }
      }
      boxes.current.instanceMatrix.needsUpdate = true;
      if (boxes.current.instanceColor) boxes.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={root} visible={false}>
      <group ref={hull}>
        {/* hull */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[9.4, 1.1, 2.2]} />
          <meshStandardMaterial color="#141414" roughness={0.62} metalness={0.35} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <boxGeometry args={[8.6, 0.36, 1.9]} />
          <meshStandardMaterial color="#3a2a16" roughness={0.8} />
        </mesh>
        {/* bow */}
        <mesh position={[5.1, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[1.1, 1.4, 4]} />
          <meshStandardMaterial color="#141414" roughness={0.62} metalness={0.35} />
        </mesh>
        {/* deck house + funnel */}
        <mesh position={[-3.9, 1.15, 0]}>
          <boxGeometry args={[1.2, 1.5, 1.9]} />
          <meshStandardMaterial color="#1d1d1d" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[-4.4, 2.15, 0]}>
          <cylinderGeometry args={[0.22, 0.26, 0.7, lite ? 8 : 14]} />
          <meshStandardMaterial color="#c5a572" roughness={0.45} metalness={0.6} />
        </mesh>
        {/* containers */}
        <instancedMesh ref={boxes} args={[undefined, undefined, COLS * ROWS]} position={[0.7, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial roughness={0.72} metalness={0.12} />
        </instancedMesh>
      </group>

      <pointLight position={[-2, 2.4, 3]} color="#f0d8a4" intensity={18} distance={22} />
    </group>
  );
}
