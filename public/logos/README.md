# Royal-Team logo — web SVG candidates

Analysis + candidate generation only. Nothing in the application was changed.
Source of truth: `design-reference/figma-app/brand-assets/` (note: the actual
path has a `figma-app/` segment the task brief omitted — `IMPORTANT Advice.txt`
confirms this is the intended package).

## 1. Source files inspected

All EPS/PDF files under `design-reference/figma-app/brand-assets/`, both
`.txt` instruction files, and the current `public/logo.svg` plus every
runtime reference to it (`src/components/logo.tsx`, `header.tsx`, `footer.tsx`).

Tooling used (local inspection only, nothing added to the project):
`poppler` (`pdfinfo`, `pdftoppm`, `pdftocairo`, `pdffonts`), `pdf2svg`,
`ghostscript` (`gs -sDEVICE=bbox` for exact ink bounding boxes), `librsvg`
(`rsvg-convert`), and ImageMagick (`magick ... -trim`) — all installed via
Homebrew for local analysis, none referenced by the app or its package files.

## 2. Official variants discovered

Two axes: **color** and **composition**.

Color variants (each has its own `full/`, `icon/`, `text/` folders):

| Folder | What it is | Fill |
|---|---|---|
| `base` | Default brand mark | Gold gradient (dark olive-gold → pale yellow) |
| `black` | Monochrome, for light backgrounds | Solid black |
| `black/**/white_*` | Monochrome, for dark backgrounds | Solid white |
| `color1` | Single-tone alternate | Solid dark gold (the gradient's dark stop, `#AC8400`-ish) |
| `color2` | Single-tone alternate | Solid pale yellow (the gradient's light stop, `#FDEE79`-ish) |
| `customcolor` | Same gradient artwork as `base` (identical gradient stops) | Ships with `Background Color.txt` suggesting `#000000` — a customer-editable starting point, not a distinct visual variant |

Composition variants (present under every color folder):

- **`full`** — the complete circular badge: turbocharger illustration, an
  outer ring, arc-text tagline ("DIAGNOSZTIKA, VILLAMOSSÁG, KARBANTARTÁS" —
  Diagnostics, Electrics, Maintenance), and a ribbon banner reading
  "ROYAL-TEAM AUTÓSZERVIZ KFT." across the bottom.
- **`icon`** — just the turbocharger illustration + the outer arc, with no
  ring text and no ribbon. This is the only variant with no text at all.
- **`text`** — the ribbon wordmark **and** the arc tagline, as a standalone
  horizontal lockup (no turbo icon, no circle).
- **`text/logoname`** — the ribbon wordmark only ("ROYAL-TEAM AUTÓSZERVIZ
  KFT."), no tagline.

`color1`/`color2`/`customcolor` were inspected but **not** carried into the
generated set — they're single-tone alternates for special print use
(embroidery, one-color offset), not something a themed website needs; `base`
(gradient) and `black`/`white` already cover light-background,
dark-background, and monochrome use.

## 3 & 4. Source used for each generated SVG, and why

Every candidate was converted from the **PDF**, not the EPS — see the EPS vs.
PDF comparison below for why. All 8 are real vector paths with live
`<linearGradient>` fills where applicable — zero rasterized content
(`<image>` count is 0 in every file, confirmed by grep and by rendering each
one to a PNG and inspecting it directly).

| Generated file | Source PDF | Use case |
|---|---|---|
| `full-gradient-light.svg` | `base/full/base_logo_transparent_background.pdf` | Full badge, brand gold gradient, light backgrounds |
| `full-white-dark.svg` | `black/full/white_logo_transparent_background.pdf` | Full badge, solid white, dark backgrounds |
| `full-black-light.svg` | `black/full/black_logo_transparent_background.pdf` | Full badge, solid black, monochrome/print use on light backgrounds |
| `icon-gradient-light.svg` | `base/icon/base_icon_transparent_background.pdf` | Turbo mark only, brand gold gradient, light backgrounds |
| `icon-white-dark.svg` | `black/icon/white_icon_transparent_background.pdf` | Turbo mark only, solid white, dark backgrounds |
| `icon-black-light.svg` | `black/icon/black_icon_transparent_background.pdf` | Turbo mark only, solid black, monochrome/print use |
| `text-tagline-gradient-light.svg` | `base/text/base_textlogo_transparent_background.pdf` | Wordmark + tagline lockup, gold gradient |
| `text-logoname-gradient-light.svg` | `base/text/logoname/base_text-logoname_transparent_background.pdf` | Wordmark only ("ROYAL-TEAM AUTÓSZERVIZ KFT."), gold gradient |

Each is appropriate for web use because:

- The source PDF's page size already equals its ink bounding box (verified
  with `gs -sDEVICE=bbox`, see table below), so the resulting `viewBox` has
  no baked-in whitespace — confirmed again post-conversion by rendering each
  candidate at 2000px and auto-trimming with ImageMagick: every file fills
  ≥96% of its canvas in both dimensions (most are ≥99.6%).
- `width`/`height` were stripped of their `pt` unit suffix (a `pdftocairo`
  artifact) and left as plain numbers matching the `viewBox`, so the SVG
  scales cleanly under CSS/`<Image>` sizing — the same unitless convention
  already used by `public/logo.svg`.
- No embedded raster images, no embedded fonts (all text is already
  outlined — see Step 1 findings below), no editor cruft (`pdftocairo`
  emits no comments or metadata to begin with).
- All 8 validate as well-formed XML (`xml.etree.ElementTree`) and were
  visually verified by rendering to PNG on both light and dark backgrounds.

### EPS vs. PDF

Both formats come from the same Inkscape → Cairo export pipeline and contain
equivalent vector content. The PDF is the better SVG source:

- **Smaller**: e.g. the full-logo PDF is 36KB vs. the EPS's 74KB for the same
  artwork (the EPS carries a ~1.5KB PostScript procedure prologue plus
  verbose operators).
- **Tighter, more precise bounding box**: `gs -sDEVICE=bbox` reports
  `0 0 235.223993 193.499994` for the PDF vs. `0 0.486 235.241993 194.003994`
  for the EPS — the EPS has a small extra sliver of margin and an offset
  origin.
- **Better tool support**: `pdftocairo`/`pdf2svg` convert PDF → SVG directly
  and losslessly; EPS needs an extra PostScript-interpretation step
  (Ghostscript) with an older, less precise renderer.

### Fonts: outlined, not embedded

`pdffonts` reports zero fonts in any of these PDFs. All text — the ribbon
wordmark, the arc tagline, the individual glyphs — has already been converted
to filled vector outlines (confirmed visually: each letter is its own
gradient-filled path, not a `<text>` element). This is good for the web: no
font-loading dependency, and the SVG renders pixel-identically everywhere.

## 5. The issue in the current `public/logo.svg`

**It is not a corrupted, mis-cropped, or wrong-color-variant file.** Rendering
it and diffing it against the official `base/full` PDF shows it is a faithful,
tightly-bound (99.7%-filled `viewBox`) conversion of the **full circular
badge** — turbo icon, ring, arc tagline, and ribbon wordmark, in the correct
brand gold gradient. `viewBox="0 0 315 259"` matches the source aspect ratio
(1.2155) almost exactly, and an ImageMagick auto-trim of a 2000px render
shows essentially zero internal whitespace (1994×1641 content in a
2000×1646 canvas). So: not artwork, not whitespace, not viewBox, not the
wrong color variant.

**The actual problem is variant choice versus render size.** `src/components/
logo.tsx` renders this asset at `size={46}` in the header
(`src/components/header.tsx:58`) and `size={40}` in the footer
(`src/components/footer.tsx:38`) — i.e. roughly 40–46px wide. The `full`
badge is a dense, fine-lined emblem: a thin circular ring, two lines of small
arc-text, and a ribbon banner with its own wordmark, all inside that same
small circle. At 40–46px every one of those fine details — the ring stroke,
the arc-text, the ribbon lettering — falls below legible size and the
gradient linework thins out to near-invisibility. I rendered the current
`public/logo.svg` at the exact 46px width used in the header, next to the
`icon`-only variant at the same 46px, to confirm this directly: the full
badge degrades to an illegible smudge with a barely-visible ring, while the
icon-only turbo mark is still clearly readable at identical size. This is a
badge/seal mark — designed for large-format use (print, hero sections,
letterhead) — being asked to double as a small navigation glyph, a role the
package's own `icon` variant exists specifically to fill.

Worth noting: the header already renders "Royal-Team" / "Autószerviz" as a
separate text lockup right next to the `<Logo>` image
(`header.tsx:59-66`), so the small nav mark's job is purely to be a
recognizable glyph — exactly what `icon` is for, and exactly what `full`
(with its own redundant embedded wordmark) is not suited for at that size.

## 6. Root cause classification

**Wrong variant selected for the context**, not artwork, not
whitespace/viewBox, not scaling math, and not an SVG-conversion defect. The
`LOGO_ASPECT_RATIO` math in `logo.tsx` is correct for the asset it's given;
the asset itself is simply the wrong one for a 40–46px slot.

## 7. Recommended candidate

`icon-gradient-light.svg` (turbo mark, brand gold gradient) for the header
and footer's small nav-glyph role, on the light theme this site currently
uses. If a dark-mode surface is ever needed, `icon-white-dark.svg` is the
matching counterpart. Reserve `full-gradient-light.svg` for contexts with
real room to render it — e.g. a hero section, an OG/social image, or a print
context — where the ring text and ribbon can actually be read.

This is a recommendation for review only; `public/logo.svg` and all
components remain unmodified, per the task's Step 4.

## 8. Uncertainty / things worth a visual review

- The `icon` variant still carries several concentric rings and fine
  turbo-blade linework; it reads far better than `full` at 46px, but if an
  even smaller favicon-scale use ever comes up (≤24px), it's worth a human
  check on whether the innermost blade detail survives.
- `customcolor` is visually identical to `base` at the same gradient stops
  in this package — I've treated it as the same design (documented above)
  rather than a distinct variant, but flagging it in case the brand owner
  intends to eventually swap those gradient stops for something else.
- I did not generate black/white variants of the `text` lockups (only the
  gold gradient) since the app currently sets that wordmark in live HTML/CSS
  text rather than as an image; happy to generate those too if a `<Logo>`-
  style SVG wordmark ends up wanted for e.g. a social share card.
