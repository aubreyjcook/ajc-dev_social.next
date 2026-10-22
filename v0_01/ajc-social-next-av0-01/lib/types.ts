// ---------------------------------------------------------------------------
// lib/types.ts
// ---------------------------------------------------------------------------
// The "domain model" of the application. A domain model is the set of types
// that describe the *things* our software works with, independent of any UI
// or database. For a social network, the two most fundamental things are:
//
//   1. A User   - a person with an account.
//   2. A Post   - a short message a User shares with others.
//
// Keeping these types in one place means every part of the app (the data
// layer, the UI components, future API routes) can agree on the same shape.
// If we later add a field (for example `bio` on a User), we only have to
// change it here and TypeScript will point out everywhere that needs it.
// ---------------------------------------------------------------------------

/**
 * A person with an account on the social network.
 *
 * This is intentionally minimal for the first pre-release. As the app grows
 * we would likely add fields such as `bio`, `avatarUrl`, `joinedAt`, and a
 * follower/following relationship.
 */
export interface User {
  /** A stable, unique identifier (e.g. "u1"). In a real app this is a UUID. */
  id: string;

  /** The public handle shown to other users, e.g. "@ada". */
  username: string;

  /** The human-readable name, e.g. "Ada Lovelace". */
  displayName: string;

  /**
   * A CSS color used to draw a placeholder avatar.
   * We store a color (rather than an image) so the UI can render something
   * friendly without needing to host image files yet.
   */
  avatarColor: string;
}

/**
 * A single post in the social network's feed.
 *
 * A post *references* a User by `authorId` instead of embedding the whole
 * User object. This is how relational data is usually modeled: store the
 * relationship (an id), then join the related data when you need it. It
 * avoids duplicating the author's info on every one of their posts.
 */
export interface Post {
  /** Stable, unique identifier for the post. */
  id: string;

  /** The id of the {@link User} who wrote this post. */
  authorId: string;

  /** The text content of the post. */
  body: string;

  /**
   * When the post was created, as an ISO 8601 string
   * (e.g. "2026-01-15T09:30:00.000Z"). Strings are used instead of
   * `Date` objects so the data is trivially serializable (safe to store in
   * JSON, send over the network, or persist in a database).
   */
  createdAt: string;

  /** A simple reaction count, standing in for a full "like" feature. */
  likeCount: number;
}

/**
 * A post that has already been joined with its author.
 *
 * The raw {@link Post} only knows the author's *id*. The feed UI wants the
 * author's name and avatar too, so the data layer produces this "joined"
 * shape: a Post plus the User who wrote it.
 */
export interface FeedPost extends Post {
  author: User;
}
