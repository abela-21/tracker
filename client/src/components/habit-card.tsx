import { useState, useEffect, useRef } from "react";
import { Minus, Plus, Clock, Check } from "lucide-react";
import { Habit, useDB } from "@/lib/db";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HabitCardProps {
  habit: Habit;
  date: string;
}

export function HabitCard({ habit, date }: HabitCardProps) {
  const { getHabitValue, logHabit } = useDB();
  const [value, setValue] = useState(0);
  
  // Sync with DB
  useEffect(() => {
    setValue(getHabitValue(habit.id, date));
  }, [habit.id, date, getHabitValue]);

  const handleUpdate = (newValue: number) => {
    setValue(newValue);
    logHabit(habit.id, date, newValue);
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-200",
        value > 0 ? "border-primary/20 bg-primary/5" : "hover:border-primary/20 hover:bg-card/50"
      )}
      data-testid={`card-habit-${habit.id}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-lg tracking-tight transition-colors truncate",
            value > 0 ? "text-primary" : "text-card-foreground"
          )}>
            {habit.name}
          </h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {habit.frequency} • {habit.type}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {habit.type === "Boolean" && (
            <button
              onClick={() => handleUpdate(value ? 0 : 1)}
              className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300",
                value ? "bg-primary text-primary-foreground shadow-[0_0_20px_-5px_hsl(var(--primary))]" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <Check size={24} strokeWidth={3} className={cn("transition-transform duration-300", value ? "scale-100" : "scale-50 opacity-0")} />
            </button>
          )}

          {habit.type === "Count" && (
            <div className="flex items-center bg-secondary rounded-lg p-1">
              <button
                onClick={() => handleUpdate(Math.max(0, value - 1))}
                className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="w-12 text-center font-mono text-lg font-bold">
                {value}
              </span>
              <button
                onClick={() => handleUpdate(value + 1)}
                className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-background/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          )}

          {habit.type === "Time" && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="number"
                  value={value || ""}
                  onChange={(e) => handleUpdate(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-20 bg-secondary rounded-lg px-3 py-2 text-right font-mono text-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  min
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
