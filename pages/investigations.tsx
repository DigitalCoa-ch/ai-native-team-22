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
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="9" /></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><polyline points="9 18 15 12 9 6" /></svg>,
    plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  };
  return <>{icons[name] || null}</>;
}

function Sidebar({ active }: { active: string }) {
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
          <Link key={item.label} href={item.href} className={`nav-item ${item.label === active ? 'active' : ''}`}>
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

export default function Investigations() {
  const [activeTab, setActiveTab] = useState('Human Review');
  const { expenses } = useExpenses();
  const stats = {
    total: expenses.length,
    approved: expenses.filter((e) => (e.status || 'pending') === 'approved').length,
    pending: expenses.filter((e) => (e.status || 'pending') === 'pending').length,
    denied: expenses.filter((e) => (e.status || 'pending') === 'denied').length,
  };

  const filteredExpenses = expenses.filter((e) => {
    const status = e.status || 'pending';
    if (activeTab === 'Auto-Approved') return status === 'approved';
    if (activeTab === 'Human Review') return status === 'pending';
    if (activeTab === 'Denied') return status === 'denied';
    return false;
  });

  return (
    <div className="page-layout">
      <Sidebar active="Investigations" />
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Flagged Expenses</h1>
          <p className="page-subtitle">{stats.total} expense{stats.total !== 1 ? 's' : ''} requiring investigation</p>
        </div>
        <div className="summary-cards">
          <div className="summary-card green">
            <div className="summary-card-header">
              <span className="summary-card-label">AUTO-APPROVED</span>
              <div className="summary-card-icon"><NavIcon name="check" /></div>
            </div>
            <div className="summary-card-number">{stats.approved}</div>
            <div className="summary-card-subtitle">Policy-compliant</div>
          </div>
          <div className="summary-card amber">
            <div className="summary-card-header">
              <span className="summary-card-label">HUMAN REVIEW</span>
              <div className="summary-card-icon"><NavIcon name="eye" /></div>
            </div>
            <div className="summary-card-number">{stats.pending}</div>
            <div className="summary-card-subtitle">Policy violations</div>
          </div>
          <div className="summary-card rose">
            <div className="summary-card-header">
              <span className="summary-card-label">DENIED</span>
              <div className="summary-card-icon"><NavIcon name="alert" /></div>
            </div>
            <div className="summary-card-number">{stats.denied}</div>
            <div className="summary-card-subtitle">Rejected</div>
          </div>
        </div>
        <div className="segmented-wrapper">
          <div className="segmented-control">
            {['Auto-Approved', 'Human Review', 'Denied'].map((tab) => (
              <button key={tab} className={`segmented-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
            ))}
          </div>
        </div>
        <div className="section-header">
          <h2 className="section-title">Pending Investigation</h2>
        </div>
        <div className="expense-cards">
          {filteredExpenses.length === 0 ? (
            <div className="empty-state">No expenses in this category</div>
          ) : (
            filteredExpenses.map((expense) => (
              <div key={expense.id} className={`expense-card ${expense.color}`}>
                <div className="expense-card-body">
                  <div className="expense-card-header">
                    <div className="expense-meta">
                      <span className="expense-employee">{expense.employee}</span>
                      <span className="expense-id">ID: {expense.id.toString().padStart(4, '0')}</span>
                    </div>
                    <div className="expense-amount">
                      {expense.currency}{expense.amount}<br />
                      <span>{expense.category}</span>
                    </div>
                  </div>
                  <p className="expense-description">{expense.description}</p>
                  <div className="expense-footer">
                    <div className="risk-section">
                      <span className="risk-label">Confidence {expense.confidenceScore}%</span>
                      <div className="risk-bar-bg">
                        <div className="risk-bar-fill" style={{ width: `${expense.confidenceScore}%` }} />
                      </div>
                    </div>
                    <Link href={`/investigate/${expense.id}`} className="btn-investigate">
                      Investigate <NavIcon name="chevron" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}