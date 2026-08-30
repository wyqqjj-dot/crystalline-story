import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { CATALOG, categoryBySlug, type CatalogCategory, type CatalogItem } from "@/lib/catalog";

export const Route = createFileRoute("/catalog/$category")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.category;
    const title = c
      ? `${c.title} — Chunqiu Catalogue`
      : "Catalogue — Chunqiu Glass Manufacturing";
    const description =
      c?.lead ??
      "Browse Chunqiu glass bottles, closures and presentation cases with references and specifications.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CatalogPage,
});

const PAGE = 36;

/* --------------------------------- lightbox -------------------------------- */

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: CatalogItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const item = items[index]!;
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState(false);

  const step = useCallback(
    (d: number) => {
      setLoaded(false);
      setZoom(false);
      onIndex((index + d + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, step]);

  /* neighbour prefetch keeps stepping instant */
  useEffect(() => {
    [1, -1].forEach((d) => {
      const n = items[(index + d + items.length) % items.length];
      if (n) {
        const img = new Image();
        img.src = n.image;
      }
    });
  }, [index, items]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 px-5 py-4 md:px-8">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.4em] text-accent uppercase">{item.ref}</p>
          <p className="mt-2 truncate text-sm">{item.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 border border-white/20 px-4 py-2 text-[10px] tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:border-white/60 hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto px-3 pb-3">
        {!loaded && (
          <div className="absolute h-[52vh] w-[70vw] max-w-md animate-pulse bg-white/5" aria-hidden />
        )}
        <img
          key={item.image}
          src={item.image}
          alt={`${item.ref} ${item.name} — ${item.spec}`}
          onLoad={() => setLoaded(true)}
          onClick={() => setZoom((z) => !z)}
          className={`origin-center transition-transform duration-300 ${
            zoom ? "max-w-none scale-[1.9] cursor-zoom-out" : "max-h-full max-w-full cursor-zoom-in"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 md:px-8">
        <button
          type="button"
          onClick={() => step(-1)}
          className="border border-white/20 px-5 py-3 text-[10px] tracking-[0.3em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          ← Prev
        </button>
        <p className="truncate text-center text-[10px] tracking-[0.28em] text-muted-foreground uppercase">
          {item.spec}
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          className="border border-white/20 px-5 py-3 text-[10px] tracking-[0.3em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- page ---------------------------------- */

function CatalogPage() {
  const { category } = Route.useLoaderData();
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    setShown(PAGE);
    setOpen(null);
  }, [category.slug]);

  const items = category.items;

  return (
    <div className="min-h-screen bg-background px-5 pt-24 pb-24 text-foreground md:px-14 md:pt-36">
      <Link
        to="/"
        className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase transition-colors hover:text-accent"
      >
        ← Back to the experience
      </Link>

      <p className="mt-12 text-[10px] tracking-[0.5em] text-accent uppercase">
        Catalogue · {items.length} references
      </p>
      <h1 className="mt-5 text-3xl leading-[1.04] font-light tracking-tight md:text-6xl">
        {category.title}
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">{category.lead}</p>

      <nav className="mt-9 flex flex-wrap gap-2 md:gap-3">
        {CATALOG.map((c) => (
          <Link
            key={c.slug}
            to="/catalog/$category"
            params={{ category: c.slug }}
            className={`border px-4 py-3 text-[10px] tracking-[0.28em] uppercase transition-colors duration-500 md:px-5 md:tracking-[0.34em] ${
              c.slug === category.slug
                ? "border-accent text-accent"
                : "border-white/15 text-muted-foreground hover:border-accent/60 hover:text-accent"
            }`}
          >
            {c.label}
          </Link>
        ))}
        <a
          href={category.docUrl}
          target="_blank"
          rel="noreferrer"
          className="border border-white/15 px-4 py-3 text-[10px] tracking-[0.28em] text-muted-foreground uppercase transition-colors hover:border-accent/60 hover:text-accent md:px-5"
        >
          {category.docLabel} ↓
        </a>
      </nav>

      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {items.slice(0, shown).map((item, i) => (
          <article key={item.ref} className="group">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="block w-full cursor-zoom-in text-left"
              aria-label={`${item.ref} ${item.name} — enlarge`}
            >
              <div className="overflow-hidden border border-white/10 bg-white/[0.02] transition-colors duration-500 group-hover:border-accent/50">
                <img
                  src={item.image}
                  alt={`${item.ref} ${item.name} — ${item.spec}`}
                  loading="lazy"
                  decoding="async"
                  width={520}
                  height={640}
                  className="aspect-[4/5] w-full object-contain transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </div>
              <p className="mt-3 text-[10px] tracking-[0.34em] text-accent uppercase">{item.ref}</p>
              <h2 className="mt-2 text-sm font-light">{item.name}</h2>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.spec}</p>
            </button>
          </article>
        ))}
      </div>

      {shown < items.length && (
        <button
          type="button"
          onClick={() => setShown((s) => s + PAGE)}
          className="mt-14 border border-accent/60 px-8 py-4 text-[11px] tracking-[0.34em] text-accent uppercase transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
        >
          Load more ({items.length - shown} left)
        </button>
      )}

      {open !== null && (
        <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}

      <div className="mt-20 border-t border-white/10 pt-10">
        <a
          href="/#inquiry"
          className="inline-flex border border-accent/60 px-8 py-4 text-[11px] tracking-[0.34em] text-accent uppercase transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
        >
          Request this range
        </a>
      </div>
    </div>
  );
}
