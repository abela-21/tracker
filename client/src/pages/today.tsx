import { useDB } from "@/lib/db";
import { HabitCard } from "@/components/habit-card";
import { format } from "date-fns";

export default function Today() {
  const { habits } = useDB();
  const today = format(new Date(), "yyyy-MM-dd");
  const displayDate = format(new Date(), "EEEE, MMMM do");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <p className="text-primary font-mono text-xs uppercase tracking-widest mb-2">Today's Focus</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{displayDate}</h1>
      </header>

      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground mb-4">No habits tracked yet.</p>
          </div>
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} date={today} />
          ))
        )}
      </div>
    </div>
  );
}
