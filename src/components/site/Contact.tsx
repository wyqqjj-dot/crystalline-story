import { useState } from "react";
import { motion } from "framer-motion";
import { RevealGroup, revealItem } from "./Reveal";

const fieldClass =
  "w-full border-b border-input bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-accent";

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 py-24 md:grid-cols-2 md:px-10 md:py-40">
        <RevealGroup>
          <motion.p
            variants={revealItem}
            className="text-[10px] tracking-[0.5em] text-accent uppercase"
          >
            Inquiry
          </motion.p>
          <motion.h2 variants={revealItem} className="font-display mt-5 text-4xl md:text-6xl">
            定制与 <span className="text-glass">询价</span>
          </motion.h2>
          <motion.p
            variants={revealItem}
            className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            我们承接空间艺术装置、酒店与餐厅定制器皿，以及私人收藏级单件作品。留下需求，工作室将在两个工作日内回复。
          </motion.p>
          <motion.dl variants={revealItem} className="mt-12 space-y-6 text-sm">
            {[
              ["工作室", "上海市徐汇区龙腾大道 2555 号 B 栈"],
              ["邮箱", "studio@vitrea.glass"],
              ["电话", "+86 21 5432 8800"],
              ["开放时间", "周二至周日 11:00 – 19:00"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-6">
                <dt className="w-24 shrink-0 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {k}
                </dt>
                <dd className="text-foreground/90">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </RevealGroup>

        <RevealGroup>
          <motion.div variants={revealItem}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="surface-glass rounded-lg p-6 md:p-8"
          >
            <div className="space-y-6">
              <input required placeholder="姓名 / 公司" className={fieldClass} />
              <input required type="email" placeholder="邮箱" className={fieldClass} />
              <input placeholder="电话（选填）" className={fieldClass} />
              <textarea
                required
                rows={4}
                placeholder="请描述您的需求：品类、数量、期望交期"
                className={`${fieldClass} resize-none`}
              />
            </div>
            <button
              type="submit"
              className="mt-8 w-full border border-border py-4 text-[11px] tracking-[0.3em] uppercase transition-all duration-500 hover:glow-ring hover:text-accent"
            >
              {sent ? "已收到，感谢垂询" : "提交询价"}
            </button>
            {sent && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                我们会在两个工作日内联系您。
              </p>
            )}
          </form>
          </motion.div>
        </RevealGroup>
      </div>

      <footer className="border-t border-border px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          <span className="font-display tracking-[0.35em] text-foreground">VITRÉA</span>
          <span>© 2026 Vitréa Glass Studio</span>
        </div>
      </footer>
    </section>
  );
}
