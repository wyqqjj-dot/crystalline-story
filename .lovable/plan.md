# Jining Chunqiu — cinematic scroll story, full upgrade

Everything is built on the current site. Nothing is restarted from scratch: the existing bottle, cap and box artwork, the product library and the company page stay in place.

## What you will get

A single continuous camera journey on the home page, driven entirely by your scroll / drag / swipe, in this order:

1. Gold particles drift in dark space and react to the pointer (attract, follow, swirl; press to gather or push).
2. The particles gather on their own into one large triangular glass crystal — thick, refractive, with real highlights — then stop and wait for you.
3. From here you drive it: the crystal heats up, turns amber, softens and stretches.
4. It becomes a thick, viscous molten stream with a leading head, threads, glow and spatter.
5. The stream travels through the pipe and blow head into the mould.
6. The mould closes, fills, holds, trembles, then opens sideways.
7. The bottle is released, falls, lands and settles with decreasing bounce (no floor or mould clipping).
8. Product stage: the bottle holds the centre; horizontal drag spins it 360°, buttons zoom in/out/reset, cursor changes to grab/grabbing.
9. Cap close-up: the cap lifts off and reseats (click to take apart, click to reassemble), then seals onto the neck.
10. A short factory / capability caption appears.
11. Bottles line up, enter a shipping carton with dividers, the carton closes and is taped, cartons are stacked, then loaded into a container and the doors close.
12. Containers drop onto a ship, the ship grows from the far distance and sweeps across the frame; the black-gold industrial light dissolves into the company section.

Every step reverses cleanly when you scroll back, and stops wherever you stop. Clicking the company name returns you to the start and the opening can be replayed.

## The rest of the site

- **Made in Jining. Used everywhere** — a horizontal row of 5–10 real-looking photographic scenes (cellar, bar, dinner table, retail shelf, hotel, gifting, display box) with bottles filled with liquor, each linking to the matching product category.
- **Product library** — three clean categories (bottles / caps / packaging) with search, category switching, large-image view, detail panel and an inquiry button. Only information that can be confirmed from your catalogues is shown; invented sizes, weights and test data are removed, and mismatched captions are deleted. The PDF viewer entry points are removed once the useful pages are on the site.
- **Brand** — every leftover "CHUNQIU" placeholder becomes **Jining Chunqiu Import & Export Co., Ltd.** in the opening, navigation, company page and footer. Your existing address, phone, email and founding details are not touched. Wording is tightened to professional export-trade English (site stays fully English).
- **Micro-interactions** — warm gold hover glow on buttons, gentle card lift, slow image zoom, underline transitions, fade-and-rise on entry, restrained frosted glass, clear type hierarchy, no abrupt jumps, no sound.
- **Colour** — black / charcoal / warm gold in the opening, amber for hot glass, bright white highlights on cooled glass, dark steel machinery, and a gradual move into warm white for the product area, with the ship sweep and light doing the transition.

## Performance and fallback

Packing, stacking and ship stages load only when you get near them; nothing beyond the opening loads at start. Repeated bottles use shared, instanced, low-detail geometry with cheap distant materials. Redraws pause when scrolling stops and when the 3D area is off screen. Pixel ratio is capped, and phones automatically get fewer particles, lights, reflections and geometry detail. If a device cannot run 3D at all, a cinematic image-and-type fallback opening plays, still scroll-driven and reversible.

## Technical notes

- One shared normalized `progress` (0–1) in `src/lib/journey.ts` drives all stages, with critically damped springs, overlap windows between neighbouring stages, and full reverse support. Stage ranges are declared in one table so camera, models and copy stay in sync.
- Opening rebuilt across `Genesis.tsx` (particles → crystal), a new `Melt.tsx` (crystal → molten mass, shader-based heat and viscosity), `ForgeSequence.tsx` (pipe → mould → parison → blow → open) and `Scene.tsx` (drop physics, product stage, cap assembly).
- New lazy chunks: `Packing.tsx` (instanced bottles, carton with dividers, taping, palletising, container) and `Voyage.tsx` (container ship approach and sweep, colour grade handoff), both mounted via `React.lazy` behind progress thresholds.
- Mould and pipe: existing `mould.glb` / `pipe.glb` are re-rigged as separate halves plus guide pillars, flanges, bends and a blow head, animated as one mechanism. Final surface detail is left for a later Blender pass.
- Glass materials: transmission with visible thickness, studio strip reflections via `Lightformer` bars, edge-highlight rim term, and a cheap non-transmissive variant for distant/instanced bottles.
- Catalogue: `src/lib/catalog.ts` switched to confirmed-only fields; PDF viewer route/entries removed; images and codes kept from the extracted set.
- WebGL capability check gates the canvas; the fallback opening reuses the same progress axis with DOM/Framer Motion only.

## Assets I still need from you

- The company logo (`IMG_20260903_225131.jpg`) is not in the project — until you upload it, the opening, navigation and footer use the full company name as type, and I will cut it out to a transparent PNG once it arrives.
- The two mould principle videos (`2608282134501201.mp4`, `2608282137333894.mp4`) are also not in the project. The mould mechanism will be built from standard automatic glass-forming logic and adjusted once you send them.

## Order of work

1. Progress axis, scroll lock, reverse and stage table; performance budget and pause logic.
2. Particles → triangular crystal (auto) → interactive handoff.
3. Melting → molten flow → pipe → mould → blow → open → bottle drop physics.
4. Product stage: rotate, zoom, reset, cap disassemble/reassemble, category links.
5. Packing, palletising, container, ship sweep, transition into the company section.
6. Made in Jining scene strip, product library clean-up and PDF removal, brand name and copy pass.
7. Mobile pass, WebGL fallback, final performance verification on desktop and phone.

## Added in this round

- **Detail page for every catalogue item** — real product photo(s), only the specifications that can be confirmed, the manufacturing-process video, an inquiry form, and a link through to the Company page.
- **Catalogue cover previews** — a low-resolution cover image is generated for each source catalogue and used as card thumbnail and preview cover; the cover shows instantly and the full content fills in progressively behind it (no large file opened automatically).
- **Real process copy** — the home page's closing "Ready for the world" block and the Capabilities section are rewritten from your company profile as concrete manufacturing and export steps, with no filler claims.
- **Full drag-through verification** — I drive the whole opening on both desktop and phone sizes in the browser (particles → crystal → molten flow → mould open → bottle drop → boxing → Ready for the world) and confirm no stutter, blank frame or clipping before reporting done.

One note: the company profile PDF is not in the project yet, so the rewritten Capabilities / closing copy needs it — please upload it (the two product catalogues are already here). Until it arrives I keep the existing wording rather than invent facts.

Also, your earlier instruction was to remove the PDF entry points once the catalogue is on the site. I am reading the new request as: no large PDF loads automatically, but each item keeps a light cover image and an optional "view source page" link. Say the word if you want the source PDFs gone entirely.
