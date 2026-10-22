// ---------------------------------------------------------------------------
// lib/data.ts
// ---------------------------------------------------------------------------
// The "data layer". Right now this is just in-memory mock data: plain arrays
// declared at module scope. When the module is imported, these arrays are
// created once and live for as long as the server process runs.
//
// Why have a separate data layer at all? Because it gives the UI a stable
// place to ask for data. Later we can swap the bodies of these functions to
// query a real database (Postgres, SQLite, etc.) without touching the
// components that call them. The rest of the app only needs to know *what* a
// function returns, not *how* it gets it.
// ---------------------------------------------------------------------------

import type { FeedPost, Post, User } from "./types";

/**
 * A small set of seed users.
 *
 * The data is sorted newest-first only at the point we *read* it (in
 * `getFeed`), so we keep the source arrays in a simple, readable order.
 */
export const users: User[] = [
  {
    id: "u1",
    username: "@ada",
    displayName: "Ada Lovelace",
    avatarColor: "#7c3aed",
  },
  {
    id: "u2",
    username: "@alan",
    displayName: "Alan Turing",
    avatarColor: "#0ea5e9",
  },
  {
    id: "u3",
    username: "@grace",
    displayName: "Grace Hopper",
    avatarColor: "#f59e0b",
  },
];

/**
 * A small set of seed posts. Each post points at an author by `authorId`.
 */
export const posts: Post[] = [
  {
    id: "p1",
    authorId: "u1",
    body: "Ship the smallest useful thing first, then iterate. Version 0.01 is the seed of something bigger.",
    createdAt: "2026-01-18T10:15:00.000Z",
    likeCount: 12,
  },
  {
    id: "p2",
    authorId: "u2",
    body: "A social network is really just two questions: who are you, and what do you want to share?",
    createdAt: "2026-01-17T14:30:00.000Z",
    likeCount: 8,
  },
  {
    id: "p3",
    authorId: "u3",
    body: "The most dangerous phrase in software is 'we'll add that later'. But sometimes, for a v0, it's exactly right.",
    createdAt: "2026-01-16T09:05:00.000Z",
    likeCount: 21,
  },
  {
    id: "p4",
    authorId: "u1",
    body: "Foundational work feels slow because it is. A solid data model and clean structure pay off every version after.",
    createdAt: "2026-01-15T18:45:00.000Z",
    likeCount: 15,
  },
  {
    id: "p5",
    authorId: "u2",
    body: "Documentation is a feature. The best code is the code someone else can understand six months later.",
    createdAt: "2026-01-14T12:00:00.000Z",
    likeCount: 19,
  },
];

/**
 * Resolve a user by id.
 *
 * `find` walks the array and returns the first matching item, or `undefined`
 * if none match. We assert non-null with the `!` operator because our seed
 * data is known to be consistent (every `authorId` has a matching user).
 * A real implementation would query a database and handle the missing case.
 */
function getUserById(id: string): User {
  return users.find((user) => user.id === id)!;
}

/**
 * Return the feed: every post, newest first, with its author attached.
 *
 * This is the function the home page calls. It is marked `async` and returns
 * a `Promise` even though the current implementation is synchronous under the
 * hood. We do this deliberately:
 *
 *   - It mirrors the shape of a real database query (`await db.posts.find()`),
 *     so the calling code will not need to change when we add a real store.
 *   - It lets the home page be an `async` Server Component, which is the
 *     idiomatic Next.js way to load data before rendering.
 */
export async function getFeed(): Promise<FeedPost[]> {
  // `map` transforms each Post into a FeedPost by joining in the author.
  const feed = posts.map((post) => ({
    ...post, // copy all of the post's fields
    author: getUserById(post.authorId), // and attach the author
  }));

  // Sort newest first so the feed reads like a timeline.
  // `Date.parse` turns the ISO string into a comparable number (milliseconds).
  return feed.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}
