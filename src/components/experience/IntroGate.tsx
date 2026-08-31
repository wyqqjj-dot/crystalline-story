import { AnimatePresence, motion } from "framer-motion";

import { RITUAL, ritualStage } from "@/lib/journey";

/** Prompt for the scroll-up forge ritual — seven named stages, one hairline meter. */
export function IntroGate({ progress, done }: { progress: number; done: boolean }) {
  const stage = ritualStage(progress);
  const label = progress < 0.02 ? "Swipe upward to begin" : stage.label;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-between px-6 py-14 text-center md:py-20"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: Math.max(0, 1 - progress * 1.6), y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] tracking-[0.5em] text-accent uppercase"
            >
              Glass manufacturing · China
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20, letterSpacing: "0.4em" }}
              animate={{ opacity: Math.max(0, 1 - progress * 1.2), y: 0, letterSpacing: "0.12em" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-3xl font-extralight uppercase md:text-6xl"
            >
              Chunqiu
            </motion.h1>
          </div>

          <div className="flex flex-col items-center gap-5">
            <span className="text-[10px] tracking-[0.44em] text-accent/80 uppercase">
              Stage {stage.n} / {RITUAL.length}
            </span>
            <span className="text-[10px] tracking-[0.44em] text-muted-foreground uppercase">
              {label}
            </span>

            {/* seven segments, one per stage */}
            <div className="flex items-end gap-2">
              {RITUAL.map((s) => {
                const local = Math.min(1, Math.max(0, (progress - s.from) / (s.to - s.from)));
                return (
                  <span key={s.n} className="h-px w-6 bg-white/12">
                    <span
                      className="block h-px bg-accent transition-[width] duration-150"
                      style={{ width: `${local * 100}%` }}
                    />
                  </span>
                );
              })}
            </div>

            <div className="h-16 w-px bg-white/12 md:h-20">
              <div
                className="w-px bg-accent transition-[height] duration-150"
                style={{ height: `${Math.max(2, progress * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
