import { useRef, useState } from "react";
import { motion } from "framer-motion";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import { RevealGroup, revealItem } from "./Reveal";

const products = [
  { img: p1, name: "Aqua Vase", series: "水影系列", desc: "单体吹制花器，壁厚渐变形成水波折光。" },
  { img: p2, name: "Lumen Goblet", series: "晨光系列", desc: "0.9mm 超薄杯壁，唇触近乎无感。" },
  { img: p3, name: "Nebula Orb", series: "星尘系列", desc: "封入气泡群的实心球体镇纸。" },
  { img: p4, name: "Ridge Pendant", series: "肌理系列", desc: "手拉棱纹灯罩，散射柔和光晕。" },
];

function ProductCard({ p }: { p: (typeof products)[number] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: -py * 10, y: px * 12 });
  };

  return (
    <motion.div variants={revealItem} className="[perspective:1200px]">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x || tilt.y ? 1.03 : 1})`,
        }}
        className="surface-glass group h-full rounded-lg p-3 transition-[box-shadow,transform] duration-300 ease-out will-change-transform hover:glow-ring"
      >
        <div className="overflow-hidden rounded-md bg-background/40">
          <img
            src={p.img}
            alt={`${p.series} ${p.name}`}
            loading="lazy"
            width={900}
            height={1100}
            className="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="px-2 pt-5 pb-3">
          <p className="text-[10px] tracking-[0.3em] text-accent uppercase">{p.series}</p>
          <h3 className="font-display mt-2 text-xl">{p.name}</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Products() {
  return (
    <section id="works" className="relative border-y border-border py-24 md:py-40">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <RevealGroup>
          <motion.p
            variants={revealItem}
            className="text-[10px] tracking-[0.5em] text-accent uppercase"
          >
            Collections
          </motion.p>
          <motion.h2 variants={revealItem} className="font-display mt-5 text-4xl md:text-6xl">
            作品 <span className="text-glass">陈列</span>
          </motion.h2>
        </RevealGroup>

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.name} p={p} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
