"use client";

import { ConfidenceLevel, RiskLevel } from "@/types/expense";

interface ConfidenceMeterProps {
  level: ConfidenceLevel;
  score?: number;
  showLabel?: boolean;
}

export default function ConfidenceMeter({
  level,
  score,
  showLabel = true,
}: ConfidenceMeterProps) {
  const config = {
    HIGH: {
      label: "High",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      ringColor: "ring-green-500",
      percentage: 85,
      barColor: "bg-green-500",
    },
    MEDIUM: {
      label: "Medium",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      ringColor: "ring-yellow-500",
      percentage: 55,
      barColor: "bg-yellow-500",
    },
    LOW: {
      label: "Low",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      ringColor: "ring-red-500",
      percentage: 25,
      barColor: "bg-red-500",
    },
  };

  const { label, color, bgColor, borderColor, ringColor, percentage } =
    config[level];
  const displayScore = score ?? percentage;

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Confidence Score
        </span>
        {showLabel && (
          <span className={`text-sm font-bold ${color}`}>{label}</span>
        )}
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${config[level].barColor}`}
              style={{ width: `${displayScore}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-2xl font-bold ${color}`}>{displayScore}%</span>
          <span className="text-xs text-gray-500">AI Assessment</span>
        </div>
      </div>
    </div>
  );
}
