import { useDB } from "@/lib/db";
import { HabitCard } from "@/components/habit-card";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Today() {
  const { habits } = useDB();
  const today = format(new Date(), "yyyy-MM-dd");
  const displayDay = format(new Date(), "EEEE");
  const displayDate = format(new Date(), "MMMM do");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="space-y-10 pb-8">
      <header className="relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-3 opacity-80">
            Current Session
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            {displayDay}
            <span className="block text-xl md:text-2xl font-medium text-muted-foreground tracking-tight mt-1">
              {displayDate}
            </span>
          </h1>
        </motion.div>
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4"
      >
        {habits.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-3xl border-dashed border-2 border-white/5"
          >
            <p className="text-muted-foreground font-medium italic">Your routine is a blank canvas.</p>
            <p className="text-xs text-muted-foreground/50 mt-2">Add your first habit to get started.</p>
          </motion.div>
        ) : (
          habits.map((habit) => (
            <HabitCard key={habit.id} habit={habit} date={today} />
          ))
        )}
      </motion.div>
    </div>
  );
}
