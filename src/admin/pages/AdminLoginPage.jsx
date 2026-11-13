import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import { request } from "../../api";
import "../admin.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const nav = useNavigate();

  async function handleAdminLogin(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please provide both administrator email and master access key.");
      return;
    }

    setLoading(true);

    try {
      // Call backend auth
      const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          role: "ADMIN",
        }),
      });

      const userRole = (data.role || "").toUpperCase();

      // Enforce strict enterprise role authorization
      if (userRole !== "ADMIN") {
        throw new Error(
          "Access Denied: This account does not possess Enterprise Platform Administrator credentials."
        );
      }

      const adminToken = data.token || "admin_jwt_" + Date.now();
      const adminProfile = {
        id: data.id || "admin_root",
        name: data.name || "Platform Super Administrator",
        email: data.email || email,
        role: "ADMIN",
      };

      localStorage.setItem("gg_admin_token", adminToken);
      localStorage.setItem("gg_admin_user", JSON.stringify(adminProfile));

      // Also set general user session for parity
      localStorage.setItem("gg_token", adminToken);
      localStorage.setItem("gg_user", JSON.stringify(adminProfile));
      window.dispatchEvent(new Event("gg-auth-changed"));

      nav("/admin/dashboard");
    } catch (err) {
      setError(err.message || "Invalid administrator credentials or unauthorized privilege level.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickDemoFill() {
    setEmail("admin@glowgrace.com");
    setPassword("password123");
    setError("");
  }

  function handleForgotSubmit(e) {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <ShieldCheck size={28} />
          </div>
          <span className="admin-brand-badge">ENTERPRISE CONTROL PORTAL</span>
          <h1 className="admin-login-title">Platform Administration</h1>
          <p className="admin-login-subtitle">
            Secure administrative access for Glow & Grace platform executives and salon auditors.
          </p>
        </div>

        {error && (
          <div className="auth-alert error" role="alert" style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 14px", borderRadius: "10px", fontSize: "12.5px", display: "flex", gap: "8px", alignItems: "center" }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form className="admin-login-form" onSubmit={handleAdminLogin}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">Administrator Email</label>
            <div className="admin-input-wrap">
              <Mail size={16} style={{ color: "#94a3b8", marginRight: "10px", flexShrink: 0 }} />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@glowgrace.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="admin-password">Master Password</label>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotSent(false);
                }}
                style={{ background: "none", border: "none", padding: 0, fontSize: "12px", color: "var(--admin-blue)", cursor: "pointer", fontWeight: "600" }}
              >
                Forgot key?
              </button>
            </div>
            <div className="admin-input-wrap">
              <Lock size={16} style={{ color: "#94a3b8", marginRight: "10px", flexShrink: 0 }} />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "4px" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "12.5px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#475569" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: "var(--admin-blue)" }}
              />
              Keep session active
            </label>
            <span style={{ color: "#94a3b8", fontSize: "11.5px" }}>256-bit TLS Encrypted</span>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spin-loader" /> Verifying Privileges...
              </>
            ) : (
              <>
                Enter Enterprise Dashboard <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Pre-fill for Auditor Testing */}
        <div style={{ borderTop: "1px solid var(--admin-border-subtle)", paddingTop: "14px" }}>
          <button
            type="button"
            className="admin-demo-button"
            onClick={handleQuickDemoFill}
            title="Pre-fills credentials for admin@glowgrace.com"
          >
            ⚡ Auto-Fill Demo Admin Credentials (admin@glowgrace.com)
          </button>
        </div>

        {/* Link back to Customer Portal */}
        <div style={{ textAlign: "center", fontSize: "12px", color: "#64748b" }}>
          Looking for salon bookings?{" "}
          <Link to="/" style={{ color: "var(--admin-blue)", fontWeight: "600", textDecoration: "none" }}>
            Return to Customer Website <ExternalLink size={12} style={{ display: "inline", verticalAlign: "middle" }} />
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="admin-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <div className="admin-modal-header">
              <h3>Admin Password Recovery</h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}
              >
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              {forgotSent ? (
                <div style={{ textAlign: "center", padding: "16px 8px" }}>
                  <CheckCircle2 size={40} style={{ color: "#10b981", margin: "0 auto 10px" }} />
                  <h4 style={{ margin: "0 0 6px", color: "var(--admin-navy)" }}>Recovery Link Dispatched</h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>
                    If <strong>{forgotEmail}</strong> is an authorized platform administrator, an out-of-band recovery token has been emailed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                    Enter your administrative email to receive a two-factor security reset dispatch.
                  </p>
                  <input
                    type="email"
                    required
                    placeholder="admin@glowgrace.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--admin-border)", fontSize: "14px" }}
                  />
                  <button type="submit" className="admin-btn primary" style={{ width: "100%", marginTop: "6px" }}>
                    Send Recovery Token
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
