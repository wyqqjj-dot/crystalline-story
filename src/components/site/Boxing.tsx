import { useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import bottleAsset from "@/assets/bottle.jpg.asset.json";
import boxAsset from "@/assets/box.jpg.asset.json";

export function Boxing({ onComplete }: { onComplete?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  const { scrollYProgress: p } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  const bottleY = useTransform(p, [0.08, 0.45], ["0vh", "26vh"]);
  const bottleScale = useTransform(p, [0.08, 0.45], [1, 0.42]);
  const bottleOpacity = useTransform(p, [0.4, 0.5], [1, 0]);
  const lidY = useTransform(p, [0.5, 0.62], ["-40vh", "0vh"]);
  const label = useTransform(p, [0.66, 0.74], [0, 1]);
  const labelRot = useTransform(p, [0.66, 0.74], [-24, -7]);
  const labelScale = useTransform(p, [0.66, 0.74], [2.2, 1]);
  const boxScale = useTransform(p, [0.82, 1], [1, 0.34]);
  const boxX = useTransform(p, [0.82, 1], ["0vw", "-32vw"]);
  const boxY = useTransform(p, [0.82, 1], ["0vh", "26vh"]);

  useMotionValueEvent(p, "change", (v) => {
    if (v > 0.7 && !fired.current) {
      fired.current = true;
      onComplete?.();
    }
  });

  return (
    <section id="package" ref={wrap} className="relative h-[340vh] border-b-2 border-foreground">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="font-mono absolute inset-x-0 top-24 flex justify-between px-5 text-[10px] tracking-[0.5em] text-muted-foreground uppercase md:px-12">
          <span>Step 06</span>
          <span>Ref: PACK-BOX-003 / Shipping</span>
        </div>

        <motion.div style={{ scale: boxScale, x: boxX, y: boxY }} className="relative">
          <motion.img
            src={bottleAsset.url}
            alt="Assembled glass bottle descending into its export box"
            style={{ y: bottleY, scale: bottleScale, opacity: bottleOpacity }}
            className="absolute -top-[34vh] left-1/2 h-[46vh] -translate-x-1/2 object-contain mix-blend-screen"
          />
          <img
            src={boxAsset.url}
            alt="Matte black luxury liquor gift box"
            className="h-[52vh] w-auto object-contain"
          />
          <motion.div
            style={{ y: lidY }}
            className="surface-glass absolute -top-3 left-1/2 h-[5vh] w-[110%] -translate-x-1/2 border-2 border-foreground/40"
          />
          <motion.span
            style={{ opacity: label, rotate: labelRot, scale: labelScale }}
            className="font-display absolute top-1/2 left-1/2 block -translate-x-1/2 -translate-y-1/2 border-[6px] border-accent bg-background/70 px-6 py-3 text-[9vw] leading-none tracking-tighter text-accent uppercase backdrop-blur md:text-[4.5vw]"
          >
            Shipping ready
          </motion.span>
        </motion.div>

        <p className="font-mono absolute inset-x-0 bottom-20 px-5 text-center text-[11px] tracking-[0.5em] text-muted-foreground uppercase md:px-12">
          Export standard · Shock-absorbing · Handle with care
        </p>
      </div>
    </section>
  );
}
