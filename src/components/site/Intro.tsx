import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function Intro() {
  const [progress, setProgress] = useState(0);
  const [entered, setEntered] = useState(false);

  const ready = progress >= 100;

  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [entered]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 14 + 4;
        if (next >= 100) {
          window.clearInterval(id);
          return 100;
        }
        return next;
      });
    }, 120);
    return () => window.clearInterval(id);
  }, []);

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          key="intro"
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[900] flex flex-col justify-between bg-background px-5 py-8 md:px-10"
        >
          <div className="flex items-start justify-between font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            <span>Vitréa ® Glass Studio</span>
            <span>Est. 1998 · Shanghai</span>
          </div>

          <button
            type="button"
            disabled={!ready}
            onClick={() => setEntered(true)}
            className="group flex flex-1 flex-col items-center justify-center gap-8 disabled:cursor-default"
          >
            <span className="font-display text-[16vw] leading-none tracking-tight md:text-[10vw]">
              <span className="text-glass">VITRÉA</span>
            </span>
            <span
              className={`font-mono text-[11px] tracking-[0.45em] uppercase transition-colors duration-500 ${
                ready ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {ready ? "点击进入 / Click to enter" : `Loading ${Math.floor(progress)}%`}
            </span>
          </button>

          <div className="h-px w-full bg-border">
            <div
              className="h-px bg-accent transition-[width] duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
