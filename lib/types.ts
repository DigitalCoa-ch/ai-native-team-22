export type ExpenseEntry = {
  id: number;
  employee: string;
  amount: string;
  currency: string;
  date: string;
  category: string;
  description: string;
  confidence: string;
  confidenceScore: number;
  color: string;
  suggestedAction: string;
  reasoningChain: string;
  context: {
    calendar: string | null;
    email: string | null;
    history: string;
    policy: string;
  };
  isNew?: boolean;
  status?: string;
};
