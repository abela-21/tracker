import { useState, useEffect, useCallback } from "react";

export type Frequency = "Daily" | "Weekly" | "Monthly";
export type HabitType = "Boolean" | "Count" | "Time";

export interface Habit {
  id: number;
  name: string;
  frequency: Frequency;
  type: HabitType;
  created_at: string;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  date: string;
  value: number;
}

const INITIAL_HABITS: Habit[] = [
  { id: 1, name: "Morning Reading", frequency: "Daily", type: "Time", created_at: "2024-01-01" },
  { id: 2, name: "Push-ups", frequency: "Daily", type: "Count", created_at: "2024-01-01" },
  { id: 3, name: "Journaling", frequency: "Daily", type: "Boolean", created_at: "2024-01-01" },
];

export function useDB() {
  const [habits, setHabits] = useState<Habit[]>(() => 
    JSON.parse(localStorage.getItem("habits") || JSON.stringify(INITIAL_HABITS))
  );

  const [logs, setLogs] = useState<HabitLog[]>(() => 
    JSON.parse(localStorage.getItem("habit_logs") || "[]")
  );

  useEffect(() => localStorage.setItem("habits", JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem("habit_logs", JSON.stringify(logs)), [logs]);

  const addHabit = (habit: Omit<Habit, "id" | "created_at">) => {
    setHabits(prev => [...prev, { ...habit, id: Date.now(), created_at: new Date().toISOString() }]);
  };

  const deleteHabit = (id: number) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(l => l.habit_id !== id));
  };

  const logHabit = useCallback((habitId: number, date: string, value: number) => {
    setLogs(prev => {
      const existingIdx = prev.findIndex(l => l.habit_id === habitId && l.date === date);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], value };
        return next;
      }
      return [...prev, { id: Date.now(), habit_id: habitId, date, value }];
    });
  }, []);

  const getHabitValue = useCallback((habitId: number, date: string) => 
    logs.find(l => l.habit_id === habitId && l.date === date)?.value || 0
  , [logs]);

  const getCompletionStats = (habitId: number, monthStr: string) => {
    const completions = logs.filter(l => l.habit_id === habitId && l.date.startsWith(monthStr) && l.value > 0).length;
    return Math.round((completions / 30) * 100);
  };

  return { habits, addHabit, deleteHabit, logHabit, getHabitValue, getCompletionStats };
}
