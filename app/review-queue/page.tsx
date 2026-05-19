import { flaggedExpenses } from "@/lib/data";
import Link from "next/link";
import { SuggestedAction } from "@/types/expense";

export default function ReviewQueuePage() {
  const needsReview = flaggedExpenses.filter(
    (e) => e.suggestedAction === "needs_human_review" || e.confidence === "LOW"
  );

  const actionColors: Record<SuggestedAction, string> = {
    approve: "bg-green-100 text-green-800",
    reject: "bg-red-100 text-red-800",
    needs_human_review: "bg-yellow-100 text-yellow-800",
  };

  const confidenceColors = {
    HIGH: "bg-green-100 text-green-800 border-green-200",
    MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
    LOW: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm hover:bg-blue-700 transition-colors"
              >
                EC
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ExpenseContext AI
                </h1>
                <p className="text-sm text-gray-500">Human Review Queue</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Review Queue</h2>
          <p className="text-gray-500 mt-1">
            {needsReview.length} case{needsReview.length !== 1 ? "s" : ""}{" "}
            requiring human attention
          </p>
        </div>

        {/* Queue Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-yellow-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Medium Confidence</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {needsReview.filter((e) => e.confidence === "MEDIUM").length}
                </p>
              </div>
              <span className="text-2xl">👀</span>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-red-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Confidence</p>
                <p className="text-2xl font-bold text-red-600">
                  {needsReview.filter((e) => e.confidence === "LOW").length}
                </p>
              </div>
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total in Queue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {needsReview.length}
                </p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        {needsReview.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <span className="text-6xl mb-4 block">✅</span>
            <p className="text-gray-500 text-lg">
              No cases requiring human review!
            </p>
            <Link
              href="/"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {needsReview.map((expense) => (
              <div
                key={expense.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${confidenceColors[expense.confidence]}`}
                      >
                        {expense.confidence}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {expense.employee}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          EXP-{expense.id.toString().padStart(4, "0")} •{" "}
                          {expense.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {expense.currency} {expense.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{expense.description}</p>
                  </div>

                  {/* Reasoning Preview */}
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span>🤖</span>
                      <h4 className="font-medium text-yellow-900">
                        AI Reasoning
                      </h4>
                    </div>
                    <p className="text-sm text-yellow-800">
                      {expense.reasoningChain.length > 200
                        ? expense.reasoningChain.substring(0, 200) + "..."
                        : expense.reasoningChain}
                    </p>
                  </div>

                  {/* Context Preview */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {expense.context.calendar && (
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="font-medium">📅 Calendar:</span>{" "}
                        <span className="text-gray-600">
                          {expense.context.calendar.substring(0, 40)}...
                        </span>
                      </div>
                    )}
                    {expense.context.email && (
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="font-medium">📧 Email:</span>{" "}
                        <span className="text-gray-600">
                          {expense.context.email.substring(0, 40)}...
                        </span>
                      </div>
                    )}
                    {expense.context.history && (
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="font-medium">📊 History:</span>{" "}
                        <span className="text-gray-600">
                          {expense.context.history.substring(0, 40)}...
                        </span>
                      </div>
                    )}
                    {expense.context.policy && (
                      <div className="p-2 bg-gray-50 rounded">
                        <span className="font-medium">📋 Policy:</span>{" "}
                        <span className="text-gray-600">
                          {expense.context.policy.substring(0, 40)}...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                  <Link
                    href={`/investigate/${expense.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Full Investigation
                  </Link>
                  <button className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}