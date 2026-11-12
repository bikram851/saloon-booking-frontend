import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Scissors, User } from "lucide-react";
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
      const payload = {
        ...form,
        role: selectedRole,
      };

      const data = await request("/auth/" + (mode === "login" ? "login" : "register"), {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const userRole = (data.role || selectedRole || "CUSTOMER").toUpperCase();
      localStorage.setItem("gg_token", data.token || "demo_token_" + Date.now());
      localStorage.setItem(
        "gg_user",
        JSON.stringify({
          id: data.id,
          name: data.name || data.fullName,
          fullName: data.fullName || data.name,
          email: data.email || form.email,
          role: userRole,
          phone: data.phone || form.phone,
        })
      );
      window.dispatchEvent(new Event("gg-auth-changed"));

      nav(userRole === "BARBER" ? "/dashboard" : "/my-appointments");
    } catch (e) {
      setError(e.message);
    }
  }

  function fillDemo(role) {
    setSelectedRole(role);
    setError("");
    if (role === "BARBER") {
      setForm({
        ...form,
        email: "barber@glowgrace.com",
        password: "password123",
        fullName: "Alex Rivera",
        phone: "+91 98765 00001",
      });
    } else {
      setForm({
        ...form,
        email: "customer@glowgrace.com",
        password: "password123",
        fullName: "Demo Client",
        phone: "+91 98765 00002",
      });
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <img src={quickGroomLogo} alt="Quick Groom" className="login-brand-image" />
        <span className="eyebrow">
          {selectedRole === "BARBER" ? "STAFF & STYLIST PORTAL" : "WELCOME TO QUICK GROOM"}
        </span>
        <h1>
          {mode === "login"
            ? selectedRole === "BARBER"
              ? "Barber Dashboard Login"
              : "A little time for you."
            : "Let’s get acquainted."}
        </h1>
        <p className="muted">
          {mode === "login"
            ? selectedRole === "BARBER"
              ? "Sign in to manage appointments, timings, and daily earnings."
              : "Sign in to manage your beauty appointments."
            : "Choose how you want to join Quick Groom."}
        </p>

        {/* Role Selector: Customer vs Barber */}
        <div className="role-picker" aria-label="Choose account type">
          <button
            type="button"
            className={selectedRole === "CUSTOMER" ? "role-option active" : "role-option"}
            onClick={() => {
              setSelectedRole("CUSTOMER");
              setError("");
            }}
          >
            <span className="role-title">
              <User size={16} /> Customer
            </span>
            <small>{mode === "login" ? "Book & view appointments" : "Book services"}</small>
          </button>
          <button
            type="button"
            className={selectedRole === "BARBER" ? "role-option active" : "role-option"}
            onClick={() => {
              setSelectedRole("BARBER");
              setError("");
            }}
          >
            <span className="role-title">
              <Scissors size={16} /> Barber / Staff
            </span>
            <small>{mode === "login" ? "Manage schedule & earnings" : "Offer styling services"}</small>
          </button>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="demo-credentials-bar">
          <span className="demo-credentials-label">Quick Sign-in:</span>
          <div className="demo-pills-wrap">
            <button
              type="button"
              className={selectedRole === "BARBER" ? "demo-pill-btn active" : "demo-pill-btn"}
              onClick={() => fillDemo("BARBER")}
            >
              💈 Demo Barber
            </button>
            <button
              type="button"
              className={selectedRole === "CUSTOMER" ? "demo-pill-btn active" : "demo-pill-btn"}
              onClick={() => fillDemo("CUSTOMER")}
            >
              👤 Demo Customer
            </button>
          </div>
        </div>

        <form onSubmit={submit}>
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
              placeholder={selectedRole === "BARBER" ? "barber@glowgrace.com" : "you@example.com"}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              minLength="6"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="primary full">
            {mode === "login"
              ? selectedRole === "BARBER"
                ? "Sign In as Barber"
                : "Sign in"
              : selectedRole === "BARBER"
              ? "Create Barber Account"
              : "Create account"}{" "}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "New to Quick Groom?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setError("");
              setMode(mode === "login" ? "register" : "login");
            }}
          >
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
