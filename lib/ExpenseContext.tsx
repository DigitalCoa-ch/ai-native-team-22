import React, { createContext, useContext } from 'react';
import { useExpenseStore, ExpenseEntry } from './store';

type StoreContextType = ReturnType<typeof useExpenseStore>;

const ExpenseContext = createContext<StoreContextType | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  return (
    <ExpenseContext.Provider value={useExpenseStore()}>
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