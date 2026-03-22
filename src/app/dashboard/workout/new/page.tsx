import { format } from "date-fns";
import { NewWorkoutForm } from "./new-workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date } = await searchParams;
  const defaultDate =
    typeof date === "string" ? date : format(new Date(), "yyyy-MM-dd");

  return (
    <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">New Workout</h1>
      <NewWorkoutForm defaultDate={defaultDate} />
    </div>
  );
}
