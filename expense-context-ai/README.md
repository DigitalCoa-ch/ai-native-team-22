# ExpenseContext AI

An AI-native expense investigation prototype demonstrating multi-agent workflow automation for finance controllers.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    INTELLIGENCE LAYER                       │
│  ┌─────────────┐                                           │
│  │   Intake    │ → Validates expense data, enriches context │
│  │   Agent     │                                           │
│  └──────┬──────┘                                           │
│         │ parallel                                          │
│  ┌──────▼──────┐  ┌───────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Calendar   │  │   Email   │  │  History │  │  Policy │ │
│  │   Agent     │  │   Agent   │  │   Agent  │  │  Agent  │ │
│  └──────┬──────┘  └─────┬─────┘  └────┬─────┘  └────┬────┘ │
│         └──────────────┬┴─────────────┼──────────────┘       │
│                        │              │                       │
│                  ┌─────▼──────────────▼─────┐                │
│                  │    Synthesis Agent       │                │
│                  │ → Generates explanation │                │
│                  │ → Calculates confidence  │                │
│                  │ → Recommends action     │                │
│                  └────────────┬─────────────┘                │
└───────────────────────────────┼─────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Results Panel       │
                    │ • AI Explanation     │
                    │ • Confidence Score    │
                    │ • Agent Findings     │
                    │ • Suggested Action   │
                    └───────────────────────┘
```

## What is AI-Native About This?

Traditional expense review:
- Controller manually checks email, calendar, past expenses, policy docs
- Takes 15-20 minutes per flagged expense
- Sequential, repetitive, error-prone

**AI-Native approach:**
1. **Parallel context gathering** - Calendar, email, history, and policy agents all query their respective data sources *simultaneously*
2. **Intelligent synthesis** - The synthesis agent combines heterogeneous findings into a coherent explanation
3. **Adaptive confidence scoring** - Confidence is calculated based on evidence quality and agent agreement
4. **Natural language output** - Finance controllers get explanations, not just data dumps

## Tech Stack

- **Backend**: Python/Flask with async agent execution
- **Frontend**: Vanilla HTML/CSS/JS (no framework dependencies)
- **Agents**: Simulated with mock data for demonstration

## Running the Prototype

### 1. Start the Backend

```bash
cd expense-context-ai/backend
pip install flask flask-cors pydantic
python api.py
```

The API will start on `http://localhost:5000`

### 2. Open the Frontend

Open `frontend/index.html` in a browser.

### 3. Test the Workflow

1. Click **Investigate** on any flagged expense
2. Watch the parallel agent execution (simulated)
3. Review the AI-generated explanation
4. Approve, reject, or mark for human review

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/expenses` | List all flagged expenses |
| GET | `/api/expenses/<id>` | Get expense details |
| POST | `/api/investigate` | Run full investigation |
| POST | `/api/approve/<id>` | Approve expense |
| POST | `/api/reject/<id>` | Reject expense |

## Agent Specifications

### Intake Agent
Validates data completeness, enriches with employee/vendor info, identifies risk factors.

### Context Agents (Parallel)
- **CalendarAgent**: Checks for meetings on expense date
- **EmailAgent**: Searches for related communications
- **HistoryAgent**: Analyzes spending patterns
- **PolicyAgent**: Retrieves applicable policy rules

### Synthesis Agent
Combines all findings, generates natural language explanation, calculates confidence score and risk level, recommends action.

## Sample Investigation Output

```
This €380 expense submitted by Sarah Chen on 2026-03-15 is being investigated.

The expense date coincides with documented client activity: Q1 Pipeline Review 
with Acme Corp, Dinner with Acme Corp stakeholders. This establishes legitimate 
business purpose for the meal.

Calendar shows 2 client meeting(s) on this date. Email records provide additional 
supporting documentation for the expense.

Investigation confidence: 78%. Suggested action: approve.
```

## University Project Context

This prototype was developed for an AI Native Enterprise course to demonstrate:
- Multi-agent system design patterns
- AI-native workflow identification
- Practical demonstration of AI replacing manual cognitive labor

The focus is on **demonstrating the workflow logic clearly** rather than production polish.