import { Minus, Plus, Check } from "lucide-react";
import { Habit, useDB } from "@/lib/db";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  date: string;
}

export function HabitCard({ habit, date }: HabitCardProps) {
  const { getHabitValue, logHabit } = useDB();
  const value = getHabitValue(habit.id, date);
  const isComplete = value > 0;

  const update = (val: number) => logHabit(habit.id, date, val);

  return (
    <div 
      className={cn(
        "group relative rounded-xl border p-5 transition-all",
        isComplete ? "border-primary/20 bg-primary/5" : "bg-card hover:bg-card/50"
      )}
      data-testid={`card-habit-${habit.id}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn("font-medium text-lg truncate", isComplete && "text-primary")}>
            {habit.name}
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {habit.frequency} • {habit.type}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {habit.type === "Boolean" && (
            <button
              onClick={() => update(value ? 0 : 1)}
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center transition-all",
                isComplete ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-secondary"
              )}
            >
              <Check size={24} strokeWidth={3} className={cn("transition-transform", !isComplete && "scale-50 opacity-0")} />
            </button>
          )}

          {habit.type === "Count" && (
            <div className="flex items-center bg-secondary rounded-lg p-1">
              <button onClick={() => update(Math.max(0, value - 1))} className="h-10 w-10 flex items-center justify-center"><Minus size={18}/></button>
              <span className="w-12 text-center font-mono text-lg font-bold">{value}</span>
              <button onClick={() => update(value + 1)} className="h-10 w-10 flex items-center justify-center"><Plus size={18}/></button>
            </div>
          )}

          {habit.type === "Time" && (
            <div className="relative">
              <input
                type="number"
                value={value || ""}
                onChange={(e) => update(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-24 bg-secondary rounded-lg px-3 py-2 text-right font-mono text-lg focus:ring-1 focus:ring-primary outline-none"
              />
              <span className="absolute right-9 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">min</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
