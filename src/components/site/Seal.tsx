import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const COLS = 8;
const ROWS = 6;
const cells = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return {
    i,
    c,
    r,
    dx: (c - (COLS - 1) / 2) * (18 + ((i * 13) % 26)),
    dy: (r - (ROWS - 1) / 2) * (22 + ((i * 17) % 30)),
    rot: ((i * 47) % 90) - 45,
    delay: ((i * 29) % 17) / 60,
  };
});

export function Seal({ onOpen }: { onOpen: () => void }) {
  const [breaking, setBreaking] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = gone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gone]);

  function open() {
    if (breaking) return;
    setBreaking(true);
    window.setTimeout(() => {
      setGone(true);
      onOpen();
    }, 1250);
  }

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div key="seal" className="fixed inset-0 z-[900] bg-background" exit={{ opacity: 0 }}>
          {/* label face */}
          <motion.div
            className="absolute inset-0"
            animate={breaking ? { opacity: 0, scale: 1.04, filter: "blur(6px)" } : { opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <SealFace />
          </motion.div>

          {/* shatter grid */}
          <div className="pointer-events-none absolute inset-0">
            {cells.map((s) => (
              <motion.div
                key={s.i}
                className="absolute border border-white/20 bg-gradient-to-br from-white/25 to-white/[0.02] backdrop-blur-[1px]"
                style={{
                  width: `${100 / COLS}%`,
                  height: `${100 / ROWS}%`,
                  left: `${(s.c * 100) / COLS}%`,
                  top: `${(s.r * 100) / ROWS}%`,
                }}
                initial={{ opacity: 0 }}
                animate={
                  breaking
                    ? { x: s.dx, y: s.dy, rotate: s.rot, opacity: [0, 1, 0], scale: 0.85 }
                    : { opacity: 0 }
                }
                transition={{ duration: 1.15, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </div>


          {/* click layer */}
          <button
            type="button"
            onClick={open}
            aria-label="Open the sealed package"
            className="absolute inset-0 z-10 flex items-end justify-center pb-14"
          >
            <motion.span
              animate={{ opacity: breaking ? 0 : [1, 0.35, 1] }}
              transition={{ duration: 2, repeat: breaking ? 0 : Infinity }}
              className="font-mono border border-foreground px-6 py-3 text-[11px] tracking-[0.5em] uppercase"
            >
              Click to open
            </motion.span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SealFace() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-background px-6 text-center">
      <span className="font-mono text-[1.1vw] tracking-[0.7em] text-accent uppercase">
        Sealed for your protection
      </span>
      <h1 className="font-display text-[15vw] leading-[0.82] tracking-tighter uppercase md:text-[13vw]">
        Warning
        <span className="block text-accent">Fragile</span>
      </h1>
      <span className="font-mono max-w-[42ch] text-[1vw] leading-relaxed tracking-[0.35em] text-muted-foreground uppercase">
        Batch no. CQ-2026 · Net contents: one glassware experience
      </span>
    </div>
  );
}
