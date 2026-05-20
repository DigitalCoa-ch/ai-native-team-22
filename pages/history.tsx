import React, { useState } from 'react';
import Link from 'next/link';
import { useExpenses } from '../lib/ExpenseContext';

export const dynamic = 'force-dynamic';

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V6l-8-4z" /></svg>,
    clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 17, height: 17 }}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><path d="M9 12l2 2 4-4" /></svg>,
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  };
  return <>{icons[name] || null}</>;
}

const HISTORY_DATA = [
  { id: 'EXP-2026-0001', employee: 'Sarah Chen', amount: '380', currency: '€', date: '2026-03-15', category: 'Restaurant', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '2.3s' },
  { id: 'EXP-2026-0002', employee: 'James Rodriguez', amount: '520', currency: '€', date: '2026-03-22', category: 'Accommodation', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0003', employee: 'Maria Schmidt', amount: '85', currency: '€', date: '2026-03-08', category: 'Transportation', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0004', employee: 'Alex Kumar', amount: '290', currency: '€', date: '2026-03-18', category: 'Restaurant', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0005', employee: 'Olivia Martin', amount: '247', currency: '€', date: '2026-04-02', category: 'Restaurant', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0006', employee: 'Daniel Weber', amount: '64', currency: '€', date: '2026-04-04', category: 'Transportation', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '1.5s' },
  { id: 'EXP-2026-0007', employee: 'Priya Nair', amount: '318', currency: '€', date: '2026-04-06', category: 'Accommodation', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0008', employee: 'Luca Rossi', amount: '142', currency: '€', date: '2026-04-09', category: 'Office Supplies', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '1.8s' },
  { id: 'EXP-2026-0009', employee: 'Hannah Fischer', amount: '412', currency: '€', date: '2026-04-11', category: 'Restaurant', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0010', employee: 'Miguel Santos', amount: '91', currency: '€', date: '2026-04-14', category: 'Transportation', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '1.4s' },
  { id: 'EXP-2026-0011', employee: 'Emma Laurent', amount: '285', currency: '€', date: '2026-04-16', category: 'Accommodation', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0012', employee: 'Tom Andersson', amount: '176', currency: '€', date: '2026-04-18', category: 'Restaurant', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '2.0s' },
  { id: 'EXP-2026-0013', employee: 'Yuki Tanaka', amount: '490', currency: '€', date: '2026-03-25', category: 'Training', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '2.1s' },
  { id: 'EXP-2026-0014', employee: 'Sophie Dubois', amount: '620', currency: '€', date: '2026-04-01', category: 'Restaurant', status: 'Rejected', decision: 'reject', decisionBy: 'AI Agent', decisionTime: '3.4s' },
  { id: 'EXP-2026-0015', employee: 'Ravi Krishnan', amount: '112', currency: '€', date: '2026-04-03', category: 'Transportation', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '1.6s' },
  { id: 'EXP-2026-0016', employee: 'Fatima Al-Rashid', amount: '385', currency: '€', date: '2026-04-10', category: 'Restaurant', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0017', employee: 'Ben Hartley', amount: '155', currency: '€', date: '2026-04-15', category: 'Restaurant', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '1.9s' },
  { id: 'EXP-2026-0018', employee: 'Aisha Nkosi', amount: '210', currency: '€', date: '2026-04-20', category: 'Transportation', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2026-0019', employee: 'Elena Popescu', amount: '95', currency: '€', date: '2026-04-23', category: 'Transportation', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '1.3s' },
  { id: 'EXP-2026-0020', employee: 'Diana Kowalski', amount: '440', currency: '€', date: '2026-04-25', category: 'Restaurant', status: 'Under Review', decision: 'review', decisionBy: 'Pending', decisionTime: '—' },
  { id: 'EXP-2025-0148', employee: 'Thomas Mueller', amount: '175', currency: '€', date: '2025-11-22', category: 'Transportation', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '1.8s' },
  { id: 'EXP-2025-0147', employee: 'Emma Watson', amount: '420', currency: '€', date: '2025-11-20', category: 'Restaurant', status: 'Rejected', decision: 'reject', decisionBy: 'AI Agent', decisionTime: '3.1s' },
  { id: 'EXP-2025-0145', employee: 'Carlos Silva', amount: '95', currency: '€', date: '2025-11-18', category: 'Office Supplies', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '2.1s' },
  { id: 'EXP-2025-0140', employee: 'Nina Patel', amount: '310', currency: '€', date: '2025-11-10', category: 'Accommodation', status: 'Approved', decision: 'approve', decisionBy: 'AI Agent', decisionTime: '1.9s' },
];

export default function History() {
  const { expenses } = useExpenses();
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Approved', 'Rejected', 'Under Review'];
  // Merge live expenses with static history (live first, then history)
  const merged = [
    ...expenses.map((e) => {
      const rawStatus = e.status || 'pending';
      return {
        id: `EXP-2026-${String(e.id).padStart(4, '0')}`,
        employee: e.employee,
        amount: e.amount,
        currency: e.currency,
        date: e.date,
        category: e.category,
        status: rawStatus === 'approved' ? 'Approved' : rawStatus === 'denied' ? 'Rejected' : 'Under Review',
        decision: rawStatus === 'approved' ? 'approve' : rawStatus === 'denied' ? 'reject' : 'review',
        decisionBy: e.isNew ? 'Pending' : 'AI Agent',
        decisionTime: e.isNew ? '—' : '2.3s',
      };
    }),
    ...HISTORY_DATA,
  ];
  const filterMap: Record<string, string> = {
    Approved: 'approved',
    Rejected: 'denied',
    'Under Review': 'pending',
  };
  const filtered = filter === 'All' ? merged : merged.filter((h) => {
    const rawStatus = (h.decision === 'approve' ? 'approved' : h.decision === 'reject' ? 'denied' : 'pending');
    return rawStatus === filterMap[filter];
  });

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
            { label: 'Overview', icon: 'grid', href: '/overview' },
            { label: 'Investigations', icon: 'search', href: '/investigations' },
            { label: 'Policy', icon: 'shield', href: '/policy' },
            { label: 'History', icon: 'clock', href: '/history' },
            { label: 'Settings', icon: 'settings', href: '/settings' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`nav-item ${item.label === 'History' ? 'active' : ''}`}>
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
          <h1 className="page-title">History</h1>
          <p className="page-subtitle">{merged.length} processed expenses</p>
        </div>
        <div style={{ padding: '0 32px', maxWidth: 964, margin: '0 auto' }}>
          <div className="filter-tabs">
            {filters.map((f) => (
              <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
          <div className="history-table">
            <div className="history-header">
              <span>Expense ID</span>
              <span>Employee</span>
              <span>Amount</span>
              <span>Date</span>
              <span>Category</span>
              <span>Status</span>
              <span>Decision By</span>
            </div>
            {filtered.map((row) => (
              <div key={row.id} className="history-row">
                <span className="history-id">{row.id}</span>
                <span className="history-employee">{row.employee}</span>
                <span className="history-amount">{row.currency}{row.amount}</span>
                <span className="history-date">{row.date}</span>
                <span className="history-cat">{row.category}</span>
                <span className={`badge badge-${row.decision}`}>{row.status}</span>
                <span className="history-decision">{row.decisionBy} · {row.decisionTime}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}