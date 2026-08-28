import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export type Spec = { k: string; v: string };

export function SpecSheet({
  ref: refCode,
  index,
  title,
  subtitle,
  image,
  alt,
  specs,
  note,
  flip = false,
  id,
}: {
  ref: string;
  index: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  specs: Spec[];
  note: string;
  flip?: boolean;
  id?: string;
}) {
  const wrap = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const [glare, setGlare] = useState(-1);

  return (
    <section
      id={id}
      ref={wrap}
      className="relative flex min-h-screen flex-col justify-center border-b-2 border-foreground px-5 py-28 md:px-12 md:py-40"
    >
      <div className="font-mono flex items-center justify-between text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
        <span>Ingredient {index}</span>
        <span>{refCode}</span>
      </div>

      <div
        className={`mt-12 grid flex-1 items-center gap-16 md:mt-24 md:grid-cols-2 md:gap-24 ${
          flip ? "md:[&>*:first-child]:order-2" : ""
        }`}
      >
        {/* image plate */}
        <motion.div style={{ y }} className="relative">
          <div
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setGlare(((e.clientX - r.left) / r.width) * 100);
            }}
            onMouseLeave={() => setGlare(-1)}
            className="surface-glass group relative aspect-[4/5] w-full overflow-hidden"
          >
            <img
              src={image}
              alt={alt}
              loading="lazy"
              className="h-full w-full object-contain mix-blend-screen transition-transform duration-700 group-hover:scale-[1.04]"
            />
            {glare >= 0 && (
              <span
                className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-accent/35 to-transparent"
                style={{ left: `calc(${glare}% - 16%)` }}
              />
            )}
            <span className="font-mono absolute top-4 left-4 text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
              {refCode}
            </span>
          </div>
          <p className="font-mono mt-4 text-[10px] tracking-[0.4em] text-muted-foreground uppercase">
            Fig. {index} — hover to inspect refraction
          </p>
        </motion.div>

        {/* label copy */}
        <div>
          <h2 className="font-display text-[16vw] leading-[0.8] tracking-tighter uppercase md:text-[8vw]">
            {title}
          </h2>
          <p className="font-mono mt-8 max-w-[30ch] text-[11px] leading-loose tracking-[0.35em] text-muted-foreground uppercase">
            {subtitle}
          </p>

          <dl className="font-mono mt-14 border-t border-foreground/25 text-[11px] uppercase md:text-xs">
            {specs.map((s) => (
              <div
                key={s.k}
                className="flex items-baseline justify-between gap-6 border-b border-foreground/15 py-5 tracking-[0.25em]"
              >
                <dt className="text-muted-foreground">{s.k}</dt>
                <dd className="text-right text-foreground">{s.v}</dd>
              </div>
            ))}
          </dl>

          <p className="font-mono mt-10 inline-block border-2 border-accent px-4 py-2 text-[10px] tracking-[0.4em] text-accent uppercase">
            {note}
          </p>
        </div>
      </div>
    </section>
  );
}
