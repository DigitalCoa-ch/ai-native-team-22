"""
Intake Agent
First agent in the pipeline - validates and enriches expense data
"""

import asyncio
import re
from datetime import datetime
from backend.models import Expense, AgentFinding, FlagReason
from backend import data


class IntakeAgent:
    """
    The Intake Agent is responsible for:
    1. Validating expense data completeness
    2. Enriching with derived information (employee details, vendor lookup)
    3. Identifying which context agents should be consulted
    4. Initial risk scoring based on flag reasons
    """
    
    async def process(self, expense: Expense) -> AgentFinding:
        """
        Process a single expense through the intake pipeline.
        
        Args:
            expense: The expense to process
            
        Returns:
            AgentFinding with intake validation and enrichment results
        """
        # Simulate processing delay
        await asyncio.sleep(0.3)
        
        findings = []
        risk_factors = []
        
        # Get employee info
        employee_email = data.get_employee_email(expense.employee_name)
        employee_info = data.EMPLOYEES.get(employee_email, {})
        
        # Get vendor info
        vendor_info = data.check_vendor(expense.vendor or "")
        
        # Validate completeness
        if not expense.vendor:
            findings.append("Missing vendor information")
            risk_factors.append(0.2)
        
        if not expense.description:
            findings.append("Missing description")
            risk_factors.append(0.2)
        
        if len(expense.description or "") < 10:
            findings.append("Description too brief for meaningful review")
            risk_factors.append(0.15)
        
        # Check for client-related keywords
        client_keywords = ["client", "customer", "meeting", "dinner", "lunch", "presentation"]
        has_client_context = any(
            keyword in expense.description.lower() 
            for keyword in client_keywords
        )
        if has_client_context:
            findings.append("Description contains client-related keywords")
        
        # Vendor legitimacy check
        if vendor_info.get("flag"):
            findings.append(f"Vendor flagged: {vendor_info['flag']}")
            risk_factors.append(0.8)
        elif not vendor_info.get("legitimate"):
            findings.append("Unknown vendor - requires additional verification")
            risk_factors.append(0.3)
        
        # Weekend/holiday check
        expense_date = datetime.strptime(expense.date, "%Y-%m-%d")
        if expense_date.weekday() >= 5:  # Saturday=5, Sunday=6
            if FlagReason.WEEKEND_OR_HOLIDAY in expense.flag_reasons:
                findings.append("Expense submitted for weekend date")
                risk_factors.append(0.25)
        
        # Calculate initial risk score
        base_risk = sum(risk_factors) / max(len(risk_factors), 1) if risk_factors else 0.1
        
        # High amount check
        if expense.amount > 300:
            findings.append(f"High amount (€{expense.amount}) triggers additional scrutiny")
        
        # Build summary
        summary_parts = []
        if has_client_context:
            summary_parts.append("Potential client entertainment expense")
        if employee_info:
            summary_parts.append(f"Employee: {employee_info.get('role', 'Unknown role')} in {employee_info.get('department', 'Unknown dept')}")
        if vendor_info.get("legitimate"):
            summary_parts.append(f"Vendor verified: {vendor_info.get('type', 'business')}")
        
        summary = "; ".join(summary_parts) if summary_parts else "Standard expense, no immediate concerns"
        
        return AgentFinding(
            agent_name="IntakeAgent",
            finding_type="intake_validation",
            relevance_score=0.95,
            summary=summary,
            details={
                "employee_email": employee_email,
                "employee_info": employee_info,
                "vendor_info": vendor_info,
                "has_client_context": has_client_context,
                "validation_issues": findings,
                "initial_risk_score": base_risk
            },
            confidence=0.9,
            sources=["expense_data", "employee_database", "vendor_database"]
        )