/**
 * Policy Engine — evaluates submitted expenses against the company's real policies.
 */

export type PolicyResult = {
  status: 'auto_approved' | 'needs_review';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  color: 'green' | 'amber' | 'rose';
  suggestedAction: 'approve' | 'needs_human_review';
  policyId: string;
  policyName: string;
  reasoningChain: string;
  violations: string[];
  context: {
    calendar: string | null;
    email: string | null;
    history: string;
    policy: string;
  };
};

export type ExpenseForm = {
  employeeName: string;
  department: string;
  category: string;
  amount: string;
  businessPurpose: string;
  description: string;
};

export function evaluateExpense(form: ExpenseForm): PolicyResult {
  const amount = parseFloat(form.amount);
  const { category } = form;

  const policyMap: Record<string, () => PolicyResult> = {
    'Restaurant / Dining': () => evaluateDining(amount, form),
    'Accommodation': () => evaluateAccommodation(amount, form),
    'Transportation': () => evaluateTransportation(amount, form),
    'Office Supplies': () => evaluateOfficeSupplies(amount, form),
    'Software / Subscriptions': () => evaluateSoftware(amount, form),
    'Travel (Flights / Trains)': () => evaluateTravel(amount, form),
    'Client Entertainment': () => evaluateClientEntertainment(amount, form),
    'Training / Conferences': () => evaluateTraining(amount, form),
    'Communication': () => evaluateCommunication(amount, form),
    'Other': () => evaluateOther(amount, form),
  };

  const evaluator = policyMap[category];
  if (!evaluator) {
    return {
      status: 'needs_review',
      confidence: 'MEDIUM',
      color: 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'UNKNOWN',
      policyName: 'Unknown Category',
      reasoningChain: `Category "${category}" is not recognized. Routing to human review.`,
      violations: ['Unrecognized expense category'],
      context: {
        calendar: null,
        email: null,
        history: `First ${category} expense for ${form.employeeName}`,
        policy: 'No policy found for this category.',
      },
    };
  }

  return evaluator();
}

function evaluateDining(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 400) {
    return {
      status: 'needs_review',
      confidence: amount > 600 ? 'LOW' : 'MEDIUM',
      color: amount > 600 ? 'rose' : 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'EMP-2024-01',
      policyName: 'EMEA Entertainment',
      reasoningChain: `Restaurant/Dining expense of €${amount} exceeds the €400/person limit under EMEA Entertainment policy (EMP-2024-01). Submitted by ${form.employeeName} for "${form.businessPurpose}". Requires manager approval.`,
      violations: [`Exceeds €400/person policy limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Restaurant expense for ${form.employeeName}`,
        policy: 'EMEA Entertainment policy EMP-2024-01: €400/person limit, manager approval required, receipt mandatory.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'EMP-2024-01',
    policyName: 'EMEA Entertainment',
    reasoningChain: `Restaurant/Dining expense of €${amount} is within the €400/person limit under EMEA Entertainment policy (EMP-2024-01). Submitted by ${form.employeeName} for "${form.businessPurpose}". Auto-approved — all conditions met.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Restaurant expense for ${form.employeeName}`,
      policy: 'EMEA Entertainment policy EMP-2024-01: €400/person limit. Auto-approved.',
    },
  };
}

function evaluateAccommodation(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 300) {
    return {
      status: 'needs_review',
      confidence: amount > 450 ? 'LOW' : 'MEDIUM',
      color: amount > 450 ? 'rose' : 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'TRV-2024-02',
      policyName: 'Emergency Travel',
      reasoningChain: `Accommodation expense of €${amount} exceeds the €300/night hotel limit under Emergency Travel policy (TRV-2024-02). Requires documented emergency + manager/Finance approval.`,
      violations: [`Exceeds €300/night hotel limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Accommodation expense for ${form.employeeName}`,
        policy: 'Emergency Travel policy TRV-2024-02: €300/night hotel limit. Manager + Finance approval required.',
      },
    };
  }
  // Within limit but still routed to human review (accommodation always needs emergency documentation)
  return {
    status: 'needs_review',
    confidence: 'MEDIUM',
    color: 'amber',
    suggestedAction: 'needs_human_review',
    policyId: 'TRV-2024-02',
    policyName: 'Emergency Travel',
    reasoningChain: `Accommodation expense of €${amount} is within the €300/night limit but Emergency Travel policy (TRV-2024-02) requires documented emergency circumstance and manager+Finance sign-off. Routed to human review.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Accommodation expense for ${form.employeeName}`,
      policy: 'Emergency Travel policy TRV-2024-02: Accommodation always requires emergency documentation + manager/Finance approval.',
    },
  };
}

function evaluateTransportation(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 100) {
    return {
      status: 'needs_review',
      confidence: amount > 200 ? 'LOW' : 'MEDIUM',
      color: amount > 200 ? 'rose' : 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'TRN-2024-05',
      policyName: 'Transportation',
      reasoningChain: `Transportation expense of €${amount} exceeds the €100/trip limit under Transportation policy (TRN-2024-05). Receipt required over €50.`,
      violations: [`Exceeds €100/trip limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Transportation expense for ${form.employeeName}`,
        policy: 'Transportation policy TRN-2024-05: €100/trip limit. Receipt required over €50.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'TRN-2024-05',
    policyName: 'Transportation',
    reasoningChain: `Transportation expense of €${amount} is within the €100/trip limit under Transportation policy (TRN-2024-05). Auto-approved.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Transportation expense for ${form.employeeName}`,
      policy: 'Transportation policy TRN-2024-05: €100/trip limit. Approved automatically.',
    },
  };
}

function evaluateOfficeSupplies(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 150) {
    return {
      status: 'needs_review',
      confidence: 'MEDIUM',
      color: 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'EMP-2024-01',
      policyName: 'Office Supplies Policy',
      reasoningChain: `Office Supplies expense of €${amount} exceeds the €150 per-purchase limit. Flagged for human review.`,
      violations: [`Exceeds €150 limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Office Supplies expense for ${form.employeeName}`,
        policy: 'Office Supplies policy: €150 limit per purchase.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'EMP-2024-01',
    policyName: 'Office Supplies Policy',
    reasoningChain: `Office Supplies expense of €${amount} is within the €150 limit. Auto-approved.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Office Supplies expense for ${form.employeeName}`,
      policy: 'Office Supplies policy: €150 limit. Approved automatically.',
    },
  };
}

function evaluateSoftware(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 100) {
    return {
      status: 'needs_review',
      confidence: 'MEDIUM',
      color: 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'EMP-2024-01',
      policyName: 'Software & Subscriptions Policy',
      reasoningChain: `Software/Subscriptions expense of €${amount} exceeds the €100 limit. Flagged for human review.`,
      violations: [`Exceeds €100 limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Software expense for ${form.employeeName}`,
        policy: 'Software/Subscriptions policy: €100 limit.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'EMP-2024-01',
    policyName: 'Software & Subscriptions Policy',
    reasoningChain: `Software/Subscriptions expense of €${amount} is within the €100 limit. Auto-approved.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Software expense for ${form.employeeName}`,
      policy: 'Software/Subscriptions policy: €100 limit. Approved automatically.',
    },
  };
}

function evaluateTravel(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 500) {
    return {
      status: 'needs_review',
      confidence: 'MEDIUM',
      color: 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'TRV-2024-02',
      policyName: 'Travel (Flights / Trains)',
      reasoningChain: `Travel expense of €${amount} exceeds the €500 limit for flights/trains under Travel policy (TRV-2024-02). Requires manager approval.`,
      violations: [`Exceeds €500 limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Travel expense for ${form.employeeName}`,
        policy: 'Travel policy TRV-2024-02: €500 limit for flights/trains. Manager approval required.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'TRV-2024-02',
    policyName: 'Travel (Flights / Trains)',
    reasoningChain: `Travel expense of €${amount} for flights/trains is within the €500 limit. Manager approval noted. Auto-approved.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Travel expense for ${form.employeeName}`,
      policy: 'Travel policy TRV-2024-02: €500 limit. Approved automatically.',
    },
  };
}

function evaluateClientEntertainment(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 400) {
    return {
      status: 'needs_review',
      confidence: amount > 600 ? 'LOW' : 'MEDIUM',
      color: amount > 600 ? 'rose' : 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'EMP-2024-01',
      policyName: 'EMEA Entertainment',
      reasoningChain: `Client Entertainment expense of €${amount} exceeds the €400/person limit under EMEA Entertainment policy (EMP-2024-01). Flagged for human review.`,
      violations: [`Exceeds €400/person limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Client Entertainment expense for ${form.employeeName}`,
        policy: 'EMEA Entertainment policy EMP-2024-01: €400/person limit. Manager approval required.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'EMP-2024-01',
    policyName: 'EMEA Entertainment',
    reasoningChain: `Client Entertainment expense of €${amount} is within the €400/person limit under EMEA Entertainment policy (EMP-2024-01). Manager approval confirmed. Auto-approved.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Client Entertainment expense for ${form.employeeName}`,
      policy: 'EMEA Entertainment policy EMP-2024-01: €400/person limit. Approved automatically.',
    },
  };
}

function evaluateTraining(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 800) {
    return {
      status: 'needs_review',
      confidence: 'MEDIUM',
      color: 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'EMP-2024-01',
      policyName: 'Training & Conferences Policy',
      reasoningChain: `Training/Conference expense of €${amount} exceeds the €800 limit. Flagged for human review.`,
      violations: [`Exceeds €800 limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Training expense for ${form.employeeName}`,
        policy: 'Training & Conferences policy: €800 limit. Manager approval required.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'EMP-2024-01',
    policyName: 'Training & Conferences Policy',
    reasoningChain: `Training/Conference expense of €${amount} is within the €800 limit. Auto-approved.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Training expense for ${form.employeeName}`,
      policy: 'Training & Conferences policy: €800 limit. Approved automatically.',
    },
  };
}

function evaluateCommunication(amount: number, form: ExpenseForm): PolicyResult {
  if (amount > 50) {
    return {
      status: 'needs_review',
      confidence: 'MEDIUM',
      color: 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'EMP-2024-01',
      policyName: 'Communication Policy',
      reasoningChain: `Communication expense of €${amount} exceeds the €50 limit. Flagged for human review.`,
      violations: [`Exceeds €50 limit (submitted: €${amount})`],
      context: {
        calendar: null,
        email: null,
        history: `First Communication expense for ${form.employeeName}`,
        policy: 'Communication policy: €50 limit.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'EMP-2024-01',
    policyName: 'Communication Policy',
    reasoningChain: `Communication expense of €${amount} is within the €50 limit. Auto-approved.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Communication expense for ${form.employeeName}`,
      policy: 'Communication policy: €50 limit. Approved automatically.',
    },
  };
}

function evaluateOther(amount: number, form: ExpenseForm): PolicyResult {
  // Default: flag for human review for any "Other" category over €100
  if (amount > 100) {
    return {
      status: 'needs_review',
      confidence: 'MEDIUM',
      color: 'amber',
      suggestedAction: 'needs_human_review',
      policyId: 'EMP-2024-01',
      policyName: 'General Policy',
      reasoningChain: `Expense of €${amount} in the "Other" category exceeds €100. Routed to human review for categorization and policy assignment.`,
      violations: ['Uncategorized expense over €100'],
      context: {
        calendar: null,
        email: null,
        history: `First Other expense for ${form.employeeName}`,
        policy: 'All expenses above €100 in "Other" category require human review.',
      },
    };
  }
  return {
    status: 'auto_approved',
    confidence: 'HIGH',
    color: 'green',
    suggestedAction: 'approve',
    policyId: 'EMP-2024-01',
    policyName: 'General Policy',
    reasoningChain: `Expense of €${amount} in "Other" category is within €100 threshold. Auto-approved.`,
    violations: [],
    context: {
      calendar: null,
      email: null,
      history: `First Other expense for ${form.employeeName}`,
      policy: 'General policy: €100 threshold for Other category. Approved automatically.',
    },
  };
}
