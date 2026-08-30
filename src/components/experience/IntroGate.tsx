import { AnimatePresence, motion } from "framer-motion";

/** Prompt for the scroll-up forge ritual — a single hairline, no counters. */
export function IntroGate({ progress, done }: { progress: number; done: boolean }) {
  const label =
    progress < 0.04
      ? "Scroll up to melt the crystal"
      : progress < 0.32
        ? "Molten glass"
        : progress < 0.62
          ? "The pour"
          : progress < 0.88
            ? "Filling the mould"
            : "The bottle takes shape";

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
            <span className="text-[10px] tracking-[0.44em] text-muted-foreground uppercase">
              {label}
            </span>
            <div className="h-20 w-px bg-white/12 md:h-24">
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
