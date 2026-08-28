import { useRef, useState } from "react";
import { motion } from "framer-motion";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import { RevealGroup, revealItem } from "./Reveal";

const products = [
  { img: p1, ref: "VTR-0001", name: "Aqua Vase", series: "水影系列", desc: "单体吹制花器，壁厚渐变形成水波折光。" },
  { img: p2, ref: "VTR-0002", name: "Lumen Goblet", series: "晨光系列", desc: "0.9mm 超薄杯壁，唇触近乎无感。" },
  { img: p3, ref: "VTR-0003", name: "Nebula Orb", series: "星尘系列", desc: "封入气泡群的实心球体镇纸。" },
  { img: p4, ref: "VTR-0004", name: "Ridge Pendant", series: "肌理系列", desc: "手拉棱纹灯罩，散射柔和光晕。" },
];

function ProductCard({ p, index }: { p: (typeof products)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 8, y: px * 10 });
  };

  return (
    <motion.article
      variants={revealItem}
      className="w-[78vw] shrink-0 snap-center [perspective:1200px] sm:w-[46vw] lg:w-[30vw]"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x || tilt.y ? 1.02 : 1})`,
        }}
        className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-white/5 p-3 backdrop-blur-[20px] transition-[box-shadow,transform] duration-300 ease-out will-change-transform hover:shadow-[0_0_40px_-10px_rgba(184,216,232,0.4)]"
      >
        <div
          className="pointer-events-none absolute -top-1/3 -left-1/3 h-[140%] w-[140%] rounded-full bg-[radial-gradient(circle_at_center,rgba(232,244,253,0.14)_0%,rgba(184,216,232,0.06)_35%,transparent_70%)] opacity-60 mix-blend-screen"
          aria-hidden="true"
        />
        <div className="flex items-center justify-between px-1 pb-3 font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>Ref. {p.ref}</span>
        </div>
        <div className="overflow-hidden rounded-md bg-background/40">
          <img
            src={p.img}
            alt={`${p.series} ${p.name}`}
            loading="lazy"
            draggable={false}
            width={900}
            height={1100}
            className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="px-2 pt-5 pb-3">
          <p className="font-mono text-[10px] tracking-[0.3em] text-accent uppercase">{p.series}</p>
          <h3 className="font-display mt-2 text-2xl">{p.name}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
        </div>
      </div>
    </motion.article>
  );
}

export function Products() {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startScroll: 0 });

  const onDown = (e: React.MouseEvent) => {
    const el = track.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startScroll: el.scrollLeft };
  };
  const onMove = (e: React.MouseEvent) => {
    const el = track.current;
    if (!el || !drag.current.down) return;
    el.scrollLeft = drag.current.startScroll - (e.clientX - drag.current.startX) * 1.2;
  };
  const stop = () => {
    drag.current.down = false;
  };

  return (
    <section id="works" className="relative py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <RevealGroup>
          <motion.p
            variants={revealItem}
            className="font-mono text-[10px] tracking-[0.5em] text-accent uppercase"
          >
            Collections ®
          </motion.p>
          <motion.div
            variants={revealItem}
            className="mt-5 flex flex-wrap items-end justify-between gap-4"
          >
            <h2 className="font-display text-5xl leading-none md:text-[6vw]">
              作品 <span className="text-glass">陈列</span>
            </h2>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              ← 拖拽 / 横向滑动浏览 →
            </p>
          </motion.div>
        </RevealGroup>
      </div>

      <RevealGroup
        className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={track}
          data-cursor="grow"
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={stop}
          onMouseLeave={stop}
          className="flex cursor-grab gap-6 active:cursor-grabbing"
        >
          {products.map((p, i) => (
            <ProductCard key={p.name} p={p} index={i} />
          ))}
        </div>
      </RevealGroup>
    </section>
  );
}
