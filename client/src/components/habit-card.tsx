import { Minus, Plus, Check, Clock } from "lucide-react";
import { Habit, useDB } from "@/lib/db";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative rounded-2xl border p-5 transition-all duration-500 glass card-glow",
        isComplete ? "border-primary/40 bg-primary/10" : "hover:border-primary/20 hover:translate-y-[-2px]"
      )}
      data-testid={`card-habit-${habit.id}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-bold font-mono tracking-tighter uppercase",
              isComplete ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            )}>
              {habit.frequency}
            </span>
          </div>
          <h3 className={cn(
            "font-semibold text-xl tracking-tight transition-all", 
            isComplete ? "text-primary text-glow" : "text-foreground"
          )}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="opacity-50" />
              {habit.type}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {habit.type === "Boolean" && (
            <button
              onClick={() => update(value ? 0 : 1)}
              className={cn(
                "h-14 w-14 rounded-full flex items-center justify-center transition-all duration-500",
                isComplete 
                  ? "bg-primary text-primary-foreground shadow-[0_0_30px_-5px_hsl(var(--primary))]" 
                  : "bg-secondary text-muted-foreground hover:text-foreground active:scale-95"
              )}
            >
              <Check size={28} strokeWidth={3} className={cn("transition-transform duration-500", !isComplete && "scale-50 opacity-0")} />
              {!isComplete && <div className="w-2 h-2 rounded-full bg-current opacity-30" />}
            </button>
          )}

          {habit.type === "Count" && (
            <div className="flex items-center bg-secondary/50 rounded-xl p-1.5 border border-white/5">
              <button 
                onClick={() => update(Math.max(0, value - 1))} 
                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-90 transition-all"
              >
                <Minus size={18}/>
              </button>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={value}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -5, opacity: 0 }}
                  className="w-12 text-center font-mono text-xl font-bold"
                >
                  {value}
                </motion.span>
              </AnimatePresence>
              <button 
                onClick={() => update(value + 1)} 
                className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-white/5 active:scale-90 transition-all text-primary"
              >
                <Plus size={18}/>
              </button>
            </div>
          )}

          {habit.type === "Time" && (
            <div className="relative group/input">
              <input
                type="number"
                value={value || ""}
                onChange={(e) => update(parseInt(e.target.value) || 0)}
                placeholder="0"
                className="w-28 bg-secondary/50 rounded-xl px-4 py-3 text-right font-mono text-xl font-bold focus:ring-2 focus:ring-primary/20 outline-none border border-white/5 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase pointer-events-none group-focus-within/input:text-primary transition-colors">min</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
