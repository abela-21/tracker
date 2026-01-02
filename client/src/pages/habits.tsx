import { useDB, Habit } from "@/lib/db";
import { useForm } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Habits() {
  const { habits, addHabit, deleteHabit } = useDB();
  const [open, setOpen] = useState(false);
  
  const { register, handleSubmit, reset, setValue } = useForm<Omit<Habit, "id" | "created_at">>();

  const onSubmit = (data: any) => {
    addHabit(data);
    setOpen(false);
    reset();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-primary font-mono text-xs uppercase tracking-widest mb-2">Manage</p>
          <h1 className="text-3xl font-bold tracking-tight">My Habits</h1>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
              <Plus size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Habit</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Habit Name</Label>
                <Input id="name" {...register("name", { required: true })} placeholder="e.g. Meditate" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select onValueChange={(v) => setValue("frequency", v as any)} defaultValue="Daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select onValueChange={(v) => setValue("type", v as any)} defaultValue="Boolean">
                    <SelectTrigger>
                      <SelectValue placeholder="Tracking Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Boolean">Yes/No</SelectItem>
                      <SelectItem value="Count">Counter</SelectItem>
                      <SelectItem value="Time">Timer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full">Create Habit</Button>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border group">
            <div>
              <h3 className="font-medium">{habit.name}</h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {habit.frequency} • {habit.type}
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteHabit(habit.id)}
              className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        ))}
        
        {habits.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No habits yet. Tap + to add one.
          </div>
        )}
      </div>
    </div>
  );
}
