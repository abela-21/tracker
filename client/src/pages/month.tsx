import { useDB } from "@/lib/db";
import { format } from "date-fns";

export default function Month() {
  const { habits, getCompletionStats } = useDB();
  const currentMonth = format(new Date(), "yyyy-MM");
  const monthName = format(new Date(), "MMMM");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <p className="text-primary font-mono text-xs uppercase tracking-widest mb-2">Overview</p>
        <h1 className="text-3xl font-bold tracking-tight">{monthName} Stats</h1>
      </header>

      <div className="grid gap-4">
        {habits.map((habit) => {
          const percentage = getCompletionStats(habit.id, currentMonth);
          
          return (
            <div key={habit.id} className="p-5 rounded-xl bg-card border border-border">
              <div className="flex items-end justify-between mb-4">
                <h3 className="font-medium text-lg">{habit.name}</h3>
                <span className="text-3xl font-mono font-bold text-primary">{percentage}%</span>
              </div>
              
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Add habits to see monthly statistics.
          </div>
        )}
      </div>
    </div>
  );
}
