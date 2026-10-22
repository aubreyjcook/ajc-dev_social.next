// ---------------------------------------------------------------------------
// components/site-footer.tsx
// ---------------------------------------------------------------------------
// The footer shown at the bottom of every page.
//
// Like the header, this is a simple Server Component with no interactivity, so
// it renders once on the server and is sent to the browser as plain HTML.
//
// Note on the copyright year: it is a *static* founding year (see
// `SITE_FOUNDING_YEAR` in lib/site.ts) rather than `new Date().getFullYear()`.
// Because this project prerenders pages into a static shell (Cache Components),
// an unstable value like "now" would prevent the footer from being prerendered.
// A fixed year keeps the footer fully static and deterministic.
// ---------------------------------------------------------------------------

import { SITE_FOUNDING_YEAR, SITE_NAME } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/10 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-1 px-4 py-8 text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          {SITE_NAME} &middot; v0.01 &middot; pre-release groundwork
        </p>
        <p>
          &copy; {SITE_FOUNDING_YEAR} {SITE_NAME}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
