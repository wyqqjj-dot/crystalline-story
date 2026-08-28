import { AnimatePresence, motion } from "framer-motion";

/** Prompt + progress read-out for the scroll-up forge ritual. */
export function IntroGate({ progress, done }: { progress: number; done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-between py-16 text-center md:py-20"
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1 - progress * 1.4, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] tracking-[0.6em] text-accent uppercase"
            >
              Jining · Shandong · China
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20, letterSpacing: "0.4em" }}
              animate={{ opacity: 1 - progress, y: 0, letterSpacing: "0.12em" }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-3xl font-extralight uppercase md:text-6xl"
            >
              Chunqiu
            </motion.h1>
          </div>

          <div className="flex flex-col items-center gap-5">
            <span className="text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
              {progress < 0.02
                ? "Scroll up to lift the crystal"
                : progress < 0.35
                  ? "Into the furnace"
                  : progress < 0.6
                    ? "Molten — keep pushing"
                    : progress < 0.86
                      ? "Filling the mould"
                      : "Opening the mould"}
            </span>
            <div className="h-24 w-px bg-white/12">
              <div
                className="w-px bg-accent"
                style={{ height: `${Math.max(2, progress * 100)}%` }}
              />
            </div>
            <span className="text-[10px] tracking-[0.4em] text-accent uppercase">
              {String(Math.round(progress * 100)).padStart(2, "0")} %
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
