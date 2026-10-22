# Code Walkthrough (v0.01)

A file-by-file tour of the code, written for a learner. Each section explains
*what* the file does and *why* it is written the way it is. Read
[`overview.md`](overview.md) first for the big picture.

The code itself also carries inline comments; this document adds the
surrounding explanation and the "why" behind the decisions.

---

## `lib/types.ts` &mdash; the domain model

This file defines the **types** of the application: `User`, `Post`, and
`FeedPost`.

```ts
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
}
```

An `interface` in TypeScript describes the *shape* of an object &mdash; the
fields it must have and their types &mdash; without creating any runtime value.
Interfaces are erased when the code is compiled; they exist purely to let the
compiler check that we never, for example, read `post.auther` (a typo) or pass
a number where a string is expected.

The interesting modeling decision is in `Post`:

```ts
export interface Post {
  authorId: string;   // references a User by id
  // ...
}
```

A `Post` stores the author's **id**, not the whole author. This is how
relational data is modeled: store the relationship, then *join* the related
data when you need it. Storing `authorId` avoids duplicating the author's name
and avatar on every post, and it means changing a user's display name updates
everywhere automatically.

`FeedPost` then represents the joined result:

```ts
export interface FeedPost extends Post {
  author: User;
}
```

`extends Post` means "everything in `Post`, plus an `author`". The feed needs
the author's name and avatar, so the data layer produces this enriched shape.

## `lib/data.ts` &mdash; the data layer

This file holds the mock data and the function the UI calls to read it.

```ts
export const users: User[] = [ /* ... */ ];
export const posts: Post[] = [ /* ... */ ];
```

These are plain arrays of objects at module scope. When the module is imported,
they are created once and persist for the lifetime of the process. They stand
in for what will eventually be rows in a database.

The heart of the file is `getFeed()`:

```ts
export async function getFeed(): Promise<FeedPost[]> {
  const feed = posts.map((post) => ({
    ...post,
    author: getUserById(post.authorId),
  }));

  return feed.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}
```

Three ideas to notice:

1. **`...post` (the spread operator)** copies every field of `post` into a new
   object, then `author` is added. The result is a `Post` *plus* an `author`:
   exactly the `FeedPost` shape.
2. **`Date.parse`** converts an ISO date string (e.g. `"2026-01-18T10:15:00.000Z"`)
   into a number of milliseconds. Subtracting them lets `.sort()` order posts
   newest-first. (Strings sort alphabetically, which would be wrong for dates.)
3. **`async` + `Promise`** &mdash; the function is declared `async` and returns
   a `Promise`, even though nothing inside actually awaits anything. This is
   deliberate: it makes the function's signature match a real database query
   (`await db.posts.find()`), so when we add a real store later, the home page
   will not need to change at all.

## `app/layout.tsx` &mdash; the root layout

The root layout wraps every page. It is where global concerns live.

```tsx
export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "...",
};
```

Next.js reads this exported `metadata` object and generates the `<title>` and
`<meta>` tags in the document head. The `template` is a trick: a nested page
that exports `title: "About"` will render as **"About · AJC Social"**. We must
*not* write a `<head>` tag ourselves; the Metadata API handles it, including
deduplicating tags from nested pages.

```tsx
export default function RootLayout({ children }: LayoutProps<"/">) {
```

`LayoutProps<"/">` is a **globally available helper type** that Next.js
generates from our route structure. It does not need to be imported. For the
root layout it supplies `children`; for a layout with a dynamic segment (say
`app/[team]/layout.tsx`) it would also supply a typed `params`. This is a
Next.js 16 feature &mdash; older versions used a hand-written
`{ children: React.ReactNode }`.

The component returns the actual page skeleton:

```tsx
<html lang="en" className="...">
  <body className="flex min-h-full flex-col">
    <SiteHeader />
    <main className="flex flex-1 flex-col">{children}</main>
    <SiteFooter />
  </body>
</html>
```

- `<html>` and `<body>` appear exactly once, here, for the whole app.
- `children` is where the current page renders. The header and footer sit
  around it, so they appear on every page.
- `min-h-full flex flex-col` on `<body>` plus `flex-1` on `<main>` is a common
  layout trick: it makes the footer stick to the bottom of the viewport even
  when a page is short. (Tailwind's `flex` utilities map to CSS flexbox.)

## `components/site-header.tsx` &mdash; the nav bar

```tsx
import Link from "next/link";
```

`<Link>` is Next.js's navigation component. It renders an `<a>` tag but enables
**client-side navigation**: clicking swaps the page without a full browser
reload, and Next.js can prefetch the destination in the background.

The component maps over a small `NAV_LINKS` array to produce the links:

```tsx
{NAV_LINKS.map((link) => (
  <Link key={link.href} href={link.href}>...</Link>
))}
```

Two details worth noting:

- **`key`** &mdash; React requires a stable `key` on items in a list so it can
  track which element is which when the list changes.
- **`SITE_NAME`** is exported from this file (with `export const`) so both the
  header, the footer, and the layout can share one source of truth for the
  site name. Change it once, and it changes everywhere.

## `components/post-card.tsx` &mdash; one post

This is a **presentational component**: it takes a `FeedPost` prop and renders
it, with no other responsibilities.

```tsx
export default function PostCard({ post }: { post: FeedPost }) {
```

The type annotation `{ post: FeedPost }` tells TypeScript exactly what props
this component accepts, so callers get a compile error if they pass the wrong
thing. The component then destructures `post` (and `post.author`) to read the
fields it needs.

A small helper formats the timestamp:

```ts
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { ... });
}
```

`new Date(iso)` parses the ISO string into a `Date` object, and
`toLocaleDateString` renders it in a human-friendly form. We pass an explicit
locale and options so the output does not depend on where the server runs.

## `app/page.tsx` &mdash; the home page

The home page demonstrates the standard Next.js data-loading pattern:

```tsx
export default async function Home(props: PageProps<"/">) {
  const feed = await getFeed();
  return ( /* ... map posts to <PostCard/> ... */ );
}
```

- The component is **`async`**, which Server Components are allowed to be.
- It **`await`s** the data *before* returning JSX. The server resolves the
  promise, then renders the HTML, so the browser receives a fully-rendered
  page (no client-side fetch, no loading spinner).
- `PageProps<"/">` is the page counterpart to `LayoutProps` &mdash; a generated
  helper type. For this static route, `params` is an empty object; for
  `app/u/[id]/page.tsx` it would be `{ id: string }`.

Because the page does not read `searchParams`, `cookies()`, or `headers()`, it
contains no *request-time* data, so Next.js can prerender it as a static page
at build time. (Reading any of those would opt the page into dynamic rendering.)

## `app/about/page.tsx` &mdash; a nested route

This file lives at `app/about/page.tsx`, which makes its URL `/about`. That is
the whole point of the example: the folder *is* the route.

It also shows **page-level metadata**:

```tsx
export const metadata: Metadata = { title: "About" };
```

This overrides the title just for `/about`, while the root layout's template
still applies, producing "About · AJC Social".

## `components/site-footer.tsx` &mdash; the footer

The footer is a simple, static Server Component, just like the header. It shows
the site name, version, and a copyright line.

The one point worth explaining is the year:

```tsx
<p>&copy; {SITE_FOUNDING_YEAR} {SITE_NAME}. Built with Next.js.</p>
```

`SITE_FOUNDING_YEAR` is a fixed constant (`2026`) from `lib/site.ts`, not
`new Date().getFullYear()`. The reason is instructive: this project has Cache
Components enabled, so pages are prerendered into a static shell. `new Date()`
is an *unstable* value &mdash; it changes on every render &mdash; so Next.js
refuses to bake it into a static page and fails the build. A fixed year is
deterministic, so the footer stays fully static.

(If a genuinely current year is ever wanted, the idiomatic options are to read
it in the browser inside a `useEffect`, or to render it behind a `<Suspense>`
boundary so it streams at request time. Both are covered in the changelog's
notes; neither was needed for this minimal version.)

## `app/globals.css` &mdash; global styles

This project uses **Tailwind CSS v4**, whose setup is a single line:

```css
@import "tailwindcss";
```

Older Tailwind versions required a `tailwind.config.js` file and a longer
directives block. In v4, configuration happens in CSS through the `@theme`
block, which maps our design tokens onto Tailwind utilities:

```css
@theme inline {
  --color-background: var(--background);
  --font-sans: var(--font-geist-sans);
}
```

This makes utilities like `bg-background` and `font-sans` available, and wires
`font-sans` to the Geist web font loaded in `layout.tsx`.

---

## Summary of concepts covered

| Concept                         | Where you saw it                              |
| ------------------------------- | --------------------------------------------- |
| File-system routing             | `app/page.tsx` → `/`, `app/about/page.tsx` → `/about` |
| Server Components               | Every component (header, footer, cards, pages) |
| Async data loading in a page    | `app/page.tsx` (`await getFeed()`)            |
| Domain types / interfaces       | `lib/types.ts`                                |
| Data layer / join pattern       | `lib/data.ts` (`getFeed()`)                   |
| Generated prop helpers          | `LayoutProps<"/">`, `PageProps<"/">`          |
| Metadata API                    | `export const metadata` in layout & about     |
| `<Link>` client navigation      | `components/site-header.tsx`                  |
| Presentational components       | `components/post-card.tsx`                    |
| Tailwind v4 / `@theme`          | `app/globals.css`                             |
