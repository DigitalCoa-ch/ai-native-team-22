import React, { useState } from 'react';
import Link from 'next/link';
import { useExpenses } from '../lib/ExpenseContext';

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z" /></svg>,
    clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
    plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><polyline points="20 6 9 17 4 12" /></svg>,
  };
  return <>{icons[name] || null}</>;
}

const CATEGORIES = [
  'Restaurant / Dining',
  'Accommodation',
  'Transportation',
  'Office Supplies',
  'Software / Subscriptions',
  'Travel (Flights / Trains)',
  'Client Entertainment',
  'Training / Conferences',
  'Communication',
  'Other',
];

const POLICY_LIMITS: Record<string, string> = {
  'Restaurant / Dining': '400',
  'Accommodation': '300',
  'Transportation': '100',
  'Office Supplies': '150',
  'Software / Subscriptions': '100',
  'Travel (Flights / Trains)': '500',
  'Client Entertainment': '400',
  'Training / Conferences': '800',
  'Communication': '50',
  'Other': '200',
};

export default function SubmitExpense() {
  const [submitted, setSubmitted] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [form, setForm] = useState({
    employeeName: '', employeeEmail: '', department: '',
    category: '', amount: '', currency: 'EUR',
    date: '', description: '', vendor: '',
    attendees: '', businessPurpose: '',
  });
  const { addExpense } = useExpenses();

  const currencySymbol = form.currency === 'EUR' ? '€' : form.currency === 'USD' ? '$' : '£';

  const validateAmount = () => {
    if (!form.category || !form.amount) { setAmountError(''); return; }
    const limit = parseFloat(POLICY_LIMITS[form.category]);
    if (parseFloat(form.amount) > limit) {
      setAmountError(`Exceeds ${currencySymbol}${limit} policy limit for this category`);
    } else { setAmountError(''); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountError) return;
    // Determine risk level based on amount vs policy limit
    const limit = parseFloat(POLICY_LIMITS[form.category] || '0');
    const amount = parseFloat(form.amount);
    const score = amount <= limit * 0.6 ? 85 : amount <= limit * 0.9 ? 55 : 25;
    const confidence: 'HIGH' | 'MEDIUM' | 'LOW' = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
    const color: 'green' | 'amber' | 'rose' = confidence === 'HIGH' ? 'green' : confidence === 'MEDIUM' ? 'amber' : 'rose';
    addExpense({
      employee: form.employeeName,
      amount: form.amount,
      currency: currencySymbol,
      date: form.date,
      category: form.category,
      description: form.description,
      confidence,
      confidenceScore: score,
      color,
      suggestedAction: confidence === 'HIGH' ? 'approve' : 'needs_human_review',
      reasoningChain: confidence === 'HIGH'
        ? `Amount ${currencySymbol}${form.amount} is within the ${currencySymbol}${limit} policy limit for ${form.category}. Submitted by ${form.employeeName}.`
        : confidence === 'MEDIUM'
        ? `Expense of ${currencySymbol}${form.amount} for ${form.category} requires human review. Amount is near or exceeds policy limit of ${currencySymbol}${limit}.`
        : `CRITICAL: Expense of ${currencySymbol}${form.amount} for ${form.category} significantly exceeds policy limit of ${currencySymbol}${limit}. Flagged for investigation.`,
      context: {
        calendar: null,
        email: null,
        history: `First expense for ${form.employeeName} in ${form.category} category`,
        policy: `${form.category} policy limit: ${currencySymbol}${limit}`,
      },
      isNew: true,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="page-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18, color: '#a5b4fc' }}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div className="sidebar-logo-text">
              <span className="sidebar-logo-title">ExpenseContext</span>
              <span className="sidebar-logo-subtitle">Compliance Studio</span>
            </div>
          </div>
          <nav className="sidebar-nav">
            <span className="sidebar-section-label">Main</span>
            {[{ label: 'Overview', icon: 'grid', href: '/overview' }, { label: 'Investigations', icon: 'search', href: '/investigations' }, { label: 'Policy', icon: 'shield', href: '/policy' }, { label: 'History', icon: 'clock', href: '/history' }, { label: 'Settings', icon: 'settings', href: '/settings' }].map((item) => (
              <Link key={item.label} href={item.href} className="nav-item"><NavIcon name={item.icon} />{item.label}</Link>
            ))}
            <span className="sidebar-section-label">Employee</span>
            <Link href="/submit-expense" className="nav-item active"><NavIcon name="plus" />Submit Expense</Link>
          </nav>
          <div className="sidebar-bottom"><div className="sidebar-user"><div className="user-avatar"><span>EC</span></div><div className="user-info"><div className="user-name">Finance Controller</div><div className="user-role">Administrator</div></div></div></div>
        </aside>
        <main className="main-content">
          <div className="page-header" />
          <div className="success-card">
            <div className="success-icon"><NavIcon name="check" /></div>
            <h2 className="success-title">Expense Submitted</h2>
            <p className="success-desc">Your claim for <strong>{currencySymbol}{form.amount}</strong> has been received and is pending review.</p>
            <p className="success-ref">Reference: EXP-2026-{String(Math.floor(Math.random() * 9000) + 1000)}</p>
            <div className="success-actions">
              <button className="btn-primary" onClick={() => { setSubmitted(false); setForm({ employeeName: '', employeeEmail: '', department: '', category: '', amount: '', currency: 'EUR', date: '', description: '', vendor: '', attendees: '', businessPurpose: '' }); }}>Submit Another</button>
              <Link href="/history" className="btn-secondary">View History</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18, color: '#a5b4fc' }}><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-title">ExpenseContext</span>
            <span className="sidebar-logo-subtitle">Compliance Studio</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Main</span>
          {[{ label: 'Overview', icon: 'grid', href: '/overview' }, { label: 'Investigations', icon: 'search', href: '/investigations' }, { label: 'Policy', icon: 'shield', href: '/policy' }, { label: 'History', icon: 'clock', href: '/history' }, { label: 'Settings', icon: 'settings', href: '/settings' }].map((item) => (
            <Link key={item.label} href={item.href} className="nav-item"><NavIcon name={item.icon} />{item.label}</Link>
          ))}
          <span className="sidebar-section-label">Employee</span>
          <Link href="/submit-expense" className="nav-item active"><NavIcon name="plus" />Submit Expense</Link>
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-user"><div className="user-avatar"><span>EC</span></div><div className="user-info"><div className="user-name">Finance Controller</div><div className="user-role">Administrator</div></div></div></div>
      </aside>
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Submit Expense</h1>
          <p className="page-subtitle">Request reimbursement for a business expense</p>
        </div>
        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-section">
            <h3 className="form-section-title">Employee Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Sarah Chen" value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Work Email</label>
                <input type="email" className="form-input" placeholder="s.chen@acme.com" value={form.employeeEmail} onChange={(e) => setForm({ ...form, employeeEmail: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required>
                  <option value="">Select department</option>
                  {['Engineering', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR'].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="form-section">
            <h3 className="form-section-title">Expense Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input" value={form.category} onChange={(e) => { setForm({ ...form, category: e.target.value }); setAmountError(''); }} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {form.category && (
                <div className="form-group">
                  <label className="form-label">Policy Limit</label>
                  <div className="policy-limit-badge">
                    <span className="policy-limit-value">{currencySymbol}{POLICY_LIMITS[form.category]}</span>
                    <span className="policy-limit-note">per limit</span>
                  </div>
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Date Incurred</label>
                <input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount</label>
                <div className="amount-input-wrapper">
                  <select className="currency-select" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                    <option>EUR</option><option>USD</option><option>GBP</option>
                  </select>
                  <input type="number" className={`form-input amount-input ${amountError ? 'input-error' : ''}`} placeholder="0.00" step="0.01" min="0" value={form.amount} onChange={(e) => { setForm({ ...form, amount: e.target.value }); validateAmount(); }} required />
                </div>
                {amountError && <span className="field-error">{amountError}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Vendor / Merchant</label>
                <input type="text" className="form-input" placeholder="Le Bernardin, Booking.com..." value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} required />
              </div>
            </div>
            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" placeholder="Describe the expense — who, what, why, and any relevant details..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
          </div>
          <div className="form-section">
            <h3 className="form-section-title">Business Context</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Number of Attendees</label>
                <input type="number" className="form-input" placeholder="1" min="1" value={form.attendees} onChange={(e) => setForm({ ...form, attendees: e.target.value })} />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Business Purpose</label>
                <input type="text" className="form-input" placeholder="Client meeting, conference, internal review..." value={form.businessPurpose} onChange={(e) => setForm({ ...form, businessPurpose: e.target.value })} required />
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={!!amountError}>
              Submit for Review
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
