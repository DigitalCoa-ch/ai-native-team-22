import { FlaggedExpense, ConfidenceLevel } from "@/types/expense";
import Link from "next/link";

interface RiskConfig {
  border: string;
  badge: string;
  badgeText: string;
  dot: string;
  headerBg: string;
  headerText: string;
  bg: string;
  meterColor: string;
}

const RISK_STYLES: Record<ConfidenceLevel, RiskConfig> = {
  HIGH: {
    border: "border-l-4 border-l-green-500",
    badge: "bg-green-100 text-green-800 border border-green-300",
    badgeText: "text-green-700",
    dot: "bg-green-500",
    headerBg: "bg-green-50",
    headerText: "text-green-800",
    bg: "hover:bg-green-50/50",
    meterColor: "bg-green-500",
  },
  MEDIUM: {
    border: "border-l-4 border-l-yellow-500",
    badge: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    badgeText: "text-yellow-700",
    dot: "bg-yellow-500",
    headerBg: "bg-yellow-50",
    headerText: "text-yellow-800",
    bg: "hover:bg-yellow-50/50",
    meterColor: "bg-yellow-500",
  },
  LOW: {
    border: "border-l-4 border-l-red-500",
    badge: "bg-red-100 text-red-800 border border-red-300",
    badgeText: "text-red-700",
    dot: "bg-red-500",
    headerBg: "bg-red-50",
    headerText: "text-red-800",
    bg: "hover:bg-red-50/50",
    meterColor: "bg-red-500",
  },
};

const CATEGORY_CONFIG = {
  approve: {
    label: "Auto Approved",
    badge: "bg-emerald-100 text-emerald-800 border border-emerald-300",
    icon: "✓",
  },
  needs_human_review: {
    label: "Requires Human Analysis",
    badge: "bg-amber-100 text-amber-800 border border-amber-300",
    icon: "👤",
  },
  reject: {
    label: "Denied",
    badge: "bg-red-100 text-red-800 border border-red-300",
    icon: "✗",
  },
};

function RiskMeter({ confidence }: { confidence: ConfidenceLevel }) {
  const levels = {
    HIGH: { width: "w-[85%]", label: "85%" },
    MEDIUM: { width: "w-[55%]", label: "55%" },
    LOW: { width: "w-[25%]", label: "25%" },
  };
  const config = RISK_STYLES[confidence];

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-500">Risk Score</span>
        <span className={`text-xs font-bold ${config.badgeText}`}>
          {levels[confidence].label}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${config.meterColor} ${levels[confidence].width}`}
        />
      </div>
    </div>
  );
}

export default function ExpenseCard({ expense }: { expense: FlaggedExpense }) {
  const style = RISK_STYLES[expense.confidence];
  const category = CATEGORY_CONFIG[expense.suggestedAction];

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 ${style.border} ${style.bg}`}
    >
      {/* Risk Banner - Always Visible */}
      <div className={`px-4 py-2 ${style.headerBg} border-b border-gray-100`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${style.headerText}`}>
              ⚠ {expense.confidence} RISK
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            <span className="text-xs text-gray-500">
              {expense.confidence === "HIGH"
                ? "Clear to process"
                : expense.confidence === "MEDIUM"
                ? "Review recommended"
                : "Priority investigation"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Employee & ID Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${style.dot}`} />
            <div>
              <p className="font-semibold text-gray-900">{expense.employee}</p>
              <p className="text-xs text-gray-400">ID: {expense.id}</p>
            </div>
          </div>
        </div>

        {/* Amount - Prominent */}
        <div className="mb-3">
          <p className="text-3xl font-bold text-gray-900">
            {expense.currency} {expense.amount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">{expense.category}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {expense.description}
        </p>

        {/* Category Badge - Large & Visible */}
        <div className="mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold ${category.badge}`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </span>
        </div>

        {/* Risk Meter */}
        <RiskMeter confidence={expense.confidence} />

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
          <span>📅 {expense.date}</span>
          <span
            className={`px-2 py-0.5 rounded font-medium ${
              expense.confidence === "HIGH"
                ? "bg-green-50 text-green-600"
                : expense.confidence === "MEDIUM"
                ? "bg-yellow-50 text-yellow-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {expense.confidence} confidence
          </span>
        </div>

        {/* Action */}
        <Link
          href={`/investigate/${expense.id}`}
          className="block w-full mt-4 bg-blue-600 text-white text-center py-2.5 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Investigate →
        </Link>
      </div>
    </div>
  );
}