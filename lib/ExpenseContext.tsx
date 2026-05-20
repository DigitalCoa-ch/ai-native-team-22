import React, { createContext, useContext } from 'react';
import { useExpenseStore } from './store';
import { ExpenseEntry } from './types';

type ExpenseStore = ReturnType<typeof useExpenseStore>;

const ExpenseContext = createContext<ExpenseStore | null>(null);

interface ExpenseProviderProps {
  children: React.ReactNode;
  initialExpenses: ExpenseEntry[];
}

export function ExpenseProvider({ children, initialExpenses }: ExpenseProviderProps) {
  return (
    <ExpenseContext.Provider value={useExpenseStore(initialExpenses)}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used inside ExpenseProvider');
  return ctx;
}

export type { ExpenseEntry };