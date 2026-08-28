import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { Nav } from "@/components/experience/Nav";
import { Content } from "@/components/experience/Content";
import { IntroOverlay } from "@/components/experience/IntroOverlay";

const Experience = lazy(() =>
  import("@/components/experience/Experience").then((m) => ({ default: m.Experience })),
);

const title = "Chunqiu — Custom Glass Bottles, Closures & Presentation Cases";
const description =
  "Jining Chunqiu Import & Export Co., Ltd. manufactures custom glass bottles, cork and glass closures, and timber presentation cases for spirits brands worldwide.";

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
  return (
    <div id="top" className="bg-background text-foreground">
      <Nav />
      <ClientOnly fallback={<div className="h-screen" />}>
        <Suspense fallback={<div className="h-screen" />}>
          <IntroOverlay />
          <Experience />
        </Suspense>
      </ClientOnly>
      <Content />
    </div>
  );
}
