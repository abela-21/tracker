import { useDB } from "@/lib/db";
import { format, startOfWeek, addDays, eachDayOfInterval, endOfWeek } from "date-fns";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Week() {
  const { habits, getHabitValue } = useDB();
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(today, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <p className="text-primary font-mono text-xs uppercase tracking-widest mb-2">Consistency</p>
        <h1 className="text-3xl font-bold tracking-tight">This Week</h1>
      </header>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 mb-4">
            <div className="font-mono text-xs text-muted-foreground flex items-end pb-2">HABIT</div>
            {days.map((day) => (
              <div key={day.toString()} className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{format(day, "EEE")}</div>
                <div className={cn(
                  "text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto",
                  format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Habit Rows */}
          <div className="space-y-2">
            {habits.map((habit) => (
              <div key={habit.id} className="grid grid-cols-[150px_repeat(7,1fr)] gap-2 items-center p-3 rounded-lg bg-card/50 border border-border/50">
                <div className="font-medium truncate pr-2 text-sm">{habit.name}</div>
                {days.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const value = getHabitValue(habit.id, dateStr);
                  const isFuture = day > today;

                  return (
                    <div key={dateStr} className="flex justify-center">
                      {value > 0 ? (
                        <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                          <Check size={14} className="text-primary" strokeWidth={3} />
                        </div>
                      ) : (
                        <div className={cn("w-2 h-2 rounded-full", isFuture ? "bg-muted" : "bg-muted-foreground/30")} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
