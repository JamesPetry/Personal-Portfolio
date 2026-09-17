# James Petry — computational design portfolio

One-page portfolio. Vite + React 19 + TypeScript, GSAP ScrollTrigger, Lenis smooth scroll. No UI framework, no Tailwind.

## Run

```
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run art       # regenerate placeholder artwork in public/art/
```

## Where things live

| What | File |
| --- | --- |
| All copy, projects, tools, contact details | `src/content.ts` |
| Design tokens (type scale, tracking, spacing, colours) | `src/styles/tokens.css` |
| Section layout | `src/styles/sections.css` |
| Sections, in page order | `src/sections/Hero, Practice, Works, Method, Cta, Footer` |
| Text reveal, figure reveal, smooth scroll | `src/lib/` |
| Cursor and CAD-style readout overlay | `src/components/` |

## Swapping in real work

1. Drop images into `public/` and point `cover` and each stage `image` in `src/content.ts` at them. Dark images with room for white text work best for the hero.
2. Each project has three stages, `Ideation`, `Process`, `Product`. The Works section pins one viewport per stage and cross-fades the image while the copy changes.
3. Items marked `PLACEHOLDER` in `src/content.ts` are waiting on content.

## Deploy

Hosted on Vercel. `public/art/` is regenerated on every build by the `prebuild`
script, so the generated SVGs do not need to be uploaded with a manual deploy.

```
npm run build     # runs gen-art, then tsc and vite
```
