import { flaggedExpenses } from "@/lib/data";
import ExpenseCard from "@/components/ExpenseCard";

export default function Dashboard() {
  const flagged = flaggedExpenses.filter((e) => e.status === "flagged");

  const stats = {
    total: flagged.length,
    high: flagged.filter((e) => e.confidence === "HIGH").length,
    medium: flagged.filter((e) => e.confidence === "MEDIUM").length,
    low: flagged.filter((e) => e.confidence === "LOW").length,
  };

  const autoApprove = flagged.filter((e) => e.suggestedAction === "approve");
  const needsReview = flagged.filter(
    (e) => e.suggestedAction === "needs_human_review"
  );
  const denied = flagged.filter((e) => e.suggestedAction === "reject");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                EC
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ExpenseContext AI
                </h1>
                <p className="text-sm text-gray-500">
                  Multi-Agent Expense Investigation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-700 font-medium">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Flagged Expenses
          </h2>
          <p className="text-gray-500 mt-2">
            {stats.total} expense{stats.total !== 1 ? "s" : ""} requiring
            investigation
          </p>
        </div>

        {/* Risk Level Summary Cards */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>📊</span> Risk Level Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500 font-medium">Total</span>
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-full bg-gray-100 rounded-full h-1.5">
                  <span className="block h-1.5 bg-blue-500 rounded-full w-full" />
                </span>
              </div>
            </div>
            <div className="bg-white rounded-xl border-l-4 border-l-green-500 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-green-600 font-semibold">
                  HIGH Risk
                </span>
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-4xl font-bold text-green-600">{stats.high}</p>
              <p className="text-xs text-green-600 mt-2 font-medium">
                Clear to process
              </p>
            </div>
            <div className="bg-white rounded-xl border-l-4 border-l-yellow-500 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-yellow-600 font-semibold">
                  MEDIUM Risk
                </span>
                <span className="text-2xl">👀</span>
              </div>
              <p className="text-4xl font-bold text-yellow-600">
                {stats.medium}
              </p>
              <p className="text-xs text-yellow-600 mt-2 font-medium">
                Review recommended
              </p>
            </div>
            <div className="bg-white rounded-xl border-l-4 border-l-red-500 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-red-600 font-semibold">
                  LOW Risk
                </span>
                <span className="text-2xl">⚠</span>
              </div>
              <p className="text-4xl font-bold text-red-600">{stats.low}</p>
              <p className="text-xs text-red-600 mt-2 font-medium">
                Priority investigation
              </p>
            </div>
          </div>
        </div>

        {/* Categorization Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span>🎯</span> Expense Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Auto Approved */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span className="font-bold text-emerald-800">Auto Approved</span>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                  {autoApprove.length}
                </span>
              </div>
              <p className="text-sm text-emerald-700 mb-3">
                High confidence, low risk. Ready for automatic processing.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-600">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span>{stats.high} high-risk items</span>
              </div>
            </div>

            {/* Requires Human Analysis */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  <span className="font-bold text-amber-800">
                    Requires Human Analysis
                  </span>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold">
                  {needsReview.length}
                </span>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                Medium risk or unclear. Needs human judgment before approval.
              </p>
              <div className="flex items-center gap-2 text-xs text-amber-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full" />
                <span>{stats.medium} medium-risk items</span>
              </div>
            </div>

            {/* Denied */}
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✗</span>
                  <span className="font-bold text-red-800">Denied</span>
                </div>
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                  {denied.length}
                </span>
              </div>
              <p className="text-sm text-red-700 mb-3">
                High risk or policy violation. Recommendation to reject.
              </p>
              <div className="flex items-center gap-2 text-xs text-red-600">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <span>{stats.low} low-risk items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>📋</span> Awaiting Investigation
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Click any card to start AI investigation
          </span>
        </div>

        {/* Expense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flagged.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </div>

        {flagged.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <span className="text-6xl mb-4 block">✅</span>
            <p className="text-gray-500 text-lg font-medium">
              All expenses have been reviewed!
            </p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <div className="flex items-center gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <p className="font-bold text-blue-900 text-lg">
                How AI-Native Investigation Works
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Instead of manually checking emails, calendars, and policies (15-20
                min), our multi-agent system analyzes all data sources in parallel
                and generates an audit-ready explanation in seconds. High-risk
                cases are automatically routed to human review.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}