import { useEffect, useState } from "react";

export type Tint = { accent: string; soft: string; deep: string };

const cache = new Map<string, Tint>();

const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));

function toTint(r: number, g: number, b: number): Tint {
  // lift the sampled colour into a jewel-like accent: keep hue, raise saturation
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const mid = (max + min) / 2;
  const boost = (c: number) => clamp(mid + (c - mid) * 1.55);
  const [ar, ag, ab] = [boost(r), boost(g), boost(b)];
  const lift = 210 / Math.max(60, Math.max(ar, ag, ab));
  return {
    accent: `rgb(${clamp(ar * lift)} ${clamp(ag * lift)} ${clamp(ab * lift)})`,
    soft: `rgb(${clamp(ar * lift)} ${clamp(ag * lift)} ${clamp(ab * lift)} / 0.22)`,
    deep: `rgb(${clamp(ar * 0.28)} ${clamp(ag * 0.28)} ${clamp(ab * 0.3)})`,
  };
}

/** Average the mid-tones of a product photo to a premium accent triple. */
export function useProductTint(url?: string | null): Tint | null {
  const [tint, setTint] = useState<Tint | null>(() => (url ? cache.get(url) ?? null : null));

  useEffect(() => {
    if (!url || typeof document === "undefined") {
      setTint(null);
      return;
    }
    const hit = cache.get(url);
    if (hit) {
      setTint(hit);
      return;
    }
    let alive = true;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => {
      if (!alive) return;
      try {
        const w = 28;
        const h = 34;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(image, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let r = 0;
        let g = 0;
        let b = 0;
        let n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [pr, pg, pb, pa] = [data[i]!, data[i + 1]!, data[i + 2]!, data[i + 3]!];
          if (pa < 200) continue;
          const lum = (pr + pg + pb) / 3;
          if (lum < 26 || lum > 238) continue; // skip the black stage and blown-out highlights
          r += pr;
          g += pg;
          b += pb;
          n += 1;
        }
        if (!n) return;
        const value = toTint(r / n, g / n, b / n);
        cache.set(url, value);
        setTint(value);
      } catch {
        /* cross-origin readback blocked — keep the house palette */
      }
    };
    image.src = url;
    return () => {
      alive = false;
      image.onload = null;
    };
  }, [url]);

  return tint;
}

/** CSS custom properties that retint the accent tokens for a subtree. */
export function tintStyle(tint: Tint | null): React.CSSProperties | undefined {
  if (!tint) return undefined;
  return {
    ["--accent" as string]: tint.accent,
    ["--ring" as string]: tint.accent,
    ["--product-soft" as string]: tint.soft,
    ["--product-deep" as string]: tint.deep,
  } as React.CSSProperties;
}
