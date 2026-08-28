import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";

const exhibits = [
  { img: p1, ref: "VTR-0001", name: "Aqua", series: "水影系列", note: "单体吹制花器，壁厚渐变形成水波折光。" },
  { img: p2, ref: "VTR-0002", name: "Lumen", series: "晨光系列", note: "0.9mm 超薄杯壁，唇触近乎无感。" },
  { img: p3, ref: "VTR-0003", name: "Nebula", series: "星尘系列", note: "封入气泡群的实心球体镇纸。" },
  { img: p4, ref: "VTR-0004", name: "Ridge", series: "肌理系列", note: "手拉棱纹灯罩，散射柔和光晕。" },
];

function Exhibit({ e, i }: { e: (typeof exhibits)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.12]);
  const titleX = useTransform(scrollYProgress, [0, 1], [i % 2 ? 80 : -80, i % 2 ? -80 : 80]);

  return (
    <article
      ref={ref}
      className="relative flex min-h-[100svh] snap-start items-center justify-center overflow-hidden px-5 md:px-10"
    >
      <motion.h3
        style={{ x: titleX }}
        className="font-display pointer-events-none absolute inset-x-0 text-center text-[26vw] leading-none tracking-tight text-white/[0.07] select-none"
      >
        {e.name}
      </motion.h3>

      <div className="relative grid w-full max-w-6xl items-center gap-10 md:grid-cols-[1fr_auto] md:gap-20">
        <motion.figure
          initial={{ opacity: 0, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="group surface-glass relative overflow-hidden rounded-[24px] p-3"
          data-cursor="grow"
        >
          <div className="overflow-hidden rounded-[16px]">
            <motion.img
              src={e.img}
              alt={`${e.series} ${e.name}`}
              loading="lazy"
              width={900}
              height={1100}
              style={{ y, scale }}
              className="aspect-4/5 w-full object-cover transition-[filter] duration-700 group-hover:invert"
            />
          </div>
          <figcaption className="font-mono flex items-center justify-between px-2 pt-4 text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            <span>{String(i + 1).padStart(2, "0")} / 04</span>
            <span>Ref. {e.ref}</span>
          </figcaption>
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="md:w-[26ch]"
        >
          <p className="font-mono text-[10px] tracking-[0.45em] text-accent uppercase">{e.series}</p>
          <h4 className="font-display mt-4 text-5xl leading-none md:text-7xl">
            <span className="text-glass">{e.name}</span>
          </h4>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{e.note}</p>
          <a
            href="#contact"
            className="hover-invert mt-10 inline-block border border-border px-7 py-3 font-mono text-[10px] tracking-[0.35em] uppercase"
          >
            询价 / Enquire
          </a>
        </motion.div>
      </div>
    </article>
  );
}

export function Exhibits() {
  return (
    <section id="works" className="relative snap-y snap-mandatory">
      <div className="mx-auto max-w-7xl px-5 pt-24 md:px-10 md:pt-40">
        <p className="font-mono text-[10px] tracking-[0.5em] text-accent uppercase">Exhibition ®</p>
        <h2 className="font-display mt-5 text-5xl leading-none md:text-[7vw]">
          展 <span className="text-glass">品</span>
        </h2>
      </div>
      {exhibits.map((e, i) => (
        <Exhibit key={e.ref} e={e} i={i} />
      ))}
    </section>
  );
}
