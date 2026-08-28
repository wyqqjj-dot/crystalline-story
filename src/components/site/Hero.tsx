import { motion } from "framer-motion";

const brand = "VITRÉA".split("");

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-background"
    >
      {/* Rotating glass orb, simulated with radial gradients */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="orb-glass animate-orb h-[78vw] w-[78vw] rounded-full blur-[2px] md:h-[46vw] md:w-[46vw]" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,#000_92%)]" />

      <div className="relative z-10 px-6 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mb-6 text-[10px] tracking-[0.5em] text-muted-foreground uppercase"
        >
          Handcrafted Art Glass · Est. 1998
        </motion.p>

        <h1 className="font-display flex justify-center text-[15vw] leading-none tracking-tight md:text-[9vw]">
          {brand.map((ch, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 80, rotateX: -70, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              transition={{
                delay: 0.15 + i * 0.09,
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-glass inline-block"
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 1 }}
          className="font-display mt-6 text-base tracking-[0.3em] text-foreground/80 md:text-2xl"
        >
          光与玻璃的对话
        </motion.p>

        <motion.a
          href="#works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-12 inline-block border border-border px-8 py-3 text-[11px] tracking-[0.3em] uppercase transition-all duration-500 hover:glow-ring hover:text-accent"
        >
          探索作品
        </motion.a>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.2, 1] }}
        transition={{ delay: 2, duration: 3, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-accent"
      />
    </section>
  );
}
