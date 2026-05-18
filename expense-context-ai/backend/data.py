"""
Simulation data for the ExpenseContext AI prototype
Provides realistic mock data for all agents to use
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional
from backend.models import Expense, ExpenseCategory, ExpenseStatus, FlagReason

# ============================================================================
# SAMPLE EMPLOYEES
# ============================================================================

EMPLOYEES = {
    "sarah.chen@acme.com": {
        "name": "Sarah Chen",
        "employee_id": "EMP001",
        "department": "Sales",
        "manager": "James Wilson",
        "role": "Account Executive"
    },
    "mike.rodriguez@acme.com": {
        "name": "Mike Rodriguez",
        "employee_id": "EMP002",
        "department": "Engineering",
        "manager": "Lisa Park",
        "role": "Senior Engineer"
    },
    "emma.johnson@acme.com": {
        "name": "Emma Johnson",
        "employee_id": "EMP003",
        "department": "Marketing",
        "manager": "David Kim",
        "role": "Marketing Manager"
    },
    "alex.thompson@acme.com": {
        "name": "Alex Thompson",
        "employee_id": "EMP004",
        "department": "Sales",
        "manager": "James Wilson",
        "role": "Sales Engineer"
    }
}

# ============================================================================
# SAMPLE CALENDAR DATA
# ============================================================================

CALENDAR_DATA = {
    "sarah.chen@acme.com": {
        "2026-03-15": [
            {"time": "09:00-10:00", "event": "Team Standup", "type": "internal"},
            {"time": "14:00-15:30", "event": "Q1 Pipeline Review with Acme Corp", "type": "client"},
            {"time": "18:00-20:00", "event": "Dinner with Acme Corp stakeholders", "type": "client"}
        ],
        "2026-03-18": [
            {"time": "10:00-12:00", "event": "Enterprise Deal Negotiation", "type": "internal"},
            {"time": "13:00-14:00", "event": "Lunch: Partner Meeting", "type": "external"}
        ],
        "2026-03-20": [
            {"time": "全天", "event": "Conference: TechSummit 2026", "type": "external"}
        ]
    },
    "mike.rodriguez@acme.com": {
        "2026-03-10": [
            {"time": "09:00-17:00", "event": "AWS re:Invent Conference", "type": "external"}
        ],
        "2026-03-22": [
            {"time": "14:00-16:00", "event": "Architecture Review", "type": "internal"}
        ]
    },
    "emma.johnson@acme.com": {
        "2026-03-05": [
            {"time": "10:00-11:00", "event": "Campaign Strategy Meeting", "type": "internal"},
            {"time": "19:00-21:00", "event": "Product Launch Dinner", "type": "client"}
        ],
        "2026-03-25": [
            {"time": "09:00-12:00", "event": "Brand Workshop", "type": "external"},
            {"time": "18:00-22:00", "event": "Annual Marketing Team Celebration", "type": "internal"}
        ]
    }
}

# ============================================================================
# SAMPLE EMAIL DATA
# ============================================================================

EMAIL_DATA = {
    "sarah.chen@acme.com": {
        "2026-03-15": [
            {"from": "john.acme@acmecorp.com", "subject": "Re: Dinner tonight - confirming 6pm at Le Bernardin", "snippet": "Perfect, we'll meet at 6pm. Looking forward to discussing the partnership details."},
            {"from": "james.wilson@acme.com", "subject": "Q1 targets update", "snippet": "Sarah, make sure we're on track for the Acme account by end of month..."},
        ],
        "2026-03-18": [
            {"from": "travel@expedia.com", "subject": "Hotel confirmation: Grand Hyatt NYC", "snippet": "Your reservation for March 18-20 is confirmed. Check-in from 3pm."},
        ]
    },
    "emma.johnson@acme.com": {
        "2026-03-05": [
            {"from": "pragency@mediagroup.com", "subject": "Product Launch Event - Final Details", "snippet": "Confirming the dinner venue and guest list for March 5th..."},
        ]
    }
}

# ============================================================================
# EXPENSE HISTORY PATTERNS
# ============================================================================

EXPENSE_HISTORY = {
    "EMP001": [  # Sarah Chen
        {"amount": 85, "category": "meals", "description": "Team lunch", "date": "2026-02-28"},
        {"amount": 45, "category": "transportation", "description": "Uber to office", "date": "2026-03-01"},
        {"amount": 120, "category": "meals", "description": "Client dinner - Zenith Corp", "date": "2026-03-08"},
        {"amount": 380, "category": "meals", "description": "Client dinner - Acme Corp", "date": "2026-03-15"},
        {"amount": 65, "category": "transportation", "description": "Taxi to airport", "date": "2026-03-18"},
    ],
    "EMP002": [  # Mike Rodriguez
        {"amount": 1200, "category": "travel", "description": "Flight to Las Vegas - AWS re:Invent", "date": "2026-03-08"},
        {"amount": 450, "category": "accommodation", "description": "Hotel - Las Vegas", "date": "2026-03-09"},
        {"amount": 85, "category": "meals", "description": "Conference meals", "date": "2026-03-10"},
    ],
    "EMP003": [  # Emma Johnson
        {"amount": 200, "category": "entertainment", "description": "Client event tickets", "date": "2026-02-20"},
        {"amount": 95, "category": "meals", "description": "Lunch with PR team", "date": "2026-03-03"},
        {"amount": 320, "category": "meals", "description": "Product launch dinner", "date": "2026-03-05"},
    ],
    "EMP004": [  # Alex Thompson
        {"amount": 250, "category": "travel", "description": "Train tickets - Client visit", "date": "2026-03-12"},
        {"amount": 180, "category": "meals", "description": "Client lunch - TechFlow Inc", "date": "2026-03-14"},
    ]
}

# ============================================================================
# POLICY RULES
# ============================================================================

POLICY_RULES = {
    "meals": {
        "daily_limit": 150,
        "requires_receipt": True,
        "requires_description": True,
        "allowed_without_prior_approval": True,
        "client_meeting_bonus": 100,
        "notes": "Standard meals capped at €150. Client dinners get +€100 allowance with 'client meeting' note."
    },
    "entertainment": {
        "daily_limit": 300,
        "requires_receipt": True,
        "requires_approval_over": 300,
        "allowed_without_prior_approval": True,
        "notes": "Entertainment capped at €300. Amounts over €300 require manager approval."
    },
    "travel": {
        "requires_pre_approval": True,
        "max_flight_class": "economy",
        "accommodation_limit": 200,
        "notes": "Travel requires pre-approval via travel request system. Flights economy only unless >6hr flight."
    }
}

# ============================================================================
# VENDOR DATABASE
# ============================================================================

KNOWN_VENDORS = {
    "Le Bernardin": {"type": "restaurant", "price_range": "high", "legitimate": True},
    "The Capital Grille": {"type": "restaurant", "price_range": "high", "legitimate": True},
    "Whole Foods": {"type": "grocery", "price_range": "medium", "legitimate": True},
    "Starbucks": {"type": "coffee", "price_range": "low", "legitimate": True},
    "Amazon": {"type": "retail", "price_range": "medium", "legitimate": True},
    "Expedia": {"type": "travel", "price_range": "medium", "legitimate": True},
    "Uber": {"type": "transportation", "price_range": "medium", "legitimate": True},
    "Shell Gas Station": {"type": "fuel", "price_range": "medium", "legitimate": True},
    "Casino Royale": {"type": "entertainment", "price_range": "high", "legitimate": False, "flag": "Prohibited vendor - gambling establishment"},
    "Luxury Watches Inc": {"type": "retail", "price_range": "very high", "legitimate": False, "flag": "Personal luxury item - not reimbursable"},
}

# ============================================================================
# FLAGGED EXPENSES FOR DEMO
# ============================================================================

FLAGGED_EXPENSES = [
    Expense(
        id="EXP-2026-0042",
        employee_name="Sarah Chen",
        employee_id="EMP001",
        amount=380,
        currency="EUR",
        date="2026-03-15",
        category=ExpenseCategory.MEALS,
        description="Client dinner - Acme Corp stakeholders",
        vendor="Le Bernardin",
        status=ExpenseStatus.FLAGGED,
        flag_reasons=[FlagReason.HIGH_AMOUNT, FlagReason.PATTERN_ANOMALY],
        submitted_at="2026-03-16T09:30:00Z"
    ),
    Expense(
        id="EXP-2026-0043",
        employee_name="Mike Rodriguez",
        employee_id="EMP002",
        amount=650,
        currency="EUR",
        date="2026-03-22",
        category=ExpenseCategory.ENTERTAINMENT,
        description="Team building event",
        vendor="Activity Hub",
        status=ExpenseStatus.FLAGGED,
        flag_reasons=[FlagReason.HIGH_AMOUNT, FlagReason.NO_CALENDAR_CONTEXT],
        submitted_at="2026-03-22T18:15:00Z"
    ),
    Expense(
        id="EXP-2026-0044",
        employee_name="Emma Johnson",
        employee_id="EMP003",
        amount=320,
        currency="EUR",
        date="2026-03-25",
        category=ExpenseCategory.MEALS,
        description="Product launch dinner",
        vendor="The Capital Grille",
        status=ExpenseStatus.FLAGGED,
        flag_reasons=[FlagReason.HIGH_AMOUNT, FlagReason.WEEKEND_OR_HOLIDAY],
        submitted_at="2026-03-26T10:00:00Z"
    ),
    Expense(
        id="EXP-2026-0045",
        employee_name="Alex Thompson",
        employee_id="EMP004",
        amount=890,
        currency="EUR",
        date="2026-03-28",
        category=ExpenseCategory.OTHER,
        description="Software license - annual subscription",
        vendor="TechVendor Pro",
        status=ExpenseStatus.FLAGGED,
        flag_reasons=[FlagReason.POLICY_VIOLATION, FlagReason.UNUSUAL_VENDOR],
        submitted_at="2026-03-28T14:20:00Z"
    ),
]

def get_expense_by_id(expense_id: str) -> Optional[Expense]:
    """Get an expense by its ID"""
    for expense in FLAGGED_EXPENSES:
        if expense.id == expense_id:
            return expense
    return None

def get_employee_email(employee_name: str) -> Optional[str]:
    """Map employee name to email"""
    for email, data in EMPLOYEES.items():
        if data["name"] == employee_name:
            return email
    return None

def get_calendar_for_date(employee_email: str, date: str) -> List[dict]:
    """Get calendar events for an employee on a specific date"""
    if employee_email in CALENDAR_DATA:
        return CALENDAR_DATA[employee_email].get(date, [])
    return []

def get_emails_for_date(employee_email: str, date: str) -> List[dict]:
    """Get email summaries for an employee on a specific date"""
    if employee_email in EMAIL_DATA:
        return EMAIL_DATA[employee_email].get(date, [])
    return []

def get_employee_history(employee_id: str) -> List[dict]:
    """Get expense history for an employee"""
    return EXPENSE_HISTORY.get(employee_id, [])

def get_policy_for_category(category: str) -> dict:
    """Get policy rules for an expense category"""
    return POLICY_RULES.get(category, {})

def check_vendor(vendor_name: str) -> dict:
    """Check if a vendor is known/legitimate"""
    return KNOWN_VENDORS.get(vendor_name, {"type": "unknown", "legitimate": None})