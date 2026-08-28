import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#philosophy", label: "品牌理念" },
  { href: "#works", label: "作品" },
  { href: "#craft", label: "工艺" },
  { href: "#contact", label: "询价" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "surface-glass" : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <a
          href="#top"
          className="font-display text-lg tracking-[0.35em] text-foreground md:text-xl"
        >
          VITRÉA
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="切换菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-px w-6 bg-foreground transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`}
          />
          <span
            className={`block h-px w-6 bg-foreground transition-transform duration-300 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
          />
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-border md:hidden ${open ? "max-h-64" : "max-h-0 border-transparent"} transition-all duration-500`}
      >
        <div className="flex flex-col px-5 py-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-sm tracking-[0.2em] text-muted-foreground uppercase"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </motion.header>
  );
}
