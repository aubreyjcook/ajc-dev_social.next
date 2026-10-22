// ---------------------------------------------------------------------------
// components/site-header.tsx
// ---------------------------------------------------------------------------
// The top navigation bar shown on every page.
//
// This is a *Server Component* (the default in Next.js App Router). That means
// it is rendered on the server and sent to the browser as HTML. It contains no
// interactivity, so it does not need to be sent as JavaScript.
//
// We use Next.js's `<Link>` component instead of a plain `<a>` tag. `<Link>`
// enables client-side navigation: when the user clicks, the page swaps in
// without a full browser reload. It also lets Next.js prefetch the destination
// in the background for a faster feel.
// ---------------------------------------------------------------------------

import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

/** The nav destinations shown in the header. Add new links here as pages grow. */
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
] as const;

export default function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        {/* Brand. Clicking it returns to the home page. */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>

        {/* Primary navigation. */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-black/5 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
