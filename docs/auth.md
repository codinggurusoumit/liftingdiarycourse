# Authentication Standards

## Clerk is the Only Auth Provider

**This app uses Clerk (`@clerk/nextjs` v7) exclusively for authentication.**

- Do NOT implement custom auth, JWT handling, session management, or any other auth mechanism
- Do NOT use NextAuth, Auth.js, Supabase Auth, or any other auth library
- All auth primitives come from `@clerk/nextjs` (client) or `@clerk/nextjs/server` (server)

## Required Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

Both must be present or the app will not function.

## Middleware

`clerkMiddleware()` runs on every request via `src/middleware.ts`. Do not remove or replace it.

To protect a route server-side, call `protect()` inside the route handler or page:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) redirect("/sign-in"); // or throw
```

## Server-Side Auth

Use `auth()` from `@clerk/nextjs/server` in Server Components, Server Actions, and `/data` helpers:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthorized");
```

- **Never** accept `userId` as a parameter from callers — always derive it from `auth()` directly
- **Never** skip the null check — an unauthenticated `userId` is `null`

## Client-Side Auth

Use Clerk's components from `@clerk/nextjs` in Client Components and layouts. Do not read or store auth state manually.

| Use case | Component / hook |
|---|---|
| Show UI only when signed in | `<Show when="signed-in">` |
| Show UI only when signed out | `<Show when="signed-out">` |
| Sign-in trigger | `<SignInButton mode="modal">` |
| Sign-up trigger | `<SignUpButton mode="modal">` |
| User avatar / account menu | `<UserButton>` |

## ClerkProvider

`<ClerkProvider>` must wrap the entire app. It is already in `src/app/layout.tsx`. Do not move or duplicate it.

## Route Protection

| Scenario | Approach |
|---|---|
| Protect a page | Call `auth()` at the top of the Server Component and redirect/throw if no `userId` |
| Protect a data helper | Call `auth()` inside the helper — never rely on the caller to enforce this |
| Public page (no auth needed) | No action required — middleware allows unauthenticated access by default |
