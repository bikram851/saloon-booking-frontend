import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  Clock,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  X,
  Loader2,
} from "lucide-react";
import { request } from "../api";
import quickGroomLogo from "../assets/quick_groom.jpg";

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register' | 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    agreeTerms: true,
  });

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const nav = useNavigate();

  // Validate inputs
  function validateForm() {
    if (mode === "login") {
      if (!form.emailOrPhone.trim()) {
        setError("Please enter your email or mobile number.");
        return false;
      }
      if (!form.password) {
        setError("Please enter your password.");
        return false;
      }
    } else if (mode === "register") {
      if (!form.fullName.trim()) {
        setError("Please enter your full name.");
        return false;
      }
      if (!form.emailOrPhone.trim()) {
        setError("Please enter a valid email address.");
        return false;
      }
      if (!form.phone.trim()) {
        setError("Please enter your 10-digit mobile number.");
        return false;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return false;
      }
      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match. Please verify.");
        return false;
      }
      if (!form.agreeTerms) {
        setError("Please agree to the Terms of Service & Privacy Policy.");
        return false;
      }
    }
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const isEmail = form.emailOrPhone.includes("@");
      const payload = {
        email: isEmail ? form.emailOrPhone.trim().toLowerCase() : `${form.phone || form.emailOrPhone}@glowgrace.com`,
        password: form.password,
        fullName: form.fullName || form.emailOrPhone.split("@")[0],
        phone: form.phone || (isEmail ? "+91 98765 00000" : form.emailOrPhone),
        role: "CUSTOMER",
      };

      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const data = await request(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const userRole = (data.role || "CUSTOMER").toUpperCase();
      const token = data.token || "jwt_demo_" + Date.now();

      localStorage.setItem("gg_token", token);
      localStorage.setItem(
        "gg_user",
        JSON.stringify({
          id: data.id || "usr_" + Date.now(),
          name: data.name || data.fullName || form.fullName || "Valued Guest",
          fullName: data.fullName || data.name || form.fullName || "Valued Guest",
          email: data.email || payload.email,
          role: userRole,
          phone: data.phone || payload.phone,
        })
      );

      if (rememberMe) {
        localStorage.setItem("gg_remember_login", form.emailOrPhone);
      } else {
        localStorage.removeItem("gg_remember_login");
      }

      window.dispatchEvent(new Event("gg-auth-changed"));

      setSuccessMsg(mode === "login" ? "Signed in successfully! Redirecting..." : "Account created successfully! Welcome to Glow & Grace.");
      setTimeout(() => {
        nav("/my-appointments");
      }, 700);
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleSignIn() {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const demoCustomer = {
        id: "usr_google_demo",
        name: "Pooja Hegde",
        fullName: "Pooja Hegde",
        email: "pooja.hegde@gmail.com",
        role: "CUSTOMER",
        phone: "+91 98765 43210",
      };
      localStorage.setItem("gg_token", "jwt_google_demo_" + Date.now());
      localStorage.setItem("gg_user", JSON.stringify(demoCustomer));
      window.dispatchEvent(new Event("gg-auth-changed"));
      setSuccessMsg("Signed in with Google! Welcome back.");
      setTimeout(() => {
        nav("/my-appointments");
      }, 700);
    }, 800);
  }

  function handleForgotPasswordSubmit(e) {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setError("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setForgotSubmitted(true);
    }, 700);
  }

  return (
    <main className="customer-auth-page">
      <div className="customer-auth-container">
        {/* Desktop Left Column: Brand Hero & Social Proof */}
        <aside className="auth-brand-showcase">
          <div className="brand-showcase-overlay" />
          <div className="brand-showcase-content">
            <div className="brand-badge-pill">
              <Sparkles size={14} className="sparkle-gold" />
              <span>Glow & Grace Luxury Experience</span>
            </div>

            <h1 className="brand-showcase-title">
              Discover Your Beauty. <br />
              <em>Define Your Style.</em>
            </h1>

            <p className="brand-showcase-desc">
              Access handpicked luxury salons, world-class stylists, real-time booking, and bespoke grooming rituals tailored for you.
            </p>

            <div className="brand-perks-list">
              <div className="brand-perk-item">
                <div className="perk-icon-circle">
                  <Star size={16} />
                </div>
                <div>
                  <strong>4.9★ Curated Salons</strong>
                  <small>Only top-rated, hygiene-verified salons</small>
                </div>
              </div>

              <div className="brand-perk-item">
                <div className="perk-icon-circle">
                  <Clock size={16} />
                </div>
                <div>
                  <strong>Zero Wait Time Booking</strong>
                  <small>Guaranteed slot timing with live station tracking</small>
                </div>
              </div>

              <div className="brand-perk-item">
                <div className="perk-icon-circle">
                  <Users size={16} />
                </div>
                <div>
                  <strong>50,000+ Happy Guests</strong>
                  <small>Trusted by patrons across Bangalore & beyond</small>
                </div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="brand-testimonial-chip">
              <div className="chip-stars">★★★★★</div>
              <p className="chip-text">
                "Booking my weekly grooming through Glow & Grace is effortlessly smooth. Zero wait, exceptional stylists."
              </p>
              <span className="chip-author">— Rohit Malhotra, Verified Patron</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Sign In / Register / Forgot Password Card */}
        <section className="auth-form-column">
          <div className="auth-form-card">
            {/* Header / Logo */}
            <div className="auth-card-top">
              <div className="auth-logo-badge">
                <img src={quickGroomLogo} alt="Glow & Grace" />
              </div>
              <div className="auth-brand-heading">
                <span className="auth-eyebrow">GLOW & GRACE GUEST PORTAL</span>
                <h2 className="auth-title">
                  {mode === "login"
                    ? "Welcome back"
                    : mode === "register"
                    ? "Create your account"
                    : "Reset your password"}
                </h2>
                <p className="auth-subtitle">
                  {mode === "login"
                    ? "Sign in to manage your appointments, exclusive offers, and beauty wishlist."
                    : mode === "register"
                    ? "Join Glow & Grace for seamless salon bookings and curated member privileges."
                    : "Enter your registered email and we'll send you a secure password reset link."}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs (Login vs Register) */}
            {mode !== "forgot" && (
              <div className="auth-mode-tabs" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "login"}
                  className={`auth-mode-tab ${mode === "login" ? "active" : ""}`}
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccessMsg("");
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "register"}
                  className={`auth-mode-tab ${mode === "register" ? "active" : ""}`}
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setSuccessMsg("");
                  }}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Error & Success Feedback Banners */}
            {error && (
              <div className="auth-alert error" role="alert">
                <AlertCircle size={16} className="alert-icon" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="auth-alert success" role="alert">
                <CheckCircle2 size={16} className="alert-icon" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* A. LOGIN FORM */}
            {mode === "login" && (
              <form className="auth-main-form" onSubmit={handleSubmit} noValidate>
                <div className="auth-field-group">
                  <label htmlFor="login-email">
                    Email or Mobile Number
                    <span className="req-star">*</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="input-prefix-icon" />
                    <input
                      id="login-email"
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="e.g. rohit@gmail.com or 9876543210"
                      value={form.emailOrPhone}
                      onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="auth-field-group">
                  <div className="label-row-between">
                    <label htmlFor="login-password">
                      Password
                      <span className="req-star">*</span>
                    </label>
                    <button
                      type="button"
                      className="inline-forgot-btn"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                        setSuccessMsg("");
                        setForgotSubmitted(false);
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="input-prefix-icon" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="auth-options-row">
                  <label className="remember-checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember my device</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="spin-loader" /> Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {/* Social Login Separator */}
                <div className="auth-divider">
                  <span>OR CONTINUE WITH</span>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  className="google-signin-btn"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <p className="auth-card-footer">
                  First time here?{" "}
                  <button
                    type="button"
                    className="inline-link-btn"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                  >
                    Create a free account
                  </button>
                </p>
              </form>
            )}

            {/* B. REGISTRATION FORM */}
            {mode === "register" && (
              <form className="auth-main-form" onSubmit={handleSubmit} noValidate>
                <div className="auth-field-group">
                  <label htmlFor="reg-name">
                    Full Name
                    <span className="req-star">*</span>
                  </label>
                  <div className="auth-input-wrapper">
                    <UserIcon size={16} className="input-prefix-icon" />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="auth-field-row">
                  <div className="auth-field-group">
                    <label htmlFor="reg-email">
                      Email Address
                      <span className="req-star">*</span>
                    </label>
                    <div className="auth-input-wrapper">
                      <Mail size={16} className="input-prefix-icon" />
                      <input
                        id="reg-email"
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={form.emailOrPhone}
                        onChange={(e) => setForm({ ...form, emailOrPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="reg-phone">
                      Mobile Number
                      <span className="req-star">*</span>
                    </label>
                    <div className="auth-input-wrapper">
                      <Phone size={16} className="input-prefix-icon" />
                      <input
                        id="reg-phone"
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="auth-field-row">
                  <div className="auth-field-group">
                    <label htmlFor="reg-password">
                      Create Password
                      <span className="req-star">*</span>
                    </label>
                    <div className="auth-input-wrapper">
                      <Lock size={16} className="input-prefix-icon" />
                      <input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Min. 6 characters"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="auth-field-group">
                    <label htmlFor="reg-confirm">
                      Confirm Password
                      <span className="req-star">*</span>
                    </label>
                    <div className="auth-input-wrapper">
                      <Lock size={16} className="input-prefix-icon" />
                      <input
                        id="reg-confirm"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Re-enter password"
                        value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <label className="terms-checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => setForm({ ...form, agreeTerms: e.target.checked })}
                  />
                  <span>
                    I agree to the{" "}
                    <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>{" "}
                    and{" "}
                    <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
                  </span>
                </label>

                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="spin-loader" /> Creating Account...
                    </>
                  ) : (
                    <>
                      Create Free Account <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="auth-card-footer">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="inline-link-btn"
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                  >
                    Sign In
                  </button>
                </p>
              </form>
            )}

            {/* C. FORGOT PASSWORD FORM */}
            {mode === "forgot" && (
              <div className="forgot-password-panel">
                {forgotSubmitted ? (
                  <div className="forgot-success-box">
                    <CheckCircle2 size={42} className="success-icon" />
                    <h3>Password Reset Email Sent!</h3>
                    <p>
                      We've dispatched secure reset instructions to <strong>{forgotEmail}</strong>.
                      Please check your inbox and click the reset link to choose a new password.
                    </p>
                    <button
                      type="button"
                      className="auth-submit-btn"
                      onClick={() => {
                        setMode("login");
                        setForgotSubmitted(false);
                        setForgotEmail("");
                      }}
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form className="auth-main-form" onSubmit={handleForgotPasswordSubmit}>
                    <div className="auth-field-group">
                      <label htmlFor="forgot-input">
                        Registered Email Address
                        <span className="req-star">*</span>
                      </label>
                      <div className="auth-input-wrapper">
                        <Mail size={16} className="input-prefix-icon" />
                        <input
                          id="forgot-input"
                          type="email"
                          required
                          placeholder="you@domain.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="auth-submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="spin-loader" /> Sending link...
                        </>
                      ) : (
                        <>
                          Send Reset Link <ArrowRight size={16} />
                        </>
                      )}
                    </button>

                    <p className="auth-card-footer">
                      Remembered your password?{" "}
                      <button
                        type="button"
                        className="inline-link-btn"
                        onClick={() => {
                          setMode("login");
                          setError("");
                        }}
                      >
                        Back to Sign In
                      </button>
                    </p>
                  </form>
                )}
              </div>
            )}

            {/* Enterprise Admin Portal Route Link */}
            <div className="auth-admin-access-box">
              <ShieldCheck size={14} className="admin-access-icon" />
              <span>Are you a salon administrator or owner?</span>
              <Link to="/admin/login" className="admin-access-link">
                Go to Enterprise Admin Portal →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
