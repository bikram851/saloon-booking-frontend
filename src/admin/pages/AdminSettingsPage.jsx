import React, { useState } from 'react';
import { Settings, Shield, DollarSign, Bell, Mail, Users, Key, Save, CheckCircle2, Lock, Smartphone } from 'lucide-react';

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState('Glow & Grace Luxury Marketplace');
  const [supportEmail, setSupportEmail] = useState('support@glowgrace.com');
  const [commissionRate, setCommissionRate] = useState(15);
  const [taxRate, setTaxRate] = useState(18);
  const [payoutSchedule, setPayoutSchedule] = useState('BIWEEKLY');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [twoFactorRequired, setTwoFactorRequired] = useState(true);
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [smsGateway, setSmsGateway] = useState('Gupshup SMS Enterprise');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState('general');

  // Admin users roster
  const [adminUsers, setAdminUsers] = useState([
    { id: 'ADM-01', name: 'Vikramaditya Rao', email: 'admin@glowgrace.com', role: 'Super Administrator', status: 'ACTIVE', lastLogin: 'Today, 10:45 AM' },
    { id: 'ADM-02', name: 'Priya Nair', email: 'priya.nair@glowgrace.com', role: 'Lead Salon Auditor', status: 'ACTIVE', lastLogin: 'Yesterday, 4:20 PM' },
    { id: 'ADM-03', name: 'Siddharth Sen', email: 'sid.sen@glowgrace.com', role: 'Finance & Payouts Lead', status: 'ACTIVE', lastLogin: 'Nov 11, 2026' }
  ]);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Enterprise Platform Settings</h1>
          <p className="admin-page-subtitle">Configure global commission rates, taxation models, administrative credentials and security policies</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={handleSave}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {savedSuccess && (
        <div style={{
          background: '#D1FAE5',
          border: '1px solid #10B981',
          color: '#065F46',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={20} color="#10B981" />
          Settings successfully saved and propagated to all marketplace microservices.
        </div>
      )}

      {/* Tabs */}
      <div className="admin-card" style={{ padding: '0.5rem 1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'general', label: 'Platform & Branding', icon: Settings },
            { id: 'financials', label: 'Commissions & Tax', icon: DollarSign },
            { id: 'admins', label: 'Admin Accounts & Roles', icon: Users },
            { id: 'security', label: 'Security & Access Control', icon: Shield },
            { id: 'integrations', label: 'Webhooks & Gateways', icon: Bell }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="admin-btn"
                style={{
                  background: active ? 'var(--admin-blue)' : 'transparent',
                  color: active ? '#FFFFFF' : 'var(--admin-text)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0.6rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: active ? 600 : 500
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Tab 1: General */}
        {activeTab === 'general' && (
          <div className="admin-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} color="var(--admin-blue)" /> Platform Identity & Brand Coordinates
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Platform Marketplace Name</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Executive Support Email</label>
                <input
                  type="email"
                  className="admin-form-input"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Default Operating Currency</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value="INR (₹) - Indian Rupee"
                  disabled
                  style={{ background: 'var(--admin-bg)', cursor: 'not-allowed' }}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Primary Operational Timezone</label>
                <select className="admin-form-select" defaultValue="IST">
                  <option value="IST">Asia/Kolkata (IST - UTC+05:30)</option>
                  <option value="UTC">Coordinated Universal Time (UTC)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Financials */}
        {activeTab === 'financials' && (
          <div className="admin-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={20} color="var(--admin-blue)" /> Commission Structure & Partner Settlement Rules
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Marketplace Platform Commission (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="admin-form-input"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>Automatically deducted from each booked appointment at checkout.</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">GST / Statutory Services Tax (%)</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  className="admin-form-input"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>Applicable HSN code 999721 (Beauty treatment & hairdressing services).</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Automated Partner Payout Cadence</label>
                <select className="admin-form-select" value={payoutSchedule} onChange={(e) => setPayoutSchedule(e.target.value)}>
                  <option value="WEEKLY">Weekly (Every Monday 09:00 AM IST)</option>
                  <option value="BIWEEKLY">Bi-weekly (1st & 16th of each month)</option>
                  <option value="MONTHLY">Monthly (1st business day of month)</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Minimum Payout Threshold</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value="₹ 2,000.00"
                  readOnly
                  style={{ background: 'var(--admin-bg)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Admins */}
        {activeTab === 'admins' && (
          <div className="admin-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="var(--admin-blue)" /> Administrative Team & RBAC Credentials
              </h3>
              <button type="button" className="admin-btn admin-btn-secondary" onClick={() => alert('Invite administrator dialog triggered.')}>
                + Invite Administrator
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Administrator</th>
                    <th>Email</th>
                    <th>Assigned Role</th>
                    <th>Status</th>
                    <th>Last Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(user => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 600, color: 'var(--admin-navy)' }}>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="admin-badge admin-badge-info">{user.role}</span>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-active">{user.status}</span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>{user.lastLogin}</td>
                      <td>
                        <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}>
                          Edit Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Security */}
        {activeTab === 'security' && (
          <div className="admin-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--admin-blue)" /> Enterprise Security & Session Governance
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Admin Inactivity Session Timeout</label>
                <select className="admin-form-select" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)}>
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">60 Minutes</option>
                  <option value="120">2 Hours</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Static CIDR IP Allowlist (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 106.51.72.0/24, 49.207.210.15"
                  className="admin-form-input"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)' }}>Leave blank to allow all authenticated admin IPs.</span>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--admin-bg)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--admin-navy)', display: 'block' }}>Mandatory Multi-Factor Authentication (MFA / 2FA)</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Require TOTP authenticator token on every admin portal sign-in attempt.</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorRequired}
                onChange={(e) => setTwoFactorRequired(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--admin-blue)' }}
              />
            </div>
          </div>
        )}

        {/* Tab 5: Integrations */}
        {activeTab === 'integrations' && (
          <div className="admin-card" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', color: 'var(--admin-navy)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={20} color="var(--admin-blue)" /> External Webhooks & Communication Gateways
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Slack Incident Notification Webhook</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">SMS Provider & OTP Gateway</label>
                <input
                  type="text"
                  className="admin-form-input"
                  value={smsGateway}
                  onChange={(e) => setSmsGateway(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <Save size={16} /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
