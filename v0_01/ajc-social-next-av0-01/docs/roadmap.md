# Roadmap &mdash; planned for v0.02

This is the plan for the next pre-release, written at the close of v0.01.
Items are ordered by proposed priority and may change based on the owner's
answers to the open questions in the [changelog](changelog.md).

## v0.02 (next)

The goal of v0.02 is to make the site **interactive and persistent**: users
can do something, and the result survives a reload.

### Proposed scope

1. **Posting** &mdash; a composer on the home page that lets a user write a new
   post and see it appear in the feed.
   - This introduces the first **Client Component** (the composer form) and the
     first **mutation** (a Server Action or a form action that writes data).
2. **A simple account concept** &mdash; an identity to attribute posts to.
   - Likely a lightweight "sign in as a user" selection (not real passwords) to
     keep the version small, or the start of real authentication.
3. **Persistence** &mdash; move the mock data from an in-memory array into a
   store that survives server restarts (e.g. SQLite or a JSON file), keeping the
   same `lib/data.ts` function signatures so the UI barely changes.
4. **Profiles** &mdash; a dynamic route (`app/u/[id]/page.tsx`) showing one
   user's posts. This introduces **dynamic routes** and the async `params`
   pattern.

### Explicitly out of scope for v0.02 (kept for later)

- Real multi-user accounts with passwords and sessions.
- Followers/following, replies, and direct messages.
- Media uploads.
- Feed pagination and real-time updates.

### Decisions needed before starting v0.02

- Which data store to target (see changelog open questions).
- Whether authentication should be real or a placeholder in v0.02.
- The final product name (to avoid re-naming churn later).

## v0.03 and beyond (rough)

- Real authentication and user sessions.
- A richer data model (follows, likes, replies).
- Feed pagination and sorting.
- Styling/design system refinement and accessibility pass.

---

## Repository conventions (reference)

- Each release lives in its own `v0_0x` directory.
- Keep at most **three** version directories side by side. When a fourth
  version is created, the oldest directory should be **archived** (for example,
  moved to an `archive/` folder or a separate branch) to avoid clutter &mdash;
  propose the exact method at that point.
- Every version ships documentation: what changed, how the code works, and how
  to use the software, plus a roadmap for the next version.
