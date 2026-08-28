import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";

import { Scene } from "./Scene";
import { Panel } from "./Panel";
import { journey, stationFor, type Station } from "@/lib/journey";

const INTRO_MS = 5200;

export function Experience() {
  const track = useRef<HTMLDivElement>(null);
  const introRef = useRef(0);
  const [station, setStation] = useState<Station>("bottle");
  const [progress, setProgress] = useState(0);
  const [introDone, setIntroDone] = useState(false);

  /* ---- opening sequence: the only auto-played animation on the site ---- */
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / INTRO_MS);
      introRef.current = t;
      if (t >= 1) setIntroDone(true);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    document.body.style.overflow = "hidden";
    const unlock = window.setTimeout(() => {
      document.body.style.overflow = "";
    }, INTRO_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(unlock);
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
      setProgress(p);
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

  const inTrack = progress > 0 && progress < 1;

  return (
    <>
      {/* fixed WebGL stage */}
      <div className="fixed inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#0a0a0a"]} />
          <Scene introRef={introRef} />
        </Canvas>
      </div>

      {/* scroll track: 1 : 1 mapping between page scroll and camera path */}
      <div ref={track} className="relative h-[760vh]">
        <Panel station={station} />

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

        {/* final frame */}
        <motion.div
          animate={{ opacity: progress > 0.97 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none fixed inset-x-0 bottom-[12vh] z-20 text-center"
        >
          <h2 className="text-4xl font-light tracking-tight md:text-6xl">Ready for the world.</h2>
          <p className="mt-4 text-[11px] tracking-[0.5em] text-muted-foreground uppercase">
            Jining Chunqiu Import &amp; Export Co., Ltd.
          </p>
        </motion.div>

        {/* progress rail */}
        <div className="pointer-events-none fixed top-1/2 left-5 z-20 hidden h-40 w-px -translate-y-1/2 bg-white/12 md:block">
          <motion.div
            className="w-px bg-accent"
            style={{ height: `${Math.max(2, progress * 100)}%` }}
          />
        </div>
        <span className="pointer-events-none fixed bottom-8 left-5 z-20 hidden text-[10px] tracking-[0.4em] text-muted-foreground uppercase md:block">
          {inTrack ? String(Math.round(progress * 100)).padStart(2, "0") : "00"} / 100
        </span>
      </div>
    </>
  );
}
