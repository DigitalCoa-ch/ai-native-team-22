import React from 'react';
import Link from 'next/link';
import { useExpenses } from '../lib/ExpenseContext';

export default function Overview() {
  const { expenses } = useExpenses();
  const total = expenses.length;
  const high = expenses.filter((e) => e.confidence === 'HIGH').length;
  const medium = expenses.filter((e) => e.confidence === 'MEDIUM').length;
  const low = expenses.filter((e) => e.confidence === 'LOW').length;
  const approved = expenses.filter((e) => (e.status || 'pending') === 'approved').length;
  const review = expenses.filter((e) => (e.status || 'pending') === 'pending').length;
  const denied = expenses.filter((e) => (e.status || 'pending') === 'denied').length;

  const statsCards = [
    { label: 'Total Expenses', value: total, color: 'var(--color-text-muted)', bg: 'var(--bg-stat-box)' },
    { label: 'High Confidence', value: high, color: 'var(--color-summary-card-number-green)', bg: 'var(--bg-badge-green)' },
    { label: 'Medium Confidence', value: medium, color: 'var(--color-summary-card-number-amber)', bg: 'var(--bg-badge-amber)' },
    { label: 'Low Confidence', value: low, color: 'var(--color-summary-card-number-rose)', bg: 'var(--bg-badge-rose)' },
  ];

  const actionCards = [
    { label: 'Auto Approved', value: approved, sub: 'Policy-compliant · No action needed', color: 'var(--color-summary-card-number-green)', bg: 'var(--bg-badge-green)' },
    { label: 'Human Review', value: review, sub: 'Policy violations found', color: 'var(--color-summary-card-number-amber)', bg: 'var(--bg-badge-amber)' },
    { label: 'Denied', value: denied, sub: 'Rejected by controller', color: 'var(--color-summary-card-number-rose)', bg: 'var(--bg-badge-rose)' },
  ];

  return (
    <div className="page-layout">
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
          {[
            { label: 'Overview', icon: 'grid', href: '/' },
            { label: 'Investigations', icon: 'search', href: '/investigations' },
            { label: 'Policy', icon: 'shield', href: '/policy' },
            { label: 'History', icon: 'clock', href: '/history' },
            { label: 'Settings', icon: 'settings', href: '/settings' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`nav-item ${item.label === 'Overview' ? 'active' : ''}`}>
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
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">System health and investigation summary</p>
        </div>
        <div className="content-grid">
          <div className="card">
            <h3 className="card-title">Confidence Distribution</h3>
            <div className="stat-grid">
              {statsCards.map((s) => (
                <div key={s.label} className="stat-box">
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Action Required</h3>
            <div className="stat-grid">
              {actionCards.map((s) => (
                <div key={s.label} className="stat-box">
                  <span className="stat-label">{s.label}</span>
                  <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                  <span className="stat-sub">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card wide">
            <h3 className="card-title">Recent Activity</h3>
            <div className="activity-list">
              {expenses.slice(-7).reverse().map((e) => (
                <div key={e.id} className="activity-row">
                  <div className={`activity-dot ${e.color}`} />
                  <div className="activity-info">
                    <span className="activity-name">{e.employee}</span>
                    <span className="activity-desc">{e.description}</span>
                  </div>
                  <div className="activity-right">
                    <span className="activity-amount">{e.currency}{e.amount}</span>
                    <span className={`badge badge-${e.color}`}>{e.confidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z" /></svg>,
    clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
  };
  return <>{icons[name] || null}</>;
}