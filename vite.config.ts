// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { PluginOption } from "vite";

// React Three Fiber pierces dashed props (e.g. "data-tsd-source" -> obj.data["tsd-source"]),
// so dev-only source tags injected into <mesh>/<group> JSX crash the canvas. Strip them
// from the 3D experience modules after all other transforms have run.
const stripSourceTagsFrom3D: PluginOption = {
  name: "strip-source-tags-3d",
  enforce: "post",
  transform(code: string, id: string) {
    if (!/src\/components\/experience\//.test(id)) return null;
    if (!code.includes("data-tsd-source")) return null;
    return {
      code: code.replace(/"data-tsd-source":\s*"[^"]*",?\s*/g, ""),
      map: null,
    };
  },
};

export default defineConfig({
  plugins: [stripSourceTagsFrom3D],
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
