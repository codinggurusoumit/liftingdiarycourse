import { format } from "date-fns";
import { getWorkoutsByDate } from "@/data/workouts";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date } = await searchParams;
  const selectedDate =
    typeof date === "string" ? date : format(new Date(), "yyyy-MM-dd");

  const workouts = await getWorkoutsByDate(selectedDate);

  return <DashboardClient date={selectedDate} workouts={workouts} />;
}
