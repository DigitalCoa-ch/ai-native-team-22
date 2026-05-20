import type { AppProps } from 'next/app';
import { ThemeProvider } from '../lib/ThemeContext';
import { ExpenseProvider } from '../lib/ExpenseContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <Component {...pageProps} />
      </ExpenseProvider>
    </ThemeProvider>
  );
}