// ---------------------------------------------------------------------------
// app/page.tsx  (the home page, route "/")
// ---------------------------------------------------------------------------
// This is the landing page of the app. It shows a short intro and the feed of
// posts. The feed is the heart of a social network, so even in this minimal
// first version we make it real (with mock data) to establish the pattern.
//
// The page is an `async` Server Component. Server Components can be `async`
// and `await` data *before* rendering, which is the idiomatic Next.js way to
// load data. The data is fetched on the server, so it never has to round-trip
// through a client-side fetch.
// ---------------------------------------------------------------------------

import PostCard from "@/components/post-card";
import { getFeed } from "@/lib/data";

// `PageProps<"/">` is a globally generated helper type (no import). For this
// static route it provides `params` (typed as an empty object) and
// `searchParams`. We only use `params` for demonstration here; because we do
// not read `searchParams`, the page remains fully static and can be
// prerendered at build time.
export default async function Home(props: PageProps<"/">) {
  // Demonstrate that `params` exists and is empty for a static route.
  // (A dynamic route like /u/[id] would carry `{ id: string }` here.)
  void props.params;

  // Ask the data layer for the feed. See lib/data.ts for the implementation.
  const feed = await getFeed();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10">
      {/* A short hero section introducing the project. */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Your social network, starting here.
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          This is the first pre-release of a social networking site built with
          Next.js. The feed below runs on in-memory sample data while the
          foundation &mdash; structure, types, and documentation &mdash; comes
          together.
        </p>
      </section>

      {/* The feed. */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Feed
        </h2>

        {feed.length === 0 ? (
          // Empty state: shown if the data layer ever returns no posts.
          <p className="text-zinc-500 dark:text-zinc-400">
            Nothing here yet &mdash; check back soon.
          </p>
        ) : (
          feed.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </div>
  );
}
