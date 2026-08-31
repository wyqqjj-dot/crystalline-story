import { AnimatePresence, motion } from "framer-motion";

/** A single minimal hint. No stages, no counters, no progress meter. */
export function IntroGate({ progress, done }: { progress: number; done: boolean }) {
  const hint = Math.max(0, 1 - progress * 9);

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

          <motion.span
            animate={{ opacity: hint }}
            transition={{ duration: 0.5 }}
            className="text-[10px] tracking-[0.44em] text-muted-foreground uppercase"
          >
            Drag or scroll to forge
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
