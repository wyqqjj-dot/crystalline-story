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
  const [ready, setReady] = useState(false);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    setSmall(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  useEffect(() => {
    let raf = 0;
    let shownT = -1;
    const loop = () => {
      const el = video.current;
      if (el && el.duration > 0) {
        // leave the last frames for the hand-off into the 3D bottle
        const t = clamp01(tRef.current) * el.duration * 0.985;
        if (Math.abs(t - shownT) > 0.012) {
          shownT = t;
          try {
            el.currentTime = t;
          } catch {
            /* seeking not ready yet */
          }
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
