"""
Synthesis Agent
Final agent that combines all findings and generates actionable recommendations
"""

import asyncio
from typing import List
from backend.models import Expense, AgentFinding, InvestigationResult, FlagReason


class SynthesisAgent:
    """
    Synthesis Agent - Combines findings from all other agents to generate
    a coherent investigation result with natural language explanation.
    
    AI-native value:
    - Integrates multiple heterogeneous data sources
    - Weighs evidence based on relevance and confidence
    - Generates human-readable explanations with citations
    - Produces calibrated confidence scores
    """
    
    async def synthesize(
        self, 
        expense: Expense, 
        intake_finding: AgentFinding,
        context_findings: List[AgentFinding]
    ) -> InvestigationResult:
        """
        Synthesize all agent findings into a final investigation result.
        
        Args:
            expense: The original expense being investigated
            intake_finding: Result from the intake agent
            context_findings: List of findings from context agents
            
        Returns:
            InvestigationResult with explanation, confidence, and recommendation
        """
        # Simulate synthesis processing
        await asyncio.sleep(0.5)
        
        all_findings = [intake_finding] + context_findings
        
        # Extract key data from findings
        client_meeting = intake_finding.details.get("has_client_context", False)
        vendor_flagged = intake_finding.details.get("vendor_info", {}).get("flag")
        
        calendar_events = []
        client_calendar_count = 0
        for f in context_findings:
            if f.agent_name == "CalendarAgent":
                calendar_events = f.details.get("events", [])
                client_calendar_count = f.details.get("client_meetings", 0)
        
        supporting_emails = 0
        for f in context_findings:
            if f.agent_name == "EmailAgent":
                supporting_emails = f.details.get("supporting_emails", 0)
        
        history_anomaly = None
        history_anomaly_score = 0
        for f in context_findings:
            if f.agent_name == "HistoryAgent":
                history_anomaly = f.details.get("pattern_anomaly")
                history_anomaly_score = f.details.get("anomaly_score", 0)
        
        policy_violations = []
        approvals_needed = []
        for f in context_findings:
            if f.agent_name == "PolicyAgent":
                policy_violations = f.details.get("violations", [])
                approvals_needed = f.details.get("approvals_needed", [])
        
        # Calculate overall confidence score
        confidence = self._calculate_confidence(
            all_findings=all_findings,
            client_meeting=client_meeting,
            calendar_events=calendar_events,
            supporting_emails=supporting_emails,
            history_anomaly=history_anomaly_score,
            policy_violations=policy_violations
        )
        
        # Determine risk level
        risk_level = self._calculate_risk_level(
            policy_violations=policy_violations,
            vendor_flagged=vendor_flagged,
            history_anomaly_score=history_anomaly_score,
            expense_amount=expense.amount
        )
        
        # Determine suggested action
        suggested_action = self._determine_action(
            risk_level=risk_level,
            confidence=confidence,
            policy_violations=policy_violations,
            vendor_flagged=vendor_flagged,
            client_meeting=client_meeting,
            client_calendar_count=client_calendar_count
        )
        
        # Generate key facts
        key_facts = self._generate_key_facts(
            expense=expense,
            client_meeting=client_meeting,
            calendar_events=calendar_events,
            client_calendar_count=client_calendar_count,
            supporting_emails=supporting_emails,
            history_anomaly=history_anomaly,
            policy_violations=policy_violations,
            approvals_needed=approvals_needed
        )
        
        # Generate explanation
        explanation = self._generate_explanation(
            expense=expense,
            key_facts=key_facts,
            confidence=confidence,
            risk_level=risk_level,
            suggested_action=suggested_action,
            client_meeting=client_meeting,
            calendar_events=calendar_events,
            supporting_emails=supporting_emails,
            history_anomaly=history_anomaly
        )
        
        # Get policy references
        policy_refs = []
        for f in context_findings:
            if f.agent_name == "PolicyAgent":
                if f.details.get("policy_notes"):
                    policy_refs.append(f.details["policy_notes"])
        
        return InvestigationResult(
            expense_id=expense.id,
            explanation=explanation,
            confidence_score=confidence,
            suggested_action=suggested_action,
            agent_findings=all_findings,
            risk_level=risk_level,
            key_facts=key_facts,
            policy_references=policy_refs
        )
    
    def _calculate_confidence(
        self,
        all_findings: List[AgentFinding],
        client_meeting: bool,
        calendar_events: List,
        supporting_emails: int,
        history_anomaly_score: float,
        policy_violations: List
    ) -> float:
        """Calculate overall confidence score based on evidence quality"""
        
        # Base confidence
        base_confidence = 0.5
        
        # Boost for supporting evidence
        if client_meeting and calendar_events:
            base_confidence += 0.25
        elif client_meeting:
            base_confidence += 0.15
        
        if supporting_emails > 0:
            base_confidence += 0.15
        
        # Reduce for anomalies and violations
        if policy_violations:
            base_confidence -= 0.3
        
        if history_anomaly_score > 0.7:
            base_confidence -= 0.2
        
        # Factor in individual agent confidences
        avg_agent_confidence = sum(f.confidence for f in all_findings) / len(all_findings)
        base_confidence = (base_confidence + avg_agent_confidence) / 2
        
        # Clamp to valid range
        return max(0.1, min(0.95, base_confidence))
    
    def _calculate_risk_level(
        self,
        policy_violations: List,
        vendor_flagged: str,
        history_anomaly_score: float,
        expense_amount: float
    ) -> str:
        """Determine overall risk level"""
        
        risk_score = 0
        
        # Policy violations
        if policy_violations:
            risk_score += 2
        
        # Vendor issues
        if vendor_flagged:
            risk_score += 3
        
        # Pattern anomalies
        if history_anomaly_score > 0.8:
            risk_score += 2
        elif history_anomaly_score > 0.5:
            risk_score += 1
        
        # High amounts
        if expense_amount > 500:
            risk_score += 1
        
        # Map risk score to level
        if risk_score >= 4:
            return "high"
        elif risk_score >= 2:
            return "medium"
        else:
            return "low"
    
    def _determine_action(
        self,
        risk_level: str,
        confidence: float,
        policy_violations: List,
        vendor_flagged: str,
        client_meeting: bool,
        client_calendar_count: int
    ) -> str:
        """Determine suggested action based on analysis"""
        
        # Hard rejection for prohibited vendors
        if vendor_flagged:
            return "reject"
        
        # Policy violations need human review
        if policy_violations:
            return "needs_human_review"
        
        # High risk, low confidence = needs human review
        if risk_level == "high" or confidence < 0.5:
            return "needs_human_review"
        
        # Medium risk = needs human review
        if risk_level == "medium":
            return "needs_human_review"
        
        # Good client context + low risk = approve
        if client_meeting and client_calendar_count > 0:
            return "approve"
        
        # Medium confidence with some concerns = needs review
        if confidence < 0.7:
            return "needs_human_review"
        
        # Default to approve with low risk
        return "approve"
    
    def _generate_key_facts(
        self,
        expense: Expense,
        client_meeting: bool,
        calendar_events: List,
        client_calendar_count: int,
        supporting_emails: int,
        history_anomaly: str,
        policy_violations: List,
        approvals_needed: List
    ) -> List[str]:
        """Extract and format key facts from investigation"""
        
        facts = []
        
        # Basic fact
        facts.append(f"€{expense.amount} {expense.category.value} expense on {expense.date}")
        
        # Client context
        if client_meeting:
            facts.append(f"Description mentions client engagement")
            if client_calendar_count > 0:
                facts.append(f"Calendar shows {client_calendar_count} client meeting(s) on this date")
        
        # Email support
        if supporting_emails > 0:
            facts.append(f"Found {supporting_emails} supporting email(s)")
        
        # History patterns
        if history_anomaly:
            facts.append(f"Pattern note: {history_anomaly}")
        
        # Policy issues
        for violation in policy_violations:
            facts.append(f"Policy violation: {violation}")
        
        for approval in approvals_needed:
            facts.append(f"Approval required: {approval}")
        
        if not facts:
            facts.append("No significant concerns identified")
        
        return facts
    
    def _generate_explanation(
        self,
        expense: Expense,
        key_facts: List[str],
        confidence: float,
        risk_level: str,
        suggested_action: str,
        client_meeting: bool,
        calendar_events: List,
        supporting_emails: int,
        history_anomaly: str
    ) -> str:
        """Generate natural language explanation"""
        
        # Build contextual explanation
        lines = []
        
        # Opening
        lines.append(f"This €{expense.amount} expense submitted by {expense.employee_name} on {expense.date} is being investigated.")
        
        # Context analysis
        if client_meeting and calendar_events:
            client_events = [e for e in calendar_events if e["type"] == "client"]
            if client_events:
                event_names = [e["event"] for e in client_events]
                lines.append(f"The expense date coincides with documented client activity: {', '.join(event_names)}. This establishes legitimate business purpose for the meal.")
        
        # Evidence quality
        if supporting_emails > 0:
            lines.append(f"Email records provide additional supporting documentation for the expense.")
        
        # History context
        if history_anomaly:
            lines.append(f"Historical analysis shows this is outside the employee's normal spending pattern ({history_anomaly}).")
        
        # Risk summary
        if risk_level == "low":
            lines.append(f"The investigation found no significant policy violations or red flags. The expense appears consistent with business justification.")
        elif risk_level == "medium":
            lines.append(f"Some factors warrant human review: the amount is elevated and pattern analysis shows deviation from typical behavior.")
        else:
            lines.append(f"This expense has multiple risk indicators including potential policy violations that require controller review.")
        
        # Confidence statement
        lines.append(f"\nInvestigation confidence: {confidence:.0%}. Suggested action: {suggested_action.replace('_', ' ')}.")
        
        return " ".join(lines)