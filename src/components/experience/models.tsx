import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { MeshTransmissionMaterial, useGLTF, useTexture } from "@react-three/drei";

import boxAsset from "@/assets/box.jpg.asset.json";
import bottleModel from "@/assets/bottle-cq100.glb.asset.json";
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
/** CQ-100 — the reference-photo bottle geometry, finished as super-flint glass. */
export const Bottle = forwardRef<THREE.Group, { opacity?: number }>(function Bottle(
  { opacity = 1 },
  ref,
) {
  const gltf = useGLTF(bottleModel.url);

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
      {/* model is normalised to height 1 with its base at y = 0 */}
      <group scale={2.3} position={[0, -0.85, 0]}>
        <mesh geometry={geometry} castShadow>
          <MeshTransmissionMaterial
            samples={quality.lite ? 3 : 6}
            resolution={quality.lite ? 128 : 256}
            transmission={1}
            thickness={0.32}
            ior={1.52}
            chromaticAberration={0.045}
            anisotropicBlur={0.1}
            distortion={0.12}
            distortionScale={0.28}
            temporalDistortion={0.06}
            roughness={0.02}
            clearcoat={1}
            clearcoatRoughness={0.03}
            attenuationDistance={6}
            attenuationColor="#fffaf0"
            color="#fffdf7"
            backside
            backsideThickness={0.18}
            transparent={opacity < 1}
            opacity={opacity}
            envMapIntensity={3.4}
          />
        </mesh>
      </group>
    </group>
  );
});

useGLTF.preload(bottleModel.url);

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
/** CQ-B-1 — the uploaded production presentation box, with animated doors. */
export const GiftBox = forwardRef<
  THREE.Group,
  { leftDoor: React.RefObject<THREE.Group | null>; rightDoor: React.RefObject<THREE.Group | null> }
>(function GiftBox({ leftDoor, rightDoor }, ref) {
  const { scene } = useGLTF(boxModelAsset.url);
  const model = useMemo(() => scene.clone(true), [scene]);

  return (
    <group ref={ref}>
      <primitive object={model} scale={0.2} position={[0, 0, 0]} />
      {/* stable hinge groups remain available to the choreography */}
      <group ref={leftDoor} />
      <group ref={rightDoor} />
    </group>
  );
});

useGLTF.preload(boxModelAsset.url);
