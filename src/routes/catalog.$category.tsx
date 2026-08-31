import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import {
  CATALOG,
  categoryBySlug,
  itemSpecs,
  type CatalogCategory,
  type CatalogItem,
} from "@/lib/catalog";

export const Route = createFileRoute("/catalog/$category")({
  loader: ({ params }) => {
    const category = categoryBySlug(params.category);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => {
    const c = loaderData?.category;
    const title = c ? `${c.title} — Chunqiu Catalogue` : "Catalogue — Chunqiu Glass Manufacturing";
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
const pdfCache = new Set<string>();

function warmPdf(url: string) {
  if (pdfCache.has(url) || typeof document === "undefined") return;
  pdfCache.add(url);
  const frame = document.createElement("iframe");
  frame.src = `${url}#view=FitH`;
  frame.title = "Catalogue preloader";
  frame.tabIndex = -1;
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;border:0";
  document.body.appendChild(frame);
  window.setTimeout(() => frame.remove(), 45_000);
}

function DocViewer({
  category,
  page,
  item,
  onClose,
}: {
  category: CatalogCategory;
  page?: number;
  item?: CatalogItem | null;
  onClose: () => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = `${category.docUrl}#page=${page ?? 1}&view=FitH`;
  const specs = item ? itemSpecs(category.slug, item) : null;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    warmPdf(category.docUrl);
    const timeout = window.setTimeout(() => {
      setFailed(true);
      if (attempt < 2) setAttempt((value) => value + 1);
    }, 12_000);
    return () => window.clearTimeout(timeout);
  }, [category.docUrl, page, attempt]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-background" role="dialog" aria-modal="true" aria-label={category.docLabel}>
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border px-5 py-4 md:px-8">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.38em] text-accent uppercase">
            {item ? `Specification · ${item.ref}` : "Source document"}
          </p>
          <h2 className="mt-1 truncate text-sm font-medium">{item ? item.name : category.docLabel}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close document preview"
          className="shrink-0 border border-border px-4 py-2 text-[10px] tracking-[0.28em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Close
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="relative min-h-[52vh] flex-1 bg-muted/30 lg:min-h-0">
          {!loaded && !failed && (
            <div className="absolute inset-0 flex items-center justify-center" aria-label="Loading document">
              <div className="w-[min(86vw,28rem)] space-y-3" aria-hidden="true">
                <div className="h-4 animate-pulse bg-muted" />
                <div className="h-[45vh] animate-pulse bg-muted" />
                <div className="h-3 w-2/3 animate-pulse bg-muted" />
              </div>
            </div>
          )}
          {failed && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 px-6 text-center">
              <p className="text-sm text-muted-foreground">The catalogue could not be loaded.</p>
              <button
                type="button"
                onClick={() => setAttempt((value) => value + 1)}
                className="border border-accent px-5 py-3 text-[10px] tracking-[0.3em] text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Retry preview
              </button>
            </div>
          )}
          <iframe
            key={`${src}-${attempt}`}
            src={src}
            title={`${category.docLabel} preview`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className={`h-full w-full border-0 transition-opacity duration-300 ${loaded && !failed ? "opacity-100" : "opacity-0"}`}
            allow="fullscreen"
          />
        </div>

        {/* right-hand specification panel, side by side with the PDF preview */}
        {specs && item && (
          <aside className="min-h-0 w-full shrink-0 overflow-y-auto border-t border-border px-5 py-6 lg:w-[26rem] lg:border-t-0 lg:border-l lg:px-7">
            <img
              src={item.image}
              alt={`${item.ref} ${item.name}`}
              className="aspect-[4/5] w-32 border border-border bg-card object-contain"
            />
            <p className="mt-5 text-[10px] tracking-[0.38em] text-accent uppercase">Full specification</p>
            <h3 className="mt-2 text-xl font-light tracking-tight">{item.name}</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{item.spec}</p>

            <dl className="mt-6 space-y-3">
              {specs.map((s) => (
                <div key={s.k} className="flex items-baseline justify-between gap-6 border-b border-border pb-3">
                  <dt className="shrink-0 text-[10px] tracking-[0.28em] text-muted-foreground uppercase">{s.k}</dt>
                  <dd className="text-right text-[12px] leading-relaxed">{s.v}</dd>
                </div>
              ))}
            </dl>

            <a
              href="/#inquiry"
              className="mt-7 inline-flex border border-accent/60 px-6 py-3 text-[10px] tracking-[0.3em] text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Request {item.ref}
            </a>
          </aside>
        )}
      </div>
    </div>
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
  onPreview,
}: {
  items: CatalogItem[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
  onPreview: (page?: number) => void;
}) {
  const item = items[index];
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  const step = useCallback(
    (delta: number) => {
      setLoaded(false);
      setZoom(false);
      onIndex((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    [1, -1].forEach((delta) => {
      const next = items[(index + delta + items.length) % items.length];
      if (next) {
        const image = new Image();
        image.src = next.image;
      }
    });
  }, [index, items]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4 px-5 py-4 md:px-8">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.4em] text-accent uppercase">{item.ref}</p>
          <p className="mt-2 truncate text-sm">{item.name}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product image"
          className="shrink-0 border border-border px-4 py-2 text-[10px] tracking-[0.3em] text-muted-foreground uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Close
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto px-3 pb-3">
        {!loaded && <div className="absolute h-[52vh] w-[70vw] max-w-md animate-pulse bg-muted" aria-hidden="true" />}
        <img
          key={item.image}
          src={item.image}
          alt={`${item.ref} ${item.name} — ${item.spec}`}
          onLoad={() => setLoaded(true)}
          onClick={() => setZoom((value) => !value)}
          className={`origin-center transition-transform duration-300 ${
            zoom ? "max-w-none scale-[1.9] cursor-zoom-out" : "max-h-full max-w-full cursor-zoom-in"
          } ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 md:px-8">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous product"
          className="border border-border px-5 py-3 text-[10px] tracking-[0.3em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          ← Prev
        </button>
        <p className="order-3 w-full truncate text-center text-[10px] tracking-[0.28em] text-muted-foreground uppercase md:order-none md:w-auto">
          {item.spec}
        </p>
        <button
          type="button"
          onClick={() => onPreview()}
          className="border border-accent/60 px-4 py-3 text-[10px] tracking-[0.24em] text-accent uppercase transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Open PDF
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next product"
          className="border border-border px-5 py-3 text-[10px] tracking-[0.3em] uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function CatalogPage() {
  const { category } = Route.useLoaderData();
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const [docOpen, setDocOpen] = useState(false);
  const [docItem, setDocItem] = useState<CatalogItem | null>(null);

  useEffect(() => {
    setShown(PAGE);
    setOpen(null);
    setDocOpen(false);
    warmPdf(category.docUrl);
  }, [category.slug, category.docUrl]);

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
      <h1 className="mt-5 text-3xl leading-[1.04] font-light tracking-tight md:text-6xl">{category.title}</h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">{category.lead}</p>

      <nav className="mt-9 flex flex-wrap gap-2 md:gap-3">
        {CATALOG.map((entry) => (
          <Link
            key={entry.slug}
            to="/catalog/$category"
            params={{ category: entry.slug }}
            className={`border px-4 py-3 text-[10px] tracking-[0.28em] uppercase transition-colors duration-500 md:px-5 md:tracking-[0.34em] ${
              entry.slug === category.slug
                ? "border-accent text-accent"
                : "border-border text-muted-foreground hover:border-accent/60 hover:text-accent"
            }`}
          >
            {entry.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => {
            setDocItem(null);
            setDocOpen(true);
          }}
          className="border border-border px-4 py-3 text-[10px] tracking-[0.28em] text-muted-foreground uppercase transition-colors hover:border-accent/60 hover:text-accent md:px-5"
        >
          {category.docLabel} ↓
        </button>
      </nav>

      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {items.slice(0, shown).map((item, index) => (
          <article key={item.ref} className="group">
            <button
              type="button"
              onClick={() => setOpen(index)}
              className="block w-full cursor-zoom-in text-left"
              aria-label={`${item.ref} ${item.name} — enlarge`}
            >
              <div className="overflow-hidden border border-border bg-card transition-colors duration-500 group-hover:border-accent/50">
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
            <button
              type="button"
              onClick={() => {
                setDocItem(item);
                setDocOpen(true);
              }}
              className="mt-3 border border-border px-3 py-2 text-[9px] tracking-[0.28em] text-muted-foreground uppercase transition-colors hover:border-accent hover:text-accent"
            >
              Full spec
            </button>
          </article>
        ))}
      </div>

      {shown < items.length && (
        <button
          type="button"
          onClick={() => setShown((value) => value + PAGE)}
          className="mt-14 border border-accent/60 px-8 py-4 text-[11px] tracking-[0.34em] text-accent uppercase transition-colors duration-500 hover:bg-accent hover:text-accent-foreground"
        >
          Load more ({items.length - shown} left)
        </button>
      )}

      {open !== null && (
        <Lightbox
          items={items}
          index={open}
          onIndex={setOpen}
          onClose={() => setOpen(null)}
          onPreview={() => {
            setDocItem(items[open] ?? null);
            setOpen(null);
            setDocOpen(true);
          }}
        />
      )}
      {docOpen && (
        <DocViewer
          category={category}
          item={docItem}
          onClose={() => {
            setDocOpen(false);
            setDocItem(null);
          }}
        />
      )}

      <div className="mt-20 border-t border-border pt-10">
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
