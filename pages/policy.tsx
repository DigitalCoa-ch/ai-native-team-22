import React from 'react';
import Link from 'next/link';

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

const POLICIES = [
  {
    id: 'EXT-2024-03',
    name: 'Contractor Entertainment',
    scope: 'EMEA Region',
    limit: '€200 / person',
    preApproval: 'VP required',
    lastUpdated: 'March 2024',
    status: 'Active',
    description: 'Entertainment expenses for contractors and vendors require VP-level pre-approval. Meals must document attendees, business purpose, and be within €200 per-person limit.',
    rules: ['Receipt required for all expenses', 'Pre-approval from VP or above', 'Contractor must be on approved vendor list', 'Business purpose must be documented'],
  },
  {
    id: 'EMP-2024-01',
    name: 'EMEA Entertainment',
    scope: 'All EMEA Employees',
    limit: '€400 / person',
    preApproval: 'Manager approval',
    lastUpdated: 'January 2024',
    status: 'Active',
    description: 'Client entertainment for EMEA-based employees. Meals and events must be within €400 per-person limit with manager approval. Receipt required for all amounts.',
    rules: ['Manager approval required', 'Receipt required for all amounts', 'Business purpose documented', 'Client name and attendees recorded'],
  },
  {
    id: 'TRV-2024-02',
    name: 'Emergency Travel',
    scope: 'Global',
    limit: '€300 / night',
    preApproval: 'Manager + Finance',
    lastUpdated: 'February 2024',
    status: 'Active',
    description: 'Emergency accommodation and travel expenses due to unforeseen circumstances (flight cancellations, weather, health). Requires manager and Finance Controller sign-off.',
    rules: ['Documented reason for emergency', 'Manager and Finance approval', 'Hotel limit: €300/night', 'Original booking reference required'],
  },
  {
    id: 'TRN-2024-05',
    name: 'Transportation',
    scope: 'Global',
    limit: '€100 / trip',
    preApproval: 'None',
    lastUpdated: 'January 2024',
    status: 'Active',
    description: 'Taxi, rideshare, and local transportation expenses. Receipt required for trips over €50. Duplicate submissions are strictly prohibited and flagged as potential fraud.',
    rules: ['Receipt required over €50', 'Duplicate submissions prohibited', 'Trip purpose must be noted', 'Fraud detection enabled'],
  },
];

export default function Policy() {
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
            <span className="sidebar-logo-title">ExpenseContext AI</span>
            <span className="sidebar-logo-subtitle">Compliance Studio</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Main</span>
          {[
            { label: 'Overview', icon: 'grid', href: '/overview' },
            { label: 'Investigations', icon: 'search', href: '/investigations' },
            { label: 'Policy', icon: 'shield', href: '/policy' },
            { label: 'History', icon: 'clock', href: '/history' },
            { label: 'Settings', icon: 'settings', href: '/settings' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`nav-item ${item.label === 'Policy' ? 'active' : ''}`}>
              <NavIcon name={item.icon} />
              {item.label}
            </Link>
          ))}
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
          <h1 className="page-title">Expense Policy</h1>
          <p className="page-subtitle">{POLICIES.length} active policies</p>
        </div>
        <div className="content-grid" style={{ padding: '0 32px 40px', maxWidth: 964, margin: '0 auto' }}>
          {POLICIES.map((policy) => (
            <div key={policy.id} className="policy-card">
              <div className="policy-card-header">
                <div>
                  <div className="policy-id">{policy.id}</div>
                  <h3 className="policy-name">{policy.name}</h3>
                  <div className="policy-meta">{policy.scope} · Last updated {policy.lastUpdated}</div>
                </div>
                <span className="policy-status">{policy.status}</span>
              </div>
              <p className="policy-desc">{policy.description}</p>
              <div className="policy-details">
                <div className="policy-detail">
                  <span className="policy-detail-label">Spending Limit</span>
                  <span className="policy-detail-value">{policy.limit}</span>
                </div>
                <div className="policy-detail">
                  <span className="policy-detail-label">Pre-Approval</span>
                  <span className="policy-detail-value">{policy.preApproval}</span>
                </div>
              </div>
              <div className="policy-rules">
                <span className="policy-rules-label">Rules</span>
                <ul className="policy-rules-list">
                  {policy.rules.map((rule) => (
                    <li key={rule}><span className="rule-dot" />{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}