# Black & Gold Rebuild — Intro Ritual, Cap Finish, Catalogue

## 1. Global look: black + gold only
- Strip the blue/cool accents from `src/styles.css` tokens: background `#000000`, surfaces near-black, single accent gold `#C5A572` (hover `#E0C892`), text white/warm grey.
- Apply the same palette to nav, panels, catalogue chips, lightbox and buttons so nothing renders blue.
- Environment/lighting in the 3D scene shifts to warm neutral so glass picks up gold highlights instead of cyan.

## 2. Opening interaction (the main fix)
Restore the scroll-driven ritual you liked, with the particle stage in front:

```text
idle (black, particles drifting)  ->  scroll up
  1  particle cloud                 floating dust, no motion until you scroll
  2  magnetic convergence           particles pull into a crystal shard
  3  crystal                        faceted crystal, slow rotation
  4  melt                           crystal softens into glowing molten glass
  5  pipe                           molten stream runs down the steel pipe
  6  mould fill + open              mould fills, halves part
  7  bottle                         finished CQ-100 bottle, hands off to the 3D scene
```

- Nothing autoplays. Every frame is a direct function of upward wheel / swipe / arrow travel, same input model as now.
- Stage 1 is live particles in WebGL (not video) so the idle first screen is black with floating specks.
- The scrubbed forge film is kept only for the melt → pipe → mould section, cross-faded under the particles and out into the 3D bottle, so the "crystal to molten" hand-off stops feeling abrupt.
- Lite tier (mobile / low core count) uses fewer particles and the smaller video encode.

## 3. Cap (CQ-193) re-finish from your photos
Keep the supplied cap geometry, fix how it looks:
- Two-material treatment matching the four views: thick polished clear-glass outer disc (transmission, high IOR, crisp rim highlight) plus a frosted white inner plug (rough transmission, subtle translucency) instead of one uniform glass shell.
- Add the turned rim ring highlight and the recessed inner well seen in the top-down photo.
- Sealed crown retained; no faceted/AI-looking edges — smoothing and thickness tuned against the photos.
- If the split by geometry group is not present in the GLB, the plug is added as a matched lathe primitive inside the disc so the silhouette still matches your photos.

## 4. Catalogue: all-image grid, deduped
- Re-extract every unique bottle, cap and packaging image from both PDFs, hash-dedupe so no reference repeats, and re-pair each image with its own ref / name / spec text.
- Grid only (no per-item PDF embed), with the full catalogue still downloadable.
- Add per-image skeleton placeholders, neighbour preloading, and automatic retry with backoff when an image fails (common on flaky mobile networks).
- Cache loaded catalogue pages and image URLs locally (in-memory + persisted index) so returning to a category opens instantly.

## Technical notes
- Files touched: `src/styles.css`, `src/components/experience/{Experience,ForgeFilm,Scene,Panel,Nav,models}.tsx`, a new `Particles.tsx` intro stage, `src/lib/catalog-data.json` (regenerated), `src/lib/catalog.ts`, `src/routes/catalog.$category.tsx`.
- Image re-extraction runs in the sandbox from the two catalogue PDFs; new deduped images are uploaded as CDN assets and the data file regenerated.
- Verification: build check plus browser screenshots of the idle screen, mid-ritual frames, bottle, cap close-up, and each catalogue page.
