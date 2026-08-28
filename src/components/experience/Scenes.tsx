import { motion } from "framer-motion";

import shelf from "@/assets/scene-shelf.jpg";
import bar from "@/assets/scene-bar.jpg";
import gift from "@/assets/scene-gift.jpg";

const SCENES = [
  {
    src: shelf,
    t: "On the shelf",
    d: "Standing out under retail lighting — even wall thickness and 99.9% clarity keep the liquid the hero.",
  },
  {
    src: bar,
    t: "In the hand",
    d: "Balanced weight and a clean pour lip, built for a bartender using it two hundred times a night.",
  },
  {
    src: gift,
    t: "At the table",
    d: "The timber case turns a bottle into an occasion — opened once, remembered for years.",
  },
];

/** Where the product ends up: shelf, bar, table. */
export function Scenes() {
  return (
    <section id="in-use" className="border-t border-white/10 px-6 py-28 md:px-14 md:py-40">
      <p className="text-[10px] tracking-[0.5em] text-accent uppercase">In the world</p>
      <h2 className="mt-8 max-w-2xl text-4xl leading-[1.05] font-light tracking-tight md:text-6xl">
        Made in Jining. Used everywhere.
      </h2>

      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {SCENES.map((s, i) => (
          <motion.figure
            key={s.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group"
          >
            <div className="overflow-hidden border border-white/10">
              <img
                src={s.src}
                alt={s.t}
                loading="lazy"
                width={1280}
                height={860}
                className="aspect-[3/2] w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
              />
            </div>
            <figcaption className="mt-6">
              <h3 className="text-2xl font-light">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
