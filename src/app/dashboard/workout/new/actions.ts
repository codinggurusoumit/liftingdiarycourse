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
