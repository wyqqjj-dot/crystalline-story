import { useEffect, useRef, useState } from "react";

import { FORGE } from "@/lib/catalog";
import { clamp01 } from "@/lib/journey";

/**
 * The forge ritual, scrubbed by the upward scroll gesture.
 *
 * Crystal shatters into molten glass -> the pour runs into the steel mould ->
 * the mould fills and the bottle forms. Nothing plays on its own: every frame
 * is a direct function of how far the user has pushed the page upward.
 */
export function ForgeFilm({ tRef, done }: { tRef: { current: number }; done: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    setSmall(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  useEffect(() => {
    let raf = 0;
    let shownT = -1;
    let shownO = -1;
    const loop = () => {
      const t = clamp01(tRef.current);
      const el = video.current;
      if (el && el.duration > 0) {
        // the film owns the melt -> pipe -> mould section of the ritual
        const u = clamp01((t - 0.38) / 0.62);
        const time = u * el.duration * 0.985;
        if (Math.abs(time - shownT) > 0.012) {
          shownT = time;
          try {
            el.currentTime = time;
          } catch {
            /* seeking not ready yet */
          }
        }
      }
      if (wrap.current) {
        // cross-fade in from the crystal stage
        const o = clamp01((t - 0.3) / 0.14);
        if (Math.abs(o - shownO) > 0.01) {
          shownO = o;
          wrap.current.style.opacity = String(o);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tRef]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-[900ms]"
      style={{ opacity: done ? 0 : 1 }}
      aria-hidden
    >
      <div ref={wrap} className="h-full w-full" style={{ opacity: 0 }}>

      <video
        ref={video}
        key={small ? "sd" : "hd"}
        poster={FORGE.poster}
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setReady(true)}
        className="h-full w-full object-cover"
        style={{ opacity: ready ? 1 : 0, transition: "opacity 700ms" }}
      >
        <source src={small ? FORGE.sd : FORGE.hd} type="video/mp4" />
        <source src={small ? FORGE.sdWebm : FORGE.hdWebm} type="video/webm" />
      </video>
      {/* vignette so the overlay type stays legible over the pour */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,transparent_35%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  );
}
