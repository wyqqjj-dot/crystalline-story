import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import bottleAsset from "@/assets/bottle.jpg.asset.json";
import capAsset from "@/assets/cap.jpg.asset.json";

export function Assembly() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  const capY = useTransform(p, [0.05, 0.55], ["-58vh", "-1vh"]);
  const capScale = useTransform(p, [0.05, 0.55], [1.6, 1]);
  const capRotate = useTransform(p, [0.05, 0.55], [-24, 0]);
  const stamp = useTransform(p, [0.6, 0.7], [0, 1]);
  const stampScale = useTransform(p, [0.6, 0.72], [1.7, 1]);
  const copy = useTransform(p, [0.72, 0.85], [0, 1]);
  const flash = useTransform(p, [0.55, 0.6, 0.68], [0, 0.55, 0]);

  return (
    <section id="assembly" ref={wrap} className="relative h-[320vh] border-b-2 border-foreground">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="font-mono absolute top-24 inset-x-0 flex justify-between px-5 text-[10px] tracking-[0.5em] text-muted-foreground uppercase md:px-12">
          <span>Step 04</span>
          <span>Assembly / Mixing ingredients</span>
        </div>

        <motion.div style={{ opacity: flash }} className="pointer-events-none absolute inset-0 bg-accent" />

        <div className="relative h-[70vh] w-[46vmin]">
          <img
            src={bottleAsset.url}
            alt="Clear glass bottle body manufactured by Jining Chunqiu"
            className="absolute bottom-0 h-[62vh] w-full object-contain mix-blend-screen"
          />
          <motion.img
            src={capAsset.url}
            alt="Gold aluminium screw cap"
            style={{ y: capY, scale: capScale, rotate: capRotate }}
            className="absolute bottom-[52.5vh] left-1/2 h-[10vh] w-[10vh] -translate-x-1/2 object-contain mix-blend-screen"
          />
        </div>

        <motion.div
          style={{ opacity: stamp, scale: stampScale, rotate: -9 }}
          className="pointer-events-none absolute"
        >
          <span className="font-display block border-[6px] border-accent px-8 py-4 text-[12vw] leading-none tracking-tighter text-accent uppercase md:text-[7vw]">
            Assembled
          </span>
        </motion.div>

        <motion.p
          style={{ opacity: copy }}
          className="font-mono absolute bottom-20 inset-x-0 px-5 text-center text-[11px] tracking-[0.5em] uppercase md:px-12"
        >
          Perfect fit. 100% leak-proof.
        </motion.p>
      </div>
    </section>
  );
}
