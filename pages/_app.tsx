import type { AppProps } from 'next/app';
import { ThemeProvider } from '../lib/ThemeContext';
import { ExpenseProvider } from '../lib/ExpenseContext';
import { EXPENSE_DATA } from '../lib/data';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ExpenseProvider initialExpenses={EXPENSE_DATA}>
        <Component {...pageProps} />
      </ExpenseProvider>
    </ThemeProvider>
  );
}