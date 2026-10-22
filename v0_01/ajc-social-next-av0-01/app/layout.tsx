// ---------------------------------------------------------------------------
// app/layout.tsx  (the "root layout")
// ---------------------------------------------------------------------------
// The root layout is the outermost component in the App Router. It wraps
// *every* page in the app, so it is where we put UI that should appear on all
// pages: the `<html>`/`<body>` tags, global styles, fonts, the header, and the
// footer.
//
// Next.js requires the root layout to define `<html>` and `<body>` exactly
// once for the whole app. We must NOT add a `<head>` tag manually; instead we
// use the Metadata API (`export const metadata`) and Next.js fills in the
// title/meta tags, deduplicating them across nested pages.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { SITE_NAME } from "@/lib/site";

// Load two font families from Google Fonts. The `variable` option exposes each
// font as a CSS custom property (e.g. `--font-geist-sans`) that our CSS maps
// onto Tailwind's `font-sans`/`font-mono` utilities in globals.css.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Page metadata: the title and description that appear in browser tabs and
// search-engine results. Nested pages can override this with their own
// `export const metadata`.
export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`, // e.g. "About · AJC Social"
  },
  description: "A social networking site built with Next.js.",
};

// `LayoutProps<"/">` is a globally available helper type that Next.js generates
// from our route structure (no import needed). For the root layout it provides
// the `children` prop, and for layouts with dynamic segments or parallel
// routes it would also provide strongly-typed `params` and named slots.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Shared shell: header on top, page content in the middle, footer below. */}
        <SiteHeader />
        {/* `flex-1` lets this main area grow so the footer sticks to the bottom
            even on short pages. */}
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
