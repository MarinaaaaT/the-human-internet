# the human internet — website

Marketing site **and the signed-out photo verification page** for The Human
Internet. Built with **Next.js 16 (App Router)**, TypeScript, and CSS Modules.
Deployed on Vercel.

Two sibling repos share the same Supabase project (`xpjkgngifffzdaikjakw`): the
iOS app (`the-human-internet-app`) and the server-side code — signing Lambda and
Supabase Edge Functions — (`the-human-internet-backend`).

> [!IMPORTANT]
> **`/[photoId]` is a public API.** It's the destination of every verification
> link the app has ever put on someone's clipboard. It resolves an 8-character
> Base58 `photos.short_code` *or*, for links shared before short codes existed,
> a bare `photos.id` UUID — both via the one `get_verification_photo(p_lookup
> text)` RPC. Changing the route or either id format breaks links already shared
> in the wild. The app pins its half in `VerifiedPhotoLinkTests`.

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

## Environment variables

| Variable                                | Required                | What it's for                                                                            |
| --------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`              | For `/[photoId]`        | Supabase project the verification page reads                                              |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`  | For `/[photoId]`        | Publishable (anon) key — **not a secret**, see below                                       |
| `NEXT_PUBLIC_SITE_URL`                  | No                      | Canonical origin for Open Graph metadata; defaults to `https://the-human-internet.com`     |

The marketing pages build and run without any of these. The verification page
throws at request time if the two Supabase vars are missing, so a local `.env.local`
needs them before `/{code}` will render anything.

The publishable key is deliberately not a secret. The security boundary for
anonymous reads is server-side: `get_verification_photo()` is a `security definer`
function that only ever answers about one photo you already hold the code for (so
the key can't be used to enumerate photos), and it returns `storage_path`/`username`
only when the owner's privacy is `Public`. Storage reads go through an `anon` RLS
policy on the `photos` bucket. See the app repo's `CLAUDE.md` → Database for the
full policy set and the two silent traps found while building it.

## Project structure

```
src/
  app/
    layout.tsx           Root layout — fonts, global CSS, default metadata
    page.tsx             Homepage; composes the marketing sections
    about/               /about and /about/verification content pages
    [photoId]/           Signed-out verification page (see the note up top)
      page.tsx           The page itself
      opengraph-image.tsx  The card a shared link unfurls into
  components/
    marketing/           Page sections (Hero, HowItWorks, SiteHeader, AppStoreBadge)
    content/             Long-form page furniture: ContentPage (title +
                         breadcrumbs), Prose/Callout (typography), MaybeLink
    ui/                  Reusable design-system primitives (Button)
    icons/               Inline SVG icons
  content/
    site.ts              Site-wide constants: nav links, App Store URL
    steps.ts             Copy + images for the "how it works" steps
  hooks/                 useScrolledPast, useSwipe
  lib/
    photos/              Verification-photo lookup + the Public-only privacy
                         gate, shared by the page and its OG card
    supabase/server.ts   Publishable-key client for Server Components
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
- **`/[photoId]` is `force-dynamic`** and must stay that way, and so is its
  `opengraph-image` sibling, for the same reason. Both mint a short-lived signed
  Storage URL per request and their response depends on live DB state (the owner
  can change their privacy at any time), so neither can be statically generated
  or cached.
- **The privacy gate is `signedPhotoUrlIfPublic`, in `src/lib/photos/`, and both
  routes call it rather than reimplementing it.** An Open Graph card is fetched
  and then cached by every platform a link is pasted into, so a `Humans Only`
  photo leaking through that surface would be more public — and far harder to
  walk back — than the same leak on the page.
- **`generateMetadata` in `/[photoId]` restates its title and description under
  `openGraph`.** The root layout declares its own `openGraph` block, and an
  explicit parent value beats a child's plain `title`/`description`, so without
  that restatement every photo's card was captioned with the site's generic
  marketing copy. It must *not* set `openGraph.images` — the file-convention
  `opengraph-image` route supplies that, and a value there would override it.
- **Copy lives in `src/content/`**, so marketing wording can change without
  touching layout code.
- **Unset destinations render as text, not dead links.** `EXTERNAL_LINKS` in
  `site.ts` holds `string | null`, and `MaybeLink` renders plain text for a
  `null`. Filling in a URL there promotes it to a real link with no other
  change — so add the entry rather than hard-coding a placeholder `#`.

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
