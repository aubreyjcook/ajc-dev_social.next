# Changelog &mdash; v0.01

The first pre-release. This version is **groundwork**: it establishes the
project structure and patterns that later versions will build on, with a small
amount of real functionality to make those patterns concrete.

## What changed

- **Scaffolded the project** on Next.js 16 (App Router, TypeScript, Tailwind
  CSS v4, Turbopack) and replaced the default starter page with this app.
- **Added a typed domain model** (`lib/types.ts`): `User`, `Post`, and the
  joined `FeedPost` shape.
- **Added a mock data layer** (`lib/data.ts`): seed users and posts, plus an
  async `getFeed()` that joins and sorts them. It is intentionally shaped like
  a future database query.
- **Built a shared app shell**: a site header with navigation
  (`components/site-header.tsx`) and a footer (`components/site-footer.tsx`),
  wired into the root layout (`app/layout.tsx`).
- **Created a home page** (`app/page.tsx`) that loads the feed and renders each
  post with a new `PostCard` component.
- **Created an about page** (`app/about/page.tsx`) to demonstrate a nested
  route and page-level metadata.
- **Added documentation**: usage (`README.md`), an architecture overview
  (`docs/overview.md`), a code walkthrough (`docs/code-walkthrough.md`), and
  this changelog.

## Design decisions made (and why)

- **No database yet.** An in-memory data layer keeps this version dependency-free
  and focused on structure. `getFeed()` is already `async` so swapping in a real
  store later requires no changes to the UI.
- **Entirely Server Components.** The version has no interactivity, so every
  component is a Server Component, minimizing JavaScript sent to the browser.
- **Working title "AJC Social".** A neutral placeholder derived from the repo
  name, pending the owner's final naming decision.
- **Versioned directories.** Each release lives in its own `v0_0x` folder under
  the repo root, per the project's conventions.

## Notes (Next.js 16 behavior worth knowing)

- **Cache Components block unstable values during prerendering.** With Cache
  Components enabled (`cacheComponents: true` in `next.config.ts`), a page is
  prerendered into a static shell, so unstable values such as `new Date()`
  cannot be read during render &mdash; the build fails with a clear, labeled
  error. This version therefore uses a fixed founding year
  (`SITE_FOUNDING_YEAR`) in the footer. If a truly current year is wanted later,
  the framework's suggested fixes are to read it in the browser inside a
  `useEffect`, or to render it behind a `<Suspense>` boundary so it streams at
  request time. (A `useEffect` approach also requires care: reading `new Date()`
  there is fine, but React's `react-hooks` lint discourages synchronously
  setting state inside an effect, so the value should be consumed directly
  rather than stored via `useState`.)

## Open questions for the owner

These were treated as defaults for this version and should be confirmed before
they matter:

1. **Product name** &mdash; replace the "AJC Social" working title.
2. **Core feature priority** &mdash; what matters most for v0.02: accounts/auth,
   posting, profiles, or something else? (See the roadmap.)
3. **Data store** &mdash; which database the app should target when mock data is
   replaced.
