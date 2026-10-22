// ---------------------------------------------------------------------------
// lib/site.ts
// ---------------------------------------------------------------------------
// Small site-wide constants that several components need to agree on.
//
// Keeping these values in one place (instead of repeating them in the header,
// footer, layout, and pages) means changing the name or the founding year
// later is a one-line change rather than a search-and-replace across many
// files.
// ---------------------------------------------------------------------------

/**
 * The site's working title. This is a placeholder pending the owner's final
 * naming decision.
 */
export const SITE_NAME = "AJC Social";

/**
 * The year the project was founded, shown in the footer copyright line.
 *
 * This is a *static* constant rather than `new Date().getFullYear()`. There is
 * a deliberate reason: this project runs with Next.js "Cache Components"
 * enabled, which prerenders pages into a static shell. A `new Date()` call is
 * an "unstable" value (it changes every render), so Next.js refuses to bake it
 * into a static page. A fixed founding year is deterministic and therefore
 * plays perfectly with static prerendering. (If a truly current year is ever
 * wanted, it can be read on the client inside a `useEffect` or behind a
 * `<Suspense>` boundary — see the changelog's "notes" section.)
 */
export const SITE_FOUNDING_YEAR = 2026;
