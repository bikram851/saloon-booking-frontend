import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Save,
  CheckCircle2,
  LogOut,
  Shield,
  Store
} from 'lucide-react';

export default function ProSettingsPage() {
  const { salon } = useOutletContext();
  const navigate = useNavigate();

  const [proName, setProName] = useState('Alex Rivera');
  const [proEmail, setProEmail] = useState('pro@glowgrace.com');
  const [proPhone, setProPhone] = useState('+91 98765 00001');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [newBookingPush, setNewBookingPush] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      name: proName,
      email: proEmail,
      phone: proPhone,
      role: 'PROFESSIONAL',
      salonId: salon.id,
      salonName: salon.name
    };
    localStorage.setItem('gg_pro_user', JSON.stringify(updated));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please verify.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('gg_pro_user');
    const u = localStorage.getItem('gg_user');
    if (u) {
      try {
        const parsed = JSON.parse(u);
        if (parsed.role === 'PROFESSIONAL' || parsed.role === 'BARBER') {
          localStorage.removeItem('gg_user');
          localStorage.removeItem('gg_token');
          window.dispatchEvent(new Event('gg-auth-changed'));
        }
      } catch {}
    }
    navigate('/login');
  };

  return (
    <div>
      <div className="pro-page-header">
        <div>
          <h1 className="pro-page-title">Professional Account Settings</h1>
          <p className="pro-page-subtitle">
            Manage your personal login credentials, staff profile, notification preferences and security settings.
          </p>
        </div>
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
          Profile updated successfully!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Personal Details Form */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--pro-blue)" />
              Personal Professional Coordinates
            </h3>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="pro-form-group">
              <label className="pro-form-label">Full Name</label>
              <input
                type="text"
                required
                className="pro-form-input"
                value={proName}
                onChange={(e) => setProName(e.target.value)}
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">Registered Professional Email</label>
              <input
                type="email"
                required
                className="pro-form-input"
                value={proEmail}
                onChange={(e) => setProEmail(e.target.value)}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--pro-text-muted)' }}>
                This is your login identifier for the Professional Portal.
              </span>
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">Contact Mobile Number</label>
              <input
                type="text"
                required
                className="pro-form-input"
                value={proPhone}
                onChange={(e) => setProPhone(e.target.value)}
              />
            </div>

            <div style={{ padding: '0.85rem', background: 'var(--pro-bg)', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Store size={18} color="var(--pro-navy)" />
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--pro-text-muted)', fontWeight: 700, display: 'block' }}>
                  Associated Salon
                </span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--pro-navy)' }}>
                  {salon.name} (Salon ID: #{salon.id})
                </strong>
              </div>
            </div>

            <button type="submit" className="pro-btn pro-btn-primary">
              <Save size={16} /> Save Profile Details
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="pro-card">
          <div className="pro-card-header">
            <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={18} color="var(--pro-orange)" />
              Change Portal Password
            </h3>
          </div>

          {passwordSuccess && (
            <div style={{
              background: '#D1FAE5',
              border: '1px solid #10B981',
              color: '#065F46',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              Password updated successfully!
            </div>
          )}

          {passwordError && (
            <div style={{
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="pro-form-group">
              <label className="pro-form-label">Current Password</label>
              <input
                type="password"
                required
                className="pro-form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">New Password</label>
              <input
                type="password"
                required
                className="pro-form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <div className="pro-form-group">
              <label className="pro-form-label">Confirm New Password</label>
              <input
                type="password"
                required
                className="pro-form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
              />
            </div>

            <button type="submit" className="pro-btn pro-btn-secondary">
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Notification Preferences & Sign Out */}
      <div className="pro-card" style={{ marginTop: '1.5rem' }}>
        <div className="pro-card-header">
          <h3 className="pro-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--pro-blue)" />
            Real-Time Notification Preferences
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--pro-navy)', display: 'block' }}>SMS Booking Alerts</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>Receive instantaneous SMS when client confirms booking.</span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--pro-blue)' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--pro-navy)', display: 'block' }}>Email Summaries</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>Daily morning briefing of day's scheduled appointments.</span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--pro-blue)' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--pro-navy)', display: 'block' }}>Instant Push Notifications</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>In-app notification popup for new reviews and customer notes.</span>
            </div>
            <input
              type="checkbox"
              checked={newBookingPush}
              onChange={(e) => setNewBookingPush(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: 'var(--pro-blue)' }}
            />
          </label>
        </div>

        <div style={{ borderTop: '1px solid var(--pro-border)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong style={{ color: 'var(--pro-navy)', fontSize: '0.9rem', display: 'block' }}>Sign Out of Session</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--pro-text-muted)' }}>Securely end your professional management session on this device.</span>
          </div>
          <button onClick={handleLogout} className="pro-btn pro-btn-danger">
            <LogOut size={16} /> Sign Out of Professional Portal
          </button>
        </div>
      </div>
    </div>
  );
}
