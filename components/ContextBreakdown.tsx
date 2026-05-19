"use client";

import { ExpenseContext } from "@/types/expense";

interface ContextBreakdownProps {
  context: ExpenseContext;
}

const contextIcons: Record<keyof ExpenseContext, string> = {
  calendar: "📅",
  email: "📧",
  history: "📊",
  policy: "📋",
};

const contextLabels: Record<keyof ExpenseContext, string> = {
  calendar: "Calendar Agent",
  email: "Email Agent",
  history: "History Agent",
  policy: "Policy Agent",
};

export default function ContextBreakdown({ context }: ContextBreakdownProps) {
  const contexts = Object.entries(context) as [keyof ExpenseContext, string][];

  return (
    <div className="space-y-3">
      {contexts.map(([key, value]) => (
        <div
          key={key}
          className={`p-4 rounded-lg border ${
            value
              ? "bg-gray-50 border-gray-200"
              : "bg-gray-100 border-gray-300 opacity-60"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{contextIcons[key]}</span>
            <span className="font-medium text-gray-900">
              {contextLabels[key]}
            </span>
          </div>
          <p className={`text-sm ${value ? "text-gray-700" : "text-gray-500"}`}>
            {value || "No relevant data found"}
          </p>
        </div>
      ))}
    </div>
  );
}