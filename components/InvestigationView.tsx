"use client";

import { useState, useEffect } from "react";
import { FlaggedExpense, AgentFinding } from "@/types/expense";
import ConfidenceMeter from "./ConfidenceMeter";
import ContextBreakdown from "./ContextBreakdown";
import ActionButtons from "./ActionButtons";
import AgentProgress from "./AgentProgress";

interface InvestigationViewProps {
  expense: FlaggedExpense;
  showInvestigationFlow?: boolean;
}

export default function InvestigationView({
  expense,
  showInvestigationFlow = true,
}: InvestigationViewProps) {
  const [investigating, setInvestigating] = useState(showInvestigationFlow);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (investigating) {
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [investigating]);

  const agentFindings: AgentFinding[] = [
    {
      agent: "IntakeAgent",
      findingType: "initial_validation",
      summary: expense.description,
      confidence: 0.92,
      relevance: 0.95,
    },
    {
      agent: "CalendarAgent",
      findingType: "calendar_context",
      summary: expense.context.calendar ?? "No calendar events found for this date",
      confidence: 0.88,
      relevance: expense.context.calendar ? 0.85 : 0.2,
    },
    {
      agent: "EmailAgent",
      findingType: "email_context",
      summary: expense.context.email ?? "No relevant emails found",
      confidence: 0.75,
      relevance: expense.context.email ? 0.8 : 0.1,
    },
    {
      agent: "HistoryAgent",
      findingType: "history_pattern",
      summary: expense.context.history ?? "No historical data available",
      confidence: 0.9,
      relevance: 0.7,
    },
    {
      agent: "PolicyAgent",
      findingType: "policy_check",
      summary: expense.context.policy ?? "No specific policy rules found",
      confidence: 0.95,
      relevance: 0.8,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Investigating Expense</p>
              <h2 className="text-xl font-bold text-gray-900">
                {expense.employee}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">
                {expense.currency} {expense.amount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">{expense.category}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Date:</span>{" "}
              <span className="font-medium">{expense.date}</span>
            </div>
            <div>
              <span className="text-gray-500">Employee:</span>{" "}
              <span className="font-medium">{expense.employee}</span>
            </div>
            <div>
              <span className="text-gray-500">Category:</span>{" "}
              <span className="font-medium">{expense.category}</span>
            </div>
            <div>
              <span className="text-gray-500">Expense ID:</span>{" "}
              <span className="font-medium">EXP-{expense.id.toString().padStart(4, "0")}</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Description</p>
            <p className="text-gray-900">{expense.description}</p>
          </div>
        </div>
      </div>

      {/* Multi-Agent Investigation Flow */}
      {investigating && !showResults && (
        <AgentProgress
          contextData={expense.context}
          onComplete={() => setShowResults(true)}
        />
      )}

      {/* Results */}
      {showResults && (
        <>
          {/* AI Reasoning */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span>🤖</span> AI Reasoning Chain
            </h3>
            <p className="text-blue-800 leading-relaxed">
              {expense.reasoningChain}
            </p>
          </div>

          {/* Confidence + Time Saved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConfidenceMeter level={expense.confidence} />
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">2.5s</p>
                <p className="text-sm text-gray-600 mt-1">
                  Investigation completed
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  vs. manual average: <span className="font-medium text-gray-700">18 minutes</span>
                </p>
                <p className="text-lg font-bold text-green-600 mt-3">
                  7 min 57 sec saved
                </p>
              </div>
            </div>
          </div>

          {/* Context Breakdown */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔍</span> Context Analysis
            </h3>
            <ContextBreakdown context={expense.context} />
          </div>

          {/* Agent Findings */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📋</span> Agent Findings Detail
            </h3>
            <div className="space-y-3">
              {agentFindings.map((finding, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {finding.agent}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {finding.findingType}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>
                        Confidence: {Math.round(finding.confidence * 100)}%
                      </span>
                      <span>
                        Relevance: {Math.round(finding.relevance * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{finding.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>✅</span> Controller Actions
            </h3>
            <ActionButtons
              currentAction={expense.suggestedAction}
              expenseId={expense.id}
              onApprove={(id) =>
                alert(`✅ Expense ${id} approved. Sent to accounting.`)
              }
              onReject={(id) =>
                alert(`❌ Expense ${id} rejected. Sent back to employee.`)
              }
              onReview={(id) =>
                alert(`👀 Expense ${id} marked for human review.`)
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
