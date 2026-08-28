import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Brand title card over the opening WebGL sequence. */
export function IntroOverlay({ duration = 5200 }: { duration?: number }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setGone(true), duration);
    return () => window.clearTimeout(id);
  }, [duration]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center text-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-[10px] tracking-[0.6em] text-accent uppercase"
          >
            Est. Jining · Shandong · China
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 26, letterSpacing: "0.4em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.12em" }}
            transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-3xl font-extralight uppercase md:text-6xl"
          >
            Chunqiu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.4 }}
            className="mt-6 text-sm font-light tracking-[0.24em] text-muted-foreground uppercase"
          >
            Glass, made to be given.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
