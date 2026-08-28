import { Reveal } from "./Reveal";
import { BarcodeStrip } from "./Barcode";

const items = [
  { n: "01", k: "Concept", v: "Mould design, 3D proofing and bespoke bottle silhouettes." },
  { n: "02", k: "Craftsmanship", v: "Furnace forming, fire polishing, frosting, spray and decal decoration." },
  { n: "03", k: "Quality", v: "Annealing control, leak and torque testing, food-grade certification." },
  { n: "04", k: "Logistics", v: "Export cartons, palletising and full container loading from Qingdao." },
];

export function Ingredients() {
  return (
    <section
      id="ingredients"
      className="border-b-2 border-foreground px-5 py-28 md:px-12 md:py-40"
    >
      <div className="font-mono flex items-center justify-between text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
        <span>Ingredients</span>
        <span>Contains no filler</span>
      </div>

      <Reveal>
        <h2 className="font-display mt-12 text-[18vw] leading-[0.78] tracking-tighter uppercase md:text-[11vw]">
          Ingredients
        </h2>
      </Reveal>

      <div className="mt-20 md:mt-32">
        {items.map((it, i) => (
          <Reveal key={it.n} delay={i * 0.06}>
            <div className="hover-invert flex flex-col gap-4 border-t border-foreground/25 px-2 py-10 md:flex-row md:items-baseline md:gap-16 md:py-14">
              <span className="font-mono text-[11px] tracking-[0.5em] text-accent uppercase">
                {it.n}
              </span>
              <h3 className="font-display min-w-[36%] text-[11vw] leading-[0.85] tracking-tighter uppercase md:text-[5vw]">
                {it.k}
              </h3>
              <p className="font-mono max-w-[42ch] text-[11px] leading-loose tracking-[0.2em] uppercase">
                {it.v}
              </p>
            </div>
          </Reveal>
        ))}
        <div className="border-t border-foreground/25" />
      </div>

      <BarcodeStrip />
    </section>
  );
}
