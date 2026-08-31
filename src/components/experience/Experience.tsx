import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";

import { Scene } from "./Scene";
import { Panel } from "./Panel";
import { IntroGate } from "./IntroGate";
import { ForgeSequence } from "./ForgeSequence";
import { Genesis } from "./Genesis";

import { journey, quality, stationFor, type Station } from "@/lib/journey";

/** how much upward wheel/touch travel (in px) completes the forge ritual */
const RITUAL_TRAVEL = 2600;

export function Experience() {
  const track = useRef<HTMLDivElement>(null);
  const introRef = useRef(0);
  const introTarget = useRef(0);
  const [station, setStation] = useState<Station>("bottle");
  const [progress, setProgress] = useState(0);
  const [introProgress, setIntroProgress] = useState(0);
  const [introDone, setIntroDone] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [lowPower, setLowPower] = useState(false);

  /* device tier: phones, low-memory devices, and slow frames use a lighter renderer */
  useEffect(() => {
    const weak =
      window.matchMedia("(max-width: 768px)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4 ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
    quality.lite = weak;
    setMobile(weak);

    let frames = 0;
    let started = performance.now();
    let raf = 0;
    const sample = (now: number) => {
      if (frames === 0) started = now;
      frames += 1;
      if (frames === 45) {
        const average = (now - started) / frames;
        if (average > 24) {
          quality.lite = true;
          setLowPower(true);
        }
      } else {
        raf = requestAnimationFrame(sample);
      }
    };
    raf = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* ---- the opening is driven by the user pushing upward, never by a timer ---- */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let done = false;

    const push = (px: number) => {
      if (done) return;
      introTarget.current = Math.min(1, Math.max(0, introTarget.current + px / RITUAL_TRAVEL));
    };

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // critically damped follow: smooth even with coarse wheel steps
      introRef.current += (introTarget.current - introRef.current) * (1 - Math.exp(-7 * dt));
      const shown = Math.round(introRef.current * 100) / 100;
      setIntroProgress((p) => (p === shown ? p : shown));
      if (!done && introRef.current > 0.995) {
        done = true;
        introRef.current = 1;
        setIntroDone(true);
        document.body.style.overflow = "";
        window.scrollTo({ top: 0 });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onWheel = (e: WheelEvent) => {
      if (done) return;
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      push(-dy); // scrolling up (negative deltaY) advances the ritual
    };

    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (done) return;
      const y = e.touches[0]?.clientY;
      if (y == null || touchY == null) return;
      e.preventDefault();
      push((touchY - y) * 2.2); // swiping up
      touchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === "ArrowUp" || e.key === "PageUp" || e.key === " ") {
        e.preventDefault();
        push(360);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  /* ---- scroll drives the camera path, one-to-one ---- */
  useEffect(() => {
    const onScroll = () => {
      const el = track.current;
      if (!el) return;
      const span = el.offsetHeight - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, (window.scrollY - el.offsetTop) / span)) : 0;
      journey.target = p;
      setProgress((prev) => (Math.abs(prev - p) < 0.002 ? prev : p));
      setStation(stationFor(p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* ---- drag to rotate the object under the cursor ---- */
  useEffect(() => {
    let last: number | null = null;
    const down = (e: PointerEvent) => {
      last = e.clientX;
    };
    const move = (e: PointerEvent) => {
      if (last === null) return;
      journey.dragV += ((e.clientX - last) / window.innerWidth) * 26;
      last = e.clientX;
    };
    const up = () => {
      last = null;
    };
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <>
      {/* fixed WebGL stage */}
      <div className="fixed inset-0 z-0">
        <Canvas
          shadows="basic"
          dpr={[1, mobile || lowPower ? 1.15 : 1.45]}
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          gl={{ antialias: !(mobile || lowPower), powerPreference: "high-performance" }}
        >
          <color attach="background" args={["#000000"]} />
          {!introDone && <Genesis tRef={introRef} lite={mobile || lowPower} />}
          <Suspense fallback={null}>
            {!introDone && <ForgeSequence tRef={introRef} lite={mobile || lowPower} />}
          </Suspense>
          <Scene introRef={introRef} lite={mobile || lowPower} />
        </Canvas>
      </div>

      <IntroGate progress={introProgress} done={introDone} />

      {/* scroll track: 1 : 1 mapping between page scroll and camera path */}
      <div ref={track} className="relative h-[760vh]">
        {introDone && <Panel station={station} />}

        <AnimatePresence>
          {introDone && progress < 0.02 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none fixed inset-x-0 bottom-10 z-20 flex flex-col items-center gap-3 text-[10px] tracking-[0.5em] text-muted-foreground uppercase"
            >
              <span>Scroll to explore</span>
              <span className="h-10 w-px bg-gradient-to-b from-accent to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* closing frame — sits at the end of the track, it never follows the scroll */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-screen items-end justify-center pb-[14vh] text-center">
          <motion.div
            animate={{ opacity: progress > 0.95 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-light tracking-tight md:text-6xl">Ready for the world.</h2>
            <p className="mt-4 text-[10px] tracking-[0.42em] text-muted-foreground uppercase md:text-[11px] md:tracking-[0.5em]">
              Jining Chunqiu Import &amp; Export Co., Ltd.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
