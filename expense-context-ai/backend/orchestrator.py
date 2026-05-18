"""
Agent orchestration for ExpenseContext AI
Manages the multi-agent workflow and coordinates execution
"""

import asyncio
import json
import time
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any, Tuple

from backend.models import (
    Expense, AgentFinding, InvestigationResult, 
    FlagReason, ExpenseCategory
)
from backend import data
from backend.agents.intake import IntakeAgent
from backend.agents.context import (
    CalendarAgent, EmailAgent, HistoryAgent, PolicyAgent
)
from backend.agents.synthesis import SynthesisAgent

# Import config
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import DEMO_MODE, PARALLEL_EXECUTION, MAX_WORKERS


class InvestigationOrchestrator:
    """
    Main orchestrator that coordinates the multi-agent investigation workflow.
    
    Workflow:
    1. Intake Agent - Validates and enriches expense data
    2. Context Agents (parallel) - Gather external context
    3. Synthesis Agent - Combines findings into actionable result
    """
    
    def __init__(self):
        self.intake_agent = IntakeAgent()
        self.calendar_agent = CalendarAgent()
        self.email_agent = EmailAgent()
        self.history_agent = HistoryAgent()
        self.policy_agent = PolicyAgent()
        self.synthesis_agent = SynthesisAgent()
        self.executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)
        
    async def investigate(self, expense: Expense) -> InvestigationResult:
        """
        Execute the full investigation workflow for an expense.
        
        Args:
            expense: The expense to investigate
            
        Returns:
            InvestigationResult with synthesized findings and recommendations
        """
        start_time = time.time()
        
        # Step 1: Intake - Validate and enrich expense data
        print(f"[Orchestrator] Starting investigation for {expense.id}")
        intake_result = await self.intake_agent.process(expense)
        print(f"[Orchestrator] Intake complete: {intake_result.summary}")
        
        # Step 2: Gather context (parallel execution)
        print("[Orchestrator] Gathering context from parallel agents...")
        
        context_results = await self._gather_context_parallel(expense)
        
        # Log context agent results
        for agent_name, finding in context_results.items():
            print(f"[Orchestrator] {agent_name}: {finding.summary}")
        
        # Step 3: Synthesis - Combine all findings
        print("[Orchestrator] Running synthesis agent...")
        synthesis_result = await self.synthesis_agent.synthesize(
            expense=expense,
            intake_finding=intake_result,
            context_findings=list(context_results.values())
        )
        
        elapsed = time.time() - start_time
        synthesis_result.investigation_time_seconds = round(elapsed, 2)
        
        print(f"[Orchestrator] Investigation complete in {elapsed:.2f}s")
        return synthesis_result
    
    async def _gather_context_parallel(self, expense: Expense) -> Dict[str, AgentFinding]:
        """
        Execute all context gathering agents in parallel.
        
        Each agent independently queries its data source (calendar, email, history, policy)
        and returns findings. Parallel execution demonstrates AI-native workflow where
        multiple knowledge sources are consulted simultaneously.
        """
        if PARALLEL_EXECUTION:
            # Run agents in parallel using asyncio
            tasks = [
                self.calendar_agent.process(expense),
                self.email_agent.process(expense),
                self.history_agent.process(expense),
                self.policy_agent.process(expense)
            ]
            
            results = await asyncio.gather(*tasks)
            
            return {
                "CalendarAgent": results[0],
                "EmailAgent": results[1],
                "HistoryAgent": results[2],
                "PolicyAgent": results[3]
            }
        else:
            # Sequential execution for comparison/debugging
            results = {}
            for agent, name in [
                (self.calendar_agent, "CalendarAgent"),
                (self.email_agent, "EmailAgent"),
                (self.history_agent, "HistoryAgent"),
                (self.policy_agent, "PolicyAgent")
            ]:
                results[name] = await agent.process(expense)
            return results
    
    def generate_status_report(self, result: InvestigationResult) -> str:
        """Generate a human-readable status report from investigation results"""
        report_lines = [
            f"=== Investigation Report: {result.expense_id} ===",
            f"",
            f"Confidence Score: {result.confidence_score:.0%}",
            f"Risk Level: {result.risk_level.upper()}",
            f"Suggested Action: {result.suggested_action}",
            f"",
            f"=== Key Findings ===",
        ]
        
        for fact in result.key_facts:
            report_lines.append(f"  • {fact}")
        
        report_lines.extend([
            "",
            f"=== Explanation ===",
            result.explanation,
            "",
            f"=== Agent Findings ==="
        ])
        
        for finding in result.agent_findings:
            report_lines.append(f"[{finding.agent_name}] {finding.summary}")
        
        return "\n".join(report_lines)


# Singleton instance for the orchestrator
_orchestrator_instance = None

def get_orchestrator() -> InvestigationOrchestrator:
    """Get or create the singleton orchestrator instance"""
    global _orchestrator_instance
    if _orchestrator_instance is None:
        _orchestrator_instance = InvestigationOrchestrator()
    return _orchestrator_instance