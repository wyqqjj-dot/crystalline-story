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
  { k: "Origin", v: "Shandong, China" },
  { k: "Lead time", v: "35 – 45 days after mould approval" },
  { k: "Export packing", v: "Export carton, pallet or shrink wrap" },
];

/** Detailed, per-reference specification text shown next to the PDF preview. */
export function itemSpecs(categorySlug: string, item: CatalogItem): ItemSpec[] {
  const parts = item.spec
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);

  if (categorySlug === "bottles") {
    return [
      { k: "Reference", v: item.ref },
      { k: "Model", v: item.name },
      { k: "Capacity", v: parts[0] ?? "On request" },
      { k: "Glass", v: parts[1] ?? "Super-flint glass" },
      { k: "Neck finish", v: parts[2] ?? "Specified per project" },
      { k: "Body", v: item.note },
      { k: "Wall", v: "Even wall, 2.4 – 3.2 mm" },
      { k: "Tolerance", v: "±0.15 mm on the neck bore" },
      { k: "Decoration", v: "Screen print · foil · frosting · deboss" },
      { k: "Testing", v: "Internal pressure, thermal shock, verticality" },
      { k: "MOQ", v: "3,000 pcs per mould" },
      ...COMMON,
    ];
  }

  if (categorySlug === "closures") {
    return [
      { k: "Reference", v: item.ref },
      { k: "Model", v: item.name },
      { k: "Type", v: parts[0] ?? "Closure" },
      { k: "Material", v: parts[1] ?? "Pressed glass · cork · timber · zamak" },
      { k: "Matched finish", v: parts[2] ?? "Cut to the bottle neck" },
      { k: "Detail", v: item.note },
      { k: "Crown", v: "Sealed top, polished on every face" },
      { k: "Plug", v: "Food-grade natural cork or synthetic" },
      { k: "Seal", v: "Airtight, 100% leak tested" },
      { k: "Torque", v: "12 – 18 in·lb where threaded" },
      { k: "MOQ", v: "3,000 pcs per reference" },
      ...COMMON,
    ];
  }

  return [
    { k: "Reference", v: item.ref },
    { k: "Model", v: item.name },
    { k: "Format", v: parts[0] ?? "Presentation case" },
    { k: "Shell", v: parts[1] ?? "Solid timber · rigid board · leather wrap" },
    { k: "Interior", v: parts[2] ?? "Velvet or die-cut foam, fitted to the bottle" },
    { k: "Detail", v: item.note },
    { k: "Closure", v: "Twin doors, magnet or ribbon pull" },
    { k: "Print", v: "Foil · deboss · silk screen · UV" },
    { k: "Transit", v: "Drop tested from 1.2 m, fully loaded" },
    { k: "MOQ", v: "1,000 pcs per format" },
    ...COMMON,
  ];
}
