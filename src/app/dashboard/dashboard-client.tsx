"use client";

import { useRouter } from "next/navigation";
import { parseISO } from "date-fns";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

type Workout = {
  id: string;
  userId: string;
  name: string | null;
  date: string;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type Props = {
  date: string;
  workouts: Workout[];
};

export function DashboardClient({ date, workouts }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const selectedDate = parseISO(date);

  function handleDateSelect(d: Date | undefined) {
    if (!d) return;
    setOpen(false);
    router.replace(`/dashboard?date=${format(d, "yyyy-MM-dd")}`, { scroll: false });
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold">Workout Diary</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Showing workouts for</span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-xs hover:bg-accent hover:text-accent-foreground">
            <CalendarIcon className="h-4 w-4" />
            {format(selectedDate, "do MMM yyyy")}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        {workouts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          workouts.map((workout) => (
            <div
              key={workout.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {workout.name ?? "Untitled Workout"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {workout.completedAt ? "Completed" : "In progress"}
                </p>
              </div>
              <Button variant="outline" size="sm">
                View
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
