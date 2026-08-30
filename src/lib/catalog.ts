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
