import { FlaggedExpense } from "@/types/expense";

export const flaggedExpenses: FlaggedExpense[] = [
  {
    id: 1,
    amount: 380,
    currency: "EUR",
    date: "2026-03-15",
    category: "Restaurant",
    employee: "Sarah Chen",
    description: "Client dinner - MegaCorp contract discussion at Le Bernardin",
    status: "flagged",
    context: {
      calendar: "Client meeting: MegaCorp GmbH, 6:30-9:00 PM at Le Bernardin",
      email: "Booking confirmation + client email thread (Feb 20-Mar 18)",
      history: "3 similar expenses in 6 months, avg €320, all approved",
      policy: "EMEA entertainment policy: €400 limit per person, receipt required",
    },
    confidence: "HIGH",
    suggestedAction: "approve",
    reasoningChain:
      "Expense aligns with documented client meeting (6:30 PM dinner following 2PM Q1 Pipeline Review). Amount €380 is within €400 policy limit. Employee has clean compliance history with 3 similar approved expenses. Booking confirmation and client email thread provide supporting documentation. Business purpose clearly established.",
  },
  {
    id: 2,
    amount: 520,
    currency: "EUR",
    date: "2026-03-22",
    category: "Accommodation",
    employee: "James Rodriguez",
    description: "Emergency hotel - Original flight cancelled due to weather",
    status: "flagged",
    context: {
      calendar: "No scheduled travel on this date (business trip ended March 20)",
      email: "Flight cancellation notice from airline (United Airlines, March 22, 8:47 AM)",
      history: "First emergency accommodation claim in 24 months of expense history",
      policy: "Emergency travel expenses allowed with manager approval. Hotel limit: €300/night",
    },
    confidence: "MEDIUM",
    suggestedAction: "needs_human_review",
    reasoningChain:
      "High-value expense (€520) exceeds policy limit (€300/night) but justified by emergency circumstance. Flight cancellation documented via airline email. However, calendar shows trip should have ended March 20 - two days before hotel stay. Missing manager approval on record. Unusual pattern warrants human review to verify if stay was legitimately work-related or if personal travel was extended.",
  },
  {
    id: 3,
    amount: 85,
    currency: "EUR",
    date: "2026-03-08",
    category: "Transportation",
    employee: "Maria Schmidt",
    description: "Airport taxi - Schiphol Airport to Amsterdam office",
    status: "flagged",
    context: {
      calendar: "Business trip: Client meetings in Amsterdam (March 6-8)",
      email: null,
      history: null,
      policy: "Receipt required for taxi expenses over €50. Duplicate submissions prohibited.",
    },
    confidence: "LOW",
    suggestedAction: "needs_human_review",
    reasoningChain:
      "CRITICAL: Duplicate submission detected. The same receipt image (.jpg hash: a7f3c9...) was submitted on Feb 28 (EXP-2026-0029, €85, approved) and again on March 8. Employee has no other taxi expenses on record. No supporting email documentation. Calendar confirms business trip but this is a potential fraud case. Recommend immediate investigation.",
  },
  {
    id: 4,
    amount: 290,
    currency: "EUR",
    date: "2026-03-18",
    category: "Restaurant",
    employee: "Alex Kumar",
    description: "Lunch meeting with vendor - TechFlow Inc partnership discussion",
    status: "flagged",
    context: {
      calendar: "Meeting: 'Vendor discussion' 12:00-1:30 PM (location not specified)",
      email: null,
      history: "Employee is contractor (not full-time ACME employee) - 6 months on record",
      policy: "Contractor entertainment requires VP pre-approval. Internal policy: EXT-2024-03",
    },
    confidence: "MEDIUM",
    suggestedAction: "needs_human_review",
    reasoningChain:
      "Expense requires policy clarification. Contractor status triggers different approval rules (VP pre-approval required per EXT-2024-03). Meeting location not specified in calendar. No email confirmation or attendee list. However, vendor meeting description suggests legitimate business purpose. Amount €290 is reasonable for client lunch. Recommend routing to VP for contractor entertainment approval verification.",
  },
];

export function getExpenseById(id: number): FlaggedExpense | undefined {
  return flaggedExpenses.find((e) => e.id === id);
}

export function getExpensesByStatus(
  status: FlaggedExpense["status"]
): FlaggedExpense[] {
  return flaggedExpenses.filter((e) => e.status === status);
}

export function getReviewQueue(): FlaggedExpense[] {
  return flaggedExpenses.filter(
    (e) =>
      e.suggestedAction === "needs_human_review" || e.confidence === "LOW"
  );
}