// ---------------------------------------------------------------------------
// components/post-card.tsx
// ---------------------------------------------------------------------------
// Renders a single post in the feed: an avatar, the author, the timestamp,
// and the post body with a like count.
//
// This is a *presentational* Server Component. It receives all the data it
// needs as a prop (a `FeedPost`) and has no idea where that data came from.
// Keeping components "dumb" like this makes them easy to reuse and test.
// ---------------------------------------------------------------------------

import type { FeedPost } from "@/lib/types";

/**
 * Turn an ISO timestamp into a short, human-friendly string such as
 * "Jan 18, 2026". `toLocaleDateString` uses the server's locale; we pass an
 * explicit locale and options so the output is predictable everywhere.
 */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostCard({ post }: { post: FeedPost }) {
  const { author } = post;

  return (
    <article className="flex gap-3 rounded-xl border border-black/10 p-4 dark:border-white/10">
      {/* Placeholder avatar: a colored circle with the author's initial. */}
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: author.avatarColor }}
      >
        {author.displayName.charAt(0)}
      </div>

      {/* The post's content column. */}
      <div className="flex min-w-0 flex-col gap-1">
        {/* Author line: name + handle + date. */}
        <div className="flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold">{author.displayName}</span>
          <span className="text-zinc-500 dark:text-zinc-400">
            {author.username}
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">
            &middot; {formatDate(post.createdAt)}
          </span>
        </div>

        {/* The post body. `whitespace-pre-wrap` preserves line breaks. */}
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.body}
        </p>

        {/* A simple reaction indicator (placeholder for a real like button). */}
        <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {post.likeCount} likes
        </div>
      </div>
    </article>
  );
}
