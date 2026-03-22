# Data Mutation Standards

## Overview

Data mutations follow a strict two-layer pattern:

1. **`/data` helper** — wraps the Drizzle ORM call
2. **Server Action in `actions.ts`** — validates input via Zod, then calls the `/data` helper

No other pattern is permitted.

## `/data` Helpers

All database mutation calls must go through helper functions in `src/data/`.

- Do NOT write inline Drizzle calls inside Server Actions, components, or anywhere outside `src/data/`
- Do NOT use raw SQL — always use Drizzle ORM
- Each helper should be focused on a single concern (e.g. `createWorkout`, `deleteWorkout`)
- Helpers must call `auth()` and scope all operations to the authenticated `userId`

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function createWorkout(date: string, name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.insert(workouts).values({ userId, date, name });
}

export async function deleteWorkout(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  return db.delete(workouts).where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
}
```

## Server Actions

All mutations must be triggered via [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations).

- Server Actions must live in colocated `actions.ts` files alongside the page or component that uses them (e.g. `src/app/dashboard/actions.ts`)
- Do NOT define Server Actions inline inside components
- Do NOT create API route handlers (`app/api/...`) for mutations

## Typing Server Action Parameters

- All Server Action parameters must be explicitly typed with TypeScript
- Do **NOT** use `FormData` as a parameter type — accept typed objects instead

```ts
// ✅ Correct
export async function createWorkoutAction(data: { date: string; name: string }) { ... }

// ❌ Wrong
export async function createWorkoutAction(formData: FormData) { ... }
```

## Zod Validation

Every Server Action **must** validate its arguments with Zod before doing anything else.

- Define a Zod schema for each action's input
- Call `.parse()` or `.safeParse()` at the top of the action — before calling any `/data` helper
- Never trust that the caller has passed valid data

```ts
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be a valid date (yyyy-MM-dd)"),
  name: z.string().min(1, "Name is required"),
});

export async function createWorkoutAction(data: { date: string; name: string }) {
  const parsed = createWorkoutSchema.parse(data);
  await createWorkout(parsed.date, parsed.name);
}
```

## Full Pattern Summary

```
Client Component
  └─ calls Server Action (actions.ts)
       └─ validates with Zod
            └─ calls /data helper
                 └─ auth() check + Drizzle ORM call
```
