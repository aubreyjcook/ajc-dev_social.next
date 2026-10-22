// ---------------------------------------------------------------------------
// app/about/page.tsx  (route "/about")
// ---------------------------------------------------------------------------
// A simple static "about" page. Its purpose in this first version is twofold:
//
//   1. It gives the header a second link so navigation is actually exercised.
//   2. It demonstrates a *nested route*: because this file lives in
//      `app/about/`, Next.js maps it to the URL `/about`. No router
//      configuration is required &mdash; the folder structure *is* the routing.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

// Page-specific metadata. This overrides the root layout's default title for
// the /about page only (the root template renders it as "About · AJC Social").
export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>

      <div className="flex flex-col gap-4 text-zinc-600 dark:text-zinc-400">
        <p>
          <strong className="text-zinc-950 dark:text-zinc-50">
            {SITE_NAME}
          </strong>{" "}
          is a social networking site built with Next.js, starting from a
          minimal foundation and growing version by version.
        </p>

        <p>
          This first release (<code>v0.01</code>) is groundwork: a clean project
          structure, a typed domain model, a mock data layer, a basic page shell
          with a feed, and learning-oriented documentation. It is intentionally
          small so that each later version can add one clear capability at a
          time.
        </p>
      </div>

      <h2 className="pt-4 text-xl font-semibold tracking-tight">
        What&apos;s in this version
      </h2>
      <ul className="list-disc pl-5 text-zinc-600 dark:text-zinc-400">
        <li>An app shell with a shared header and footer.</li>
        <li>A home page with a working (mock-data) feed.</li>
        <li>Domain types for users and posts.</li>
        <li>An in-memory data layer that stands in for a database.</li>
        <li>Documentation for users and for learners.</li>
      </ul>
    </div>
  );
}
