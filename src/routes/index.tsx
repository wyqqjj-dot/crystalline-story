import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Seal } from "@/components/site/Seal";
import { NavBar } from "@/components/site/NavBar";
import { Ticker } from "@/components/site/Ticker";
import { SpecSheet } from "@/components/site/SpecSheet";
import { Assembly } from "@/components/site/Assembly";
import { Boxing } from "@/components/site/Boxing";
import { Ingredients } from "@/components/site/Ingredients";
import { Inquiry } from "@/components/site/Inquiry";
import { FinePrint } from "@/components/site/FinePrint";
import { Barcode } from "@/components/site/Barcode";
import { Cursor } from "@/components/site/Cursor";
import { Atmosphere } from "@/components/site/Atmosphere";
import bottleAsset from "@/assets/bottle.jpg.asset.json";
import capAsset from "@/assets/cap.jpg.asset.json";
import boxAsset from "@/assets/box.jpg.asset.json";

const title = "Chunqiu Glass — Premium Glass Bottles, Caps & Export Packaging";
const description =
  "Jining Chunqiu Import & Export Co., Ltd. manufactures ultra-clear glass bottles, airtight caps and export-standard gift packaging. A digital product experience.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  const [opened, setOpened] = useState(false);
  const [shipped, setShipped] = useState(false);

  return (
    <>
      <Seal onOpen={() => setOpened(true)} />
      <Cursor />
      <Atmosphere />
      <NavBar show={opened && shipped} />

      <main id="top" className="relative z-10 text-foreground">
        <Ticker
          items={[
            "Digital brand experience",
            "Premium glassware",
            "Handle with care",
            "Made in Jining, China",
          ]}
          size="lg"
        />

        <section className="border-b-2 border-foreground px-5 py-28 md:px-12 md:py-40">
          <div className="font-mono flex items-center justify-between text-[10px] tracking-[0.5em] text-muted-foreground uppercase">
            <span>Product no. CQ-2026</span>
            <span>Contents: 3 ingredients</span>
          </div>
          <h1 className="font-display mt-16 text-[18vw] leading-[0.76] tracking-tighter uppercase md:text-[12vw]">
            Chunqiu
            <span className="block text-accent">Glass</span>
          </h1>
          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3">
            <p className="font-mono max-w-[34ch] text-[11px] leading-loose tracking-[0.3em] uppercase md:col-span-2">
              A glassware factory, packaged as a digital product. Scroll to unbox the bottle, the
              cap, the assembly and the export carton — one continuous specification sheet.
            </p>
            <Barcode label="CQ 2026 GLASS 001" className="md:justify-self-end" />
          </div>
        </section>

        <SpecSheet
          id="bottle"
          ref="REF: GLASS-BODY-001"
          index="01"
          title="The Bottle"
          subtitle="Furnace-formed flint glass body · 750 ml · Screw finish"
          image={bottleAsset.url}
          alt="Ultra-clear cylindrical glass spirit bottle with screw neck finish"
          specs={[
            { k: "Purity", v: "99.9%" },
            { k: "Clarity", v: "Ultra-Clear" },
            { k: "Origin", v: "Premium Sand" },
            { k: "Capacity", v: "750 ml / 500 ml" },
            { k: "Finish", v: "GPI 28-400 Screw" },
          ]}
          note="Warning: handle with care — fragile"
        />

        <Ticker
          reverse
          accent
          items={["Ingredient 02 — the cap", "Airtight", "Food-grade safe", "Matte / Glossy"]}
        />

        <SpecSheet
          id="cap"
          ref="REF: CAP-SEAL-002"
          index="02"
          title="The Cap"
          subtitle="Anodised aluminium screw cap with sealing liner"
          image={capAsset.url}
          alt="Gold ribbed anodised aluminium screw cap for spirit bottles"
          specs={[
            { k: "Material", v: "Food-Grade Safe" },
            { k: "Seal", v: "Airtight" },
            { k: "Finish", v: "Matte / Glossy" },
            { k: "Torque", v: "12–18 in·lb" },
            { k: "Colours", v: "Gold / Black / Custom" },
          ]}
          note="Do not over-torque · Test batch approved"
          flip
        />

        <Assembly />

        <SpecSheet
          id="box"
          ref="REF: PACK-BOX-003"
          index="03"
          title="The Box"
          subtitle="Rigid presentation box with EVA insert and magnet closure"
          image={boxAsset.url}
          alt="Matte black rigid presentation gift box for a glass spirit bottle"
          specs={[
            { k: "Type", v: "Export Standard" },
            { k: "Protection", v: "Shock-Absorbing" },
            { k: "Board", v: "1200 gsm Rigid" },
            { k: "Print", v: "Hot Foil / Emboss" },
            { k: "Drop Test", v: "Passed 1.2 m" },
          ]}
          note="This side up · Keep dry"
        />

        <Boxing onComplete={() => setShipped(true)} />

        <Ticker
          items={["Now shipping worldwide", "OEM & ODM", "FOB Qingdao", "Samples available"]}
          size="lg"
        />

        <Ingredients />
        <Inquiry />
        <FinePrint />
      </main>
    </>
  );
}
