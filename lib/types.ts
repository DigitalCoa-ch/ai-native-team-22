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
