import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useExpenses } from '../../lib/ExpenseContext';

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z" /></svg>,
    clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><polyline points="15 18 9 12 15 6" /></svg>,
    calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
    history: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  };
  return <>{icons[name] || null}</>;
}

function Sidebar() {
  const navItems = [
    { label: 'Overview', icon: 'grid', href: '/overview' },
    { label: 'Investigations', icon: 'search', href: '/investigations' },
    { label: 'Policy', icon: 'shield', href: '/policy' },
    { label: 'History', icon: 'clock', href: '/history' },
    { label: 'Settings', icon: 'settings', href: '/settings' },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 18, height: 18, color: '#a5b4fc' }}>
            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">ExpenseContext</span>
          <span className="sidebar-logo-subtitle">Compliance Studio</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Main</span>
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="nav-item">
            <NavIcon name={item.icon} />
            {item.label}
          </Link>
        ))}
                  <span className="sidebar-section-label">Employee</span>
            <Link href="/submit-expense" className="nav-item">
              <NavIcon name="plus" />
              Submit Expense
            </Link>
          </nav>
          <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar"><span>EC</span></div>
          <div className="user-info">
            <div className="user-name">Finance Controller</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Investigate() {
  const router = useRouter();
  const { id } = router.query;
  const { expenses } = useExpenses();
  const expense = expenses.find((e) => e.id === Number(id));

  if (!expense) {
    return (
      <div className="page-layout">
        <Sidebar />
        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Expense Not Found</h1>
          </div>
          <div className="empty-state">
            <p>No expense found with ID {id}</p>
            <Link href="/investigations" className="btn-investigate" style={{ display: 'inline-flex', marginTop: 16 }}>← Back to Investigations</Link>
          </div>
        </main>
      </div>
    );
  }

  const agents = [
    { name: 'Calendar Agent', icon: 'calendar', data: expense.context.calendar },
    { name: 'Email Agent', icon: 'mail', data: expense.context.email },
    { name: 'History Agent', icon: 'history', data: expense.context.history },
    { name: 'Policy Agent', icon: 'file', data: expense.context.policy },
  ];

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Link href="/investigations" className="back-link">
              <NavIcon name="back" /> Back to Investigations
            </Link>
            <h1 className="page-title" style={{ marginTop: 8 }}>Investigation</h1>
            <p className="page-subtitle">Expense #{expense.id.toString().padStart(4, '0')}</p>
          </div>
        </div>

        {/* Header Card */}
        <div className="inv-header">
          <div className="inv-header-left">
            <div className={`inv-risk-badge ${expense.color}`}>{expense.confidence} RISK</div>
            <h2 className="inv-employee">{expense.employee}</h2>
            <p className="inv-desc">{expense.description}</p>
          </div>
          <div className="inv-header-right">
            <div className="inv-amount">{expense.currency}{expense.amount}</div>
            <div className="inv-category">{expense.category}</div>
            <div className="inv-date">{expense.date}</div>
          </div>
        </div>

        {/* AI Reasoning */}
        <div className="reasoning-card">
          <div className="reasoning-header">
            <span className="reasoning-title">🤖 AI Reasoning Chain</span>
          </div>
          <p className="reasoning-text">{expense.reasoningChain}</p>
        </div>

        {/* Agent Findings */}
        <div className="agents-card">
          <h3 className="card-section-title">📋 Agent Findings</h3>
          <div className="agents-grid">
            {agents.map((agent) => (
              <div key={agent.name} className={`agent-card ${expense.color}`}>
                <div className="agent-header">
                  <NavIcon name={agent.icon} />
                  <span>{agent.name}</span>
                </div>
                <p className="agent-data">{agent.data || 'No relevant data found'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Time Saved */}
        <div className="time-card">
          <div className="time-inner">
            <span className="time-value">2.5s</span>
            <span className="time-label">Investigation completed</span>
            <span className="time-saving">≈ 18 min manual average · 15.5 min saved</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-card">
          <h3 className="card-section-title">✅ Controller Actions</h3>
          <div className="action-buttons">
            <button className="action-btn approve" onClick={() => alert('✅ Expense approved. Sent to accounting.')}>
              ✓ Approve
            </button>
            <button className="action-btn review" onClick={() => alert('👀 Marked for human review.')}>
              👀 Mark for Review
            </button>
            <button className="action-btn deny" onClick={() => alert('❌ Expense rejected. Sent back to employee.')}>
              ✗ Reject
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}