import { BarcodeStrip } from "./Barcode";

export function FinePrint() {
  return (
    <footer className="px-5 py-24 md:px-12 md:py-32">
      <BarcodeStrip />
      <div className="mt-16 grid gap-14 md:grid-cols-3">
        <div>
          <h3 className="font-mono text-[10px] tracking-[0.5em] text-accent uppercase">
            Manufacturer
          </h3>
          <p className="font-mono mt-5 text-[11px] leading-loose tracking-[0.2em] uppercase">
            Jining Chunqiu Import &amp; Export Co., Ltd.
            <br />
            No. 141 Guanghe Road, Jiahui Building,
            <br />
            Rencheng District, Jining, Shandong, China
          </p>
        </div>
        <div>
          <h3 className="font-mono text-[10px] tracking-[0.5em] text-accent uppercase">Contact</h3>
          <p className="font-mono mt-5 text-[11px] leading-loose tracking-[0.2em] uppercase">
            <a href="tel:+865372366968" className="hover:text-accent">
              +86 537 2366968
            </a>
            <br />
            <a href="tel:+8615053733338" className="hover:text-accent">
              +86 150 5373 3338
            </a>
            <br />
            <a href="mailto:info@jnchunqiu.com" className="hover:text-accent">
              info@jnchunqiu.com
            </a>
          </p>
        </div>
        <div>
          <h3 className="font-mono text-[10px] tracking-[0.5em] text-accent uppercase">
            Fine print
          </h3>
          <p className="font-mono mt-5 text-[11px] leading-loose tracking-[0.2em] text-muted-foreground uppercase">
            Glass is fragile. Store upright, away from direct impact. Specifications are indicative
            and subject to mould tolerance. All references are proprietary designs.
          </p>
        </div>
      </div>

      <p className="font-display mt-24 text-[13vw] leading-none tracking-tighter uppercase md:text-[9vw]">
        Chunqiu Glass
      </p>
      <p className="font-mono mt-6 text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
        © {new Date().getFullYear()} Jining Chunqiu Import &amp; Export Co., Ltd. — Handle with care
      </p>
    </footer>
  );
}
