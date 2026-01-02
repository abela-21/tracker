import { useState, useEffect } from "react";
import { format } from "date-fns";

// Types
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
  date: string; // YYYY-MM-DD
  value: number; // 0/1 for boolean, count for others
}

// Mock Data
const INITIAL_HABITS: Habit[] = [
  { id: 1, name: "Morning Reading", frequency: "Daily", type: "Time", created_at: "2024-01-01" },
  { id: 2, name: "Push-ups", frequency: "Daily", type: "Count", created_at: "2024-01-01" },
  { id: 3, name: "Journaling", frequency: "Daily", type: "Boolean", created_at: "2024-01-01" },
];

// Simple storage hook
export function useDB() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem("habits");
    return stored ? JSON.parse(stored) : INITIAL_HABITS;
  });

  const [logs, setLogs] = useState<HabitLog[]>(() => {
    const stored = localStorage.getItem("habit_logs");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("habit_logs", JSON.stringify(logs));
  }, [logs]);

  const addHabit = (habit: Omit<Habit, "id" | "created_at">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabit = (id: number, updates: Partial<Habit>) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter((h) => h.id !== id));
    setLogs(logs.filter((l) => l.habit_id !== id));
  };

  const logHabit = (habitId: number, date: string, value: number) => {
    setLogs((prev) => {
      const existing = prev.find((l) => l.habit_id === habitId && l.date === date);
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, value } : l));
      }
      return [...prev, { id: Date.now(), habit_id: habitId, date, value }];
    });
  };

  const getHabitValue = (habitId: number, date: string) => {
    return logs.find((l) => l.habit_id === habitId && l.date === date)?.value || 0;
  };

  // Stats helpers
  const getCompletionStats = (habitId: number, monthStr: string) => {
    // monthStr format YYYY-MM
    const relevantLogs = logs.filter(
      (l) => l.habit_id === habitId && l.date.startsWith(monthStr) && l.value > 0
    );
    // Rough percentage based on days in month (simplification)
    const daysInMonth = 30; 
    return Math.round((relevantLogs.length / daysInMonth) * 100);
  };

  return {
    habits,
    logs,
    addHabit,
    updateHabit,
    deleteHabit,
    logHabit,
    getHabitValue,
    getCompletionStats
  };
}
