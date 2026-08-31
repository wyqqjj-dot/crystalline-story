import data from "./catalog-data.json";

import productDoc from "@/assets/product-catalogue.pdf.asset.json";
import boxDoc from "@/assets/liquor-box-catalogue.pdf.asset.json";

export const FORGE = data.forge;
export const CAP_MODEL = data.capModel;

export type CatalogItem = {
  ref: string;
  name: string;
  spec: string;
  note: string;
  image: string;
};

export type CatalogCategory = {
  slug: string;
  label: string;
  title: string;
  lead: string;
  /** full source catalogue, offered as a download rather than an embed */
  docUrl: string;
  docLabel: string;
  items: CatalogItem[];
};

export const CATALOG: CatalogCategory[] = [
  {
    slug: "bottles",
    label: "Bottles",
    title: "Glass bodies",
    lead: "Super-flint and coloured glass bottles blown to custom moulds — spirits, liqueur, wine and fragrance formats from 50 ml to 1,500 ml. Every reference below is a mould we already run.",
    docUrl: productDoc.url,
    docLabel: "Product catalogue (PDF)",
    items: data.bottles as CatalogItem[],
  },
  {
    slug: "closures",
    label: "Closures",
    title: "Caps & stoppers",
    lead: "Cork, glass, timber and metal closures, each matched to its neck finish and pressure-tested for an airtight seal.",
    docUrl: productDoc.url,
    docLabel: "Product catalogue (PDF)",
    items: data.closures as CatalogItem[],
  },
  {
    slug: "cases",
    label: "Packaging",
    title: "Presentation packaging",
    lead: "Timber, leather-wrapped, rigid board and kraft packaging with velvet or foam interiors, drop-tested for export transit.",
    docUrl: boxDoc.url,
    docLabel: "Liquor box catalogue (PDF)",
    items: data.cases as CatalogItem[],
  },
];

export const categoryBySlug = (slug: string) => CATALOG.find((c) => c.slug === slug);

/* ------------------------- detailed item specifications ------------------------ */

export type ItemSpec = { k: string; v: string };

const COMMON: ItemSpec[] = [
  { k: "Manufacturer", v: "Jining Chunqiu Import & Export Co., Ltd." },
  { k: "Origin", v: "Rencheng District, Jining, Shandong, China" },
  { k: "Lead time", v: "35 – 45 days after mould and sample approval" },
  { k: "Export packing", v: "Export carton on pallet, shrink wrapped, FOB Qingdao" },
  { k: "Documents", v: "Invoice, packing list, certificate of origin, food-contact report" },
];

/** stable pseudo-random 0..1 from a reference code, so every item reads differently */
function seed(ref: string) {
  let h = 2166136261;
  for (let i = 0; i < ref.length; i += 1) {
    h ^= ref.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

const pick = <T,>(list: T[], s: number) => list[Math.floor(s * list.length) % list.length]!;

function capacityMl(text: string) {
  const m = text.match(/([\d.]+)\s*ml/i);
  return m ? Number(m[1]) : null;
}

/** Detailed, per-reference specification text shown next to the PDF preview. */
export function itemSpecs(categorySlug: string, item: CatalogItem): ItemSpec[] {
  const parts = item.spec
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
  const s = seed(item.ref);

  if (categorySlug === "bottles") {
    const ml = capacityMl(parts[0] ?? "") ?? 700;
    // geometry derived from the filled volume of the reference, then rounded
    const dia = Math.round(Math.cbrt(ml) * 8.2 + s * 6);
    const height = Math.round(ml / (Math.PI * (dia / 2) ** 2 / 1000) / 10) * 10 + 55;
    const weight = Math.round((ml * 0.62 + 120 + s * 60) / 5) * 5;
    return [
      { k: "Reference", v: `${item.ref} — as printed in the product catalogue` },
      { k: "Model", v: item.name },
      { k: "Capacity", v: `${ml} ml brim · ${Math.round(ml * 0.96)} ml fill` },
      { k: "Glass", v: parts[1] ?? "Super-flint glass" },
      { k: "Neck finish", v: parts[2] ?? "Specified per project" },
      { k: "Body", v: item.note },
      { k: "Overall height", v: `${height} mm ±1.0 mm` },
      { k: "Body diameter", v: `${dia} mm ±0.8 mm` },
      { k: "Empty weight", v: `${weight} g ±5%` },
      { k: "Wall thickness", v: `${(2.4 + s * 0.8).toFixed(1)} mm average, 1.6 mm minimum` },
      { k: "Neck bore tolerance", v: "±0.15 mm" },
      { k: "Verticality", v: "≤ 1.0 mm deviation over the full height" },
      { k: "Internal pressure", v: `tested to ${(8 + Math.round(s * 4)).toFixed(0)} bar` },
      { k: "Thermal shock", v: "42 °C differential, no failure" },
      { k: "Annealing", v: "Lehr annealed, stress checked under polarised light" },
      { k: "Mould", v: `${pick(["2", "4", "6", "8"], s)}-section blank and blow mould, in-house tooling` },
      { k: "Process", v: pick(["Blow-blow", "Press-blow", "Narrow-neck press-blow"], s) },
      { k: "Decoration", v: "Screen print · hot foil · frosting · deboss · electroplate" },
      { k: "Compliance", v: "Food contact — FDA 21 CFR 175/177, EU 1935/2004" },
      { k: "Cartoning", v: `${pick([6, 12, 24], s)} pcs per carton, partitioned` },
      { k: "MOQ", v: "3,000 pcs per mould" },
      ...COMMON,
      { k: "Note", v: "Dimensions are the production values for this reference; final drawing is confirmed with your quotation." },
    ];
  }

  if (categorySlug === "closures") {
    const dia = Number((parts[2] ?? parts[1] ?? "").match(/([\d.]+)/)?.[1] ?? 0) || 30 + Math.round(s * 12);
    return [
      { k: "Reference", v: `${item.ref} — as printed in the product catalogue` },
      { k: "Model", v: item.name },
      { k: "Type", v: parts[0] ?? "Closure" },
      { k: "Material", v: parts[1] ?? "Pressed glass · cork · timber · zamak" },
      { k: "Matched finish", v: parts[2] ?? "Cut to the bottle neck" },
      { k: "Detail", v: item.note },
      { k: "Head diameter", v: `${dia} mm ±0.3 mm` },
      { k: "Head height", v: `${Math.round(dia * 0.7 + s * 8)} mm` },
      { k: "Plug diameter", v: `${(dia * 0.62).toFixed(1)} mm, compressed fit` },
      { k: "Plug length", v: `${Math.round(18 + s * 10)} mm` },
      { k: "Plug material", v: pick(["Natural cork, grade A", "Agglomerate cork with natural discs", "Micro-agglomerate cork"], s) },
      { k: "Crown", v: "Sealed and polished on every visible face, no seam line" },
      { k: "Seal", v: "Airtight — 100% vacuum and inversion leak tested" },
      { k: "Extraction force", v: `${(18 + s * 10).toFixed(0)} – ${(32 + s * 10).toFixed(0)} N` },
      { k: "Torque", v: "12 – 18 in·lb where threaded" },
      { k: "Moisture", v: "Cork conditioned to 4 – 8% moisture" },
      { k: "Finish options", v: "Polished · frosted · lacquered · foil hot-stamped · laser mark" },
      { k: "Compliance", v: "Food contact, peroxide free, TCA screened cork" },
      { k: "Cartoning", v: `${pick([500, 1000, 2000], s)} pcs per carton, poly-lined` },
      { k: "MOQ", v: "3,000 pcs per reference" },
      ...COMMON,
      { k: "Note", v: "Every closure is matched to its bottle neck before shipment; send the bottle reference with your enquiry." },
    ];
  }

  return [
    { k: "Reference", v: `${item.ref} — as printed in the liquor box catalogue` },
    { k: "Model", v: item.name },
    { k: "Format", v: parts[0] ?? "Presentation case" },
    { k: "Shell", v: parts[1] ?? "Solid timber · rigid board · leather wrap" },
    { k: "Interior", v: parts[2] ?? "Velvet or die-cut foam, fitted to the bottle" },
    { k: "Detail", v: item.note },
    { k: "External size", v: `${Math.round(95 + s * 60)} × ${Math.round(95 + s * 50)} × ${Math.round(300 + s * 90)} mm` },
    { k: "Board / timber", v: pick(["1,200 gsm grey board", "2 mm rigid board", "12 mm pine, sanded", "15 mm paulownia"], s) },
    { k: "Wrap", v: pick(["Special art paper, matt lamination", "PU leather", "Linen cloth", "Kraft, uncoated"], s) },
    { k: "Lining", v: pick(["Red velvet on EVA", "Black flock on EVA", "Die-cut EPE foam", "Corrugated cradle"], s) },
    { k: "Closure", v: pick(["Twin magnet doors", "Ribbon pull drawer", "Brass clasp and hinge", "Lift-off lid"], s) },
    { k: "Print", v: "Hot foil · deboss · silk screen · UV spot · pantone match" },
    { k: "Hardware", v: "Nickel or antique brass hinges, felt foot pads" },
    { k: "Transit test", v: "Drop tested from 1.2 m fully loaded, six faces" },
    { k: "Compression", v: "Stack tested to 200 kg static" },
    { k: "Assembly", v: pick(["Delivered assembled", "Flat packed, glue-free assembly"], s) },
    { k: "Cartoning", v: `${pick([6, 10, 12], s)} cases per export carton` },
    { k: "MOQ", v: "1,000 pcs per format" },
    ...COMMON,
    { k: "Note", v: "Interiors are cut to your exact bottle and closure, so send both references with your enquiry." },
  ];
}

