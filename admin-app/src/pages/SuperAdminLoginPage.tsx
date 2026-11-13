import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Store,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const SuperAdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@glowgrace.com');
  const [password, setPassword] = useState('Admin@GlowGrace2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const { login, resetPassword, loginAsDemoSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await login(email, password);
      setSuccess('Super Admin authenticated! Initializing secure console...');
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify Super Admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAsDemoSuperAdmin();
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    try {
      await resetPassword(forgotEmail.trim());
      setForgotSuccess(true);
    } catch {
      setForgotSuccess(true);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #061B33 0%, #092B52 60%, #0B3A6F 100%)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        padding: '2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--admin-blue), var(--admin-cyan))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#FFFFFF',
            boxShadow: '0 6px 16px rgba(8, 121, 232, 0.35)'
          }}>
            <ShieldCheck size={28} />
          </div>

          <span style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--admin-orange)',
            background: 'rgba(255, 138, 53, 0.12)',
            padding: '3px 10px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 138, 53, 0.25)',
            display: 'inline-block',
            marginBottom: '6px'
          }}>
            PLATFORM SUPER ADMIN
          </span>

          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--admin-navy)',
            margin: '4px 0 6px',
            fontFamily: 'var(--admin-font-heading)'
          }}>
            Glow & Grace Super Admin
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--admin-secondary)', margin: 0 }}>
            Enterprise Governance, Auditing & Cloud Infrastructure Console
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: '#D1FAE5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="sa-form-group">
            <label className="sa-form-label">Super Administrator Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                required
                className="sa-form-input"
                style={{ width: '100%', paddingLeft: '38px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@glowgrace.com"
              />
            </div>
          </div>

          <div className="sa-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="sa-form-label" style={{ margin: 0 }}>Security Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotModalOpen(true);
                }}
                style={{ background: 'none', border: 'none', color: 'var(--admin-blue)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="sa-form-input"
                style={{ width: '100%', paddingLeft: '38px', paddingRight: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--admin-text)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: 'var(--admin-blue)', width: '16px', height: '16px' }}
              />
              <span>Remember administrator device</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sa-btn sa-btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.95rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Verifying Access Rights...</span>
              </>
            ) : (
              <>
                <span>Sign In to Super Admin Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* 1-Click Demo Super Admin Button */}
          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleDemoLogin}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                background: 'var(--admin-bg)',
                border: '1px dashed var(--admin-blue)',
                borderRadius: '8px',
                color: 'var(--admin-blue)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <KeyRound size={15} />
              <span>One-Click Demo Super Admin (Vikramaditya Rao)</span>
            </button>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="sa-modal-overlay" onClick={() => setForgotModalOpen(false)}>
          <div className="sa-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--admin-navy)' }}>
              Reset Super Admin Password
            </h3>
            <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--admin-secondary)' }}>
              Enter your registered administrator email address to receive Firebase password reset instructions.
            </p>

            {forgotSuccess ? (
              <div style={{ background: '#D1FAE5', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <CheckCircle2 size={36} color="#10B981" style={{ margin: '0 auto 8px' }} />
                <strong style={{ color: '#065F46', display: 'block' }}>Reset Email Dispatched!</strong>
                <p style={{ fontSize: '0.82rem', color: '#047857', margin: '4px 0 1rem' }}>
                  Please check your inbox at <strong>{forgotEmail}</strong> and follow the link.
                </p>
                <button
                  type="button"
                  onClick={() => { setForgotModalOpen(false); setForgotSuccess(false); }}
                  className="sa-btn sa-btn-primary sa-btn-sm"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit}>
                <div className="sa-form-group">
                  <label className="sa-form-label">Administrator Email</label>
                  <input
                    type="email"
                    required
                    className="sa-form-input"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1.25rem' }}>
                  <button type="button" onClick={() => setForgotModalOpen(false)} className="sa-btn sa-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="sa-btn sa-btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
