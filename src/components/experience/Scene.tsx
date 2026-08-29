import { Suspense, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

import { Bottle, GiftBox, Stopper } from "./models";
import { Forge } from "./Forge";
import { advanceJourney, bump, clamp01, ease, journey, lerp, overshoot, range } from "@/lib/journey";

const HOME_X = -1.85; // left third of the screen
const AUTO_SPIN = (Math.PI * 2) / 18; // one turn ≈ 18s

export function Scene({ introRef }: { introRef: { current: number } }) {
  const root = useRef<THREE.Group>(null);
  const bottleGroup = useRef<THREE.Group>(null);
  const bottleSpin = useRef<THREE.Group>(null);
  const stopperGroup = useRef<THREE.Group>(null);
  const stopperSpin = useRef<THREE.Group>(null);
  const capOnBottle = useRef<THREE.Group>(null);
  const boxGroup = useRef<THREE.Group>(null);
  const boxSpin = useRef<THREE.Group>(null);
  const leftDoor = useRef<THREE.Group>(null);
  const rightDoor = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.PointLight>(null);
  const spin = useRef(0);
  const { camera } = useThree();

  /** rigid-body state for the bottle released by the opening mould */
  const drop = useRef({
    y: 0,
    v: 0,
    tilt: 0,
    tiltV: 0,
    started: false,
    active: false,
    hits: 0,
  });

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    advanceJourney(dt);
    const p = clamp01(journey.p);
    const intro = clamp01(introRef.current);
    spin.current += dt * AUTO_SPIN;
    const rot = spin.current + journey.drag;

    /* -------------------- physics: the mould releases the bottle ------------- */
    const d = drop.current;
    if (!d.started && intro > 0.955) {
      d.started = true;
      d.active = true;
      d.y = 2.35;
      d.v = -0.4;
      d.tilt = 0.14;
      d.tiltV = -1.6;
    }
    if (d.active) {
      // gravity + substeps so the contact never tunnels
      const steps = 3;
      const h = dt / steps;
      for (let s = 0; s < steps; s++) {
        d.v -= 17 * h;
        d.y += d.v * h;
        if (d.y <= 0 && d.v < 0) {
          d.y = 0;
          d.hits += 1;
          d.v = -d.v * 0.36; // restitution — glass on steel, mostly dead
          // impact torque, alternating so the bottle rocks then settles
          d.tiltV += (d.hits % 2 === 0 ? 1 : -1) * Math.min(0.9, Math.abs(d.v)) * 2.6;
          if (Math.abs(d.v) < 0.45 && d.hits > 2) {
            d.v = 0;
            d.active = false;
          }
        }
      }
    }
    // rocking spring with inertia, damps to perfectly upright
    d.tiltV += (-78 * d.tilt - 7.5 * d.tiltV) * dt;
    d.tilt += d.tiltV * dt;
    if (!d.active && Math.abs(d.tilt) < 0.0008 && Math.abs(d.tiltV) < 0.004) {
      d.tilt = 0;
      d.tiltV = 0;
    }

    /* ------------------------------- bottle ------------------------------- */
    // station 1 -> slides left & back -> returns for the assembly -> exits ->
    // finally descends into the open box.
    const exit1 = ease(range(p, 0.14, 0.24));
    const back1 = overshoot(range(p, 0.34, 0.44));
    const exit2 = ease(range(p, 0.62, 0.7));
    const descend = ease(range(p, 0.86, 0.94));

    let bx = HOME_X;
    let by = 0;
    let bz = 0;
    let bs = 1;

    if (p < 0.3) {
      bx = HOME_X - exit1 * 5.6;
      bz = -exit1 * 3.2;
      by = d.y * (1 - exit1); // the released bottle falls, bounces, settles
    } else if (p < 0.62) {
      bx = lerp(7, HOME_X, back1);
      bz = lerp(-2.4, 0, clamp01(back1));
    } else if (p < 0.84) {
      bx = HOME_X - exit2 * 5.6;
      bz = -exit2 * 3.2;
    } else {
      // re-enters from above and settles onto the red lining
      bx = HOME_X;
      by = lerp(3.4, -0.55, descend);
      bs = lerp(0.72, 0.62, descend);
      bz = 0.05;
    }

    if (bottleGroup.current) {
      bottleGroup.current.position.set(bx, by, bz);
      bottleGroup.current.scale.setScalar(bs);
      bottleGroup.current.rotation.z = p < 0.3 ? d.tilt : 0;
      bottleGroup.current.visible = intro > 0.9 && !(p > 0.26 && p < 0.33);
    }
    if (bottleSpin.current) bottleSpin.current.rotation.y = rot;

    /* ------------------------------- stopper ------------------------------ */
    const enter2 = overshoot(range(p, 0.16, 0.28));
    const leave2 = ease(range(p, 0.36, 0.44));
    const fly = ease(range(p, 0.46, 0.58));
    const seated = p >= 0.58;

    if (stopperGroup.current) {
      const g = stopperGroup.current;
      if (p < 0.36) {
        g.position.set(lerp(4.6, HOME_X, enter2), lerp(3.6, 0, enter2), lerp(-2, 0, enter2));
      } else if (p < 0.46) {
        g.position.set(HOME_X - leave2 * 5.6, 0, -leave2 * 2.6);
      } else {
        // graceful arc onto the neck
        g.position.set(
          lerp(4.8, bx, fly),
          lerp(2.8, 1.45 * bs + by, fly) + Math.sin(fly * Math.PI) * 0.55 * (1 - fly),
          lerp(2.2, bz, fly),
        );
      }
      g.scale.setScalar(p < 0.46 ? 1 : lerp(1, bs, fly));
      g.visible = p > 0.13 && !seated;
    }
    if (stopperSpin.current) stopperSpin.current.rotation.y = rot * (p < 0.44 ? 1 : 0.4);

    if (capOnBottle.current) {
      capOnBottle.current.visible = seated;
      capOnBottle.current.position.set(0, 1.45, 0);
    }

    if (pulse.current) {
      pulse.current.position.set(bx, 1.45 * bs + by, bz + 0.2);
      pulse.current.intensity = bump(p, 0.57, 0.63) * 26;
    }

    /* --------------------------------- box -------------------------------- */
    const rise = overshoot(range(p, 0.66, 0.76));
    const doors = ease(range(p, 0.76, 0.86)) - ease(range(p, 0.94, 0.985));
    const center = ease(range(p, 0.94, 1));

    if (boxGroup.current) {
      boxGroup.current.visible = p > 0.63;
      boxGroup.current.position.set(lerp(HOME_X, 0, center), lerp(-5.2, -0.05, rise), 0);
      boxGroup.current.scale.setScalar(lerp(0.92, 0.98, center));
    }
    if (boxSpin.current) boxSpin.current.rotation.y = center > 0 ? rot * 0.8 : journey.drag * 0.6;
    const angle = doors * (Math.PI * 0.62);
    if (leftDoor.current) leftDoor.current.rotation.y = angle;
    if (rightDoor.current) rightDoor.current.rotation.y = -angle;

    /* -------------------------- camera / final pull ----------------------- */
    const closeUp = bump(p, 0.56, 0.68);
    const pullOut = ease(range(p, 0.95, 1));
    camera.position.x = lerp(0, HOME_X * 0.35, closeUp) * (1 - pullOut);
    camera.position.y = lerp(0, 0.35, closeUp);
    camera.position.z = lerp(6.2 - closeUp * 1.7, 7.6, pullOut);
    camera.lookAt(lerp(HOME_X * 0.55, 0, pullOut), lerp(0, 0.1, pullOut), 0);

    if (root.current) {
      root.current.scale.setScalar(lerp(1, 0.82, pullOut));
      root.current.position.y = lerp(0, 0.5, pullOut);
    }
  });

  return (
    <group ref={root}>
      {/* three-point product lighting */}
      <ambientLight intensity={0.25} />
      <directionalLight position={[-4, 5, 4]} intensity={2.6} castShadow />
      <directionalLight position={[4.5, 1.5, 3]} intensity={1.1} />
      <directionalLight position={[0, 3.5, -5]} intensity={2.2} color="#dbeaf2" />
      <pointLight ref={pulse} color="#c5a572" distance={5} intensity={0} />

      <Environment resolution={256}>
        <Lightformer intensity={2.2} position={[0, 5, 2]} scale={[10, 10, 1]} />
        <Lightformer
          intensity={1.1}
          color="#9fc4d6"
          position={[-6, 1, -2]}
          rotation-y={Math.PI / 2}
          scale={[18, 3, 1]}
        />
        <Lightformer
          intensity={0.9}
          color="#c5a572"
          position={[6, 0, 1]}
          rotation-y={-Math.PI / 2}
          scale={[18, 3, 1]}
        />
      </Environment>

      <Suspense fallback={null}>
        <group ref={bottleGroup}>
          <group ref={bottleSpin}>
            <Bottle />
            <group ref={capOnBottle} visible={false}>
              <Stopper />
            </group>
          </group>
        </group>

        <group ref={stopperGroup}>
          <group ref={stopperSpin}>
            <Stopper />
          </group>
        </group>

        <group ref={boxGroup}>
          <group ref={boxSpin}>
            <GiftBox leftDoor={leftDoor} rightDoor={rightDoor} />
          </group>
        </group>
      </Suspense>

      <Forge tRef={introRef} />

      <ContactShadows
        position={[0, -1.25, 0]}
        opacity={0.5}
        scale={14}
        blur={3.2}
        far={4}
        color="#000000"
      />
    </group>
  );
}
