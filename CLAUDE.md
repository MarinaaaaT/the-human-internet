@AGENTS.md

# the human internet — website

Marketing site **and the signed-out photo verification page**. Next.js 16 (App
Router), TypeScript, CSS Modules, deployed on Vercel from `main`.

**[`README.md`](README.md) is the reference** — project structure, conventions,
env vars, and the placeholder-link inventory all live there. Read it before
changing anything; this file only carries what's easy to get wrong.

## Three sibling repos, one Supabase project (`xpjkgngifffzdaikjakw`)

- `the-human-internet-app` — the iOS app.
- `the-human-internet-website` (this repo) — reads Supabase with the anon key only.
- `the-human-internet-backend` — signing Lambda + Supabase Edge Functions.

The app repo's `CLAUDE.md` is the source of truth for the database: table
shapes, RLS policies, and the security-definer functions this site depends on.
Schema is **not** tracked as migrations in any repo.

## `/[photoId]` is a public API

It is the destination of every verification link the app has ever put on
someone's clipboard. It resolves an 8-character Base58 `photos.short_code`
*or*, for links shared before short codes existed, a bare `photos.id` UUID —
both through the one `get_verification_photo(p_lookup text)` RPC. Changing the
route, either id format, or the RPC breaks links already shared in the wild.
The app pins its half in `VerifiedPhotoLinkTests`.

A verified owner can also decorate it: their real name and up to five social
handles, from the app's Settings → **Verification Page**. The handles are
theirs to type (`users.social_links`) and so is the decision to show the name
(`users.show_identity`) — but **the name itself is Stripe's**, stored in
`users.verified_first_name`/`verified_last_name` by `stripe-identity-webhook`
from the verified session's `verified_outputs`, and guarded by triggers
against any client write. The page states it as *"Identity Last Verified by
Stripe on {date} proving account owner is {Name}"*, the date coming from
`users.identity_verified_at` (the webhook event's own time, guarded the same
way). No date on file — anyone verified before it was recorded — falls back to
the bare name, because the name is still true and the sentence would not be.
The name is re-cased for display by `titleCaseName`: these come off identity
documents and arrive shouting (`JORDAN JAMES FAVA`), and only fully-uppercase
values are touched, so a deliberately-cased `van der Berg` survives intact.
The app mirrors all of this in `VerifiedIdentity`. It has to be: this page renders the name inches
from "taken by a real, verified human", so a self-authored one would be a
claim wearing our checkmark. Those columns are user-written, so they claim nothing by
themselves — `get_verification_photo()` withholds every one of them unless the
owner's `verification_status` is `verified` (a column no client can write),
their privacy is `Public` (the same gate the username already passes), *and*
the `custom_verification_pages` feature flag is on for them.

**That flag is not read here, on purpose.** This site has no read access to
`feature_flags` (it reads only the allowlisted ones below, and this isn't one), and a kill switch that two
independently-deployed clients must both honour is two switches, not one. The
RPC resolves it against the photo's **owner** — the viewer is signed out and
has no audience to resolve against — so a flagged-off owner's photo simply
arrives with `display_name` null and `social_links` empty, which is the shape
this page already handles for an unverified or Humans Only owner. Switching the
flag off therefore retracts names and handles from links already in the wild
with nothing to deploy. Keep all of it in the RPC; the page must not re-derive
any of it. Handles are
stored **bare** and `src/lib/photos/socialLinks.ts` builds every href from its
own per-platform base URL — nothing user-supplied ever becomes a URL — and
re-checks the `^[A-Za-z0-9._-]{1,64}$` shape rather than trusting the database
constraint in another repo. Its `SOCIAL_PLATFORMS` table mirrors
`is_valid_social_links()` in Postgres and `SocialPlatform` in the app; a
platform missing here is simply not rendered, which is the right failure
direction.

It also owns the **Open Graph card** every shared link unfurls into
(`opengraph-image.tsx`), which is what a verification link looks like on
Facebook, Messages, X, Reddit or Slack — so that file, not the app, is where
the appearance of a share is changed.

The route is `force-dynamic` and must stay that way — as is `opengraph-image`:
both mint a short-lived signed Storage URL per request, and their response
depends on live DB state (the owner can change their privacy at any time). Both
gate on the shared `signedPhotoUrlIfPublic` in `src/lib/photos/` rather than
reimplementing the check, because a card is cached by every platform it is
pasted into and a `Humans Only` leak there is far harder to walk back.

## Design system

The look is the shared design system (the kit), not anything local to this
repo: **`DESIGN.md`** for intent, **`AGENTS.md`** for the hard rules, and
**`design-system/tokens.json`** as the one source of values for web, iOS and
Android. Styling is **Tailwind v4 + shadcn/ui** (`src/components/ui`) and the
brand components in `src/components/brand`; `/styleguide` shows every token
and component. Never hand-edit `src/styles/tokens.css` or `tokens.ts` — change
`tokens.json` and run `npm run tokens`. That script is `--web-only`:
`node design-system/build.mjs` without it also writes `DesignTokens.swift`
and `DesignTokens.kt` into the sibling iOS and Android checkouts
(`design-system/targets.json`), so run that only as part of setting those up.

The rules most likely to be broken by habit: one font weight (500 — no
bold, emphasis is black against muted grey); buttons are pills, primary
black (at most one per screen), secondary grey, tertiary text-only; cards
are flat `bg-surface` with no border or shadow; motion is opacity only;
"verified" is always the spiral (`VerifiedMark`), never a check; sentence
case everywhere except the wordmark. These replaced the earlier grey-CTA /
all-black-text rules.

`cn()` (`src/lib/utils.ts`) must be told about every custom type and size
token. Out of the box it reads `text-label` as a colour and drops it when a
`text-foreground` follows.

## Feature flags and fonts

The site reads flags through `isPublicFlagEnabled()` (`src/lib/featureFlags.ts`)
→ the `public_feature_flag_enabled(p_key)` RPC, which answers only for an
allowlist hard-coded in that function (today: `neue_font`), and only `all`
counts as on — visitors are anonymous, so `admin` has nothing to resolve
against. Results revalidate every 60s, which keeps the marketing pages static.
Adding a flag means adding it to both the `PublicFlagKey` type and the SQL
allowlist. **Reading a flag here only decides what the page asks for**; a
visitor can edit the HTML. Anything that must stay private behind a flag needs
its own gate in the database.

Type is **Inter Display**, self-hosted from `src/fonts/inter-display` (SIL
OFL), the same cuts the app bundles. While `neue_font` is `all`, `<html>`
carries `data-font="neue"` and `src/styles/fonts.css` switches to **PP Neue
Montreal**, served by `/fonts/neue/[file]` from the private `licensed-fonts`
Supabase bucket. **Those files must never be committed here** (they're
gitignored): our copy is the free-for-personal-use release and this repo is
public. The route downloads with the anon key, and the bucket's storage policy
(`can_read_licensed_fonts()`) refuses anon unless the flag is `all` — so the
route 404s and the page falls back to Inter Display whatever the client asks
for. Don't set `all` until a commercial licence is bought. The Open Graph card
(`opengraph-image.tsx`) still uses Satori's default font, and takes its
colours from the generated `src/styles/tokens.ts` (Satori can't read CSS
variables). Only Inter Display **Medium** is loaded — the design system has
one weight — though the other cuts stay in `src/fonts` alongside the app's.

## Anonymous access is narrower than it looks

The publishable key is deliberately not a secret; the boundary is server-side.
`get_verification_photo()` is `security definer` and only ever answers about
one photo you already hold the code for — so the key can't enumerate photos —
and returns `storage_path`/`username` only when the owner's privacy is
`Public`. Storage reads go through a separate `anon` RLS policy on the `photos`
bucket. Two silent traps were found building this (RLS does not bypass RLS;
`storage.buckets` has its own RLS) — both are written up in the app repo's
`CLAUDE.md` → Database. When debugging anon access, test *as the role*
(`set local role anon; select …`) rather than assuming a policy that exists
also passes.
