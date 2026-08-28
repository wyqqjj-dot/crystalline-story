import { AnimatePresence, motion } from "framer-motion";

import type { Station } from "@/lib/journey";

type Spec = { k: string; v: string };

const CONTENT: Record<
  Exclude<Station, "final">,
  { ref: string; title: string; lead: string; specs: Spec[] }
> = {
  bottle: {
    ref: "CQ-100",
    title: "The Vessel",
    lead: "Hand-finished flint glass, blown to a mirror-clear body with an even wall and a precision screw finish.",
    specs: [
      { k: "Capacity", v: "750 ml / 500 ml" },
      { k: "Material", v: "Super-flint glass" },
      { k: "Clarity", v: "Ultra-clear, 99.9%" },
      { k: "Finish", v: "Custom mould, GPI 28-400" },
    ],
  },
  stopper: {
    ref: "CQ-193",
    title: "The Closure",
    lead: "A faceted glass head set on a natural cork plug — weighted in the hand, airtight in the neck.",
    specs: [
      { k: "Head", v: "Faceted pressed glass" },
      { k: "Plug", v: "Natural cork, food grade" },
      { k: "Seal", v: "Airtight, leak-proof" },
      { k: "Options", v: "Gold / matte / polished" },
    ],
  },
  assembly: {
    ref: "CQ-100 + CQ-193",
    title: "Perfect Fit",
    lead: "Every closure is matched to its mould and pressure-tested, so the two parts become one object.",
    specs: [
      { k: "Tolerance", v: "±0.15 mm" },
      { k: "Testing", v: "100% leak checked" },
      { k: "Torque", v: "12–18 in·lb" },
      { k: "Assembly", v: "In-house, Jining" },
    ],
  },
  box: {
    ref: "CQ-B-1",
    title: "The Presentation",
    lead: "Solid timber twin-door case with a deep red velvet interior, built to arrive as an occasion.",
    specs: [
      { k: "Shell", v: "Solid timber, oiled" },
      { k: "Interior", v: "Red velvet lining" },
      { k: "Closure", v: "Twin doors, magnet" },
      { k: "Transit", v: "Drop tested 1.2 m" },
    ],
  },
};

export function Panel({ station }: { station: Station }) {
  const data = station === "final" ? null : CONTENT[station];

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 z-20 flex w-full items-center justify-end px-6 md:w-[46vw] md:px-14">
      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            key={station}
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-md"
          >
            <p className="text-[11px] tracking-[0.42em] text-accent uppercase">Ref. {data.ref}</p>
            <h2 className="mt-5 text-5xl leading-[0.95] font-light tracking-tight md:text-6xl">
              {data.title}
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {data.lead}
            </p>

            <dl className="mt-9 space-y-3">
              {data.specs.map((s) => (
                <div
                  key={s.k}
                  className="flex items-baseline justify-between gap-6 border-b border-white/10 pb-3"
                >
                  <dt className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase">
                    {s.k}
                  </dt>
                  <dd className="text-sm">{s.v}</dd>
                </div>
              ))}
            </dl>

            <a
              href="#inquiry"
              className="mt-9 inline-flex items-center gap-3 border border-accent/60 px-6 py-3 text-[11px] tracking-[0.34em] text-accent uppercase transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
            >
              Request specification
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
