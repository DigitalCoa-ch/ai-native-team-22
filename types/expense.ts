export type ExpenseStatus = "pending" | "flagged" | "approved" | "rejected" | "needs_review";
export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";
export type SuggestedAction = "approve" | "reject" | "needs_human_review";
export type RiskLevel = "low" | "medium" | "high";

export interface ExpenseContext {
  calendar: string | null;
  email: string | null;
  history: string | null;
  policy: string | null;
}

export interface FlaggedExpense {
  id: number;
  amount: number;
  currency: string;
  date: string;
  category: string;
  employee: string;
  description: string;
  status: ExpenseStatus;
  context: ExpenseContext;
  confidence: ConfidenceLevel;
  suggestedAction: SuggestedAction;
  reasoningChain: string;
}

export interface AgentFinding {
  agent: string;
  findingType: string;
  summary: string;
  confidence: number;
  relevance: number;
}

export interface InvestigationResult {
  expenseId: number;
  explanation: string;
  confidenceScore: number;
  suggestedAction: SuggestedAction;
  riskLevel: RiskLevel;
  agentFindings: AgentFinding[];
  keyFacts: string[];
  investigationTimeSeconds: number;
}