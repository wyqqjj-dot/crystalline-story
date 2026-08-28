import { motion } from "framer-motion";
import closeup from "@/assets/craft-closeup.jpg";
import { Reveal, RevealGroup, revealItem } from "./Reveal";

const paragraphs = [
  "VITRÉA 始于一座临海的老窑厂。二十余年来，我们只做一件事：让 1200°C 的液态光凝固成可以被手掌握住的形状。",
  "每一件作品都由同一位匠人从吹管的第一口气开始，直至最后一次抛光。没有模具，没有复制，气泡与折纹是时间留下的签名。",
  "我们相信玻璃不是容器，而是介质——它收集晨光、折射灯影，把空间里最安静的部分显影出来。",
];

export function Philosophy() {
  return (
    <section id="philosophy" className="mx-auto max-w-7xl px-5 py-24 md:px-10 md:py-40">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
        <Reveal>
          <div className="relative">
            <motion.img
              src={closeup}
              alt="手工玻璃器皿边缘的光线折射特写"
              loading="lazy"
              width={1200}
              height={1408}
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-4/5 w-full object-cover"
            />
            <div className="absolute -inset-px border border-border" />
          </div>
        </Reveal>

        <RevealGroup className="md:pl-6">
          <motion.p
            variants={revealItem}
            className="mb-6 text-[10px] tracking-[0.5em] text-accent uppercase"
          >
            Our Philosophy
          </motion.p>
          <motion.h2
            variants={revealItem}
            className="font-display text-4xl leading-[1.1] md:text-6xl"
          >
            一口气，
            <br />
            <span className="text-glass">成就一生的形状</span>
          </motion.h2>
          <div className="mt-8 space-y-6">
            {paragraphs.map((p) => (
              <motion.p
                key={p}
                variants={revealItem}
                className="text-sm leading-relaxed text-muted-foreground md:text-base"
              >
                {p}
              </motion.p>
            ))}
          </div>
          <motion.div
            variants={revealItem}
            className="mt-10 flex gap-10 border-t border-border pt-8"
          >
            {[
              ["26", "年窑火不熄"],
              ["100%", "手工吹制"],
              ["12", "位驻场匠人"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl md:text-3xl">{n}</div>
                <div className="mt-1 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {l}
                </div>
              </div>
            ))}
          </motion.div>
        </RevealGroup>
      </div>
    </section>
  );
}
