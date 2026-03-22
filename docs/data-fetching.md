# Data Fetching Standards

## Server Components Only

**ALL data fetching must be done exclusively via React Server Components.**

- Do NOT fetch data in client components (no `useEffect` + fetch, no SWR, no React Query, etc.)
- Do NOT create API route handlers (`app/api/...`) for the purpose of fetching data
- Do NOT use any other data fetching mechanism

Data flows in one direction: **database → `/data` helper → Server Component → Client Component (props only)**

## Database Queries via `/data` Helpers

All database queries must go through helper functions located in the `/data` directory.

- Do NOT write inline database queries inside components or anywhere outside `/data`
- Do NOT use raw SQL — **always use Drizzle ORM**
- Each helper function should be focused on a single concern (e.g. `getWorkoutsByDate`, `getExercisesForWorkout`)

Example structure:

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getWorkoutsByDate(date: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.date, date)));
}
```

## Data Ownership — Critical Security Requirement

**A logged-in user must ONLY ever be able to access their own data.**

Every query in `/data` must:

1. Call `auth()` from `@clerk/nextjs/server` to retrieve the current `userId`
2. Throw or return early if `userId` is null (unauthenticated)
3. **Always** filter queries by `userId` — never return rows without scoping to the authenticated user

This must never be delegated to the caller. The `/data` helper is the single enforcement point — it is not the component's responsibility to filter data.

**Never trust a `userId` passed in as a parameter from the outside.** Always derive it from `auth()` inside the helper itself.
