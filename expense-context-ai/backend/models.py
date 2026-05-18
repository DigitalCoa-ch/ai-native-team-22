"""
Data models for ExpenseContext AI
Defines the core structures used across all agents
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ExpenseStatus(str, Enum):
    """Status of an expense report"""
    PENDING = "pending"
    FLAGGED = "flagged"
    APPROVED = "approved"
    REJECTED = "rejected"
    NEEDS_REVIEW = "needs_review"


class ExpenseCategory(str, Enum):
    """Expense categories"""
    MEALS = "meals"
    TRAVEL = "travel"
    ACCOMMODATION = "accommodation"
    TRANSPORTATION = "transportation"
    OFFICE_SUPPLIES = "office_supplies"
    ENTERTAINMENT = "entertainment"
    OTHER = "other"


class FlagReason(str, Enum):
    """Why an expense was flagged for review"""
    HIGH_AMOUNT = "high_amount"
    UNUSUAL_VENDOR = "unusual_vendor"
    MISSING_RECEIPT = "missing_receipt"
    POLICY_VIOLATION = "policy_violation"
    PATTERN_ANOMALY = "pattern_anomaly"
    WEEKEND_OR_HOLIDAY = "weekend_or_holiday"
    NO_CALENDAR_CONTEXT = "no_calendar_context"


class Expense(BaseModel):
    """Represents a single expense entry"""
    id: str
    employee_name: str
    employee_id: str
    amount: float
    currency: str = "EUR"
    date: str  # ISO format: YYYY-MM-DD
    category: ExpenseCategory
    description: str
    vendor: Optional[str] = None
    status: ExpenseStatus = ExpenseStatus.PENDING
    flag_reasons: List[FlagReason] = Field(default_factory=list)
    submitted_at: Optional[str] = None


class AgentFinding(BaseModel):
    """Base class for findings from any context agent"""
    agent_name: str
    finding_type: str
    relevance_score: float = Field(ge=0.0, le=1.0)
    summary: str
    details: dict = Field(default_factory=dict)
    confidence: float = Field(ge=0.0, le=1.0)
    sources: List[str] = Field(default_factory=list)


class InvestigationResult(BaseModel):
    """Final synthesized result from the synthesis agent"""
    expense_id: str
    explanation: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    suggested_action: str  # "approve", "reject", "needs_human_review"
    agent_findings: List[AgentFinding] = Field(default_factory=list)
    risk_level: str  # "low", "medium", "high"
    key_facts: List[str] = Field(default_factory=list)
    policy_references: List[str] = Field(default_factory=list)
    investigation_time_seconds: float = 0.0


class InvestigationRequest(BaseModel):
    """Request to start an investigation"""
    expense_id: str


class InvestigationResponse(BaseModel):
    """Response containing investigation status/results"""
    investigation_id: str
    status: str  # "pending", "investigating", "completed", "failed"
    expense: Optional[Expense] = None
    result: Optional[InvestigationResult] = None
    agent_progress: dict = Field(default_factory=dict)
