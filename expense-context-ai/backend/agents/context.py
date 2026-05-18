"""
Context Gathering Agents
Four parallel agents that gather external context for expense investigation
"""

import asyncio
from datetime import datetime
from backend.models import Expense, AgentFinding, FlagReason, ExpenseCategory
from backend import data


class CalendarAgent:
    """
    Calendar Agent - Checks for meetings/events on the expense date.
    
    AI-native value: Automatically correlates expense timing with 
    documented business activities to establish legitimate context.
    """
    
    async def process(self, expense: Expense) -> AgentFinding:
        """Check calendar for events on the expense date"""
        await asyncio.sleep(0.4)  # Simulate API call latency
        
        employee_email = data.get_employee_email(expense.employee_name)
        calendar_events = data.get_calendar_for_date(employee_email, expense.date)
        
        relevance_score = 0.5
        summary = "No calendar events found"
        details = {"events": [], "client_meetings": 0}
        
        if calendar_events:
            client_events = [e for e in calendar_events if e["type"] == "client"]
            internal_events = [e for e in calendar_events if e["type"] == "internal"]
            
            details["events"] = calendar_events
            details["client_meetings"] = len(client_events)
            
            if client_events:
                relevance_score = 0.9
                event_names = [e["event"] for e in client_events]
                summary = f"Found {len(client_events)} client meeting(s): {'; '.join(event_names)}"
            else:
                relevance_score = 0.4
                summary = f"Found {len(internal_events)} internal event(s), no client meetings"
        
        return AgentFinding(
            agent_name="CalendarAgent",
            finding_type="calendar_context",
            relevance_score=relevance_score,
            summary=summary,
            details=details,
            confidence=0.85,
            sources=["calendar_system"]
        )


class EmailAgent:
    """
    Email Agent - Searches for related email communications.
    
    AI-native value: NLP-powered search across email archives to find
    supporting documentation (confirmations, discussions, receipts).
    """
    
    async def process(self, expense: Expense) -> AgentFinding:
        """Search emails for related communications"""
        await asyncio.sleep(0.35)  # Simulate search latency
        
        employee_email = data.get_employee_email(expense.employee_name)
        emails = data.get_emails_for_date(employee_email, expense.date)
        
        relevance_score = 0.3
        summary = "No relevant emails found"
        details = {"emails": [], "supporting_emails": 0}
        
        # Check for vendor/expense related emails
        vendor_keywords = expense.vendor.lower().split() if expense.vendor else []
        description_words = expense.description.lower().split()[:5]
        
        for email in emails:
            email_text = f"{email['subject']} {email['snippet']}".lower()
            
            # Check for vendor mentions
            vendor_match = any(kw in email_text for kw in vendor_keywords) if vendor_keywords else False
            
            # Check for confirmation keywords
            confirmation_keywords = ["confirm", "reservation", "booking", "receipt", "invoice"]
            has_confirmation = any(kw in email_text for kw in confirmation_keywords)
            
            if vendor_match or has_confirmation:
                details["supporting_emails"] += 1
        
        if details["supporting_emails"] > 0:
            relevance_score = 0.8
            summary = f"Found {details['supporting_emails']} supporting email(s) for this expense"
        
        if emails and relevance_score < 0.5:
            relevance_score = 0.5
            summary = f"Found {len(emails)} email(s) on this date (may be related)"
        
        details["emails"] = [
            {"subject": e["subject"], "snippet": e["snippet"]} 
            for e in emails
        ]
        
        return AgentFinding(
            agent_name="EmailAgent",
            finding_type="email_context",
            relevance_score=relevance_score,
            summary=summary,
            details=details,
            confidence=0.75,
            sources=["email_system"]
        )


class HistoryAgent:
    """
    History Agent - Pulls employee's past spending patterns.
    
    AI-native value: Pattern recognition across expense history to detect
    anomalies, trends, and behavioral baselines for comparison.
    """
    
    async def process(self, expense: Expense) -> AgentFinding:
        """Analyze employee's expense history for patterns"""
        await asyncio.sleep(0.3)  # Simulate database query
        
        history = data.get_employee_history(expense.employee_id)
        
        details = {
            "history_count": len(history),
            "average_amount": 0,
            "max_amount": 0,
            "category_spending": {},
            "pattern_anomaly": None,
            "anomaly_score": 0
        }
        
        if not history:
            return AgentFinding(
                agent_name="HistoryAgent",
                finding_type="history_pattern",
                relevance_score=0.3,
                summary="No historical data available for this employee",
                details=details,
                confidence=0.5,
                sources=["expense_database"]
            )
        
        # Calculate statistics
        amounts = [h["amount"] for h in history]
        details["average_amount"] = round(sum(amounts) / len(amounts), 2)
        details["max_amount"] = max(amounts)
        
        # Category breakdown
        for item in history:
            cat = item["category"]
            details["category_spending"][cat] = details["category_spending"].get(cat, 0) + item["amount"]
        
        # Check for pattern anomaly
        current_amount = expense.amount
        avg_amount = details["average_amount"]
        
        if avg_amount > 0:
            ratio = current_amount / avg_amount
            if ratio > 3:
                details["pattern_anomaly"] = f"Amount is {ratio:.1f}x employee's average"
                details["anomaly_score"] = min(0.95, ratio / 4)
            elif current_amount > details["max_amount"]:
                details["pattern_anomaly"] = "New personal high for this employee"
                details["anomaly_score"] = 0.6
        
        # Check category consistency
        category_matches = [h for h in history if h["category"] == expense.category.value]
        if len(category_matches) > 0:
            cat_avg = sum(h["amount"] for h in category_matches) / len(category_matches)
            if current_amount > cat_avg * 1.5:
                details["pattern_anomaly"] = f"High for {expense.category.value} category (avg €{cat_avg:.0f})"
                details["anomaly_score"] = max(details["anomaly_score"], 0.7)
        
        # Determine relevance and summary
        if details["pattern_anomaly"]:
            relevance_score = 0.85
            summary = f"Pattern anomaly detected: {details['pattern_anomaly']}"
        else:
            relevance_score = 0.6
            summary = f"Expense within normal spending pattern (avg €{details['average_amount']:.0f})"
        
        return AgentFinding(
            agent_name="HistoryAgent",
            finding_type="history_pattern",
            relevance_score=relevance_score,
            summary=summary,
            details=details,
            confidence=0.9,
            sources=["expense_database"]
        )


class PolicyAgent:
    """
    Policy Agent - Retrieves relevant policy rules for the expense.
    
    AI-native value: Intelligent policy lookup that matches rules to
    expense context (category, amount, purpose) rather than requiring
    manual rule specification.
    """
    
    async def process(self, expense: Expense) -> AgentFinding:
        """Retrieve and apply policy rules for the expense"""
        await asyncio.sleep(0.25)  # Simulate policy lookup
        
        policy = data.get_policy_for_category(expense.category.value)
        
        details = {
            "policy_found": bool(policy),
            "limit": policy.get("daily_limit"),
            "requires_receipt": policy.get("requires_receipt", True),
            "requires_approval": policy.get("requires_approval_over"),
            "policy_notes": policy.get("notes", ""),
            "violations": [],
            "approvals_needed": []
        }
        
        # Check violations
        if policy:
            daily_limit = policy.get("daily_limit")
            if daily_limit and expense.amount > daily_limit:
                # Check if client meeting bonus applies
                client_keywords = ["client", "customer", "meeting"]
                has_client = any(kw in expense.description.lower() for kw in client_keywords)
                
                if has_client and expense.category.value == "meals":
                    adjusted_limit = daily_limit + policy.get("client_meeting_bonus", 100)
                    if expense.amount > adjusted_limit:
                        details["violations"].append(f"Exceeds client meal limit (€{adjusted_limit})")
                else:
                    details["violations"].append(f"Exceeds category limit (€{daily_limit})")
        
        # Check approval requirements
        approval_threshold = policy.get("requires_approval_over")
        if approval_threshold and expense.amount > approval_threshold:
            details["approvals_needed"].append(f"Amount over €{approval_threshold} requires approval")
        
        # Check for prohibited vendors
        vendor_info = data.check_vendor(expense.vendor or "")
        if vendor_info.get("flag"):
            details["violations"].append(vendor_info["flag"])
        
        # Calculate relevance
        if details["violations"] or details["approvals_needed"]:
            relevance_score = 0.95
            summary = f"Policy check found: {'; '.join(details['violations'] or details['approvals_needed'])}"
        elif policy:
            relevance_score = 0.7
            summary = f"Within policy limits for {expense.category.value} category"
        else:
            relevance_score = 0.4
            summary = "No specific policy rules found for this category"
        
        return AgentFinding(
            agent_name="PolicyAgent",
            finding_type="policy_check",
            relevance_score=relevance_score,
            summary=summary,
            details=details,
            confidence=0.95,
            sources=["policy_database"]
        )