import { useState, useCallback } from 'react';

export type ExpenseEntry = {
  id: number;
  employee: string;
  amount: string;
  currency: string;
  date: string;
  category: string;
  description: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  color: 'green' | 'amber' | 'rose';
  suggestedAction: 'approve' | 'needs_human_review' | 'denied';
  reasoningChain: string;
  context: {
    calendar: string | null;
    email: string | null;
    history: string;
    policy: string;
  };
  isNew?: boolean;
  status?: 'pending' | 'approved' | 'denied';
};

let _nextId = 100;

function makeExpense(entry: Omit<ExpenseEntry, 'id'>): ExpenseEntry {
  return { status: 'pending', ...entry, id: _nextId++ };
}

export function useExpenseStore() {
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([
    makeExpense({
      employee: 'Sarah Chen',
      amount: '380',
      currency: '€',
      date: '2026-03-15',
      category: 'Restaurant',
      description: 'Client dinner — MegaCorp contract discussion at Le Bernardin',
      confidence: 'HIGH',
      confidenceScore: 85,
      color: 'green',
      suggestedAction: 'approve',
      reasoningChain:
        'Expense aligns with documented client meeting (6:30 PM dinner following 2PM Q1 Pipeline Review). Amount €380 is within €400 policy limit. Employee has clean compliance history with 3 similar approved expenses.',
      context: {
        calendar: 'Client meeting: MegaCorp GmbH, 6:30-9:00 PM at Le Bernardin',
        email: 'Booking confirmation + client email thread (Feb 20-Mar 18)',
        history: '3 similar expenses in 6 months, avg €320, all approved',
        policy: 'EMEA entertainment policy: €400 limit per person, receipt required',
      },
    }),
    makeExpense({
      employee: 'James Rodriguez',
      amount: '520',
      currency: '€',
      date: '2026-03-22',
      category: 'Accommodation',
      description: 'Emergency hotel — Original flight cancelled due to weather',
      confidence: 'MEDIUM',
      confidenceScore: 55,
      color: 'amber',
      suggestedAction: 'needs_human_review',
      reasoningChain:
        'High-value expense (€520) exceeds policy limit (€300/night) but justified by emergency circumstance. Flight cancellation documented via airline email. Missing manager approval on record. Unusual pattern warrants human review.',
      context: {
        calendar: 'No scheduled travel on this date (business trip ended March 20)',
        email: 'Flight cancellation notice from United Airlines (March 22, 8:47 AM)',
        history: 'First emergency accommodation claim in 24 months',
        policy: 'Emergency travel expenses allowed with manager approval. Hotel limit: €300/night',
      },
    }),
    makeExpense({
      employee: 'Maria Schmidt',
      amount: '85',
      currency: '€',
      date: '2026-03-08',
      category: 'Transportation',
      description: 'Airport taxi — Schiphol Airport to Amsterdam office',
      confidence: 'LOW',
      confidenceScore: 25,
      color: 'rose',
      suggestedAction: 'needs_human_review',
      reasoningChain:
        'CRITICAL: Duplicate submission detected. Same receipt image was submitted on Feb 28 (EXP-2026-0029, €85, approved) and again on March 8. No supporting email documentation. Potential fraud case.',
      context: {
        calendar: 'Business trip: Client meetings in Amsterdam (March 6-8)',
        email: null,
        history: 'Only taxi expense on record for this employee',
        policy: 'Receipt required for taxi expenses over €50. Duplicate submissions prohibited.',
      },
    }),
    makeExpense({
      employee: 'Alex Kumar',
      amount: '290',
      currency: '€',
      date: '2026-03-18',
      category: 'Restaurant',
      description: 'Lunch meeting with vendor — TechFlow Inc partnership discussion',
      confidence: 'MEDIUM',
      confidenceScore: 55,
      color: 'amber',
      suggestedAction: 'needs_human_review',
      reasoningChain:
        'Expense requires policy clarification. Contractor status triggers different approval rules (VP pre-approval required per EXT-2024-03). Amount €290 is reasonable. Recommend routing to VP.',
      context: {
        calendar: "Meeting: 'Vendor discussion' 12:00-1:30 PM",
        email: null,
        history: 'Employee is contractor (not full-time ACME employee) — 6 months on record',
        policy: 'Contractor entertainment requires VP pre-approval. Internal policy: EXT-2024-03',
      },
    }),
  ]);

  const addExpense = useCallback((entry: Omit<ExpenseEntry, 'id'>) => {
    setExpenses((prev) => [makeExpense(entry), ...prev]);
  }, []);

  const removeExpense = useCallback((id: number) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const updateExpenseStatus = useCallback((id: number, status: 'approved' | 'denied') => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status, suggestedAction: status === 'approved' ? 'approve' : 'denied' } : e
      )
    );
  }, []);

  return { expenses, addExpense, removeExpense, updateExpenseStatus };
}