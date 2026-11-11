import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { request } from "../api";
import quickGroomLogo from "../assets/quick_groom.jpg";

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [selectedRole, setSelectedRole] = useState("CUSTOMER");
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");

    try {
      const payload = mode === "login"
        ? form
        : { ...form, role: selectedRole };

      const data = await request("/auth/" + (mode === "login" ? "login" : "register"), {
        method: "POST",
        body: JSON.stringify(payload),
      });

      localStorage.setItem("gg_token", data.token);
      localStorage.setItem("gg_user", JSON.stringify({ id: data.id, name: data.name, fullName: data.name, email: data.email, role: data.role, phone: data.phone }));
      window.dispatchEvent(new Event("gg-auth-changed"));

      const role = (data.role || selectedRole || "CUSTOMER").toUpperCase();
      nav(role === "BARBER" ? "/dashboard" : "/my-appointments");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <img src={quickGroomLogo} alt="Quick Groom" className="login-brand-image" />
        <span className="eyebrow">WELCOME TO QUICK GROOM</span>
        <h1>{mode === "login" ? "A little time for you." : "Let’s get acquainted."}</h1>
        <p className="muted">
          {mode === "login"
            ? "Sign in to manage your beauty appointments."
            : "Choose how you want to join Quick Groom."}
        </p>

        <form onSubmit={submit}>
          {mode === "register" && (
            <div className="role-picker" aria-label="Choose account type">
              {[
                { value: "CUSTOMER", label: "Customer", description: "Book services" },
                { value: "BARBER", label: "Barber", description: "Offer services" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={selectedRole === option.value ? "role-option active" : "role-option"}
                  onClick={() => setSelectedRole(option.value)}
                >
                  <span>{option.label}</span>
                  <small>{option.description}</small>
                </button>
              ))}
            </div>
          )}

          {mode === "register" && (
            <>
              <label>
                Full name
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Your name"
                />
              </label>
              <label>
                Phone number
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91"
                />
              </label>
            </>
          )}

          <label>
            Email address
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              minLength="8"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="primary full">
            {mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New to Quick Groom?" : "Already have an account?"}{" "}
          <button onClick={() => { setError(""); setMode(mode === "login" ? "register" : "login"); }}>
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>

        <Link to="/" className="back-link">
          ← Back to salon discovery
        </Link>
      </div>
    </main>
  );
}
