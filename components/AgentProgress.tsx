"use client";

import { useState, useEffect } from "react";

interface AgentProgressProps {
  onComplete?: () => void;
  contextData?: {
    calendar: string | null;
    email: string | null;
    history: string | null;
    policy: string | null;
  };
}

interface Agent {
  id: string;
  name: string;
  icon: string;
  status: "pending" | "running" | "complete";
  result?: string;
}

export default function AgentProgress({ onComplete, contextData }: AgentProgressProps) {
  const [agents, setAgents] = useState<Agent[]>([
    { id: "calendar", name: "Calendar Agent", icon: "📅", status: "pending" },
    { id: "email", name: "Email Agent", icon: "📧", status: "pending" },
    { id: "history", name: "History Agent", icon: "📊", status: "pending" },
    { id: "policy", name: "Policy Agent", icon: "📋", status: "pending" },
  ]);
  const [synthesis, setSynthesis] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    // Run agents in parallel (staggered start for visual effect)
    const agentOrder = ["calendar", "email", "history", "policy"];
    
    agentOrder.forEach((id, index) => {
      setTimeout(() => {
        setAgents((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "running" } : a))
        );
      }, index * 200);

      setTimeout(() => {
        const agent = agents.find((a) => a.id === id);
        const result = contextData
          ? contextData[id as keyof typeof contextData]
          : "Data retrieved";
        setAgents((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: "complete", result: result || "No data found" } : a
          )
        );
      }, index * 200 + 800);
    });

    // Synthesis phase
    setTimeout(() => {
      setSynthesis(true);
    }, 4 * 200 + 800);

    // Complete
    setTimeout(() => {
      setComplete(true);
      onComplete?.();
    }, 4 * 200 + 800 + 1000);
  }, []);

  const getStatusIcon = (status: Agent["status"]) => {
    switch (status) {
      case "pending":
        return <span className="w-6 h-6 rounded-full border-2 border-gray-300" />;
      case "running":
        return (
          <span className="w-6 h-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        );
      case "complete":
        return <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</span>;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          Multi-Agent Investigation
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Running parallel context analysis...
        </p>
      </div>

      <div className="p-4 space-y-3">
        {/* Context Agents */}
        <div className="grid grid-cols-2 gap-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                agent.status === "pending"
                  ? "bg-gray-50 border-gray-200"
                  : agent.status === "running"
                  ? "bg-blue-50 border-blue-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{agent.icon}</span>
                <span className="font-medium text-gray-900">{agent.name}</span>
                {getStatusIcon(agent.status)}
              </div>
              {agent.result && (
                <p className="text-xs text-gray-600 mt-2 p-2 bg-white rounded border">
                  {agent.result.length > 80
                    ? agent.result.substring(0, 80) + "..."
                    : agent.result}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Synthesis Agent */}
        <div
          className={`p-3 rounded-lg border transition-all duration-300 ${
            synthesis
              ? "bg-purple-50 border-purple-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🧠</span>
            <span className="font-medium text-gray-900">Synthesis Agent</span>
            {synthesis ? (
              complete ? (
                <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">✓</span>
              ) : (
                <span className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              )
            ) : (
              <span className="w-6 h-6 rounded-full border-2 border-gray-300" />
            )}
          </div>
          {complete && (
            <p className="text-xs text-gray-600 mt-2 p-2 bg-white rounded border">
              Analysis complete. Generating explanation...
            </p>
          )}
        </div>
      </div>

      {complete && (
        <div className="px-4 py-3 bg-green-50 border-t border-green-200">
          <p className="text-sm text-green-800 font-medium flex items-center gap-2">
            <span>⚡</span>
            Investigation completed in ~2.5 seconds
            <span className="text-green-600">(manual avg: 18 min)</span>
          </p>
        </div>
      )}
    </div>
  );
}
