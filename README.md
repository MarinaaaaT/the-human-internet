# the human network — website

Marketing site for The Human Internet. Built with **Next.js 16 (App Router)**,
TypeScript, and CSS Modules. Deployed on Vercel.

The iOS app lives in a separate repo.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Dev server with hot reload            |
| `npm run build`     | Production build                      |
| `npm start`         | Serve a production build locally      |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | `tsc --noEmit`                        |

## Deploying

Vercel builds and deploys automatically on every push to `main`. There is no
manual deploy step.

> [!IMPORTANT]
> This repo previously deployed a single static `index.html`. If the Vercel
> project's **Framework Preset** is still set to "Other" / static, the first
> Next.js deploy will fail or serve a blank site, because there is no longer an
> `index.html` to serve.
>
> Check once, in the Vercel dashboard → Project → Settings → Build & Deployment:
>
> - **Framework Preset:** `Next.js`
> - **Build Command:** leave as the default (`next build`)
> - **Output Directory:** leave as the default
> - **Install Command:** leave as the default (`npm install`)
>
> After that it's hands-off.

No environment variables are required to build or run the site today.
`NEXT_PUBLIC_SITE_URL` is optional and only sets the canonical origin used for
Open Graph metadata; it defaults to `https://the-human-internet.com`.

## Project structure

```
src/
  app/
    layout.tsx           Root layout — fonts, global CSS, default metadata
    page.tsx             Homepage; composes the marketing sections
  components/
    marketing/           Page sections (Hero, HowItWorks, SiteHeader, …)
    ui/                  Reusable design-system primitives (Button)
    icons/               Inline SVG icons
  content/
    site.ts              Site-wide constants: nav links, App Store URL
    steps.ts             Copy + images for the "how it works" steps
  hooks/                 useScrolledPast, useSwipe
  styles/
    tokens.css           Design tokens (colour, type, spacing, motion)
    globals.css          Reset + base element styles
public/images/           Hero and phone-mockup artwork
```

### Conventions

- **Design tokens are the source of truth.** Never hard-code a hex value or a
  spacing number in a component — add or use a token in `src/styles/tokens.css`.
- **Styling is CSS Modules**, co-located with the component
  (`Hero.tsx` + `Hero.module.css`). No inline `style` objects.
- **Server Components by default.** Only add `'use client'` when a component
  genuinely needs state, effects, or event handlers — currently just
  `SiteHeader` (scroll listener) and `HowItWorks` (step state, swipe).
- **Responsive layout is CSS, not JavaScript.** Breakpoint is `760px`.
- **Copy lives in `src/content/`**, so marketing wording can change without
  touching layout code.

## Where the placeholder links go

Several links on the homepage are intentional placeholders, pending their own
marketing pages. They're centralised so wiring them up is a one-line change:

- App Store link and the `Join` nav item → `src/content/site.ts`
- The three "how it works" step buttons → add an `href` to the relevant entry in
  `src/content/steps.ts`

## History

The homepage was originally a single 4.2MB `index.html` — a Claude-generated
artifact bundle that base64-encoded every asset and unpacked itself into blob
URLs at runtime via React + Babel loaded from CDN copies. It has been unbundled
into the structure above: same design, same copy, same artwork.

The original bundle is still in git history if you ever need it:

```bash
git show 7165f45:index.html > original.html
```

That commit also contains a full unused component library (Badge, Input, Dialog,
Tabs, Toast, Tooltip, and a set of `realhuman` screens). Only `Button` was
actually used by the homepage, so only `Button` was carried over — the rest is
recoverable from that file if it's ever wanted.
