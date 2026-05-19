import { notFound } from "next/navigation";
import Link from "next/link";
import { getExpenseById } from "@/lib/data";
import InvestigationView from "@/components/InvestigationView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InvestigatePage({ params }: PageProps) {
  const { id } = await params;
  const expense = getExpenseById(parseInt(id));

  if (!expense) {
    notFound();
  }

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
                <p className="text-sm text-gray-500">
                  Investigation • Expense #{expense.id}
                </p>
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
        <InvestigationView expense={expense} />
      </main>
    </div>
  );
}