# Architecture Overview (v0.01)

This document is written for someone who understands programming fundamentals
(what a function is, what a type is, what "server" and "browser" mean) and
wants to understand how this Next.js application is put together. It explains
the *big picture* before the [code walkthrough](code-walkthrough.md) explains
the individual files.

---

## The mental model: files become pages

Next.js uses **file-system routing** in its App Router. That means the URL
structure of the site is derived from folders and files under `app/`, not from
a routing table you configure by hand.

| File on disk        | URL it serves |
| ------------------- | ------------- |
| `app/page.tsx`      | `/`           |
| `app/about/page.tsx`| `/about`      |

Every folder inside `app/` is a URL segment, and a `page.tsx` file in that
folder is what renders at that segment. Add `app/settings/page.tsx` and you get
a `/settings` page &mdash; no other wiring required.

The two other kinds of files you will see in `app/`:

- **`layout.tsx`** &mdash; shared UI that *wraps* pages and persists across
  navigation. The root `app/layout.tsx` wraps everything and must contain
  `<html>` and `<body>`.
- **`globals.css`** &mdash; global styles, imported once by the root layout.

## The rendering model: Server Components by default

In this app, **every component is a Server Component by default**. This is the
key idea to internalize about the App Router:

- Server Components are rendered on the server and sent to the browser as
  HTML. They can be `async` and can `await` data (a database query, a file
  read) before rendering. They never ship their code to the browser.
- Client Components (marked with a `"use client"` directive at the top) are
  needed only for interactivity &mdash; event handlers, state, browser APIs.

Everything in this version is a **Server Component**, because there is no
interactivity yet. The header links, the feed, the post cards, the footer, and
the pages are all plain Server Components.

> **A note on static rendering.** This project enables Next.js "Cache
> Components", which prerenders pages into a static shell. As a result, unstable
> values &mdash; such as `new Date()` &mdash; cannot be read during render or
> the build fails. This is why the footer shows a fixed founding year instead of
> computing the current year. The changelog's "notes" section explains the
> trade-off and how a truly current year would be handled.

When we add things like a like button or a post composer (which need to respond
to clicks), those will become Client Components.

> **Why this matters:** by keeping the UI on the server by default, the browser
> downloads far less JavaScript. This is the "React Server Components" model
> that Next.js is built around.

## How data flows

```
 lib/data.ts ──(getFeed(): Promise<FeedPost[]>)──▶ app/page.tsx ──▶ components/post-card.tsx
```

1. **`lib/types.ts`** defines what a `User` and a `Post` *are* (the domain
   model). Types are the contract everyone else relies on.
2. **`lib/data.ts`** is the data layer. It holds mock data and exposes
   `getFeed()`, which returns posts joined with their authors, newest first.
   It is `async` and returns a `Promise` even though the data is currently
   in-memory &mdash; that way the calling code already looks like a real
   database call.
3. **`app/page.tsx`** (an `async` Server Component) awaits `getFeed()` and maps
   each post to a `PostCard`.
4. **`components/post-card.tsx`** is a "dumb" presentational component: it
   receives a `FeedPost` as a prop and renders it. It knows nothing about where
   the data came from.

This separation &mdash; types → data → page → presentational component &mdash;
is the structure that will let us swap the mock data for a real database
without touching the UI.

## Why the project is organized this way

| Folder          | Responsibility                                    |
| --------------- | ------------------------------------------------- |
| `app/`          | Routes and page/layout structure.                 |
| `components/`   | Reusable UI pieces shared across pages.           |
| `lib/`          | Non-UI logic: types and data.                     |
| `docs/`         | Documentation (what you are reading).             |

Keeping **UI** (`app/`, `components/`) separate from **logic** (`lib/`) is a
common pattern. As the app grows, `lib/` will also hold things like validation
and database access, while `components/` will accumulate buttons, forms, and
other reusable UI.

## Where to go next

- [Code walkthrough](code-walkthrough.md) &mdash; a line-by-line tour of each
  file in this version.
- [Changelog](changelog.md) &mdash; a concise summary of what this version
  added and why.
- [Roadmap](roadmap.md) &mdash; what the next version is planned to include.
