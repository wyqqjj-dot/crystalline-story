import { motion } from "framer-motion";
import type { ReactNode } from "react";

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const CAPABILITIES = [
  {
    n: "01",
    t: "Custom moulds",
    d: "From a sketch or a sample to a finished mould, with drawings approved before the first pour.",
  },
  {
    n: "02",
    t: "Decoration",
    d: "Screen printing, hot foil, frosting, decal firing and electroplating on glass and closures.",
  },
  {
    n: "03",
    t: "Closures",
    d: "Cork, glass, aluminium and composite stoppers matched and pressure-tested to each neck.",
  },
  {
    n: "04",
    t: "Packaging",
    d: "Timber cases, rigid boxes, velvet inserts and export cartons built for long transit.",
  },
  {
    n: "05",
    t: "Quality",
    d: "In-line inspection, dimensional checks and 100% leak testing before palletising.",
  },
  {
    n: "06",
    t: "Export",
    d: "FOB Qingdao, full documentation and consolidated shipping to over thirty markets.",
  },
];

export function Content() {
  return (
    <div className="relative z-10 bg-background">
      {/* company */}
      <section id="company" className="border-t border-white/10 px-6 py-28 md:px-14 md:py-40">
        <Reveal>
          <p className="text-[10px] tracking-[0.5em] text-accent uppercase">The manufacturer</p>
        </Reveal>
        <div className="mt-12 grid gap-12 md:grid-cols-12">
          <Reveal delay={0.05}>
            <h2 className="text-4xl leading-[1.05] font-light tracking-tight md:col-span-7 md:text-6xl">
              Glassware, closures and presentation cases — made under one roof in Jining.
            </h2>
          </Reveal>
          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground md:col-span-5">
            <Reveal delay={0.12}>
              <p>
                Jining Chunqiu Import &amp; Export Co., Ltd. supplies spirits houses, distilleries
                and design studios with bottles, stoppers and gift packaging built to their own
                drawings. We take a project from mould design through decoration, assembly and export
                documentation.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <dl className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { k: "Founded", v: "2009" },
                  { k: "Markets", v: "30+ countries" },
                  { k: "MOQ", v: "3,000 pcs" },
                  { k: "Lead time", v: "25–35 days" },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className="text-[10px] tracking-[0.34em] uppercase">{s.k}</dt>
                    <dd className="mt-2 text-xl font-light text-foreground">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* capabilities */}
      <section id="capabilities" className="border-t border-white/10 px-6 py-28 md:px-14 md:py-40">
        <Reveal>
          <p className="text-[10px] tracking-[0.5em] text-accent uppercase">Capabilities</p>
        </Reveal>
        <div className="mt-16 grid gap-x-14 gap-y-12 md:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.05}>
              <article className="group border-t border-white/10 pt-6 transition-colors duration-500 hover:border-accent/60">
                <span className="text-[10px] tracking-[0.4em] text-muted-foreground">{c.n}</span>
                <h3 className="mt-4 text-2xl font-light transition-colors duration-500 group-hover:text-accent">
                  {c.t}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* inquiry */}
      <section id="inquiry" className="border-t border-white/10 px-6 py-28 md:px-14 md:py-40">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="text-[10px] tracking-[0.5em] text-accent uppercase">Inquiry</p>
              <h2 className="mt-8 text-4xl leading-[1.05] font-light tracking-tight md:text-5xl">
                Tell us what you are bottling.
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Send drawings, references or simply a volume and a deadline. We reply with a
                specification, a sample plan and pricing within two working days.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <form
              className="grid gap-6 md:col-span-7"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "company", label: "Company", type: "text" },
                { id: "email", label: "Email", type: "email" },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase"
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.type}
                    required
                    className="mt-3 w-full border-b border-white/15 bg-transparent pb-3 text-sm outline-none transition-colors focus:border-accent"
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="brief"
                  className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase"
                >
                  Project brief
                </label>
                <textarea
                  id="brief"
                  name="brief"
                  rows={4}
                  className="mt-3 w-full resize-none border-b border-white/15 bg-transparent pb-3 text-sm outline-none transition-colors focus:border-accent"
                />
              </div>
              <button
                type="submit"
                className="justify-self-start border border-accent/60 px-8 py-4 text-[11px] tracking-[0.34em] text-accent uppercase transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
              >
                Send inquiry
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/10 px-6 py-16 md:px-14">
        <div className="grid gap-10 text-sm text-muted-foreground md:grid-cols-3">
          <p className="leading-relaxed">
            Jining Chunqiu Import &amp; Export Co., Ltd.
            <br />
            No. 141 Guanghe Road, Jiahui Building,
            <br />
            Rencheng District, Jining, Shandong, China
          </p>
          <p className="leading-relaxed">
            <a href="tel:+865372366968" className="transition-colors hover:text-accent">
              +86 537 2366968
            </a>
            <br />
            <a href="tel:+8615053733338" className="transition-colors hover:text-accent">
              +86 150 5373 3338
            </a>
            <br />
            <a href="mailto:info@jnchunqiu.com" className="transition-colors hover:text-accent">
              info@jnchunqiu.com
            </a>
          </p>
          <p className="md:text-right">© {new Date().getFullYear()} Chunqiu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
