import { useEffect, useState } from "react";

export function Cursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      const el = e.target as HTMLElement | null;
      setActive(!!el?.closest("a,button,input,textarea,[data-cursor='grow']"));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[999] hidden mix-blend-difference md:block"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms ease",
      }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-white/90 transition-[width,height,background-color] duration-300 ease-out"
        style={{
          width: active ? 48 : 10,
          height: active ? 48 : 10,
          backgroundColor: active ? "transparent" : "white",
        }}
      />
    </div>
  );
}
