import bottleAsset from "@/assets/bottle.jpg.asset.json";
import capAsset from "@/assets/cap.jpg.asset.json";
import boxAsset from "@/assets/box.jpg.asset.json";

export type CatalogItem = {
  ref: string;
  name: string;
  spec: string;
  image: string;
  /** external catalogue document — swap in the PDF link when supplied */
  doc?: string;
};

export type CatalogCategory = {
  slug: string;
  label: string;
  title: string;
  lead: string;
  items: CatalogItem[];
};

const grid = (
  prefix: string,
  image: string,
  names: [string, string][],
): CatalogItem[] =>
  names.map(([name, spec], i) => ({
    ref: `${prefix}-${String(i + 1).padStart(3, "0")}`,
    name,
    spec,
    image,
  }));

export const CATALOG: CatalogCategory[] = [
  {
    slug: "bottles",
    label: "Bottles",
    title: "Glass bodies",
    lead: "Super-flint bottles blown to custom moulds — spirits, liqueur, olive oil and fragrance formats from 50 ml to 1,500 ml.",
    items: grid("CQ", bottleAsset.url, [
      ["Straight decanter", "750 ml · flint · GPI 28-400"],
      ["Tall shoulder", "700 ml · flint · cork finish"],
      ["Faceted square", "500 ml · extra-flint"],
      ["Round classic", "500 ml · flint · screw"],
      ["Slim column", "375 ml · flint · cork"],
      ["Wide base", "1,000 ml · flint · screw"],
      ["Hip flask", "200 ml · flint · screw"],
      ["Miniature", "50 ml · flint · cork"],
      ["Heavy punt", "750 ml · extra-flint"],
    ]),
  },
  {
    slug: "closures",
    label: "Closures",
    title: "Caps & stoppers",
    lead: "Glass, cork, timber and metal closures, pressure-tested against the matching neck finish.",
    items: grid("CAP", capAsset.url, [
      ["Faceted glass head", "Glass + natural cork"],
      ["Domed glass head", "Glass + agglomerate cork"],
      ["Timber top", "Oak + natural cork"],
      ["Polished metal", "Zamak + T-cork"],
      ["Gold plated", "Zamak · 24k finish"],
      ["Matte black", "Zamak · soft-touch"],
      ["Aluminium screw", "28-400 · pilfer-proof"],
      ["Pourer insert", "PE + cork"],
      ["Wax dip ready", "Cork · wax compatible"],
    ]),
  },
  {
    slug: "cases",
    label: "Cases",
    title: "Presentation packaging",
    lead: "Timber, leather-wrapped and rigid board cases with velvet or foam interiors, drop-tested for export.",
    items: grid("PACK", boxAsset.url, [
      ["Twin-door timber", "Solid timber · red velvet"],
      ["Sliding lid timber", "Solid timber · foam"],
      ["Hinged lid timber", "Pine · satin lining"],
      ["Leather wrap", "PU leather · magnet"],
      ["Rigid board", "Grey board · foil print"],
      ["Two-bottle case", "Timber · twin cradle"],
      ["Tube case", "Kraft · foam insert"],
      ["Drawer case", "Rigid board · ribbon"],
      ["Shipper carton", "5-ply · partitioned"],
    ]),
  },
];

export const categoryBySlug = (slug: string) => CATALOG.find((c) => c.slug === slug);
