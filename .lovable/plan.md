# Blue Cow SMP — Blue-Themed Minecraft Server Website

## Goal

Build a single-page landing website for the Minecraft server **Blue Cow SMP**, strictly blue-themed, using the chosen **Art-deco deep blue** design direction: deep navy ocean background, cyan glow accents, gold art-deco ornaments, and a "trusted home server" tone.

## Page structure (port of the chosen direction)

Single page at `/` (`src/routes/index.tsx`), all sections in order:

1. **Nav** — "BC" pixel badge + `BLUE COW SMP` wordmark (Cinzel, letter-spaced), anchor links (Why Play, Join, Rules, FAQ), Discord button.
2. **Hero** — gold hairline ornaments framing `EST. SEASON 04`, large Cinzel headline `BLUE COW SMP` with cyan-glow "SMP", tagline, intro paragraph, pulsing IP pill (`play.bluecowsmp.net`) with a working **Copy** button, live-looking status pill (128 / 250 online · Status: Online), Discord CTA + "How to join" link, floating pixel blocks, bottom ornament.
3. **Stat strip** — 4 cards: Online Now, Uptime, Seasons, Members.
4. **Why Play** — 4 feature cards (Survival SMP, Community Events, Land Claims, Seasons & Resets) with hover lift.
5. **Join + Rules** — two-column layout: 3 numbered join steps (left), "House standards" rules list (right).
6. **FAQ** — 4 accordion items using native `<details>/<summary>`.
7. **Footer** — Discord CTA, status chip, server IP, copyright line, gold ornament.

Interactions: Copy button writes the IP to the clipboard (with a brief "Copied" state); anchor links smooth-scroll to sections; FAQ accordions open/close. Discord links point to `https://discord.gg/bluecowsmp` as a placeholder the user can replace.

## Design system (carried over from the direction)

- **Colors** (registered as Tailwind tokens in `src/styles.css` under `@theme`, exact hex values from the direction):
  - Ocean blues: `--color-ocean-950 #04101f`, `--color-ocean-900 #071a30`, `--color-ocean-800 #0b2745`, `--color-ocean-700 #123a63`
  - Glow cyans: `--color-glow-500 #2bd0ff`, `--color-glow-400 #55e0ff`, `--color-glow-300 #a8f0ff`
  - Gold accents: `--color-gold-500 #c9a24b`, `--color-gold-400 #d8b45e`, `--color-gold-300 #e8cd86`
  - Foam text tones: `--color-foam-100 #dfeeff`, `--color-foam-200 #c6e6f7`, `--color-foam-400 #9cc9e6`
- **Fonts** (loaded via `<link>` in `src/routes/__root.tsx` head): Cinzel (display), Manrope (body), Silkscreen (pixel accents), VT323 (mono).
- **Motion**: `bc-float` / `bc-float-slow` (floating pixel blocks), `bc-pulse` (IP pill glow), `bc-glow` (status dot), `bc-lift` (card hover) — defined as keyframes/utilities in `src/styles.css`.
- Everything stays in the blue family; gold is used only as thin decorative ornament, never as a dominant accent.

## Technical details

- **`src/routes/index.tsx`** — rewrite the placeholder entirely: full landing page as React/TSX, semantically structured (`header`, `main`, `section`, `footer`, single `h1`), with the Copy-to-clipboard behavior in a small `useState` handler.
- **`src/styles.css`** — add the `@theme` color/font tokens, the animation keyframes, and `.bc-*` helper classes. Keep all existing shadcn tokens intact.
- **`src/routes/__root.tsx`** — add the Google Fonts `<link>` (Cinzel, Manrope, Silkscreen, VT323). Keep everything else unchanged.
- **Head metadata** — `src/routes/index.tsx` gets its own `head()`: title "Blue Cow SMP — Minecraft Survival Server" (under 60 chars), a real description, `og:title`/`og:description`, `og:type`, `twitter:card`. No `og:image` (no meaningful absolute image; hosting injects the social preview).
- No backend, no database, no extra dependencies — pure static single-page site.
- Fonts must be loaded via `<link>` in the root head, not `@import` in CSS (project rule).

## Out of scope

- Live server status / real player count (static numbers as designed; can be wired to an external status API later if requested).
- Additional pages (rules page, store, staff page) — single landing page only.