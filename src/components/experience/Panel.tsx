import { AnimatePresence, motion } from "framer-motion";

import type { Station } from "@/lib/journey";

type Spec = { k: string; v: string };

const CONTENT: Record<
  Exclude<Station, "final">,
  { ref: string; kicker: string; title: string; lead: string; specs: Spec[] }
> = {
  bottle: {
    ref: "CQ-100",
    kicker: "01 — Glass body",
    title: "The Vessel",
    lead: "Blown to your own mould in super-flint glass: an even wall, a mirror-clear body and a precision neck finish. Bases, shoulders and engraving are all specified per project, from 50 ml miniatures to 1,500 ml magnums.",
    specs: [
      { k: "Capacity", v: "50 – 1,500 ml" },
      { k: "Material", v: "Super-flint glass" },
      { k: "Clarity", v: "Ultra-clear, low iron" },
      { k: "Neck finish", v: "GPI 28-400 / cork / ROPP" },
      { k: "Decoration", v: "Screen print · foil · frosting" },
      { k: "Origin", v: "China" },
    ],
  },
  stopper: {
    ref: "CQ-193",
    kicker: "02 — Closure",
    title: "The Closure",
    lead: "A solid pressed-glass crown, sealed at the top and polished on every face, set on a food-grade plug. Weighted in the hand, airtight in the neck — also available in oak, zamak and aluminium.",
    specs: [
      { k: "Crown", v: "Solid pressed glass, sealed" },
      { k: "Plug", v: "Natural cork, food grade" },
      { k: "Seal", v: "Airtight, leak tested" },
      { k: "Finishes", v: "Clear · frosted · gold · matte" },
      { k: "Matching", v: "Cut to the bottle neck" },
      { k: "Origin", v: "China" },
    ],
  },
  assembly: {
    ref: "CQ-100 + CQ-193",
    kicker: "03 — Assembly",
    title: "Perfect Fit",
    lead: "Bottle and closure are cut from the same specification, then assembled and pressure-tested in-house so the two parts arrive as one finished object.",
    specs: [
      { k: "Tolerance", v: "±0.15 mm" },
      { k: "Testing", v: "100% leak checked" },
      { k: "Torque", v: "12–18 in·lb" },
      { k: "Assembly", v: "In-house" },
      { k: "MOQ", v: "3,000 pcs" },
      { k: "Origin", v: "China" },
    ],
  },
  box: {
    ref: "CQ-B-1",
    kicker: "04 — Packaging",
    title: "The Presentation",
    lead: "Solid timber twin-door case with a deep red velvet interior, cut to the bottle so nothing moves in transit. Rigid board, leather-wrapped, tube and kraft formats run from the same workshop.",
    specs: [
      { k: "Shell", v: "Solid timber, oiled" },
      { k: "Interior", v: "Red velvet lining" },
      { k: "Closure", v: "Twin doors, magnet" },
      { k: "Transit", v: "Drop tested 1.2 m" },
      { k: "Print", v: "Foil · deboss · silk screen" },
      { k: "Origin", v: "China" },
    ],
  },
};

export function Panel({ station }: { station: Station }) {
  const data = station === "final" ? null : CONTENT[station];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-5 pb-6 md:inset-y-0 md:right-0 md:left-auto md:w-[44vw] md:items-center md:px-14 md:pb-0">
      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            key={station}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-md rounded-lg border border-white/10 bg-black/55 p-5 backdrop-blur-md md:rounded-none md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none"
          >
            {/* horizontal header — never a vertical rail over the copy */}
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="text-[10px] tracking-[0.4em] text-accent uppercase">{data.kicker}</p>
              <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Ref. {data.ref}
              </p>
            </div>

            <h2 className="mt-3 text-3xl leading-[0.98] font-light tracking-tight md:mt-5 md:text-6xl">
              {data.title}
            </h2>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted-foreground md:mt-6 md:text-sm">
              {data.lead}
            </p>

            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 md:mt-9 md:grid-cols-1 md:gap-y-3">
              {data.specs.map((s) => (
                <div
                  key={s.k}
                  className="border-b border-white/10 pb-2 md:flex md:items-baseline md:justify-between md:gap-6 md:pb-3"
                >
                  <dt className="text-[9px] tracking-[0.28em] text-muted-foreground uppercase md:text-[11px] md:tracking-[0.3em]">
                    {s.k}
                  </dt>
                  <dd className="mt-1 text-[12px] md:mt-0 md:text-sm">{s.v}</dd>
                </div>
              ))}
            </dl>

            <a
              href="#inquiry"
              className="mt-5 inline-flex items-center gap-3 border border-accent/60 px-5 py-3 text-[10px] tracking-[0.3em] text-accent uppercase transition-colors duration-500 hover:bg-accent hover:text-accent-foreground md:mt-9 md:px-6 md:text-[11px] md:tracking-[0.34em]"
            >
              Request specification
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
