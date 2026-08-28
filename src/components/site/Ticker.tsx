export function Ticker({
  items,
  reverse = false,
  size = "md",
  accent = false,
}: {
  items: string[];
  reverse?: boolean;
  size?: "md" | "lg";
  accent?: boolean;
}) {
  const row = [...items, ...items, ...items];
  return (
    <div
      className={`relative overflow-hidden border-y-2 border-foreground ${
        accent ? "bg-accent text-accent-foreground" : "bg-transparent text-foreground"
      }`}
    >
      <div
        className={`flex w-max items-center gap-12 py-4 md:py-6 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {row.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className={`flex items-center gap-12 font-display whitespace-nowrap uppercase ${
              size === "lg"
                ? "text-[9vw] leading-none tracking-tight md:text-[6vw]"
                : "text-[6vw] leading-none tracking-tight md:text-[2.6vw]"
            }`}
          >
            {t}
            <span className={accent ? "opacity-60" : "text-accent"}>✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
