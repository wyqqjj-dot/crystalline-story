import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Philosophy } from "@/components/site/Philosophy";
import { Products } from "@/components/site/Products";
import { Craft } from "@/components/site/Craft";
import { Contact } from "@/components/site/Contact";

const title = "VITRÉA · 高端手工玻璃制品与艺术玻璃工作室";
const description =
  "VITRÉA 是一间手工吹制玻璃工作室，专注艺术玻璃器皿、灯具与空间装置的设计与定制。光与玻璃的对话。";

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
    <main className="bg-background text-foreground">
      <Nav />
      <Hero />
      <Philosophy />
      <Products />
      <Craft />
      <Contact />
    </main>
  );
}
