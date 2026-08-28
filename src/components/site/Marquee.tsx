export function Marquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const row = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-border py-4">
      <div
        className={`flex w-max gap-10 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {row.map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="flex items-center gap-10 font-mono text-[11px] tracking-[0.35em] whitespace-nowrap text-muted-foreground uppercase"
          >
            {t}
            <span className="text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
