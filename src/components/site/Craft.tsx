import { Reveal } from "./Reveal";

const steps = [
  { n: "01", title: "设计", desc: "手绘草图与比例推演，确定器型的重心与光路走向。" },
  { n: "02", title: "吹制", desc: "1200°C 熔炉取料，匠人以呼吸塑形，全程不超过八分钟。" },
  { n: "03", title: "退火", desc: "在退火窑中以每小时 20°C 缓降 14 小时，释放内部应力。" },
  { n: "04", title: "质检", desc: "逐件透光检视气泡、厚度与口沿，不合格者当场回炉。" },
];

export function Craft() {
  return (
    <section id="craft" className="mx-auto max-w-4xl px-5 py-24 md:px-10 md:py-40">
      <Reveal>
        <p className="text-[10px] tracking-[0.5em] text-accent uppercase">Process</p>
        <h2 className="font-display mt-5 text-4xl md:text-6xl">
          四道 <span className="text-glass">工序</span>
        </h2>
      </Reveal>

      <div className="relative mt-16 pl-10 md:pl-16">
        <div className="absolute top-2 bottom-2 left-[3px] w-px bg-gradient-to-b from-accent/70 via-border to-transparent md:left-[7px]" />
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08} className="relative pb-14 last:pb-0">
            <span className="absolute top-2 -left-10 h-2 w-2 rounded-full bg-accent md:-left-16 md:h-4 md:w-4 md:border-4 md:border-background" />
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="font-display text-3xl text-muted-foreground/50">{s.n}</span>
              <h3 className="font-display text-2xl md:text-3xl">{s.title}</h3>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {s.desc}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
