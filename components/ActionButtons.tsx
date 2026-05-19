"use client";

import { SuggestedAction } from "@/types/expense";
import { useState } from "react";

interface ActionButtonsProps {
  currentAction: SuggestedAction;
  expenseId: number;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onReview?: (id: number) => void;
}

export default function ActionButtons({
  currentAction,
  expenseId,
  onApprove,
  onReject,
  onReview,
}: ActionButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setLoading(action);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    switch (action) {
      case "approve":
        onApprove?.(expenseId);
        break;
      case "reject":
        onReject?.(expenseId);
        break;
      case "review":
        onReview?.(expenseId);
        break;
    }

    setLoading(null);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleAction("approve")}
        disabled={loading !== null}
        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading === "approve" ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <span>✓</span>
        )}
        Approve
      </button>

      <button
        onClick={() => handleAction("review")}
        disabled={loading !== null}
        className="flex-1 bg-yellow-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading === "review" ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <span>👀</span>
        )}
        Mark for Review
      </button>

      <button
        onClick={() => handleAction("reject")}
        disabled={loading !== null}
        className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading === "reject" ? (
          <span className="animate-spin">⏳</span>
        ) : (
          <span>✗</span>
        )}
        Reject
      </button>
    </div>
  );
}