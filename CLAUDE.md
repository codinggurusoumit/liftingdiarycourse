# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Documentation First

**IMPORTANT:** Before generating any code, always check the `/docs` directory for a relevant documentation file and follow the guidance there. If a `/docs` file exists for the feature, library, or pattern you are working with, it takes precedence over any assumptions or general knowledge.

- /docs/ui.md
- /docs/data-fetching.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Architecture

This is a Next.js 16.2.0 app using the **App Router** with TypeScript and Tailwind CSS v4.

- Source lives under `src/app/` — pages, layouts, and routes follow App Router file conventions
- Path alias `@/*` maps to `./src/*`
- Tailwind v4 is configured via PostCSS (`postcss.config.mjs`); theme tokens are CSS custom properties in `globals.css`
- ESLint uses the flat config format (`eslint.config.mjs`)

**Important:** Next.js 16.2.0 has breaking changes from prior versions. Before writing any Next.js-specific code (routing, data fetching, middleware, server actions, etc.), read the relevant guide in `node_modules/next/dist/docs/`.

## Authentication

Clerk (`@clerk/nextjs` v7) handles auth:

- `ClerkProvider` wraps the app in `layout.tsx`
- `clerkMiddleware()` in `src/middleware.ts` protects routes — use `auth()` or `protect()` from `@clerk/nextjs/server` to gate server-side access
- Client components use `<Show when="signed-in|signed-out">`, `<SignInButton>`, `<UserButton>` etc. from `@clerk/nextjs`
- Requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` env vars
