<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# UI rules for The Human Internet (web)

Read `DESIGN.md` before building or changing any UI. It explains the brand intent and is shared with iOS and Android.

## Where things live
- `design-system/tokens.json`: **the master token file for web, iOS AND Android.** Change values only here, then run `npm run tokens` (web only) or `node design-system/build.mjs` (web, iOS and Android — it writes into the sibling checkouts named in `design-system/targets.json`). That regenerates `src/styles/tokens.css`, `src/styles/tokens.ts`, `DESIGN.md`, and the iOS/Android token files.
- `src/styles/tokens.css` and `src/styles/tokens.ts`: **generated, never edit.** The `.ts` copy is only for code that can't read CSS variables (the Open Graph card, rendered by Satori).
- `src/styles/globals.css`: maps tokens to Tailwind utilities plus base styles. `src/styles/fonts.css`: the font family (Inter Display, or PP Neue Montreal behind the `neue_font` flag).
- `src/lib/utils.ts`: `cn()`. It is told the token names (`text-label`, `h-control`…); add a new type or size token there too, or `cn` will drop it when merging classes.
- `src/components/ui`: shadcn/ui primitives, restyled by the tokens.
- `src/components/brand`: VerifiedMark, Wordmark, ProofCard (+ ShareActions), NotificationCard, ProfileHeader, LabelValue, HighlightBadge, BrandReveal, BoilingMark.
- `/styleguide` route: the living styleguide. Every component appears here.
- `public/brand/mark.svg`, `wordmark.svg`: the logo.

## Hard rules
1. **No raw values.** Never write hex/rgb colors, arbitrary values (`p-[13px]`, `text-[17px]`), or inline `style` colors. Use token utilities: `bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`, `rounded-lg`, `shadow-float`, `duration-base`, `ease-out`, `text-h1`, and so on. If a token you need doesn't exist, stop and ask. Don't invent one, and never edit `tokens.css`.
2. **Reuse before you create.** Check `src/components/brand`, then `src/components/ui`. Add shadcn components with `npx shadcn@latest add <name>`. Any new reusable component also gets added to `/styleguide`.
3. **One font weight.** Everything is `font-medium`. Never use `font-bold` or `font-semibold`. Create hierarchy with size (`text-display` … `text-caption`) and color (`text-foreground` vs `text-muted-foreground`).
4. **No new colors.** Black, white, and light gray only. `bg-highlight` (blue) is only for count/streak badges. Photos provide the color.
5. **"Verified" is always the spiral mark** (`<VerifiedMark />`). Never use a check, shield or lock.
6. **Flat surfaces.** Cards are `bg-surface rounded-lg` with no border and no shadow. `shadow-float` is only for popovers, sheets and dialogs.
7. **Motion is opacity only.** Use `animate-reveal` / `animate-fade-in` or `transition-opacity duration-base ease-out`. No slide, scale or bounce. Reduced motion is handled globally.
8. **Accessibility (WCAG AA).** `text-subtle-foreground` is only allowed at 18px or larger. Icon-only buttons need an `aria-label`. Keep the focus ring. Touch targets must be at least 44px. Badge pages are server-rendered.
9. **Icons:** `lucide-react`, outline style, `strokeWidth={1.5}`.

## Copy voice
- Use short declarative sentences ending in periods, often in pairs: "Photo verified. Go show them."
- Use sentence case. The wordmark is always lowercase: "the human internet".
- Claim "capture provenance", not "content authenticity". Don't use "C2PA", "cryptographic", or "blockchain" in user-facing copy unless the page is explicitly technical.

## Before you finish a UI change
- Open `/styleguide` and check that the new UI matches it.
- Run the hardcoded-value check, which should print nothing:
  `grep -rnE "#[0-9a-fA-F]{3,8}\b|\[[0-9.]+(px|rem)\]|font-(bold|semibold)" src --include=*.tsx`
- If you changed tokens: `npm run tokens && npx @google/design.md lint DESIGN.md`
