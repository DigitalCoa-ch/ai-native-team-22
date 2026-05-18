"""
Flask API for ExpenseContext AI
Provides endpoints for the expense investigation workflow
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import ValidationError

from backend.models import Expense, InvestigationRequest, ExpenseStatus
from backend.orchestrator import get_orchestrator
from backend import data

import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Store active investigations
investigations = {}


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "ExpenseContext AI",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    })


@app.route('/api/expenses', methods=['GET'])
def get_flagged_expenses():
    """Get all flagged expenses awaiting investigation"""
    expenses = data.FLAGGED_EXPENSES
    
    return jsonify({
        "count": len(expenses),
        "expenses": [
            {
                "id": e.id,
                "employee_name": e.employee_name,
                "amount": e.amount,
                "currency": e.currency,
                "date": e.date,
                "category": e.category.value,
                "description": e.description,
                "vendor": e.vendor,
                "status": e.status.value,
                "flag_reasons": [r.value for r in e.flag_reasons],
                "submitted_at": e.submitted_at
            }
            for e in expenses
        ]
    })


@app.route('/api/expenses/<expense_id>', methods=['GET'])
def get_expense(expense_id):
    """Get a specific expense by ID"""
    expense = data.get_expense_by_id(expense_id)
    
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    return jsonify({
        "id": expense.id,
        "employee_name": expense.employee_name,
        "employee_id": expense.employee_id,
        "amount": expense.amount,
        "currency": expense.currency,
        "date": expense.date,
        "category": expense.category.value,
        "description": expense.description,
        "vendor": expense.vendor,
        "status": expense.status.value,
        "flag_reasons": [r.value for r in expense.flag_reasons],
        "submitted_at": expense.submitted_at
    })


@app.route('/api/investigate', methods=['POST'])
def start_investigation():
    """
    Start an investigation for an expense.
    
    Request body:
    {
        "expense_id": "EXP-2026-0042"
    }
    
    Returns:
    {
        "investigation_id": "INV-xxx",
        "status": "investigating",
        "expense": {...}
    }
    """
    req_data = request.get_json()
    
    if not req_data or 'expense_id' not in req_data:
        return jsonify({"error": "expense_id is required"}), 400
    
    expense_id = req_data['expense_id']
    expense = data.get_expense_by_id(expense_id)
    
    if not expense:
        return jsonify({"error": f"Expense {expense_id} not found"}), 404
    
    # Create investigation record
    investigation_id = f"INV-{uuid.uuid4().hex[:8].upper()}"
    investigations[investigation_id] = {
        "id": investigation_id,
        "expense_id": expense_id,
        "status": "investigating",
        "started_at": datetime.utcnow().isoformat(),
        "expense": expense
    }
    
    # Run investigation synchronously for demo (in production, this would be async)
    import asyncio
    
    async def run_investigation():
        orchestrator = get_orchestrator()
        return await orchestrator.investigate(expense)
    
    # Create new event loop for async call
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(run_investigation())
    loop.close()
    
    # Store result
    investigations[investigation_id]["status"] = "completed"
    investigations[investigation_id]["completed_at"] = datetime.utcnow().isoformat()
    investigations[investigation_id]["result"] = result
    
    return jsonify({
        "investigation_id": investigation_id,
        "status": "completed",
        "expense_id": expense_id,
        "result": _serialize_investigation_result(result)
    })


@app.route('/api/investigations/<investigation_id>', methods=['GET'])
def get_investigation(investigation_id):
    """Get the status and results of an investigation"""
    
    if investigation_id not in investigations:
        return jsonify({"error": "Investigation not found"}), 404
    
    inv = investigations[investigation_id]
    
    return jsonify({
        "investigation_id": inv["id"],
        "status": inv["status"],
        "expense_id": inv["expense_id"],
        "started_at": inv.get("started_at"),
        "completed_at": inv.get("completed_at"),
        "result": _serialize_investigation_result(inv.get("result")) if inv.get("result") else None
    })


@app.route('/api/investigations', methods=['GET'])
def list_investigations():
    """List all investigations"""
    return jsonify({
        "count": len(investigations),
        "investigations": [
            {
                "id": inv["id"],
                "status": inv["status"],
                "expense_id": inv["expense_id"],
                "started_at": inv.get("started_at"),
                "completed_at": inv.get("completed_at")
            }
            for inv in investigations.values()
        ]
    })


def _serialize_investigation_result(result):
    """Serialize an InvestigationResult to JSON-compatible format"""
    if not result:
        return None
    
    return {
        "expense_id": result.expense_id,
        "explanation": result.explanation,
        "confidence_score": result.confidence_score,
        "suggested_action": result.suggested_action,
        "risk_level": result.risk_level,
        "key_facts": result.key_facts,
        "policy_references": result.policy_references,
        "investigation_time_seconds": result.investigation_time_seconds,
        "agent_findings": [
            {
                "agent_name": f.agent_name,
                "finding_type": f.finding_type,
                "relevance_score": f.relevance_score,
                "summary": f.summary,
                "details": f.details,
                "confidence": f.confidence,
                "sources": f.sources
            }
            for f in result.agent_findings
        ]
    }


@app.route('/api/approve/<expense_id>', methods=['POST'])
def approve_expense(expense_id):
    """Approve an expense"""
    expense = data.get_expense_by_id(expense_id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    # Update status (in real app, would persist to database)
    expense.status = ExpenseStatus.APPROVED
    
    return jsonify({
        "success": True,
        "expense_id": expense_id,
        "new_status": "approved"
    })


@app.route('/api/reject/<expense_id>', methods=['POST'])
def reject_expense(expense_id):
    """Reject an expense"""
    expense = data.get_expense_by_id(expense_id)
    if not expense:
        return jsonify({"error": "Expense not found"}), 404
    
    # Update status
    expense.status = ExpenseStatus.REJECTED
    
    return jsonify({
        "success": True,
        "expense_id": expense_id,
        "new_status": "rejected"
    })


if __name__ == '__main__':
    from config import API_HOST, API_PORT, DEBUG
    app.run(host=API_HOST, port=API_PORT, debug=DEBUG)