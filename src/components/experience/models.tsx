import { forwardRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

import boxAsset from "@/assets/box.jpg.asset.json";

/**
 * MODEL REPLACEMENT INTERFACE
 * ---------------------------------------------------------------
 * Each product below is a self-contained group built from placeholder
 * primitives + a photo texture. To swap in a real .glb later, replace the
 * inner JSX of the matching component with:
 *
 *   const { scene } = useGLTF("/models/cq-100.glb");
 *   return <primitive object={scene} />;
 *
 * Keep the outer <group ref={ref}> untouched: every animation, camera move
 * and transition drives that group, so nothing else has to change.
 */

export const GLASS = {
  transmission: 1,
  roughness: 0,
  ior: 1.5,
  thickness: 0.5,
  envMapIntensity: 1.8,
  color: "#eef6f8",
} as const;

/* ---------------------------------- bottle --------------------------------- */
/** CQ-100 — straight-sided glass bottle */
export const Bottle = forwardRef<THREE.Group, { opacity?: number }>(function Bottle(
  { opacity = 1 },
  ref,
) {
  const transparent = opacity < 1;

  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 1.7, 64, 1]} />
        <meshPhysicalMaterial {...GLASS} transparent={transparent} opacity={opacity} />
      </mesh>
      {/* shoulder + neck */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.17, 0.42, 0.24, 48]} />
        <meshPhysicalMaterial {...GLASS} transparent={transparent} opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.24, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.34, 48]} />
        <meshPhysicalMaterial {...GLASS} transparent={transparent} opacity={opacity} />
      </mesh>
    </group>
  );
});

/* --------------------------------- stopper --------------------------------- */
/** CQ-193 — faceted glass head + cork plug */
export const Stopper = forwardRef<THREE.Group, { opacity?: number }>(function Stopper(
  { opacity = 1 },
  ref,
) {
  const transparent = opacity < 1;

  return (
    <group ref={ref}>
      {/* faceted glass head */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.22, 8]} />
        <meshPhysicalMaterial {...GLASS} transparent={transparent} opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <octahedronGeometry args={[0.14, 0]} />
        <meshPhysicalMaterial {...GLASS} transparent={transparent} opacity={opacity} />
      </mesh>
      {/* cork plug */}
      <mesh castShadow position={[0, -0.09, 0]}>
        <cylinderGeometry args={[0.155, 0.145, 0.32, 40]} />
        <meshStandardMaterial
          color="#b98a58"
          roughness={0.85}
          metalness={0}
          transparent={transparent}
          opacity={opacity}
        />
      </mesh>
    </group>
  );
});

/* ----------------------------------- box ----------------------------------- */
/** CQ-B-1 — twin-door timber presentation box */
export const GiftBox = forwardRef<
  THREE.Group,
  { leftDoor: React.RefObject<THREE.Group | null>; rightDoor: React.RefObject<THREE.Group | null> }
>(function GiftBox({ leftDoor, rightDoor }, ref) {
  const map = useTexture(boxAsset.url);
  map.colorSpace = THREE.SRGBColorSpace;

  const wood = <meshStandardMaterial map={map} color="#6b4a2f" roughness={0.6} metalness={0} />;

  return (
    <group ref={ref}>
      {/* shell: back + sides + top + bottom */}
      <mesh castShadow receiveShadow position={[0, 0, -0.42]}>
        <boxGeometry args={[1.5, 2.1, 0.08]} />
        {wood}
      </mesh>
      <mesh castShadow position={[-0.75, 0, -0.02]}>
        <boxGeometry args={[0.08, 2.1, 0.86]} />
        {wood}
      </mesh>
      <mesh castShadow position={[0.75, 0, -0.02]}>
        <boxGeometry args={[0.08, 2.1, 0.86]} />
        {wood}
      </mesh>
      <mesh castShadow position={[0, 1.05, -0.02]}>
        <boxGeometry args={[1.58, 0.08, 0.86]} />
        {wood}
      </mesh>
      <mesh castShadow receiveShadow position={[0, -1.05, -0.02]}>
        <boxGeometry args={[1.58, 0.08, 0.86]} />
        {wood}
      </mesh>

      {/* red lining */}
      <mesh position={[0, 0, -0.36]}>
        <boxGeometry args={[1.4, 2, 0.04]} />
        <meshStandardMaterial color="#6e1220" roughness={0.3} metalness={0} />
      </mesh>
      <mesh position={[0, -0.98, -0.02]}>
        <boxGeometry args={[1.4, 0.05, 0.76]} />
        <meshStandardMaterial color="#6e1220" roughness={0.3} metalness={0} />
      </mesh>

      {/* twin doors — each pivots on its own outer hinge */}
      <group ref={leftDoor} position={[-0.74, 0, 0.4]}>
        <mesh castShadow position={[0.37, 0, 0]}>
          <boxGeometry args={[0.74, 2.06, 0.06]} />
          {wood}
        </mesh>
      </group>
      <group ref={rightDoor} position={[0.74, 0, 0.4]}>
        <mesh castShadow position={[-0.37, 0, 0]}>
          <boxGeometry args={[0.74, 2.06, 0.06]} />
          {wood}
        </mesh>
      </group>
    </group>
  );
});
