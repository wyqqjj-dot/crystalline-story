const widths = [1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 5, 2, 1, 1, 3, 1, 2, 2, 4, 1, 1, 2, 3, 1, 1, 4, 2, 1, 3, 1, 2, 5, 1, 1, 2, 3, 1, 2, 1, 4];

export function Barcode({ label = "8 601429 003771", className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex h-12 items-end gap-[3px] md:h-16">
        {widths.map((w, i) => (
          <span
            key={i}
            style={{ width: w * 2 }}
            className={`h-full bg-foreground ${i % 7 === 0 ? "opacity-30" : ""}`}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] tracking-[0.6em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

export function BarcodeStrip() {
  return (
    <div className="flex w-full items-end gap-[3px] overflow-hidden py-6 opacity-70">
      {Array.from({ length: 160 }, (_, i) => (
        <span
          key={i}
          style={{ width: ((i * 37) % 5) + 1, height: 14 + ((i * 23) % 26) }}
          className="bg-foreground"
        />
      ))}
    </div>
  );
}
