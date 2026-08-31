import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

import bottleAsset from "@/assets/cq68yx-bottle.stl.asset.json";
import boxModelAsset from "@/assets/box.glb.asset.json";
import { CAP_MODEL } from "@/lib/catalog";
import { quality } from "@/lib/journey";

/**
 * MODEL INTERFACE
 * ---------------------------------------------------------------
 * The bottle is the client's own CAD geometry (STL -> GLB, crease-smoothed).
 * The closure is lathed from a hand-tuned profile so it reads as turned glass
 * and real cork rather than faceted primitives.
 *
 * Every animation drives the OUTER <group ref={ref}>, so swapping the inner
 * geometry never touches the choreography.
 */

/** shared physical-glass tuning for the simple (non-refractive) parts */
export const GLASS = {
  transmission: 1,
  roughness: 0.02,
  ior: 1.5,
  thickness: 0.45,
  clearcoat: 1,
  clearcoatRoughness: 0.04,
  envMapIntensity: 2.4,
  color: "#fffdf7",
} as const;

/** smooth lathe helper: sample a profile as a rounded curve */
function lathe(points: [number, number][], segments = 96) {
  const curve = new THREE.CatmullRomCurve3(
    points.map(([x, y]) => new THREE.Vector3(x, y, 0)),
    false,
    "catmullrom",
    0.4,
  );
  const pts = curve.getPoints(48).map((p) => new THREE.Vector2(Math.max(p.x, 0.0001), p.y));
  return new THREE.LatheGeometry(pts, segments);
}

/* ---------------------------------- bottle --------------------------------- */
/** CQ-68 — the uploaded production STL, finished as high-transmission glass. */
export const Bottle = forwardRef<THREE.Group, { opacity?: number }>(function Bottle(
  { opacity = 1 },
  ref,
) {
  const geometry = useLoader(STLLoader, bottleAsset.url);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        transmission: 1,
        thickness: 0.32,
        ior: 1.52,
        roughness: 0.018,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
        attenuationDistance: 6,
        attenuationColor: new THREE.Color("#fffaf0"),
        color: new THREE.Color("#fffdf7"),
        envMapIntensity: 3.4,
        transparent: opacity < 1,
        opacity,
      }),
    [opacity],
  );

  return (
    <group ref={ref}>
      {/* source STL is 257 units tall; this normalises it to a 2.3-unit bottle */}
      <mesh geometry={geometry} material={material} scale={0.009} position={[0, -1.15, 0]} castShadow />
    </group>
  );
});

/* --------------------------------- stopper --------------------------------- */
/**
 * CQ-193 — the client's own closure geometry (GLB, decimated + hole-filled so
 * the crown reads as one sealed piece of glass). The supplied model is
 * untextured, so it is finished here as the polished clear glass of the
 * reference photograph.
 */
export const Stopper = forwardRef<THREE.Group, { opacity?: number }>(function Stopper(
  { opacity = 1 },
  ref,
) {
  const transparent = opacity < 1;
  const gltf = useGLTF(CAP_MODEL);

  const geometry = useMemo(() => {
    let found: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!found && m.isMesh && m.geometry) found = m.geometry;
    });
    return found;
  }, [gltf]);

  if (!geometry) return <group ref={ref} />;

  return (
    <group ref={ref}>
      {/* sealed clear-glass crown: the underside is intentionally closed */}
      <group scale={0.55} position={[0, 0.14, 0]}>
        <mesh geometry={geometry} castShadow>
          <meshPhysicalMaterial
            {...GLASS}
            thickness={0.72}
            attenuationDistance={4}
            attenuationColor="#f5ead2"
            transparent={transparent}
            opacity={opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* recessed frosted plug and a thin sealed underside, based on the reference views */}
        <mesh position={[0, -0.42, 0]} castShadow>
          <cylinderGeometry args={[0.29, 0.32, 0.34, 64]} />
          <meshPhysicalMaterial
            color="#e7e0d2"
            roughness={0.62}
            metalness={0}
            transmission={0.18}
            thickness={0.16}
            transparent={transparent}
            opacity={opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.595, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.025, 64]} />
          <meshPhysicalMaterial
            color="#f7f1e5"
            roughness={0.48}
            transmission={0.08}
            transparent={transparent}
            opacity={opacity}
          />
        </mesh>
      </group>
    </group>
  );
});

useGLTF.preload(CAP_MODEL);

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
