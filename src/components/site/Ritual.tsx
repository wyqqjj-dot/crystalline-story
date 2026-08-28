import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * 仪式序列 / The Ritual
 * 玻璃 → 炸开 → 融合成瓶 → 溶解成盖 → 二合一 → 装入盒中
 * Scroll-scrubbed, no linear narrative: one sticky viewport, six states.
 */

const shards = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2;
  const r = 26 + ((i * 37) % 40);
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r * 0.9,
    rot: ((i * 53) % 180) - 90,
    size: 8 + ((i * 17) % 26),
  };
});

const captions = [
  ["I", "熔融的玻璃 / Molten Glass"],
  ["II", "炸开 / Detonation"],
  ["III", "凝成瓶身 / Fused Into Form"],
  ["IV", "溶解成盖 / Dissolved Into Cap"],
  ["V", "二合一 / Union"],
  ["VI", "装入盒中 / Enshrined"],
];

function Shard({
  spread,
  s,
}: {
  spread: MotionValue<number>;
  s: (typeof shards)[number];
}) {
  const opacity = useTransform(spread, [0, 0.15, 1], [0, 1, 0.9]);
  const x = useTransform(spread, (v) => `${s.x * v}vmin`);
  const y = useTransform(spread, (v) => `${s.y * v}vmin`);
  const rotate = useTransform(spread, (v) => s.rot * v);
  return (
    <motion.span
      style={{ opacity, x, y, rotate, width: s.size, height: s.size * 1.6 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/25 bg-gradient-to-br from-white/40 to-glass-500/10 backdrop-blur-[2px]"
    />
  );
}

function Caption({
  stage,
  index,
  numeral,
  label,
}: {
  stage: MotionValue<number>;
  index: number;
  numeral: string;
  label: string;
}) {
  const opacity = useTransform(stage, (v) => (v === index ? 1 : 0));
  return (
    <motion.div style={{ opacity }} className="absolute inset-x-0">
      <p className="font-display text-6xl leading-none text-white/10 md:text-[9vw]">{numeral}</p>
      <p className="font-mono mt-2 text-[10px] tracking-[0.45em] text-accent uppercase">{label}</p>
    </motion.div>
  );
}

function useStage(p: MotionValue<number>, from: number, to: number) {
  const fade = 0.06;
  return useTransform(p, [from - fade, from, to, to + fade], [0, 1, 1, 0], {
    clamp: true,
  });
}

export function Ritual() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  const glass = useStage(p, 0.02, 0.14);
  const blast = useStage(p, 0.18, 0.3);
  const bottle = useStage(p, 0.34, 0.5);
  const cap = useStage(p, 0.54, 0.64);
  const union = useStage(p, 0.68, 0.8);
  const boxed = useStage(p, 0.84, 0.98);

  const shardSpread = useTransform(p, [0.14, 0.3, 0.44], [0, 1, 0.05]);
  const glassScale = useTransform(p, [0, 0.14], [0.7, 1.1]);
  const rotate = useTransform(p, [0, 1], [0, 220]);
  const bottleY = useTransform(p, [0.34, 0.5], [40, 0]);
  const capY = useTransform(p, [0.54, 0.8], [-160, -96]);
  const boxLid = useTransform(p, [0.84, 0.96], [-120, 0]);
  const unionScale = useTransform(p, [0.68, 0.98], [1, 0.72]);
  const stageIndex = useTransform(p, (v) => Math.min(5, Math.floor(v / 0.166)));
  const bottleOpacity = useTransform([bottle, union, boxed], ([a, b, c]: number[]) =>
    Math.max(a, b, c),
  );
  const capOpacity = useTransform([cap, union, boxed], ([a, b, c]: number[]) =>
    Math.max(a, b, c),
  );

  return (
    <section id="ritual" ref={wrap} className="relative h-[620vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        {/* stage number, oversized serif */}
        <motion.div
          style={{ rotate }}
          className="pointer-events-none absolute h-[70vmin] w-[70vmin] rounded-full border border-white/[0.06]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-24 px-5 text-center md:px-10">
          <p className="font-mono text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
            The Ritual — 六幕
          </p>
        </div>

        <div className="relative h-[62vmin] w-[62vmin]">
          {/* I. molten glass */}
          <motion.div
            style={{ opacity: glass, scale: glassScale }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="orb-glass h-[42vmin] w-[42vmin] rounded-full blur-[1px]" />
          </motion.div>

          {/* II. detonation */}
          <div className="absolute inset-0">
            {shards.map((s, i) => (
              <Shard key={i} spread={shardSpread} s={s} />
            ))}
          </div>

          {/* III / V. bottle */}
          <motion.svg
            viewBox="0 0 200 320"
            style={{ opacity: bottleOpacity, y: bottleY, scale: unionScale }}
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="gl" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E8F4FD" stopOpacity="0.75" />
                <stop offset="55%" stopColor="#B8D8E8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#E8F4FD" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <path
              d="M85 70 Q85 96 66 118 Q46 142 46 186 L46 268 Q46 288 66 288 L134 288 Q154 288 154 268 L154 186 Q154 142 134 118 Q115 96 115 70 Z"
              fill="url(#gl)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="1"
            />
            <path d="M85 70 L115 70 L115 44 L85 44 Z" fill="url(#gl)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          </motion.svg>

          {/* IV / V. cap */}
          <motion.div
            style={{ opacity: capOpacity, y: capY, scale: unionScale }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2"
          >
            <div className="surface-glass h-[7vmin] w-[9vmin] rounded-[4px] shadow-[0_0_40px_-6px_rgba(184,216,232,0.6)]" />
          </motion.div>

          {/* VI. box */}
          <motion.div
            style={{ opacity: boxed }}
            className="absolute bottom-[6%] left-1/2 h-[34vmin] w-[34vmin] -translate-x-1/2"
          >
            <div className="surface-glass absolute inset-0 rounded-[6px] border-white/20" />
            <motion.div
              style={{ y: boxLid }}
              className="surface-glass absolute -top-4 -left-2 h-[8vmin] w-[38vmin] rounded-[6px] border-white/25"
            />
          </motion.div>
        </div>

        {/* caption */}
        <div className="pointer-events-none absolute inset-x-0 bottom-16 px-5 text-center md:px-10">
          {captions.map(([n, label], i) => (
            <Caption key={n} stage={stageIndex} index={i} numeral={n} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}
