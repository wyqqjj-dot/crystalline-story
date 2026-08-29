import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { CATALOG, categoryBySlug, type CatalogItem } from "@/lib/catalog";

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

function CatalogPage() {
  const { category } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background px-6 pt-28 pb-28 text-foreground md:px-14 md:pt-36">
      <Link
        to="/"
        className="text-[10px] tracking-[0.4em] text-muted-foreground uppercase transition-colors hover:text-accent"
      >
        ← Back to the experience
      </Link>

      <p className="mt-14 text-[10px] tracking-[0.5em] text-accent uppercase">Catalogue</p>
      <h1 className="mt-6 text-4xl leading-[1.02] font-light tracking-tight md:text-7xl">
        {category.title}
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">{category.lead}</p>

      <nav className="mt-10 flex flex-wrap gap-3">
        {CATALOG.map((c) => (
          <Link
            key={c.slug}
            to="/catalog/$category"
            params={{ category: c.slug }}
            className={`border px-5 py-3 text-[10px] tracking-[0.34em] uppercase transition-colors duration-500 ${
              c.slug === category.slug
                ? "border-accent text-accent"
                : "border-white/15 text-muted-foreground hover:border-accent/60 hover:text-accent"
            }`}
          >
            {c.label}
          </Link>
        ))}
      </nav>

      <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {category.items.map((item) => (
          <article key={item.ref} className="group">
            <div className="overflow-hidden border border-white/10 bg-white/[0.03]">
              <img
                src={item.image}
                alt={`${item.name} — ${item.spec}`}
                loading="lazy"
                width={800}
                height={800}
                className="aspect-square w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
              />
            </div>
            <p className="mt-5 text-[10px] tracking-[0.4em] text-accent uppercase">{item.ref}</p>
            <h2 className="mt-3 text-xl font-light">{item.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.spec}</p>
          </article>
        ))}
      </div>

      <div className="mt-24 border-t border-white/10 pt-10">
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
