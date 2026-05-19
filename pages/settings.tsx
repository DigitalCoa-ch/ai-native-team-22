import React, { useState } from 'react';
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

export default function Settings() {
  const [autoApprove, setAutoApprove] = useState(true);
  const [fraudDetect, setFraudDetect] = useState(true);
  const [emailNotify, setEmailNotify] = useState(false);

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
            <Link key={item.label} href={item.href} className={`nav-item ${item.label === 'Settings' ? 'active' : ''}`}>
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
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">System configuration and preferences</p>
        </div>
        <div className="settings-sections">
          <div className="settings-section">
            <h3 className="settings-section-title">Automation</h3>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Auto-approve HIGH confidence</span>
                  <span className="setting-desc">Automatically approve expenses with 80%+ confidence score</span>
                </div>
                <button className={`toggle ${autoApprove ? 'on' : ''}`} onClick={() => setAutoApprove(!autoApprove)}>
                  <span className="toggle-thumb" />
                </button>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Fraud detection</span>
                  <span className="setting-desc">Enable duplicate receipt detection and anomaly flagging</span>
                </div>
                <button className={`toggle ${fraudDetect ? 'on' : ''}`} onClick={() => setFraudDetect(!fraudDetect)}>
                  <span className="toggle-thumb" />
                </button>
              </div>
            </div>
          </div>
          <div className="settings-section">
            <h3 className="settings-section-title">Notifications</h3>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Email digest</span>
                  <span className="setting-desc">Send daily summary of flagged expenses to finance team</span>
                </div>
                <button className={`toggle ${emailNotify ? 'on' : ''}`} onClick={() => setEmailNotify(!emailNotify)}>
                  <span className="toggle-thumb" />
                </button>
              </div>
            </div>
          </div>
          <div className="settings-section">
            <h3 className="settings-section-title">System</h3>
            <div className="settings-card">
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">Version</span>
                  <span className="setting-desc">ExpenseContext AI v1.0.0</span>
                </div>
                <span className="setting-value">1.0.0</span>
              </div>
              <div className="setting-row">
                <div className="setting-info">
                  <span className="setting-label">AI Model</span>
                  <span className="setting-desc">Multi-agent investigation pipeline</span>
                </div>
                <span className="setting-value">ExpenseContext-v1</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}