import { AnimatePresence, motion } from "framer-motion";

const links = [
  { href: "#top", label: "Home" },
  { href: "#ingredients", label: "Products" },
  { href: "#inquiry", label: "Inquiry" },
];

export function NavBar({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-[800] border-b-2 border-foreground bg-background/80 backdrop-blur-md"
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-12">
            <a
              href="#top"
              className="font-display text-lg leading-none tracking-tighter uppercase md:text-2xl"
            >
              Chunqiu <span className="text-accent">Glass</span>
            </a>
            <div className="font-mono flex gap-6 text-[10px] tracking-[0.4em] uppercase md:gap-12">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="hover:text-accent">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
