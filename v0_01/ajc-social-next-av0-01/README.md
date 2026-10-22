# AJC Social &mdash; v0.01

A social networking site built with [Next.js](https://nextjs.org). This is the
**first pre-release version**: minimal groundwork on top of which later
versions will add real features.

> **Working title.** "AJC Social" is a placeholder name derived from the
> repository. It is used throughout the app and docs until the owner picks a
> final name.

---

## What this version includes

- A shared **app shell** (header + footer) applied to every page.
- A **home page** with a working feed of posts.
- An **about page** demonstrating a nested route.
- A typed **domain model** (`User`, `Post`) and a mock **data layer**.
- Learning-oriented documentation (see [`docs/`](docs/overview.md)).

Everything is static and runs on in-memory sample data. There is no database,
no accounts, and no posting yet &mdash; those are the point of future versions.

## Running the app

Requirements: Node.js 20.9+ and npm.

```bash
# 1. Install dependencies (only needed the first time)
npm install

# 2. Start the development server
npm run dev
```

Open <http://localhost:3000> in your browser. The home page shows the feed;
the header links to the About page.

### Other useful commands

| Command         | What it does                                            |
| --------------- | ------------------------------------------------------- |
| `npm run dev`   | Start a dev server with hot reload.                     |
| `npm run build` | Produce an optimized production build.                  |
| `npm run start` | Serve the production build (run after `build`).         |
| `npm run lint`  | Run ESLint on the codebase.                             |

## Project layout

```
app/
  layout.tsx        Root layout: <html>, header, footer, global styles.
  page.tsx          Home page ("/") — the feed.
  about/page.tsx    About page ("/about").
  globals.css       Global styles + Tailwind theme tokens.
components/
  site-header.tsx   Top navigation bar.
  site-footer.tsx   Bottom footer.
  post-card.tsx     Renders one post in the feed.
lib/
  types.ts          Domain types (User, Post, FeedPost).
  data.ts           Mock data layer (users, posts, getFeed()).
docs/
  overview.md       Architecture overview (start here if learning).
  code-walkthrough.md  Detailed, file-by-file explanation of the code.
  changelog.md      What changed in this version.
  roadmap.md        Planned work for the next version.
```

## Documentation

Two kinds of documentation are maintained in this repository:

- **For users** &mdash; how to run and use the software. This file, plus each
  version's changelog.
- **For learners** &mdash; for someone comfortable with programming
  fundamentals who wants to understand *how the code works*. Start with
  [`docs/overview.md`](docs/overview.md), then read
  [`docs/code-walkthrough.md`](docs/code-walkthrough.md).

## Versions

Each pre-release lives in its own directory under the repository root, named
`v0_0x` (e.g. `v0_01`, `v0_02`). See [`docs/roadmap.md`](docs/roadmap.md) for
what is planned next.
