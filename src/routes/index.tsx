import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Philosophy } from "@/components/site/Philosophy";
import { Products } from "@/components/site/Products";
import { Craft } from "@/components/site/Craft";
import { Contact } from "@/components/site/Contact";
import { Intro } from "@/components/site/Intro";
import { Cursor } from "@/components/site/Cursor";
import { Marquee } from "@/components/site/Marquee";

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
    <>
      <Intro />
      <Cursor />
      <main className="bg-background text-foreground">
        <Nav />
        <Hero />
        <Marquee
          items={[
            "Handcrafted in Shanghai",
            "One breath · one piece",
            "1200°C 液态光",
            "No moulds · no copies",
          ]}
        />
        <Philosophy />
        <Marquee
          reverse
          items={["Collections 2026", "限量单件", "Art Glass ®", "光与玻璃的对话"]}
        />
        <Products />
        <Craft />
        <Contact />
      </main>
    </>
  );
}
