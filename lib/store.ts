import { useState, useCallback } from 'react';
import { ExpenseEntry } from './types';

export type { ExpenseEntry };

export function useExpenseStore(initialExpenses: ExpenseEntry[] = []) {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>(initialExpenses);

  const addExpense = useCallback((entry: Omit<ExpenseEntry, 'id'>) => {
    setExpenses((prev) => {
      const nextId = prev.reduce((max, e) => Math.max(max, e.id), 12) + 1;
      const newEntry: ExpenseEntry = { ...entry, id: nextId };
      return [newEntry, ...prev];
    });
  }, []);

  const removeExpense = useCallback((id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateExpenseStatus = useCallback((id: number, status: 'approved' | 'denied') => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status } : e
      )
    );
  }, []);

  return { expenses, addExpense, removeExpense, updateExpenseStatus };
}