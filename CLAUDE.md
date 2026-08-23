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

The route is `force-dynamic` and must stay that way: it mints a short-lived
signed Storage URL per request, and its response depends on live DB state
(the owner can change their privacy at any time).

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
