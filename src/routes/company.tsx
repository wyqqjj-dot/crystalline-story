import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

const title = "Company — Jining Chunqiu Import & Export Co., Ltd.";
const description =
  "Company profile, factory address, telephone and email for Jining Chunqiu Import & Export Co., Ltd., a Shandong manufacturer of custom glass bottles, closures and presentation packaging.";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyPage,
});

const FACTS = [
  { k: "Founded", v: "Trading and manufacturing since 2009" },
  { k: "Discipline", v: "Glass bottles · closures · presentation packaging" },
  { k: "Furnaces", v: "Super-flint and coloured glass, 50 ml – 1,500 ml" },
  { k: "Capacity", v: "Around 300,000 pieces per day across the group" },
  { k: "Moulds", v: "In-house tooling, 35 – 45 days from approved drawing" },
  { k: "Markets", v: "Over thirty markets in Europe, Asia and the Americas" },
  { k: "Terms", v: "FOB Qingdao · EXW · CIF on request" },
  { k: "Testing", v: "Dimensional, internal pressure, thermal shock, 100% leak" },
];

const CONTACT = [
  {
    k: "Address",
    lines: [
      "No. 141 Guanghe Road, Jiahui Building",
      "Rencheng District, Jining",
      "Shandong Province, China",
    ],
  },
  {
    k: "Telephone",
    lines: ["+86 537 2366968", "+86 150 5373 3338"],
    hrefs: ["tel:+865372366968", "tel:+8615053733338"],
  },
  { k: "Email", lines: ["info@jnchunqiu.com"], hrefs: ["mailto:info@jnchunqiu.com"] },
  { k: "Hours", lines: ["Monday – Saturday, 08:30 – 18:00 (GMT+8)"] },
];

function CompanyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10 px-6 py-6 md:px-14">
        <nav className="flex items-center justify-between text-[10px] tracking-[0.4em] uppercase">
          <Link to="/" className="transition-colors hover:text-accent">
            Chunqiu
          </Link>
          <Link to="/" className="text-muted-foreground transition-colors hover:text-accent">
            Back to the experience
          </Link>
        </nav>
      </header>

      <main className="px-6 md:px-14">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="border-b border-white/10 py-24 md:py-36"
        >
          <p className="text-[10px] tracking-[0.5em] text-accent uppercase">Company</p>
          <h1 className="mt-6 max-w-4xl text-3xl leading-[1.1] font-extralight tracking-tight md:text-6xl">
            Jining Chunqiu Import &amp; Export Co., Ltd.
          </h1>
          <div className="mt-10 grid max-w-5xl gap-8 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
            <p>
              We are a Shandong-based manufacturer and exporter of glass packaging for the spirits,
              liqueur, wine and fragrance trade. Our own furnaces, mould shop, decorating lines and
              packaging workshop sit under one management, so a bottle, its closure and its
              presentation case are engineered together rather than sourced separately.
            </p>
            <p>
              Work begins with a drawing or a physical sample. We cut the mould in house, run a
              first article for approval, then hold the same tooling for every repeat order — the
              neck bore, the wall distribution and the closure torque stay identical from the first
              container to the tenth. Every shipment leaves with full export documentation.
            </p>
          </div>
        </motion.section>

        <section className="border-b border-white/10 py-20 md:py-28">
          <p className="text-[10px] tracking-[0.5em] text-accent uppercase">Profile</p>
          <dl className="mt-10 grid gap-x-14 gap-y-6 md:grid-cols-2">
            {FACTS.map((f) => (
              <div
                key={f.k}
                className="flex items-baseline justify-between gap-6 border-b border-white/8 pb-4"
              >
                <dt className="text-[10px] tracking-[0.34em] text-muted-foreground uppercase">
                  {f.k}
                </dt>
                <dd className="text-right text-sm">{f.v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="py-20 md:py-28">
          <p className="text-[10px] tracking-[0.5em] text-accent uppercase">Contact</p>
          <div className="mt-10 grid gap-12 md:grid-cols-4">
            {CONTACT.map((c) => (
              <div key={c.k}>
                <h2 className="text-[10px] tracking-[0.34em] text-muted-foreground uppercase">
                  {c.k}
                </h2>
                <div className="mt-4 space-y-1 text-sm leading-relaxed">
                  {c.lines.map((line, i) => {
                    const href = c.hrefs?.[i];
                    return href ? (
                      <a
                        key={line}
                        href={href}
                        className="block transition-colors hover:text-accent"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={line}>{line}</p>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <a
            href="mailto:info@jnchunqiu.com"
            className="mt-16 inline-block border border-accent/60 px-8 py-4 text-[11px] tracking-[0.34em] text-accent uppercase transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
          >
            Request a quotation
          </a>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-10 text-[10px] tracking-[0.34em] text-muted-foreground uppercase md:px-14">
        © {new Date().getFullYear()} Jining Chunqiu Import &amp; Export Co., Ltd.
      </footer>
    </div>
  );
}
