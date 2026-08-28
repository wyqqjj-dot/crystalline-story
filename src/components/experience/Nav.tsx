import { useEffect, useState } from "react";

const links = [
  { href: "#company", label: "Company" },
  { href: "#catalogue", label: "Catalogue" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#inquiry", label: "Inquiry" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${
        solid ? "bg-background/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-5 md:px-14">
        <a href="#top" className="text-xs tracking-[0.42em] uppercase">
          Chunqiu
        </a>
        <div className="flex gap-6 text-[10px] tracking-[0.34em] text-muted-foreground uppercase md:gap-10">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-accent">
              {l.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
